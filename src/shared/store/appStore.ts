'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  MusicGenre,
  Artist,
  VinylRecord,
  Customer,
  Address,
  Purchase,
  PurchaseItem,
  Sale,
  SaleItem,
  SalesChannel,
  AppState,
} from '@/shared/types/index';
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
} from '@/shared/services/apiMock';

interface AppStore extends AppState {
  // Music Genres actions
  fetchMusicGenres: () => Promise<void>;
  createMusicGenre: (genre: Omit<MusicGenre, 'id'>) => Promise<void>;
  updateMusicGenre: (id: string, updates: Partial<MusicGenre>) => Promise<void>;
  deleteMusicGenre: (id: string) => Promise<void>;

  // Artists actions
  fetchArtists: () => Promise<void>;
  createArtist: (artist: Omit<Artist, 'id'>) => Promise<Artist | undefined>;
  updateArtist: (id: string, updates: Partial<Artist>) => Promise<void>;
  deleteArtist: (id: string) => Promise<void>;

  // Records actions
  fetchRecords: () => Promise<void>;
  createRecord: (record: Omit<VinylRecord, 'id'>) => Promise<void>;
  updateRecord: (id: string, updates: Partial<VinylRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;

  // Customers actions
  fetchCustomers: () => Promise<void>;
  createCustomer: (customer: Omit<Customer, 'id'>) => Promise<Customer | undefined>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  // Addresses actions
  fetchAddresses: () => Promise<void>;
  createAddress: (address: Omit<Address, 'id'>) => Promise<Address | undefined>;
  updateAddress: (id: string, updates: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;

  // Sales actions
  fetchSales: () => Promise<void>;
  createSale: (sale: Omit<Sale, 'id'>) => Promise<Sale | undefined>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;

  // Sale items actions
  fetchSaleItems: () => Promise<void>;
  createSaleItem: (saleItem: Omit<SaleItem, 'id'>) => Promise<void>;
  deleteSaleItem: (id: string) => Promise<void>;

  // Purchases actions
  fetchPurchases: () => Promise<void>;
  createPurchase: (purchase: Omit<Purchase, 'id'>) => Promise<Purchase | undefined>;
  updatePurchase: (id: string, updates: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;

  // Purchase items actions
  fetchPurchaseItems: () => Promise<void>;
  createPurchaseItem: (purchaseItem: Omit<PurchaseItem, 'id'>) => Promise<void>;
  deletePurchaseItem: (id: string) => Promise<void>;

  // Customer-Address relation actions
  fetchCustomerAddresses: () => Promise<void>;
  linkCustomerAddress: (customerId: string, addressId: string) => Promise<void>;
  unlinkCustomerAddress: (customerId: string, addressId: string) => Promise<void>;

  // Sales channels actions
  fetchSalesChannels: () => Promise<void>;
  createSalesChannel: (channel: Omit<SalesChannel, 'id'>) => Promise<SalesChannel | undefined>;
  updateSalesChannel: (id: string, updates: Partial<SalesChannel>) => Promise<void>;
  deleteSalesChannel: (id: string) => Promise<void>;

  // General actions
  setError: (error: string | null) => void;
  clearError: () => void;
  resetState: () => void;
}

const initialState: AppState = {
  musicGenres: [],
  artists: [],
  records: [],
  recordGenres: [],
  customers: [],
  addresses: [],
  customerAddresses: [],
  purchases: [],
  purchaseItems: [],
  sales: [],
  saleItems: [],
  salesChannels: [],
  loading: false,
  error: null,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // ============ MUSIC GENRES ============
        fetchMusicGenres: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiGenerosMusical.getAll();
            set({ musicGenres: data, loading: false });
          } catch {
            set({ error: 'Failed to load music genres', loading: false });
          }
        },

        createMusicGenre: async (genre) => {
          set({ loading: true, error: null });
          try {
            const newGenre = await apiGenerosMusical.create(genre);
            set((state) => ({
              musicGenres: [...state.musicGenres, newGenre],
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to create music genre', loading: false });
          }
        },

        updateMusicGenre: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiGenerosMusical.update(id, updates);
            set((state) => ({
              musicGenres: state.musicGenres.map((g) =>
                g.id === id ? { ...g, ...updates } : g
              ),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to update music genre', loading: false });
          }
        },

        deleteMusicGenre: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiGenerosMusical.delete(id);
            set((state) => ({
              musicGenres: state.musicGenres.filter((g) => g.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete music genre', loading: false });
          }
        },

        // ============ ARTISTS ============
        fetchArtists: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiArtistas.getAll();
            set({ artists: data, loading: false });
          } catch {
            set({ error: 'Failed to load artists', loading: false });
          }
        },

        createArtist: async (artist) => {
          set({ loading: true, error: null });
          try {
            const newArtist = await apiArtistas.create(artist);
            set((state) => ({
              artists: [...state.artists, newArtist],
              loading: false,
            }));
            return newArtist;
          } catch {
            set({ error: 'Failed to create artist', loading: false });
          }
        },

        updateArtist: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiArtistas.update(id, updates);
            set((state) => ({
              artists: state.artists.map((a) =>
                a.id === id ? { ...a, ...updates } : a
              ),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to update artist', loading: false });
          }
        },

        deleteArtist: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiArtistas.delete(id);
            set((state) => ({
              artists: state.artists.filter((a) => a.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete artist', loading: false });
          }
        },

        // ============ RECORDS ============
        fetchRecords: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiDiscos.getAll();
            set({ records: data, loading: false });
          } catch {
            set({ error: 'Failed to load records', loading: false });
          }
        },

        createRecord: async (record) => {
          set({ loading: true, error: null });
          try {
            const newRecord = await apiDiscos.create(record);
            set((state) => ({
              records: [...state.records, newRecord],
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to create record', loading: false });
          }
        },

        updateRecord: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiDiscos.update(id, updates);
            set((state) => ({
              records: state.records.map((d) =>
                d.id === id ? { ...d, ...updates } : d
              ),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to update record', loading: false });
          }
        },

        deleteRecord: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiDiscos.delete(id);
            set((state) => ({
              records: state.records.filter((d) => d.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete record', loading: false });
          }
        },

        // ============ CUSTOMERS ============
        fetchCustomers: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiClientes.getAll();
            set({ customers: data, loading: false });
          } catch {
            set({ error: 'Failed to load customers', loading: false });
          }
        },

        createCustomer: async (customer) => {
          set({ loading: true, error: null });
          try {
            const newCustomer = await apiClientes.create(customer);
            set((state) => ({
              customers: [...state.customers, newCustomer],
              loading: false,
            }));
            return newCustomer;
          } catch {
            set({ error: 'Failed to create customer', loading: false });
          }
        },

        updateCustomer: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiClientes.update(id, updates);
            set((state) => ({
              customers: state.customers.map((c) =>
                c.id === id ? { ...c, ...updates } : c
              ),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to update customer', loading: false });
          }
        },

        deleteCustomer: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiClientes.delete(id);
            set((state) => ({
              customers: state.customers.filter((c) => c.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete customer', loading: false });
          }
        },

        // ============ ADDRESSES ============
        fetchAddresses: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiEnderecos.getAll();
            set({ addresses: data, loading: false });
          } catch {
            set({ error: 'Failed to load addresses', loading: false });
          }
        },

        createAddress: async (address) => {
          set({ loading: true, error: null });
          try {
            const newAddress = await apiEnderecos.create(address);
            set((state) => ({
              addresses: [...state.addresses, newAddress],
              loading: false,
            }));
            return newAddress;
          } catch {
            set({ error: 'Failed to create address', loading: false });
          }
        },

        updateAddress: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiEnderecos.update(id, updates);
            set((state) => ({
              addresses: state.addresses.map((e) =>
                e.id === id ? { ...e, ...updates } : e
              ),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to update address', loading: false });
          }
        },

        deleteAddress: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiEnderecos.delete(id);
            set((state) => ({
              addresses: state.addresses.filter((e) => e.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete address', loading: false });
          }
        },

        // ============ SALES ============
        fetchSales: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiVendas.getAll();
            set({ sales: data, loading: false });
          } catch {
            set({ error: 'Failed to load sales', loading: false });
          }
        },

        createSale: async (sale) => {
          set({ loading: true, error: null });
          try {
            const newSale = await apiVendas.create(sale);
            set((state) => ({
              sales: [...state.sales, newSale],
              loading: false,
            }));
            return newSale;
          } catch {
            set({ error: 'Failed to create sale', loading: false });
          }
        },

        updateSale: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiVendas.update(id, updates);
            set((state) => ({
              sales: state.sales.map((v) =>
                v.id === id ? { ...v, ...updates } : v
              ),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to update sale', loading: false });
          }
        },

        deleteSale: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiVendas.delete(id);
            set((state) => ({
              sales: state.sales.filter((v) => v.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete sale', loading: false });
          }
        },

        // ============ SALE ITEMS ============
        fetchSaleItems: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiItensVenda.getAll();
            set({ saleItems: data, loading: false });
          } catch {
            set({ error: 'Failed to load sale items', loading: false });
          }
        },

        createSaleItem: async (saleItem) => {
          set({ loading: true, error: null });
          try {
            const newSaleItem = await apiItensVenda.create(saleItem);
            set((state) => ({
              saleItems: [...state.saleItems, newSaleItem],
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to create sale item', loading: false });
          }
        },

        deleteSaleItem: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiItensVenda.delete(id);
            set((state) => ({
              saleItems: state.saleItems.filter((v) => v.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete sale item', loading: false });
          }
        },

        // ============ PURCHASES ============
        fetchPurchases: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiCompras.getAll();
            set({ purchases: data, loading: false });
          } catch {
            set({ error: 'Failed to load purchases', loading: false });
          }
        },

        createPurchase: async (purchase) => {
          set({ loading: true, error: null });
          try {
            const newPurchase = await apiCompras.create(purchase);
            set((state) => ({
              purchases: [...state.purchases, newPurchase],
              loading: false,
            }));
            return newPurchase;
          } catch {
            set({ error: 'Failed to create purchase', loading: false });
          }
        },

        updatePurchase: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiCompras.update(id, updates);
            set((state) => ({
              purchases: state.purchases.map((c) =>
                c.id === id ? { ...c, ...updates } : c
              ),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to update purchase', loading: false });
          }
        },

        deletePurchase: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiCompras.delete(id);
            set((state) => ({
              purchases: state.purchases.filter((c) => c.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete purchase', loading: false });
          }
        },

        // ============ PURCHASE ITEMS ============
        fetchPurchaseItems: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiItensCompra.getAll();
            set({ purchaseItems: data, loading: false });
          } catch {
            set({ error: 'Failed to load purchase items', loading: false });
          }
        },

        createPurchaseItem: async (purchaseItem) => {
          set({ loading: true, error: null });
          try {
            const newPurchaseItem = await apiItensCompra.create(purchaseItem);
            set((state) => ({
              purchaseItems: [...state.purchaseItems, newPurchaseItem],
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to create purchase item', loading: false });
          }
        },

        deletePurchaseItem: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiItensCompra.delete(id);
            set((state) => ({
              purchaseItems: state.purchaseItems.filter((c) => c.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete purchase item', loading: false });
          }
        },

        // ============ CUSTOMER ADDRESSES ============
        fetchCustomerAddresses: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiClientesEnderecos.getAll();
            set({ customerAddresses: data, loading: false });
          } catch {
            set({ error: 'Failed to load customer addresses', loading: false });
          }
        },

        linkCustomerAddress: async (customerId, addressId) => {
          try {
            await apiClientesEnderecos.create({ customerId, addressId });
            set((state) => ({
              customerAddresses: [...state.customerAddresses, { customerId, addressId }],
            }));
          } catch {
            set({ error: 'Failed to link address to customer' });
          }
        },

        unlinkCustomerAddress: async (customerId, addressId) => {
          try {
            await apiClientesEnderecos.delete(customerId, addressId);
            set((state) => ({
              customerAddresses: state.customerAddresses.filter(
                (link) =>
                  !(link.customerId === customerId && link.addressId === addressId)
              ),
            }));
          } catch {
            set({ error: 'Failed to unlink address from customer' });
          }
        },

        // ============ SALES CHANNELS ============
        fetchSalesChannels: async () => {
          set({ loading: true, error: null });
          try {
            const data = await apiCanaisVenda.getAll();
            set({ salesChannels: data, loading: false });
          } catch {
            set({ error: 'Failed to load sales channels', loading: false });
          }
        },

        createSalesChannel: async (channel) => {
          set({ loading: true, error: null });
          try {
            const newChannel = await apiCanaisVenda.create(channel);
            set((state) => ({
              salesChannels: [...state.salesChannels, newChannel],
              loading: false,
            }));
            return newChannel;
          } catch {
            set({ error: 'Failed to create sales channel', loading: false });
          }
        },

        updateSalesChannel: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            await apiCanaisVenda.update(id, updates);
            set((state) => ({
              salesChannels: state.salesChannels.map((channel) =>
                channel.id === id ? { ...channel, ...updates } : channel
              ),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to update sales channel', loading: false });
          }
        },

        deleteSalesChannel: async (id) => {
          set({ loading: true, error: null });
          try {
            await apiCanaisVenda.delete(id);
            set((state) => ({
              salesChannels: state.salesChannels.filter((channel) => channel.id !== id),
              loading: false,
            }));
          } catch {
            set({ error: 'Failed to delete sales channel', loading: false });
          }
        },

        // ============ GENERAL ACTIONS ============
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        resetState: () => set(initialState),
      }),
      {
        name: 'app-storage',
        version: 4,
        migrate: (persistedState, version) => {
          if (version < 2) {
            return { ...initialState, ...(persistedState as Partial<AppStore>) };
          }
          if (version < 4) {
            const { fornecedores: _removed, ...rest } =
              (persistedState as Partial<AppStore> & { fornecedores?: unknown }) ?? {};
            return rest as AppStore;
          }
          return persistedState as AppStore;
        },
      }
    )
  )
);
