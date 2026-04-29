import { apiClient } from './client';
import type { ArtistPayload, ArtistDTO } from './types';

const BASE = '/artistas';

export const artistsService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<ArtistDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<ArtistDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: ArtistPayload, signal?: AbortSignal) =>
    apiClient.post<ArtistDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: ArtistPayload, signal?: AbortSignal) =>
    apiClient.put<ArtistDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
