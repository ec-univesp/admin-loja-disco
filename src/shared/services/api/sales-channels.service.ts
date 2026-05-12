import { z } from 'zod';
import { apiClient } from './client';
import { salesChannelSchema } from './schemas';
import type { SalesChannelPayload } from './types';

const BASE = '/canais-venda';
const messageSchema = z.unknown();
const channelListSchema = z.array(salesChannelSchema);

export const salesChannelsService = {
  list: (signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lista`, channelListSchema, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/${id}`, salesChannelSchema, undefined, signal),

  create: (payload: SalesChannelPayload, signal?: AbortSignal) =>
    apiClient.post(`${BASE}/criar`, messageSchema, payload, signal),

  update: (payload: SalesChannelPayload, signal?: AbortSignal) =>
    apiClient.put(`${BASE}/atualizar`, salesChannelSchema, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete(`${BASE}/${id}`, messageSchema, signal),
};
