'use client';

import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import Button from '@/shared/components/ui/button/Button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { useCustomersModel } from '@/app/sales/model/customersModel';
import CustomerAddressModal from '@/app/sales/components/CustomerAddressModal';
import type { CustomerDTO } from '@/shared/services/api';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const iconPlus = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const sexoLabel: Record<string, string> = {
  M: 'Masculino',
  F: 'Feminino',
  O: 'Outro',
};

const formatCustomerCode = (id: number) => `CLI-${String(id).padStart(4, '0')}`;

const formatAddress = (customer: CustomerDTO) => {
  const address = customer.enderecos?.[0];
  if (!address) return '—';

  const streetLine = [address.logradouro, address.numero].filter(Boolean).join(', ');
  const cityLine = [address.cidade, address.estado].filter(Boolean).join(' - ');

  return [streetLine, cityLine].filter(Boolean).join(' · ') || '—';
};

const getCustomerName = (customer: CustomerDTO) => customer.nomeCliente ?? 'Cliente sem nome';

export default function CustomersPage() {
  const { list, remove } = useCustomersModel();
  const customers = useMemo(() => list.data ?? [], [list.data]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState<number | undefined>();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<{ id: number; name: string } | null>(
    null
  );

  const detailsModal = useModal();
  const deleteModal = useModal();

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return customers;

    return customers.filter((customer) => {
      const address = customer.enderecos?.[0];
      return [
        customer.nomeCliente,
        customer.sexo,
        address?.logradouro,
        address?.cidade,
        address?.estado,
        address?.cep,
      ]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(normalizedSearch));
    });
  }, [customers, searchTerm]);

  const handleOpenCreate = useCallback(() => {
    setEditCustomerId(undefined);
    setShowCustomerModal(true);
  }, []);

  const handleOpenEdit = useCallback((customerId?: number) => {
    if (customerId === undefined) return;
    setEditCustomerId(customerId);
    setShowCustomerModal(true);
  }, []);

  const handleCloseCustomerModal = useCallback(() => {
    setShowCustomerModal(false);
    setEditCustomerId(undefined);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!customerToDelete) return;
    await remove.mutateAsync(customerToDelete.id);
    setCustomerToDelete(null);
    deleteModal.closeModal();
  }, [customerToDelete, remove, deleteModal]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Clientes" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Clientes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredCustomers.length} cliente(s) cadastrado(s)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Button size="md" variant="primary" startIcon={iconPlus} onClick={handleOpenCreate}>
              Novo cliente
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Código
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Idade
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Sexo
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Endereço
                </th>
                <th className="w-28 px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    {list.isLoading ? 'Carregando clientes...' : 'Nenhum cliente encontrado.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const id = customer.clienteId ?? 0;
                  const customerName = getCustomerName(customer);

                  return (
                    <tr
                      key={customer.clienteId ?? customerName}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-white/2"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                        {id > 0 ? formatCustomerCode(id) : '—'}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                        {customerName}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {customer.idade ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {sexoLabel[customer.sexo ?? ''] ?? customer.sexo ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {formatAddress(customer)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            type="button"
                            aria-label={`Visualizar cliente ${customerName}`}
                            title={`Visualizar cliente ${customerName}`}
                            onClick={() => {
                              setSelectedCustomer(customer);
                              detailsModal.openModal();
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-500 text-white shadow-sm transition-colors hover:bg-gray-600"
                          >
                            <Eye size={15} strokeWidth={2.25} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Editar cliente ${customerName}`}
                            title={`Editar cliente ${customerName}`}
                            onClick={() => handleOpenEdit(customer.clienteId)}
                            className="bg-brand-500 hover:bg-brand-600 inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                          >
                            <Pencil size={15} strokeWidth={2.25} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Excluir cliente ${customerName}`}
                            title={`Excluir cliente ${customerName}`}
                            onClick={() => {
                              if (customer.clienteId === undefined) return;
                              setCustomerToDelete({ id: customer.clienteId, name: customerName });
                              deleteModal.openModal();
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                          >
                            <Trash2 size={15} strokeWidth={2.25} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerAddressModal
        isOpen={showCustomerModal}
        onClose={handleCloseCustomerModal}
        customerId={editCustomerId}
      />

      <Modal
        isOpen={detailsModal.isOpen}
        onClose={() => {
          detailsModal.closeModal();
          setSelectedCustomer(null);
        }}
        className="m-4 max-w-140"
      >
        <div className="p-6 pr-14">
          <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
            Detalhes do cliente
          </h4>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            Informações cadastrais e endereço principal.
          </p>
          <div className="space-y-3 text-sm">
            <DetailRow
              label="Código"
              value={
                selectedCustomer?.clienteId ? formatCustomerCode(selectedCustomer.clienteId) : '—'
              }
            />
            <DetailRow
              label="Nome"
              value={selectedCustomer ? getCustomerName(selectedCustomer) : '—'}
            />
            <DetailRow label="Idade" value={selectedCustomer?.idade?.toString() ?? '—'} />
            <DetailRow
              label="Sexo"
              value={sexoLabel[selectedCustomer?.sexo ?? ''] ?? selectedCustomer?.sexo ?? '—'}
            />
            <DetailRow
              label="Endereço"
              value={selectedCustomer ? formatAddress(selectedCustomer) : '—'}
            />
            <DetailRow label="CEP" value={selectedCustomer?.enderecos?.[0]?.cep ?? '—'} />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
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
            ? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={remove.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60 dark:bg-red-700 dark:hover:bg-red-600"
            >
              {remove.isPending ? 'Excluindo...' : 'Apagar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-lg border border-gray-100 px-4 py-3 sm:grid-cols-[120px_1fr] dark:border-gray-800">
      <span className="font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-gray-800 dark:text-white/90">{value}</span>
    </div>
  );
}
