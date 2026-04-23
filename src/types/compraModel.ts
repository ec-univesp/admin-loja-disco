export interface Compra {
  id: string;
  clienteId: string;
  dataCompra: string;
  fornecedor: string;
  valorTotal: number;
}

export interface ItemCompra {
  id: string;
  compraId: string;
  discoId: string;
  precoCompra: number;
}
