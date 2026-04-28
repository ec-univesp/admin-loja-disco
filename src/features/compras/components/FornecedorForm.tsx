'use client';

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/modal';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import { useFornecedores } from '@/shared/store/useStore';

interface FornecedorFormProps {
  onClose: () => void;
  onCreated?: (nome: string) => void;
}

export default function FornecedorForm({ onClose, onCreated }: FornecedorFormProps) {
  const { fornecedores, fetchFornecedores, createFornecedor, deleteFornecedor } =
    useFornecedores();
  const [nome, setNome] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState('');
  const [fornecedorParaApagar, setFornecedorParaApagar] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  const handleConfirmarExclusao = async () => {
    if (!fornecedorParaApagar) return;
    await deleteFornecedor(fornecedorParaApagar.id);
    setFornecedorParaApagar(null);
  };

  const handleSalvar = async () => {
    const nomeFornecedor = nome.trim();
    if (!nomeFornecedor) {
      setErro('Nome do fornecedor é obrigatório');
      return;
    }
    const jaExiste = fornecedores.some(
      (fornecedor) => fornecedor.nome.toLowerCase() === nomeFornecedor.toLowerCase()
    );
    if (jaExiste) {
      setErro('Já existe um fornecedor com esse nome');
      return;
    }
    setErro('');
    setSubmitting(true);
    try {
      const novo = await createFornecedor({ nome: nomeFornecedor });
      if (novo) onCreated?.(novo.nome);
      setNome('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fornecedor-nome">Nome do Fornecedor *</Label>
        <input
          id="fornecedor-nome"
          type="text"
          value={nome}
          onChange={(event) => {
            setNome(event.target.value);
            if (erro) setErro('');
          }}
          placeholder="Ex: Disco Center, Sebo do João..."
          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        {erro && <span className="mt-1 block text-sm text-red-500">{erro}</span>}
      </div>

      {fornecedores.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Fornecedores já cadastrados:
          </p>
          <div className="flex flex-wrap gap-2">
            {fornecedores.map((fornecedor) => (
              <div
                key={fornecedor.id}
                className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
              >
                <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                  {fornecedor.nome}
                </span>
                <button
                  type="button"
                  aria-label={`Excluir fornecedor ${fornecedor.nome}`}
                  title={`Excluir fornecedor ${fornecedor.nome}`}
                  onClick={() =>
                    setFornecedorParaApagar({ id: fornecedor.id, nome: fornecedor.nome })
                  }
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                >
                  <Trash2 size={14} strokeWidth={2.25} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button size="sm" variant="outline" onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button size="sm" variant="primary" onClick={handleSalvar} isLoading={submitting}>
          Salvar
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
