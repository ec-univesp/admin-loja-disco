'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/shared/components/ui/modal';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import {
  useClientes,
  useEnderecos,
  useClientesEnderecos,
} from '@/shared/store/useStore';

interface ClienteEnderecoModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Se passado, abre em modo edição */
  clienteId?: string;
  /** Callback chamado quando salva, com clienteId e enderecoId resultantes */
  onSaved?: (clienteId: string, enderecoId: string) => void;
}

interface FormState {
  nome: string;
  generoSexo: 'M' | 'F' | 'Outro' | '';
  idade: number;
  logradouro: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
}

const initialState: FormState = {
  nome: '',
  generoSexo: '',
  idade: 0,
  logradouro: '',
  numero: '',
  cidade: '',
  estado: '',
  cep: '',
};

export default function ClienteEnderecoModal({
  isOpen,
  onClose,
  clienteId,
  onSaved,
}: ClienteEnderecoModalProps) {
  const { clientes, createCliente, updateCliente } = useClientes();
  const { enderecos, createEndereco, updateEndereco } = useEnderecos();
  const { clientesEnderecos, fetchClientesEnderecos, vincularClienteEndereco } =
    useClientesEnderecos();

  const [form, setForm] = useState<FormState>(initialState);
  const [enderecoIdEdicao, setEnderecoIdEdicao] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const isEdicao = Boolean(clienteId);

  useEffect(() => {
    if (isOpen) fetchClientesEnderecos();
  }, [isOpen, fetchClientesEnderecos]);

  useEffect(() => {
    if (!isOpen) return;
    if (!clienteId) {
      setForm(initialState);
      setEnderecoIdEdicao(null);
      return;
    }
    const cliente = clientes.find((clienteAtual) => clienteAtual.id === clienteId);
    const vinculoEndereco = clientesEnderecos.find(
      (vinculo) => vinculo.clienteId === clienteId
    );
    const endereco = vinculoEndereco
      ? enderecos.find((enderecoAtual) => enderecoAtual.id === vinculoEndereco.enderecoId)
      : undefined;
    setForm({
      nome: cliente?.nome ?? '',
      generoSexo: cliente?.generoSexo ?? '',
      idade: cliente?.idade ?? 0,
      logradouro: endereco?.logradouro ?? '',
      numero: endereco?.numero ?? '',
      cidade: endereco?.cidade ?? '',
      estado: endereco?.estado ?? '',
      cep: endereco?.cep ?? '',
    });
    setEnderecoIdEdicao(endereco?.id ?? null);
  }, [isOpen, clienteId, clientes, enderecos, clientesEnderecos]);

  const handleChange =
    (campo: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        campo === 'idade' ? Number(e.target.value || 0) : (e.target.value as never);
      setForm((prev) => ({ ...prev, [campo]: value }));
    };

  const buscarCep = async (cepRaw: string) => {
    const cepLimpo = cepRaw.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    setCepLoading(true);
    setCepError(null);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`);
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
        cep: cepLimpo,
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

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (cepError) setCepError(null);
    if (valor.length === 0) {
      // Limpa todo o endereço quando o CEP é apagado
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
    setForm((prev) => ({ ...prev, cep: valor }));
  };

  const handleBuscarCepClick = () => {
    if (form.cep.length === 8) {
      void buscarCep(form.cep);
    } else {
      setCepError('Informe um CEP com 8 dígitos');
    }
  };

  const temEndereco = Boolean(form.logradouro || form.cidade || form.cep);

  const handleSalvar = async () => {
    if (!form.nome.trim()) {
      alert('Nome do cliente é obrigatório');
      return;
    }
    setSubmitting(true);
    try {
      let resolvedClienteId = clienteId ?? '';
      let resolvedEnderecoId = enderecoIdEdicao ?? '';

      if (isEdicao && clienteId) {
        await updateCliente(clienteId, {
          nome: form.nome,
          generoSexo: form.generoSexo,
          idade: form.idade,
        });

        if (enderecoIdEdicao) {
          await updateEndereco(enderecoIdEdicao, {
            logradouro: form.logradouro,
            numero: form.numero,
            cidade: form.cidade,
            estado: form.estado,
            cep: form.cep,
          });
        } else if (temEndereco) {
          const novoEnd = await createEndereco({
            logradouro: form.logradouro,
            numero: form.numero,
            cidade: form.cidade,
            estado: form.estado,
            cep: form.cep,
          });
          if (novoEnd) {
            await vincularClienteEndereco(clienteId, novoEnd.id);
            resolvedEnderecoId = novoEnd.id;
          }
        }
      } else {
        const novoCliente = await createCliente({
          nome: form.nome,
          generoSexo: form.generoSexo,
          idade: form.idade,
        });
        if (!novoCliente) throw new Error('Falha ao criar cliente');
        resolvedClienteId = novoCliente.id;

        if (temEndereco) {
          const novoEndereco = await createEndereco({
            logradouro: form.logradouro,
            numero: form.numero,
            cidade: form.cidade,
            estado: form.estado,
            cep: form.cep,
          });
          if (novoEndereco) {
            await vincularClienteEndereco(novoCliente.id, novoEndereco.id);
            resolvedEnderecoId = novoEndereco.id;
          }
        }
      }

      onSaved?.(resolvedClienteId, resolvedEnderecoId);
      onClose();
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[640px]">
      <div className="p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          {isEdicao ? 'Editar Cliente / Endereço' : 'Cadastrar Novo Cliente'}
        </h4>

        <div className="space-y-5">
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
                  value={form.nome}
                  onChange={handleChange('nome')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="cli-genero">Gênero / Sexo</Label>
                <select
                  id="cli-genero"
                  value={form.generoSexo}
                  onChange={handleChange('generoSexo')}
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
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Endereço
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <Label htmlFor="end-cep">CEP</Label>
                <div className="flex items-center">
                  <input
                    id="end-cep"
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="Somente números"
                    value={form.cep}
                    onChange={handleCepChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleBuscarCepClick();
                      }
                    }}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleBuscarCepClick}
                    disabled={cepLoading}
                    aria-label="Buscar CEP"
                    className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center text-gray-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-300 dark:hover:text-brand-500"
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
                  <span className="mt-1 block text-xs text-error-600 dark:text-error-400">
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
            <Button size="sm" variant="outline" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button size="sm" variant="primary" onClick={handleSalvar} isLoading={submitting}>
              {isEdicao ? 'Salvar alterações' : 'Cadastrar cliente'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
