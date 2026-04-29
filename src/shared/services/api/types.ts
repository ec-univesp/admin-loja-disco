// Tipos gerados a partir do OpenAPI em http://localhost:8080/v3/api-docs
// Atualize este arquivo quando o backend mudar.

export interface ArtistaEntity {
  artistaId?: number;
  nomeArtista?: string;
}

export interface CanalVendaEntity {
  idCanalVenda?: number;
  nomeCanalVenda?: string;
}

export interface EnderecoEntity {
  enderecoId?: number;
  logradouro?: string;
  numero?: number;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface ClienteEntity {
  clienteId?: number;
  nomeCliente?: string;
  idade?: number;
  sexo?: string;
  enderecos?: EnderecoEntity[];
}

export interface GeneroMusicalEntity {
  generoMusicalId?: number;
  nomeGenero?: string;
}

// ===== Artistas =====
export interface RequestArtistaDTO {
  artistaId?: number;
  nomeArtista?: string;
}
export interface ResponseArtistaDTO {
  artistaId?: number;
  nomeArtista?: string;
}

// ===== Generos Musicais =====
export interface RequestGeneroMusicalDTO {
  generoMusicalId?: number;
  nomeGenero?: string;
}
export interface ResponseGeneroMusicalDTO {
  generoMusicalId?: number;
  nomeGenero?: string;
}

// ===== Enderecos =====
export interface RequestEnderecoDTO {
  enderecoId?: number;
  logradouro?: string;
  numero?: number;
  cidade?: string;
  estado?: string;
  cep?: string;
}
export interface ResponseEnderecoDTO {
  enderecoId?: number;
  logradouro?: string;
  numero?: number;
  cidade?: string;
  estado?: string;
  cep?: string;
}

// ===== Clientes =====
export interface RequestClienteDTO {
  clienteId?: number;
  nomeCliente?: string;
  idade?: number;
  sexo?: string;
  enderecos?: RequestEnderecoDTO[];
}
export interface ResponseClienteDTO {
  clienteId?: number;
  nomeCliente?: string;
  idade?: number;
  sexo?: string;
  enderecos?: ResponseEnderecoDTO[];
}

// ===== Canais de Venda =====
export interface RequestCanalVendaDTO {
  canalVendaId?: number;
  nomeCanalVenda?: string;
}
export interface ResponseCanalVendaDTO {
  canalVendaId?: number;
  nomeCanalVenda?: string;
}

// ===== Discos =====
export interface RequestDiscoDTO {
  discoId?: number;
  artista?: ArtistaEntity;
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
  generosMusicais?: RequestGeneroMusicalDTO[];
}
export interface ResponseDiscoDTO {
  discoId?: number;
  artista?: ArtistaEntity;
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
  generosMusicais?: ResponseGeneroMusicalDTO[];
}

// ===== Compras =====
export interface RequestItensCompraDTO {
  discoId?: number;
  nomeDisco?: string;
  nomeArtista?: string;
  custoDisco?: number;
}
export interface ResponseItensCompraDTO {
  discoId?: number;
  nomeDisco?: string;
  nomeArtista?: string;
  custoDisco?: number;
}
export interface RequestCompraDTO {
  compraId?: number;
  dataCompra?: string;
  fornecedor?: string;
  valorTotal?: number;
  itens?: RequestItensCompraDTO[];
}
export interface ResponseCompraDTO {
  compraId?: number;
  dataCompra?: string;
  fornecedor?: string;
  valorTotal?: number;
  itens?: ResponseItensCompraDTO[];
}

// ===== Vendas =====
export interface RequestItensVendaDTO {
  discoId?: number;
  nomeDisco?: string;
  nomeArtista?: string;
  precoVenda?: number;
}
export interface ResponseItensVendaDTO {
  discoId?: number;
  nomeDisco?: string;
  nomeArtista?: string;
  precoVenda?: number;
}
export interface RequestVendaDTO {
  vendasId?: number;
  cliente?: ClienteEntity;
  dataVenda?: string;
  endereco?: EnderecoEntity;
  frete?: number;
  valorTotal?: number;
  pagamento?: string;
  canalVenda?: CanalVendaEntity;
  custosAdicionais?: number;
  statusPedido?: string;
  itens?: RequestItensVendaDTO[];
}
export interface ResponseVendaDTO {
  vendaId?: number;
  cliente?: ClienteEntity;
  dataVenda?: string;
  endereco?: EnderecoEntity;
  frete?: number;
  valorTotal?: number;
  pagamento?: string;
  canalVenda?: CanalVendaEntity;
  custosAdicionais?: number;
  statusPedido?: string;
  itens?: ResponseItensVendaDTO[];
}

// ===== Relatorios =====
export interface ResponseReceitaDetalhadaDTO {
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
export interface ResponseReceitaDespesaDTO {
  ano?: number;
  mes?: number;
  receita?: number;
  custosAdicionais?: number;
  frete?: number;
  valorPago?: number;
  totalDespesa?: number;
  lucro?: number;
}
export interface ResponseReceitaCanalDTO {
  ano?: number;
  mes?: number;
  nomeCanal?: string;
  receita?: number;
}
