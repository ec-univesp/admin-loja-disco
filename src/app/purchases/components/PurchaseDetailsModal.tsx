'use client';
import { Modal } from '@/shared/components/ui/modal';
import { formatBRL } from '@/shared/utils/currency';
import type { PurchaseDTO } from '@/shared/services/api/types';

interface PurchaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseNumber: string;
  purchase: PurchaseDTO | null;
}

export default function PurchaseDetailsModal({
  isOpen,
  onClose,
  purchaseNumber,
  purchase,
}: PurchaseDetailsModalProps) {
  const itens = purchase?.itens ?? [];
  const total = purchase?.valorTotal ?? itens.reduce((acc, i) => acc + (i.custoDisco ?? 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-2xl">
      <div className="p-6">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Itens da compra{' '}
            <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
              {purchaseNumber}
            </span>
          </h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {itens.length} item(ns)
          </span>
        </div>

        {itens.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            Nenhum item registrado nesta compra.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                    Disco
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                    Artista
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500 dark:text-gray-400">
                    Custo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {itens.map((item) => (
                  <tr key={item.id ?? `${item.discoId}-${item.nomeDisco}`}>
                    <td className="px-4 py-2 text-gray-800 dark:text-white/90">
                      {item.nomeDisco ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                      {item.nomeArtista ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-gray-800 dark:text-white/90">
                      {formatBRL(item.custoDisco ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/5">
                  <td colSpan={2} className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-bold text-brand-700 dark:text-brand-400">
                    {formatBRL(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
