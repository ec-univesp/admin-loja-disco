'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import { useSearchParams } from 'next/navigation';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { OrderStatus, RecordStatus } from '@/shared/types';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import { useSalesModel } from '@/app/sales/model/salesModel';
import { useCustomersModel } from '@/app/sales/model/customersModel';
import CustomerAddressModal from '@/app/sales/components/CustomerAddressModal';
import NewRegistrationModal from '@/app/sales/components/NewRegistrationModal';
import SaleDetailsModal from '@/app/sales/components/SaleDetailsModal';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { exportTableToExcel } from '@/shared/services/exportExcel';
import Button from '@/shared/components/ui/button/Button';
import { reportsService, type ProfitPerItemDTO } from '@/shared/services/api';

const MONTHS_IN_YEAR = 12;
const monthOptions = Array.from({ length: MONTHS_IN_YEAR }, (_unused, monthIndex) => monthIndex + 1);

const toCurrencyNumber = (value?: number): number | null =>
  typeof value === 'number' ? value : null;

const buildProfitPerItemExcelRow = (profitItem: ProfitPerItemDTO) => ({
  'Venda ID': profitItem.vendaId ?? '',
  Data: profitItem.dataVenda ? formatDateBR(profitItem.dataVenda) : '',
  Ano: profitItem.ano ?? '',
  Mês: profitItem.mes ?? '',
  'Disco ID': profitItem.discoId ?? '',
  Disco: profitItem.nomeDisco ?? '',
  'Cliente ID': profitItem.clienteId ?? '',
  Cliente: profitItem.nomeCliente ?? '',
  'Forma Pagamento': profitItem.formaPagamento ?? '',
  'Canal ID': profitItem.canalVendaId ?? '',
  Canal: profitItem.nomeCanal ?? '',
  'Preço Venda (R$)': toCurrencyNumber(profitItem.precoVenda),
  'Custo Disco (R$)': toCurrencyNumber(profitItem.custoDisco),
  'Custos Adicionais (R$)': toCurrencyNumber(profitItem.custosAdicionais),
  'Frete Disco (R$)': toCurrencyNumber(profitItem.freteDisco),
  'Total Despesa (R$)': toCurrencyNumber(profitItem.totalDespesa),
  'Lucro (R$)': toCurrencyNumber(profitItem.lucro),
});

