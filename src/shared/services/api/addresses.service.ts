import { apiClient } from './client';
import type { AddressPayload, AddressDTO } from './types';

const BASE = '/enderecos';

export const addressesService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<AddressDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<AddressDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: AddressPayload, signal?: AbortSignal) =>
    apiClient.post<AddressDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: AddressPayload, signal?: AbortSignal) =>
    apiClient.put<AddressDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
