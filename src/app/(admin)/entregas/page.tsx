'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useVendas, useItensVenda, useDiscos } from '@/hooks/useStore';

const STATUS_ENTREGA = ['Confirmada', 'Enviada', 'Entregue', 'Cancelada'] as const;
type StatusEntrega = (typeof STATUS_ENTREGA)[number];

const statusColor: Record<string, string> = {
  Entregue: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Enviada: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Confirmada: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Cancelada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function EntregasPage() {
  const { vendasComDetalhes, fetchVendas } = useVendas();
  const { fetchItensVenda } = useItensVenda();
  const { fetchDiscos } = useDiscos();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  useEffect(() => {
    fetchVendas();
    fetchItensVenda();
    fetchDiscos();
  }, [fetchVendas, fetchItensVenda, fetchDiscos]);

  const entregas = useMemo(
    () =>
      vendasComDetalhes.filter((v) =>
        STATUS_ENTREGA.includes(v.statusPedido as StatusEntrega)
      ),
    [vendasComDetalhes]
  );

  const entregasFiltradas = useMemo(() => {
    const buscaNorm = busca.toLowerCase();
    return entregas.filter((v) => {
      const matchBusca =
        v.id.toLowerCase().includes(buscaNorm) ||
        v.clienteNome.toLowerCase().includes(buscaNorm) ||
        v.enderecoCompleto.toLowerCase().includes(buscaNorm) ||
        v.produtosResumo.toLowerCase().includes(buscaNorm);
      const matchStatus = filtroStatus === 'Todos' || v.statusPedido === filtroStatus;
      return matchBusca && matchStatus;
    });
  }, [entregas, busca, filtroStatus]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Entregas" />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATUS_ENTREGA.map((s) => (
          <div
            key={s}
            className="hover:border-brand-300 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
            onClick={() => setFiltroStatus(filtroStatus === s ? 'Todos' : s)}
          >
            <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">
              {entregas.filter((v) => v.statusPedido === s).length}
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
              {entregasFiltradas.length} entrega(s) encontrada(s)
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="Todos">Todos os Status</option>
              {STATUS_ENTREGA.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Buscar entrega..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <div className="flex gap-2">
              <Link
                href="/entregas/pendentes"
                className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              >
                Pendentes
              </Link>
              <Link
                href="/entregas/concluidas"
                className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                Concluidas
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
              {entregasFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                  >
                    Nenhuma entrega registrada.
                  </td>
                </tr>
              ) : (
                entregasFiltradas.map((venda) => (
                  <tr
                    key={venda.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                      {venda.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                      {venda.clienteNome}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {venda.produtosResumo}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {venda.enderecoCompleto}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[venda.statusPedido] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
                      >
                        {venda.statusPedido}
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
