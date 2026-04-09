// Tipos para Gênero Musical
export interface GeneroMusical {
  id: string;
  nome: string;
}

// Tipos para Artista
export interface Artista {
  id: string;
  nome: string;
  generoId: string;
}

// Tipos para Disco
export interface Disco {
  id: string;
  artistaId: string;
  album: string;
  nacionalidade: string;
  premsagem: string;
  encarte: string;
  gravadora: string;
  anoLancamento: number;
  anoPremsagem: number;
  condicaoCapa: string;
  condicaoDisco: string;
  valorMercado: number;
  custoDisco: number;
  status: string;
}

// Tipos para Gênero do Disco (relacionamento)
export interface GeneroDisco {
  generoId: string;
  discoId: string;
}

// Tipos para Cliente
export interface Cliente {
  id: string;
  nome: string;
  generoSexo: 'M' | 'F' | 'Outro' | '';
  idade: number;
}

// Tipos para Endereço
export interface Endereco {
  id: string;
  logradouro: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
}

// Tipos para Cliente Endereço
export interface ClienteEndereco {
  clienteId: string;
  enderecoId: string;
}

// Tipos para Compra
export interface Compra {
  id: string;
  clienteId: string;
  dataCpmpra: string;
  fornecedor: string;
  valorTotal: number;
}

// Tipos para Item da Compra
export interface ItemCompra {
  id: string;
  compraId: string;
  discoId: string;
  precoCompra: number;
}

// Tipos para Venda
export interface Venda {
  id: string;
  clienteId: string;
  enderecoId: string;
  dataVenda: string;
  frete: number;
  valorTotal: number;
  pagamento: string;
  canalVenda: string;
  statusPedido: string;
}

// Tipos para Item da Venda
export interface ItemVenda {
  id: string;
  vendaId: string;
  discoId: string;
  precoVenda: number;
}

// Tipos para o Estado Geral
export interface AppState {
  // Generos
  generosMusical: GeneroMusical[];
  
  // Artistas
  artistas: Artista[];
  
  // Discos
  discos: Disco[];
  
  // Gênero Disco
  generosDisco: GeneroDisco[];
  
  // Clientes
  clientes: Cliente[];
  
  // Endereços
  enderecos: Endereco[];
  
  // Cliente Endereço
  clientesEnderecos: ClienteEndereco[];
  
  // Compras
  compras: Compra[];
  
  // Itens Compra
  itensCompra: ItemCompra[];
  
  // Vendas
  vendas: Venda[];
  
  // Itens Venda
  itensVenda: ItemVenda[];
  
  // Loading e Errors
  loading: boolean;
  error: string | null;
}
