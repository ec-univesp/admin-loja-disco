import { http, HttpResponse } from 'msw';
import { db, nextId } from './db';
import {
  addressSchema,
  artistSchema,
  customerSchema,
  musicGenreSchema,
  profitPerItemSchema,
  purchaseSchema,
  recordSchema,
  saleResponseSchema,
  salePayloadSchema,
  salesChannelSchema,
} from '@/shared/services/api/schemas';
import type {
  AddressDTO,
  ArtistDTO,
  CustomerDTO,
  MusicGenreDTO,
  PurchaseDTO,
  RecordDTO,
  SaleDTO,
  SalesChannelDTO,
} from '@/shared/services/api/types';
import type { z } from 'zod';

const API_BASE_URL = 'http://localhost:8080';
const buildUrl = (path: string) => `${API_BASE_URL}${path}`;
const notFound = () => new HttpResponse(null, { status: 404 });

const parseBody = async <Schema extends z.ZodTypeAny>(
  request: Request,
  schema: Schema
): Promise<z.infer<Schema>> => schema.parse(await request.json());

const getQueryInt = (request: Request, key: string): number =>
  Number(new URL(request.url).searchParams.get(key));
const getQueryString = (request: Request, key: string): string =>
  new URL(request.url).searchParams.get(key) ?? '';

