import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { http, HttpResponse } from 'msw';
import { setupApiMock } from '@/test/setup/lifecycle';
import { server } from '@/test/setup/server';
import { db } from '@/test/setup/db';
import { makeSale, makeSaleItem } from '@/test/factories';
import { salesService } from '@/shared/services/api';
import { ApiError } from '@/shared/services/api/client';

setupApiMock();

runSequentialTests(async () => {
  await test('salesService.list retorna todas as vendas', async () => {
    db.sales.push(makeSale({ vendaId: 1 }), makeSale({ vendaId: 2, pagamento: 'BOLETO' }));
    const list = await salesService.list();
    assert.strictEqual(list.length, 2);
  });

  await test('salesService.list retorna itens populados', async () => {
    db.sales.push(
      makeSale({
        vendaId: 5,
        itens: [
          makeSaleItem({ id: 1, precoVenda: 100 }),
          makeSaleItem({ id: 2, precoVenda: 200, nomeDisco: 'B' }),
        ],
      })
    );
    const list = await salesService.list();
    assert.strictEqual(list[0].itens?.length, 2);
    assert.strictEqual(list[0].itens?.[1].precoVenda, 200);
  });

  await test('salesService.getById retorna venda correta', async () => {
    db.sales.push(makeSale({ vendaId: 9, pagamento: 'CARTAO' }));
    const s = await salesService.getById(9);
    assert.strictEqual(s.pagamento, 'CARTAO');
  });

  await test('salesService.getById 404', async () => {
    await assert.rejects(() => salesService.getById(999), ApiError);
  });

  await test('salesService.create persiste nova venda', async () => {
    await salesService.create({ ...makeSale({ vendaId: undefined }) });
    assert.strictEqual(db.sales.length, 1);
    assert.ok(db.sales[0].vendaId !== undefined);
  });

  await test('salesService.update altera statusPedido', async () => {
    db.sales.push(makeSale({ vendaId: 3, statusPedido: 'PENDENTE' }));
    await salesService.update({ ...makeSale({ vendaId: 3 }), statusPedido: 'ENTREGUE' });
    assert.strictEqual(db.sales[0].statusPedido, 'ENTREGUE');
  });

  await test('salesService.delete remove venda', async () => {
    db.sales.push(makeSale({ vendaId: 1 }));
    await salesService.delete(1);
    assert.strictEqual(db.sales.length, 0);
  });

  await test('salesService.list aceita custosAdicionais e demais campos null (formato real do backend)', async () => {
    server.use(
      http.get('http://localhost:8080/vendas/lista', () =>
        HttpResponse.json([
          {
            vendaId: 1,
            cliente: { clienteId: 1, nomeCliente: 'X', idade: null, sexo: null, enderecos: null },
            dataVenda: '2026-05-01',
            endereco: null,
            frete: null,
            valorTotal: 100,
            pagamento: 'PIX',
            canalVenda: { idCanalVenda: 1, nomeCanalVenda: 'Site' },
            custosAdicionais: null,
            statusPedido: 'PENDENTE',
            itens: [{ id: 1, discoId: 2, nomeDisco: 'X', nomeArtista: 'Y', precoVenda: 100 }],
          },
        ])
      )
    );
    const list = await salesService.list();
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].custosAdicionais, undefined);
    assert.strictEqual(list[0].frete, undefined);
    assert.strictEqual(list[0].endereco, undefined);
    assert.strictEqual(list[0].itens?.[0].precoVenda, 100);
  });
});
