'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/modal';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import { useCanaisVenda } from '@/shared/store/useStore';

interface CanalVendaFormProps {
  onClose: () => void;
  onCreated?: (id: string) => void;
}

export default function CanalVendaForm({ onClose, onCreated }: CanalVendaFormProps) {
  const { canaisVenda, createCanalVenda, deleteCanalVenda } = useCanaisVenda();
  const [nome, setNome] = useState('');
  const [taxa, setTaxa] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [canalParaApagar, setCanalParaApagar] = useState<{ id: string; nome: string } | null>(
    null
  );

  const handleConfirmarExclusao = async () => {
    if (!canalParaApagar) return;
    await deleteCanalVenda(canalParaApagar.id);
    setCanalParaApagar(null);
  };

  const handleSalvar = async () => {
    if (!nome.trim()) {
      alert('Nome do canal é obrigatório');
      return;
    }
    setSubmitting(true);
    try {
      const novo = await createCanalVenda({ nome: nome.trim(), taxaPadrao: Number(taxa) || 0 });
      if (novo) onCreated?.(novo.id);
      setNome('');
      setTaxa(0);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="canal-nome">Nome do Canal *</Label>
        <input
          id="canal-nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Mercado Livre, Shopee, Loja Física..."
          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div>
        <Label htmlFor="canal-taxa">Taxa Padrão (%)</Label>
        <input
          id="canal-taxa"
          type="number"
          step="0.1"
          value={taxa || ''}
          onChange={(e) => setTaxa(Number(e.target.value))}
          placeholder="0"
          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500">
          Será usada para sugerir custos adicionais ao registrar uma venda nesse canal
        </p>
      </div>

      {canaisVenda.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Canais já cadastrados:
          </p>
          <div className="flex flex-wrap gap-2">
            {canaisVenda.map((canal) => (
              <div
                key={canal.id}
                className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
              >
                <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                  {canal.nome}
                  {canal.taxaPadrao ? ` · ${canal.taxaPadrao}%` : ''}
                </span>
                <button
                  type="button"
                  aria-label={`Excluir canal ${canal.nome}`}
                  title={`Excluir canal ${canal.nome}`}
                  onClick={() => setCanalParaApagar({ id: canal.id, nome: canal.nome })}
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
        isOpen={canalParaApagar !== null}
        onClose={() => setCanalParaApagar(null)}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Excluir canal de venda
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja excluir esse canal{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {canalParaApagar?.nome}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCanalParaApagar(null)}
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
