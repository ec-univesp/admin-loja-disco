"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import React, { useState } from "react";

const entregasPendentesMock = [
  { id: 3, codigo: "ENT-0003", cliente: "Roberto Lima", endereco: "Rua 7 de Setembro, 789 – MG", produto: "Nevermind (LP) + Rumours (LP)", data: "26/03/2026", previsao: "02/04/2026", transportadora: "Correios PAC", diasRestantes: 3 },
  { id: 4, codigo: "ENT-0004", cliente: "Pedro Alves", endereco: "Travessa dos Músicos, 10 – RS", produto: "Kind of Blue (LP) × 2", data: "25/03/2026", previsao: "01/04/2026", transportadora: "Jadlog", diasRestantes: 2 },
  { id: 8, codigo: "ENT-0008", cliente: "Fernanda Ribeiro", endereco: "Rua das Acácias, 55 – SC", produto: "Rumours (LP)", data: "30/03/2026", previsao: "05/04/2026", transportadora: "Correios PAC", diasRestantes: 6 },
  { id: 9, codigo: "ENT-0009", cliente: "Lucas Mendes", endereco: "Av. Paulista, 1000 – SP", produto: "Abbey Road (LP)", data: "30/03/2026", previsao: "04/04/2026", transportadora: "Sedex", diasRestantes: 5 },
];

export default function EntregasPendentesPage() {
  const [busca, setBusca] = useState("");

  const filtradas = entregasPendentesMock.filter(
    (e) =>
      e.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      e.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      e.produto.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Entregas Pendentes" />

      <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4 dark:border-yellow-800/50 dark:bg-yellow-900/20">
        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
          ⏳ Existem <strong>{entregasPendentesMock.length}</strong> entregas aguardando despacho ou processamento.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Pendentes de Despacho</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{filtradas.length} entrega(s)</p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Link
              href="/entregas"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              ← Todas as Entregas
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500">Código</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Cliente</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Produto</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Transportadora</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Previsão</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Dias Restantes</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">Nenhuma entrega pendente.</td>
                </tr>
              ) : (
                filtradas.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{e.codigo}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">{e.cliente}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-[180px] truncate">{e.produto}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{e.transportadora}</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">{e.previsao}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        e.diasRestantes <= 2
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {e.diasRestantes}d
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="rounded-lg bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600 transition-colors">
                        Despachar
                      </button>
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

