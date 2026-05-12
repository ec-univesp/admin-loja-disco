import { useQuery } from '@tanstack/react-query';
import { reportsService, type ReportFilters } from '@/shared/services/api';

type ReportsModelFilters = {
  ano: number;
  mes?: number;
};

export function useReportsModel(filters: ReportsModelFilters) {
  const isAllMonths = filters.mes === undefined;

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

  const callWithMonth = <T>(
    fn: (f: ReportFilters, signal?: AbortSignal) => Promise<T[]>,
    signal?: AbortSignal
  ): Promise<T[]> => {
    if (isAllMonths) return fetchAllMonths(fn, signal);
    return fn({ ano: filters.ano, mes: filters.mes as number }, signal);
  };

  const summary = useQuery({
    queryKey: ['reports', 'summary', filters],
    queryFn: ({ signal }) => callWithMonth(reportsService.revenueSummary, signal),
  });

  const byChannel = useQuery({
    queryKey: ['reports', 'channel', filters],
    queryFn: ({ signal }) => callWithMonth(reportsService.channelRevenue, signal),
  });

  const detailed = useQuery({
    queryKey: ['reports', 'detailed', filters],
    queryFn: ({ signal }) => callWithMonth(reportsService.detailedRevenue, signal),
  });

  return { summary, byChannel, detailed };
}
