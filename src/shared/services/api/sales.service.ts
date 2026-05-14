import { z } from 'zod';
import { ApiError, apiClient } from './client';
import { saleResponseSchema } from './schemas';
import type { SalePayload } from './types';

const BASE = '/vendas';
const messageSchema = z.unknown();
const saleListSchema = z.array(saleResponseSchema);

const shouldTryUpdateFallback = (error: unknown) =>
  error instanceof ApiError && (error.status === 404 || error.status === 405);

const updateSale = async (payload: SalePayload, signal?: AbortSignal) => {
  try {
    return await apiClient.patch(
      `${BASE}/atualizar/${payload.vendaId}`,
      messageSchema,
      payload,
      signal
    );
  } catch (error) {
    if (!shouldTryUpdateFallback(error)) throw error;
  }

  try {
    return await apiClient.put(
      `${BASE}/atualizar/${payload.vendaId}`,
      messageSchema,
      payload,
      signal
    );
  } catch (error) {
    if (!shouldTryUpdateFallback(error)) throw error;
  }

  return apiClient.put(`${BASE}/atualizar`, messageSchema, payload, signal);
};

export const salesService = {
  list: (signal?: AbortSignal) => apiClient.get(`${BASE}/lista`, saleListSchema, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/${id}`, saleResponseSchema, undefined, signal),

  create: (payload: SalePayload, signal?: AbortSignal) =>
    apiClient.post(`${BASE}/criar`, messageSchema, payload, signal),

  update: updateSale,

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${id}`, messageSchema, signal),
};
