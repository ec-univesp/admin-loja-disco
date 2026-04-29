'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import Button from '@/shared/components/ui/button/Button';
import React, { useMemo, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useSalesModel } from '@/app/sales/model/salesModel';
import { useGenresModel } from '@/app/inventory/model/genresModel';
import { useAppStore } from '@/shared/store/appStore';
import { useReportsModel } from '@/app/revenue/model/reportsModel';
import {
  exportFullBackup,
  exportFinancialReport,
  exportFinancialReportCSV,
} from '@/shared/services/exportExcel';
type Dimension = 'canal' | 'genero' | 'artista' | 'estado' | 'pagamento';

const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];
const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

const DIMENSIONS: { key: Dimension; label: string }[] = [
  { key: 'canal', label: 'Canal de Venda' },
  { key: 'genero', label: 'Gênero Musical' },
  { key: 'artista', label: 'Artista' },
  { key: 'estado', label: 'Estado' },
  { key: 'pagamento', label: 'Forma de Pagamento' },
];

function groupBy(
  entries: [string, number][]
): { label: string; total: number; percentual: number }[] {
  const grand = entries.reduce((acc, [, v]) => acc + v, 0) || 1;
  return entries
    .map(([label, total]) => ({ label, total, percentual: Math.round((total / grand) * 100) }))
    .sort((a, b) => b.total - a.total);
}

