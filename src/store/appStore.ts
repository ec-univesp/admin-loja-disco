'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  GeneroMusical,
  Artista,
  Disco,
  GeneroDisco,
  Cliente,
  Endereco,
  ClienteEndereco,
  Compra,
  ItemCompra,
  Venda,
  ItemVenda,
  CanalVenda,
  AppState,
} from '@/types/models';
import {
  apiGenerosMusical,
  apiArtistas,
  apiDiscos,
  apiClientes,
  apiEnderecos,
  apiVendas,
  apiItensVenda,
  apiCompras,
  apiItensCompra,
  apiCanaisVenda,
  apiClientesEnderecos,
} from '@/services/api';

interface AppStore extends AppState {
  // Ações para Generos Musicais
  fetchGenerosMusical: () => Promise<void>;
  createGeneroMusical: (genero: Omit<GeneroMusical, 'id'>) => Promise<void>;
  updateGeneroMusical: (id: string, updates: Partial<GeneroMusical>) => Promise<void>;
  deleteGeneroMusical: (id: string) => Promise<void>;

  // Ações para Artistas
  fetchArtistas: () => Promise<void>;
  createArtista: (artista: Omit<Artista, 'id'>) => Promise<Artista | undefined>;
  updateArtista: (id: string, updates: Partial<Artista>) => Promise<void>;
  deleteArtista: (id: string) => Promise<void>;

  // Ações para Discos
  fetchDiscos: () => Promise<void>;
  createDisco: (disco: Omit<Disco, 'id'>) => Promise<void>;
  updateDisco: (id: string, updates: Partial<Disco>) => Promise<void>;
  deleteDisco: (id: string) => Promise<void>;

