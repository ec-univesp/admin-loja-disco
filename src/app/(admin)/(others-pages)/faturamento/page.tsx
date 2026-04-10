'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import React, { useEffect, useMemo } from 'react';
import {
  useVendas,
  useCompras,
  useItensVenda,
  useDiscos,
  useCanaisVenda,
} from '@/hooks/useStore';
import { useAppStore } from '@/store/appStore';
import {
  exportarBackupCompleto,
  exportarRelatorioFinanceiro,
} from '@/services/exportExcel';

const MESES_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export default function FaturamentoPage() {
  const { vendas, fetchVendas } = useVendas();
  const { compras, fetchCompras } = useCompras();
  const { itensVenda, fetchItensVenda } = useItensVenda();
  const { discos, fetchDiscos } = useDiscos();
  const { canaisVenda, fetchCanaisVenda } = useCanaisVenda();
  const fullState = useAppStore();

  useEffect(() => {
    fetchVendas();
    fetchCompras();
    fetchItensVenda();
    fetchDiscos();
    fetchCanaisVenda();
  }, [fetchVendas, fetchCompras, fetchItensVenda, fetchDiscos, fetchCanaisVenda]);

  // Resumo mensal: receita (vendas) vs despesas (compras + custos adicionais)
  const resumoMensal = useMemo(() => {
    const map = new Map<string, { receita: number; despesas: number }>();

    vendas.forEach((v) => {
      const data = new Date(v.dataVenda);
      const key = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      const atual = map.get(key) ?? { receita: 0, despesas: 0 };
      atual.receita += v.valorTotal;
      atual.despesas += Number(v.custosAdicionais || 0);
      map.set(key, atual);
    });

    compras.forEach((c) => {
      const data = new Date(c.dataCpmpra);
      const key = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      const atual = map.get(key) ?? { receita: 0, despesas: 0 };
      atual.despesas += c.valorTotal;
      map.set(key, atual);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, valores]) => {
        const [, mes] = key.split('-');
        return {
          mes: MESES_PT[Number(mes) - 1] ?? key,
          receita: valores.receita,
          despesas: valores.despesas,
          lucro: valores.receita - valores.despesas,
        };
      });
  }, [vendas, compras]);

  const totalReceita = resumoMensal.reduce((a, d) => a + d.receita, 0);
  const totalDespesas = resumoMensal.reduce((a, d) => a + d.despesas, 0);
  const totalLucro = totalReceita - totalDespesas;

  // Top discos vendidos
  const topProdutos = useMemo(() => {
    const map = new Map<
      string,
      { album: string; artista: string; qtd: number; receita: number }
    >();
    itensVenda.forEach((item) => {
      const disco = discos.find((d) => d.id === item.discoId);
      if (!disco) return;
      const atual = map.get(disco.id) ?? {
        album: disco.album,
        artista: '',
        qtd: 0,
        receita: 0,
      };
      atual.qtd += 1;
      atual.receita += item.precoVenda;
      map.set(disco.id, atual);
    });
    return Array.from(map.values())
      .sort((a, b) => b.qtd - a.qtd)
      .slice(0, 5);
  }, [itensVenda, discos]);

  // Formas de pagamento
  const formasPagamento = useMemo(() => {
    const map = new Map<string, number>();
    vendas.forEach((v) => {
      const k = v.pagamento || 'Outros';
      map.set(k, (map.get(k) ?? 0) + v.valorTotal);
    });
    const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
    return Array.from(map.entries())
      .map(([forma, valor]) => ({
        forma,
        total: valor,
        percentual: Math.round((valor / total) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  }, [vendas]);

  const handleExportRelatorio = () => {
    exportarRelatorioFinanceiro({
      resumoMensal,
      topProdutos,
      formasPagamento,
      vendasDetalhe: vendas.map((v) => ({
        id: v.id,
        data: v.dataVenda,
        cliente: v.clienteId,
        canal: canaisVenda.find((c) => c.id === v.canalVendaId)?.nome ?? '',
        pagamento: v.pagamento,
        frete: v.frete,
        custosAdicionais: v.custosAdicionais,
        total: v.valorTotal,
        status: v.statusPedido,
      })),
    });
  };

  const handleBackupCompleto = () => {
    exportarBackupCompleto(fullState);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Relatório Financeiro" />

      <div className="mb-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm" onClick={handleExportRelatorio}>
          📊 Exportar Relatório (Excel)
        </Button>
        <Button variant="primary" size="sm" onClick={handleBackupCompleto}>
          💾 Backup Completo (Excel)
        </Button>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
            Receita Total
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">
            R$ {totalReceita.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-gray-400">Soma de todas as vendas registradas</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
            Despesas
          </p>
          <p className="mt-1 text-2xl font-bold text-red-500">R$ {totalDespesas.toFixed(2)}</p>
          <p className="mt-1 text-xs text-gray-400">Compras + custos adicionais de canais</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
            Lucro Líquido
          </p>
          <p className="mt-1 text-2xl font-bold text-green-600">R$ {totalLucro.toFixed(2)}</p>
          <p className="mt-1 text-xs text-green-500">
            Margem: {totalReceita ? ((totalLucro / totalReceita) * 100).toFixed(1) : '0.0'}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Resultado Mensal
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
                {resumoMensal.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">
                      Sem dados suficientes ainda.
                    </td>
                  </tr>
                ) : (
                  resumoMensal.map((d) => (
                    <tr key={d.mes}>
                      <td className="py-3 font-medium text-gray-700 dark:text-gray-300">
                        {d.mes}
                      </td>
                      <td className="py-3 text-right text-green-600">R$ {d.receita.toFixed(2)}</td>
                      <td className="py-3 text-right text-red-500">R$ {d.despesas.toFixed(2)}</td>
                      <td className="py-3 text-right font-semibold text-gray-800 dark:text-white">
                        R$ {d.lucro.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Formas de Pagamento
          </h3>
          {formasPagamento.length === 0 ? (
            <p className="text-sm text-gray-400">Sem vendas registradas.</p>
          ) : (
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
                      className="bg-brand-500 h-2 rounded-full"
                      style={{ width: `${fp.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 xl:col-span-2 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Top 5 Discos Mais Vendidos
          </h3>
          {topProdutos.length === 0 ? (
            <p className="text-sm text-gray-400">Sem vendas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="py-2 text-left font-medium text-gray-500">#</th>
                    <th className="py-2 text-left font-medium text-gray-500">Álbum</th>
                    <th className="py-2 text-right font-medium text-gray-500">Qtd Vendida</th>
                    <th className="py-2 text-right font-medium text-gray-500">Receita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {topProdutos.map((p, i) => (
                    <tr key={p.album} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 text-gray-400">#{i + 1}</td>
                      <td className="py-3 font-medium text-gray-800 dark:text-white/90">
                        {p.album}
                      </td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">{p.qtd}</td>
                      <td className="py-3 text-right font-semibold text-green-600">
                        R$ {p.receita.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
