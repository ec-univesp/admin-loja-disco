import { apiClient } from './client';
import type { RecordPayload, RecordDTO } from './types';

const BASE = '/discos';

export type RecordSearchParams = {
  query: string;
};

export const recordsService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<RecordDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<RecordDTO>(`${BASE}/${id}`, undefined, signal),

  search: (params: RecordSearchParams, signal?: AbortSignal) =>
    apiClient.get<RecordDTO[]>(`${BASE}/buscar`, params, signal),

  create: (payload: RecordPayload, signal?: AbortSignal) =>
    apiClient.post<RecordDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: RecordPayload, signal?: AbortSignal) =>
    apiClient.put<RecordDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
