"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import React, { useState } from "react";

const entregasConcluidasMock = [
  { id: 2, codigo: "ENT-0002", cliente: "Ana Souza", endereco: "Av. Brasil, 456 – RJ", produto: "Thriller (LP)", dataEnvio: "27/03/2026", dataEntrega: "29/03/2026", transportadora: "Sedex", avaliacao: 5 },
  { id: 6, codigo: "ENT-0006", cliente: "Julia Ferreira", endereco: "Alameda Santos, 654 – SP", produto: "Back in Black (LP)", dataEnvio: "23/03/2026", dataEntrega: "27/03/2026", transportadora: "Correios PAC", avaliacao: 4 },
  { id: 7, codigo: "ENT-0007", cliente: "Marcos Oliveira", endereco: "Rua XV de Novembro, 99 – PR", produto: "Led Zeppelin IV (LP)", dataEnvio: "20/03/2026", dataEntrega: "25/03/2026", transportadora: "Sedex", avaliacao: 5 },
  { id: 10, codigo: "ENT-0010", cliente: "Sandra Torres", endereco: "Rua das Palmeiras, 77 – GO", produto: "Kind of Blue (LP)", dataEnvio: "15/03/2026", dataEntrega: "20/03/2026", transportadora: "Jadlog", avaliacao: 4 },
  { id: 11, codigo: "ENT-0011", cliente: "Ricardo Barros", endereco: "Travessa das Rosas, 12 – CE", produto: "Abbey Road (LP)", dataEnvio: "10/03/2026", dataEntrega: "14/03/2026", transportadora: "Sedex", avaliacao: 5 },
];

export default function EntregasConcluidasPage() {
  const [busca, setBusca] = useState("");

  const filtradas = entregasConcluidasMock.filter(
    (e) =>
      e.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      e.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      e.produto.toLowerCase().includes(busca.toLowerCase())
  );

  const avgAvaliacao =
    entregasConcluidasMock.reduce((a, e) => a + e.avaliacao, 0) /
    entregasConcluidasMock.length;

  const renderStars = (n: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < n ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));

  return (
    <div>
      <PageBreadcrumb pageTitle="Entregas Concluídas" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500">Total Entregue</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{entregasConcluidasMock.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500">Avaliação Média</p>
          <p className="mt-1 text-2xl font-bold text-yellow-500">{avgAvaliacao.toFixed(1)} / 5</p>
          <div className="mt-1 flex">{renderStars(Math.round(avgAvaliacao))}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500">Taxa de Satisfação</p>
          <p className="mt-1 text-2xl font-bold text-brand-500">
            {((entregasConcluidasMock.filter((e) => e.avaliacao >= 4).length / entregasConcluidasMock.length) * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-gray-400">Avaliações ≥ 4 estrelas</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Histórico de Entregas Concluídas</h3>
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
                <th className="px-6 py-3 text-center font-medium text-gray-500">Envio</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Entregue em</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Avaliação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">Nenhuma entrega encontrada.</td>
                </tr>
              ) : (
                filtradas.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{e.codigo}</td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">{e.cliente}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-[180px] truncate">{e.produto}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{e.transportadora}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{e.dataEnvio}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        ✅ {e.dataEntrega}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center text-sm">{renderStars(e.avaliacao)}</div>
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

