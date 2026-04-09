// Serviço de API local (usando localStorage)
// Simula operações de API com delay para parecer mais real

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
};

// ============ GENEROS MUSICAIS ============
export const apiGenerosMusical = {
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.GENEROS_MUSICAL);
    return data ? JSON.parse(data) : [];
  },

  create: async (genero: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.GENEROS_MUSICAL) || '[]';
    const items = JSON.parse(data);
    const newItem = {
      ...genero,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.GENEROS_MUSICAL, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.GENEROS_MUSICAL) || '[]';
    const items = JSON.parse(data);
    const index = items.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.GENEROS_MUSICAL, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.GENEROS_MUSICAL) || '[]';
    const items = JSON.parse(data).filter((item: any) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.GENEROS_MUSICAL, JSON.stringify(items));
  },
};

// ============ ARTISTAS ============
export const apiArtistas = {
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS) || '[]';
    const items = JSON.parse(data);
    return items.find((item: any) => item.id === id);
  },

  create: async (artista: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS) || '[]';
    const items = JSON.parse(data);
    const newItem = {
      ...artista,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ARTISTAS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS) || '[]';
    const items = JSON.parse(data);
    const index = items.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ARTISTAS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ARTISTAS) || '[]';
    const items = JSON.parse(data).filter((item: any) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTISTAS, JSON.stringify(items));
  },
};

// ============ DISCOS ============
export const apiDiscos = {
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS) || '[]';
    const items = JSON.parse(data);
    return items.find((item: any) => item.id === id);
  },

  create: async (disco: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS) || '[]';
    const items = JSON.parse(data);
    const newItem = {
      ...disco,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.DISCOS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS) || '[]';
    const items = JSON.parse(data);
    const index = items.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.DISCOS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.DISCOS) || '[]';
    const items = JSON.parse(data).filter((item: any) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.DISCOS, JSON.stringify(items));
  },
};

// ============ CLIENTES ============
export const apiClientes = {
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES) || '[]';
    const items = JSON.parse(data);
    return items.find((item: any) => item.id === id);
  },

  create: async (cliente: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES) || '[]';
    const items = JSON.parse(data);
    const newItem = {
      ...cliente,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES) || '[]';
    const items = JSON.parse(data);
    const index = items.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTES) || '[]';
    const items = JSON.parse(data).filter((item: any) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(items));
  },
};

// ============ ENDERECOS ============
export const apiEnderecos = {
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS) || '[]';
    const items = JSON.parse(data);
    return items.find((item: any) => item.id === id);
  },

  create: async (endereco: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS) || '[]';
    const items = JSON.parse(data);
    const newItem = {
      ...endereco,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ENDERECOS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS) || '[]';
    const items = JSON.parse(data);
    const index = items.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ENDERECOS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ENDERECOS) || '[]';
    const items = JSON.parse(data).filter((item: any) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENDERECOS, JSON.stringify(items));
  },
};

// ============ VENDAS ============
export const apiVendas = {
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS) || '[]';
    const items = JSON.parse(data);
    return items.find((item: any) => item.id === id);
  },

  create: async (venda: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS) || '[]';
    const items = JSON.parse(data);
    const newItem = {
      ...venda,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS) || '[]';
    const items = JSON.parse(data);
    const index = items.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.VENDAS) || '[]';
    const items = JSON.parse(data).filter((item: any) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.VENDAS, JSON.stringify(items));
  },
};

// ============ ITENS_VENDA ============
export const apiItensVenda = {
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_VENDA);
    return data ? JSON.parse(data) : [];
  },

  getByVendaId: async (vendaId: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_VENDA) || '[]';
    const items = JSON.parse(data);
    return items.filter((item: any) => item.vendaId === vendaId);
  },

  create: async (itemVenda: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_VENDA) || '[]';
    const items = JSON.parse(data);
    const newItem = {
      ...itemVenda,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ITENS_VENDA, JSON.stringify(items));
    return newItem;
  },

  delete: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_VENDA) || '[]';
    const items = JSON.parse(data).filter((item: any) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ITENS_VENDA, JSON.stringify(items));
  },
};

// ============ COMPRAS ============
export const apiCompras = {
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS);
    return data ? JSON.parse(data) : [];
  },

  getById: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS) || '[]';
    const items = JSON.parse(data);
    return items.find((item: any) => item.id === id);
  },

  create: async (compra: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS) || '[]';
    const items = JSON.parse(data);
    const newItem = {
      ...compra,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify(items));
    return newItem;
  },

  update: async (id: string, updates: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS) || '[]';
    const items = JSON.parse(data);
    const index = items.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify(items));
    }
    return items[index];
  },

  delete: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.COMPRAS) || '[]';
    const items = JSON.parse(data).filter((item: any) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify(items));
  },
};

// ============ ITENS_COMPRA ============
export const apiItensCompra = {
  getAll: async () => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_COMPRA);
    return data ? JSON.parse(data) : [];
  },

  getByCompraId: async (compraId: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_COMPRA) || '[]';
    const items = JSON.parse(data);
    return items.filter((item: any) => item.compraId === compraId);
  },

  create: async (itemCompra: any) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_COMPRA) || '[]';
    const items = JSON.parse(data);
    const newItem = {
      ...itemCompra,
      id: String(Date.now()),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.ITENS_COMPRA, JSON.stringify(items));
    return newItem;
  },

  delete: async (id: string) => {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.ITENS_COMPRA) || '[]';
    const items = JSON.parse(data).filter((item: any) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ITENS_COMPRA, JSON.stringify(items));
  },
};
