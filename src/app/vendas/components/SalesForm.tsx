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
import { useDiscosModel } from '@/app/estoque/model/discosModel';
import { useCanaisVendaModel } from '@/app/vendas/model/canaisVendaModel';
import { useClientesModel } from '@/app/vendas/model/clientesModel';
import { useVendasModel } from '@/app/vendas/model/vendasModel';
import ClienteEnderecoModal from './ClienteEnderecoModal';
import CanalVendaModal from './CanalVendaModal';

interface ItemVendaForm {
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
  const { criar: criarVenda } = useVendasModel();
  const { atualizar: atualizarDisco, lista: listaDiscos } = useDiscosModel();
  const { lista: listaClientes } = useClientesModel();
  const { lista: listaCanaisVenda } = useCanaisVendaModel();
  const criando = criarVenda.isPending;
  const discos = listaDiscos.data ?? [];
  const clientes = listaClientes.data ?? [];
  const canaisVenda = listaCanaisVenda.data ?? [];

  const [showClienteModal, setShowClienteModal] = useState(false);
  const [editClienteId, setEditClienteId] = useState<number | undefined>();
  const [showCanalModal, setShowCanalModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [itens, setItens] = useState<ItemVendaForm[]>([{ discoId: '', precoVenda: 0 }]);
  const dataVendaRef = useRef<HTMLInputElement | null>(null);

  const discosDisponiveis = useMemo(
    () => discos.filter((d) => d.status === 'Disponível' || !d.status),
    [discos]
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
      statusPedido: 'Pendente',
      observacoes: '',
    },
  });

  const clienteId = useWatch({ control, name: 'clienteId' });
  const frete = useWatch({ control, name: 'frete' });
  const custosAdicionais = useWatch({ control, name: 'custosAdicionais' });

  const enderecosDoCliente = useMemo(() => {
    if (!clienteId) return [];
    const cliente = clientes.find((c) => String(c.clienteId) === clienteId);
    return cliente?.enderecos ?? [];
  }, [clienteId, clientes]);

  const somaItens = itens.reduce((acc, item) => acc + Number(item.precoVenda || 0), 0);
  const valorTotal = somaItens + Number(frete || 0) + Number(custosAdicionais || 0);

  const adicionarItem = () => setItens((prev) => [...prev, { discoId: '', precoVenda: 0 }]);
  const removerItem = (index: number) => setItens((prev) => prev.filter((_, i) => i !== index));
  const atualizarItem = (index: number, campo: keyof ItemVendaForm, valor: string | number) =>
    setItens((prev) => prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)));

  const handleFormSubmit = async (dados: SalesFormData) => {
    const itensValidos = itens.filter((item) => item.discoId);
    if (itensValidos.length === 0) return;

    const clienteSelecionado = clientes.find((c) => String(c.clienteId) === dados.clienteId);
    const enderecoSelecionado = enderecosDoCliente.find(
      (e) => String(e.enderecoId) === dados.enderecoId
    );
    const canalSelecionado = canaisVenda.find(
      (c) => String(c.idCanalVenda) === dados.canalVendaId
    );

    try {
      await criarVenda.mutateAsync({
        cliente: clienteSelecionado
          ? {
              clienteId: clienteSelecionado.clienteId,
              nomeCliente: clienteSelecionado.nomeCliente,
              idade: clienteSelecionado.idade,
              sexo: clienteSelecionado.sexo,
            }
          : undefined,
        endereco: enderecoSelecionado
          ? {
              enderecoId: enderecoSelecionado.enderecoId,
              logradouro: enderecoSelecionado.logradouro,
              numero: enderecoSelecionado.numero,
              cidade: enderecoSelecionado.cidade,
              estado: enderecoSelecionado.estado,
              cep: enderecoSelecionado.cep,
            }
          : undefined,
        dataVenda: dados.dataVenda,
        frete: Number(dados.frete),
        valorTotal,
        pagamento: dados.pagamento,
        canalVenda: canalSelecionado
          ? {
              idCanalVenda: canalSelecionado.idCanalVenda,
              nomeCanalVenda: canalSelecionado.nomeCanalVenda,
            }
          : undefined,
        custosAdicionais: Number(dados.custosAdicionais),
        statusPedido: dados.statusPedido,
        itens: itensValidos.map((item) => {
          const disco = discos.find((d) => String(d.discoId) === item.discoId);
          return {
            discoId: Number(item.discoId),
            nomeDisco: disco?.album ?? '',
            nomeArtista: disco?.artista?.nomeArtista ?? '',
            precoVenda: Number(item.precoVenda),
          };
        }),
      });

      await Promise.all(
        itensValidos.map((item) => {
          const disco = discos.find((d) => String(d.discoId) === item.discoId);
          if (!disco?.discoId) return Promise.resolve();
          return atualizarDisco.mutateAsync({
            ...disco,
            discoId: disco.discoId,
            status: 'Vendido',
          });
        })
      );

      reset();
      setItens([{ discoId: '', precoVenda: 0 }]);
      setSuccessMsg('Venda registrada com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
      onSuccess?.();
    } catch (erro) {
      console.error('Erro ao criar venda:', erro);
    }
  };

  return (
    <>
      {successMsg && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-900 dark:text-green-200">✓ {successMsg}</p>
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
                    setEditClienteId(Number(clienteId));
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
                {clientes.map((cliente) => (
                  <option key={cliente.clienteId} value={cliente.clienteId ?? ''}>
                    {cliente.nomeCliente}
                    {cliente.idade ? ` (${cliente.idade} anos)` : ''}
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
                {enderecosDoCliente.map((endereco) => (
                  <option key={endereco.enderecoId} value={endereco.enderecoId ?? ''}>
                    {endereco.logradouro}, {endereco.numero} - {endereco.cidade}/{endereco.estado}
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
            <Button size="sm" variant="primary" type="button" onClick={adicionarItem}>
              + Adicionar Disco
            </Button>
          </div>

          <div className="space-y-4">
            {itens.map((item, index) => {
              const discoSelecionado = discosDisponiveis.find(
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
                    {itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerItem(index)}
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
                        onChange={(e) => atualizarItem(index, 'discoId', e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">-- Selecione --</option>
                        {discosDisponiveis.map((disco) => (
                          <option key={disco.discoId} value={disco.discoId ?? ''}>
                            {disco.artista?.nomeArtista} - {disco.album} (R${' '}
                            {(disco.valorMercado ?? 0).toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor={`preco-${index}`}>Preço de Venda *</Label>
                      <CurrencyInput
                        id={`preco-${index}`}
                        value={item.precoVenda}
                        onChange={(val) => atualizarItem(index, 'precoVenda', val)}
                      />
                    </div>
                  </div>

                  {discoSelecionado && (
                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-900/20">
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Artista</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {discoSelecionado.artista?.nomeArtista}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Valor Mercado</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          R$ {(discoSelecionado.valorMercado ?? 0).toFixed(2)}
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
            Dados da Venda
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
                  {canaisVenda.map((canal) => (
                    <option key={canal.idCanalVenda} value={canal.idCanalVenda ?? ''}>
                      {canal.nomeCanalVenda}
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
                  <option value="Pendente">Pendente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Enviada">Enviada</option>
                  <option value="Entregue">Entregue</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-900/20 rounded-lg border p-4">
              <p className="text-brand-700 dark:text-brand-200 text-sm">
                Valor Total da Venda:{' '}
                <span className="ml-2 text-lg font-bold">{formatBRL(valorTotal)}</span>
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
                placeholder="Adicione observações sobre a venda..."
                rows={4}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" fullWidth isLoading={criando}>
            Registrar Venda
          </Button>
          <Button
            type="reset"
            variant="outline"
            fullWidth
            onClick={() => {
              reset();
              setItens([{ discoId: '', precoVenda: 0 }]);
            }}
          >
            Limpar
          </Button>
        </div>
      </Form>

      <ClienteEnderecoModal
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        clienteId={editClienteId}
        onSaved={(cId, eId) => {
          setValue('clienteId', String(cId));
          if (eId !== null) setValue('enderecoId', String(eId));
        }}
      />

      <CanalVendaModal
        isOpen={showCanalModal}
        onClose={() => setShowCanalModal(false)}
        onCreated={(id) => setValue('canalVendaId', String(id))}
      />
    </>
  );
};

export default SalesForm;
