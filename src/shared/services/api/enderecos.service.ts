import { apiClient } from './client';
import type { RequestEnderecoDTO, ResponseEnderecoDTO } from './types';

const BASE = '/enderecos';

export const enderecosService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<ResponseEnderecoDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<ResponseEnderecoDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: RequestEnderecoDTO, signal?: AbortSignal) =>
    apiClient.post<ResponseEnderecoDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: RequestEnderecoDTO, signal?: AbortSignal) =>
    apiClient.put<ResponseEnderecoDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
