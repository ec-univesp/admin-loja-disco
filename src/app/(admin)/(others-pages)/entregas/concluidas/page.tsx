'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useVendas } from '@/hooks/useStore';

export default function EntregasConcluidasPage() {
  const { vendasComDetalhes, fetchVendas } = useVendas();
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetchVendas();
  }, [fetchVendas]);

  const concluidas = useMemo(
    () => vendasComDetalhes.filter((v) => v.statusPedido === 'Entregue'),
    [vendasComDetalhes]
  );

  const filtradas = useMemo(() => {
    const buscaNorm = busca.toLowerCase();
    return concluidas.filter(
      (v) =>
        v.clienteNome.toLowerCase().includes(buscaNorm) ||
        v.enderecoCidade.toLowerCase().includes(buscaNorm) ||
        v.dataVenda.toLowerCase().includes(buscaNorm)
    );
  }, [concluidas, busca]);

  const totalReceita = useMemo(
    () => concluidas.reduce((acc, v) => acc + v.valorTotal, 0),
    [concluidas]
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
            {concluidas.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            Receita Total
          </p>
          <p className="text-brand-500 mt-1 text-2xl font-bold">
            R$ {totalReceita.toFixed(2)}
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
              {filtradas.length} entrega(s)
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Link
              href="/entregas"
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
                  Cliente
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Data da Venda
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                  >
                    Nenhuma entrega concluída.
                  </td>
                </tr>
              ) : (
                filtradas.map((venda) => (
                  <tr
                    key={venda.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                      {venda.clienteNome}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {venda.enderecoCidade}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {venda.dataVenda}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {venda.pagamento}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-white/90">
                      R$ {venda.valorTotal.toFixed(2)}
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
