'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import { useSearchParams } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import React, { Suspense, useMemo, useState } from 'react';
import { useSalesModel } from '@/app/sales/model/salesModel';
import { useCustomersModel } from '@/app/sales/model/customersModel';
import CustomerAddressModal from '@/app/sales/components/CustomerAddressModal';
import NewRegistrationModal from '@/app/sales/components/NewRegistrationModal';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { exportTableToExcel } from '@/shared/services/exportExcel';
import Button from '@/shared/components/ui/button/Button';

const iconPlus = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const statusColor: Record<string, string> = {
  Concluída: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Entregue: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Confirmada: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Enviada: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Pendente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Cancelada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const formatSaleNumber = (index: number) =>
  `VND-${String(index + 1).padStart(4, '0')}`;

const formatDateBR = (isoDate: string) => {
  if (!isoDate || isoDate.length < 10) return isoDate || '—';
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
};

const COMPLETED_STATUSES = ['Concluída', 'Entregue'];

export default function SalesPage() {
  return (
    <Suspense fallback={null}>
      <SalesContent />
    </Suspense>
  );
}

function SalesContent() {
  const { list: salesList, remove: removeSale, update: updateSale } = useSalesModel();
  const { list: customersList, remove: removeCustomer } = useCustomersModel();
  const sales = salesList.data ?? [];
  const customers = customersList.data ?? [];

  const searchParams = useSearchParams();
  const openNewSaleOnLoad = searchParams.get('novo') === '1';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showNewRegistrationModal, setShowNewRegistrationModal] = useState(() => openNewSaleOnLoad);
  const [editCustomerId, setEditCustomerId] = useState<number | undefined>();

  const deleteSaleModal = useModal();
  const [saleToDelete, setSaleToDelete] = useState<{ id: number; number: string } | null>(null);

  const deleteCustomerModal = useModal();
  const [customerToDelete, setCustomerToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleConfirmDeleteSale = async () => {
    if (!saleToDelete) return;
    await removeSale.mutateAsync(saleToDelete.id);
    setSaleToDelete(null);
    deleteSaleModal.closeModal();
  };

  const handleConfirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    await removeCustomer.mutateAsync(customerToDelete.id);
    setCustomerToDelete(null);
    deleteCustomerModal.closeModal();
  };

  const handleToggleDelivered = async (saleIndex: number, currentStatus: string) => {
    const sale = sortedSales[saleIndex];
    if (!sale?.vendaId) return;
    const newStatus = currentStatus === 'Entregue' ? 'Pendente' : 'Entregue';
    await updateSale.mutateAsync({
      vendasId: sale.vendaId,
      cliente: sale.cliente,
      dataVenda: sale.dataVenda,
      endereco: sale.endereco,
      frete: sale.frete,
      valorTotal: sale.valorTotal,
      pagamento: sale.pagamento,
      canalVenda: sale.canalVenda,
      custosAdicionais: sale.custosAdicionais,
      statusPedido: newStatus,
      itens: sale.itens?.map((item) => ({
        discoId: item.discoId,
        nomeDisco: item.nomeDisco,
        nomeArtista: item.nomeArtista,
        precoVenda: item.precoVenda,
      })),
    });
  };

  const sortedSales = useMemo(
    () => [...sales].sort((a, b) => ((a.dataVenda ?? '') < (b.dataVenda ?? '') ? 1 : -1)),
    [sales]
  );

  const rows = useMemo(
    () =>
      sortedSales.map((sale, index) => ({
        id: sale.vendaId ?? 0,
        number: formatSaleNumber(index),
        customer: sale.cliente?.nomeCliente ?? '—',
        customerId: sale.cliente?.clienteId,
        date: sale.dataVenda ?? '',
        items: sale.itens?.length ?? 0,
        total: sale.valorTotal ?? 0,
        payment: sale.pagamento ?? '—',
        salesChannel: sale.canalVenda?.nomeCanalVenda ?? '—',
        status: sale.statusPedido ?? 'Pendente',
        rawIdx: index,
      })),
    [sortedSales]
  );

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.number.toLowerCase().includes(normalizedSearch) ||
      row.customer.toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === 'Todos' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredRows
    .filter((row) => COMPLETED_STATUSES.includes(row.status))
    .reduce((acc, row) => acc + row.total, 0);

  const buildExportRows = () =>
    filteredRows.map(({ number, customer, date, items, total, payment, salesChannel, status }) => ({
      'Nº Venda': number,
      Cliente: customer,
      Data: formatDateBR(date),
      Itens: items,
      'Total (R$)': total.toFixed(2),
      Pagamento: payment,
      'Canal de Venda': salesChannel,
      Status: status,
    }));

  const handleExportToExcel = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    exportTableToExcel(
      'Vendas',
      buildExportRows() as Array<Record<string, unknown>>,
      `vendas-${stamp}.xlsx`
    );
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Vendas" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Vendas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredRows.length} venda(s) · Receita:{' '}
              <span className="font-medium text-green-600">R$ {totalRevenue.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Enviada">Enviada</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <input
              type="text"
              placeholder="Buscar venda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Button
              size="md"
              variant="primary"
              startIcon={iconPlus}
              onClick={() => setShowNewRegistrationModal(true)}
            >
              Novo
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

        {customers.length === 0 ? (
          <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">Nenhum cliente cadastrado.</p>
          </div>
        ) : (
          <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Clientes cadastrados:
            </p>
            <div className="flex flex-wrap gap-2">
              {customers.map((customer) => (
                <div
                  key={customer.clienteId}
                  className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
                >
                  <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                    {customer.nomeCliente}
                  </span>
                  <button
                    type="button"
                    aria-label={`Editar cliente ${customer.nomeCliente}`}
                    title={`Editar cliente ${customer.nomeCliente}`}
                    onClick={() => {
                      setEditCustomerId(customer.clienteId);
                      setShowCustomerModal(true);
                    }}
                    className="bg-brand-500 hover:bg-brand-600 inline-flex h-7 w-7 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                  >
                    <Pencil size={14} strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Excluir cliente ${customer.nomeCliente}`}
                    title={`Excluir cliente ${customer.nomeCliente}`}
                    onClick={() => {
                      if (customer.clienteId === undefined) return;
                      setCustomerToDelete({
                        id: customer.clienteId,
                        name: customer.nomeCliente ?? '',
                      });
                      deleteCustomerModal.openModal();
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                  >
                    <Trash2 size={14} strokeWidth={2.25} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Nº Venda
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Cliente
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
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Canal de Venda
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="w-20 px-6 py-3" aria-hidden="true" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-400">
                    Nenhuma venda encontrada.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {row.number}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                      {row.customer}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {formatDateBR(row.date)}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                      {row.items}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-white/90">
                      R$ {row.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {row.payment}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {row.salesChannel}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[row.status] || statusColor.Pendente}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditCustomerId(row.customerId);
                            setShowCustomerModal(true);
                          }}
                          aria-label="Editar cliente / endereço"
                          title="Editar cliente / endereço"
                          className="bg-brand-500 hover:bg-brand-600 inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                        >
                          <Pencil size={15} strokeWidth={2.25} />
                        </button>
                        <label
                          title={
                            row.status === 'Entregue'
                              ? 'Marcar como não entregue'
                              : 'Marcar como entregue'
                          }
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                        >
                          <input
                            type="checkbox"
                            checked={row.status === 'Entregue'}
                            onChange={() => handleToggleDelivered(row.rawIdx, row.status)}
                            aria-label={`Marcar venda ${row.number} como entregue`}
                            className="h-4 w-4 cursor-pointer accent-green-600"
                          />
                        </label>
                        <button
                          type="button"
                          aria-label={`Apagar venda ${row.number}`}
                          title={`Apagar venda ${row.number}`}
                          onClick={() => {
                            setSaleToDelete({ id: row.id, number: row.number });
                            deleteSaleModal.openModal();
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

      <CustomerAddressModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        clienteId={editCustomerId}
      />
      <NewRegistrationModal
        isOpen={showNewRegistrationModal}
        onClose={() => setShowNewRegistrationModal(false)}
        initialView={openNewSaleOnLoad ? 'venda' : 'select'}
      />

      <Modal
        isOpen={deleteSaleModal.isOpen}
        onClose={deleteSaleModal.closeModal}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar venda
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar a venda{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {saleToDelete?.number}
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteSaleModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDeleteSale}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteCustomerModal.isOpen}
        onClose={deleteCustomerModal.closeModal}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Excluir cliente
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja excluir o cliente{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {customerToDelete?.name}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteCustomerModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDeleteCustomer}
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
