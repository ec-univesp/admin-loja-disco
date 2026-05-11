import { z } from 'zod';
import { apiClient } from './client';
import {
  channelRevenueSchema,
  detailedRevenueSchema,
  profitPerItemSchema,
  revenueSummarySchema,
} from './schemas';

const BASE = '/relatorios';

const detailedRevenueListSchema = z.array(detailedRevenueSchema);
const revenueSummaryListSchema = z.array(revenueSummarySchema);
const channelRevenueListSchema = z.array(channelRevenueSchema);
const profitPerItemListSchema = z.array(profitPerItemSchema);

export type ReportFilters = {
  ano?: number;
  mes?: number;
};

export const reportsService = {
  detailedRevenue: (filters?: ReportFilters, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/receita-detalhada`, detailedRevenueListSchema, filters, signal),

  revenueSummary: (filters?: ReportFilters, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/receita-despesa`, revenueSummaryListSchema, filters, signal),

  channelRevenue: (filters?: ReportFilters, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/receita-canal`, channelRevenueListSchema, filters, signal),

  profitPerItem: (filters: ReportFilters, signal?: AbortSignal) =>
    apiClient.get(`${BASE}/lucroporitem`, profitPerItemListSchema, filters, signal),
};
