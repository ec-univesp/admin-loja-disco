'use client';

import React, { FC, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Form from './Form';
import Label from './Label';
import ControlledInput from './input/ControlledInput';
import TextArea from './input/TextArea';
import Button from '@/components/ui/button/Button';
import {
  useVendas,
  useClientes,
  useEnderecos,
  useDiscos,
  useItensVenda,
  useCanaisVenda,
  useClientesEnderecos,
} from '@/hooks/useStore';
import ClienteEnderecoModal from './ClienteEnderecoModal';
import CanalVendaModal from './CanalVendaModal';

interface SalesFormZustandData {
  clienteId: string;
  enderecoId: string;
  discoId: string;
  precoVenda: number;
  dataVenda: string;
  frete: number;
  pagamento: string;
  canalVendaId: string;
  custosAdicionais: number;
  statusPedido: string;
  observacoes: string;
}

interface SalesFormZustandProps {
  onSuccess?: () => void;
}

const SalesFormZustand: FC<SalesFormZustandProps> = ({ onSuccess }) => {
  const { createVenda, loading: vendaLoading } = useVendas();
  const { clientes, fetchClientes } = useClientes();
  const { enderecos, fetchEnderecos } = useEnderecos();
  const { discosComArtista, fetchDiscos } = useDiscos();
  const { createItemVenda } = useItensVenda();
  const { canaisVenda, fetchCanaisVenda } = useCanaisVenda();
  const { clientesEnderecos, fetchClientesEnderecos } = useClientesEnderecos();

  const [showClienteModal, setShowClienteModal] = useState(false);
  const [editClienteId, setEditClienteId] = useState<string | undefined>();
  const [showCanalModal, setShowCanalModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SalesFormZustandData>({
    defaultValues: {
      clienteId: '',
      enderecoId: '',
      discoId: '',
      precoVenda: 0,
      dataVenda: new Date().toISOString().split('T')[0],
      frete: 0,
      pagamento: 'PIX',
      canalVendaId: '',
      custosAdicionais: 0,
      statusPedido: 'Pendente',
      observacoes: '',
    },
  });

  useEffect(() => {
    fetchClientes();
    fetchEnderecos();
    fetchDiscos();
    fetchCanaisVenda();
    fetchClientesEnderecos();
  }, [fetchClientes, fetchEnderecos, fetchDiscos, fetchCanaisVenda, fetchClientesEnderecos]);

  const discoId = watch('discoId');
  const clienteId = watch('clienteId');
  const canalVendaId = watch('canalVendaId');
  const precoVenda = watch('precoVenda');
  const frete = watch('frete');
  const custosAdicionais = watch('custosAdicionais');

  // Endereços disponíveis para o cliente selecionado
  const enderecosDoCliente = useMemo(() => {
    if (!clienteId) return [] as typeof enderecos;
    const ids = clientesEnderecos
      .filter((r) => r.clienteId === clienteId)
      .map((r) => r.enderecoId);
    return enderecos.filter((e) => ids.includes(e.id));
  }, [clienteId, clientesEnderecos, enderecos]);

  // Atualiza taxa do canal automaticamente em custosAdicionais (sugestão)
  useEffect(() => {
    if (!canalVendaId) return;
    const canal = canaisVenda.find((c) => c.id === canalVendaId);
    if (canal && precoVenda) {
      const sugestao = (Number(precoVenda) * canal.taxaPadrao) / 100;
      setValue('custosAdicionais', Number(sugestao.toFixed(2)));
    }
  }, [canalVendaId, precoVenda, canaisVenda, setValue]);

  const valorTotal =
    Number(precoVenda || 0) + Number(frete || 0) + Number(custosAdicionais || 0);

  const handleFormSubmit = async (data: SalesFormZustandData) => {
    try {
      const venda = await createVenda({
        clienteId: data.clienteId,
        enderecoId: data.enderecoId,
        dataVenda: data.dataVenda,
        frete: Number(data.frete),
        valorTotal,
        pagamento: data.pagamento,
        canalVendaId: data.canalVendaId,
        custosAdicionais: Number(data.custosAdicionais),
        statusPedido: data.statusPedido,
      });

      if (venda) {
        await createItemVenda({
          vendaId: venda.id,
          discoId: data.discoId,
          precoVenda: Number(data.precoVenda),
        });
        reset();
        setSuccessMsg('Venda registrada com sucesso!');
        setTimeout(() => setSuccessMsg(''), 3000);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Erro ao criar venda:', error);
    }
  };

  const discoSelecionado = discosComArtista.find((d) => d.id === discoId);

  return (
    <>
      {successMsg && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-900 dark:text-green-200">✓ {successMsg}</p>
        </div>
      )}

      <Form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Cliente */}
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
                    setEditClienteId(clienteId);
                    setShowClienteModal(true);
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
                  setEditClienteId(undefined);
                  setShowClienteModal(true);
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
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                    {c.idade ? ` (${c.idade} anos)` : ''}
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
                {enderecosDoCliente.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.logradouro}, {e.numero} - {e.cidade}/{e.estado}
                  </option>
                ))}
              </select>
              {errors.enderecoId && (
                <span className="mt-1 text-sm text-red-500">{errors.enderecoId.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Disco */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Disco</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="discoId">Selecione um Disco *</Label>
              <select
                id="discoId"
                {...register('discoId', { required: 'Disco é obrigatório' })}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">-- Selecione --</option>
                {discosComArtista.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.artistaNome} - {d.album} (R$ {d.valorMercado.toFixed(2)})
                  </option>
                ))}
              </select>
              {errors.discoId && (
                <span className="mt-1 text-sm text-red-500">{errors.discoId.message}</span>
              )}
            </div>

            {discoSelecionado && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600 dark:text-blue-300">Artista</p>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {discoSelecionado.artistaNome}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 dark:text-blue-300">Gravadora</p>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {discoSelecionado.gravadora}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 dark:text-blue-300">Ano</p>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {discoSelecionado.anoLancamento}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 dark:text-blue-300">Valor Mercado</p>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      R$ {discoSelecionado.valorMercado.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="precoVenda">Preço de Venda (R$) *</Label>
              <ControlledInput
                type="number"
                id="precoVenda"
placeholder={discoSelecionado?.valorMercado.toFixed(2) || '0.00'}
                {...register('precoVenda', {
                  required: 'Preço é obrigatório',
                  min: { value: 0, message: 'Preço não pode ser negativo' },
                })}
                error={!!errors.precoVenda}
              />
              {errors.precoVenda && (
                <span className="mt-1 text-sm text-red-500">{errors.precoVenda.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Dados da Venda */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Dados da Venda
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="dataVenda">Data da Venda *</Label>
                <ControlledInput
                  type="date"
                  id="dataVenda"
                  {...register('dataVenda', { required: 'Data é obrigatória' })}
                  error={!!errors.dataVenda}
                />
              </div>

              <div>
                <Label htmlFor="frete">Frete (R$)</Label>
                <ControlledInput
                  type="number"
                  id="frete"
    placeholder="0.00"
                  {...register('frete')}
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
                    className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                    onClick={() => setShowCanalModal(true)}
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
                  {canaisVenda.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                      {c.taxaPadrao ? ` (taxa ${c.taxaPadrao}%)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="custosAdicionais">Custos Adicionais (R$)</Label>
                <ControlledInput
                  type="number"
                  id="custosAdicionais"
    placeholder="0.00"
                  {...register('custosAdicionais')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Sugerido a partir da taxa do canal selecionado
                </p>
              </div>

              <div>
                <Label htmlFor="statusPedido">Status do Pedido</Label>
                <select
                  id="statusPedido"
                  {...register('statusPedido')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Enviada">Enviada</option>
                  <option value="Entregue">Entregue</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 dark:border-brand-900 dark:bg-brand-900/20">
              <p className="text-sm text-brand-700 dark:text-brand-200">
                Valor Total da Venda:{' '}
                <span className="ml-2 text-lg font-bold">R$ {valorTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Observações</h3>
          <Controller
            name="observacoes"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextArea
                placeholder="Adicione observações sobre a venda..."
                rows={4}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" fullWidth isLoading={vendaLoading}>
            Registrar Venda
          </Button>
          <Button type="reset" variant="outline" fullWidth>
            Limpar
          </Button>
        </div>
      </Form>

      <ClienteEnderecoModal
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        clienteId={editClienteId}
        onSaved={(cId, eId) => {
          setValue('clienteId', cId);
          if (eId) setValue('enderecoId', eId);
        }}
      />

      <CanalVendaModal
        isOpen={showCanalModal}
        onClose={() => setShowCanalModal(false)}
        onCreated={(id) => setValue('canalVendaId', id)}
      />
    </>
  );
};

export default SalesFormZustand;
