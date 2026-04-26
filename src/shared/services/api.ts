// Serviço de API local (usando localStorage)
// Simula operações de API com delay para parecer mais real

import type {
  GeneroMusical,
  Artista,
  Disco,
  Cliente,
  Endereco,
  ClienteEndereco,
  Compra,
  ItemCompra,
  Venda,
  ItemVenda,
  CanalVenda,
} from '@/shared/types/models';

const STORAGE_KEYS = {
  GENEROS_MUSICAL: 'app_generos_musical',
  ARTISTAS: 'app_artistas',
  DISCOS: 'app_discos',
  GENEROS_DISCO: 'app_generos_disco',
  CLIENTES: 'app_clientes',
  ENDERECOS: 'app_enderecos',
  CLIENTES_ENDERECOS: 'app_clientes_enderecos',
  COMPRAS: 'app_compras',
  ITENS_COMPRA: 'app_itens_compra',
  VENDAS: 'app_vendas',
  ITENS_VENDA: 'app_itens_venda',
  CANAIS_VENDA: 'app_canais_venda',
} as const;

// Simula delay de requisição
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Inicializa o localStorage com dados de exemplo
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  // Gêneros Musicais
  if (!localStorage.getItem(STORAGE_KEYS.GENEROS_MUSICAL)) {
    localStorage.setItem(
      STORAGE_KEYS.GENEROS_MUSICAL,
      JSON.stringify([
        { id: '1', nome: 'Rock' },
        { id: '2', nome: 'Pop' },
        { id: '3', nome: 'Jazz' },
        { id: '4', nome: 'Clássico' },
        { id: '5', nome: 'Sertanejo' },
      ])
    );
  }

  // Artistas
  if (!localStorage.getItem(STORAGE_KEYS.ARTISTAS)) {
    localStorage.setItem(
      STORAGE_KEYS.ARTISTAS,
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
  if (!localStorage.getItem(STORAGE_KEYS.DISCOS)) {
    localStorage.setItem(STORAGE_KEYS.DISCOS, JSON.stringify([]));
  }

  // Clientes (VAZIO - apenas dados adicionados via formulário)
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTES)) {
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify([]));
  }

  // Endereços (VAZIO - apenas dados adicionados via formulário)
  if (!localStorage.getItem(STORAGE_KEYS.ENDERECOS)) {
    localStorage.setItem(STORAGE_KEYS.ENDERECOS, JSON.stringify([]));
  }

  // Inicializar outros (vazios)
  if (!localStorage.getItem(STORAGE_KEYS.GENEROS_DISCO)) {
    localStorage.setItem(STORAGE_KEYS.GENEROS_DISCO, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTES_ENDERECOS)) {
    localStorage.setItem(STORAGE_KEYS.CLIENTES_ENDERECOS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMPRAS)) {
    localStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ITENS_COMPRA)) {
    localStorage.setItem(STORAGE_KEYS.ITENS_COMPRA, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VENDAS)) {
    localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ITENS_VENDA)) {
    localStorage.setItem(STORAGE_KEYS.ITENS_VENDA, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CANAIS_VENDA)) {
    localStorage.setItem(
      STORAGE_KEYS.CANAIS_VENDA,
      JSON.stringify([
        { id: '1', nome: 'Loja Física', taxaPadrao: 0 },
        { id: '2', nome: 'Loja Online', taxaPadrao: 0 },
        { id: '3', nome: 'Mercado Livre', taxaPadrao: 12 },
        { id: '4', nome: 'Shopee', taxaPadrao: 14 },
      ])
    );
  }
};

