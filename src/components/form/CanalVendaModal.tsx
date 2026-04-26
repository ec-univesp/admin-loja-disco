'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import { useCanaisVenda } from '@/hooks/useStore';

interface CanalVendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

export default function CanalVendaModal({ isOpen, onClose, onCreated }: CanalVendaModalProps) {
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
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[520px]">
      <div className="p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Cadastrar Canal de Venda
        </h4>

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
                  <span
                    key={canal.id}
                    className="group inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                  >
                    {canal.nome} {canal.taxaPadrao ? `· ${canal.taxaPadrao}%` : ''}
                    <button
                      type="button"
                      onClick={() => setCanalParaApagar({ id: canal.id, nome: canal.nome })}
                      className="ml-1 text-brand-500 hover:text-error-500"
                      title="Remover"
                    >
                      ×
                    </button>
                  </span>
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
        </div>
      </div>

      <Modal
        isOpen={canalParaApagar !== null}
        onClose={() => setCanalParaApagar(null)}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar canal de venda
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar o canal{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {canalParaApagar?.nome}
            </span>
            ? Esta ação não pode ser desfeita.
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
    </Modal>
  );
}
