import { z } from 'zod';
import { apiClient } from './client';
import { addressSchema } from './schemas';
import type { AddressPayload } from './types';

const BASE = '/enderecos';
const messageSchema = z.string();
const addressListSchema = z.array(addressSchema);

export const addressesService = {
  list: (signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lista`, addressListSchema, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/${id}`, addressSchema, undefined, signal),

  create: (payload: AddressPayload, signal?: AbortSignal) =>
    apiClient.post(`${BASE}/criar`, messageSchema, payload, signal),

  update: (payload: AddressPayload, signal?: AbortSignal) =>
    apiClient.put(`${BASE}/atualizar`, addressSchema, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${id}`, messageSchema, signal),
};
