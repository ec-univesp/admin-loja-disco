'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import {
  useClientes,
  useEnderecos,
  useClientesEnderecos,
} from '@/hooks/useStore';

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
              <div className="md:col-span-2">
                <Label htmlFor="end-log">Logradouro</Label>
                <input
                  id="end-log"
                  type="text"
                  value={form.logradouro}
                  onChange={handleChange('logradouro')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="end-num">Número</Label>
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
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="end-est">Estado</Label>
                <input
                  id="end-est"
                  type="text"
                  value={form.estado}
                  onChange={handleChange('estado')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="end-cep">CEP</Label>
                <input
                  id="end-cep"
                  type="text"
                  value={form.cep}
                  onChange={handleChange('cep')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
