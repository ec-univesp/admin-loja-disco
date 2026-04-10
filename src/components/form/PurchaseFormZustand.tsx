'use client';

import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from './Form';
import Label from './Label';
import ControlledInput from './input/ControlledInput';
import Button from '@/components/ui/button/Button';
import { useCompras, useDiscos, useItensCompra } from '@/hooks/useStore';

interface PurchaseFormData {
  fornecedor: string;
  dataCompra: string;
  discoId: string;
  precoCompra: number;
}

interface PurchaseFormZustandProps {
  onSuccess?: () => void;
}

const MENSAGEM_SUCESSO_DURACAO_MS = 3000;

const PurchaseFormZustand: FC<PurchaseFormZustandProps> = ({ onSuccess }) => {
  const { createCompra, loading } = useCompras();
  const { discosComArtista, fetchDiscos } = useDiscos();
  const { createItemCompra } = useItensCompra();
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    defaultValues: {
      fornecedor: '',
      dataCompra: new Date().toISOString().split('T')[0],
      discoId: '',
      precoCompra: 0,
    },
  });

  useEffect(() => {
    fetchDiscos();
  }, [fetchDiscos]);

  const discoId = watch('discoId');
  const discoSelecionado = discosComArtista.find((disco) => disco.id === discoId);

  const handleFormSubmit = async (dadosFormulario: PurchaseFormData) => {
    const valorTotal = Number(dadosFormulario.precoCompra);

    const novaCompra = await createCompra({
      clienteId: '',
      dataCpmpra: dadosFormulario.dataCompra,
      fornecedor: dadosFormulario.fornecedor,
      valorTotal,
    });

    if (novaCompra) {
      await createItemCompra({
        compraId: novaCompra.id,
        discoId: dadosFormulario.discoId,
        precoCompra: Number(dadosFormulario.precoCompra),
      });
    }

    reset();
    setSuccessMsg('Compra registrada com sucesso!');
    setTimeout(() => setSuccessMsg(''), MENSAGEM_SUCESSO_DURACAO_MS);
    onSuccess?.();
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
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Dados da Compra
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <ControlledInput
                type="text"
                id="fornecedor"
                placeholder="Nome do fornecedor"
                {...register('fornecedor', { required: 'Fornecedor é obrigatório' })}
                error={!!errors.fornecedor}
              />
              {errors.fornecedor && (
                <span className="mt-1 text-sm text-red-500">{errors.fornecedor.message}</span>
              )}
            </div>
            <div>
              <Label htmlFor="dataCompra">Data da Compra *</Label>
              <ControlledInput
                type="date"
                id="dataCompra"
                {...register('dataCompra', { required: 'Data é obrigatória' })}
                error={!!errors.dataCompra}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Item</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="discoId">Disco *</Label>
              <select
                id="discoId"
                {...register('discoId', { required: 'Disco é obrigatório' })}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">-- Selecione --</option>
                {discosComArtista.map((disco) => (
                  <option key={disco.id} value={disco.id}>
                    {disco.artistaNome} - {disco.album}
                  </option>
                ))}
              </select>
              {errors.discoId && (
                <span className="mt-1 text-sm text-red-500">{errors.discoId.message}</span>
              )}
            </div>

            {discoSelecionado && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
                Custo estimado: R$ {discoSelecionado.custoDisco?.toFixed(2) || '0.00'}
              </div>
            )}

            <div>
              <Label htmlFor="precoCompra">Preço de Compra (R$) *</Label>
              <ControlledInput
                type="number"
                id="precoCompra"
                placeholder="0.00"
                {...register('precoCompra', {
                  required: 'Preço é obrigatório',
                  min: { value: 0, message: 'Preço não pode ser negativo' },
                })}
                error={!!errors.precoCompra}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            Registrar Compra
          </Button>
          <Button type="reset" variant="outline" fullWidth>
            Limpar
          </Button>
        </div>
      </Form>
    </>
  );
};

export default PurchaseFormZustand;
