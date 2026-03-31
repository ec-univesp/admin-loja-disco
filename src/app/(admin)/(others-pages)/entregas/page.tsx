"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import React, { useState } from "react";

interface Entrega {
  id: number;
  codigo: string;
  cliente: string;
  endereco: string;
  produto: string;
  data: string;
  previsao: string;
  transportadora: string;
  status: "Entregue" | "Em Trânsito" | "Pendente" | "Cancelado";
}

const entregasMock: Entrega[] = [
  { id: 1, codigo: "ENT-0001", cliente: "Carlos Silva", endereco: "Rua das Flores, 123 – SP", produto: "Abbey Road (LP)", data: "28/03/2026", previsao: "31/03/2026", transportadora: "Correios PAC", status: "Em Trânsito" },
  { id: 2, codigo: "ENT-0002", cliente: "Ana Souza", endereco: "Av. Brasil, 456 – RJ", produto: "Thriller (LP)", data: "27/03/2026", previsao: "30/03/2026", transportadora: "Sedex", status: "Entregue" },
  { id: 3, codigo: "ENT-0003", cliente: "Roberto Lima", endereco: "Rua 7 de Setembro, 789 – MG", produto: "Nevermind (LP) + Rumours (LP)", data: "26/03/2026", previsao: "02/04/2026", transportadora: "Correios PAC", status: "Em Trânsito" },
  { id: 4, codigo: "ENT-0004", cliente: "Pedro Alves", endereco: "Travessa dos Músicos, 10 – RS", produto: "Kind of Blue (LP) × 2", data: "25/03/2026", previsao: "01/04/2026", transportadora: "Jadlog", status: "Pendente" },
  { id: 5, codigo: "ENT-0005", cliente: "Mariana Costa", endereco: "Rua da Saudade, 321 – BA", produto: "Dark Side of the Moon (LP)", data: "24/03/2026", previsao: "28/03/2026", transportadora: "Sedex", status: "Cancelado" },
  { id: 6, codigo: "ENT-0006", cliente: "Julia Ferreira", endereco: "Alameda Santos, 654 – SP", produto: "Back in Black (LP)", data: "23/03/2026", previsao: "27/03/2026", transportadora: "Correios PAC", status: "Entregue" },
  { id: 7, codigo: "ENT-0007", cliente: "Marcos Oliveira", endereco: "Rua XV de Novembro, 99 – PR", produto: "Led Zeppelin IV (LP)", data: "20/03/2026", previsao: "25/03/2026", transportadora: "Sedex", status: "Entregue" },
];

const statusColor: Record<string, string> = {
  "Entregue": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Em Trânsito": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Pendente": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Cancelado": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusIcon: Record<string, string> = {
  "Entregue": "✅",
  "Em Trânsito": "🚚",
  "Pendente": "⏳",
  "Cancelado": "❌",
};

export default function EntregasPage() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  const entregasFiltradas = entregasMock.filter((e) => {
    const matchBusca =
      e.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      e.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      e.produto.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || e.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Entregas" />

      {/* Resumo */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["Entregue", "Em Trânsito", "Pendente", "Cancelado"] as const).map((s) => (
          <div
            key={s}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] cursor-pointer hover:border-brand-300 transition-colors"
            onClick={() => setFiltroStatus(filtroStatus === s ? "Todos" : s)}
          >
            <p className="text-xl">{statusIcon[s]}</p>
            <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">
              {entregasMock.filter((e) => e.status === s).length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Todas as Entregas</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {entregasFiltradas.length} entrega(s) encontrada(s)
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Entregue">Entregue</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
            </select>
            <input
              type="text"
              placeholder="Buscar entrega..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <div className="flex gap-2">
              <Link
                href="/entregas/pendentes"
                className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-700 hover:bg-yellow-100 transition-colors dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              >
                ⏳ Pendentes
              </Link>
              <Link
                href="/entregas/concluidas"
                className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                ✅ Concluídas
              </Link>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Código</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Cliente</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Produto</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Endereço</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Previsão</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Transportadora</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {entregasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                    Nenhuma entrega encontrada.
                  </td>
                </tr>
              ) : (
                entregasFiltradas.map((entrega) => (
                  <tr key={entrega.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{entrega.codigo}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">{entrega.cliente}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-[180px] truncate" title={entrega.produto}>
                      {entrega.produto}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs max-w-[160px] truncate" title={entrega.endereco}>
                      {entrega.endereco}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{entrega.previsao}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{entrega.transportadora}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[entrega.status]}`}>
                        {statusIcon[entrega.status]} {entrega.status}
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

