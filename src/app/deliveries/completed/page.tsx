'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useSalesStore, useSaleItemsStore, useRecordsStore } from '@/shared/store/useStore';

export default function CompletedDeliveriesPage() {
  const { salesWithDetails, fetchSales } = useSalesStore();
  const { fetchSaleItems } = useSaleItemsStore();
  const { fetchRecords } = useRecordsStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSales();
    fetchSaleItems();
    fetchRecords();
  }, [fetchSales, fetchSaleItems, fetchRecords]);

  const completedDeliveries = useMemo(
    () => salesWithDetails.filter((v) => v.orderStatus === 'Entregue'),
    [salesWithDetails]
  );

  const filteredDeliveries = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return completedDeliveries.filter(
      (v) =>
        v.id.toLowerCase().includes(normalizedSearch) ||
        v.customerName.toLowerCase().includes(normalizedSearch) ||
        v.fullAddress.toLowerCase().includes(normalizedSearch) ||
        v.productsSummary.toLowerCase().includes(normalizedSearch)
    );
  }, [completedDeliveries, searchTerm]);

  const totalRevenue = useMemo(
    () => completedDeliveries.reduce((acc, v) => acc + v.totalValue, 0),
    [completedDeliveries]
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Entregas Concluídas" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Total Entregue
          </p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {completedDeliveries.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Receita Total
          </p>
          <p className="text-brand-500 mt-1 text-2xl font-bold">
            R$ {totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Histórico de Entregas Concluídas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredDeliveries.length} entrega(s)
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Link
              href="/deliveries"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Todas as Entregas
            </Link>
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
                    Nenhuma entrega concluída.
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
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
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
