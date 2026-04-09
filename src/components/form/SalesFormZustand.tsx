'use client';

import React, { FC, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Form from './Form';
import Label from './Label';
import ControlledInput from './input/ControlledInput';
import TextArea from './input/TextArea';
import FileInput from './input/FileInput';
import DatePicker from './date-picker';
import { useVendas, useClientes, useEnderecos, useDiscos, useItensVenda } from '@/hooks/useStore';

interface SalesFormZustandData {
  clienteId: string;
  enderecoId: string;
  discoId: string;
  precoVenda: number;
  dataVenda: string;
  frete: number;
  pagamento: string;
  canalVenda: string;
  statusPedido: string;
  observacoes: string;
}

interface SalesFormZustandProps {
  onSuccess?: () => void;
}

const SalesFormZustand: FC<SalesFormZustandProps> = ({ onSuccess }) => {
  // Hooks do Store
  const { createVenda, loading: vendaLoading } = useVendas();
  const { clientes, fetchClientes } = useClientes();
  const { enderecos, fetchEnderecos } = useEnderecos();
  const { discosComArtista, fetchDiscos } = useDiscos();
  const { createItemVenda } = useItensVenda();

  // Hooks do React Hook Form
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SalesFormZustandData>({
    defaultValues: {
      clienteId: '',
      enderecoId: '',
      discoId: '',
      precoVenda: 0,
      dataVenda: new Date().toISOString().split('T')[0],
      frete: 0,
      pagamento: 'Cartão',
      canalVenda: 'Loja Online',
      statusPedido: 'Pendente',
      observacoes: '',
    },
  });

  // Carregar dados ao montar
  useEffect(() => {
    fetchClientes();
    fetchEnderecos();
    fetchDiscos();
  }, [fetchClientes, fetchEnderecos, fetchDiscos]);

  // Watch disco para atualizar preço
  const discoId = watch('discoId');
  useEffect(() => {
    if (discoId) {
      const disco = discosComArtista.find((d) => d.id === discoId);
      if (disco) {
        // Você pode atualizar automaticamente o preço se quiser
        // reset(prev => ({ ...prev, precoVenda: disco.valorMercado }));
      }
    }
  }, [discoId, discosComArtista]);

  // Função para lidar com o submit
  const handleFormSubmit = async (data: SalesFormZustandData) => {
    try {
      // Calcular valor total
      const valorTotal = Number(data.precoVenda) + Number(data.frete);

      // Criar venda no store
      const venda = await createVenda({
        clienteId: data.clienteId,
        enderecoId: data.enderecoId,
        dataVenda: data.dataVenda,
        frete: Number(data.frete),
        valorTotal,
        pagamento: data.pagamento,
        canalVenda: data.canalVenda,
        statusPedido: data.statusPedido,
      });

      // Criar item de venda
      if (venda) {
        await createItemVenda({
          vendaId: venda.id,
          discoId: data.discoId,
          precoVenda: Number(data.precoVenda),
        });

        // Limpar formulário
        reset();

        // Callback de sucesso
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Erro ao criar venda:', error);
    }
  };

  // Encontrar disco selecionado
  const discoSelecionado = discosComArtista.find((d) => d.id === discoId);

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Integración com Zustand - Dados do Cliente */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Cliente (Zustand)
        </h3>

        <div>
          <Label htmlFor="clienteId">Selecione um Cliente *</Label>
          <select
            id="clienteId"
            {...register('clienteId', {
              required: 'Cliente é obrigatório',
            })}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">-- Selecione um cliente --</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} ({cliente.idade} anos)
              </option>
            ))}
          </select>
          {errors.clienteId && (
            <span className="mt-1 text-sm text-red-500">
              {errors.clienteId.message}
            </span>
          )}
        </div>
      </div>

      {/* Endereço */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Endereço de Entrega (Zustand)
        </h3>

        <div>
          <Label htmlFor="enderecoId">Selecione um Endereço *</Label>
          <select
            id="enderecoId"
            {...register('enderecoId', {
              required: 'Endereço é obrigatório',
            })}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">-- Selecione um endereço --</option>
            {enderecos.map((endereco) => (
              <option key={endereco.id} value={endereco.id}>
                {endereco.logradouro}, {endereco.numero} - {endereco.cidade}, {endereco.estado}
              </option>
            ))}
          </select>
          {errors.enderecoId && (
            <span className="mt-1 text-sm text-red-500">
              {errors.enderecoId.message}
            </span>
          )}
        </div>
      </div>

      {/* Disco */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Disco (Zustand)
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="discoId">Selecione um Disco *</Label>
            <select
              id="discoId"
              {...register('discoId', {
                required: 'Disco é obrigatório',
              })}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="">-- Selecione um disco --</option>
              {discosComArtista.map((disco) => (
                <option key={disco.id} value={disco.id}>
                  {disco.artistaNome} - {disco.album} (R$ {disco.valorMercado.toFixed(2)})
                </option>
              ))}
            </select>
            {errors.discoId && (
              <span className="mt-1 text-sm text-red-500">
                {errors.discoId.message}
              </span>
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
              <span className="mt-1 text-sm text-red-500">
                {errors.precoVenda.message}
              </span>
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
                {...register('dataVenda', {
                  required: 'Data é obrigatória',
                })}
                error={!!errors.dataVenda}
              />
              {errors.dataVenda && (
                <span className="mt-1 text-sm text-red-500">
                  {errors.dataVenda.message}
                </span>
              )}
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
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="Cartão">Cartão</option>
                <option value="PIX">PIX</option>
                <option value="Boleto">Boleto</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>

            <div>
              <Label htmlFor="canalVenda">Canal de Venda</Label>
              <select
                id="canalVenda"
                {...register('canalVenda')}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="Loja Online">Loja Online</option>
                <option value="Loja Física">Loja Física</option>
                <option value="Marketplace">Marketplace</option>
                <option value="Telefone">Telefone</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="statusPedido">Status do Pedido</Label>
            <select
              id="statusPedido"
              {...register('statusPedido')}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="Pendente">Pendente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Enviada">Enviada</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Observações
        </h3>

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

      {/* Botões */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={vendaLoading}
          className="flex-1 rounded-lg bg-brand-500 px-6 py-2.5 font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {vendaLoading ? 'Salvando...' : 'Registrar Venda (Zustand)'}
        </button>
        <button
          type="reset"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Limpar
        </button>
      </div>
    </Form>
  );
};

export default SalesFormZustand;
