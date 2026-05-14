import { test, assert } from 'poku';
import { render, screen } from '@pokujs/react/react-testing';
import { runSequentialTests } from '@/test/setup/run';
import { setupApiAndReact } from '@/test/setup/lifecycle';
import { renderWithQuery, waitFor } from '@/test/setup/react-query';
import { db } from '@/test/setup/db';
import { makeRecord, makeSale } from '@/test/factories';
import { StoreMetrics } from '@/app/_dashboard/components/StoreMetrics';

setupApiAndReact();

const renderWidget = () => render(renderWithQuery(<StoreMetrics />));

const cardValueOf = (label: string): string =>
  screen.getByText(label).parentElement?.querySelector('h4')?.textContent ?? '';

runSequentialTests(async () => {
  await test('exibe contagem de discos nao-vendidos (/discos/lista-filtrada/1)', async () => {
    db.records.push(
      makeRecord({ discoId: 1, status: 'DISPONIVEL' }),
      makeRecord({ discoId: 2, status: 'DISPONIVEL' }),
      makeRecord({ discoId: 3, status: 'VENDIDO' })
    );
    renderWidget();
    await waitFor(() => assert.strictEqual(cardValueOf('Discos em estoque'), '2'));
  });

  await test('card exclui vendidos do total (regressao 140 totais, 71 vendidos -> 69)', async () => {
    for (let i = 1; i <= 69; i += 1) {
      db.records.push(makeRecord({ discoId: i, status: 'DISPONIVEL' }));
    }
    for (let i = 70; i <= 140; i += 1) {
      db.records.push(makeRecord({ discoId: i, status: 'VENDIDO' }));
    }
    renderWidget();
    await waitFor(() => assert.strictEqual(cardValueOf('Discos em estoque'), '69'));
  });

  await test('exibe receita do mes apenas para vendas concluidas', async () => {
    const today = new Date();
    const yyyyMm = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    db.sales.push(
      makeSale({ vendaId: 1, dataVenda: `${yyyyMm}-15`, valorTotal: 100, statusPedido: 'ENTREGUE' }),
      makeSale({ vendaId: 2, dataVenda: `${yyyyMm}-16`, valorTotal: 200, statusPedido: 'CONFIRMADA' }),
      makeSale({ vendaId: 3, dataVenda: `${yyyyMm}-17`, valorTotal: 50, statusPedido: 'CANCELADA' })
    );
    renderWidget();
    await waitFor(() => assert.match(cardValueOf('Receita do mês'), /300,00/));
  });

  await test('exibe contagem de vendas do mes (todos os status do mes corrente)', async () => {
    const today = new Date();
    const yyyyMm = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    db.sales.push(
      makeSale({ vendaId: 1, dataVenda: `${yyyyMm}-15` }),
      makeSale({ vendaId: 2, dataVenda: `${yyyyMm}-16` }),
      makeSale({ vendaId: 3, dataVenda: '2020-01-01' })
    );
    renderWidget();
    await waitFor(() => assert.strictEqual(cardValueOf('Vendas no mês'), '2'));
  });

  await test('exibe zero em todos os cards quando nao ha dados', async () => {
    renderWidget();
    await waitFor(() => assert.strictEqual(cardValueOf('Clientes cadastrados'), '0'));
    assert.strictEqual(cardValueOf('Discos em estoque'), '0');
    assert.strictEqual(cardValueOf('Vendas no mês'), '0');
    assert.match(cardValueOf('Receita do mês'), /0,00/);
  });
});
