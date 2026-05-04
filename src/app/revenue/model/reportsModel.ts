import { useQuery } from '@tanstack/react-query';
import { reportsService, type ReportFilters } from '@/shared/services/api';

export function useReportsModel(filters: ReportFilters) {
  const isAllMonths = filters.ano !== undefined && filters.mes === undefined;

  const fetchAllMonths = async <T>(
    fn: (f: ReportFilters, signal?: AbortSignal) => Promise<T[]>,
    signal?: AbortSignal
  ): Promise<T[]> => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const results = await Promise.all(
      months.map((mes) => fn({ ano: filters.ano, mes }, signal))
    );
    return results.flat();
  };

  const summary = useQuery({
    queryKey: ['reports', 'summary', filters],
    queryFn: ({ signal }) =>
      isAllMonths
        ? fetchAllMonths(reportsService.revenueSummary, signal)
        : reportsService.revenueSummary(filters, signal),
  });

  const byChannel = useQuery({
    queryKey: ['reports', 'channel', filters],
    queryFn: ({ signal }) =>
      isAllMonths
        ? fetchAllMonths(reportsService.channelRevenue, signal)
        : reportsService.channelRevenue(filters, signal),
  });

  const detailed = useQuery({
    queryKey: ['reports', 'detailed', filters],
    queryFn: ({ signal }) =>
      isAllMonths
        ? fetchAllMonths(reportsService.detailedRevenue, signal)
        : reportsService.detailedRevenue(filters, signal),
  });

  return { summary, byChannel, detailed };
}
