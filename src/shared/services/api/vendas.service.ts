import { apiClient } from './client';
import type { RequestVendaDTO, ResponseVendaDTO } from './types';

const BASE = '/vendas';

export const vendasService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<ResponseVendaDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<ResponseVendaDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: RequestVendaDTO, signal?: AbortSignal) =>
    apiClient.post<ResponseVendaDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: RequestVendaDTO, signal?: AbortSignal) =>
    apiClient.put<ResponseVendaDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