export default function RevenuePage() {
  const { list: salesQuery } = useSalesModel();
  const { list: genresQuery } = useGenresModel();
  const fullState = useAppStore();
  const sales = salesQuery.data ?? [];
  const genres = genresQuery.data ?? [];

  const [yearFilter, setYearFilter] = useState<number>(CURRENT_YEAR);
  const [monthFilter, setMonthFilter] = useState<number>(0);
  const [dimension, setDimension] = useState<Dimension>('genero');

  const reportFilters = useMemo(
    () => (monthFilter === 0 ? { ano: yearFilter } : { ano: yearFilter, mes: monthFilter }),
    [yearFilter, monthFilter]
  );

  const { summary, byChannel, detailed } = useReportsModel(reportFilters);

  const filteredSales = useMemo(
    () =>
      sales.filter((v) => {
        const d = new Date(v.dataVenda ?? '');
        return (
          d.getFullYear() === yearFilter &&
          (monthFilter === 0 || d.getMonth() + 1 === monthFilter)
        );
      }),
    [sales, yearFilter, monthFilter]
  );

  const monthlyRevenueData = useMemo(
    () =>
      (summary.data ?? []).map((r) => ({
        month: MONTH_LABELS[(r.mes ?? 1) - 1] ?? String(r.mes),
        revenue: r.receita ?? 0,
        expenses: r.totalDespesa ?? 0,
        profit: r.lucro ?? 0,
      })),
    [summary.data]
  );

  const monthlyRevenue = monthlyRevenueData;

  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((s, m) => s + m.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  const channelRevenueData = useMemo(
    () =>
      byChannel.data
        ? groupBy(
            byChannel.data.map(
              (c) => [c.nomeCanal ?? 'Sem canal', c.receita ?? 0] as [string, number]
            )
          )
        : [],
    [byChannel.data]
  );

  const channelRevenue = channelRevenueData;
  const isChannelEmpty = !byChannel.isFetching && channelRevenueData.length === 0;

  const dimensionData = useMemo(() => {
    const items = detailed.data ?? [];
    const map = new Map<string, number>();

    if (dimension === 'canal') {
      items.forEach((item) => {
        const nome = item.nomeCanal ?? 'Sem canal';
        map.set(nome, (map.get(nome) ?? 0) + (item.receitaDisco ?? 0));
      });
    } else if (dimension === 'pagamento') {
      items.forEach((item) => {
        const forma = item.formaPagamento ?? 'Não informado';
        map.set(forma, (map.get(forma) ?? 0) + (item.receitaDisco ?? 0));
      });
    } else if (dimension === 'estado') {
      items.forEach((item) => {
        const est = item.estado ?? 'Sem estado';
        map.set(est, (map.get(est) ?? 0) + (item.receitaDisco ?? 0));
      });
    } else if (dimension === 'genero') {
      items.forEach((item) => {
        const nome = item.nomeGenero ?? 'Sem gênero';
        map.set(nome, (map.get(nome) ?? 0) + (item.receitaDisco ?? 0));
      });
    } else if (dimension === 'artista') {
      items.forEach((item) => {
        const nome = item.nomeArtista ?? 'Desconhecido';
        map.set(nome, (map.get(nome) ?? 0) + (item.receitaDisco ?? 0));
      });
    }

    return groupBy(Array.from(map.entries()));
  }, [dimension, detailed.data]);

  const dimensionRevenue = dimensionData;
  const isDimensionEmpty = !detailed.isFetching && dimensionData.length === 0;

  const salesDetails = filteredSales.map((v) => ({
    id: String(v.vendaId ?? ''),
    data: v.dataVenda ?? '',
    cliente: v.cliente?.nomeCliente ?? '',
    canal: v.canalVenda?.nomeCanalVenda ?? '',
    pagamento: v.pagamento ?? '',
    frete: v.frete ?? 0,
    custosAdicionais: v.custosAdicionais ?? 0,
    total: v.valorTotal ?? 0,
    status: v.statusPedido ?? '',
  }));

  const handleExportReport = () =>
    exportFinancialReport({
      monthlySummary: monthlyRevenue,
      topProducts: [],
      paymentMethods: channelRevenue.map((c) => ({
        forma: c.label,
        total: c.total,
        percentual: c.percentual,
      })),
      salesDetails,
    });

  const handleExportCSV = () =>
    exportFinancialReportCSV({ monthlySummary: monthlyRevenue, salesDetails });

  const handleFullBackup = () => exportFullBackup(fullState, genres);

  return (
    <div>
      <PageBreadcrumb pageTitle="Relatório Financeiro" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Ano
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(Number(e.target.value))}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              {AVAILABLE_YEARS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Mês
            </label>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(Number(e.target.value))}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value={0}>Todos os meses</option>
              {MONTH_LABELS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            Exportar Relatório (CSV)
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            Exportar Relatório (Excel)
          </Button>
          <Button variant="primary" size="sm" onClick={handleFullBackup}>
            Backup Completo (Excel)
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Receita Total"
          value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub="Soma das vendas no período"
          color="text-gray-800 dark:text-white"
        />
        <KpiCard
          title="Despesas"
          value={`R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub="Compras + frete + custos adicionais"
          color="text-red-500"
        />
        <KpiCard
          title="Lucro Líquido"
          value={`R$ ${netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub={`Margem: ${totalRevenue ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0'}%`}
          color="text-green-600"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Canal de Venda
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                Total:{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  R$ {totalRevenue.toFixed(2)}
                </span>
              </span>
            </div>
          </div>
          <p className="mb-4 text-xs text-gray-400">
            Receita por canal —{' '}
            {monthFilter === 0
              ? `ano ${yearFilter}`
              : `${MONTH_LABELS[monthFilter - 1]}/${yearFilter}`}
          </p>
          {isChannelEmpty ? <EmptyPeriod /> : <BarChart data={channelRevenue} color="#465FFF" />}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Resultado Mensal
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="py-2 text-left font-medium text-gray-500">Mês</th>
                  <th className="py-2 text-right font-medium text-gray-500">Receita</th>
                  <th className="py-2 text-right font-medium text-gray-500">Despesas</th>
                  <th className="py-2 text-right font-medium text-gray-500">Lucro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {monthlyRevenue.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">
                      Dados não registrados no mês selecionado.
                    </td>
                  </tr>
                ) : (
                  monthlyRevenue.map((m) => (
                    <tr key={m.month}>
                      <td className="py-3 font-medium text-gray-700 dark:text-gray-300">{m.month}</td>
                      <td className="py-3 text-right text-green-600">R$ {m.revenue.toFixed(2)}</td>
                      <td className="py-3 text-right text-red-500">R$ {m.expenses.toFixed(2)}</td>
                      <td className="py-3 text-right font-semibold text-gray-800 dark:text-white">
                        R$ {m.profit.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Análise de Receita
              </h3>

            </div>
            <p className="mt-0.5 text-xs text-gray-400">
              {monthFilter === 0
                ? `Ano ${yearFilter}`
                : `${MONTH_LABELS[monthFilter - 1]}/${yearFilter}`}
              {' · '}Receita base:{' '}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                R$ {totalRevenue.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {DIMENSIONS.map((d) => (
            <button
              key={d.key}
              onClick={() => setDimension(d.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                dimension === d.key
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {isDimensionEmpty ? (
          <EmptyPeriod />
        ) : (
          <BarChart data={dimensionRevenue} color={DIMENSION_COLORS[dimension]} />
        )}
      </div>
    </div>
  );
}

const DIMENSION_COLORS: Record<Dimension, string> = {
  canal: '#465FFF',
  genero: '#8B5CF6',
  artista: '#F59E0B',
  estado: '#14B8A6',
  pagamento: '#F43F5E',
};

function EmptyPeriod() {
  return (
    <div className="flex h-32 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
      Dados não registrados no mês selecionado.
    </div>
  );
}

function KpiCard({
  title,
  value,
  sub,
  color,
}: {
  title: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
      <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">{title}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function BarChart({
  data,
  color,
}: {
  data: { label: string; total: number; percentual: number }[];
  color: string;
}) {
  const categories = data.map((d) => d.label);
  const values = data.map((d) => parseFloat(d.total.toFixed(2)));
  const height = Math.max(160, categories.length * 46);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
      background: 'transparent',
      animations: { enabled: true, speed: 500 },
    },
    colors: [color],
    plotOptions: {
      bar: { horizontal: true, barHeight: '58%', borderRadius: 5, borderRadiusApplication: 'end' },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      style: { fontSize: '11px', fontWeight: 600, colors: ['#fff'] },
      dropShadow: { enabled: false },
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: (val) =>
          `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
        style: { fontSize: '11px', colors: '#9CA3AF' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontSize: '12px', colors: '#6B7280' }, maxWidth: 170 } },
    grid: {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      borderColor: '#F3F4F6',
      padding: { left: 0, right: 20 },
    },
    tooltip: {
      y: { formatter: (val) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
    },
    theme: { mode: 'light' },
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ name: 'Receita (R$)', data: values }]}
      type="bar"
      height={height}
    />
  );
}
