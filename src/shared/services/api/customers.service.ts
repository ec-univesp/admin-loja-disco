import { z } from 'zod';
import { apiClient } from './client';
import { customerSchema } from './schemas';
import type { CustomerPayload } from './types';

const BASE = '/clientes';
const messageSchema = z.unknown();
const customerListSchema = z.array(customerSchema);

export const customersService = {
  list: (signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lista`, customerListSchema, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/${id}`, customerSchema, undefined, signal),

  create: (payload: CustomerPayload, signal?: AbortSignal) =>
    apiClient.post(`${BASE}/criar`, messageSchema, payload, signal),

  update: (payload: CustomerPayload, signal?: AbortSignal) =>
    apiClient.put(`${BASE}/atualizar`, customerSchema, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${id}`, messageSchema, signal),
};
