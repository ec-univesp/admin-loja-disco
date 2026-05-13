'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { usePurchasesModel } from '@/app/purchases/model/purchasesModel';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { exportTableToExcel } from '@/shared/services/exportExcel';
import Button from '@/shared/components/ui/button/Button';
import NewPurchaseModal from '@/app/purchases/components/NewPurchaseModal';
import PurchaseDetailsModal from '@/app/purchases/components/PurchaseDetailsModal';

const iconPlus = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const formatPurchaseNumber = (positionInList: number) =>
  `CMP-${String(positionInList + 1).padStart(4, '0')}`;

export default function PurchasesPage() {
  return (
    <Suspense fallback={null}>
      <PurchasesContent />
    </Suspense>
  );
}

function PurchasesContent() {
  const { list, remove } = usePurchasesModel();
  const purchases = useMemo(() => list.data ?? [], [list.data]);

  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(
    () => searchParams.get('novo') === '1'
  );
  const [purchaseToEditId, setPurchaseToEditId] = useState<number | null>(null);
  const deletePurchaseModal = useModal();
  const [purchaseToDelete, setPurchaseToDelete] = useState<{ id: number; number: string } | null>(
    null
  );

  const detailsModal = useModal();
  const [purchaseDetails, setPurchaseDetails] = useState<{ number: string; purchaseId: number } | null>(
    null
  );

  const handleConfirmDelete = async () => {
    if (!purchaseToDelete) return;
    await remove.mutateAsync(purchaseToDelete.id);
    setPurchaseToDelete(null);
    deletePurchaseModal.closeModal();
  };

  const rows = useMemo(() => {
    const sortedPurchases = [...purchases].sort((a, b) =>
      (a.dataCompra ?? '') < (b.dataCompra ?? '') ? 1 : -1
    );

    return sortedPurchases.map((purchase, index) => ({
      id: purchase.compraId ?? 0,
      number: formatPurchaseNumber(index),
      supplier: purchase.fornecedor ?? '—',
      date: purchase.dataCompra ?? '',
      items: purchase.itens?.length ?? 0,
      total: purchase.valorTotal ?? 0,
    }));
  }, [purchases]);

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredRows = rows.filter(
    (row) =>
      row.supplier.toLowerCase().includes(normalizedSearch) ||
      row.number.toLowerCase().includes(normalizedSearch)
  );

  const totalSpent = filteredRows.reduce((acc, row) => acc + row.total, 0);

  const rowsToExport = () =>
    filteredRows.map(({ number, supplier, date, items, total }) => ({
      'Nº Compra': number,
      Fornecedor: supplier,
      Data: date,
      Itens: items,
      'Total (R$)': total,
    }));

  const handleExportToExcel = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    exportTableToExcel('Purchases', rowsToExport(), `purchases-${stamp}.xlsx`);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Compras" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Compras
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredRows.length} compra(s) · Total gasto:{' '}
              <span className="font-medium text-red-500">R$ {totalSpent.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por número ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-brand-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none sm:w-72 md:w-80 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Button
              size="md"
              variant="primary"
              startIcon={iconPlus}
              onClick={() => setShowNewPurchaseModal(true)}
            >
              Nova Compra
            </Button>
            <button
              type="button"
              onClick={handleExportToExcel}
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
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    Nenhuma compra registrada.
                  </td>
                </tr>
              ) : (
                filteredRows.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/2"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {purchase.number}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                      {purchase.supplier}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{purchase.date}</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                      {purchase.items}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-white/90">
                      R$ {purchase.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2">
                        <button
                          type="button"
                          aria-label={`Ver itens da compra ${purchase.number}`}
                          title={`Ver itens da compra ${purchase.number}`}
                          onClick={() => {
                            setPurchaseDetails({ number: purchase.number, purchaseId: purchase.id });
                            detailsModal.openModal();
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-500 text-white shadow-sm transition-colors hover:bg-gray-600"
                        >
                          <Eye size={15} strokeWidth={2.25} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Editar compra ${purchase.number}`}
                          title={`Editar compra ${purchase.number}`}
                          onClick={() => {
                            setPurchaseToEditId(purchase.id);
                            setShowNewPurchaseModal(true);
                          }}
                          className="bg-brand-500 hover:bg-brand-600 inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                        >
                          <Pencil size={15} strokeWidth={2.25} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Apagar compra ${purchase.number}`}
                          title={`Apagar compra ${purchase.number}`}
                          onClick={() => {
                            setPurchaseToDelete({ id: purchase.id, number: purchase.number });
                            deletePurchaseModal.openModal();
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                        >
                          <Trash2 size={15} strokeWidth={2.25} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewPurchaseModal
        isOpen={showNewPurchaseModal}
        onClose={() => {
          setShowNewPurchaseModal(false);
          setPurchaseToEditId(null);
        }}
        purchase={
          purchaseToEditId !== null
            ? purchases.find((p) => p.compraId === purchaseToEditId) ?? null
            : null
        }
      />

      <PurchaseDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => {
          detailsModal.closeModal();
          setPurchaseDetails(null);
        }}
        purchaseNumber={purchaseDetails?.number ?? ''}
        purchase={
          purchaseDetails
            ? purchases.find((p) => p.compraId === purchaseDetails.purchaseId) ?? null
            : null
        }
      />

      <Modal
        isOpen={deletePurchaseModal.isOpen}
        onClose={deletePurchaseModal.closeModal}
        className="m-4 max-w-110"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar compra
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar a compra{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {purchaseToDelete?.number}
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deletePurchaseModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
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
