// Serviço de API local (usando localStorage)
// Simula operações de API com delay para parecer mais real

import type {
  MusicGenre,
  Artist,
  VinylRecord,
  Customer,
  Address,
  CustomerAddress,
  Purchase,
  PurchaseItem,
  Sale,
  SaleItem,
  SalesChannel,
} from '@/shared/types';

const STORAGE_KEYS = {
  MUSIC_GENRES: 'app_generos_musical',
  ARTISTS: 'app_artistas',
  RECORDS: 'app_discos',
  RECORD_GENRES: 'app_generos_disco',
  CUSTOMERS: 'app_clientes',
  ADDRESSES: 'app_enderecos',
  CUSTOMER_ADDRESSES: 'app_clientes_enderecos',
  PURCHASES: 'app_compras',
  PURCHASE_ITEMS: 'app_itens_compra',
  SALES: 'app_vendas',
  SALE_ITEMS: 'app_itens_venda',
  SALES_CHANNELS: 'app_canais_venda',
};

// Simula delay de requisição
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Inicializa o localStorage com dados de exemplo
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  // Gêneros Musicais
  if (!localStorage.getItem(STORAGE_KEYS.MUSIC_GENRES)) {
    localStorage.setItem(
      STORAGE_KEYS.MUSIC_GENRES,
      JSON.stringify([
        { id: '1', nome: 'Rock' },
        { id: '2', nome: 'Pop' },
        { id: '3', nome: 'Jazz' },
        { id: '4', nome: 'Clássico' },
        { id: '5', nome: 'Sertanejo' },
      ])
    );
  }

  // Artists
  if (!localStorage.getItem(STORAGE_KEYS.ARTISTS)) {
    localStorage.setItem(
      STORAGE_KEYS.ARTISTS,
      JSON.stringify([
        { id: '1', nome: 'The Beatles', generoId: '1' },
        { id: '2', nome: 'Michael Jackson', generoId: '2' },
        { id: '3', nome: 'Miles Davis', generoId: '3' },
        { id: '4', nome: 'Ludwig van Beethoven', generoId: '4' },
        { id: '5', nome: 'Sertanejo Tradicional', generoId: '5' },
      ])
    );
  }

  // Discos (VAZIO - apenas dados adicionados via formulário)
  if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify([]));
  }

  // Clientes (VAZIO - apenas dados adicionados via formulário)
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
  }

  // Endereços (VAZIO - apenas dados adicionados via formulário)
  if (!localStorage.getItem(STORAGE_KEYS.ADDRESSES)) {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify([]));
  }

  // Inicializar outros (vazios)
  if (!localStorage.getItem(STORAGE_KEYS.RECORD_GENRES)) {
    localStorage.setItem(STORAGE_KEYS.RECORD_GENRES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMER_ADDRESSES)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_ADDRESSES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PURCHASES)) {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PURCHASE_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ITEMS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALE_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.SALE_ITEMS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES_CHANNELS)) {
    localStorage.setItem(
      STORAGE_KEYS.SALES_CHANNELS,
      JSON.stringify([
        { id: '1', nome: 'Loja Física' },
        { id: '2', nome: 'Loja Online' },
        { id: '3', nome: 'Mercado Livre' },
        { id: '4', nome: 'Shopee' },
      ])
    );
  }
};

// ============ GENEROS MUSICAIS ============
export const musicGenresApi = {
  getAll: async (): Promise<MusicGenre[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.MUSIC_GENRES);
    return data ? JSON.parse(data) : [];
  },

  create: async (genero: Omit<MusicGenre, 'id'>): Promise<MusicGenre> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.MUSIC_GENRES) || '[]';
    const items: MusicGenre[] = JSON.parse(data);
    const newItem: MusicGenre = {
      ...genero,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.MUSIC_GENRES, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<MusicGenre>): Promise<MusicGenre | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.MUSIC_GENRES) || '[]';
    const items: MusicGenre[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.MUSIC_GENRES, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.MUSIC_GENRES) || '[]';
    const items = (JSON.parse(data) as MusicGenre[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.MUSIC_GENRES, JSON.stringify(items));
  },
};

// ============ ARTISTAS ============
export const apiArtists = {
  getAll: async (): Promise<Artist[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Artist | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTS) || '[]';
    const items: Artist[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (artista: Omit<Artist, 'id'>): Promise<Artist> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTS) || '[]';
    const items: Artist[] = JSON.parse(data);
    const newItem: Artist = {
      ...artista,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ARTISTS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Artist>): Promise<Artist | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTS) || '[]';
    const items: Artist[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ARTISTS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTS) || '[]';
    const items = (JSON.parse(data) as Artist[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTISTS, JSON.stringify(items));
  },
};

// ============ DISCOS ============
export const recordsApi = {
  getAll: async (): Promise<VinylRecord[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<VinylRecord | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]';
    const items: VinylRecord[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (record: Omit<VinylRecord, 'id'>): Promise<VinylRecord> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]';
    const items: VinylRecord[] = JSON.parse(data);
    const newItem: VinylRecord = {
      ...disco,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<VinylRecord>): Promise<VinylRecord | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]';
    const items: VinylRecord[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]';
    const items = (JSON.parse(data) as VinylRecord[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(items));
  },
};

