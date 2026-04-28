'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import { useFornecedores } from '@/shared/store/useStore';

interface FornecedorFormProps {
  onClose: () => void;
  onSaved?: (nome: string) => void;
  fornecedorIdInicial?: string;
}

interface FormState {
  nome: string;
  endereco: string;
  contato: string;
  responsavel: string;
}

const stateInicial: FormState = {
  nome: '',
  endereco: '',
  contato: '',
  responsavel: '',
};

export default function FornecedorForm({
  onClose,
  onSaved,
  fornecedorIdInicial,
}: FornecedorFormProps) {
  const { fornecedores, fetchFornecedores, createFornecedor, updateFornecedor } =
    useFornecedores();
  const [formState, setFormState] = useState<FormState>(stateInicial);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  useEffect(() => {
    if (!fornecedorIdInicial) {
      setFormState(stateInicial);
      return;
    }
    const alvo = fornecedores.find((f) => f.id === fornecedorIdInicial);
    if (alvo) {
      setFormState({
        nome: alvo.nome,
        endereco: alvo.endereco ?? '',
        contato: alvo.contato ?? '',
        responsavel: alvo.responsavel ?? '',
      });
    }
  }, [fornecedorIdInicial, fornecedores]);

  const atualizarCampo = <Campo extends keyof FormState>(
    campo: Campo,
    valor: FormState[Campo]
  ) => {
    setFormState((anterior) => ({ ...anterior, [campo]: valor }));
    if (erro) setErro('');
  };

  const handleSalvar = async () => {
    const nomeFornecedor = formState.nome.trim();
    if (!nomeFornecedor) {
      setErro('Nome do fornecedor é obrigatório');
      return;
    }
    const conflito = fornecedores.some(
      (fornecedor) =>
        fornecedor.id !== fornecedorIdInicial &&
        fornecedor.nome.toLowerCase() === nomeFornecedor.toLowerCase()
    );
    if (conflito) {
      setErro('Já existe um fornecedor com esse nome');
      return;
    }

    const payload = {
      nome: nomeFornecedor,
      endereco: formState.endereco.trim(),
      contato: formState.contato.trim(),
      responsavel: formState.responsavel.trim(),
    };

    setSubmitting(true);
    try {
      if (fornecedorIdInicial) {
        await updateFornecedor(fornecedorIdInicial, payload);
        onSaved?.(payload.nome);
      } else {
        const novo = await createFornecedor(payload);
        if (novo) onSaved?.(novo.nome);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="fornecedor-nome">Nome do Fornecedor *</Label>
          <input
            id="fornecedor-nome"
            type="text"
            value={formState.nome}
            onChange={(event) => atualizarCampo('nome', event.target.value)}
            placeholder="Ex: Disco Center, Sebo do João..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            autoFocus
          />
        </div>

        <div>
          <Label htmlFor="fornecedor-responsavel">Pessoa Responsável</Label>
          <input
            id="fornecedor-responsavel"
            type="text"
            value={formState.responsavel}
            onChange={(event) => atualizarCampo('responsavel', event.target.value)}
            placeholder="Ex: Maria Silva"
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <Label htmlFor="fornecedor-contato">Número de Contato</Label>
          <input
            id="fornecedor-contato"
            type="tel"
            value={formState.contato}
            onChange={(event) => atualizarCampo('contato', event.target.value)}
            placeholder="(11) 99999-9999"
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <Label htmlFor="fornecedor-endereco">Endereço</Label>
          <input
            id="fornecedor-endereco"
            type="text"
            value={formState.endereco}
            onChange={(event) => atualizarCampo('endereco', event.target.value)}
            placeholder="Rua, número, cidade..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      {erro && <span className="block text-sm text-red-500">{erro}</span>}

      <div className="flex justify-end gap-3 pt-2">
        <Button size="sm" variant="outline" onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button size="sm" variant="primary" onClick={handleSalvar} isLoading={submitting}>
          {fornecedorIdInicial ? 'Salvar alterações' : 'Cadastrar'}
        </Button>
      </div>
    </div>
  );
}
