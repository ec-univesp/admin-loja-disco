import { z } from 'zod';
import { apiClient } from './client';
import { musicGenreSchema } from './schemas';
import type { MusicGenrePayload } from './types';

const BASE = '/generos-musicais';
const messageSchema = z.string();
const genreListSchema = z.array(musicGenreSchema);

export const genresService = {
  list: (signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lista`, genreListSchema, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/${id}`, musicGenreSchema, undefined, signal),

  create: (payload: MusicGenrePayload, signal?: AbortSignal) =>
    apiClient.post(`${BASE}/criar`, messageSchema, payload, signal),

  update: (payload: MusicGenrePayload, signal?: AbortSignal) =>
    apiClient.put(`${BASE}/atualizar`, musicGenreSchema, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${id}`, messageSchema, signal),
};
