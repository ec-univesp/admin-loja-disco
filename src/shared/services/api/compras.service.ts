import { apiClient } from './client';
import type { RequestCompraDTO, ResponseCompraDTO } from './types';

const BASE = '/compras';

export const comprasService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<ResponseCompraDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<ResponseCompraDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: RequestCompraDTO, signal?: AbortSignal) =>
    apiClient.post<ResponseCompraDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: RequestCompraDTO, signal?: AbortSignal) =>
    apiClient.put<ResponseCompraDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
