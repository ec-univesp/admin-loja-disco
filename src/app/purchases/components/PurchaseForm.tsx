'use client';

import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from '@/shared/components/form/Form';
import Label from '@/shared/components/form/Label';
import ControlledInput from '@/shared/components/form/ControlledInput';
import CurrencyInput from '@/shared/components/form/CurrencyInput';
import Button from '@/shared/components/ui/button/Button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import { usePurchasesModel } from '@/app/purchases/model/purchasesModel';
import AddDiscoForm from '@/app/inventory/components/AddRecordForm';

interface PurchaseItemForm {
  discoId: string;
  custoDisco: number;
}

interface PurchaseFormData {
  fornecedor: string;
  dataCompra: string;
}

interface PurchaseFormProps {
  onSuccess?: () => void;
}

const PurchaseForm: FC<PurchaseFormProps> = ({ onSuccess }) => {
  const { create } = usePurchasesModel();
  const { list: recordsList } = useRecordsModel();
  const createPurchase = create.mutateAsync.bind(create);
  const isSubmitting = create.isPending;
  const records = recordsList.data ?? [];
  const [successMsg, setSuccessMsg] = useState('');
  const [items, setItems] = useState<PurchaseItemForm[]>([{ discoId: '', custoDisco: 0 }]);
  const addRecordModal = useModal();
  const [addingAtIndex, setAddingAtIndex] = useState<number | null>(null);
  const [recordIdsBefore, setRecordIdsBefore] = useState<Set<number>>(new Set());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    defaultValues: {
      fornecedor: '',
      dataCompra: new Date().toISOString().split('T')[0],
    },
  });

  const itemsTotal = items.reduce((acc, item) => acc + Number(item.custoDisco || 0), 0);

  const addItem = () => setItems((prev) => [...prev, { discoId: '', custoDisco: 0 }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof PurchaseItemForm, value: string | number) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const openAddRecordModal = (index: number) => {
    setAddingAtIndex(index);
    setRecordIdsBefore(new Set(records.map((r) => r.discoId ?? 0)));
    addRecordModal.openModal();
  };

  const handleRecordAdded = () => {
    const newRecord = records.find((r) => !recordIdsBefore.has(r.discoId ?? 0));
    if (addingAtIndex !== null && newRecord?.discoId) {
      updateItem(addingAtIndex, 'discoId', String(newRecord.discoId));
    }
    setAddingAtIndex(null);
    setRecordIdsBefore(new Set());
    addRecordModal.closeModal();
  };

  const handleFormSubmit = async (formData: PurchaseFormData) => {
    const validItems = items.filter((item) => item.discoId);
    if (validItems.length === 0) return;

    await createPurchase({
      dataCompra: formData.dataCompra,
      fornecedor: formData.fornecedor,
      valorTotal: itemsTotal,
      itens: validItems.map((item) => {
        const record = records.find((r) => String(r.discoId) === item.discoId);
        return {
          discoId: Number(item.discoId),
          nomeDisco: record?.album ?? '',
          nomeArtista: record?.artista?.nomeArtista ?? '',
          custoDisco: Number(item.custoDisco),
        };
      }),
    });

    reset();
    setItems([{ discoId: '', custoDisco: 0 }]);
    setSuccessMsg('Purchase recorded successfully!');
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

      <Form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Purchase Details
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fornecedor">Supplier *</Label>
              <ControlledInput
                type="text"
                id="fornecedor"
                placeholder="Supplier name"
                {...register('fornecedor', { required: 'Supplier is required' })}
                error={!!errors.fornecedor}
              />
              {errors.fornecedor && (
                <span className="mt-1 text-sm text-red-500">{errors.fornecedor.message}</span>
              )}
            </div>
            <div>
              <Label htmlFor="dataCompra">Purchase Date *</Label>
              <ControlledInput
                type="date"
                id="dataCompra"
                {...register('dataCompra', { required: 'Date is required' })}
                error={!!errors.dataCompra}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Records</h3>
            <Button size="sm" variant="primary" type="button" onClick={addItem}>
              + Add Record
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => {
              const selectedRecord = records.find((r) => String(r.discoId) === item.discoId);
              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Record {index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openAddRecordModal(index)}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        + Register new record
                      </button>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor={`disco-${index}`}>Select a Record *</Label>
                      <select
                        id={`disco-${index}`}
                        value={item.discoId}
                        onChange={(e) => updateItem(index, 'discoId', e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">-- Select --</option>
                        {records.map((record) => (
                          <option key={record.discoId} value={record.discoId ?? ''}>
                            {record.artista?.nomeArtista} - {record.album}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor={`custo-${index}`}>Record Cost (R$) *</Label>
                      <CurrencyInput
                        id={`custo-${index}`}
                        value={item.custoDisco}
                        onChange={(val) => updateItem(index, 'custoDisco', val)}
                      />
                    </div>
                  </div>

                  {selectedRecord && (
                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-900/20">
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Artist</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {selectedRecord.artista?.nomeArtista}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Album</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {selectedRecord.album}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-900/20 rounded-lg border p-4">
          <p className="text-brand-700 dark:text-brand-200 text-sm">
            Total Purchase Value:{' '}
            <span className="ml-2 text-lg font-bold">
              R$ {itemsTotal.toFixed(2).replace('.', ',')}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Register Purchase
          </Button>
          <Button
            type="reset"
            variant="outline"
            fullWidth
            onClick={() => {
              reset();
              setItems([{ discoId: '', custoDisco: 0 }]);
            }}
          >
            Clear
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
            Register new record
          </h4>
          <AddDiscoForm embedded onSuccess={handleRecordAdded} />
        </div>
      </Modal>
    </>
  );
};

export default PurchaseForm;
