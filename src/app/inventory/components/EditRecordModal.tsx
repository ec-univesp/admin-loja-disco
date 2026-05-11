'use client';

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/ui/modal';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import CurrencyInput from '@/shared/components/form/CurrencyInput';
import MultiSelect from '@/shared/components/form/MultiSelect';
import { RecordStatus } from '@/shared/types';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import { useGenresModel } from '@/app/inventory/model/genresModel';
import { useArtistsModel } from '@/app/inventory/model/artistsModel';
import {
  editRecordFormSchema,
  type EditRecordFormInput,
} from '@/shared/services/api/form-schemas';

interface EditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: number | null;
}

const currentYear = new Date().getFullYear();

const emptyFormValues: EditRecordFormInput = {
  artistaNome: '',
  generosMusicaisIds: [],
  album: '',
  nacionalidade: '',
  prensagem: '',
  encarte: 'Ok',
  gravadora: '',
  anoLancamento: currentYear,
  anoPrensagem: currentYear,
  condicaoCapa: '',
  condicaoDisco: '',
  valorMercado: 0,
  custoDisco: 0,
  status: RecordStatus.DISPONIVEL,
};

const inputClass =
  'h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white';

const errorClass = 'mt-1 text-xs text-red-600 dark:text-red-400';

export default function EditRecordModal({ isOpen, onClose, recordId }: EditRecordModalProps) {
  const activeId = isOpen && recordId !== null ? recordId : undefined;
  const { byId, update: updateRecord } = useRecordsModel(activeId);
  const { list: genresList } = useGenresModel();
  const { list: artistsList, update: updateArtist } = useArtistsModel();
  const record = byId.data;
  const genres = genresList.data ?? [];
  const artists = artistsList.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditRecordFormInput>({
    resolver: zodResolver(editRecordFormSchema),
    defaultValues: emptyFormValues,
  });

  useEffect(() => {
    if (!isOpen || !record) return;
    reset({
      artistaNome: record.artista?.nomeArtista ?? '',
      generosMusicaisIds:
        record.generosMusicais
          ?.map((genre) => genre.generoMusicalId)
          .filter((id): id is number => id !== undefined) ?? [],
      album: record.album ?? '',
      nacionalidade: record.nacionalidade ?? '',
      prensagem: record.prensagem ?? '',
      encarte: record.encarte ?? 'Ok',
      gravadora: record.gravadora ?? '',
      anoLancamento: record.anoLancamento ?? currentYear,
      anoPrensagem: record.anoPrensagem ?? currentYear,
      condicaoCapa: record.condicaoCapa ?? '',
      condicaoDisco: record.condicaoDisco ?? '',
      valorMercado: record.valorMercado ?? 0,
      custoDisco: record.custoDisco ?? 0,
      status: record.status === RecordStatus.VENDIDO ? RecordStatus.VENDIDO : RecordStatus.DISPONIVEL,
    });
  }, [isOpen, record, reset]);

  const onSubmit = async (formInput: EditRecordFormInput) => {
    if (!recordId) return;
    const artistaId = record?.artista?.artistaId;
    if (artistaId !== undefined && record?.artista?.nomeArtista !== formInput.artistaNome) {
      await updateArtist.mutateAsync({ artistaId, nomeArtista: formInput.artistaNome });
    }
    await updateRecord.mutateAsync({
      discoId: recordId,
      artista: { artistaId, nomeArtista: formInput.artistaNome },
      album: formInput.album,
      nacionalidade: formInput.nacionalidade,
      prensagem: formInput.prensagem,
      encarte: formInput.encarte,
      gravadora: formInput.gravadora,
      anoLancamento: formInput.anoLancamento,
      anoPrensagem: formInput.anoPrensagem,
      condicaoCapa: formInput.condicaoCapa,
      condicaoDisco: formInput.condicaoDisco,
      valorMercado: formInput.valorMercado,
      custoDisco: formInput.custoDisco,
      status: formInput.status,
      generosMusicais: formInput.generosMusicaisIds.map((generoMusicalId) => ({ generoMusicalId })),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[720px]">
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[80vh] overflow-y-auto p-6">
        <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Editar Disco
        </h4>

        <div className="space-y-5">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Informações Básicas
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-artista">Artista *</Label>
                <input
                  id="edit-artista"
                  type="text"
                  list="artistas-edit-disponiveis"
                  {...register('artistaNome')}
                  className={inputClass}
                />
                <datalist id="artistas-edit-disponiveis">
                  {artists.map((artist) => (
                    <option key={artist.artistaId} value={artist.nomeArtista ?? ''} />
                  ))}
                </datalist>
                {errors.artistaNome && (
                  <p className={errorClass}>{errors.artistaNome.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-album">Álbum *</Label>
                <input id="edit-album" type="text" {...register('album')} className={inputClass} />
                {errors.album && <p className={errorClass}>{errors.album.message}</p>}
              </div>
            </div>

            <div className="mt-3">
              <Label htmlFor="edit-generos">Gêneros Musicais *</Label>
              <Controller
                name="generosMusicaisIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    id="edit-generos"
                    value={field.value}
                    onChange={field.onChange}
                    options={genres.flatMap((genre) =>
                      genre.generoMusicalId === undefined
                        ? []
                        : [{ value: genre.generoMusicalId, label: genre.nomeGenero ?? '' }]
                    )}
                    placeholder="Selecione um ou mais gêneros"
                    searchPlaceholder="Buscar gênero..."
                    emptyMessage="Nenhum gênero cadastrado."
                  />
                )}
              />
              {errors.generosMusicaisIds && (
                <p className={errorClass}>{errors.generosMusicaisIds.message}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Informações Técnicas
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <Label htmlFor="edit-nacionalidade">Nacionalidade *</Label>
                <input
                  id="edit-nacionalidade"
                  type="text"
                  {...register('nacionalidade')}
                  className={inputClass}
                />
                {errors.nacionalidade && (
                  <p className={errorClass}>{errors.nacionalidade.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-prensagem">Prensagem *</Label>
                <input
                  id="edit-prensagem"
                  type="text"
                  {...register('prensagem')}
                  className={inputClass}
                />
                {errors.prensagem && <p className={errorClass}>{errors.prensagem.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-encarte">Encarte *</Label>
                <select id="edit-encarte" {...register('encarte')} className={inputClass}>
                  <option value="Ok">Ok</option>
                  <option value="N/A">N/A</option>
                  <option value="Outro">Outro</option>
                </select>
                {errors.encarte && <p className={errorClass}>{errors.encarte.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-gravadora">Gravadora *</Label>
                <input
                  id="edit-gravadora"
                  type="text"
                  {...register('gravadora')}
                  className={inputClass}
                />
                {errors.gravadora && <p className={errorClass}>{errors.gravadora.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-anoLancamento">Ano de Lançamento *</Label>
                <input
                  id="edit-anoLancamento"
                  type="number"
                  {...register('anoLancamento', { valueAsNumber: true })}
                  className={inputClass}
                />
                {errors.anoLancamento && (
                  <p className={errorClass}>{errors.anoLancamento.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-anoPrensagem">Ano de Prensagem *</Label>
                <input
                  id="edit-anoPrensagem"
                  type="number"
                  {...register('anoPrensagem', { valueAsNumber: true })}
                  className={inputClass}
                />
                {errors.anoPrensagem && (
                  <p className={errorClass}>{errors.anoPrensagem.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Condição
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-condicaoCapa">Cond. Capa *</Label>
                <input
                  id="edit-condicaoCapa"
                  type="text"
                  {...register('condicaoCapa')}
                  className={inputClass}
                />
                {errors.condicaoCapa && (
                  <p className={errorClass}>{errors.condicaoCapa.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-condicaoDisco">Cond. Disco *</Label>
                <input
                  id="edit-condicaoDisco"
                  type="text"
                  {...register('condicaoDisco')}
                  className={inputClass}
                />
                {errors.condicaoDisco && (
                  <p className={errorClass}>{errors.condicaoDisco.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Preços
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-custoDisco">Custo *</Label>
                <Controller
                  name="custoDisco"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="edit-custoDisco"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.custoDisco && <p className={errorClass}>{errors.custoDisco.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-valorMercado">Valor de Mercado *</Label>
                <Controller
                  name="valorMercado"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="edit-valorMercado"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.valorMercado && (
                  <p className={errorClass}>{errors.valorMercado.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div>
              <Label htmlFor="edit-status">Status *</Label>
              <select id="edit-status" {...register('status')} className={inputClass}>
                <option value={RecordStatus.DISPONIVEL}>Disponível</option>
                <option value={RecordStatus.VENDIDO}>Vendido</option>
              </select>
              {errors.status && <p className={errorClass}>{errors.status.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button size="sm" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button size="sm" variant="primary" isLoading={isSubmitting}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
