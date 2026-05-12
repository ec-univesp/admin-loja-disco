import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import {
  addressSchema,
  artistSchema,
  channelRevenueSchema,
  customerSchema,
  detailedRevenueSchema,
  musicGenreSchema,
  orderStatusSchema,
  profitPerItemSchema,
  purchaseSchema,
  recordSchema,
  recordSearchParamsSchema,
  recordStatusSchema,
  revenueSummarySchema,
  saleResponseSchema,
  salesChannelSchema,
} from '@/shared/services/api/schemas';

runSequentialTests(async () => {
  await test('recordStatusSchema aceita só DISPONIVEL e VENDIDO', () => {
    assert.ok(recordStatusSchema.safeParse('DISPONIVEL').success);
    assert.ok(recordStatusSchema.safeParse('VENDIDO').success);
    assert.strictEqual(recordStatusSchema.safeParse('OUTRO').success, false);
  });

  await test('orderStatusSchema aceita os 5 status', () => {
    for (const s of ['PENDENTE', 'CONFIRMADA', 'ENVIADA', 'ENTREGUE', 'CANCELADA']) {
      assert.ok(orderStatusSchema.safeParse(s).success, s);
    }
    assert.strictEqual(orderStatusSchema.safeParse('OUTRO').success, false);
  });

  await test('artistSchema aceita partial e completo', () => {
    assert.ok(artistSchema.safeParse({}).success);
    assert.ok(artistSchema.safeParse({ artistaId: 1, nomeArtista: 'X' }).success);
  });

  await test('musicGenreSchema valida campos opcionais', () => {
    assert.ok(musicGenreSchema.safeParse({}).success);
    assert.ok(musicGenreSchema.safeParse({ generoMusicalId: 5, nomeGenero: 'MPB' }).success);
  });

  await test('salesChannelSchema aceita ambos idCanalVenda e canalVendaId (inconsistência do backend)', () => {
    assert.ok(salesChannelSchema.safeParse({ idCanalVenda: 1, nomeCanalVenda: 'Site' }).success);
    assert.ok(salesChannelSchema.safeParse({ canalVendaId: 1, nomeCanalVenda: 'Site' }).success);
  });

  await test('addressSchema valida payload completo', () => {
    assert.ok(
      addressSchema.safeParse({
        enderecoId: 1,
        logradouro: 'Rua',
        numero: 100,
        cidade: 'SP',
        estado: 'SP',
        cep: '01000-000',
      }).success
    );
  });

  await test('customerSchema permite enderecos como array', () => {
    assert.ok(
      customerSchema.safeParse({
        clienteId: 1,
        nomeCliente: 'X',
        enderecos: [{ logradouro: 'Rua', cidade: 'SP' }],
      }).success
    );
  });

  await test('recordSchema aceita generosMusicais array vazio', () => {
    assert.ok(
      recordSchema.safeParse({ discoId: 1, album: 'X', generosMusicais: [] }).success
    );
  });

  await test('saleResponseSchema aceita itens populados', () => {
    assert.ok(
      saleResponseSchema.safeParse({
        vendaId: 1,
        itens: [{ id: 1, discoId: 2, precoVenda: 100 }],
      }).success
    );
  });

  await test('purchaseSchema valida itens', () => {
    assert.ok(
      purchaseSchema.safeParse({
        compraId: 1,
        valorTotal: 100,
        itens: [{ discoId: 1, custoDisco: 50 }],
      }).success
    );
  });

  await test('detailedRevenueSchema aceita campos opcionais', () => {
    assert.ok(detailedRevenueSchema.safeParse({}).success);
    assert.ok(
      detailedRevenueSchema.safeParse({
        ano: 2026,
        mes: 5,
        nomeArtista: 'X',
        receitaDisco: 100,
      }).success
    );
  });

  await test('revenueSummarySchema aceita campos opcionais', () => {
    assert.ok(
      revenueSummarySchema.safeParse({ ano: 2026, mes: 5, receita: 100, lucro: 50 }).success
    );
  });

  await test('channelRevenueSchema aceita payload mínimo', () => {
    assert.ok(channelRevenueSchema.safeParse({}).success);
    assert.ok(
      channelRevenueSchema.safeParse({ ano: 2026, mes: 5, nomeCanal: 'Site', receita: 1000 }).success
    );
  });

  await test('profitPerItemSchema valida payload completo', () => {
    assert.ok(
      profitPerItemSchema.safeParse({
        vendaId: 1,
        ano: 2026,
        mes: 5,
        precoVenda: 100,
        custoDisco: 30,
        lucro: 70,
      }).success
    );
  });

  await test('recordSearchParamsSchema exige termo com pelo menos 1 caractere', () => {
    assert.ok(recordSearchParamsSchema.safeParse({ termo: 'x' }).success);
    assert.strictEqual(recordSearchParamsSchema.safeParse({ termo: '' }).success, false);
  });
});
