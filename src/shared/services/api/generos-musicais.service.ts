import { apiClient } from './client';
import type {
  RequestGeneroMusicalDTO,
  ResponseGeneroMusicalDTO,
} from './types';

const BASE = '/generos-musicais';

export const generosMusicaisService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<ResponseGeneroMusicalDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<ResponseGeneroMusicalDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: RequestGeneroMusicalDTO, signal?: AbortSignal) =>
    apiClient.post<ResponseGeneroMusicalDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: RequestGeneroMusicalDTO, signal?: AbortSignal) =>
    apiClient.put<ResponseGeneroMusicalDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
