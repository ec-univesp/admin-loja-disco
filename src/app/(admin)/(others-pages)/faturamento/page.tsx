"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import React, { useState } from "react";

interface NotaFiscal {
  id: number;
  numero: string;
  cliente: string;
  data: string;
  vencimento: string;
  valor: number;
  tipo: "Venda" | "Compra";
  status: "Pago" | "Pendente" | "Vencido";
}

const notasMock: NotaFiscal[] = [
  { id: 1, numero: "NF-00045", cliente: "Carlos Silva", data: "30/03/2026", vencimento: "30/03/2026", valor: 179.80, tipo: "Venda", status: "Pago" },
  { id: 2, numero: "NF-00044", cliente: "Ana Souza", data: "29/03/2026", vencimento: "29/03/2026", valor: 89.90, tipo: "Venda", status: "Pago" },
  { id: 3, numero: "NF-00043", cliente: "Distribuidora Vinil Brasil", data: "28/03/2026", vencimento: "11/04/2026", valor: 1250.00, tipo: "Compra", status: "Pendente" },
  { id: 4, numero: "NF-00042", cliente: "Roberto Lima", data: "27/03/2026", vencimento: "27/03/2026", valor: 264.70, tipo: "Venda", status: "Pendente" },
  { id: 5, numero: "NF-00041", cliente: "Sound Records Ltda", data: "15/03/2026", vencimento: "15/03/2026", valor: 890.00, tipo: "Compra", status: "Vencido" },
  { id: 6, numero: "NF-00040", cliente: "Pedro Alves", data: "14/03/2026", vencimento: "14/03/2026", valor: 350.00, tipo: "Venda", status: "Pago" },
  { id: 7, numero: "NF-00039", cliente: "Julia Ferreira", data: "10/03/2026", vencimento: "10/03/2026", valor: 167.80, tipo: "Venda", status: "Pago" },
  { id: 8, numero: "NF-00038", cliente: "Distribuidora Vinil Brasil", data: "01/03/2026", vencimento: "01/03/2026", valor: 2100.00, tipo: "Compra", status: "Pago" },
];

const statusColor: Record<string, string> = {
  Pago: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pendente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Vencido: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const tipoColor: Record<string, string> = {
  Venda: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Compra: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function FaturamentoPage() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  const notasFiltradas = notasMock.filter((n) => {
    const matchBusca =
      n.numero.toLowerCase().includes(busca.toLowerCase()) ||
      n.cliente.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || n.status === filtroStatus;
    const matchTipo = filtroTipo === "Todos" || n.tipo === filtroTipo;
    return matchBusca && matchStatus && matchTipo;
  });


  return (
    <div>
      <PageBreadcrumb pageTitle="Faturamento – Notas Fiscais" />

      {/* Cards de resumo */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Receita Recebida</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            R$ {notasMock.filter(n => n.tipo === "Venda" && n.status === "Pago").reduce((a, n) => a + n.valor, 0).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Valores Pendentes</p>
          <p className="mt-1 text-2xl font-bold text-yellow-500">
            R$ {notasMock.filter(n => n.status === "Pendente").reduce((a, n) => a + n.valor, 0).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Valores Vencidos</p>
          <p className="mt-1 text-2xl font-bold text-red-500">
            R$ {notasMock.filter(n => n.status === "Vencido").reduce((a, n) => a + n.valor, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Notas Fiscais</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {notasFiltradas.length} nota(s) encontrada(s)
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="Todos">Todos os Tipos</option>
              <option value="Venda">Venda</option>
              <option value="Compra">Compra</option>
            </select>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
              <option value="Vencido">Vencido</option>
            </select>
            <input
              type="text"
              placeholder="Buscar nota..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Link
              href="/faturamento/relatorio"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              📊 Relatório
            </Link>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Nº Nota</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Cliente / Fornecedor</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Emissão</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Vencimento</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Valor</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Tipo</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {notasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
                    Nenhuma nota fiscal encontrada.
                  </td>
                </tr>
              ) : (
                notasFiltradas.map((nota) => (
                  <tr key={nota.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{nota.numero}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">{nota.cliente}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{nota.data}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{nota.vencimento}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-white/90">
                      R$ {nota.valor.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tipoColor[nota.tipo]}`}>
                        {nota.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[nota.status]}`}>
                        {nota.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        title="Baixar NF"
                        className="rounded p-1 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-base"
                      >
                        📄
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            Total filtrado:{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              R$ {notasFiltradas.reduce((a, n) => a + n.valor, 0).toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

