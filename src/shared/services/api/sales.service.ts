import { apiClient } from './client';
import type { SalePayload, SaleDTO } from './types';

const BASE = '/vendas';

export const salesService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<SaleDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<SaleDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: SalePayload, signal?: AbortSignal) =>
    apiClient.post<SaleDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: SalePayload, signal?: AbortSignal) =>
    apiClient.put<SaleDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
