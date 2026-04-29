'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/modal';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import { useCanaisVendaModel } from '@/app/vendas/model/canaisVendaModel';

interface CanalVendaFormProps {
  onClose: () => void;
  onCreated?: (id: number) => void;
}

export default function CanalVendaForm({ onClose, onCreated }: CanalVendaFormProps) {
  const { lista, criar, excluir } = useCanaisVendaModel();
  const canaisVenda = lista.data ?? [];
  const criando = criar.isPending;
  const [nome, setNome] = useState('');
  const [canalParaApagar, setCanalParaApagar] = useState<{
    idCanalVenda: number;
    nomeCanalVenda: string;
  } | null>(null);

  const handleConfirmarExclusao = async () => {
    if (!canalParaApagar) return;
    await excluir.mutateAsync(canalParaApagar.idCanalVenda);
    setCanalParaApagar(null);
  };

  const handleSalvar = async () => {
    const nomeCanalVenda = nome.trim();
    if (!nomeCanalVenda) {
      alert('Nome do canal é obrigatório');
      return;
    }
    const novo = await criar.mutateAsync({ nomeCanalVenda });
    const novoId = (novo as { canalVendaId?: number; idCanalVenda?: number }).canalVendaId
      ?? (novo as { canalVendaId?: number; idCanalVenda?: number }).idCanalVenda;
    if (novoId !== undefined) onCreated?.(novoId);
    setNome('');
    onClose();
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

      {canaisVenda.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Canais já cadastrados:
          </p>
          <div className="flex flex-wrap gap-2">
            {canaisVenda.map((canal) => (
              <div
                key={canal.idCanalVenda}
                className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
              >
                <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                  {canal.nomeCanalVenda}
                </span>
                <button
                  type="button"
                  aria-label={`Excluir canal ${canal.nomeCanalVenda}`}
                  title={`Excluir canal ${canal.nomeCanalVenda}`}
                  onClick={() => {
                    if (canal.idCanalVenda === undefined) return;
                    setCanalParaApagar({
                      idCanalVenda: canal.idCanalVenda,
                      nomeCanalVenda: canal.nomeCanalVenda ?? '',
                    });
                  }}
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
        <Button size="sm" variant="outline" onClick={onClose} disabled={criando}>
          Cancelar
        </Button>
        <Button size="sm" variant="primary" onClick={handleSalvar} isLoading={criando}>
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
              {canalParaApagar?.nomeCanalVenda}

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