// ============ GENEROS MUSICAIS ============
export const apiGenerosMusical = {
  getAll: async (): Promise<GeneroMusical[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.GENEROS_MUSICAL);
    return data ? JSON.parse(data) : [];
  },

  create: async (genero: Omit<GeneroMusical, 'id'>): Promise<GeneroMusical> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.GENEROS_MUSICAL) || '[]';
    const items: GeneroMusical[] = JSON.parse(data);
    const newItem: GeneroMusical = {
      ...genero,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.GENEROS_MUSICAL, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<GeneroMusical>): Promise<GeneroMusical | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.GENEROS_MUSICAL) || '[]';
    const items: GeneroMusical[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.GENEROS_MUSICAL, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.GENEROS_MUSICAL) || '[]';
    const items = (JSON.parse(data) as GeneroMusical[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.GENEROS_MUSICAL, JSON.stringify(items));
  },
};

// ============ ARTISTAS ============
export const apiArtistas = {
  getAll: async (): Promise<Artista[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Artista | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS) || '[]';
    const items: Artista[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (artista: Omit<Artista, 'id'>): Promise<Artista> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS) || '[]';
    const items: Artista[] = JSON.parse(data);
    const newItem: Artista = {
      ...artista,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ARTISTAS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Artista>): Promise<Artista | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS) || '[]';
    const items: Artista[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ARTISTAS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS) || '[]';
    const items = (JSON.parse(data) as Artista[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTISTAS, JSON.stringify(items));
  },
};

// ============ DISCOS ============
export const apiDiscos = {
  getAll: async (): Promise<Disco[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Disco | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS) || '[]';
    const items: Disco[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (disco: Omit<Disco, 'id'>): Promise<Disco> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS) || '[]';
    const items: Disco[] = JSON.parse(data);
    const newItem: Disco = {
      ...disco,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.DISCOS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Disco>): Promise<Disco | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS) || '[]';
    const items: Disco[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.DISCOS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS) || '[]';
    const items = (JSON.parse(data) as Disco[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.DISCOS, JSON.stringify(items));
  },
};

// ============ CLIENTES ============
export const apiClientes = {
  getAll: async (): Promise<Cliente[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Cliente | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES) || '[]';
    const items: Cliente[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES) || '[]';
    const items: Cliente[] = JSON.parse(data);
    const newItem: Cliente = {
      ...cliente,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Cliente>): Promise<Cliente | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES) || '[]';
    const items: Cliente[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES) || '[]';
    const items = (JSON.parse(data) as Cliente[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(items));
  },
};

// ============ ENDERECOS ============
export const apiEnderecos = {
  getAll: async (): Promise<Endereco[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Endereco | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS) || '[]';
    const items: Endereco[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (endereco: Omit<Endereco, 'id'>): Promise<Endereco> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS) || '[]';
    const items: Endereco[] = JSON.parse(data);
    const newItem: Endereco = {
      ...endereco,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ENDERECOS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Endereco>): Promise<Endereco | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS) || '[]';
    const items: Endereco[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ENDERECOS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS) || '[]';
    const items = (JSON.parse(data) as Endereco[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENDERECOS, JSON.stringify(items));
  },
};

// ============ CLIENTES_ENDERECOS ============
export const apiClientesEnderecos = {
  getAll: async (): Promise<ClienteEndereco[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES_ENDERECOS);
    return data ? JSON.parse(data) : [];
  },

  create: async (vinculo: ClienteEndereco): Promise<ClienteEndereco> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES_ENDERECOS) || '[]';
    const vinculos: ClienteEndereco[] = JSON.parse(data);
    vinculos.push(vinculo);
    localStorage.setItem(STORAGE_KEYS.CLIENTES_ENDERECOS, JSON.stringify(vinculos));
    return vinculo;
  },

  delete: async (clienteId: string, enderecoId: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES_ENDERECOS) || '[]';
    const vinculosRestantes = (JSON.parse(data) as ClienteEndereco[]).filter(
      (vinculo) =>
        !(vinculo.clienteId === clienteId && vinculo.enderecoId === enderecoId)
    );
    localStorage.setItem(STORAGE_KEYS.CLIENTES_ENDERECOS, JSON.stringify(vinculosRestantes));
  },
};

