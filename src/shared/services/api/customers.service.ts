import { apiClient } from './client';
import type { CustomerPayload, CustomerDTO } from './types';

const BASE = '/clientes';

export const customersService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<CustomerDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<CustomerDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: CustomerPayload, signal?: AbortSignal) =>
    apiClient.post<CustomerDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: CustomerPayload, signal?: AbortSignal) =>
    apiClient.put<CustomerDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
