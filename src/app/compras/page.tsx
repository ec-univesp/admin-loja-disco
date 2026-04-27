'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useCompras, useItensCompra } from '@/shared/store/useStore';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { TrashBinIcon } from '@/shared/icons';
import { exportarTabelaCSV, exportarTabelaExcel } from '@/shared/services/exportExcel';
import Button from '@/shared/components/ui/button/Button';
import NovaCompraModal from '@/features/compras/components/NovaCompraModal';

const iconPlus = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const formatNumeroCompra = (posicaoNaLista: number) =>
  `CMP-${String(posicaoNaLista + 1).padStart(4, '0')}`;

export default function ComprasPage() {
  return (
    <Suspense fallback={null}>
      <ComprasContent />
    </Suspense>
  );
}

function ComprasContent() {
  const { comprasComDetalhes, fetchCompras, deleteCompra } = useCompras();
  const { itensCompra, fetchItensCompra } = useItensCompra();

  const searchParams = useSearchParams();

  const [busca, setBusca] = useState('');
  const [showNovaCompraModal, setShowNovaCompraModal] = useState(
    () => searchParams.get('novo') === '1'
  );
  const deleteCompraModal = useModal();
  const [compraParaApagar, setCompraParaApagar] = useState<{ id: string; numero: string } | null>(
    null
  );

  useEffect(() => {
    fetchCompras();
    fetchItensCompra();
  }, [fetchCompras, fetchItensCompra]);

  const handleConfirmarApagarCompra = async () => {
    if (!compraParaApagar) return;
    await deleteCompra(compraParaApagar.id);
    setCompraParaApagar(null);
    deleteCompraModal.closeModal();
  };

  const linhas = useMemo(() => {
    const comprasOrdenadas = [...comprasComDetalhes].sort((compraA, compraB) =>
      compraA.dataCompra < compraB.dataCompra ? 1 : -1
    );

    return comprasOrdenadas.map((compra, posicao) => ({
      id: compra.id,
      numero: formatNumeroCompra(posicao),
      fornecedor: compra.fornecedor,
      data: compra.dataCompra,
      itens: itensCompra.filter((item) => item.compraId === compra.id).length,
      total: compra.valorTotal,
    }));
  }, [comprasComDetalhes, itensCompra]);

  const buscaNormalizada = busca.toLowerCase();
  const linhasFiltradas = linhas.filter(
    (linha) =>
      linha.fornecedor.toLowerCase().includes(buscaNormalizada) ||
      linha.numero.toLowerCase().includes(buscaNormalizada)
  );

  const totalGasto = linhasFiltradas.reduce((acumulado, linha) => acumulado + linha.total, 0);

  const linhasParaExportar = () =>
    linhasFiltradas.map(({ numero, fornecedor, data, itens, total }) => ({
      'Nº Compra': numero,
      Fornecedor: fornecedor,
      Data: data,
      Itens: itens,
      'Total (R$)': total.toFixed(2),
    }));

  const handleExportCSV = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    exportarTabelaCSV(
      linhasParaExportar() as Array<Record<string, unknown>>,
      `compras-${stamp}.csv`
    );
  };

  const handleExportExcel = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    exportarTabelaExcel(
      'Compras',
      linhasParaExportar() as Array<Record<string, unknown>>,
      `compras-${stamp}.xlsx`
    );
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Compras" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Compras
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {linhasFiltradas.length} compra(s) · Total gasto:{' '}
              <span className="font-medium text-red-500">R$ {totalGasto.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Buscar fornecedor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Button
              size="md"
              variant="primary"
              startIcon={iconPlus}
              onClick={() => setShowNovaCompraModal(true)}
            >
              Nova Compra
            </Button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Exportar CSV
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Exportar Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Nº Compra
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Data
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Itens
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                  Total
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {linhasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    Nenhuma compra registrada ainda.
                  </td>
                </tr>
              ) : (
                linhasFiltradas.map((compra) => (
                  <tr
                    key={compra.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {compra.numero}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                      {compra.fornecedor}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{compra.data}</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                      {compra.itens}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-white/90">
                      R$ {compra.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        aria-label={`Apagar compra ${compra.numero}`}
                        title={`Apagar compra ${compra.numero}`}
                        onClick={() => {
                          setCompraParaApagar({ id: compra.id, numero: compra.numero });
                          deleteCompraModal.openModal();
                        }}
                        className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <TrashBinIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NovaCompraModal
        isOpen={showNovaCompraModal}
        onClose={() => setShowNovaCompraModal(false)}
      />

      <Modal
        isOpen={deleteCompraModal.isOpen}
        onClose={deleteCompraModal.closeModal}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar compra
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar a compra{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {compraParaApagar?.numero}
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteCompraModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarApagarCompra}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
