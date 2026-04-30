'use client';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { useSalesModel } from '@/app/sales/model/salesModel';
import { OrderStatus } from '@/shared/types';
import { formatBRL } from '@/shared/utils/currency';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];
const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
const REVENUE_STATUSES = new Set<string>([
  OrderStatus.DELIVERED,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
]);

export default function MonthlySalesChart() {
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [month, setMonth] = useState<number>(0);
  const { list } = useSalesModel();
  const sales = useMemo(() => list.data ?? [], [list.data]);

  const allMonthsData = useMemo(() => {
    const totals = Array.from({ length: 12 }, () => 0);
    for (const sale of sales) {
      if (!sale.dataVenda) continue;
      if (!REVENUE_STATUSES.has(sale.statusPedido ?? '')) continue;
      const d = new Date(sale.dataVenda);
      if (d.getFullYear() !== year) continue;
      totals[d.getMonth()] += sale.valorTotal ?? 0;
    }
    return totals;
  }, [sales, year]);

  const hasData = allMonthsData.some((v) => v > 0);

  const options: ApexOptions = {
    colors: ['#374151'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: 280,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '39%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: month === 0 ? MONTHS : [MONTHS[month - 1]],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatBRL(val);
        },
      },
    },
  };

  const series = [
    {
      name: 'Vendas',
      data: month === 0 ? allMonthsData : [allMonthsData[month - 1]],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-4 sm:px-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Vendas Mensais</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Total de vendas por mês
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="text-theme-sm shadow-theme-xs h-10 rounded-lg border border-gray-300 bg-white px-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {AVAILABLE_YEARS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="text-theme-sm shadow-theme-xs h-10 rounded-lg border border-gray-300 bg-white px-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value={0}>Todos os meses</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {series && <ReactApexChart options={options} series={series} type="bar" height={280} />}
      {!hasData && (
        <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
          Sem vendas registradas em {year}.
        </p>
      )}
    </div>
  );
}
