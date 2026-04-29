import { apiClient } from './client';
import type { RequestArtistaDTO, ResponseArtistaDTO } from './types';

const BASE = '/artistas';

export const artistasService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<ResponseArtistaDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<ResponseArtistaDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: RequestArtistaDTO, signal?: AbortSignal) =>
    apiClient.post<ResponseArtistaDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: RequestArtistaDTO, signal?: AbortSignal) =>
    apiClient.put<ResponseArtistaDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
