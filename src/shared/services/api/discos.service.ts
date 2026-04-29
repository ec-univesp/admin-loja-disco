import { apiClient } from './client';
import type { RequestDiscoDTO, ResponseDiscoDTO } from './types';

const BASE = '/discos';

export type BuscarDiscoQuery = {
  album?: string;
  artistaNome?: string;
};

export const discosService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<ResponseDiscoDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<ResponseDiscoDTO>(`${BASE}/${id}`, undefined, signal),

  buscar: (query: BuscarDiscoQuery, signal?: AbortSignal) =>
    apiClient.get<ResponseDiscoDTO[]>(`${BASE}/buscar`, query, signal),

  create: (payload: RequestDiscoDTO, signal?: AbortSignal) =>
    apiClient.post<ResponseDiscoDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: RequestDiscoDTO, signal?: AbortSignal) =>
    apiClient.put<ResponseDiscoDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
