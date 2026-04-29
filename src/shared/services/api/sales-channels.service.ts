import { apiClient } from './client';
import type { SalesChannelEntity, SalesChannelPayload, SalesChannelDTO } from './types';

const BASE = '/canais-venda';

export const salesChannelsService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<SalesChannelEntity[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<SalesChannelDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: SalesChannelPayload, signal?: AbortSignal) =>
    apiClient.post<SalesChannelDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: SalesChannelPayload, signal?: AbortSignal) =>
    apiClient.put<SalesChannelDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
