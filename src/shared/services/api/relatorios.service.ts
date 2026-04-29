import { apiClient } from './client';
import type {
  ResponseReceitaCanalDTO,
  ResponseReceitaDespesaDTO,
  ResponseReceitaDetalhadaDTO,
} from './types';

const BASE = '/relatorios';

export const relatoriosService = {
  receitaDetalhada: (signal?: AbortSignal) =>
    apiClient.get<ResponseReceitaDetalhadaDTO[]>(
      `${BASE}/receita-detalhada`,
      undefined,
      signal
    ),

  receitaDespesa: (signal?: AbortSignal) =>
    apiClient.get<ResponseReceitaDespesaDTO[]>(
      `${BASE}/receita-despesa`,
      undefined,
      signal
    ),

  receitaCanal: (signal?: AbortSignal) =>
    apiClient.get<ResponseReceitaCanalDTO[]>(
      `${BASE}/receita-canal`,
      undefined,
      signal
    ),
};
