import { z } from 'zod';
import { apiClient } from './client';
import { purchaseSchema } from './schemas';
import type { PurchasePayload } from './types';

const BASE = '/compras';
const messageSchema = z.string();
const purchaseListSchema = z.array(purchaseSchema);

export const purchasesService = {
  list: (signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lista`, purchaseListSchema, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/${id}`, purchaseSchema, undefined, signal),

  create: (payload: PurchasePayload, signal?: AbortSignal) =>
    apiClient.post(`${BASE}/criar`, messageSchema, payload, signal),

  update: (payload: PurchasePayload, signal?: AbortSignal) =>
    apiClient.put(`${BASE}/atualizar`, purchaseSchema, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${id}`, messageSchema, signal),
};