export const handlers = [
  // ===== Artistas =====
  http.get(buildUrl('/artistas/lista'), () => HttpResponse.json(db.artists)),
  http.get(buildUrl('/artistas/:id'), ({ params }) => {
    const artistId = Number(params.id);
    const artist = db.artists.find((candidate) => candidate.artistaId === artistId);
    return artist ? HttpResponse.json(artist) : notFound();
  }),
  http.post(buildUrl('/artistas/criar'), async ({ request }) => {
    const body: ArtistDTO = await parseBody(request, artistSchema);
    const artistaId = body.artistaId ?? nextId('artists', 'artistaId');
    const created: ArtistDTO = { ...body, artistaId };
    db.artists.push(created);
    return HttpResponse.json(`Artista ${created.nomeArtista} criado.`);
  }),
  http.put(buildUrl('/artistas/atualizar'), async ({ request }) => {
    const body: ArtistDTO = await parseBody(request, artistSchema);
    const index = db.artists.findIndex((candidate) => candidate.artistaId === body.artistaId);
    if (index < 0) return notFound();
    db.artists[index] = { ...db.artists[index], ...body };
    return HttpResponse.json(db.artists[index]);
  }),
  http.delete(buildUrl('/artistas/:id'), ({ params }) => {
    const artistId = Number(params.id);
    const index = db.artists.findIndex((candidate) => candidate.artistaId === artistId);
    if (index < 0) return notFound();
    db.artists.splice(index, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Generos Musicais =====
  http.get(buildUrl('/generos-musicais/lista'), () => HttpResponse.json(db.genres)),
  http.get(buildUrl('/generos-musicais/:id'), ({ params }) => {
    const genreId = Number(params.id);
    const genre = db.genres.find((candidate) => candidate.generoMusicalId === genreId);
    return genre ? HttpResponse.json(genre) : notFound();
  }),
  http.post(buildUrl('/generos-musicais/criar'), async ({ request }) => {
    const body: MusicGenreDTO = await parseBody(request, musicGenreSchema);
    const generoMusicalId = body.generoMusicalId ?? nextId('genres', 'generoMusicalId');
    const created: MusicGenreDTO = { ...body, generoMusicalId };
    db.genres.push(created);
    return HttpResponse.json(`Genero ${created.nomeGenero} criado.`);
  }),
  http.put(buildUrl('/generos-musicais/atualizar'), async ({ request }) => {
    const body: MusicGenreDTO = await parseBody(request, musicGenreSchema);
    const index = db.genres.findIndex(
      (candidate) => candidate.generoMusicalId === body.generoMusicalId
    );
    if (index < 0) return notFound();
    db.genres[index] = { ...db.genres[index], ...body };
    return HttpResponse.json(db.genres[index]);
  }),
  http.delete(buildUrl('/generos-musicais/:id'), ({ params }) => {
    const genreId = Number(params.id);
    const index = db.genres.findIndex((candidate) => candidate.generoMusicalId === genreId);
    if (index < 0) return notFound();
    db.genres.splice(index, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Enderecos =====
  http.get(buildUrl('/enderecos/lista'), () => HttpResponse.json(db.addresses)),
  http.get(buildUrl('/enderecos/:id'), ({ params }) => {
    const addressId = Number(params.id);
    const address = db.addresses.find((candidate) => candidate.enderecoId === addressId);
    return address ? HttpResponse.json(address) : notFound();
  }),
  http.post(buildUrl('/enderecos/criar'), async ({ request }) => {
    const body: AddressDTO = await parseBody(request, addressSchema);
    const enderecoId = body.enderecoId ?? nextId('addresses', 'enderecoId');
    const created: AddressDTO = { ...body, enderecoId };
    db.addresses.push(created);
    return HttpResponse.json('Endereco criado.');
  }),
  http.put(buildUrl('/enderecos/atualizar'), async ({ request }) => {
    const body: AddressDTO = await parseBody(request, addressSchema);
    const index = db.addresses.findIndex(
      (candidate) => candidate.enderecoId === body.enderecoId
    );
    if (index < 0) return notFound();
    db.addresses[index] = { ...db.addresses[index], ...body };
    return HttpResponse.json(db.addresses[index]);
  }),
  http.delete(buildUrl('/enderecos/:id'), ({ params }) => {
    const addressId = Number(params.id);
    const index = db.addresses.findIndex((candidate) => candidate.enderecoId === addressId);
    if (index < 0) return notFound();
    db.addresses.splice(index, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Clientes =====
  http.get(buildUrl('/clientes/lista'), () => HttpResponse.json(db.customers)),
  http.get(buildUrl('/clientes/:id'), ({ params }) => {
    const customerId = Number(params.id);
    const customer = db.customers.find((candidate) => candidate.clienteId === customerId);
    return customer ? HttpResponse.json(customer) : notFound();
  }),
  http.post(buildUrl('/clientes/criar'), async ({ request }) => {
    const body: CustomerDTO = await parseBody(request, customerSchema);
    const clienteId = body.clienteId ?? nextId('customers', 'clienteId');
    const created: CustomerDTO = { ...body, clienteId };
    db.customers.push(created);
    return HttpResponse.json(`Cliente ${created.nomeCliente} criado.`);
  }),
  http.put(buildUrl('/clientes/atualizar'), async ({ request }) => {
    const body: CustomerDTO = await parseBody(request, customerSchema);
    const index = db.customers.findIndex(
      (candidate) => candidate.clienteId === body.clienteId
    );
    if (index < 0) return notFound();
    db.customers[index] = { ...db.customers[index], ...body };
    return HttpResponse.json(db.customers[index]);
  }),
  http.delete(buildUrl('/clientes/:id'), ({ params }) => {
    const customerId = Number(params.id);
    const index = db.customers.findIndex((candidate) => candidate.clienteId === customerId);
    if (index < 0) return notFound();
    db.customers.splice(index, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Canais de Venda =====
  http.get(buildUrl('/canais-venda/lista'), () => HttpResponse.json(db.channels)),
  http.get(buildUrl('/canais-venda/:id'), ({ params }) => {
    const channelId = Number(params.id);
    const channel = db.channels.find((candidate) => candidate.canalVendaId === channelId);
    return channel ? HttpResponse.json(channel) : notFound();
  }),
  http.post(buildUrl('/canais-venda/criar'), async ({ request }) => {
    const body: SalesChannelDTO = await parseBody(request, salesChannelSchema);
    const canalVendaId = body.canalVendaId ?? nextId('channels', 'canalVendaId');
    const created: SalesChannelDTO = { ...body, canalVendaId };
    db.channels.push(created);
    return HttpResponse.json(`Canal ${created.nomeCanalVenda} criado.`);
  }),
  http.put(buildUrl('/canais-venda/atualizar'), async ({ request }) => {
    const body: SalesChannelDTO = await parseBody(request, salesChannelSchema);
    const index = db.channels.findIndex(
      (candidate) => candidate.canalVendaId === body.canalVendaId
    );
    if (index < 0) return notFound();
    db.channels[index] = { ...db.channels[index], ...body };
    return HttpResponse.json(db.channels[index]);
  }),
  http.delete(buildUrl('/canais-venda/:id'), ({ params }) => {
    const channelId = Number(params.id);
    const index = db.channels.findIndex((candidate) => candidate.canalVendaId === channelId);
    if (index < 0) return notFound();
    db.channels.splice(index, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Discos =====
  http.get(buildUrl('/discos/lista'), () => HttpResponse.json(db.records)),
  http.get(buildUrl('/discos/lista-filtrada/:id'), ({ params }) => {
    const filterType = Number(params.id);
    const statusToExclude = filterType === 1 ? 'VENDIDO' : 'DISPONIVEL';
    const filtered = db.records.filter((record) => record.status !== statusToExclude);
    return HttpResponse.json(filtered);
  }),
  http.get(buildUrl('/discos/buscar'), ({ request }) => {
    const term = getQueryString(request, 'termo').toLowerCase();
    const filtered = db.records.filter(
      (record) =>
        record.album?.toLowerCase().includes(term) ||
        record.artista?.nomeArtista?.toLowerCase().includes(term)
    );
    return HttpResponse.json(filtered);
  }),
  http.get(buildUrl('/discos/:id'), ({ params }) => {
    const recordId = Number(params.id);
    const record = db.records.find((candidate) => candidate.discoId === recordId);
    return record ? HttpResponse.json(record) : notFound();
  }),
  http.post(buildUrl('/discos/criar'), async ({ request }) => {
    const body: RecordDTO = await parseBody(request, recordSchema);
    const discoId = body.discoId ?? nextId('records', 'discoId');
    const created: RecordDTO = { ...body, discoId };
    db.records.push(created);
    return HttpResponse.json(`Disco ${created.album} criado.`);
  }),
  http.put(buildUrl('/discos/atualizar'), async ({ request }) => {
    const body: RecordDTO = await parseBody(request, recordSchema);
    const index = db.records.findIndex((candidate) => candidate.discoId === body.discoId);
    if (index < 0) return notFound();
    db.records[index] = { ...db.records[index], ...body };
    return HttpResponse.json(db.records[index]);
  }),
  http.delete(buildUrl('/discos/:id'), ({ params }) => {
    const recordId = Number(params.id);
    const index = db.records.findIndex((candidate) => candidate.discoId === recordId);
    if (index < 0) return notFound();
    db.records.splice(index, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Vendas =====
  http.get(buildUrl('/vendas/lista'), () => HttpResponse.json(db.sales)),
  http.get(buildUrl('/vendas/:id'), ({ params }) => {
    const saleId = Number(params.id);
    const sale = db.sales.find((candidate) => candidate.vendaId === saleId);
    return sale ? HttpResponse.json(sale) : notFound();
  }),
  http.post(buildUrl('/vendas/criar'), async ({ request }) => {
    const body = await parseBody(request, salePayloadSchema);
    const saleId = body.vendaId ?? body.vendasId ?? nextId('sales', 'vendaId');
    const created: SaleDTO = saleResponseSchema.parse({ ...body, vendaId: saleId });
    db.sales.push(created);
    return HttpResponse.json('Venda criada.');
  }),
  http.put(buildUrl('/vendas/atualizar'), async ({ request }) => {
    const body = await parseBody(request, salePayloadSchema);
    const saleId = body.vendaId ?? body.vendasId;
    const index = db.sales.findIndex((candidate) => candidate.vendaId === saleId);
    if (index < 0) return notFound();
    db.sales[index] = saleResponseSchema.parse({ ...db.sales[index], ...body, vendaId: saleId });
    return HttpResponse.json(db.sales[index]);
  }),
  http.delete(buildUrl('/vendas/:id'), ({ params }) => {
    const saleId = Number(params.id);
    const index = db.sales.findIndex((candidate) => candidate.vendaId === saleId);
    if (index < 0) return notFound();
    db.sales.splice(index, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Compras =====
  http.get(buildUrl('/compras/lista'), () => HttpResponse.json(db.purchases)),
  http.get(buildUrl('/compras/:id'), ({ params }) => {
    const purchaseId = Number(params.id);
    const purchase = db.purchases.find((candidate) => candidate.compraId === purchaseId);
    return purchase ? HttpResponse.json(purchase) : notFound();
  }),
  http.post(buildUrl('/compras/criar'), async ({ request }) => {
    const body: PurchaseDTO = await parseBody(request, purchaseSchema);
    const compraId = body.compraId ?? nextId('purchases', 'compraId');
    const created: PurchaseDTO = { ...body, compraId };
    db.purchases.push(created);
    return HttpResponse.json('Compra criada.');
  }),
  http.put(buildUrl('/compras/atualizar'), async ({ request }) => {
    const body: PurchaseDTO = await parseBody(request, purchaseSchema);
    const index = db.purchases.findIndex((candidate) => candidate.compraId === body.compraId);
    if (index < 0) return notFound();
    db.purchases[index] = { ...db.purchases[index], ...body };
    return HttpResponse.json(db.purchases[index]);
  }),
  http.delete(buildUrl('/compras/:id'), ({ params }) => {
    const purchaseId = Number(params.id);
    const index = db.purchases.findIndex((candidate) => candidate.compraId === purchaseId);
    if (index < 0) return notFound();
    db.purchases.splice(index, 1);
    return HttpResponse.json('Removido.');
  }),

  // ===== Relatorios =====
  http.get(buildUrl('/relatorios/receita-detalhada'), ({ request }) => {
    const year = getQueryInt(request, 'ano');
    const month = getQueryInt(request, 'mes');
    return HttpResponse.json([
      {
        ano: year,
        mes: month,
        dataVenda: `${year}-${String(month).padStart(2, '0')}-15`,
        formaPagamento: 'PIX',
        nomeCanal: 'Site',
        estado: 'SP',
        nomeArtista: 'Stevie Wonder',
        nomeGenero: 'GROOVE',
        receitaDisco: 100,
      },
    ]);
  }),
  http.get(buildUrl('/relatorios/receita-despesa'), ({ request }) => {
    const year = getQueryInt(request, 'ano');
    const month = getQueryInt(request, 'mes');
    return HttpResponse.json([
      {
        ano: year,
        mes: month,
        receita: 500,
        custosAdicionais: 50,
        frete: 25,
        valorPago: 200,
        totalDespesa: 275,
        lucro: 225,
      },
    ]);
  }),
  http.get(buildUrl('/relatorios/receita-canal'), ({ request }) => {
    const year = getQueryInt(request, 'ano');
    const month = getQueryInt(request, 'mes');
    return HttpResponse.json([{ ano: year, mes: month, nomeCanal: 'Site', receita: 500 }]);
  }),
  http.get(buildUrl('/relatorios/lucroporitem'), ({ request }) => {
    const year = getQueryInt(request, 'ano');
    const month = getQueryInt(request, 'mes');
    const profitRow = profitPerItemSchema.parse({
      vendaId: 1,
      dataVenda: `${year}-${String(month).padStart(2, '0')}-15`,
      ano: year,
      mes: month,
      discoId: 10,
      nomeDisco: 'Innervisions',
      clienteId: 5,
      nomeCliente: 'Cliente Teste',
      formaPagamento: 'PIX',
      canalVendaId: 2,
      nomeCanal: 'Site',
      precoVenda: 450,
      custoDisco: 20.5,
      custosAdicionais: 0,
      freteDisco: 20,
      totalDespesa: 40.5,
      lucro: 409.5,
    });
    return HttpResponse.json([profitRow]);
  }),
];
