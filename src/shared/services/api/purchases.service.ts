import { apiClient } from './client';
import type { PurchasePayload, PurchaseDTO } from './types';

const BASE = '/compras';

export const purchasesService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<PurchaseDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<PurchaseDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: PurchasePayload, signal?: AbortSignal) =>
    apiClient.post<PurchaseDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: PurchasePayload, signal?: AbortSignal) =>
    apiClient.put<PurchaseDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
