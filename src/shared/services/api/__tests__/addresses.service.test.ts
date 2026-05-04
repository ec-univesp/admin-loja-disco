import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { setupApiMock } from '@/test/setup/lifecycle';
import { db } from '@/test/setup/db';
import { makeAddress } from '@/test/factories';
import { addressesService } from '@/shared/services/api';
import { ApiError } from '@/shared/services/api/client';

setupApiMock();

runSequentialTests(async () => {
  await test('addressesService.list retorna todos os enderecos', async () => {
    db.addresses.push(makeAddress({ enderecoId: 1 }), makeAddress({ enderecoId: 2, cidade: 'Rio' }));
    const list = await addressesService.list();
    assert.strictEqual(list.length, 2);
    assert.strictEqual(list[1].cidade, 'Rio');
  });

  await test('addressesService.getById retorna endereco correto', async () => {
    db.addresses.push(makeAddress({ enderecoId: 9, cep: '99999-999' }));
    const a = await addressesService.getById(9);
    assert.strictEqual(a.cep, '99999-999');
  });

  await test('addressesService.getById 404', async () => {
    await assert.rejects(() => addressesService.getById(999), ApiError);
  });

  await test('addressesService.create persiste', async () => {
    await addressesService.create({ logradouro: 'Av X', numero: 10, cidade: 'POA', estado: 'RS' });
    assert.strictEqual(db.addresses.length, 1);
    assert.strictEqual(db.addresses[0].logradouro, 'Av X');
  });

  await test('addressesService.update modifica', async () => {
    db.addresses.push(makeAddress({ enderecoId: 2, cep: '11111-111' }));
    await addressesService.update({ enderecoId: 2, cep: '22222-222' });
    assert.strictEqual(db.addresses[0].cep, '22222-222');
  });

  await test('addressesService.delete remove', async () => {
    db.addresses.push(makeAddress({ enderecoId: 1 }));
    await addressesService.delete(1);
    assert.strictEqual(db.addresses.length, 0);
  });
});