// Chaves de cache do TanStack Query, organizadas por recurso.
//
// Para invalidar tudo de um recurso (ex: apos um POST/PUT/DELETE):
//   queryClient.invalidateQueries({ queryKey: chavesDeArtistas.todas })

function criarChavesDeRecurso(recurso: string) {
  return {
    todas: [recurso],
    lista: () => [recurso, 'lista'],
    porId: (id: number) => [recurso, 'detalhe', id],
  };
}

export const chavesDeArtistas = criarChavesDeRecurso('artistas');
export const chavesDeGenerosMusicais = criarChavesDeRecurso('generos-musicais');
export const chavesDeEnderecos = criarChavesDeRecurso('enderecos');
export const chavesDeClientes = criarChavesDeRecurso('clientes');
export const chavesDeCanaisVenda = criarChavesDeRecurso('canais-venda');
export const chavesDeCompras = criarChavesDeRecurso('compras');
export const chavesDeVendas = criarChavesDeRecurso('vendas');

export const chavesDeDiscos = {
  ...criarChavesDeRecurso('discos'),
  busca: (filtros: { album?: string; artistaNome?: string }) => [
    'discos',
    'busca',
    filtros,
  ],
};

export const chavesDeRelatorios = {
  todos: ['relatorios'],
  receitaDetalhada: () => ['relatorios', 'receita-detalhada'],
  receitaDespesa: () => ['relatorios', 'receita-despesa'],
  receitaCanal: () => ['relatorios', 'receita-canal'],
};
