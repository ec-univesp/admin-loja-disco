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

const LIMITE_TOP_PRODUTOS = 5;

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

  const resumoMensal = useMemo(() => {
    const totaisPorMes = new Map<string, { receita: number; despesas: number }>();

    const obterChaveMes = (dataIso: string) => {
      const data = new Date(dataIso);
      return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    };

    const acumular = (
      chaveMes: string,
      delta: { receita?: number; despesas?: number }
    ) => {
      const totais = totaisPorMes.get(chaveMes) ?? { receita: 0, despesas: 0 };
      totais.receita += delta.receita ?? 0;
      totais.despesas += delta.despesas ?? 0;
      totaisPorMes.set(chaveMes, totais);
    };

    vendas.forEach((venda) =>
      acumular(obterChaveMes(venda.dataVenda), {
        receita: venda.valorTotal,
        despesas: Number(venda.custosAdicionais || 0),
      })
    );

    compras.forEach((compra) =>
      acumular(obterChaveMes(compra.dataCpmpra), { despesas: compra.valorTotal })
    );

    return Array.from(totaisPorMes.entries())
      .sort(([chaveA], [chaveB]) => chaveA.localeCompare(chaveB))
      .map(([chaveMes, totais]) => {
        const [, numeroMes] = chaveMes.split('-');
        return {
          mes: MESES_PT[Number(numeroMes) - 1] ?? chaveMes,
          receita: totais.receita,
          despesas: totais.despesas,
          lucro: totais.receita - totais.despesas,
        };
      });
  }, [vendas, compras]);

  const totalReceita = resumoMensal.reduce(
    (acumulado, mes) => acumulado + mes.receita,
    0
  );
  const totalDespesas = resumoMensal.reduce(
    (acumulado, mes) => acumulado + mes.despesas,
    0
  );
  const totalLucro = totalReceita - totalDespesas;

  const topProdutos = useMemo(() => {
    const totaisPorDisco = new Map<
      string,
      { album: string; artista: string; qtd: number; receita: number }
    >();

    itensVenda.forEach((itemVenda) => {
      const disco = discos.find((discoAtual) => discoAtual.id === itemVenda.discoId);
      if (!disco) return;

      const totais = totaisPorDisco.get(disco.id) ?? {
        album: disco.album,
        artista: '',
        qtd: 0,
        receita: 0,
      };
      totais.qtd += 1;
      totais.receita += itemVenda.precoVenda;
      totaisPorDisco.set(disco.id, totais);
    });

    return Array.from(totaisPorDisco.values())
      .sort((discoA, discoB) => discoB.qtd - discoA.qtd)
      .slice(0, LIMITE_TOP_PRODUTOS);
  }, [itensVenda, discos]);

  const formasPagamento = useMemo(() => {
    const totaisPorForma = new Map<string, number>();

    vendas.forEach((venda) => {
      const formaPagamento = venda.pagamento || 'Outros';
      totaisPorForma.set(
        formaPagamento,
        (totaisPorForma.get(formaPagamento) ?? 0) + venda.valorTotal
      );
    });

    const totalGeral =
      Array.from(totaisPorForma.values()).reduce(
        (acumulado, valor) => acumulado + valor,
        0
      ) || 1;

    return Array.from(totaisPorForma.entries())
      .map(([forma, total]) => ({
        forma,
        total,
        percentual: Math.round((total / totalGeral) * 100),
      }))
      .sort((formaA, formaB) => formaB.total - formaA.total);
  }, [vendas]);

  const handleExportRelatorio = () => {
    exportarRelatorioFinanceiro({
      resumoMensal,
      topProdutos,
      formasPagamento,
      vendasDetalhe: vendas.map((venda) => ({
        id: venda.id,
        data: venda.dataVenda,
        cliente: venda.clienteId,
        canal: canaisVenda.find((canal) => canal.id === venda.canalVendaId)?.nome ?? '',
        pagamento: venda.pagamento,
        frete: venda.frete,
        custosAdicionais: venda.custosAdicionais,
        total: venda.valorTotal,
        status: venda.statusPedido,
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
          Exportar Relatório (Excel)
        </Button>
        <Button variant="primary" size="sm" onClick={handleBackupCompleto}>
          Backup Completo (Excel)
        </Button>
      </div>

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
                  resumoMensal.map((mesAtual) => (
                    <tr key={mesAtual.mes}>
                      <td className="py-3 font-medium text-gray-700 dark:text-gray-300">
                        {mesAtual.mes}
                      </td>
                      <td className="py-3 text-right text-green-600">
                        R$ {mesAtual.receita.toFixed(2)}
                      </td>
                      <td className="py-3 text-right text-red-500">
                        R$ {mesAtual.despesas.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-semibold text-gray-800 dark:text-white">
                        R$ {mesAtual.lucro.toFixed(2)}
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
              {formasPagamento.map((forma) => (
                <div key={forma.forma}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{forma.forma}</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {forma.percentual}% · R$ {forma.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="bg-brand-500 h-2 rounded-full"
                      style={{ width: `${forma.percentual}%` }}
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
                  {topProdutos.map((produto, posicao) => (
                    <tr
                      key={produto.album}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="py-3 text-gray-400">#{posicao + 1}</td>
                      <td className="py-3 font-medium text-gray-800 dark:text-white/90">
                        {produto.album}
                      </td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">
                        {produto.qtd}
                      </td>
                      <td className="py-3 text-right font-semibold text-green-600">
                        R$ {produto.receita.toFixed(2)}
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
