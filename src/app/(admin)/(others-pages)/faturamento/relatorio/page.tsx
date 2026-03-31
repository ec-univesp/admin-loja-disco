"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const dadosMensais = [
  { mes: "Jan", receita: 3200, despesas: 1800, lucro: 1400 },
  { mes: "Fev", receita: 2800, despesas: 1500, lucro: 1300 },
  { mes: "Mar", receita: 4150, despesas: 2100, lucro: 2050 },
];

const topProdutos = [
  { titulo: "Abbey Road", artista: "The Beatles", qtdVendida: 8, receita: 719.20 },
  { titulo: "Dark Side of the Moon", artista: "Pink Floyd", qtdVendida: 6, receita: 599.40 },
  { titulo: "Thriller", artista: "Michael Jackson", qtdVendida: 5, receita: 399.50 },
  { titulo: "Back in Black", artista: "AC/DC", qtdVendida: 4, receita: 352.00 },
  { titulo: "Led Zeppelin IV", artista: "Led Zeppelin", qtdVendida: 3, receita: 285.00 },
];

const formasPagamento = [
  { forma: "PIX", percentual: 42, total: 1743.00 },
  { forma: "Cartão Crédito", percentual: 35, total: 1452.50 },
  { forma: "Dinheiro", percentual: 15, total: 622.50 },
  { forma: "Cartão Débito", percentual: 8, total: 332.00 },
];

export default function RelatorioFinanceiroPage() {
  const totalReceita = dadosMensais.reduce((a, d) => a + d.receita, 0);
  const totalDespesas = dadosMensais.reduce((a, d) => a + d.despesas, 0);
  const totalLucro = dadosMensais.reduce((a, d) => a + d.lucro, 0);

  return (
    <div>
      <PageBreadcrumb pageTitle="Relatório Financeiro" />

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Receita Total (Trim.)</p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">
            R$ {totalReceita.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-green-500">↑ +12% vs trimestre anterior</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Despesas (Trim.)</p>
          <p className="mt-1 text-2xl font-bold text-red-500">
            R$ {totalDespesas.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-gray-400">Compras + Operacional</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Lucro Líquido (Trim.)</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            R$ {totalLucro.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-green-500">Margem: {((totalLucro / totalReceita) * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Resultado por mês */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Resultado Mensal – 2026
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="py-2 text-left font-medium text-gray-500">Mês</th>
                  <th className="py-2 text-right font-medium text-gray-500">Receita</th>
                  <th className="py-2 text-right font-medium text-gray-500">Despesas</th>
                  <th className="py-2 text-right font-medium text-gray-500">Lucro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {dadosMensais.map((d) => (
                  <tr key={d.mes}>
                    <td className="py-3 font-medium text-gray-700 dark:text-gray-300">{d.mes}</td>
                    <td className="py-3 text-right text-green-600">R$ {d.receita.toFixed(2)}</td>
                    <td className="py-3 text-right text-red-500">R$ {d.despesas.toFixed(2)}</td>
                    <td className="py-3 text-right font-semibold text-gray-800 dark:text-white">
                      R$ {d.lucro.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-3 font-bold text-gray-800 dark:text-white">Total</td>
                  <td className="py-3 text-right font-bold text-green-600">R$ {totalReceita.toFixed(2)}</td>
                  <td className="py-3 text-right font-bold text-red-500">R$ {totalDespesas.toFixed(2)}</td>
                  <td className="py-3 text-right font-bold text-gray-800 dark:text-white">R$ {totalLucro.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Formas de Pagamento
          </h3>
          <div className="space-y-4">
            {formasPagamento.map((fp) => (
              <div key={fp.forma}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{fp.forma}</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {fp.percentual}% · R$ {fp.total.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-brand-500"
                    style={{ width: `${fp.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Produtos */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-2">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Top 5 Produtos Mais Vendidos
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="py-2 text-left font-medium text-gray-500">#</th>
                  <th className="py-2 text-left font-medium text-gray-500">Álbum</th>
                  <th className="py-2 text-left font-medium text-gray-500">Artista</th>
                  <th className="py-2 text-right font-medium text-gray-500">Qtd Vendida</th>
                  <th className="py-2 text-right font-medium text-gray-500">Receita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {topProdutos.map((p, i) => (
                  <tr key={p.titulo} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 text-gray-400">#{i + 1}</td>
                    <td className="py-3 font-medium text-gray-800 dark:text-white/90">{p.titulo}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">{p.artista}</td>
                    <td className="py-3 text-right text-gray-700 dark:text-gray-300">{p.qtdVendida}</td>
                    <td className="py-3 text-right font-semibold text-green-600">R$ {p.receita.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

