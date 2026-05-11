import { z } from 'zod';
import { recordStatusSchema, orderStatusSchema } from './schemas';

const requiredString = (fieldLabel: string) =>
  z.string().trim().min(1, `${fieldLabel} é obrigatório.`);

const nonNegativeMoney = (fieldLabel: string) =>
  z.number({ message: `${fieldLabel} deve ser um número.` }).min(0, `${fieldLabel} não pode ser negativo.`);

const currentYear = new Date().getFullYear();
const yearInRange = z
  .number({ message: 'Ano deve ser um número.' })
  .int('Ano deve ser inteiro.')
  .min(1900, 'Ano mínimo é 1900.')
  .max(currentYear + 1, `Ano máximo é ${currentYear + 1}.`);

export const salesChannelFormSchema = z.object({
  nomeCanalVenda: requiredString('Nome do canal'),
});
export type SalesChannelFormInput = z.infer<typeof salesChannelFormSchema>;

export const customerAddressFormSchema = z.object({
  nomeCliente: requiredString('Nome do cliente'),
  sexo: z.enum(['M', 'F', 'O'], { message: 'Selecione o sexo.' }),
  idade: z
    .number({ message: 'Idade deve ser um número.' })
    .int()
    .min(0, 'Idade não pode ser negativa.')
    .max(150, 'Idade inválida.'),
  logradouro: requiredString('Logradouro'),
  numero: requiredString('Número'),
  cidade: requiredString('Cidade'),
  estado: z.string().trim().length(2, 'Estado deve ter 2 letras (UF).'),
  cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, 'CEP inválido (use 00000-000).'),
});
export type CustomerAddressFormInput = z.infer<typeof customerAddressFormSchema>;

export const addRecordFormSchema = z.object({
  artistaNome: requiredString('Nome do artista'),
  generosMusicaisIds: z
    .array(z.number().int())
    .min(1, 'Selecione ao menos um gênero musical.'),
  album: requiredString('Álbum'),
  nacionalidade: requiredString('Nacionalidade'),
  prensagem: requiredString('Prensagem'),
  encarte: requiredString('Encarte'),
  gravadora: requiredString('Gravadora'),
  anoLancamento: yearInRange,
  anoPrensagem: yearInRange,
  condicaoCapa: requiredString('Condição da capa'),
  condicaoDisco: requiredString('Condição do disco'),
  valorMercado: nonNegativeMoney('Valor de mercado'),
  custoDisco: nonNegativeMoney('Custo do disco'),
  status: recordStatusSchema,
});
export type AddRecordFormInput = z.infer<typeof addRecordFormSchema>;

export const editRecordFormSchema = addRecordFormSchema;
export type EditRecordFormInput = z.infer<typeof editRecordFormSchema>;

export const saleItemFormSchema = z.object({
  discoId: requiredString('Disco'),
  precoVenda: nonNegativeMoney('Preço de venda'),
});

export const saleFormSchema = z.object({
  clienteId: requiredString('Cliente'),
  enderecoId: requiredString('Endereço de entrega'),
  canalVendaId: requiredString('Canal de venda'),
  dataVenda: requiredString('Data da venda'),
  pagamento: requiredString('Forma de pagamento'),
  frete: nonNegativeMoney('Frete'),
  custosAdicionais: nonNegativeMoney('Custos adicionais'),
  statusPedido: orderStatusSchema,
  observacoes: z.string().optional(),
  itens: z.array(saleItemFormSchema).min(1, 'Adicione ao menos um item à venda.'),
});
export type SaleFormInput = z.infer<typeof saleFormSchema>;

export const purchaseItemFormSchema = z.object({
  discoId: requiredString('Disco'),
  custoDisco: nonNegativeMoney('Custo do disco'),
});

export const purchaseFormSchema = z.object({
  fornecedor: requiredString('Fornecedor'),
  dataCompra: requiredString('Data da compra'),
  itens: z.array(purchaseItemFormSchema).min(1, 'Adicione ao menos um item à compra.'),
});
export type PurchaseFormInput = z.infer<typeof purchaseFormSchema>;
