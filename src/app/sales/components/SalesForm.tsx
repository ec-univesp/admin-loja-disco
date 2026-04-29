'use client';

import React, { FC, useMemo, useRef, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import Form from '@/shared/components/form/Form';
import Label from '@/shared/components/form/Label';
import CurrencyInput from '@/shared/components/form/CurrencyInput';
import TextArea from '@/shared/components/form/TextArea';
import Button from '@/shared/components/ui/button/Button';
import { formatBRL } from '@/shared/utils/currency';
import { RecordStatus, OrderStatus } from '@/shared/types';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import { useSalesChannelsModel } from '@/app/sales/model/salesChannelsModel';
import { useCustomersModel } from '@/app/sales/model/customersModel';
import { useSalesModel } from '@/app/sales/model/salesModel';
import CustomerAddressModal from './CustomerAddressModal';
import SalesChannelModal from './SalesChannelModal';

interface SaleItemForm {
  discoId: string;
  precoVenda: number;
}

interface SalesFormData {
  clienteId: string;
  enderecoId: string;
  dataVenda: string;
  frete: number;
  pagamento: string;
  canalVendaId: string;
  custosAdicionais: number;
  statusPedido: string;
  observacoes: string;
}

interface SalesFormProps {
  onSuccess?: () => void;
}

const SalesForm: FC<SalesFormProps> = ({ onSuccess }) => {
  const { create: createSale } = useSalesModel();
  const { update: updateRecord, list: recordsList } = useRecordsModel();
  const { list: customersList } = useCustomersModel();
  const { list: salesChannelsList } = useSalesChannelsModel();
  const isSubmitting = createSale.isPending;
  const records = recordsList.data ?? [];
  const customers = customersList.data ?? [];
  const salesChannels = salesChannelsList.data ?? [];

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState<number | undefined>();
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [items, setItems] = useState<SaleItemForm[]>([{ discoId: '', precoVenda: 0 }]);
  const dataVendaRef = useRef<HTMLInputElement | null>(null);

  const availableRecords = useMemo(
    () => records.filter((d) => d.status === RecordStatus.AVAILABLE || !d.status),
    [records]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SalesFormData>({
    defaultValues: {
      clienteId: '',
      enderecoId: '',
      dataVenda: new Date().toISOString().split('T')[0],
      frete: 0,
      pagamento: 'PIX',
      canalVendaId: '',
      custosAdicionais: 0,
      statusPedido: OrderStatus.PENDING,
      observacoes: '',
    },
  });

  const clienteId = useWatch({ control, name: 'clienteId' });
  const frete = useWatch({ control, name: 'frete' });
  const custosAdicionais = useWatch({ control, name: 'custosAdicionais' });

  const customerAddresses = useMemo(() => {
    if (!clienteId) return [];
    const selectedCustomer = customers.find((c) => String(c.clienteId) === clienteId);
    return selectedCustomer?.enderecos ?? [];
  }, [clienteId, customers]);

  const itemsTotal = items.reduce((acc, item) => acc + Number(item.precoVenda || 0), 0);
  const totalValue = itemsTotal + Number(frete || 0) + Number(custosAdicionais || 0);

  const addItem = () => setItems((prev) => [...prev, { discoId: '', precoVenda: 0 }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof SaleItemForm, value: string | number) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const handleFormSubmit = async (data: SalesFormData) => {
    const validItems = items.filter((item) => item.discoId);
    if (validItems.length === 0) return;

    const selectedCustomer = customers.find((c) => String(c.clienteId) === data.clienteId);
    const selectedAddress = customerAddresses.find(
      (e) => String(e.enderecoId) === data.enderecoId
    );
    const selectedChannel = salesChannels.find(
      (c) => String(c.idCanalVenda) === data.canalVendaId
    );

    try {
      await createSale.mutateAsync({
        cliente: selectedCustomer
          ? {
              clienteId: selectedCustomer.clienteId,
              nomeCliente: selectedCustomer.nomeCliente,
              idade: selectedCustomer.idade,
              sexo: selectedCustomer.sexo,
            }
          : undefined,
        endereco: selectedAddress
          ? {
              enderecoId: selectedAddress.enderecoId,
              logradouro: selectedAddress.logradouro,
              numero: selectedAddress.numero,
              cidade: selectedAddress.cidade,
              estado: selectedAddress.estado,
              cep: selectedAddress.cep,
            }
          : undefined,
        dataVenda: data.dataVenda,
        frete: Number(data.frete),
        valorTotal: totalValue,
        pagamento: data.pagamento,
        canalVenda: selectedChannel
          ? {
              idCanalVenda: selectedChannel.idCanalVenda,
              nomeCanalVenda: selectedChannel.nomeCanalVenda,
            }
          : undefined,
        custosAdicionais: Number(data.custosAdicionais),
        statusPedido: data.statusPedido,
        itens: validItems.map((item) => {
          const record = records.find((d) => String(d.discoId) === item.discoId);
          return {
            discoId: Number(item.discoId),
            nomeDisco: record?.album ?? '',
            nomeArtista: record?.artista?.nomeArtista ?? '',
            precoVenda: Number(item.precoVenda),
          };
        }),
      });

      await Promise.all(
        validItems.map((item) => {
          const record = records.find((d) => String(d.discoId) === item.discoId);
          if (!record?.discoId) return Promise.resolve();
          return updateRecord.mutateAsync({
            ...record,
            discoId: record.discoId,
            status: RecordStatus.SOLD,
          });
        })
      );

      reset();
      setItems([{ discoId: '', precoVenda: 0 }]);
      setSuccessMessage('Venda registrada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      onSuccess?.();
    } catch (err) {
      console.error('Error creating sale:', err);
    }
  };

  return (
    <>
      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-900 dark:text-green-200">✓ {successMessage}</p>
        </div>
      )}

      <Form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dados do Cliente
            </h3>
            <div className="flex gap-2">
              {clienteId && (
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setEditCustomerId(Number(clienteId));
                    setShowCustomerModal(true);
                  }}
                >
                  Editar Endereço
                </Button>
              )}
              <Button
                size="sm"
                variant="primary"
                type="button"
                onClick={() => {
                  setEditCustomerId(undefined);
                  setShowCustomerModal(true);
                }}
              >
                + Novo Cliente
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="clienteId">Selecione um Cliente *</Label>
              <select
                id="clienteId"
                {...register('clienteId', { required: 'Cliente é obrigatório' })}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">-- Selecione --</option>
                {customers.map((customer) => (
                  <option key={customer.clienteId} value={customer.clienteId ?? ''}>
                    {customer.nomeCliente}
                    {customer.idade ? ` (${customer.idade} anos)` : ''}
                  </option>
                ))}
              </select>
              {errors.clienteId && (
                <span className="mt-1 text-sm text-red-500">{errors.clienteId.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="enderecoId">Endereço de Entrega *</Label>
              <select
                id="enderecoId"
                {...register('enderecoId', { required: 'Endereço é obrigatório' })}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                disabled={!clienteId}
              >
                <option value="">
                  {clienteId ? '-- Selecione --' : 'Escolha um cliente primeiro'}
                </option>
                {customerAddresses.map((address) => (
                  <option key={address.enderecoId} value={address.enderecoId ?? ''}>
                    {address.logradouro}, {address.numero} - {address.cidade}/{address.estado}
                  </option>
                ))}
              </select>
              {errors.enderecoId && (
                <span className="mt-1 text-sm text-red-500">{errors.enderecoId.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discos</h3>
            <Button size="sm" variant="primary" type="button" onClick={addItem}>
              + Adicionar Disco
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => {
              const selectedRecord = availableRecords.find(
                (d) => String(d.discoId) === item.discoId
              );
              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Disco {index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor={`disco-${index}`}>Selecione um Disco *</Label>
                      <select
                        id={`disco-${index}`}
                        value={item.discoId}
                        onChange={(e) => updateItem(index, 'discoId', e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">-- Selecione --</option>
                        {availableRecords.map((record) => (
                          <option key={record.discoId} value={record.discoId ?? ''}>
                            {record.artista?.nomeArtista} - {record.album} (R${' '}
                            {(record.valorMercado ?? 0).toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor={`preco-${index}`}>Preço de Venda *</Label>
                      <CurrencyInput
                        id={`preco-${index}`}
                        value={item.precoVenda}
                        onChange={(val) => updateItem(index, 'precoVenda', val)}
                      />
                    </div>
                  </div>

                  {selectedRecord && (
                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-900/20">
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Artista</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {selectedRecord.artista?.nomeArtista}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Valor de Mercado</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          R$ {(selectedRecord.valorMercado ?? 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Detalhes da Venda
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="dataVenda">Data da Venda *</Label>
                <div className="relative">
                  <input
                    type="date"
                    id="dataVenda"
                    {...register('dataVenda', { required: 'Data é obrigatória' })}
                    ref={(el) => {
                      register('dataVenda').ref(el);
                      dataVendaRef.current = el;
                    }}
                    className={`h-11 w-full rounded-lg border bg-white px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 ${
                      errors.dataVenda
                        ? 'border-error-500 focus:ring-error-500/10'
                        : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800'
                    }`}
                  />
                  <button
                    type="button"
                    aria-label="Abrir calendário"
                    onClick={() => {
                      const input = dataVendaRef.current;
                      if (!input) return;
                      if (typeof input.showPicker === 'function') input.showPicker();
                      else input.focus();
                    }}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                  >
                    <Calendar size={18} strokeWidth={2} />
                  </button>
                </div>
                {errors.dataVenda && (
                  <span className="mt-1 text-sm text-red-500">{errors.dataVenda.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="frete">Frete</Label>
                <Controller
                  control={control}
                  name="frete"
                  render={({ field }) => (
                    <CurrencyInput id="frete" value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="pagamento">Forma de Pagamento</Label>
                <select
                  id="pagamento"
                  {...register('pagamento')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="PIX">PIX</option>
                  <option value="Cartão Crédito">Cartão Crédito</option>
                  <option value="Cartão Débito">Cartão Débito</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="canalVendaId">Canal de Venda</Label>
                  <button
                    type="button"
                    className="text-brand-600 dark:text-brand-400 text-xs font-medium hover:underline"
                    onClick={() => setShowChannelModal(true)}
                  >
                    + Cadastrar canal
                  </button>
                </div>
                <select
                  id="canalVendaId"
                  {...register('canalVendaId')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">-- Selecione --</option>
                  {salesChannels.map((channel) => (
                    <option key={channel.idCanalVenda} value={channel.idCanalVenda ?? ''}>
                      {channel.nomeCanalVenda}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="custosAdicionais">Custos Adicionais</Label>
                <Controller
                  control={control}
                  name="custosAdicionais"
                  render={({ field }) => (
                    <CurrencyInput
                      id="custosAdicionais"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="statusPedido">Status do Pedido</Label>
                <select
                  id="statusPedido"
                  {...register('statusPedido')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value={OrderStatus.PENDING}>Pendente</option>
                  <option value={OrderStatus.CONFIRMED}>Confirmada</option>
                  <option value={OrderStatus.SHIPPED}>Enviada</option>
                  <option value={OrderStatus.DELIVERED}>Entregue</option>
                  <option value={OrderStatus.CANCELLED}>Cancelada</option>
                </select>
              </div>
            </div>

            <div className="border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-900/20 rounded-lg border p-4">
              <p className="text-brand-700 dark:text-brand-200 text-sm">
                Total da Venda:{' '}
                <span className="ml-2 text-lg font-bold">{formatBRL(totalValue)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Observações</h3>
          <Controller
            name="observacoes"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextArea
                placeholder="Adicionar observações sobre a venda..."
                rows={4}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Registrar Venda
          </Button>
          <Button
            type="reset"
            variant="outline"
            fullWidth
            onClick={() => {
              reset();
              setItems([{ discoId: '', precoVenda: 0 }]);
            }}
          >
            Limpar
          </Button>
        </div>
      </Form>

      <CustomerAddressModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customerId={editCustomerId}
        onSaved={(cId, eId) => {
          setValue('clienteId', String(cId));
          if (eId !== null) setValue('enderecoId', String(eId));
        }}
      />

      <SalesChannelModal
        isOpen={showChannelModal}
        onClose={() => setShowChannelModal(false)}
        onCreated={(id) => setValue('canalVendaId', String(id))}
      />
    </>
  );
};

export default SalesForm;
