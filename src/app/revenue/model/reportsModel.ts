import { useQuery } from '@tanstack/react-query';
import { reportsService, type ReportFilters } from '@/shared/services/api';

export function useReportsModel(filters: ReportFilters) {
  const summary = useQuery({
    queryKey: ['reports', 'summary', filters],
    queryFn: ({ signal }) => reportsService.revenueSummary(filters, signal),
  });

  const byChannel = useQuery({
    queryKey: ['reports', 'channel', filters],
    queryFn: ({ signal }) => reportsService.channelRevenue(filters, signal),
  });

  const detailed = useQuery({
    queryKey: ['reports', 'detailed', filters],
    queryFn: ({ signal }) => reportsService.detailedRevenue(filters, signal),
  });

  return { summary, byChannel, detailed };
}
