export interface Venda {
  id: string;
  clienteId: string;
  enderecoId: string;
  dataVenda: string;
  frete: number;
  valorTotal: number;
  pagamento: string;
  canalVendaId: string;
  custosAdicionais: number;
  statusPedido: string;
}

export interface ItemVenda {
  id: string;
  vendaId: string;
  discoId: string;
  precoVenda: number;
}