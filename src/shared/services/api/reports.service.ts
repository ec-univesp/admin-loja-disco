import { apiClient } from './client';
import type {
  ChannelRevenueDTO,
  RevenueSummaryDTO,
  DetailedRevenueDTO,
} from './types';

const BASE = '/relatorios';

export const reportsService = {
  detailedRevenue: (signal?: AbortSignal) =>
    apiClient.get<DetailedRevenueDTO[]>(
      `${BASE}/receita-detalhada`,
      undefined,
      signal
    ),

  revenueSummary: (signal?: AbortSignal) =>
    apiClient.get<RevenueSummaryDTO[]>(
      `${BASE}/receita-despesa`,
      undefined,
      signal
    ),

  channelRevenue: (signal?: AbortSignal) =>
    apiClient.get<ChannelRevenueDTO[]>(
      `${BASE}/receita-canal`,
      undefined,
      signal
    ),
};
