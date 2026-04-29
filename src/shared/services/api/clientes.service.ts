import { apiClient } from './client';
import type { RequestClienteDTO, ResponseClienteDTO } from './types';

const BASE = '/clientes';

export const clientesService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<ResponseClienteDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<ResponseClienteDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: RequestClienteDTO, signal?: AbortSignal) =>
    apiClient.post<ResponseClienteDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: RequestClienteDTO, signal?: AbortSignal) =>
    apiClient.put<ResponseClienteDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
