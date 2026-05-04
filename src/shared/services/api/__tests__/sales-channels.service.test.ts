import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { setupApiMock } from '@/test/setup/lifecycle';
import { db } from '@/test/setup/db';
import { makeChannel } from '@/test/factories';
import { salesChannelsService } from '@/shared/services/api';
import { ApiError } from '@/shared/services/api/client';

setupApiMock();

runSequentialTests(async () => {
  await test('salesChannelsService.list retorna todos', async () => {
    db.channels.push(makeChannel({ canalVendaId: 1 }), makeChannel({ canalVendaId: 2, nomeCanalVenda: 'Loja' }));
    const list = await salesChannelsService.list();
    assert.strictEqual(list.length, 2);
  });

  await test('salesChannelsService.getById retorna canal', async () => {
    db.channels.push(makeChannel({ canalVendaId: 7, nomeCanalVenda: 'WhatsApp' }));
    const c = await salesChannelsService.getById(7);
    assert.strictEqual(c.nomeCanalVenda, 'WhatsApp');
  });

  await test('salesChannelsService.getById 404', async () => {
    await assert.rejects(() => salesChannelsService.getById(999), ApiError);
  });

  await test('salesChannelsService.create persiste', async () => {
    await salesChannelsService.create({ nomeCanalVenda: 'Marketplace' });
    assert.strictEqual(db.channels.length, 1);
    assert.strictEqual(db.channels[0].nomeCanalVenda, 'Marketplace');
  });

  await test('salesChannelsService.update modifica', async () => {
    db.channels.push(makeChannel({ canalVendaId: 3, nomeCanalVenda: 'Old' }));
    await salesChannelsService.update({ canalVendaId: 3, nomeCanalVenda: 'New' });
    assert.strictEqual(db.channels[0].nomeCanalVenda, 'New');
  });

  await test('salesChannelsService.delete remove', async () => {
    db.channels.push(makeChannel({ canalVendaId: 1 }));
    await salesChannelsService.delete(1);
    assert.strictEqual(db.channels.length, 0);
  });
});