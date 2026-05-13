'use client';

import React, { FC, useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/shared/components/form/Form';
import Label from '@/shared/components/form/Label';
import ControlledInput from '@/shared/components/form/ControlledInput';
import Button from '@/shared/components/ui/button/Button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import { usePurchasesModel } from '@/app/purchases/model/purchasesModel';
import AddRecordForm from '@/app/inventory/components/AddRecordForm';
import type { PurchaseDTO } from '@/shared/services/api';
import {
  purchaseFormSchema,
  type PurchaseFormInput,
} from '@/shared/services/api/form-schemas';

interface PurchaseFormProps {
  onSuccess?: () => void;
  purchase?: PurchaseDTO | null;
}

const selectClass =
  'h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white';
const errorClass = 'mt-1 block text-sm text-red-500';

const buildDefaultValues = (purchase?: PurchaseDTO | null): PurchaseFormInput => {
  if (!purchase) {
    return {
      fornecedor: '',
      dataCompra: new Date().toISOString().slice(0, 10),
      itens: [{ discoId: '', custoDisco: 0 }],
    };
  }
  const items = purchase.itens?.length
    ? purchase.itens.map((item) => ({
        id: item.id,
        discoId: item.discoId !== undefined ? String(item.discoId) : '',
        custoDisco: item.custoDisco ?? 0,
      }))
    : [{ discoId: '', custoDisco: 0 }];
  return {
    fornecedor: purchase.fornecedor ?? '',
    dataCompra: (purchase.dataCompra ?? new Date().toISOString()).slice(0, 10),
    itens: items,
  };
};

const PurchaseForm: FC<PurchaseFormProps> = ({ onSuccess, purchase }) => {
  const { create, update } = usePurchasesModel();
  const { list: recordsList } = useRecordsModel();
  const isEditing = Boolean(purchase?.compraId);
  const isMutating = create.isPending || update.isPending;
  const records = recordsList.data ?? [];
  const [successMsg, setSuccessMsg] = useState('');
  const addRecordModal = useModal();
  const [addingAtIndex, setAddingAtIndex] = useState<number | null>(null);
  const [recordIdsBefore, setRecordIdsBefore] = useState<Set<number>>(new Set());

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseFormInput>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: buildDefaultValues(purchase),
  });

  useEffect(() => {
    reset(buildDefaultValues(purchase));
  }, [purchase, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itens',
    keyName: '_rhfKey',
  });
  const watchedItems = useWatch({ control, name: 'itens' });

  const itemsTotal = (watchedItems ?? []).reduce(
    (acc, item) => acc + Number(item?.custoDisco ?? 0),
    0
  );

  const openAddRecordModal = (index: number) => {
    setAddingAtIndex(index);
    setRecordIdsBefore(new Set(records.map((record) => record.discoId ?? 0)));
    addRecordModal.openModal();
  };

  const handleRecordAdded = () => {
    const newRecord = records.find((record) => !recordIdsBefore.has(record.discoId ?? 0));
    if (addingAtIndex !== null && newRecord?.discoId) {
      setValue(`itens.${addingAtIndex}.discoId`, String(newRecord.discoId));
      setValue(`itens.${addingAtIndex}.custoDisco`, newRecord.custoDisco ?? 0);
    }
    setAddingAtIndex(null);
    setRecordIdsBefore(new Set());
    addRecordModal.closeModal();
  };

  const onSubmit = async (formInput: PurchaseFormInput) => {
    const payload = {
      ...(isEditing && purchase?.compraId !== undefined ? { compraId: purchase.compraId } : {}),
      dataCompra: formInput.dataCompra,
      fornecedor: formInput.fornecedor,
      valorTotal: itemsTotal,
      itens: formInput.itens.map((item) => {
        const sourceRecord = records.find(
          (record) => String(record.discoId) === item.discoId
        );
        return {
          ...(item.id !== undefined ? { id: item.id } : {}),
          discoId: Number(item.discoId),
          nomeDisco: sourceRecord?.album ?? '',
          nomeArtista: sourceRecord?.artista?.nomeArtista ?? '',
          custoDisco: item.custoDisco,
        };
      }),
    };

    if (isEditing) {
      await update.mutateAsync(payload);
    } else {
      await create.mutateAsync(payload);
    }

    reset(buildDefaultValues(isEditing ? purchase : undefined));
    setSuccessMsg(isEditing ? 'Compra atualizada com sucesso!' : 'Compra registrada com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
    onSuccess?.();
  };

  return (
    <>
      {successMsg && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-900 dark:text-green-200">✓ {successMsg}</p>
        </div>
      )}

      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Detalhes da Compra
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <ControlledInput
                type="text"
                id="fornecedor"
                placeholder="Nome do fornecedor"
                {...register('fornecedor')}
                error={Boolean(errors.fornecedor)}
              />
              {errors.fornecedor && (
                <span className={errorClass}>{errors.fornecedor.message}</span>
              )}
            </div>
            <div>
              <Label htmlFor="dataCompra">Data da Compra *</Label>
              <ControlledInput
                type="date"
                id="dataCompra"
                {...register('dataCompra')}
                error={Boolean(errors.dataCompra)}
              />
              {errors.dataCompra && (
                <span className={errorClass}>{errors.dataCompra.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discos</h3>
            <Button
              size="sm"
              variant="primary"
              type="button"
              onClick={() => append({ discoId: '', custoDisco: 0 })}
            >
              + Adicionar Disco
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((fieldItem, index) => {
              const currentDiscoId = watchedItems?.[index]?.discoId ?? '';
              const selectedRecord = records.find(
                (record) => String(record.discoId) === currentDiscoId
              );
              return (
                <div
                  key={fieldItem._rhfKey}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Disco {index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openAddRecordModal(index)}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        + Cadastrar novo disco
                      </button>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`disco-${index}`}>Selecione um Disco *</Label>
                    <select
                      id={`disco-${index}`}
                      {...register(`itens.${index}.discoId`, {
                        onChange: (changeEvent) => {
                          const targetRecord = records.find(
                            (record) => String(record.discoId) === changeEvent.target.value
                          );
                          setValue(
                            `itens.${index}.custoDisco`,
                            targetRecord?.custoDisco ?? 0
                          );
                        },
                      })}
                      className={selectClass}
                    >
                      <option value="">-- Selecione --</option>
                      {records.map((record) => (
                        <option key={record.discoId} value={record.discoId ?? ''}>
                          {record.artista?.nomeArtista} - {record.album}
                        </option>
                      ))}
                    </select>
                    {errors.itens?.[index]?.discoId && (
                      <span className={errorClass}>{errors.itens[index]?.discoId?.message}</span>
                    )}
                  </div>

                  {selectedRecord && (
                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-900/20">
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Artista</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {selectedRecord.artista?.nomeArtista}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Álbum</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {selectedRecord.album}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {errors.itens?.root && (
              <span className={errorClass}>{errors.itens.root.message}</span>
            )}
          </div>
        </div>

        <div className="border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-900/20 rounded-lg border p-4">
          <p className="text-brand-700 dark:text-brand-200 text-sm">
            Total da Compra:{' '}
            <span className="ml-2 text-lg font-bold">
              R$ {itemsTotal.toFixed(2).replace('.', ',')}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isMutating || isSubmitting}
          >
            {isEditing ? 'Salvar Alterações' : 'Registrar Compra'}
          </Button>
          <Button
            type="reset"
            variant="outline"
            fullWidth
            onClick={() => reset(buildDefaultValues(isEditing ? purchase : undefined))}
          >
            {isEditing ? 'Restaurar' : 'Limpar'}
          </Button>
        </div>
      </Form>

      <Modal
        isOpen={addRecordModal.isOpen}
        onClose={addRecordModal.closeModal}
        className="m-4 max-h-[90vh] max-w-[900px] overflow-y-auto"
      >
        <div className="p-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Cadastrar novo disco
          </h4>
          <AddRecordForm embedded onSuccess={handleRecordAdded} />
        </div>
      </Modal>
    </>
  );
};

export default PurchaseForm;