// ============ CLIENTES ============
export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Customer | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]';
    const items: Customer[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]';
    const items: Customer[] = JSON.parse(data);
    const newItem: Customer = {
      ....customer,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Customer>): Promise<Customer | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]';
    const items: Customer[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]';
    const items = (JSON.parse(data) as Customer[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(items));
  },
};

// ============ ENDERECOS ============
export const addressesApi = {
  getAll: async (): Promise<Address[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Address | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ADDRESSES) || '[]';
    const items: Address[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (address: Omit<Address, 'id'>): Promise<Address> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ADDRESSES) || '[]';
    const items: Address[] = JSON.parse(data);
    const newItem: Address = {
      ...endereco,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Address>): Promise<Address | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ADDRESSES) || '[]';
    const items: Address[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ADDRESSES) || '[]';
    const items = (JSON.parse(data) as Address[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(items));
  },
};

// ============ CLIENTES_ENDERECOS ============
export const customersApiEnderecos = {
  getAll: async (): Promise<CustomerAddress[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ADDRESSES);
    return data ? JSON.parse(data) : [];
  },

  create: async (link: CustomerAddress): Promise<CustomerAddress> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ADDRESSES) || '[]';
    const vinculos: CustomerAddress[] = JSON.parse(data);
    links.push(link);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_ADDRESSES, JSON.stringify(links));
    return link;
  },

  delete: async (customerId: string, addressId: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ADDRESSES) || '[]';
    const vinculosRestantes = (JSON.parse(data) as CustomerAddress[]).filter(
      (vinculo) =>
        !(link.clienteId === customerId && link.enderecoId === addressId)
    );
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_ADDRESSES, JSON.stringify(remaining));
  },
};

// ============ VENDAS ============
export const salesApi = {
  getAll: async (): Promise<Sale[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Sale | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALES) || '[]';
    const items: Sale[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (sale: Omit<Sale, 'id'>): Promise<Sale> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALES) || '[]';
    const items: Sale[] = JSON.parse(data);
    const newItem: Sale = {
      ...venda,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Sale>): Promise<Sale | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALES) || '[]';
    const items: Sale[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALES) || '[]';
    const items = (JSON.parse(data) as Sale[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(items));
  },
};

// ============ ITENS_VENDA ============
export const saleItemsApi = {
  getAll: async (): Promise<SaleItem[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALE_ITEMS);
    return data ? JSON.parse(data) : [];
  },

  getBySaleId: async (saleId: string): Promise<SaleItem[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALE_ITEMS) || '[]';
    const items: SaleItem[] = JSON.parse(data);
    return items.filter((item) => item.vendaId === saleId);
  },

  create: async (saleItem: Omit<SaleItem, 'id'>): Promise<SaleItem> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALE_ITEMS) || '[]';
    const items: SaleItem[] = JSON.parse(data);
    const newItem: SaleItem = {
      ...saleItem,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.SALE_ITEMS, JSON.stringify(items));
    return newItem;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALE_ITEMS) || '[]';
    const items = (JSON.parse(data) as SaleItem[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.SALE_ITEMS, JSON.stringify(items));
  },
};

// ============ COMPRAS ============
export const purchasesApi = {
  getAll: async (): Promise<Purchase[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Purchase | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASES) || '[]';
    const items: Purchase[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (purchase: Omit<Purchase, 'id'>): Promise<Purchase> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASES) || '[]';
    const items: Purchase[] = JSON.parse(data);
    const newItem: Purchase = {
      ...compra,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Purchase>): Promise<Purchase | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASES) || '[]';
    const items: Purchase[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASES) || '[]';
    const items = (JSON.parse(data) as Purchase[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(items));
  },
};

// ============ CANAIS_VENDA ============
export const salesChannelsApi = {
  getAll: async (): Promise<SalesChannel[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALES_CHANNELS);
    return data ? JSON.parse(data) : [];
  },

  create: async (salesChannel: Omit<SalesChannel, 'id'>): Promise<SalesChannel> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALES_CHANNELS) || '[]';
    const items: SalesChannel[] = JSON.parse(data);
    const newItem: SalesChannel = { ...canal, id: String(Date.now()) };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.SALES_CHANNELS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<SalesChannel>): Promise<SalesChannel | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALES_CHANNELS) || '[]';
    const items: SalesChannel[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.SALES_CHANNELS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.SALES_CHANNELS) || '[]';
    const items = (JSON.parse(data) as SalesChannel[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.SALES_CHANNELS, JSON.stringify(items));
  },
};

// ============ ITENS_COMPRA ============
export const purchaseItemsApi = {
  getAll: async (): Promise<PurchaseItem[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASE_ITEMS);
    return data ? JSON.parse(data) : [];
  },

  getByPurchaseId: async (purchaseId: string): Promise<PurchaseItem[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASE_ITEMS) || '[]';
    const items: PurchaseItem[] = JSON.parse(data);
    return items.filter((item) => item.compraId === purchaseId);
  },

  create: async (purchaseItem: Omit<PurchaseItem, 'id'>): Promise<PurchaseItem> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASE_ITEMS) || '[]';
    const items: PurchaseItem[] = JSON.parse(data);
    const newItem: PurchaseItem = {
      ...purchaseItem,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ITEMS, JSON.stringify(items));
    return newItem;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASE_ITEMS) || '[]';
    const items = (JSON.parse(data) as PurchaseItem[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ITEMS, JSON.stringify(items));
  },
};
