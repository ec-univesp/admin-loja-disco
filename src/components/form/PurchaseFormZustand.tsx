'use client';

import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from './Form';
import Label from './Label';
import ControlledInput from './input/ControlledInput';
import CurrencyInput from './input/CurrencyInput';
import Button from '@/components/ui/button/Button';
import { useCompras, useDiscos, useItensCompra } from '@/shared/store/useStore';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import AddDiscoForm from '@/components/products/AddDiscoForm';

interface ItemCompraForm {
  discoId: string;
  custoDisco: number;
}

interface PurchaseFormData {
  fornecedor: string;
  dataCompra: string;
}

interface PurchaseFormZustandProps {
  onSuccess?: () => void;
}

const MENSAGEM_SUCESSO_DURACAO_MS = 3000;

const PurchaseFormZustand: FC<PurchaseFormZustandProps> = ({ onSuccess }) => {
  const { createCompra, loading } = useCompras();
  const { createItemCompra } = useItensCompra();
  const { discosComArtista, fetchDiscos } = useDiscos();
  const [successMsg, setSuccessMsg] = useState('');
  const [itens, setItens] = useState<ItemCompraForm[]>([{ discoId: '', custoDisco: 0 }]);
  const cadastrarDiscoModal = useModal();
  const [indiceCadastro, setIndiceCadastro] = useState<number | null>(null);
  const [discoIdsAntes, setDiscoIdsAntes] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    defaultValues: {
      fornecedor: '',
      dataCompra: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    fetchDiscos();
  }, [fetchDiscos]);

  const somaItens = itens.reduce((acc, item) => acc + Number(item.custoDisco || 0), 0);

  const adicionarItem = () => setItens((prev) => [...prev, { discoId: '', custoDisco: 0 }]);

  const removerItem = (index: number) => setItens((prev) => prev.filter((_, i) => i !== index));

  const atualizarItem = (index: number, campo: keyof ItemCompraForm, valor: string | number) =>
    setItens((prev) => prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)));

  const abrirCadastroDisco = (index: number) => {
    setIndiceCadastro(index);
    setDiscoIdsAntes(new Set(discosComArtista.map((d) => d.id)));
    cadastrarDiscoModal.openModal();
  };

  const handleDiscoCadastrado = () => {
    const novoDisco = discosComArtista.find((d) => !discoIdsAntes.has(d.id));
    if (indiceCadastro !== null && novoDisco) {
      atualizarItem(indiceCadastro, 'discoId', novoDisco.id);
    }
    setIndiceCadastro(null);
    setDiscoIdsAntes(new Set());
    cadastrarDiscoModal.closeModal();
  };

  const handleFormSubmit = async (dadosFormulario: PurchaseFormData) => {
    const itensValidos = itens.filter((item) => item.discoId);
    if (itensValidos.length === 0) return;

    const novaCompra = await createCompra({
      clienteId: '',
      dataCompra: dadosFormulario.dataCompra,
      fornecedor: dadosFormulario.fornecedor,
      valorTotal: somaItens,
    });

    if (novaCompra) {
      await Promise.all(
        itensValidos.map((item) =>
          createItemCompra({
            compraId: novaCompra.id,
            discoId: item.discoId,
            precoCompra: Number(item.custoDisco),
          })
        )
      );
    }

    reset();
    setItens([{ discoId: '', custoDisco: 0 }]);
    setSuccessMsg('Compra registrada com sucesso!');
    setTimeout(() => setSuccessMsg(''), MENSAGEM_SUCESSO_DURACAO_MS);
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
            Dados da Compra
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <ControlledInput
                type="text"
                id="fornecedor"
                placeholder="Nome do fornecedor"
                {...register('fornecedor', { required: 'Fornecedor é obrigatório' })}
                error={!!errors.fornecedor}
              />
              {errors.fornecedor && (
                <span className="mt-1 text-sm text-red-500">{errors.fornecedor.message}</span>
              )}
            </div>
            <div>
              <Label htmlFor="dataCompra">Data da Compra *</Label>
              <ControlledInput
                type="date"
                id="dataCompra"
                {...register('dataCompra', { required: 'Data é obrigatória' })}
                error={!!errors.dataCompra}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discos</h3>
            <Button size="sm" variant="primary" type="button" onClick={adicionarItem}>
              + Add Disco
            </Button>
          </div>

          <div className="space-y-4">
            {itens.map((item, index) => {
              const discoSelecionado = discosComArtista.find((d) => d.id === item.discoId);
              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Disco {index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => abrirCadastroDisco(index)}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        + Cadastrar novo disco
                      </button>
                      {itens.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removerItem(index)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor={`disco-${index}`}>Selecione um Disco *</Label>
                      <select
                        id={`disco-${index}`}
                        value={item.discoId}
                        onChange={(e) => atualizarItem(index, 'discoId', e.target.value)}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">-- Selecione --</option>
                        {discosComArtista.map((disco) => (
                          <option key={disco.id} value={disco.id}>
                            {disco.artistaNome} - {disco.album}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor={`custo-${index}`}>Custo do Disco (R$) *</Label>
                      <CurrencyInput
                        id={`custo-${index}`}
                        value={item.custoDisco}
                        onChange={(val) => atualizarItem(index, 'custoDisco', val)}
                      />
                    </div>
                  </div>

                  {discoSelecionado && (
                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-900/20">
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Artista</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {discoSelecionado.artistaNome}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600 dark:text-blue-300">Álbum</p>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          {discoSelecionado.album}
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
            Valor Total da Compra:{' '}
            <span className="ml-2 text-lg font-bold">
              R$ {somaItens.toFixed(2).replace('.', ',')}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" fullWidth isLoading={loading}>
            Registrar Compra
          </Button>
          <Button
            type="reset"
            variant="outline"
            fullWidth
            onClick={() => {
              reset();
              setItens([{ discoId: '', custoDisco: 0 }]);
            }}
          >
            Limpar
          </Button>
        </div>
      </Form>

      <Modal
        isOpen={cadastrarDiscoModal.isOpen}
        onClose={cadastrarDiscoModal.closeModal}
        className="m-4 max-h-[90vh] max-w-[900px] overflow-y-auto"
      >
        <div className="p-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Cadastrar novo disco
          </h4>
          <AddDiscoForm embedded onSuccess={handleDiscoCadastrado} />
        </div>
      </Modal>
    </>
  );
};

export default PurchaseFormZustand;