const iconPlus = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const statusColor: Record<string, string> = {
  [OrderStatus.ENTREGUE]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [OrderStatus.CONFIRMADA]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [OrderStatus.ENVIADA]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [OrderStatus.PENDENTE]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [OrderStatus.CANCELADA]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusLabel: Record<string, string> = {
  [OrderStatus.PENDENTE]: 'Pendente',
  [OrderStatus.CONFIRMADA]: 'Confirmada',
  [OrderStatus.ENVIADA]: 'Enviada',
  [OrderStatus.ENTREGUE]: 'Entregue',
  [OrderStatus.CANCELADA]: 'Cancelada',
};

const formatSaleNumber = (index: number) =>
  `VND-${String(index + 1).padStart(4, '0')}`;

const formatDateBR = (isoDate: string) => {
  if (!isoDate || isoDate.length < 10) return isoDate || '—';
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
};

const COMPLETED_STATUSES = [OrderStatus.ENTREGUE];

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
  const { update: updateRecord, list: recordsList } = useRecordsModel();
  const sales = useMemo(() => salesList.data ?? [], [salesList.data]);
  const customers = useMemo(() => customersList.data ?? [], [customersList.data]);
  const allRecords = useMemo(() => recordsList.data ?? [], [recordsList.data]);

  const searchParams = useSearchParams();
  const openNewSaleOnLoad = searchParams.get('novo') === '1';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showNewRegistrationModal, setShowNewRegistrationModal] = useState(() => openNewSaleOnLoad);
  const [editCustomerId, setEditCustomerId] = useState<number | undefined>();

  const deleteSaleModal = useModal();
  const [saleToDelete, setSaleToDelete] = useState<{ id: number; number: string } | null>(null);

  const detailsModal = useModal();
  const [saleDetails, setSaleDetails] = useState<{ number: string; saleId: number } | null>(null);

  const deleteCustomerModal = useModal();
  const [customerToDelete, setCustomerToDelete] = useState<{ id: number; name: string } | null>(null);

  const exportModal = useModal();
  const now = new Date();
  const [exportYear, setExportYear] = useState<number>(now.getFullYear());
  const [exportMonth, setExportMonth] = useState<number>(now.getMonth() + 1);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleConfirmDeleteSale = useCallback(async () => {
    if (!saleToDelete) return;
    const sale = sortedSales.find((candidateSale) => candidateSale.vendaId === saleToDelete.id);
    if (sale?.itens?.length) {
      await Promise.all(
        sale.itens.map((item) => {
          const record = allRecords.find((candidateRecord) => candidateRecord.discoId === item.discoId);
          if (!record?.discoId) return Promise.resolve();
          return updateRecord.mutateAsync({ ...record, discoId: record.discoId, status: RecordStatus.DISPONIVEL });
        })
      );
    }
    await removeSale.mutateAsync(saleToDelete.id);
    setSaleToDelete(null);
    deleteSaleModal.closeModal();
  }, [saleToDelete, sortedSales, allRecords, updateRecord, removeSale, deleteSaleModal]);

  const handleConfirmDeleteCustomer = useCallback(async () => {
    if (!customerToDelete) return;
    await removeCustomer.mutateAsync(customerToDelete.id);
    setCustomerToDelete(null);
    deleteCustomerModal.closeModal();
  }, [customerToDelete, removeCustomer, deleteCustomerModal]);

  const sortedSales = useMemo(
    () =>
      [...sales].sort((firstSale, secondSale) =>
        (firstSale.dataVenda ?? '') < (secondSale.dataVenda ?? '') ? 1 : -1
      ),
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
        status: sale.statusPedido ?? OrderStatus.PENDENTE,
        rawIdx: index,
      })),
    [sortedSales]
  );

  const handleToggleDelivered = useCallback(async (saleIndex: number, currentStatus: string) => {
    const sale = sortedSales[saleIndex];
    if (!sale?.vendaId) return;
    const newStatus = currentStatus === OrderStatus.ENTREGUE ? OrderStatus.PENDENTE : OrderStatus.ENTREGUE;
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
  }, [sortedSales, updateSale]);

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.number.toLowerCase().includes(normalizedSearch) ||
      row.customer.toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === 'Todos' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isCompletedStatus = (status: string): boolean =>
    COMPLETED_STATUSES.some((completed) => completed === status);

  const totalRevenue = filteredRows
    .filter((row) => isCompletedStatus(row.status))
    .reduce((acc, row) => acc + row.total, 0);

  const handleOpenExportModal = useCallback(() => {
    setExportError(null);
    exportModal.openModal();
  }, [exportModal]);

  const handleConfirmExport = useCallback(async () => {
    setExportError(null);
    setIsExporting(true);
    try {
      const profitReport = await reportsService.profitPerItem({
        ano: exportYear,
        mes: exportMonth,
      });
      if (!profitReport.length) {
        setExportError('Nenhum dado encontrado para o período selecionado.');
        return;
      }
      const spreadsheetRows = profitReport.map(buildProfitPerItemExcelRow);
      const monthLabel = String(exportMonth).padStart(2, '0');
      await exportTableToExcel(
        'Lucro por Item',
        spreadsheetRows,
        `vendas-lucro-por-item-${exportYear}-${monthLabel}.xlsx`
      );
      exportModal.closeModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao exportar relatório.';
      setExportError(message);
    } finally {
      setIsExporting(false);
    }
  }, [exportYear, exportMonth, exportModal]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Vendas" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
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
              <option value={OrderStatus.PENDENTE}>Pendente</option>
              <option value={OrderStatus.CONFIRMADA}>Confirmada</option>
              <option value={OrderStatus.ENVIADA}>Enviada</option>
              <option value={OrderStatus.ENTREGUE}>Entregue</option>
              <option value={OrderStatus.CANCELADA}>Cancelada</option>
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
              onClick={handleOpenExportModal}
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
                <th className="w-28 px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Ações
                </th>
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
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/2"
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
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[row.status] || statusColor[OrderStatus.PENDENTE]}`}
                      >
                        {statusLabel[row.status] ?? row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2">
                        <label
                          title={
                            row.status === OrderStatus.ENTREGUE
                              ? 'Marcar como não entregue'
                              : 'Marcar como entregue'
                          }
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                        >
                          <input
                            type="checkbox"
                            checked={row.status === OrderStatus.ENTREGUE}
                            onChange={() => handleToggleDelivered(row.rawIdx, row.status)}
                            aria-label={`Marcar venda ${row.number} como entregue`}
                            className="h-4 w-4 cursor-pointer accent-green-600"
                          />
                        </label>
                        <button
                          type="button"
                          aria-label={`Ver itens da venda ${row.number}`}
                          title={`Ver itens da venda ${row.number}`}
                          onClick={() => {
                            setSaleDetails({ number: row.number, saleId: row.id });
                            detailsModal.openModal();
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-500 text-white shadow-sm transition-colors hover:bg-gray-600"
                        >
                          <Eye size={15} strokeWidth={2.25} />
                        </button>
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

      <SaleDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => {
          detailsModal.closeModal();
          setSaleDetails(null);
        }}
        saleNumber={saleDetails?.number ?? ''}
        sale={
          saleDetails
            ? sortedSales.find((s) => s.vendaId === saleDetails.saleId) ?? null
            : null
        }
      />

      <CustomerAddressModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customerId={editCustomerId}
      />
      <NewRegistrationModal
        isOpen={showNewRegistrationModal}
        onClose={() => setShowNewRegistrationModal(false)}
        initialView={openNewSaleOnLoad ? 'sale' : 'select'}
      />

      <Modal
        isOpen={deleteSaleModal.isOpen}
        onClose={deleteSaleModal.closeModal}
        className="m-4 max-w-110"
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
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
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
        isOpen={exportModal.isOpen}
        onClose={() => {
          if (!isExporting) exportModal.closeModal();
        }}
        className="m-4 max-w-110"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Exportar Excel
          </h4>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Selecione o período do relatório de lucro por item.
          </p>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Mês
              </span>
              <select
                value={exportMonth}
                onChange={(monthChangeEvent) =>
                  setExportMonth(Number(monthChangeEvent.target.value))
                }
                disabled={isExporting}
                className="focus:border-brand-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {monthOptions.map((monthNumber) => (
                  <option key={monthNumber} value={monthNumber}>
                    {String(monthNumber).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Ano
              </span>
              <input
                type="number"
                value={exportYear}
                onChange={(event) => setExportYear(Number(event.target.value))}
                disabled={isExporting}
                min={2000}
                max={2100}
                className="focus:border-brand-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </label>
          </div>
          {exportError && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">{exportError}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={exportModal.closeModal}
              disabled={isExporting}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmExport}
              disabled={isExporting}
              className="bg-brand-500 hover:bg-brand-600 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {isExporting ? 'Exportando...' : 'Exportar'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteCustomerModal.isOpen}
        onClose={deleteCustomerModal.closeModal}
        className="m-4 max-w-110"
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
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
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
