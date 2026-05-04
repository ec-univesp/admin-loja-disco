import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import { setupApiMock } from '@/test/setup/lifecycle';
import { db } from '@/test/setup/db';
import { makeAddress, makeCustomer } from '@/test/factories';
import { customersService } from '@/shared/services/api';
import { ApiError } from '@/shared/services/api/client';

setupApiMock();

runSequentialTests(async () => {
  await test('customersService.list retorna todos', async () => {
    db.customers.push(makeCustomer({ clienteId: 1 }), makeCustomer({ clienteId: 2, nomeCliente: 'Maria' }));
    const list = await customersService.list();
    assert.strictEqual(list.length, 2);
  });

  await test('customersService.getById retorna cliente com enderecos', async () => {
    db.customers.push(makeCustomer({ clienteId: 5, enderecos: [makeAddress({ enderecoId: 1, cidade: 'BH' })] }));
    const c = await customersService.getById(5);
    assert.strictEqual(c.enderecos?.[0].cidade, 'BH');
  });

  await test('customersService.getById 404', async () => {
    await assert.rejects(() => customersService.getById(999), ApiError);
  });

  await test('customersService.create persiste', async () => {
    await customersService.create({ nomeCliente: 'Pedro', idade: 25, sexo: 'M', enderecos: [] });
    assert.strictEqual(db.customers.length, 1);
    assert.strictEqual(db.customers[0].nomeCliente, 'Pedro');
  });

  await test('customersService.update modifica', async () => {
    db.customers.push(makeCustomer({ clienteId: 3, nomeCliente: 'Old', idade: 30 }));
    await customersService.update({ clienteId: 3, nomeCliente: 'New', idade: 31, sexo: 'M', enderecos: [] });
    assert.strictEqual(db.customers[0].nomeCliente, 'New');
    assert.strictEqual(db.customers[0].idade, 31);
  });

  await test('customersService.delete remove', async () => {
    db.customers.push(makeCustomer({ clienteId: 1 }));
    await customersService.delete(1);
    assert.strictEqual(db.customers.length, 0);
  });
});