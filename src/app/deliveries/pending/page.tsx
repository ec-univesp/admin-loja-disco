'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useSalesStore, useSaleItemsStore, useRecordsStore } from '@/shared/store/useStore';

export default function PendingDeliveriesPage() {
  const { salesWithDetails, fetchSales } = useSalesStore();
  const { fetchSaleItems } = useSaleItemsStore();
  const { fetchRecords } = useRecordsStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSales();
    fetchSaleItems();
    fetchRecords();
  }, [fetchSales, fetchSaleItems, fetchRecords]);

  const pendingDeliveries = useMemo(
    () =>
      salesWithDetails.filter(
        (v) => v.statusPedido === 'Confirmada' || v.statusPedido === 'Enviada'
      ),
    [salesWithDetails]
  );

  const filteredDeliveries = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return pendingDeliveries.filter(
      (v) =>
        v.id.toLowerCase().includes(normalizedSearch) ||
        v.customerName.toLowerCase().includes(normalizedSearch) ||
        v.fullAddress.toLowerCase().includes(normalizedSearch) ||
        v.productsSummary.toLowerCase().includes(normalizedSearch)
    );
  }, [pendingDeliveries, searchTerm]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Entregas Pendentes" />

      <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4 dark:border-yellow-800/50 dark:bg-yellow-900/20">
        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
          Existem <strong>{pendingDeliveries.length}</strong> entrega(s) aguardando despacho ou em
          trânsito.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Pendentes de Despacho
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
                    Nenhuma entrega pendente.
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
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          delivery.statusPedido === 'Enviada'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        {delivery.statusPedido}
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
