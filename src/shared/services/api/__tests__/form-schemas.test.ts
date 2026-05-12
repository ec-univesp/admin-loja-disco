import { test, assert } from 'poku';
import { runSequentialTests } from '@/test/setup/run';
import {
  addRecordFormSchema,
  customerAddressFormSchema,
  purchaseFormSchema,
  saleFormSchema,
  salesChannelFormSchema,
} from '@/shared/services/api/form-schemas';

const baseRecord = {
  artistaNome: 'Stevie Wonder',
  generosMusicaisIds: [1],
  album: 'Songs',
  nacionalidade: 'EUA',
  prensagem: 'Nacional',
  encarte: 'Ok',
  gravadora: 'Motown',
  anoLancamento: 1985,
  anoPrensagem: 1985,
  condicaoCapa: 'VG+',
  condicaoDisco: 'VG+',
  valorMercado: 100,
  custoDisco: 30,
  status: 'DISPONIVEL' as const,
};

const baseCustomer = {
  nomeCliente: 'Cliente',
  sexo: 'M' as const,
  idade: 30,
  logradouro: 'Rua',
  numero: '100',
  cidade: 'SP',
  estado: 'SP',
  cep: '01000-000',
};

const baseSale = {
  clienteId: '1',
  enderecoId: '2',
  canalVendaId: '3',
  dataVenda: '2026-05-01',
  pagamento: 'PIX',
  frete: 10,
  custosAdicionais: 0,
  statusPedido: 'PENDENTE' as const,
  itens: [{ discoId: '5', precoVenda: 100 }],
};

const basePurchase = {
  fornecedor: 'Fornecedor',
  dataCompra: '2026-05-01',
  itens: [{ discoId: '5', custoDisco: 50 }],
};

runSequentialTests(async () => {
  await test('salesChannelFormSchema valida nomeCanalVenda obrigatório', () => {
    assert.ok(salesChannelFormSchema.safeParse({ nomeCanalVenda: 'Site' }).success);
    const result = salesChannelFormSchema.safeParse({ nomeCanalVenda: '' });
    assert.strictEqual(result.success, false);
  });

  await test('customerAddressFormSchema aceita payload válido', () => {
    assert.ok(customerAddressFormSchema.safeParse(baseCustomer).success);
  });

  await test('customerAddressFormSchema rejeita CEP inválido', () => {
    const result = customerAddressFormSchema.safeParse({ ...baseCustomer, cep: '123' });
    assert.strictEqual(result.success, false);
  });

  await test('customerAddressFormSchema rejeita estado fora do tamanho 2', () => {
    const result = customerAddressFormSchema.safeParse({ ...baseCustomer, estado: 'SAO' });
    assert.strictEqual(result.success, false);
  });

  await test('customerAddressFormSchema rejeita sexo inválido', () => {
    const result = customerAddressFormSchema.safeParse({ ...baseCustomer, sexo: 'X' });
    assert.strictEqual(result.success, false);
  });

  await test('customerAddressFormSchema rejeita idade negativa e acima de 150', () => {
    assert.strictEqual(
      customerAddressFormSchema.safeParse({ ...baseCustomer, idade: -1 }).success,
      false
    );
    assert.strictEqual(
      customerAddressFormSchema.safeParse({ ...baseCustomer, idade: 200 }).success,
      false
    );
  });

  await test('addRecordFormSchema aceita payload válido', () => {
    assert.ok(addRecordFormSchema.safeParse(baseRecord).success);
  });

  await test('addRecordFormSchema exige ao menos um gênero', () => {
    const result = addRecordFormSchema.safeParse({ ...baseRecord, generosMusicaisIds: [] });
    assert.strictEqual(result.success, false);
  });

  await test('addRecordFormSchema rejeita ano fora do range', () => {
    assert.strictEqual(
      addRecordFormSchema.safeParse({ ...baseRecord, anoLancamento: 1899 }).success,
      false
    );
    assert.strictEqual(
      addRecordFormSchema.safeParse({ ...baseRecord, anoLancamento: 3000 }).success,
      false
    );
  });

  await test('addRecordFormSchema rejeita preço negativo', () => {
    assert.strictEqual(
      addRecordFormSchema.safeParse({ ...baseRecord, custoDisco: -5 }).success,
      false
    );
  });

  await test('addRecordFormSchema rejeita status fora do enum', () => {
    const result = addRecordFormSchema.safeParse({ ...baseRecord, status: 'OUTRO' });
    assert.strictEqual(result.success, false);
  });

  await test('saleFormSchema aceita payload válido', () => {
    assert.ok(saleFormSchema.safeParse(baseSale).success);
  });

  await test('saleFormSchema exige ao menos um item', () => {
    const result = saleFormSchema.safeParse({ ...baseSale, itens: [] });
    assert.strictEqual(result.success, false);
  });

  await test('saleFormSchema rejeita statusPedido inválido', () => {
    const result = saleFormSchema.safeParse({ ...baseSale, statusPedido: 'OUTRO' });
    assert.strictEqual(result.success, false);
  });

  await test('purchaseFormSchema aceita payload válido', () => {
    assert.ok(purchaseFormSchema.safeParse(basePurchase).success);
  });

  await test('purchaseFormSchema exige ao menos um item', () => {
    const result = purchaseFormSchema.safeParse({ ...basePurchase, itens: [] });
    assert.strictEqual(result.success, false);
  });

  await test('purchaseFormSchema rejeita custoDisco negativo', () => {
    const result = purchaseFormSchema.safeParse({
      ...basePurchase,
      itens: [{ discoId: '1', custoDisco: -10 }],
    });
    assert.strictEqual(result.success, false);
  });
});
