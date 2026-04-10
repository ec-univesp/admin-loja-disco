'use client';

import React, { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Form from './Form';
import Label from './Label';
import ControlledInput from './input/ControlledInput';
import CurrencyInput from './input/CurrencyInput';
import TextArea from './input/TextArea';
import FileInput from './input/FileInput';
import DatePicker from './date-picker';
import { formatBRL } from '@/utils/currency';

interface SalesFormData {
  productName: string;
  clientName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: string;
  status: string;
  notes: string;
  receipt?: FileList;
}

interface SalesFormProps {
  onSubmit: (data: SalesFormData) => void;
  isLoading?: boolean;
}

const SalesForm: FC<SalesFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SalesFormData>({
    defaultValues: {
      productName: '',
      clientName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      saleDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: '',
    },
  });

  // Watch quantity and unitPrice to calculate total
  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');

  // Função para lidar com o submit do formulário
  const handleFormSubmit = (data: SalesFormData) => {
    // Calcular o preço total
    const total = Number(quantity) * Number(unitPrice);
    data.totalPrice = total;
    onSubmit(data);
  };

  // Opções de status
  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'confirmed', label: 'Confirmada' },
    { value: 'shipped', label: 'Enviada' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelada' },
  ];

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Dados do Cliente */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Dados do Cliente
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="clientName">Nome do Cliente *</Label>
            <ControlledInput
              type="text"
              id="clientName"
              placeholder="Digite o nome do cliente"
              {...register('clientName', {
                required: 'Nome do cliente é obrigatório',
              })}
              error={!!errors.clientName}
            />
            {errors.clientName && (
              <span className="mt-1 text-sm text-red-500">
                {errors.clientName.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dados do Produto */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Dados do Produto
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="productName">Nome do Produto *</Label>
            <ControlledInput
              type="text"
              id="productName"
              placeholder="Digite o nome do produto"
              {...register('productName', {
                required: 'Nome do produto é obrigatório',
              })}
              error={!!errors.productName}
            />
            {errors.productName && (
              <span className="mt-1 text-sm text-red-500">
                {errors.productName.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="quantity">Quantidade *</Label>
              <ControlledInput
                type="number"
                id="quantity"
                placeholder="1"
                {...register('quantity', {
                  required: 'Quantidade é obrigatória',
                  min: { value: 1, message: 'Quantidade deve ser no mínimo 1' },
                })}
                error={!!errors.quantity}
              />
              {errors.quantity && (
                <span className="mt-1 text-sm text-red-500">
                  {errors.quantity.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="unitPrice">Preço Unitário *</Label>
              <Controller
                control={control}
                name="unitPrice"
                rules={{
                  required: 'Preço unitário é obrigatório',
                  min: { value: 0, message: 'Preço não pode ser negativo' },
                }}
                render={({ field }) => (
                  <CurrencyInput
                    id="unitPrice"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.unitPrice}
                  />
                )}
              />
              {errors.unitPrice && (
                <span className="mt-1 text-sm text-red-500">
                  {errors.unitPrice.message}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Preço Total: {formatBRL(Number(quantity) * Number(unitPrice))}
            </p>
          </div>
        </div>
      </div>

      {/* Dados da Venda */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Dados da Venda
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="saleDate">Data da Venda *</Label>
            <Controller
              name="saleDate"
              control={control}
              rules={{ required: 'Data de venda é obrigatória' }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  id="saleDate"
                  label="Data da Venda"
                  defaultDate={value}
                  onChange={(selectedDates) => {
                    if (selectedDates.length > 0) {
                      const date = selectedDates[0];
                      const formattedDate = date
                        .toISOString()
                        .split('T')[0];
                      onChange(formattedDate);
                    }
                  }}
                />
              )}
            />
            {errors.saleDate && (
              <span className="mt-1 text-sm text-red-500">
                {errors.saleDate.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status da Venda *</Label>
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status é obrigatório' }}
              render={({ field: { onChange, value } }) => (
                <div className="relative">
                  <select
                    id="status"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
            {errors.status && (
              <span className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Observações
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Notas Adicionais</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  placeholder="Digite qualquer observação adicional sobre a venda..."
                  rows={4}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>

          <div>
            <Label htmlFor="receipt">Anexar Comprovante</Label>
            <Controller
              name="receipt"
              control={control}
              render={({ field: { onChange } }) => (
                <FileInput
                  onChange={(e) => onChange(e.target.files)}
                />
              )}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Formatos aceitos: JPG, PNG, PDF (máx. 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-brand-500 px-6 py-2.5 font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Registrar Venda'}
        </button>
        <button
          type="reset"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Limpar Formulário
        </button>
      </div>
    </Form>
  );
};

export default SalesForm;