// ============ VENDAS ============
export const apiVendas = {
  getAll: async (): Promise<Venda[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Venda | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS) || '[]';
    const items: Venda[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (venda: Omit<Venda, 'id'>): Promise<Venda> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS) || '[]';
    const items: Venda[] = JSON.parse(data);
    const newItem: Venda = {
      ...venda,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Venda>): Promise<Venda | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS) || '[]';
    const items: Venda[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS) || '[]';
    const items = (JSON.parse(data) as Venda[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(items));
  },
};

// ============ ITENS_VENDA ============
export const apiItensVenda = {
  getAll: async (): Promise<ItemVenda[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_VENDA);
    return data ? JSON.parse(data) : [];
  },

  getByVendaId: async (vendaId: string): Promise<ItemVenda[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_VENDA) || '[]';
    const items: ItemVenda[] = JSON.parse(data);
    return items.filter((item) => item.vendaId === vendaId);
  },

  create: async (itemVenda: Omit<ItemVenda, 'id'>): Promise<ItemVenda> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_VENDA) || '[]';
    const items: ItemVenda[] = JSON.parse(data);
    const newItem: ItemVenda = {
      ...itemVenda,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ITENS_VENDA, JSON.stringify(items));
    return newItem;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_VENDA) || '[]';
    const items = (JSON.parse(data) as ItemVenda[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ITENS_VENDA, JSON.stringify(items));
  },
};

// ============ COMPRAS ============
export const apiCompras = {
  getAll: async (): Promise<Compra[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string): Promise<Compra | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS) || '[]';
    const items: Compra[] = JSON.parse(data);
    return items.find((item) => item.id === id);
  },

  create: async (compra: Omit<Compra, 'id'>): Promise<Compra> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS) || '[]';
    const items: Compra[] = JSON.parse(data);
    const newItem: Compra = {
      ...compra,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<Compra>): Promise<Compra | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS) || '[]';
    const items: Compra[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS) || '[]';
    const items = (JSON.parse(data) as Compra[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify(items));
  },
};

// ============ CANAIS_VENDA ============
export const apiCanaisVenda = {
  getAll: async (): Promise<CanalVenda[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CANAIS_VENDA);
    return data ? JSON.parse(data) : [];
  },

  create: async (canal: Omit<CanalVenda, 'id'>): Promise<CanalVenda> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CANAIS_VENDA) || '[]';
    const items: CanalVenda[] = JSON.parse(data);
    const newItem: CanalVenda = { ...canal, id: String(Date.now()) };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.CANAIS_VENDA, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: Partial<CanalVenda>): Promise<CanalVenda | undefined> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CANAIS_VENDA) || '[]';
    const items: CanalVenda[] = JSON.parse(data);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.CANAIS_VENDA, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CANAIS_VENDA) || '[]';
    const items = (JSON.parse(data) as CanalVenda[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.CANAIS_VENDA, JSON.stringify(items));
  },
};

// ============ ITENS_COMPRA ============
export const apiItensCompra = {
  getAll: async (): Promise<ItemCompra[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_COMPRA);
    return data ? JSON.parse(data) : [];
  },

  getByCompraId: async (compraId: string): Promise<ItemCompra[]> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_COMPRA) || '[]';
    const items: ItemCompra[] = JSON.parse(data);
    return items.filter((item) => item.compraId === compraId);
  },

  create: async (itemCompra: Omit<ItemCompra, 'id'>): Promise<ItemCompra> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_COMPRA) || '[]';
    const items: ItemCompra[] = JSON.parse(data);
    const newItem: ItemCompra = {
      ...itemCompra,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ITENS_COMPRA, JSON.stringify(items));
    return newItem;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_COMPRA) || '[]';
    const items = (JSON.parse(data) as ItemCompra[]).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ITENS_COMPRA, JSON.stringify(items));
  },
};
