'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import React, { useEffect, useMemo, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import {
  useVendas,
  useCompras,
  useItensVenda,
  useDiscos,
  useCanaisVenda,
  useGenerosMusical,
  useArtistas,
  useEnderecos,
} from '@/hooks/useStore';
import { useAppStore } from '@/store/appStore';
import {
  exportarBackupCompleto,
  exportarRelatorioFinanceiro,
  exportarRelatorioFinanceiroCSV,
} from '@/shared/services/exportExcel';
import { getMockMensal, mockDimensoesProporcoes, escalarDimensao } from '@/mocks/faturamento';

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
const ANO_ATUAL = new Date().getFullYear();
const ANOS_DISPONIVEIS = Array.from({ length: 5 }, (_, i) => ANO_ATUAL - i);

type Dimensao = 'canal' | 'genero' | 'artista' | 'estado' | 'pagamento';

const DIMENSOES: { key: Dimensao; label: string }[] = [
  { key: 'canal', label: 'Canal de Venda' },
  { key: 'genero', label: 'Gênero Musical' },
  { key: 'artista', label: 'Artista' },
  { key: 'estado', label: 'Estado' },
  { key: 'pagamento', label: 'Forma de Pagamento' },
];

function agrupar(
  entries: [string, number][]
): { label: string; total: number; percentual: number }[] {
  const totalGeral = entries.reduce((acc, [, v]) => acc + v, 0) || 1;
  return entries
    .map(([label, total]) => ({ label, total, percentual: Math.round((total / totalGeral) * 100) }))
    .sort((a, b) => b.total - a.total);
}

