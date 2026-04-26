'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { initializeStorage } from '@/shared/services/api';

/**
 * Componente que inicializa o store e carrega todos os dados
 * Deve ser colocado no layout root
 */
export function AppStoreInitializer() {
  const fetchGenerosMusical = useAppStore((state) => state.fetchGenerosMusical);
  const fetchArtistas = useAppStore((state) => state.fetchArtistas);
  const fetchDiscos = useAppStore((state) => state.fetchDiscos);
  const fetchClientes = useAppStore((state) => state.fetchClientes);
  const fetchEnderecos = useAppStore((state) => state.fetchEnderecos);
  const fetchCompras = useAppStore((state) => state.fetchCompras);
  const fetchVendas = useAppStore((state) => state.fetchVendas);
  const fetchItensCompra = useAppStore((state) => state.fetchItensCompra);
  const fetchItensVenda = useAppStore((state) => state.fetchItensVenda);

  useEffect(() => {
    // Inicializar localStorage com dados de exemplo
    initializeStorage();

    // Carregar todos os dados
    const loadData = async () => {
      await Promise.all([
        fetchGenerosMusical(),
        fetchArtistas(),
        fetchDiscos(),
        fetchClientes(),
        fetchEnderecos(),
        fetchCompras(),
        fetchVendas(),
        fetchItensCompra(),
        fetchItensVenda(),
      ]);
    };

    loadData();
  }, [
    fetchGenerosMusical,
    fetchArtistas,
    fetchDiscos,
    fetchClientes,
    fetchEnderecos,
    fetchCompras,
    fetchVendas,
    fetchItensCompra,
    fetchItensVenda,
  ]);

  return null;
}
