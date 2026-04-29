import { useMemo } from 'react';
import { useAppStore } from '@/shared/store/appStore';

/**
 * Hook para usar dados de Artista
 */
export const useArtistas = () => {
  const artistas = useAppStore((state) => state.artistas);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchArtistas = useAppStore((state) => state.fetchArtistas);
  const createArtista = useAppStore((state) => state.createArtista);
  const updateArtista = useAppStore((state) => state.updateArtista);
  const deleteArtista = useAppStore((state) => state.deleteArtista);

  return {
    artistas,
    loading,
    error,
    fetchArtistas,
    createArtista,
    updateArtista,
    deleteArtista,
  };
};

/**
 * Hook para usar dados de Disco
 */
export const useDiscos = () => {
  const discos = useAppStore((state) => state.discos);
  const artistas = useAppStore((state) => state.artistas);
  const generosMusical = useAppStore((state) => state.generosMusical);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchDiscos = useAppStore((state) => state.fetchDiscos);
  const createDisco = useAppStore((state) => state.createDisco);
  const updateDisco = useAppStore((state) => state.updateDisco);
  const deleteDisco = useAppStore((state) => state.deleteDisco);

  // Mapeia discos com informações de artista e gênero
  const discosComArtista = useMemo(
    () =>
      discos.map((disco) => {
        const artista = artistas.find((a) => a.id === disco.artistaId);
        const genero = disco.generoId
          ? generosMusical.find((g) => g.id === disco.generoId)
          : undefined;
        return {
          ...disco,
          artistaNome: artista?.nome || 'Desconhecido',
          generoNome: genero?.nome || '',
        };
      }),
    [discos, artistas, generosMusical]
  );

  return {
    discos,
    discosComArtista,
    loading,
    error,
    fetchDiscos,
    createDisco,
    updateDisco,
    deleteDisco,
  };
};

/**
 * Hook para usar dados de Cliente
 */
export const useClientes = () => {
  const clientes = useAppStore((state) => state.clientes);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchClientes = useAppStore((state) => state.fetchClientes);
  const createCliente = useAppStore((state) => state.createCliente);
  const updateCliente = useAppStore((state) => state.updateCliente);
  const deleteCliente = useAppStore((state) => state.deleteCliente);

  return {
    clientes,
    loading,
    error,
    fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
  };
};

/**
 * Hook para usar dados de Endereço
 */
export const useEnderecos = () => {
  const enderecos = useAppStore((state) => state.enderecos);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchEnderecos = useAppStore((state) => state.fetchEnderecos);
  const createEndereco = useAppStore((state) => state.createEndereco);
  const updateEndereco = useAppStore((state) => state.updateEndereco);
  const deleteEndereco = useAppStore((state) => state.deleteEndereco);

  return {
    enderecos,
    loading,
    error,
    fetchEnderecos,
    createEndereco,
    updateEndereco,
    deleteEndereco,
  };
};

/**
 * Hook para usar relação Cliente-Endereço
 */
export const useClientesEnderecos = () => {
  const clientesEnderecos = useAppStore((state) => state.clientesEnderecos);
  const fetchClientesEnderecos = useAppStore((state) => state.fetchClientesEnderecos);
  const vincularClienteEndereco = useAppStore((state) => state.vincularClienteEndereco);
  const desvincularClienteEndereco = useAppStore((state) => state.desvincularClienteEndereco);

  return {
    clientesEnderecos,
    fetchClientesEnderecos,
    vincularClienteEndereco,
    desvincularClienteEndereco,
  };
};

/**
 * Hook para usar dados de Venda
 */
export const useVendas = () => {
  const vendas = useAppStore((state) => state.vendas);
  const clientes = useAppStore((state) => state.clientes);
  const enderecos = useAppStore((state) => state.enderecos);
  const itensVenda = useAppStore((state) => state.itensVenda);
  const discos = useAppStore((state) => state.discos);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchVendas = useAppStore((state) => state.fetchVendas);
  const createVenda = useAppStore((state) => state.createVenda);
  const updateVenda = useAppStore((state) => state.updateVenda);
  const deleteVenda = useAppStore((state) => state.deleteVenda);

  // Mapeia vendas com informações de cliente, endereço e produtos
  const vendasComDetalhes = useMemo(
    () =>
      vendas.map((venda) => {
        const cliente = clientes.find((c) => c.id === venda.clienteId);
        const endereco = enderecos.find((e) => e.id === venda.enderecoId);
        const produtos = itensVenda
          .filter((i) => i.vendaId === venda.id)
          .map((i) => discos.find((d) => d.id === i.discoId)?.album)
          .filter((album): album is string => !!album);
        const enderecoCompleto = endereco
          ? `${endereco.logradouro}, ${endereco.numero} - ${endereco.cidade}/${endereco.estado}`
          : 'Endereço não informado';
        return {
          ...venda,
          clienteNome: cliente?.nome || 'Desconhecido',
          enderecoCidade: endereco?.cidade || 'Cidade desconhecida',
          enderecoCompleto,
          produtos,
          produtosResumo:
            produtos.length === 0
              ? '—'
              : produtos.length === 1
                ? produtos[0]
                : `${produtos[0]} +${produtos.length - 1}`,
        };
      }),
    [vendas, clientes, enderecos, itensVenda, discos]
  );

  return {
    vendas,
    vendasComDetalhes,
    loading,
    error,
    fetchVendas,
    createVenda,
    updateVenda,
    deleteVenda,
  };
};

