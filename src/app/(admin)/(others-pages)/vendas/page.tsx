"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import React, { useState } from "react";

interface Venda {
  id: number;
  numero: string;
  cliente: string;
  data: string;
  itens: number;
  total: number;
  pagamento: string;
  status: "Concluída" | "Pendente" | "Cancelada";
}

const vendasMock: Venda[] = [
  { id: 1, numero: "VND-0001", cliente: "Carlos Silva", data: "30/03/2026", itens: 2, total: 179.80, pagamento: "Cartão Crédito", status: "Concluída" },
  { id: 2, numero: "VND-0002", cliente: "Ana Souza", data: "29/03/2026", itens: 1, total: 89.90, pagamento: "PIX", status: "Concluída" },
  { id: 3, numero: "VND-0003", cliente: "Roberto Lima", data: "28/03/2026", itens: 3, total: 264.70, pagamento: "Dinheiro", status: "Pendente" },
  { id: 4, numero: "VND-0004", cliente: "Mariana Costa", data: "27/03/2026", itens: 1, total: 99.90, pagamento: "Cartão Débito", status: "Cancelada" },
  { id: 5, numero: "VND-0005", cliente: "Pedro Alves", data: "26/03/2026", itens: 4, total: 350.00, pagamento: "PIX", status: "Concluída" },
  { id: 6, numero: "VND-0006", cliente: "Julia Ferreira", data: "25/03/2026", itens: 2, total: 167.80, pagamento: "Cartão Crédito", status: "Concluída" },
  { id: 7, numero: "VND-0007", cliente: "Marcos Oliveira", data: "24/03/2026", itens: 1, total: 75.00, pagamento: "Dinheiro", status: "Concluída" },
];

const statusColor: Record<string, string> = {
  "Concluída": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Pendente": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Cancelada": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function VendasPage() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  const vendasFiltradas = vendasMock.filter((v) => {
    const matchBusca =
      v.numero.toLowerCase().includes(busca.toLowerCase()) ||
      v.cliente.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || v.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const totalReceita = vendasFiltradas
    .filter((v) => v.status === "Concluída")
    .reduce((acc, v) => acc + v.total, 0);

  return (
    <div>
      <PageBreadcrumb pageTitle="Vendas" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Vendas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {vendasFiltradas.length} venda(s) · Receita:{" "}
              <span className="font-medium text-green-600">R$ {totalReceita.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Concluída">Concluída</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <input
              type="text"
              placeholder="Buscar venda..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Link
              href="/nova-venda"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
            >
              + Nova Venda
            </Link>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Nº Venda</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Cliente</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Data</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Itens</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Total</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Pagamento</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {vendasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
                    Nenhuma venda encontrada.
                  </td>
                </tr>
              ) : (
                vendasFiltradas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{venda.numero}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">{venda.cliente}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{venda.data}</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">{venda.itens}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-white/90">
                      R$ {venda.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{venda.pagamento}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[venda.status]}`}>
                        {venda.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        title="Ver detalhes"
                        className="rounded p-1 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-base"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Resumo */}
        <div className="flex flex-wrap gap-6 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            Concluídas: <span className="font-semibold text-green-600">{vendasMock.filter(v => v.status === "Concluída").length}</span>
          </p>
          <p className="text-xs text-gray-400">
            Pendentes: <span className="font-semibold text-yellow-600">{vendasMock.filter(v => v.status === "Pendente").length}</span>
          </p>
          <p className="text-xs text-gray-400">
            Canceladas: <span className="font-semibold text-red-500">{vendasMock.filter(v => v.status === "Cancelada").length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

