// Query key factories — uma fonte unica de verdade por recurso.
// Use sempre a factory ao invocar useQuery / queryClient.invalidateQueries
// para garantir invalidacoes consistentes.

export const queryKeys = {
  artistas: {
    all: ['artistas'] as const,
    lists: () => [...queryKeys.artistas.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.artistas.all, 'detail', id] as const,
  },
  generosMusicais: {
    all: ['generos-musicais'] as const,
    lists: () => [...queryKeys.generosMusicais.all, 'list'] as const,
    detail: (id: number) =>
      [...queryKeys.generosMusicais.all, 'detail', id] as const,
  },
  enderecos: {
    all: ['enderecos'] as const,
    lists: () => [...queryKeys.enderecos.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.enderecos.all, 'detail', id] as const,
  },
  clientes: {
    all: ['clientes'] as const,
    lists: () => [...queryKeys.clientes.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.clientes.all, 'detail', id] as const,
  },
  canaisVenda: {
    all: ['canais-venda'] as const,
    lists: () => [...queryKeys.canaisVenda.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.canaisVenda.all, 'detail', id] as const,
  },
  discos: {
    all: ['discos'] as const,
    lists: () => [...queryKeys.discos.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.discos.all, 'detail', id] as const,
    busca: (query: { album?: string; artistaNome?: string }) =>
      [...queryKeys.discos.all, 'busca', query] as const,
  },
  compras: {
    all: ['compras'] as const,
    lists: () => [...queryKeys.compras.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.compras.all, 'detail', id] as const,
  },
  vendas: {
    all: ['vendas'] as const,
    lists: () => [...queryKeys.vendas.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.vendas.all, 'detail', id] as const,
  },
  relatorios: {
    all: ['relatorios'] as const,
    receitaDetalhada: () =>
      [...queryKeys.relatorios.all, 'receita-detalhada'] as const,
    receitaDespesa: () =>
      [...queryKeys.relatorios.all, 'receita-despesa'] as const,
    receitaCanal: () => [...queryKeys.relatorios.all, 'receita-canal'] as const,
  },
} as const;
