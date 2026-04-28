'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/modal';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import { useFornecedores } from '@/shared/store/useStore';
import type { Fornecedor } from '@/shared/types/models';

interface FornecedorFormProps {
  onClose: () => void;
  onCreated?: (nome: string) => void;
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

const apenasDigitos = (texto: string) => texto.replace(/\D/g, '');

const montarLinkWhatsapp = (contato: string) => {
  const numero = apenasDigitos(contato);
  if (!numero) return null;
  const numeroComDdi = numero.length <= 11 ? `55${numero}` : numero;
  return `https://wa.me/${numeroComDdi}`;
};

export default function FornecedorForm({ onClose, onCreated }: FornecedorFormProps) {
  const {
    fornecedores,
    fetchFornecedores,
    createFornecedor,
    updateFornecedor,
    deleteFornecedor,
  } = useFornecedores();
  const [formState, setFormState] = useState<FormState>(stateInicial);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState('');
  const [fornecedorParaApagar, setFornecedorParaApagar] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  const atualizarCampo = <Campo extends keyof FormState>(
    campo: Campo,
    valor: FormState[Campo]
  ) => {
    setFormState((anterior) => ({ ...anterior, [campo]: valor }));
    if (erro) setErro('');
  };

  const limparFormulario = () => {
    setFormState(stateInicial);
    setEditandoId(null);
    setErro('');
  };

  const iniciarEdicao = (fornecedor: Fornecedor) => {
    setEditandoId(fornecedor.id);
    setFormState({
      nome: fornecedor.nome,
      endereco: fornecedor.endereco ?? '',
      contato: fornecedor.contato ?? '',
      responsavel: fornecedor.responsavel ?? '',
    });
    setErro('');
  };

  const handleConfirmarExclusao = async () => {
    if (!fornecedorParaApagar) return;
    if (editandoId === fornecedorParaApagar.id) limparFormulario();
    await deleteFornecedor(fornecedorParaApagar.id);
    setFornecedorParaApagar(null);
  };

  const handleSalvar = async () => {
    const nomeFornecedor = formState.nome.trim();
    if (!nomeFornecedor) {
      setErro('Nome do fornecedor é obrigatório');
      return;
    }
    const conflito = fornecedores.some(
      (fornecedor) =>
        fornecedor.id !== editandoId &&
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
      if (editandoId) {
        await updateFornecedor(editandoId, payload);
        onCreated?.(payload.nome);
      } else {
        const novo = await createFornecedor(payload);
        if (novo) onCreated?.(novo.nome);
      }
      limparFormulario();
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

      {fornecedores.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Fornecedores já cadastrados:
          </p>
          <div className="space-y-2">
            {fornecedores.map((fornecedor) => {
              const linkWhatsapp = montarLinkWhatsapp(fornecedor.contato ?? '');
              const sendoEditado = fornecedor.id === editandoId;
              return (
                <div
                  key={fornecedor.id}
                  className={`flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between ${
                    sendoEditado
                      ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-900/30'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">
                      {fornecedor.nome}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                      {[fornecedor.responsavel, fornecedor.contato, fornecedor.endereco]
                        .filter(Boolean)
                        .join(' · ') || 'Sem informações adicionais'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {linkWhatsapp && (
                      <a
                        href={linkWhatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Chamar ${fornecedor.nome} no WhatsApp`}
                        title={`Chamar ${fornecedor.nome} no WhatsApp`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white shadow-sm transition-colors hover:bg-green-600"
                      >
                        <MessageCircle size={15} strokeWidth={2.25} />
                      </a>
                    )}
                    <button
                      type="button"
                      aria-label={`Editar fornecedor ${fornecedor.nome}`}
                      title={`Editar fornecedor ${fornecedor.nome}`}
                      onClick={() => iniciarEdicao(fornecedor)}
                      className="bg-brand-500 hover:bg-brand-600 inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                    >
                      <Pencil size={15} strokeWidth={2.25} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Excluir fornecedor ${fornecedor.nome}`}
                      title={`Excluir fornecedor ${fornecedor.nome}`}
                      onClick={() =>
                        setFornecedorParaApagar({ id: fornecedor.id, nome: fornecedor.nome })
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                    >
                      <Trash2 size={15} strokeWidth={2.25} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        {editandoId && (
          <Button size="sm" variant="outline" onClick={limparFormulario} disabled={submitting}>
            Cancelar edição
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onClose} disabled={submitting}>
          Fechar
        </Button>
        <Button size="sm" variant="primary" onClick={handleSalvar} isLoading={submitting}>
          {editandoId ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>

      <Modal
        isOpen={fornecedorParaApagar !== null}
        onClose={() => setFornecedorParaApagar(null)}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Excluir fornecedor
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja excluir o fornecedor{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {fornecedorParaApagar?.nome}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setFornecedorParaApagar(null)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarExclusao}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
