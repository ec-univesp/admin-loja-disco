'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/modal';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import { useSalesChannelsModel } from '@/app/sales/model/salesChannelsModel';
import { getSalesChannelId } from '@/shared/services/api';
import {
  salesChannelFormSchema,
  type SalesChannelFormInput,
} from '@/shared/services/api/form-schemas';

interface SalesChannelFormProps {
  onClose: () => void;
  onCreated?: (id: number) => void;
}

interface ChannelToDelete {
  canalVendaId: number;
  nomeCanalVenda: string;
}

export default function SalesChannelForm({ onClose, onCreated }: SalesChannelFormProps) {
  const { list, create, remove } = useSalesChannelsModel();
  const salesChannels = list.data ?? [];
  const isSubmitting = create.isPending;
  const [channelToDelete, setChannelToDelete] = useState<ChannelToDelete | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalesChannelFormInput>({
    resolver: zodResolver(salesChannelFormSchema),
    defaultValues: { nomeCanalVenda: '' },
  });

  const onSubmit = async (formInput: SalesChannelFormInput) => {
    const created = await create.mutateAsync({ nomeCanalVenda: formInput.nomeCanalVenda });
    if (created.canalVendaId !== undefined) onCreated?.(created.canalVendaId);
    reset();
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!channelToDelete) return;
    await remove.mutateAsync(channelToDelete.canalVendaId);
    setChannelToDelete(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="canal-nome">Nome do Canal *</Label>
        <input
          id="canal-nome"
          type="text"
          {...register('nomeCanalVenda')}
          placeholder="Ex: Mercado Livre, Shopee, Loja Física..."
          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        {errors.nomeCanalVenda && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.nomeCanalVenda.message}
          </p>
        )}
      </div>

      {salesChannels.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Canais já cadastrados:
          </p>
          <div className="flex flex-wrap gap-2">
            {salesChannels.map((channel) => {
              const channelId = getSalesChannelId(channel);
              return (
                <div
                  key={channelId}
                  className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
                >
                  <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                    {channel.nomeCanalVenda}
                  </span>
                  <button
                    type="button"
                    aria-label={`Excluir canal ${channel.nomeCanalVenda}`}
                    title={`Excluir canal ${channel.nomeCanalVenda}`}
                    onClick={() => {
                      if (channelId === undefined) return;
                      setChannelToDelete({
                        canalVendaId: channelId,
                        nomeCanalVenda: channel.nomeCanalVenda ?? '',
                      });
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                  >
                    <Trash2 size={14} strokeWidth={2.25} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button size="sm" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button size="sm" variant="primary" isLoading={isSubmitting}>
          Salvar
        </Button>
      </div>

      <Modal
        isOpen={channelToDelete !== null}
        onClose={() => setChannelToDelete(null)}
        className="m-4 max-w-110"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Excluir canal de venda
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja excluir esse canal{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {channelToDelete?.nomeCanalVenda}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setChannelToDelete(null)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>
    </form>
  );
}
