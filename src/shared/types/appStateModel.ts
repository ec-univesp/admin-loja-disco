import type { GeneroMusical } from './generoMusicalModel';
import type { Artista } from './artistaModel';
import type { Disco, GeneroDisco } from './discoModel';
import type { Cliente, Endereco, ClienteEndereco } from './clienteModel';
import type { Compra, ItemCompra } from './compraModel';
import type { Venda, ItemVenda } from './vendaModel';
import type { CanalVenda } from './canalVendaModel';

export interface AppState {
  generosMusical: GeneroMusical[];
  artistas: Artista[];
  discos: Disco[];
  generosDisco: GeneroDisco[];
  clientes: Cliente[];
  enderecos: Endereco[];
  clientesEnderecos: ClienteEndereco[];
  compras: Compra[];
  itensCompra: ItemCompra[];
  vendas: Venda[];
  itensVenda: ItemVenda[];
  canaisVenda: CanalVenda[];
  loading: boolean;
  error: string | null;
}