export default function FaturamentoPage() {
  const { vendas, fetchVendas } = useVendas();
  const { compras, fetchCompras } = useCompras();
  const { itensVenda, fetchItensVenda } = useItensVenda();
  const { discos, fetchDiscos } = useDiscos();
  const { canaisVenda, fetchCanaisVenda } = useCanaisVenda();
  const { generosMusical, fetchGenerosMusical } = useGenerosMusical();
  const { artistas, fetchArtistas } = useArtistas();
  const { enderecos, fetchEnderecos } = useEnderecos();
  const fullState = useAppStore();

  const [anoFiltro, setAnoFiltro] = useState<number>(ANO_ATUAL);
  const [mesFiltro, setMesFiltro] = useState<number>(0);

  const [dimensao, setDimensao] = useState<Dimensao>('genero');
  const [mostrarAvancados, setMostrarAvancados] = useState(false);

  const [fCanal, setFCanal] = useState('');
  const [fGenero, setFGenero] = useState('');
  const [fArtista, setFArtista] = useState('');
  const [fEstado, setFEstado] = useState('');
  const [fPagamento, setFPagamento] = useState('');

  useEffect(() => {
    fetchVendas();
    fetchCompras();
    fetchItensVenda();
    fetchDiscos();
    fetchCanaisVenda();
    fetchGenerosMusical();
    fetchArtistas();
    fetchEnderecos();
  }, [
    fetchVendas,
    fetchCompras,
    fetchItensVenda,
    fetchDiscos,
    fetchCanaisVenda,
    fetchGenerosMusical,
    fetchArtistas,
    fetchEnderecos,
  ]);

  const vendasBase = useMemo(
    () =>
      vendas.filter((v) => {
        const d = new Date(v.dataVenda);
        return d.getFullYear() === anoFiltro && (mesFiltro === 0 || d.getMonth() + 1 === mesFiltro);
      }),
    [vendas, anoFiltro, mesFiltro]
  );

  const comprasBase = useMemo(
    () =>
      compras.filter((c) => {
        const d = new Date(c.dataCompra);
        return d.getFullYear() === anoFiltro && (mesFiltro === 0 || d.getMonth() + 1 === mesFiltro);
      }),
    [compras, anoFiltro, mesFiltro]
  );

  const idsBase = useMemo(() => new Set(vendasBase.map((v) => v.id)), [vendasBase]);

  const itensBase = useMemo(
    () => itensVenda.filter((i) => idsBase.has(i.vendaId)),
    [itensVenda, idsBase]
  );

  const vendasAnalise = useMemo(
    () =>
      vendasBase.filter((v) => {
        if (fCanal && v.canalVendaId !== fCanal) return false;
        if (fPagamento && v.pagamento !== fPagamento) return false;
        if (fEstado) {
          const est = enderecos.find((e) => e.id === v.enderecoId)?.estado ?? '';
          if (est !== fEstado) return false;
        }
        return true;
      }),
    [vendasBase, fCanal, fPagamento, fEstado, enderecos]
  );

  const idsAnalise = useMemo(() => new Set(vendasAnalise.map((v) => v.id)), [vendasAnalise]);

  const itensAnalise = useMemo(
    () =>
      itensBase.filter((item) => {
        if (!idsAnalise.has(item.vendaId)) return false;
        if (fArtista || fGenero) {
          const disco = discos.find((d) => d.id === item.discoId);
          if (!disco) return false;
          if (fArtista && disco.artistaId !== fArtista) return false;
          if (fGenero && disco.generoId !== fGenero) return false;
        }
        return true;
      }),
    [itensBase, idsAnalise, fArtista, fGenero, discos]
  );

  const resumoMensalReal = useMemo(() => {
    const map = new Map<string, { receita: number; despesas: number }>();
    const chave = (iso: string) => {
      const d = new Date(iso);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };
    const acc = (k: string, delta: { receita?: number; despesas?: number }) => {
      const t = map.get(k) ?? { receita: 0, despesas: 0 };
      t.receita += delta.receita ?? 0;
      t.despesas += delta.despesas ?? 0;
      map.set(k, t);
    };
    vendasBase.forEach((v) =>
      acc(chave(v.dataVenda), { receita: v.valorTotal, despesas: Number(v.custosAdicionais || 0) })
    );
    comprasBase.forEach((c) => acc(chave(c.dataCompra), { despesas: c.valorTotal }));
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, t]) => {
        const [, m] = k.split('-');
        return {
          mes: MESES_PT[Number(m) - 1] ?? k,
          receita: t.receita,
          despesas: t.despesas,
          lucro: t.receita - t.despesas,
        };
      });
  }, [vendasBase, comprasBase]);

  const resumoMensalMock = useMemo(
    () => getMockMensal(anoFiltro, mesFiltro),
    [anoFiltro, mesFiltro]
  );

  const isMockFinanceiro = resumoMensalReal.length === 0;
  const resumoMensal = isMockFinanceiro ? resumoMensalMock : resumoMensalReal;

  const totalReceita = resumoMensal.reduce((s, m) => s + m.receita, 0);
  const totalDespesas = resumoMensal.reduce((s, m) => s + m.despesas, 0);
  const totalLucro = totalReceita - totalDespesas;

  const dadosCanalVendaReal = useMemo(() => {
    const map = new Map<string, number>();
    vendasBase.forEach((v) => {
      const nome = canaisVenda.find((c) => c.id === v.canalVendaId)?.nome ?? 'Sem canal';
      map.set(nome, (map.get(nome) ?? 0) + v.valorTotal);
    });
    return agrupar(Array.from(map.entries()));
  }, [vendasBase, canaisVenda]);

  const dadosCanalVenda = dadosCanalVendaReal.length
    ? dadosCanalVendaReal
    : escalarDimensao(mockDimensoesProporcoes.canal_fixo, totalReceita);
  const isMockCanalVenda = dadosCanalVendaReal.length === 0;

  const dadosDimensaoReal = useMemo(() => {
    const map = new Map<string, number>();

    if (dimensao === 'canal') {
      vendasAnalise.forEach((v) => {
        const nome = canaisVenda.find((c) => c.id === v.canalVendaId)?.nome ?? 'Sem canal';
        map.set(nome, (map.get(nome) ?? 0) + v.valorTotal);
      });
    } else if (dimensao === 'pagamento') {
      vendasAnalise.forEach((v) => {
        const forma = v.pagamento || 'Não informado';
        map.set(forma, (map.get(forma) ?? 0) + v.valorTotal);
      });
    } else if (dimensao === 'estado') {
      vendasAnalise.forEach((v) => {
        const est = enderecos.find((e) => e.id === v.enderecoId)?.estado ?? 'Sem estado';
        map.set(est, (map.get(est) ?? 0) + v.valorTotal);
      });
    } else if (dimensao === 'genero') {
      itensAnalise.forEach((item) => {
        const disco = discos.find((d) => d.id === item.discoId);
        const nome = disco?.generoId
          ? (generosMusical.find((g) => g.id === disco.generoId)?.nome ?? 'Sem gênero')
          : 'Sem gênero';
        map.set(nome, (map.get(nome) ?? 0) + item.precoVenda);
      });
    } else if (dimensao === 'artista') {
      itensAnalise.forEach((item) => {
        const disco = discos.find((d) => d.id === item.discoId);
        const nome = disco?.artistaId
          ? (artistas.find((a) => a.id === disco.artistaId)?.nome ?? 'Desconhecido')
          : 'Desconhecido';
        map.set(nome, (map.get(nome) ?? 0) + item.precoVenda);
      });
    }

    return agrupar(Array.from(map.entries()));
  }, [
    dimensao,
    vendasAnalise,
    itensAnalise,
    canaisVenda,
    enderecos,
    discos,
    generosMusical,
    artistas,
  ]);

  const dadosDimensao = dadosDimensaoReal.length
    ? dadosDimensaoReal
    : escalarDimensao(mockDimensoesProporcoes[dimensao], totalReceita);
  const isMockDimensao = dadosDimensaoReal.length === 0;

  const receitaAnalise = dadosDimensao.reduce((s, d) => s + d.total, 0);

  const estadosDisponiveis = useMemo(
    () => [...new Set(enderecos.map((e) => e.estado).filter(Boolean))].sort(),
    [enderecos]
  );
  const pagamentosDisponiveis = useMemo(
    () => [...new Set(vendas.map((v) => v.pagamento).filter(Boolean))].sort(),
    [vendas]
  );

  const qtdFiltrosAtivos = [fCanal, fGenero, fArtista, fEstado, fPagamento].filter(Boolean).length;
  const limparAvancados = () => {
    setFCanal('');
    setFGenero('');
    setFArtista('');
    setFEstado('');
    setFPagamento('');
  };

  const vendasDetalhe = vendasBase.map((v) => ({
    id: v.id,
    data: v.dataVenda,
    cliente: v.clienteId,
    canal: canaisVenda.find((c) => c.id === v.canalVendaId)?.nome ?? '',
    pagamento: v.pagamento,
    frete: v.frete,
    custosAdicionais: v.custosAdicionais,
    total: v.valorTotal,
    status: v.statusPedido,
  }));

  const handleExportRelatorio = () =>
    exportarRelatorioFinanceiro({
      resumoMensal,
      topProdutos: [],
      formasPagamento: dadosCanalVenda.map((c) => ({
        forma: c.label,
        total: c.total,
        percentual: c.percentual,
      })),
      vendasDetalhe,
    });

  const handleExportRelatorioCSV = () =>
    exportarRelatorioFinanceiroCSV({ resumoMensal, vendasDetalhe });

  const handleBackupCompleto = () => exportarBackupCompleto(fullState);

  return (
    <div>
      <PageBreadcrumb pageTitle="Relatório Financeiro" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Ano
            </label>
            <select
              value={anoFiltro}
              onChange={(e) => setAnoFiltro(Number(e.target.value))}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              {ANOS_DISPONIVEIS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Mês
            </label>
            <select
              value={mesFiltro}
              onChange={(e) => setMesFiltro(Number(e.target.value))}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value={0}>Todos os meses</option>
              {MESES_PT.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleExportRelatorioCSV}>
            Exportar Relatório (CSV)
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportRelatorio}>
            Exportar Relatório (Excel)
          </Button>
          <Button variant="primary" size="sm" onClick={handleBackupCompleto}>
            Backup Completo (Excel)
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          titulo="Receita Total"
          valor={`R$ ${totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub="Soma das vendas no período"
          cor="text-gray-800 dark:text-white"
          isMock={isMockFinanceiro}
        />
        <KpiCard
          titulo="Despesas"
          valor={`R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub="Compras + custos adicionais"
          cor="text-red-500"
          isMock={isMockFinanceiro}
        />
        <KpiCard
          titulo="Lucro Líquido"
          valor={`R$ ${totalLucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub={`Margem: ${totalReceita ? ((totalLucro / totalReceita) * 100).toFixed(1) : '0.0'}%`}
          cor="text-green-600"
          isMock={isMockFinanceiro}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Canal de Venda
            </h3>
            <div className="flex items-center gap-2">
              {isMockCanalVenda && <MockBadge />}
              <span className="text-xs text-gray-400">
                Total:{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  R$ {totalReceita.toFixed(2)}
                </span>
              </span>
            </div>
          </div>
          <p className="mb-4 text-xs text-gray-400">
            Receita por canal —{' '}
            {mesFiltro === 0 ? `ano ${anoFiltro}` : `${MESES_PT[mesFiltro - 1]}/${anoFiltro}`}
          </p>
          <GraficoBarras dados={dadosCanalVenda} cor="#465FFF" />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Resultado Mensal
            </h3>
            {isMockFinanceiro && <MockBadge />}
          </div>
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
                      Sem dados no período.
                    </td>
                  </tr>
                ) : (
                  resumoMensal.map((m) => (
                    <tr key={m.mes}>
                      <td className="py-3 font-medium text-gray-700 dark:text-gray-300">{m.mes}</td>
                      <td className="py-3 text-right text-green-600">R$ {m.receita.toFixed(2)}</td>
                      <td className="py-3 text-right text-red-500">R$ {m.despesas.toFixed(2)}</td>
                      <td className="py-3 text-right font-semibold text-gray-800 dark:text-white">
                        R$ {m.lucro.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Análise de Receita
              </h3>
              {isMockDimensao && <MockBadge />}
            </div>
            <p className="mt-0.5 text-xs text-gray-400">
              {mesFiltro === 0 ? `Ano ${anoFiltro}` : `${MESES_PT[mesFiltro - 1]}/${anoFiltro}`}
              {' · '}Receita base:{' '}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                R$ {totalReceita.toFixed(2)}
              </span>
              {qtdFiltrosAtivos > 0 && (
                <>
                  {' · '}Filtrado:{' '}
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">
                    R$ {receitaAnalise.toFixed(2)}
                  </span>{' '}
                  <span className="text-gray-400">
                    ({totalReceita > 0 ? ((receitaAnalise / totalReceita) * 100).toFixed(1) : '0'}%
                    do total)
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {qtdFiltrosAtivos > 0 && (
              <button
                onClick={limparAvancados}
                className="h-8 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-500 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
              >
                Limpar filtros
              </button>
            )}
            <button
              onClick={() => setMostrarAvancados((v) => !v)}
              className={`flex h-8 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-colors ${
                qtdFiltrosAtivos > 0
                  ? 'border-brand-300 bg-brand-50 text-brand-600 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
              }`}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 5h14M6 10h8M9 15h2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Filtros avançados
              {qtdFiltrosAtivos > 0 && (
                <span className="bg-brand-500 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white">
                  {qtdFiltrosAtivos}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {DIMENSOES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDimensao(d.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                dimensao === d.key
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {mostrarAvancados && (
          <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
            <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Filtros adicionais
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <FiltroSelect
                label="Canal de Venda"
                value={fCanal}
                onChange={setFCanal}
                disabled={dimensao === 'canal'}
              >
                {canaisVenda.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </FiltroSelect>
              <FiltroSelect
                label="Gênero Musical"
                value={fGenero}
                onChange={setFGenero}
                disabled={dimensao === 'genero'}
              >
                {generosMusical.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome}
                  </option>
                ))}
              </FiltroSelect>
              <FiltroSelect
                label="Artista"
                value={fArtista}
                onChange={setFArtista}
                disabled={dimensao === 'artista'}
              >
                {artistas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </FiltroSelect>
              <FiltroSelect
                label="Estado"
                value={fEstado}
                onChange={setFEstado}
                disabled={dimensao === 'estado'}
              >
                {estadosDisponiveis.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </FiltroSelect>
              <FiltroSelect
                label="Forma de Pagamento"
                value={fPagamento}
                onChange={setFPagamento}
                disabled={dimensao === 'pagamento'}
              >
                {pagamentosDisponiveis.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </FiltroSelect>
            </div>
          </div>
        )}
        <GraficoBarras dados={dadosDimensao} cor={CORES_DIMENSAO[dimensao]} />
      </div>
    </div>
  );
}

const CORES_DIMENSAO: Record<Dimensao, string> = {
  canal: '#465FFF',
  genero: '#8B5CF6',
  artista: '#F59E0B',
  estado: '#14B8A6',
  pagamento: '#F43F5E',
};

function MockBadge() {
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
      dados de exemplo
    </span>
  );
}

function KpiCard({
  titulo,
  valor,
  sub,
  cor,
  isMock = false,
}: {
  titulo: string;
  valor: string;
  sub: string;
  cor: string;
  isMock?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">{titulo}</p>
        {isMock && <MockBadge />}
      </div>
      <p className={`mt-1 text-2xl font-bold ${cor}`}>{valor}</p>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </div>
  );
}

function FiltroSelect({
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        title={disabled ? 'Dimensão atualmente selecionada' : undefined}
        className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      >
        <option value="">Todos</option>
        {children}
      </select>
      {disabled && <p className="mt-0.5 text-[10px] text-gray-400">Agrupamento ativo</p>}
    </div>
  );
}

function GraficoBarras({
  dados,
  cor,
}: {
  dados: { label: string; total: number; percentual: number }[];
  cor: string;
}) {
  const categorias = dados.map((d) => d.label);
  const valores = dados.map((d) => parseFloat(d.total.toFixed(2)));
  const altura = Math.max(160, categorias.length * 46);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Outfit, sans-serif',
      toolbar: { show: false },
      background: 'transparent',
      animations: { enabled: true, speed: 500 },
    },
    colors: [cor],
    plotOptions: {
      bar: { horizontal: true, barHeight: '58%', borderRadius: 5, borderRadiusApplication: 'end' },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      style: { fontSize: '11px', fontWeight: 600, colors: ['#fff'] },
      dropShadow: { enabled: false },
    },
    xaxis: {
      categories: categorias,
      labels: {
        formatter: (val) =>
          `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
        style: { fontSize: '11px', colors: '#9CA3AF' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontSize: '12px', colors: '#6B7280' }, maxWidth: 170 } },
    grid: {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      borderColor: '#F3F4F6',
      padding: { left: 0, right: 20 },
    },
    tooltip: {
      y: { formatter: (val) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
    },
    theme: { mode: 'light' },
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ name: 'Receita (R$)', data: valores }]}
      type="bar"
      height={altura}
    />
  );
}