/**
 * Hook para usar dados de Itens da Venda
 */
export const useItensVenda = () => {
  const itensVenda = useAppStore((state) => state.itensVenda);
  const discos = useAppStore((state) => state.discos);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchItensVenda = useAppStore((state) => state.fetchItensVenda);
  const createItemVenda = useAppStore((state) => state.createItemVenda);
  const deleteItemVenda = useAppStore((state) => state.deleteItemVenda);

  // Mapeia itens com informações de disco e venda
  const itensVendaComDetalhes = useMemo(
    () =>
      itensVenda.map((item) => {
        const disco = discos.find((d) => d.id === item.discoId);
        return {
          ...item,
          discoAlbum: disco?.album || 'Desconhecido',
          discoValorMercado: disco?.valorMercado || 0,
        };
      }),
    [itensVenda, discos]
  );

  return {
    itensVenda,
    itensVendaComDetalhes,
    loading,
    error,
    fetchItensVenda,
    createItemVenda,
    deleteItemVenda,
  };
};

/**
 * Hook para usar dados de Compra
 */
export const useCompras = () => {
  const compras = useAppStore((state) => state.compras);
  const clientes = useAppStore((state) => state.clientes);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchCompras = useAppStore((state) => state.fetchCompras);
  const createCompra = useAppStore((state) => state.createCompra);
  const updateCompra = useAppStore((state) => state.updateCompra);
  const deleteCompra = useAppStore((state) => state.deleteCompra);

  // Mapeia compras com informações de cliente
  const comprasComDetalhes = useMemo(
    () =>
      compras.map((compra) => {
        const cliente = clientes.find((c) => c.id === compra.clienteId);
        return {
          ...compra,
          clienteNome: cliente?.nome || 'Desconhecido',
        };
      }),
    [compras, clientes]
  );

  return {
    compras,
    comprasComDetalhes,
    loading,
    error,
    fetchCompras,
    createCompra,
    updateCompra,
    deleteCompra,
  };
};

/**
 * Hook para usar dados de Itens da Compra
 */
export const useItensCompra = () => {
  const itensCompra = useAppStore((state) => state.itensCompra);
  const discos = useAppStore((state) => state.discos);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchItensCompra = useAppStore((state) => state.fetchItensCompra);
  const createItemCompra = useAppStore((state) => state.createItemCompra);
  const deleteItemCompra = useAppStore((state) => state.deleteItemCompra);

  // Mapeia itens com informações de disco
  const itensCompraComDetalhes = useMemo(
    () =>
      itensCompra.map((item) => {
        const disco = discos.find((d) => d.id === item.discoId);
        return {
          ...item,
          discoAlbum: disco?.album || 'Desconhecido',
          discoCustoDisco: disco?.custoDisco || 0,
        };
      }),
    [itensCompra, discos]
  );

  return {
    itensCompra,
    itensCompraComDetalhes,
    loading,
    error,
    fetchItensCompra,
    createItemCompra,
    deleteItemCompra,
  };
};

/**
 * Hook para usar dados de Canais de Venda
 */
export const useCanaisVenda = () => {
  const canaisVenda = useAppStore((state) => state.canaisVenda);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const fetchCanaisVenda = useAppStore((state) => state.fetchCanaisVenda);
  const createCanalVenda = useAppStore((state) => state.createCanalVenda);
  const updateCanalVenda = useAppStore((state) => state.updateCanalVenda);
  const deleteCanalVenda = useAppStore((state) => state.deleteCanalVenda);

  return {
    canaisVenda,
    loading,
    error,
    fetchCanaisVenda,
    createCanalVenda,
    updateCanalVenda,
    deleteCanalVenda,
  };
};

/**
 * Hook geral do App Store
 */
export const useAppStoreState = () => {
  return useAppStore();
};
