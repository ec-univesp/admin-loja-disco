'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useVendas, useItensVenda, useDiscos } from '@/hooks/useStore';

export default function EntregasPendentesPage() {
  const { vendasComDetalhes, fetchVendas } = useVendas();
  const { fetchItensVenda } = useItensVenda();
  const { fetchDiscos } = useDiscos();
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetchVendas();
    fetchItensVenda();
    fetchDiscos();
  }, [fetchVendas, fetchItensVenda, fetchDiscos]);

  const pendentes = useMemo(
    () =>
      vendasComDetalhes.filter(
        (v) => v.statusPedido === 'Confirmada' || v.statusPedido === 'Enviada'
      ),
    [vendasComDetalhes]
  );

  const filtradas = useMemo(() => {
    const buscaNorm = busca.toLowerCase();
    return pendentes.filter(
      (v) =>
        v.id.toLowerCase().includes(buscaNorm) ||
        v.clienteNome.toLowerCase().includes(buscaNorm) ||
        v.enderecoCompleto.toLowerCase().includes(buscaNorm) ||
        v.produtosResumo.toLowerCase().includes(buscaNorm)
    );
  }, [pendentes, busca]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Entregas Pendentes" />

      <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4 dark:border-yellow-800/50 dark:bg-yellow-900/20">
        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
          Existem <strong>{pendentes.length}</strong> entrega(s) aguardando despacho ou em
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
              {filtradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                  >
                    Nenhuma entrega pendente.
                  </td>
                </tr>
              ) : (
                filtradas.map((venda) => (
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
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          venda.statusPedido === 'Enviada'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
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
