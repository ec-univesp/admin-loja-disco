import type {
  AddressDTO,
  ArtistDTO,
  CustomerDTO,
  MusicGenreDTO,
  PurchaseDTO,
  PurchaseItemDTO,
  RecordDTO,
  SaleDTO,
  SaleItemDTO,
  SalesChannelDTO,
} from '@/shared/services/api/types';

export const makeArtist = (over: Partial<ArtistDTO> = {}): ArtistDTO => ({
  artistaId: 1,
  nomeArtista: 'Stevie Wonder',
  ...over,
});

export const makeGenre = (over: Partial<MusicGenreDTO> = {}): MusicGenreDTO => ({
  generoMusicalId: 1,
  nomeGenero: 'JAZZ',
  ...over,
});

export const makeAddress = (over: Partial<AddressDTO> = {}): AddressDTO => ({
  enderecoId: 1,
  logradouro: 'Rua A',
  numero: 100,
  cidade: 'Sao Paulo',
  estado: 'SP',
  cep: '01000-000',
  ...over,
});

export const makeCustomer = (over: Partial<CustomerDTO> = {}): CustomerDTO => ({
  clienteId: 1,
  nomeCliente: 'Joao',
  idade: 30,
  sexo: 'M',
  enderecos: [],
  ...over,
});

export const makeChannel = (over: Partial<SalesChannelDTO> = {}): SalesChannelDTO => ({
  canalVendaId: 1,
  nomeCanalVenda: 'Site',
  ...over,
});

export const makeRecord = (over: Partial<RecordDTO> = {}): RecordDTO => ({
  discoId: 1,
  artista: makeArtist(),
  album: 'In Square Circle',
  nacionalidade: 'EUA',
  prensagem: 'NACIONAL',
  encarte: 'OK',
  gravadora: 'Motown',
  anoLancamento: 1985,
  anoPrensagem: 1985,
  condicaoCapa: 'NM',
  condicaoDisco: 'NM',
  valorMercado: 200,
  custoDisco: 50,
  status: 'DISPONIVEL',
  generosMusicais: [makeGenre()],
  ...over,
});

export const makeSaleItem = (over: Partial<SaleItemDTO> = {}): SaleItemDTO => ({
  id: 1,
  discoId: 1,
  nomeDisco: 'In Square Circle',
  nomeArtista: 'Stevie Wonder',
  precoVenda: 200,
  ...over,
});

export const makeSale = (over: Partial<SaleDTO> = {}): SaleDTO => ({
  vendaId: 1,
  cliente: makeCustomer(),
  dataVenda: '2026-01-15',
  endereco: makeAddress(),
  frete: 20,
  valorTotal: 220,
  pagamento: 'PIX',
  canalVenda: { idCanalVenda: 1, nomeCanalVenda: 'Site' },
  custosAdicionais: 0,
  statusPedido: 'PENDENTE',
  itens: [makeSaleItem()],
  ...over,
});

export const makePurchaseItem = (over: Partial<PurchaseItemDTO> = {}): PurchaseItemDTO => ({
  id: 1,
  discoId: 1,
  nomeDisco: 'In Square Circle',
  nomeArtista: 'Stevie Wonder',
  custoDisco: 50,
  ...over,
});

export const makePurchase = (over: Partial<PurchaseDTO> = {}): PurchaseDTO => ({
  compraId: 1,
  dataCompra: '2026-01-10',
  fornecedor: 'Sebo Central',
  valorTotal: 50,
  itens: [makePurchaseItem()],
  ...over,
});
