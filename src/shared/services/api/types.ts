// Types generated from OpenAPI at http://localhost:8080/v3/api-docs
// Update this file when the backend changes.

export interface ArtistEntity {
  artistaId?: number;
  nomeArtista?: string;
}

export interface SalesChannelEntity {
  idCanalVenda?: number;
  nomeCanalVenda?: string;
}

export interface AddressEntity {
  enderecoId?: number;
  logradouro?: string;
  numero?: number;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface CustomerEntity {
  clienteId?: number;
  nomeCliente?: string;
  idade?: number;
  sexo?: string;
  enderecos?: AddressEntity[];
}

export interface MusicGenreEntity {
  generoMusicalId?: number;
  nomeGenero?: string;
}

// ===== Artists =====
export interface ArtistPayload {
  artistaId?: number;
  nomeArtista?: string;
}
export interface ArtistDTO {
  artistaId?: number;
  nomeArtista?: string;
}

// ===== Music Genres =====
export interface MusicGenrePayload {
  generoMusicalId?: number;
  nomeGenero?: string;
}
export interface MusicGenreDTO {
  generoMusicalId?: number;
  nomeGenero?: string;
}

// ===== Addresses =====
export interface AddressPayload {
  enderecoId?: number;
  logradouro?: string;
  numero?: number;
  cidade?: string;
  estado?: string;
  cep?: string;
}
export interface AddressDTO {
  enderecoId?: number;
  logradouro?: string;
  numero?: number;
  cidade?: string;
  estado?: string;
  cep?: string;
}

// ===== Customers =====
export interface CustomerPayload {
  clienteId?: number;
  nomeCliente?: string;
  idade?: number;
  sexo?: string;
  enderecos?: AddressPayload[];
}
export interface CustomerDTO {
  clienteId?: number;
  nomeCliente?: string;
  idade?: number;
  sexo?: string;
  enderecos?: AddressDTO[];
}

// ===== Sales Channels =====
export interface SalesChannelPayload {
  canalVendaId?: number;
  nomeCanalVenda?: string;
}
export interface SalesChannelDTO {
  canalVendaId?: number;
  nomeCanalVenda?: string;
}

// ===== Records =====
export interface RecordPayload {
  discoId?: number;
  artista?: ArtistEntity;
  album?: string;
  nacionalidade?: string;
  prensagem?: string;
  encarte?: string;
  gravadora?: string;
  anoLancamento?: number;
  anoPrensagem?: number;
  condicaoCapa?: string;
  condicaoDisco?: string;
  valorMercado?: number;
  custoDisco?: number;
  status?: string;
  generosMusicais?: MusicGenrePayload[];
}
export interface RecordDTO {
  discoId?: number;
  artista?: ArtistEntity;
  album?: string;
  nacionalidade?: string;
  prensagem?: string;
  encarte?: string;
  gravadora?: string;
  anoLancamento?: number;
  anoPrensagem?: number;
  condicaoCapa?: string;
  condicaoDisco?: string;
  valorMercado?: number;
  custoDisco?: number;
  status?: string;
  generosMusicais?: MusicGenreDTO[];
}

// ===== Purchases =====
export interface PurchaseItemPayload {
  discoId?: number;
  nomeDisco?: string;
  nomeArtista?: string;
  custoDisco?: number;
}
export interface PurchaseItemDTO {
  discoId?: number;
  nomeDisco?: string;
  nomeArtista?: string;
  custoDisco?: number;
}
export interface PurchasePayload {
  compraId?: number;
  dataCompra?: string;
  fornecedor?: string;
  valorTotal?: number;
  itens?: PurchaseItemPayload[];
}
export interface PurchaseDTO {
  compraId?: number;
  dataCompra?: string;
  fornecedor?: string;
  valorTotal?: number;
  itens?: PurchaseItemDTO[];
}

// ===== Sales =====
export interface SaleItemPayload {
  discoId?: number;
  nomeDisco?: string;
  nomeArtista?: string;
  precoVenda?: number;
}
export interface SaleItemDTO {
  discoId?: number;
  nomeDisco?: string;
  nomeArtista?: string;
  precoVenda?: number;
}
export interface SalePayload {
  vendasId?: number;
  cliente?: CustomerEntity;
  dataVenda?: string;
  endereco?: AddressEntity;
  frete?: number;
  valorTotal?: number;
  pagamento?: string;
  canalVenda?: SalesChannelEntity;
  custosAdicionais?: number;
  statusPedido?: string;
  itens?: SaleItemPayload[];
}
export interface SaleDTO {
  vendaId?: number;
  cliente?: CustomerEntity;
  dataVenda?: string;
  endereco?: AddressEntity;
  frete?: number;
  valorTotal?: number;
  pagamento?: string;
  canalVenda?: SalesChannelEntity;
  custosAdicionais?: number;
  statusPedido?: string;
  itens?: SaleItemDTO[];
}

// ===== Reports =====
export interface DetailedRevenueDTO {
  ano?: number;
  mes?: number;
  dataVenda?: string;
  formaPagamento?: string;
  nomeCanal?: string;
  estado?: string;
  nomeArtista?: string;
  nomeGenero?: string;
  receitaDisco?: number;
}
export interface RevenueSummaryDTO {
  ano?: number;
  mes?: number;
  receita?: number;
  custosAdicionais?: number;
  frete?: number;
  valorPago?: number;
  totalDespesa?: number;
  lucro?: number;
}
export interface ChannelRevenueDTO {
  ano?: number;
  mes?: number;
  nomeCanal?: string;
  receita?: number;
}
