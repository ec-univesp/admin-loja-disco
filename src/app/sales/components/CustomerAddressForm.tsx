'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import { useCustomersModel } from '@/app/sales/model/customersModel';
import {
  customerAddressFormSchema,
  type CustomerAddressFormInput,
} from '@/shared/services/api/form-schemas';

interface CustomerAddressFormProps {
  onClose: () => void;
  customerId?: number;
  onSaved?: (customerId: number, addressId: number | null) => void;
  showTitle?: boolean;
}

const sexoFromDb = z.enum(['M', 'F', 'O']);
const parseSexo = (rawSexo: string | undefined): CustomerAddressFormInput['sexo'] | '' => {
  const parsed = sexoFromDb.safeParse(rawSexo ?? '');
  return parsed.success ? parsed.data : '';
};

const cepResponseSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

const emptyFormValues: CustomerAddressFormInput = {
  nomeCliente: '',
  sexo: 'M',
  idade: 0,
  logradouro: '',
  numero: '',
  cidade: '',
  estado: '',
  cep: '',
};

const inputClass =
  'h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white';
const errorClass = 'mt-1 block text-xs text-red-600 dark:text-red-400';

export default function CustomerAddressForm({
  onClose,
  customerId,
  onSaved,
  showTitle = true,
}: CustomerAddressFormProps) {
  const { list, create, update } = useCustomersModel();
  const customers = useMemo(() => list.data ?? [], [list.data]);
  const isCreating = create.isPending;
  const isUpdating = update.isPending;
  const isMutating = isCreating || isUpdating;
  const isEditing = customerId !== undefined;

  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerAddressFormInput>({
    resolver: zodResolver(customerAddressFormSchema),
    defaultValues: emptyFormValues,
  });

  const currentCep = watch('cep');

  useEffect(() => {
    if (customerId === undefined) {
      reset(emptyFormValues);
      setEditingAddressId(null);
      return;
    }
    const customer = customers.find((item) => item.clienteId === customerId);
    const primaryAddress = customer?.enderecos?.[0];
    const sexo = parseSexo(customer?.sexo);
    reset({
      nomeCliente: customer?.nomeCliente ?? '',
      sexo: sexo === '' ? 'M' : sexo,
      idade: customer?.idade ?? 0,
      logradouro: primaryAddress?.logradouro ?? '',
      numero: primaryAddress?.numero !== undefined ? String(primaryAddress.numero) : '',
      cidade: primaryAddress?.cidade ?? '',
      estado: primaryAddress?.estado ?? '',
      cep: primaryAddress?.cep ?? '',
    });
    setEditingAddressId(primaryAddress?.enderecoId ?? null);
  }, [customerId, customers, reset]);

  const fetchZipCode = async (rawZip: string) => {
    const cleanZip = rawZip.replace(/\D/g, '');
    if (cleanZip.length !== 8) return;

    setCepLoading(true);
    setCepError(null);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanZip}`);
      if (!response.ok) throw new Error('CEP não encontrado.');
      const data = cepResponseSchema.parse(await response.json());
      setValue('cep', cleanZip);
      if (data.street) setValue('logradouro', data.street);
      if (data.city) setValue('cidade', data.city);
      if (data.state) setValue('estado', data.state);
    } catch (cepFetchError) {
      setCepError(
        cepFetchError instanceof Error ? cepFetchError.message : 'Erro ao consultar o CEP.'
      );
    } finally {
      setCepLoading(false);
    }
  };

  const handleZipCodeSearch = () => {
    const cleanedCep = (currentCep ?? '').replace(/\D/g, '');
    if (cleanedCep.length === 8) {
      void fetchZipCode(cleanedCep);
    } else {
      setCepError('Digite o CEP completo (8 dígitos).');
    }
  };

  const onSubmit = async (formInput: CustomerAddressFormInput) => {
    const numericNumero = Number(formInput.numero);
    const addressPayload = {
      enderecoId: editingAddressId ?? undefined,
      logradouro: formInput.logradouro,
      numero: Number.isFinite(numericNumero) ? numericNumero : undefined,
      cidade: formInput.cidade,
      estado: formInput.estado,
      cep: formInput.cep,
    };

    const payload = {
      clienteId: customerId,
      nomeCliente: formInput.nomeCliente,
      sexo: formInput.sexo,
      idade: formInput.idade,
      enderecos: [addressPayload],
    };

    const savedCustomer = isEditing
      ? await update.mutateAsync(payload)
      : await create.mutateAsync(payload);

    const resolvedClienteId = savedCustomer.clienteId ?? customerId;
    if (resolvedClienteId === undefined) return;
    const resolvedEnderecoId = savedCustomer.enderecos?.[0]?.enderecoId ?? null;
    onSaved?.(resolvedClienteId, resolvedEnderecoId);
    reset(emptyFormValues);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {showTitle && (
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {isEditing ? 'Editar Cliente / Endereço' : 'Cadastrar Novo Cliente'}
        </h4>
      )}

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Dados do Cliente
        </h5>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="cli-nome">Nome *</Label>
            <input id="cli-nome" type="text" {...register('nomeCliente')} className={inputClass} />
            {errors.nomeCliente && <span className={errorClass}>{errors.nomeCliente.message}</span>}
          </div>
          <div>
            <Label htmlFor="cli-genero">Gênero *</Label>
            <select id="cli-genero" {...register('sexo')} className={inputClass}>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
            {errors.sexo && <span className={errorClass}>{errors.sexo.message}</span>}
          </div>
          <div>
            <Label htmlFor="cli-idade">Idade *</Label>
            <input
              id="cli-idade"
              type="number"
              {...register('idade', { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.idade && <span className={errorClass}>{errors.idade.message}</span>}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Endereço</h5>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <Label htmlFor="end-cep">CEP *</Label>
            <div className="flex items-center">
              <input
                id="end-cep"
                type="text"
                inputMode="numeric"
                maxLength={9}
                placeholder="00000-000"
                {...register('cep')}
                onKeyDown={(keyEvent) => {
                  if (keyEvent.key === 'Enter') {
                    keyEvent.preventDefault();
                    handleZipCodeSearch();
                  }
                }}
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleZipCodeSearch}
                disabled={cepLoading}
                aria-label="Buscar CEP"
                className="hover:text-brand-600 dark:hover:text-brand-500 ml-1 flex h-8 w-8 shrink-0 items-center justify-center text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-300"
              >
                {cepLoading ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {cepError && <span className={errorClass}>{cepError}</span>}
            {errors.cep && !cepError && <span className={errorClass}>{errors.cep.message}</span>}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="end-log">Logradouro *</Label>
            <input
              id="end-log"
              type="text"
              {...register('logradouro')}
              disabled={cepLoading}
              className={`${inputClass} disabled:opacity-60`}
            />
            {errors.logradouro && <span className={errorClass}>{errors.logradouro.message}</span>}
          </div>
          <div>
            <Label htmlFor="end-num">Número *</Label>
            <input id="end-num" type="text" {...register('numero')} className={inputClass} />
            {errors.numero && <span className={errorClass}>{errors.numero.message}</span>}
          </div>
          <div>
            <Label htmlFor="end-cid">Cidade *</Label>
            <input
              id="end-cid"
              type="text"
              {...register('cidade')}
              disabled={cepLoading}
              className={`${inputClass} disabled:opacity-60`}
            />
            {errors.cidade && <span className={errorClass}>{errors.cidade.message}</span>}
          </div>
          <div>
            <Label htmlFor="end-est">Estado (UF) *</Label>
            <input
              id="end-est"
              type="text"
              maxLength={2}
              {...register('estado')}
              disabled={cepLoading}
              className={`${inputClass} disabled:opacity-60`}
            />
            {errors.estado && <span className={errorClass}>{errors.estado.message}</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose} disabled={isMutating || isSubmitting}>
          Cancelar
        </Button>
        <Button size="sm" variant="primary" isLoading={isMutating || isSubmitting}>
          {isEditing ? 'Salvar alterações' : 'Cadastrar cliente'}
        </Button>
      </div>
    </form>
  );
}
