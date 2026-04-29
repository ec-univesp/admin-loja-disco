import { apiClient } from './client';
import type { MusicGenrePayload, MusicGenreDTO } from './types';

const BASE = '/generos-musicais';

export const genresService = {
  list: (signal?: AbortSignal) =>
    apiClient.get<MusicGenreDTO[]>(`${BASE}/lista`, undefined, signal),

  getById: (id: number, signal?: AbortSignal) =>
    apiClient.get<MusicGenreDTO>(`${BASE}/${id}`, undefined, signal),

  create: (payload: MusicGenrePayload, signal?: AbortSignal) =>
    apiClient.post<MusicGenreDTO>(`${BASE}/criar`, payload, signal),

  update: (payload: MusicGenrePayload, signal?: AbortSignal) =>
    apiClient.put<MusicGenreDTO>(`${BASE}/atualizar`, payload, signal),

  delete: (id: number, signal?: AbortSignal) =>
    apiClient.delete<void>(`${BASE}/${id}`, signal),
};
