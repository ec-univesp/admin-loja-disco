import { z } from 'zod';
import { apiClient } from './client';
import { saleResponseSchema } from './schemas';
import type { SalePayload } from './types';

const BASE = '/vendas';
const messageSchema = z.unknown();
const saleListSchema = z.array(saleResponseSchema);

export const salesService = {
  list: (signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lista`, saleListSchema, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/${id}`, saleResponseSchema, undefined, signal),

  create: (payload: SalePayload, signal?: AbortSignal) =>
    apiClient.post(`${BASE}/criar`, messageSchema, payload, signal),

  update: (payload: SalePayload, signal?: AbortSignal) =>
    apiClient.put(`${BASE}/atualizar`, saleResponseSchema, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${id}`, messageSchema, signal),
};
