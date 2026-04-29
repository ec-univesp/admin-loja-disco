'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useSalesStore, useSaleItemsStore, useRecordsStore } from '@/shared/store/useStore';

const DELIVERY_STATUSES = ['Confirmada', 'Enviada', 'Entregue', 'Cancelada'];
type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

const statusColor: Record<string, string> = {
  Entregue: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Enviada: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Confirmada: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Cancelada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function DeliveriesPage() {
  const { salesWithDetails, fetchSales } = useSalesStore();
  const { fetchSaleItems } = useSaleItemsStore();
  const { fetchRecords } = useRecordsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  useEffect(() => {
    fetchSales();
    fetchSaleItems();
    fetchRecords();
  }, [fetchSales, fetchSaleItems, fetchRecords]);

  const deliveries = useMemo(
    () =>
      salesWithDetails.filter((v) =>
        DELIVERY_STATUSES.includes(v.orderStatus as DeliveryStatus)
      ),
    [salesWithDetails]
  );

  const filteredDeliveries = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return deliveries.filter((v) => {
      const matchSearch =
        v.id.toLowerCase().includes(normalizedSearch) ||
        v.customerName.toLowerCase().includes(normalizedSearch) ||
        v.fullAddress.toLowerCase().includes(normalizedSearch) ||
        v.productsSummary.toLowerCase().includes(normalizedSearch);
      const matchStatus = statusFilter === 'Todos' || v.orderStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [deliveries, searchTerm, statusFilter]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Entregas" />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {DELIVERY_STATUSES.map((s) => (
          <div
            key={s}
            className="hover:border-brand-300 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
            onClick={() => setStatusFilter(statusFilter === s ? 'Todos' : s)}
          >
            <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">
              {deliveries.filter((v) => v.orderStatus === s).length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Todas as Entregas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredDeliveries.length} entrega(s) encontrada(s)
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="Todos">Todos os Status</option>
              {DELIVERY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Buscar entrega..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <div className="flex gap-2">
              <Link
                href="/deliveries/pending"
                className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              >
                Pendentes
              </Link>
              <Link
                href="/deliveries/completed"
                className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                Concluídas
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Venda
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Produto
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Endereço
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                  >
                    Nenhuma entrega registrada.
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                      {delivery.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                      {delivery.customerName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {delivery.productsSummary}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {delivery.fullAddress}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[delivery.orderStatus] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
                      >
                        {delivery.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
