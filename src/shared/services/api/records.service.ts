import { z } from 'zod';
import { apiClient } from './client';
import { recordSchema, recordSearchParamsSchema } from './schemas';
import type { RecordPayload, RecordSearchParams } from './types';

const BASE = '/discos';
const messageSchema = z.unknown();
const recordListSchema = z.array(recordSchema);

export type { RecordSearchParams };

export const recordsService = {
  list: (signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lista`, recordListSchema, undefined, signal),

  listFiltered: (tipo: 1 | 2, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lista-filtrada/${tipo}`, recordListSchema, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/${id}`, recordSchema, undefined, signal),

  search: (params: RecordSearchParams, signal?: AbortSignal) => {
    const validated = recordSearchParamsSchema.parse(params);
    return apiClient.get(`${BASE}/buscar`, recordListSchema, validated, signal);
  },

  create: (payload: RecordPayload, signal?: AbortSignal) =>
    apiClient.post(`${BASE}/criar`, messageSchema, payload, signal),

  update: (payload: RecordPayload, signal?: AbortSignal) =>
    apiClient.put(`${BASE}/atualizar`, recordSchema, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${id}`, messageSchema, signal),
};
