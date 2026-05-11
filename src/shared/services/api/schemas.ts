import { z } from 'zod';

export const recordStatusSchema = z.enum(['DISPONIVEL', 'VENDIDO']);
export const orderStatusSchema = z.enum([
  'PENDENTE',
  'CONFIRMADA',
  'ENVIADA',
  'ENTREGUE',
  'CANCELADA',
]);

export const artistSchema = z.object({
  artistaId: z.number().int().optional(),
  nomeArtista: z.string().optional(),
});

export const musicGenreSchema = z.object({
  generoMusicalId: z.number().int().optional(),
  nomeGenero: z.string().optional(),
});

export const salesChannelSchema = z.object({
  canalVendaId: z.number().int().optional(),
  idCanalVenda: z.number().int().optional(),
  nomeCanalVenda: z.string().optional(),
});

export const addressSchema = z.object({
  enderecoId: z.number().int().optional(),
  logradouro: z.string().optional(),
  numero: z.number().int().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
});

export const customerSchema = z.object({
  clienteId: z.number().int().optional(),
  nomeCliente: z.string().optional(),
  idade: z.number().int().optional(),
  sexo: z.string().optional(),
  enderecos: z.array(addressSchema).optional(),
});

export const recordSchema = z.object({
  discoId: z.number().int().optional(),
  artista: artistSchema.optional(),
  album: z.string().optional(),
  nacionalidade: z.string().optional(),
  prensagem: z.string().optional(),
  encarte: z.string().optional(),
  gravadora: z.string().optional(),
  anoLancamento: z.number().int().optional(),
  anoPrensagem: z.number().int().optional(),
  condicaoCapa: z.string().optional(),
  condicaoDisco: z.string().optional(),
  valorMercado: z.number().optional(),
  custoDisco: z.number().optional(),
  status: z.string().optional(),
  generosMusicais: z.array(musicGenreSchema).optional(),
});

export const purchaseItemSchema = z.object({
  id: z.number().int().optional(),
  discoId: z.number().int().optional(),
  nomeDisco: z.string().optional(),
  nomeArtista: z.string().optional(),
  custoDisco: z.number().optional(),
});

export const purchaseSchema = z.object({
  compraId: z.number().int().optional(),
  dataCompra: z.string().optional(),
  fornecedor: z.string().optional(),
  valorTotal: z.number().optional(),
  itens: z.array(purchaseItemSchema).optional(),
});

export const saleItemSchema = z.object({
  id: z.number().int().optional(),
  discoId: z.number().int().optional(),
  nomeDisco: z.string().optional(),
  nomeArtista: z.string().optional(),
  precoVenda: z.number().optional(),
});

export const saleResponseSchema = z.object({
  vendaId: z.number().int().optional(),
  cliente: customerSchema.optional(),
  dataVenda: z.string().optional(),
  endereco: addressSchema.optional(),
  frete: z.number().optional(),
  valorTotal: z.number().optional(),
  pagamento: z.string().optional(),
  canalVenda: salesChannelSchema.optional(),
  custosAdicionais: z.number().optional(),
  statusPedido: z.string().optional(),
  itens: z.array(saleItemSchema).optional(),
});

export const salePayloadSchema = saleResponseSchema.extend({
  vendasId: z.number().int().optional(),
});

export const detailedRevenueSchema = z.object({
  ano: z.number().int().optional(),
  mes: z.number().int().optional(),
  dataVenda: z.string().optional(),
  formaPagamento: z.string().optional(),
  nomeCanal: z.string().optional(),
  estado: z.string().optional(),
  nomeArtista: z.string().optional(),
  nomeGenero: z.string().optional(),
  receitaDisco: z.number().optional(),
  receitaGenero: z.number().optional(),
});

export const revenueSummarySchema = z.object({
  ano: z.number().int().optional(),
  mes: z.number().int().optional(),
  receita: z.number().optional(),
  custosAdicionais: z.number().optional(),
  frete: z.number().optional(),
  valorPago: z.number().optional(),
  totalDespesa: z.number().optional(),
  lucro: z.number().optional(),
});

export const channelRevenueSchema = z.object({
  ano: z.number().int().optional(),
  mes: z.number().int().optional(),
  nomeCanal: z.string().optional(),
  receita: z.number().optional(),
});

export const profitPerItemSchema = z.object({
  vendaId: z.number().int().optional(),
  dataVenda: z.string().optional(),
  ano: z.number().int().optional(),
  mes: z.number().int().optional(),
  discoId: z.number().int().optional(),
  nomeDisco: z.string().optional(),
  clienteId: z.number().int().optional(),
  nomeCliente: z.string().optional(),
  formaPagamento: z.string().optional(),
  canalVendaId: z.number().int().optional(),
  nomeCanal: z.string().optional(),
  precoVenda: z.number().optional(),
  custoDisco: z.number().optional(),
  custosAdicionais: z.number().optional(),
  freteDisco: z.number().optional(),
  totalDespesa: z.number().optional(),
  lucro: z.number().optional(),
});

export const recordSearchParamsSchema = z.object({
  termo: z.string().min(1),
});

export type RecordStatusValue = z.infer<typeof recordStatusSchema>;
export type OrderStatusValue = z.infer<typeof orderStatusSchema>;
export type ArtistDTO = z.infer<typeof artistSchema>;
export type ArtistPayload = ArtistDTO;
export type MusicGenreDTO = z.infer<typeof musicGenreSchema>;
export type MusicGenrePayload = MusicGenreDTO;
export type SalesChannelDTO = z.infer<typeof salesChannelSchema>;
export type SalesChannelPayload = SalesChannelDTO;
export type SalesChannelEntity = SalesChannelDTO;
export type ArtistEntity = ArtistDTO;
export type MusicGenreEntity = MusicGenreDTO;
export type AddressDTO = z.infer<typeof addressSchema>;
export type AddressPayload = AddressDTO;
export type AddressEntity = AddressDTO;
export type CustomerDTO = z.infer<typeof customerSchema>;
export type CustomerPayload = CustomerDTO;
export type CustomerEntity = CustomerDTO;
export type RecordDTO = z.infer<typeof recordSchema>;
export type RecordPayload = RecordDTO;
export type PurchaseItemDTO = z.infer<typeof purchaseItemSchema>;
export type PurchaseItemPayload = PurchaseItemDTO;
export type PurchaseDTO = z.infer<typeof purchaseSchema>;
export type PurchasePayload = PurchaseDTO;
export type SaleItemDTO = z.infer<typeof saleItemSchema>;
export type SaleItemPayload = SaleItemDTO;
export type SaleDTO = z.infer<typeof saleResponseSchema>;
export type SalePayload = z.infer<typeof salePayloadSchema>;
export type DetailedRevenueDTO = z.infer<typeof detailedRevenueSchema>;
export type RevenueSummaryDTO = z.infer<typeof revenueSummarySchema>;
export type ChannelRevenueDTO = z.infer<typeof channelRevenueSchema>;
export type ProfitPerItemDTO = z.infer<typeof profitPerItemSchema>;
export type RecordSearchParams = z.infer<typeof recordSearchParamsSchema>;
