import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { setupApiMock } from '@/test/setup/lifecycle';
import { db } from '@/test/setup/db';
import { makePurchase, makePurchaseItem } from '@/test/factories';
import { purchasesService } from '@/shared/services/api';
import { ApiError } from '@/shared/services/api/client';

setupApiMock();

runSequentialTests(async () => {
  await test('purchasesService.list retorna todas as compras', async () => {
    db.purchases.push(makePurchase({ compraId: 1 }), makePurchase({ compraId: 2, fornecedor: 'Outro' }));
    const list = await purchasesService.list();
    assert.strictEqual(list.length, 2);
    assert.strictEqual(list[1].fornecedor, 'Outro');
  });

  await test('purchasesService.list retorna itens populados', async () => {
    db.purchases.push(
      makePurchase({
        compraId: 7,
        itens: [makePurchaseItem({ id: 1 }), makePurchaseItem({ id: 2, nomeDisco: 'B' })],
      })
    );
    const list = await purchasesService.list();
    assert.strictEqual(list[0].itens?.length, 2);
    assert.strictEqual(list[0].itens?.[1].nomeDisco, 'B');
  });

  await test('purchasesService.getById retorna compra correta', async () => {
    db.purchases.push(makePurchase({ compraId: 9, fornecedor: 'Sebo Rio' }));
    const p = await purchasesService.getById(9);
    assert.strictEqual(p.fornecedor, 'Sebo Rio');
  });

  await test('purchasesService.getById 404', async () => {
    await assert.rejects(() => purchasesService.getById(999), ApiError);
  });

  await test('purchasesService.create persiste com itens', async () => {
    await purchasesService.create({
      dataCompra: '2026-02-01',
      fornecedor: 'Novo',
      valorTotal: 100,
      itens: [makePurchaseItem({ id: undefined, custoDisco: 100 })],
    });
    assert.strictEqual(db.purchases.length, 1);
    assert.strictEqual(db.purchases[0].itens?.length, 1);
    assert.strictEqual(db.purchases[0].itens?.[0].custoDisco, 100);
  });

  await test('purchasesService.update modifica compra existente', async () => {
    db.purchases.push(makePurchase({ compraId: 4, valorTotal: 50 }));
    await purchasesService.update({ ...makePurchase({ compraId: 4 }), valorTotal: 75 });
    assert.strictEqual(db.purchases[0].valorTotal, 75);
  });

  await test('purchasesService.delete remove do db', async () => {
    db.purchases.push(makePurchase({ compraId: 1 }));
    await purchasesService.delete(1);
    assert.strictEqual(db.purchases.length, 0);
  });
});