'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import EmptyState from '@/shared/components/ui/empty-state/EmptyState';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { OrderStatus } from '@/shared/types';
import { useSalesModel } from '@/app/sales/model/salesModel';
import { PaperPlaneIcon } from '@/shared/icons';

const DELIVERY_STATUSES = [
  OrderStatus.PENDENTE,
  OrderStatus.CONFIRMADA,
  OrderStatus.ENVIADA,
  OrderStatus.ENTREGUE,
  OrderStatus.CANCELADA,
];

const statusColor: Record<string, string> = {
  [OrderStatus.ENTREGUE]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [OrderStatus.ENVIADA]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [OrderStatus.CONFIRMADA]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [OrderStatus.PENDENTE]: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  [OrderStatus.CANCELADA]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusLabel: Record<string, string> = {
  [OrderStatus.PENDENTE]: 'Pendente',
  [OrderStatus.CONFIRMADA]: 'Confirmada',
  [OrderStatus.ENVIADA]: 'Enviada',
  [OrderStatus.ENTREGUE]: 'Entregue',
  [OrderStatus.CANCELADA]: 'Cancelada',
};

const formatSaleNumber = (id?: number) =>
  `VND-${String(id ?? 0).padStart(4, '0')}`;

const productsSummary = (itens?: { nomeDisco?: string }[]) => {
  if (!itens || itens.length === 0) return '—';
  const first = itens[0]?.nomeDisco ?? '—';
  return itens.length === 1 ? first : `${first} +${itens.length - 1}`;
};

const formatAddress = (
  endereco?: { logradouro?: string; numero?: number; cidade?: string; estado?: string }
) => {
  if (!endereco) return 'Endereço não informado';
  const parts = [
    [endereco.logradouro, endereco.numero].filter(Boolean).join(', '),
    [endereco.cidade, endereco.estado].filter(Boolean).join('/'),
  ].filter(Boolean);
  return parts.length ? parts.join(' - ') : 'Endereço não informado';
};

export default function DeliveriesPage() {
  const { list } = useSalesModel();
  const sales = useMemo(() => list.data ?? [], [list.data]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(OrderStatus.PENDENTE);

  const deliveries = useMemo(
    () =>
      sales
        .filter((s) => (DELIVERY_STATUSES as string[]).includes(s.statusPedido ?? ''))
        .map((s) => ({
          id: s.vendaId,
          number: formatSaleNumber(s.vendaId),
          customerName: s.cliente?.nomeCliente ?? '—',
          fullAddress: formatAddress(s.endereco),
          productsSummary: productsSummary(s.itens),
          status: s.statusPedido ?? OrderStatus.PENDENTE,
        })),
    [sales]
  );

  const filteredDeliveries = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return deliveries.filter((v) => {
      const matchSearch =
        v.number.toLowerCase().includes(q) ||
        v.customerName.toLowerCase().includes(q) ||
        v.fullAddress.toLowerCase().includes(q) ||
        v.productsSummary.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'Todos' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [deliveries, searchTerm, statusFilter]);

  const isLoading = list.isLoading;
  const hasAny = deliveries.length > 0;

  return (
    <div>
      <PageBreadcrumb pageTitle="Entregas" />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {DELIVERY_STATUSES.map((s) => {
          const count = deliveries.filter((v) => v.status === s).length;
          const active = statusFilter === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(active ? 'Todos' : s)}
              className={`hover:border-brand-300 cursor-pointer rounded-xl border p-4 text-left transition-colors dark:bg-white/3 ${
                active
                  ? 'border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10'
                  : 'border-gray-200 bg-white dark:border-gray-800'
              }`}
            >
              <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{statusLabel[s] ?? s}</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
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
                  {statusLabel[s] ?? s}
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

        {!hasAny && !isLoading ? (
          <EmptyState
            icon={<PaperPlaneIcon className="size-6" />}
            title="Nenhuma entrega registrada ainda"
            description="Assim que uma venda for confirmada, ela aparecerá aqui para acompanhamento de despacho e entrega."
            action={
              <Link
                href="/sales?novo=1"
                className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                + Registrar nova venda
              </Link>
            }
            className="border-t border-gray-100 dark:border-gray-800"
          />
        ) : (
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
                      Nenhuma entrega corresponde aos filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-white/2"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                        {delivery.number}
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
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[delivery.status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
                        >
                          {statusLabel[delivery.status] ?? delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
