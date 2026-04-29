'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { useGenresModel } from '@/app/inventory/model/genresModel';
import { useArtistsModel } from '@/app/inventory/model/artistsModel';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import CurrencyInput from '@/shared/components/form/CurrencyInput';
import { formatBRL } from '@/shared/utils/currency';

interface AddRecordFormData {
  artistaNome: string;
  generoMusicalId: string;
  album: string;
  nacionalidade: string;
  prensagem: string;
  encarte: string;
  gravadora: string;
  anoLancamento: number;
  anoPrensagem: number;
  condicaoCapa: string;
  condicaoDisco: string;
  valorMercado: number;
  custoDisco: number;
  status: string;
}

interface AddDiscoFormProps {
  onSuccess?: () => void;
  embedded?: boolean;
}

export default function AddDiscoForm({ onSuccess, embedded = false }: AddDiscoFormProps = {}) {
  const router = useRouter();
  const { create: createRecord } = useRecordsModel();
  const { list: artistsList, create: createArtist } = useArtistsModel();
  const { list: genresList } = useGenresModel();
  const isSubmitting = createRecord.isPending;
  const artists = artistsList.data ?? [];
  const genres = genresList.data ?? [];
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<AddRecordFormData>({
    defaultValues: {
      artistaNome: '',
      generoMusicalId: '',
      album: '',
      nacionalidade: 'Brasil',
      prensagem: '',
      encarte: 'Ok',
      gravadora: '',
      anoLancamento: new Date().getFullYear(),
      anoPrensagem: new Date().getFullYear(),
      condicaoCapa: '',
      condicaoDisco: '',
      valorMercado: 0,
      custoDisco: 0,
      status: 'Disponível',
    },
  });

  const valorMercado = watch('valorMercado');
  const custoDisco = watch('custoDisco');
  const margin = valorMercado - custoDisco;
  const marginPct = custoDisco > 0 ? ((margin / custoDisco) * 100).toFixed(1) : '0';

  const onSubmit = async (data: AddRecordFormData) => {
    try {
      const nomeArtista = data.artistaNome.trim();
      const existingArtist = artists.find(
        (artist) => artist.nomeArtista?.toLowerCase() === nomeArtista.toLowerCase()
      );

      let artistaId: number;
      if (existingArtist?.artistaId !== undefined) {
        artistaId = existingArtist.artistaId;
      } else {
        const newArtist = await createArtist.mutateAsync({ nomeArtista });
        if (newArtist.artistaId === undefined) throw new Error('Failed to create artist');
        artistaId = newArtist.artistaId;
      }

      await createRecord.mutateAsync({
        artista: { artistaId, nomeArtista },
        album: data.album,
        nacionalidade: data.nacionalidade,
        prensagem: data.prensagem,
        encarte: data.encarte,
        gravadora: data.gravadora,
        anoLancamento: Number(data.anoLancamento),
        anoPrensagem: Number(data.anoPrensagem),
        condicaoCapa: data.condicaoCapa,
        condicaoDisco: data.condicaoDisco,
        valorMercado: Number(data.valorMercado),
        custoDisco: Number(data.custoDisco),
        status: data.status,
        generosMusicais: data.generoMusicalId
          ? [{ generoMusicalId: Number(data.generoMusicalId) }]
          : [],
      });

      setSuccessMessage('Record added successfully!');
      reset();

      if (onSuccess) {
        setTimeout(() => {
          setSuccessMessage('');
          onSuccess();
        }, 800);
      } else {
        setTimeout(() => {
          setSuccessMessage('');
          router.push('/inventory');
        }, 2000);
      }
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  return (
    <div className={embedded ? '' : 'space-y-6'}>
      <div
        className={
          embedded
            ? ''
            : 'rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900/50'
        }
      >
        {!embedded && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-50">
              New Record
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Add a new record to your inventory
            </p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-success-200 bg-success-50 p-4 dark:border-success-900/50 dark:bg-success-900/20">
            <svg className="h-5 w-5 text-success-600 dark:text-success-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-success-900 dark:text-success-200">{successMessage}</span>
          </div>
        )}


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Artista e Álbum */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="artistaNome">Artist *</Label>
                <input
                  type="text"
                  id="artistaNome"
                  list="artistas-disponiveis"
                  placeholder="e.g. The Beatles"
                  autoComplete="off"
                  {...register('artistaNome', { required: 'Artist is required' })}
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    errors.artistaNome
                      ? 'border-error-500 bg-error-50 dark:border-error-600 dark:bg-error-900/20'
                      : 'border-gray-300 bg-white focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600'
                  }`}
                />
                <datalist id="artistas-disponiveis">
                  {artists.map((artist) => (
                    <option key={artist.artistaId} value={artist.nomeArtista ?? ''} />
                  ))}
                </datalist>
                {errors.artistaNome && (
                  <span className="mt-1 block text-sm text-error-600 dark:text-error-400">{errors.artistaNome.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="generoMusicalId">Music Genre</Label>
                <select
                  id="generoMusicalId"
                  {...register('generoMusicalId')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                >
                  <option value="">-- Select --</option>
                  {genres.map((genre) => (
                    <option
                      key={genre.generoMusicalId}
                      value={genre.generoMusicalId ?? ''}
                    >
                      {genre.nomeGenero}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="album">Album *</Label>
                <input
                  type="text"
                  id="album"
                  placeholder="Album name"
                  {...register('album', { required: 'Album is required' })}
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    errors.album
                      ? 'border-error-500 bg-error-50 dark:border-error-600 dark:bg-error-900/20'
                      : 'border-gray-300 bg-white focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600'
                  }`}
                />
                {errors.album && (
                  <span className="mt-1 block text-sm text-error-600 dark:text-error-400">{errors.album.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Informações Técnicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Technical Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="nacionalidade">Nationality</Label>
                <input
                  type="text"
                  id="nacionalidade"
                  placeholder="e.g. Brazil"
                  {...register('nacionalidade')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>

              <div>
                <Label htmlFor="prensagem">Pressing</Label>
                <input
                  type="text"
                  id="prensagem"
                  placeholder="Ex: Vinyl, CD..."
                  {...register('prensagem')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>

              <div>
                <Label htmlFor="encarte">Insert</Label>
                <select
                  id="encarte"
                  {...register('encarte')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                >
                  <option value="Ok">Ok</option>
                  <option value="N/A">N/A</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="gravadora">Label</Label>
                <input
                  type="text"
                  id="gravadora"
                  placeholder="e.g. Sony"
                  {...register('gravadora')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>

              <div>
                <Label htmlFor="anoLancamento">Release Year</Label>
                <input
                  type="number"
                  id="anoLancamento"
                  {...register('anoLancamento')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>
            </div>
          </div>

          {/* Condição */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Record Condition</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="condicaoCapa">Cover Condition</Label>
                <input
                  type="text"
                  id="condicaoCapa"
                  placeholder="e.g. Excellent, Good..."
                  {...register('condicaoCapa')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>

              <div>
                <Label htmlFor="condicaoDisco">Record Condition</Label>
                <input
                  type="text"
                  id="condicaoDisco"
                  placeholder="e.g. Excellent, Good..."
                  {...register('condicaoDisco')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Pricing</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="custoDisco">Record Cost *</Label>
                <Controller
                  control={control}
                  name="custoDisco"
                  rules={{
                    required: 'Cost is required',
                    min: { value: 0, message: 'Cost cannot be negative' },
                  }}
                  render={({ field }) => (
                    <CurrencyInput
                      id="custoDisco"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.custoDisco}
                    />
                  )}
                />
                {errors.custoDisco && (
                  <span className="mt-1 block text-sm text-error-600 dark:text-error-400">{errors.custoDisco.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="valorMercado">Market Value *</Label>
                <Controller
                  control={control}
                  name="valorMercado"
                  rules={{
                    required: 'Market value is required',
                    min: { value: 0, message: 'Value cannot be negative' },
                  }}
                  render={({ field }) => (
                    <CurrencyInput
                      id="valorMercado"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.valorMercado}
                    />
                  )}
                />
                {errors.valorMercado && (
                  <span className="mt-1 block text-sm text-error-600 dark:text-error-400">{errors.valorMercado.message}</span>
                )}
              </div>
            </div>

            {/* Margem de Lucro */}
            {(valorMercado > 0 || custoDisco > 0) && (
              <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Margin</p>
                    <p className={`text-lg font-bold ${margin >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                      {formatBRL(margin)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Percentage</p>
                    <p className={`text-lg font-bold ${margin >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                      {marginPct}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Sale Price</p>
                    <p className="text-lg font-bold text-brand-700 dark:text-brand-400">
                      {formatBRL(valorMercado)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} size="lg" variant="primary" fullWidth>
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </Button>
            <Button type="reset" size="lg" variant="secondary" fullWidth>
              Clear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