  // Ações para Clientes
  fetchClientes: () => Promise<void>;
  createCliente: (cliente: Omit<Cliente, 'id'>) => Promise<Cliente | undefined>;
  updateCliente: (id: string, updates: Partial<Cliente>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;

  // Ações para Endereços
  fetchEnderecos: () => Promise<void>;
  createEndereco: (endereco: Omit<Endereco, 'id'>) => Promise<Endereco | undefined>;
  updateEndereco: (id: string, updates: Partial<Endereco>) => Promise<void>;
  deleteEndereco: (id: string) => Promise<void>;

  // Ações para Vendas
  fetchVendas: () => Promise<void>;
  createVenda: (venda: Omit<Venda, 'id'>) => Promise<Venda | undefined>;
  updateVenda: (id: string, updates: Partial<Venda>) => Promise<void>;
  deleteVenda: (id: string) => Promise<void>;

  // Ações para Itens de Venda
  fetchItensVenda: () => Promise<void>;
  createItemVenda: (itemVenda: Omit<ItemVenda, 'id'>) => Promise<void>;
  deleteItemVenda: (id: string) => Promise<void>;

  // Ações para Compras
  fetchCompras: () => Promise<void>;
  createCompra: (compra: Omit<Compra, 'id'>) => Promise<Compra | undefined>;
  updateCompra: (id: string, updates: Partial<Compra>) => Promise<void>;
  deleteCompra: (id: string) => Promise<void>;

  // Ações para Itens de Compra
  fetchItensCompra: () => Promise<void>;
  createItemCompra: (itemCompra: Omit<ItemCompra, 'id'>) => Promise<void>;
  deleteItemCompra: (id: string) => Promise<void>;

  // Ações para Cliente-Endereço (relação)
  fetchClientesEnderecos: () => Promise<void>;
  vincularClienteEndereco: (clienteId: string, enderecoId: string) => Promise<void>;
  desvincularClienteEndereco: (clienteId: string, enderecoId: string) => Promise<void>;

  // Ações para Canais de Venda
  fetchCanaisVenda: () => Promise<void>;
  createCanalVenda: (canal: Omit<CanalVenda, 'id'>) => Promise<CanalVenda | undefined>;
  updateCanalVenda: (id: string, updates: Partial<CanalVenda>) => Promise<void>;
  deleteCanalVenda: (id: string) => Promise<void>;

  // Ações gerais
  setError: (error: string | null) => void;
  clearError: () => void;
  resetState: () => void;
}

const initialState: AppState = {
  generosMusical: [],
  artistas: [],
  discos: [],
  generosDisco: [],
  clientes: [],
  enderecos: [],
  clientesEnderecos: [],
  compras: [],
  itensCompra: [],
  vendas: [],
  itensVenda: [],
  canaisVenda: [],
  loading: false,
  error: null,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // ============ GENEROS MUSICAIS ============
        fetchGenerosMusical: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiGenerosMusical.getAll();
            set({ generosMusical: data, loading: false });
          } catch (error) {
            set({
              error: 'Erro ao buscar gêneros musicais',
              loading: false,
            });
          }
        },

        createGeneroMusical: async (genero) => {
          set({ loading: true, error: null });
          try {
            const newGenero = await apiGenerosMusical.create(genero);
            set((state) => ({
              generosMusical: [...state.generosMusical, newGenero],
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao criar gênero musical',
              loading: false,
            });
          }
        },

        updateGeneroMusical: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            const updated = await apiGenerosMusical.update(id, updates);
            set((state) => ({
              generosMusical: state.generosMusical.map((g) =>
                g.id === id ? { ...g, ...updates } : g
              ),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao atualizar gênero musical',
              loading: false,
            });
          }
        },

        deleteGeneroMusical: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiGenerosMusical.delete(id);
            set((state) => ({
              generosMusical: state.generosMusical.filter((g) => g.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao deletar gênero musical',
              loading: false,
            });
          }
        },

        // ============ ARTISTAS ============
        fetchArtistas: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiArtistas.getAll();
            set({ artistas: data, loading: false });
          } catch (error) {
            set({
              error: 'Erro ao buscar artistas',
              loading: false,
            });
          }
        },

        createArtista: async (artista) => {
          set({ loading: true, error: null });
          try {
            const newArtista = await apiArtistas.create(artista);
            set((state) => ({
              artistas: [...state.artistas, newArtista],
              loading: false,
            }));
            return newArtista;
          } catch (error) {
            set({
              error: 'Erro ao criar artista',
              loading: false,
            });
          }
        },

        updateArtista: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiArtistas.update(id, updates);
            set((state) => ({
              artistas: state.artistas.map((a) =>
                a.id === id ? { ...a, ...updates } : a
              ),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao atualizar artista',
              loading: false,
            });
          }
        },

        deleteArtista: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiArtistas.delete(id);
            set((state) => ({
              artistas: state.artistas.filter((a) => a.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao deletar artista',
              loading: false,
            });
          }
        },

        // ============ DISCOS ============
        fetchDiscos: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiDiscos.getAll();
            set({ discos: data, loading: false });
          } catch (error) {
            set({
              error: 'Erro ao buscar discos',
              loading: false,
            });
          }
        },

        createDisco: async (disco) => {
          set({ loading: true, error: null });
          try {
            const newDisco = await apiDiscos.create(disco);
            set((state) => ({
              discos: [...state.discos, newDisco],
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao criar disco',
              loading: false,
            });
          }
        },

        updateDisco: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiDiscos.update(id, updates);
            set((state) => ({
              discos: state.discos.map((d) =>
                d.id === id ? { ...d, ...updates } : d
              ),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao atualizar disco',
              loading: false,
            });
          }
        },

        deleteDisco: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiDiscos.delete(id);
            set((state) => ({
              discos: state.discos.filter((d) => d.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao deletar disco',
              loading: false,
            });
          }
        },

        // ============ CLIENTES ============
        fetchClientes: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiClientes.getAll();
            set({ clientes: data, loading: false });
          } catch (error) {
            set({
              error: 'Erro ao buscar clientes',
              loading: false,
            });
          }
        },

        createCliente: async (cliente) => {
          set({ loading: true, error: null });
          try {
            const newCliente = await apiClientes.create(cliente);
            set((state) => ({
              clientes: [...state.clientes, newCliente],
              loading: false,
            }));
            return newCliente;
          } catch (error) {
            set({
              error: 'Erro ao criar cliente',
              loading: false,
            });
          }
        },

        updateCliente: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiClientes.update(id, updates);
            set((state) => ({
              clientes: state.clientes.map((c) =>
                c.id === id ? { ...c, ...updates } : c
              ),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao atualizar cliente',
              loading: false,
            });
          }
        },

        deleteCliente: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiClientes.delete(id);
            set((state) => ({
              clientes: state.clientes.filter((c) => c.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao deletar cliente',
              loading: false,
            });
          }
        },

        // ============ ENDERECOS ============
        fetchEnderecos: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiEnderecos.getAll();
            set({ enderecos: data, loading: false });
          } catch (error) {
            set({
              error: 'Erro ao buscar endereços',
              loading: false,
            });
          }
        },

        createEndereco: async (endereco) => {
          set({ loading: true, error: null });
          try {
            const newEndereco = await apiEnderecos.create(endereco);
            set((state) => ({
              enderecos: [...state.enderecos, newEndereco],
              loading: false,
            }));
            return newEndereco;
          } catch (error) {
            set({
              error: 'Erro ao criar endereço',
              loading: false,
            });
          }
        },

        updateEndereco: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiEnderecos.update(id, updates);
            set((state) => ({
              enderecos: state.enderecos.map((e) =>
                e.id === id ? { ...e, ...updates } : e
              ),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao atualizar endereço',
              loading: false,
            });
          }
        },

        deleteEndereco: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiEnderecos.delete(id);
            set((state) => ({
              enderecos: state.enderecos.filter((e) => e.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao deletar endereço',
              loading: false,
            });
          }
        },

        // ============ VENDAS ============
        fetchVendas: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiVendas.getAll();
            set({ vendas: data, loading: false });
          } catch (error) {
            set({
              error: 'Erro ao buscar vendas',
              loading: false,
            });
          }
        },

        createVenda: async (venda) => {
          set({ loading: true, error: null });
          try {
            const newVenda = await apiVendas.create(venda);
            set((state) => ({
              vendas: [...state.vendas, newVenda],
              loading: false,
            }));
            return newVenda;
          } catch (error) {
            set({
              error: 'Erro ao criar venda',
              loading: false,
            });
          }
        },

        updateVenda: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiVendas.update(id, updates);
            set((state) => ({
              vendas: state.vendas.map((v) =>
                v.id === id ? { ...v, ...updates } : v
              ),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao atualizar venda',
              loading: false,
            });
          }
        },

        deleteVenda: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiVendas.delete(id);
            set((state) => ({
              vendas: state.vendas.filter((v) => v.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao deletar venda',
              loading: false,
            });
          }
        },

        // ============ ITENS VENDA ============
        fetchItensVenda: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiItensVenda.getAll();
            set({ itensVenda: data, loading: false });
          } catch (error) {
            set({
              error: 'Erro ao buscar itens de venda',
              loading: false,
            });
          }
        },

        createItemVenda: async (itemVenda) => {
          set({ loading: true, error: null });
          try {
            const newItemVenda = await apiItensVenda.create(itemVenda);
            set((state) => ({
              itensVenda: [...state.itensVenda, newItemVenda],
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao criar item de venda',
              loading: false,
            });
          }
        },

        deleteItemVenda: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiItensVenda.delete(id);
            set((state) => ({
              itensVenda: state.itensVenda.filter((v) => v.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao deletar item de venda',
              loading: false,
            });
          }
        },

        // ============ COMPRAS ============
        fetchCompras: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiCompras.getAll();
            set({ compras: data, loading: false });
          } catch (error) {
            set({
              error: 'Erro ao buscar compras',
              loading: false,
            });
          }
        },

        createCompra: async (compra) => {
          set({ loading: true, error: null });
          try {
            const newCompra = await apiCompras.create(compra);
            set((state) => ({
              compras: [...state.compras, newCompra],
              loading: false,
            }));
            return newCompra;
          } catch (error) {
            set({
              error: 'Erro ao criar compra',
              loading: false,
            });
          }
        },

        updateCompra: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiCompras.update(id, updates);
            set((state) => ({
              compras: state.compras.map((c) =>
                c.id === id ? { ...c, ...updates } : c
              ),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao atualizar compra',
              loading: false,
            });
          }
        },

        deleteCompra: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiCompras.delete(id);
            set((state) => ({
              compras: state.compras.filter((c) => c.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao deletar compra',
              loading: false,
            });
          }
        },

        // ============ ITENS COMPRA ============
        fetchItensCompra: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiItensCompra.getAll();
            set({ itensCompra: data, loading: false });
          } catch (error) {
            set({
              error: 'Erro ao buscar itens de compra',
              loading: false,
            });
          }
        },

        createItemCompra: async (itemCompra) => {
          set({ loading: true, error: null });
          try {
            const newItemCompra = await apiItensCompra.create(itemCompra);
            set((state) => ({
              itensCompra: [...state.itensCompra, newItemCompra],
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao criar item de compra',
              loading: false,
            });
          }
        },

        deleteItemCompra: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiItensCompra.delete(id);
            set((state) => ({
              itensCompra: state.itensCompra.filter((c) => c.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: 'Erro ao deletar item de compra',
              loading: false,
            });
          }
        },

        // ============ CLIENTES ENDERECOS ============
        fetchClientesEnderecos: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiClientesEnderecos.getAll();
            set({ clientesEnderecos: data, loading: false });
          } catch (error) {
            set({ error: 'Erro ao buscar relação cliente-endereço', loading: false });
          }
        },

        vincularClienteEndereco: async (clienteId, enderecoId) => {
          try {
            await apiClientesEnderecos.create({ clienteId, enderecoId });
            set((state) => ({
              clientesEnderecos: [...state.clientesEnderecos, { clienteId, enderecoId }],
            }));
          } catch (error) {
            set({ error: 'Erro ao vincular endereço ao cliente' });
          }
        },

        desvincularClienteEndereco: async (clienteId, enderecoId) => {
          try {
            await apiClientesEnderecos.delete(clienteId, enderecoId);
            set((state) => ({
              clientesEnderecos: state.clientesEnderecos.filter(
                (vinculo) =>
                  !(vinculo.clienteId === clienteId && vinculo.enderecoId === enderecoId)
              ),
            }));
          } catch (error) {
            set({ error: 'Erro ao desvincular endereço do cliente' });
          }
        },

        // ============ CANAIS VENDA ============
        fetchCanaisVenda: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiCanaisVenda.getAll();
            set({ canaisVenda: data, loading: false });
          } catch (error) {
            set({ error: 'Erro ao buscar canais de venda', loading: false });
          }
        },

        createCanalVenda: async (canal) => {
          set({ loading: true, error: null });
          try {
            const newCanal = await apiCanaisVenda.create(canal);
            set((state) => ({
              canaisVenda: [...state.canaisVenda, newCanal],
              loading: false,
            }));
            return newCanal;
          } catch (error) {
            set({ error: 'Erro ao criar canal de venda', loading: false });
          }
        },

        updateCanalVenda: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiCanaisVenda.update(id, updates);
            set((state) => ({
              canaisVenda: state.canaisVenda.map((canal) =>
                canal.id === id ? { ...canal, ...updates } : canal
              ),
              loading: false,
            }));
          } catch (error) {
            set({ error: 'Erro ao atualizar canal de venda', loading: false });
          }
        },

        deleteCanalVenda: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiCanaisVenda.delete(id);
            set((state) => ({
              canaisVenda: state.canaisVenda.filter((canal) => canal.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({ error: 'Erro ao deletar canal de venda', loading: false });
          }
        },

        // ============ AÇÕES GERAIS ============
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        resetState: () => set(initialState),
      }),
      {
        name: 'app-storage',
        version: 2,
        migrate: (persistedState, version) => {
          if (version < 2) {
            return { ...initialState, ...(persistedState as Partial<AppStore>) };
          }
          return persistedState as AppStore;
        },
      }
    )
  )
);
