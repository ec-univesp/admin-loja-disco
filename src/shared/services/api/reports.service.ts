import { apiClient } from './client';
import type {
  ChannelRevenueDTO,
  RevenueSummaryDTO,
  DetailedRevenueDTO,
  ProfitPerItemDTO,
} from './types';

const BASE = '/relatorios';

export type ReportFilters = {
  ano?: number;
  mes?: number;
};

export const reportsService = {
  detailedRevenue: (filters?: ReportFilters, signal?: AbortSignal) =>
    apiClient.get<DetailedRevenueDTO[]>(
      `${BASE}/receita-detalhada`,
      filters,
      signal
    ),

  revenueSummary: (filters?: ReportFilters, signal?: AbortSignal) =>
    apiClient.get<RevenueSummaryDTO[]>(
      `${BASE}/receita-despesa`,
      filters,
      signal
    ),

  channelRevenue: (filters?: ReportFilters, signal?: AbortSignal) =>
    apiClient.get<ChannelRevenueDTO[]>(
      `${BASE}/receita-canal`,
      filters,
      signal
    ),

  profitPerItem: (filters: ReportFilters, signal?: AbortSignal) =>
    apiClient.get<ProfitPerItemDTO[]>(
      `${BASE}/lucroporitem`,
      filters,
      signal
    ),
};
