'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import { useCustomersModel } from '@/app/sales/model/customersModel';

interface CustomerAddressFormProps {
  onClose: () => void;
  customerId?: number;
  onSaved?: (customerId: number, addressId: number | null) => void;
  showTitle?: boolean;
}

interface FormState {
  nomeCliente: string;
  sexo: 'M' | 'F' | 'Outro' | '';
  idade: number;
  logradouro: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
}

const initialFormState: FormState = {
  nomeCliente: '',
  sexo: '',
  idade: 0,
  logradouro: '',
  numero: '',
  cidade: '',
  estado: '',
  cep: '',
};

export default function CustomerAddressForm({
  onClose,
  customerId,
  onSaved,
  showTitle = true,
}: CustomerAddressFormProps) {
  const { list, create, update } = useCustomersModel();
  const customers = list.data ?? [];
  const isCreating = create.isPending;
  const isUpdating = update.isPending;

  const [form, setForm] = useState<FormState>(initialFormState);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;
  const isEditing = customerId !== undefined;

  useEffect(() => {
    if (customerId === undefined) {
      setForm(initialFormState);
      setEditingAddressId(null);
      return;
    }
    const customer = customers.find((item) => item.clienteId === customerId);
    const primaryAddress = customer?.enderecos?.[0];
    setForm({
      nomeCliente: customer?.nomeCliente ?? '',
      sexo: (customer?.sexo as FormState['sexo']) ?? '',
      idade: customer?.idade ?? 0,
      logradouro: primaryAddress?.logradouro ?? '',
      numero: primaryAddress?.numero !== undefined ? String(primaryAddress.numero) : '',
      cidade: primaryAddress?.cidade ?? '',
      estado: primaryAddress?.estado ?? '',
      cep: primaryAddress?.cep ?? '',
    });
    setEditingAddressId(primaryAddress?.enderecoId ?? null);
  }, [customerId, customers]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === 'idade' ? Number(e.target.value || 0) : (e.target.value as never);
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const fetchZipCode = async (rawZip: string) => {
    const cleanZip = rawZip.replace(/\D/g, '');
    if (cleanZip.length !== 8) return;

    setCepLoading(true);
    setCepError(null);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanZip}`);
      if (!response.ok) {
        throw new Error('CEP não encontrado');
      }
      const data: {
        street?: string;
        city?: string;
        state?: string;
      } = await response.json();
      setForm((prev) => ({
        ...prev,
        cep: cleanZip,
        logradouro: data.street ?? prev.logradouro,
        cidade: data.city ?? prev.cidade,
        estado: data.state ?? prev.estado,
      }));
    } catch (err) {
      setCepError(err instanceof Error ? err.message : 'Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (cepError) setCepError(null);
    if (value.length === 0) {
      setForm((prev) => ({
        ...prev,
        cep: '',
        logradouro: '',
        numero: '',
        cidade: '',
        estado: '',
      }));
      return;
    }
    setForm((prev) => ({ ...prev, cep: value }));
  };

  const handleZipCodeSearch = () => {
    if (form.cep.length === 8) {
      void fetchZipCode(form.cep);
    } else {
      setCepError('Digite o CEP completo (8 dígitos)');
    }
  };

  const hasAddress = Boolean(form.logradouro || form.cidade || form.cep);

  const handleSave = async () => {
    if (!form.nomeCliente.trim()) {
      alert('Nome do cliente é obrigatório');
      return;
    }

    const addressPayload = hasAddress
      ? {
          enderecoId: editingAddressId ?? undefined,
          logradouro: form.logradouro,
          numero: form.numero ? Number(form.numero) : undefined,
          cidade: form.cidade,
          estado: form.estado,
          cep: form.cep,
        }
      : null;

    const payload = {
      clienteId: customerId,
      nomeCliente: form.nomeCliente,
      sexo: form.sexo || undefined,
      idade: form.idade,
      enderecos: addressPayload ? [addressPayload] : [],
    };

    const savedCustomer = isEditing
      ? await update.mutateAsync(payload)
      : await create.mutateAsync(payload);

    const resolvedClienteId = savedCustomer.clienteId ?? customerId;
    if (resolvedClienteId === undefined) return;

    const resolvedEnderecoId = savedCustomer.enderecos?.[0]?.enderecoId ?? null;
    onSaved?.(resolvedClienteId, resolvedEnderecoId);
    onClose();
    setForm(initialFormState);
  };

  return (
    <div className="space-y-5">
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
            <input
              id="cli-nome"
              type="text"
              value={form.nomeCliente}
              onChange={handleChange('nomeCliente')}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="cli-genero">Gênero</Label>
            <select
              id="cli-genero"
              value={form.sexo}
              onChange={handleChange('sexo')}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="">--</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <Label htmlFor="cli-idade">Idade</Label>
            <input
              id="cli-idade"
              type="number"
              value={form.idade || ''}
              onChange={handleChange('idade')}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Endereço</h5>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <Label htmlFor="end-cep">CEP</Label>
            <div className="flex items-center">
              <input
                id="end-cep"
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="Apenas números"
                value={form.cep}
                onChange={handleZipCodeChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleZipCodeSearch();
                  }
                }}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
            {cepError && (
              <span className="text-error-600 dark:text-error-400 mt-1 block text-xs">
                {cepError}
              </span>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="end-log">Logradouro</Label>
            <input
              id="end-log"
              type="text"
              value={form.logradouro}
              onChange={handleChange('logradouro')}
              disabled={cepLoading}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="end-num">Número *</Label>
            <input
              id="end-num"
              type="text"
              value={form.numero}
              onChange={handleChange('numero')}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="end-cid">Cidade</Label>
            <input
              id="end-cid"
              type="text"
              value={form.cidade}
              onChange={handleChange('cidade')}
              disabled={cepLoading}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="end-est">Estado</Label>
            <input
              id="end-est"
              type="text"
              value={form.estado}
              onChange={handleChange('estado')}
              disabled={cepLoading}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button size="sm" variant="primary" onClick={handleSave} isLoading={isSubmitting}>
          {isEditing ? 'Salvar alterações' : 'Cadastrar cliente'}
        </Button>
      </div>
    </div>
  );
}
