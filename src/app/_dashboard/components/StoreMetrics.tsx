'use client';
import React, { useMemo } from 'react';
import { ArrowUpIcon, BoxIconLine, DollarLineIcon, GroupIcon } from '@/shared/icons';
import { useSalesModel } from '@/app/sales/model/salesModel';
import { useCustomersModel } from '@/app/sales/model/customersModel';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import { OrderStatus } from '@/shared/types';
import { formatBRL } from '@/shared/utils/currency';

const COMPLETED = new Set<string>([
  OrderStatus.DELIVERED,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
]);

type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const MetricCard = ({ icon, label, value }: MetricCardProps) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
      {icon}
    </div>
    <div className="mt-5">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">{value}</h4>
    </div>
  </div>
);

export const StoreMetrics = () => {
  const { list: salesList } = useSalesModel();
  const { list: customersList } = useCustomersModel();
  const { listAvailable: availableList } = useRecordsModel();

  const sales = useMemo(() => salesList.data ?? [], [salesList.data]);
  const customers = useMemo(() => customersList.data ?? [], [customersList.data]);
  const availableRecords = useMemo(() => availableList.data ?? [], [availableList.data]);

  const metrics = useMemo(() => {
    const now = new Date();
    const ano = now.getFullYear();
    const mes = now.getMonth();

    const salesThisMonth = sales.filter((s) => {
      if (!s.dataVenda) return false;
      const d = new Date(s.dataVenda);
      return d.getFullYear() === ano && d.getMonth() === mes;
    });

    const revenue = salesThisMonth
      .filter((s) => COMPLETED.has(s.statusPedido ?? ''))
      .reduce((acc, s) => acc + (s.valorTotal ?? 0), 0);

    return {
      customers: customers.length,
      inStock: availableRecords.length,
      salesThisMonth: salesThisMonth.length,
      revenue,
    };
  }, [sales, customers, availableRecords]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      <MetricCard
        icon={<GroupIcon className="size-6 text-gray-800 dark:text-white/90" />}
        label="Clientes cadastrados"
        value={metrics.customers.toLocaleString('pt-BR')}
      />
      <MetricCard
        icon={<BoxIconLine className="text-gray-800 dark:text-white/90" />}
        label="Discos em estoque"
        value={metrics.inStock.toLocaleString('pt-BR')}
      />
      <MetricCard
        icon={<ArrowUpIcon className="size-6 text-gray-800 dark:text-white/90" />}
        label="Vendas no mês"
        value={metrics.salesThisMonth.toLocaleString('pt-BR')}
      />
      <MetricCard
        icon={<DollarLineIcon className="size-6 text-gray-800 dark:text-white/90" />}
        label="Receita do mês"
        value={formatBRL(metrics.revenue)}
      />
    </div>
  );
};
