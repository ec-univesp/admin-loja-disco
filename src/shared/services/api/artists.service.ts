import { z } from 'zod';
import { apiClient } from './client';
import { artistSchema } from './schemas';
import type { ArtistPayload } from './types';

const BASE = '/artistas';
const messageSchema = z.unknown();
const artistListSchema = z.array(artistSchema);

export const artistsService = {
  list: (signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lista`, artistListSchema, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/${id}`, artistSchema, undefined, signal),

  create: (payload: ArtistPayload, signal?: AbortSignal) =>
    apiClient.post(`${BASE}/criar`, messageSchema, payload, signal),

  update: (payload: ArtistPayload, signal?: AbortSignal) =>
    apiClient.put(`${BASE}/atualizar`, artistSchema, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${id}`, messageSchema, signal),
};
