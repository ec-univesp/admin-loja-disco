import { http, HttpResponse } from 'msw';
import { db, nextId } from './db';
import type {
  ArtistDTO,
  AddressDTO,
  CustomerDTO,
  MusicGenreDTO,
  PurchaseDTO,
  RecordDTO,
  SaleDTO,
  SalesChannelDTO,
} from '@/shared/services/api/types';

const BASE = 'http://localhost:8080';

const url = (path: string) => `${BASE}${path}`;

export const handlers = [
  // ===== Artistas =====
  http.get(url('/artistas/lista'), () => HttpResponse.json(db.artists)),
  http.get(url('/artistas/:id'), ({ params }) => {
    const id = Number(params.id);
    const found = db.artists.find((a) => a.artistaId === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post(url('/artistas/criar'), async ({ request }) => {
    const body = (await request.json()) as ArtistDTO;
    const created = { ...body, artistaId: body.artistaId ?? nextId('artists', 'artistaId') };
    db.artists.push(created);
    return HttpResponse.json(`Artista ${created.nomeArtista} criado.`);
  }),
  http.put(url('/artistas/atualizar'), async ({ request }) => {
    const body = (await request.json()) as ArtistDTO;
    const idx = db.artists.findIndex((a) => a.artistaId === body.artistaId);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.artists[idx] = { ...db.artists[idx], ...body };
    return HttpResponse.json(db.artists[idx]);
  }),
  http.delete(url('/artistas/:id'), ({ params }) => {
    const id = Number(params.id);
    const idx = db.artists.findIndex((a) => a.artistaId === id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.artists.splice(idx, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Generos Musicais =====
  http.get(url('/generos-musicais/lista'), () => HttpResponse.json(db.genres)),
  http.get(url('/generos-musicais/:id'), ({ params }) => {
    const id = Number(params.id);
    const found = db.genres.find((g) => g.generoMusicalId === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post(url('/generos-musicais/criar'), async ({ request }) => {
    const body = (await request.json()) as MusicGenreDTO;
    const created = {
      ...body,
      generoMusicalId: body.generoMusicalId ?? nextId('genres', 'generoMusicalId'),
    };
    db.genres.push(created);
    return HttpResponse.json(`Genero ${created.nomeGenero} criado.`);
  }),
  http.put(url('/generos-musicais/atualizar'), async ({ request }) => {
    const body = (await request.json()) as MusicGenreDTO;
    const idx = db.genres.findIndex((g) => g.generoMusicalId === body.generoMusicalId);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.genres[idx] = { ...db.genres[idx], ...body };
    return HttpResponse.json(db.genres[idx]);
  }),
  http.delete(url('/generos-musicais/:id'), ({ params }) => {
    const id = Number(params.id);
    const idx = db.genres.findIndex((g) => g.generoMusicalId === id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.genres.splice(idx, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Enderecos =====
  http.get(url('/enderecos/lista'), () => HttpResponse.json(db.addresses)),
  http.get(url('/enderecos/:id'), ({ params }) => {
    const id = Number(params.id);
    const found = db.addresses.find((a) => a.enderecoId === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post(url('/enderecos/criar'), async ({ request }) => {
    const body = (await request.json()) as AddressDTO;
    const created = { ...body, enderecoId: body.enderecoId ?? nextId('addresses', 'enderecoId') };
    db.addresses.push(created);
    return HttpResponse.json('Endereco criado.');
  }),
  http.put(url('/enderecos/atualizar'), async ({ request }) => {
    const body = (await request.json()) as AddressDTO;
    const idx = db.addresses.findIndex((a) => a.enderecoId === body.enderecoId);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.addresses[idx] = { ...db.addresses[idx], ...body };
    return HttpResponse.json(db.addresses[idx]);
  }),
  http.delete(url('/enderecos/:id'), ({ params }) => {
    const id = Number(params.id);
    const idx = db.addresses.findIndex((a) => a.enderecoId === id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.addresses.splice(idx, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Clientes =====
  http.get(url('/clientes/lista'), () => HttpResponse.json(db.customers)),
  http.get(url('/clientes/:id'), ({ params }) => {
    const id = Number(params.id);
    const found = db.customers.find((c) => c.clienteId === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post(url('/clientes/criar'), async ({ request }) => {
    const body = (await request.json()) as CustomerDTO;
    const created = { ...body, clienteId: body.clienteId ?? nextId('customers', 'clienteId') };
    db.customers.push(created);
    return HttpResponse.json(`Cliente ${created.nomeCliente} criado.`);
  }),
  http.put(url('/clientes/atualizar'), async ({ request }) => {
    const body = (await request.json()) as CustomerDTO;
    const idx = db.customers.findIndex((c) => c.clienteId === body.clienteId);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.customers[idx] = { ...db.customers[idx], ...body };
    return HttpResponse.json(db.customers[idx]);
  }),
  http.delete(url('/clientes/:id'), ({ params }) => {
    const id = Number(params.id);
    const idx = db.customers.findIndex((c) => c.clienteId === id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.customers.splice(idx, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Canais de Venda =====
  http.get(url('/canais-venda/lista'), () => HttpResponse.json(db.channels)),
  http.get(url('/canais-venda/:id'), ({ params }) => {
    const id = Number(params.id);
    const found = db.channels.find((c) => c.canalVendaId === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post(url('/canais-venda/criar'), async ({ request }) => {
    const body = (await request.json()) as SalesChannelDTO;
    const created = { ...body, canalVendaId: body.canalVendaId ?? nextId('channels', 'canalVendaId') };
    db.channels.push(created);
    return HttpResponse.json(`Canal ${created.nomeCanalVenda} criado.`);
  }),
  http.put(url('/canais-venda/atualizar'), async ({ request }) => {
    const body = (await request.json()) as SalesChannelDTO;
    const idx = db.channels.findIndex((c) => c.canalVendaId === body.canalVendaId);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.channels[idx] = { ...db.channels[idx], ...body };
    return HttpResponse.json(db.channels[idx]);
  }),
  http.delete(url('/canais-venda/:id'), ({ params }) => {
    const id = Number(params.id);
    const idx = db.channels.findIndex((c) => c.canalVendaId === id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.channels.splice(idx, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Discos =====
  http.get(url('/discos/lista'), () => HttpResponse.json(db.records)),
  http.get(url('/discos/lista-filtrada/:id'), ({ params }) => {
    const tipo = Number(params.id);
    const excludeStatus = tipo === 1 ? 'VENDIDO' : 'DISPONIVEL';
    const filtered = db.records.filter((r) => r.status !== excludeStatus);
    return HttpResponse.json(filtered);
  }),
  http.get(url('/discos/buscar'), ({ request }) => {
    const u = new URL(request.url);
    const termo = (u.searchParams.get('termo') ?? '').toLowerCase();
    const filtered = db.records.filter(
      (r) =>
        r.album?.toLowerCase().includes(termo) ||
        r.artista?.nomeArtista?.toLowerCase().includes(termo)
    );
    return HttpResponse.json(filtered);
  }),
  http.get(url('/discos/:id'), ({ params }) => {
    const id = Number(params.id);
    const found = db.records.find((r) => r.discoId === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post(url('/discos/criar'), async ({ request }) => {
    const body = (await request.json()) as RecordDTO;
    const created = { ...body, discoId: body.discoId ?? nextId('records', 'discoId') };
    db.records.push(created);
    return HttpResponse.json(`Disco ${created.album} criado.`);
  }),
  http.put(url('/discos/atualizar'), async ({ request }) => {
    const body = (await request.json()) as RecordDTO;
    const idx = db.records.findIndex((r) => r.discoId === body.discoId);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.records[idx] = { ...db.records[idx], ...body };
    return HttpResponse.json(db.records[idx]);
  }),
  http.delete(url('/discos/:id'), ({ params }) => {
    const id = Number(params.id);
    const idx = db.records.findIndex((r) => r.discoId === id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.records.splice(idx, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Vendas =====
  http.get(url('/vendas/lista'), () => HttpResponse.json(db.sales)),
  http.get(url('/vendas/:id'), ({ params }) => {
    const id = Number(params.id);
    const found = db.sales.find((s) => s.vendaId === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post(url('/vendas/criar'), async ({ request }) => {
    const body = (await request.json()) as SaleDTO & { vendasId?: number };
    const created: SaleDTO = {
      ...body,
      vendaId: body.vendaId ?? body.vendasId ?? nextId('sales', 'vendaId'),
    };
    db.sales.push(created);
    return HttpResponse.json('Venda criada.');
  }),
  http.put(url('/vendas/atualizar'), async ({ request }) => {
    const body = (await request.json()) as SaleDTO & { vendasId?: number };
    const id = body.vendaId ?? body.vendasId;
    const idx = db.sales.findIndex((s) => s.vendaId === id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.sales[idx] = { ...db.sales[idx], ...body, vendaId: id };
    return HttpResponse.json(db.sales[idx]);
  }),
  http.delete(url('/vendas/:id'), ({ params }) => {
    const id = Number(params.id);
    const idx = db.sales.findIndex((s) => s.vendaId === id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.sales.splice(idx, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Compras =====
  http.get(url('/compras/lista'), () => HttpResponse.json(db.purchases)),
  http.get(url('/compras/:id'), ({ params }) => {
    const id = Number(params.id);
    const found = db.purchases.find((p) => p.compraId === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post(url('/compras/criar'), async ({ request }) => {
    const body = (await request.json()) as PurchaseDTO;
    const created = { ...body, compraId: body.compraId ?? nextId('purchases', 'compraId') };
    db.purchases.push(created);
    return HttpResponse.json('Compra criada.');
  }),
  http.put(url('/compras/atualizar'), async ({ request }) => {
    const body = (await request.json()) as PurchaseDTO;
    const idx = db.purchases.findIndex((p) => p.compraId === body.compraId);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.purchases[idx] = { ...db.purchases[idx], ...body };
    return HttpResponse.json(db.purchases[idx]);
  }),
  http.delete(url('/compras/:id'), ({ params }) => {
    const id = Number(params.id);
    const idx = db.purchases.findIndex((p) => p.compraId === id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    db.purchases.splice(idx, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Relatorios =====
  http.get(url('/relatorios/receita-detalhada'), ({ request }) => {
    const u = new URL(request.url);
    const ano = Number(u.searchParams.get('ano'));
    const mes = Number(u.searchParams.get('mes'));
    return HttpResponse.json([
      {
        ano,
        mes,
        dataVenda: `${ano}-${String(mes).padStart(2, '0')}-15`,
        formaPagamento: 'PIX',
        nomeCanal: 'Site',
        estado: 'SP',
        nomeArtista: 'Stevie Wonder',
        nomeGenero: 'GROOVE',
        receitaDisco: 100,
      },
    ]);
  }),
  http.get(url('/relatorios/receita-despesa'), ({ request }) => {
    const u = new URL(request.url);
    const ano = Number(u.searchParams.get('ano'));
    const mes = Number(u.searchParams.get('mes'));
    return HttpResponse.json([
      {
        ano,
        mes,
        receita: 500,
        custosAdicionais: 50,
        frete: 25,
        valorPago: 200,
        totalDespesa: 275,
        lucro: 225,
      },
    ]);
  }),
  http.get(url('/relatorios/receita-canal'), ({ request }) => {
    const u = new URL(request.url);
    const ano = Number(u.searchParams.get('ano'));
    const mes = Number(u.searchParams.get('mes'));
    return HttpResponse.json([{ ano, mes, nomeCanal: 'Site', receita: 500 }]);
  }),
];
