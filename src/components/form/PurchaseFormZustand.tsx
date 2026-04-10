'use client';

import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Form from './Form';
import Label from './Label';
import ControlledInput from './input/ControlledInput';
import CurrencyInput from './input/CurrencyInput';
import Button from '@/components/ui/button/Button';
import { useCompras } from '@/hooks/useStore';

interface PurchaseFormData {
  fornecedor: string;
  dataCompra: string;
  valorTotal: number;
}

interface PurchaseFormZustandProps {
  onSuccess?: () => void;
}

const MENSAGEM_SUCESSO_DURACAO_MS = 3000;

const PurchaseFormZustand: FC<PurchaseFormZustandProps> = ({ onSuccess }) => {
  const { createCompra, loading } = useCompras();
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    defaultValues: {
      fornecedor: '',
      dataCompra: new Date().toISOString().split('T')[0],
      valorTotal: 0,
    },
  });

  const handleFormSubmit = async (dadosFormulario: PurchaseFormData) => {
    await createCompra({
      clienteId: '',
      dataCpmpra: dadosFormulario.dataCompra,
      fornecedor: dadosFormulario.fornecedor,
      valorTotal: Number(dadosFormulario.valorTotal),
    });

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
            <div className="md:col-span-2">
              <Label htmlFor="valorTotal">Valor Total *</Label>
              <Controller
                control={control}
                name="valorTotal"
                rules={{
                  required: 'Valor é obrigatório',
                  min: { value: 0, message: 'Valor não pode ser negativo' },
                }}
                render={({ field }) => (
                  <CurrencyInput
                    id="valorTotal"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.valorTotal}
                  />
                )}
              />
              {errors.valorTotal && (
                <span className="mt-1 text-sm text-red-500">{errors.valorTotal.message}</span>
              )}
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
