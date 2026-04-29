import { apiClient } from './client';
import type { CanalVendaEntity, RequestCanalVendaDTO, ResponseCanalVendaDTO } from './types';

const BASE = '/canais-venda';

export const canaisVendaService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<CanalVendaEntity[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<ResponseCanalVendaDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: RequestCanalVendaDTO, signal?: AbortSignal) =>
    apiClient.post<ResponseCanalVendaDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: RequestCanalVendaDTO, signal?: AbortSignal) =>
    apiClient.put<ResponseCanalVendaDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
