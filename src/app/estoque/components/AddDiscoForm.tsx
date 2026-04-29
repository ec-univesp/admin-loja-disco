'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { useGenerosMusicaisModel } from '@/app/estoque/model/generoMusicalModel';
import { useArtistasModel } from '@/app/estoque/model/artistaModel';
import { useDiscosModel } from '@/app/estoque/model/discosModel';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import CurrencyInput from '@/shared/components/form/CurrencyInput';
import { formatBRL } from '@/shared/utils/currency';

interface AddDiscoFormData {
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
  const { criar: criarDisco } = useDiscosModel();
  const { lista: listaArtistas, criar: criarArtista } = useArtistasModel();
  const { lista: listaGeneros } = useGenerosMusicaisModel();
  const criando = criarDisco.isPending;
  const artistas = listaArtistas.data ?? [];
  const generosMusicais = listaGeneros.data ?? [];
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<AddDiscoFormData>({
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
  const margem = valorMercado - custoDisco;
  const margemPct = custoDisco > 0 ? ((margem / custoDisco) * 100).toFixed(1) : '0';

  const onSubmit = async (data: AddDiscoFormData) => {
    try {
      const nomeArtista = data.artistaNome.trim();
      const artistaExistente = artistas.find(
        (artista) => artista.nomeArtista?.toLowerCase() === nomeArtista.toLowerCase()
      );

      let artistaId: number;
      if (artistaExistente?.artistaId !== undefined) {
        artistaId = artistaExistente.artistaId;
      } else {
        const novoArtista = await criarArtista.mutateAsync({ nomeArtista });
        if (novoArtista.artistaId === undefined) throw new Error('Falha ao criar artista');
        artistaId = novoArtista.artistaId;
      }

      await criarDisco.mutateAsync({
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

      setSuccessMessage('Disco adicionado com sucesso!');
      reset();

      if (onSuccess) {
        setTimeout(() => {
          setSuccessMessage('');
          onSuccess();
        }, 800);
      } else {
        setTimeout(() => {
          setSuccessMessage('');
          router.push('/estoque');
        }, 2000);
      }
    } catch (err) {
      console.error('Erro ao adicionar disco:', err);
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
              🎵 Novo Disco
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Adicione um novo disco ao seu estoque
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Informações Básicas</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="artistaNome">Artista *</Label>
                <input
                  type="text"
                  id="artistaNome"
                  list="artistas-disponiveis"
                  placeholder="Ex: The Beatles"
                  autoComplete="off"
                  {...register('artistaNome', { required: 'Artista é obrigatório' })}
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    errors.artistaNome
                      ? 'border-error-500 bg-error-50 dark:border-error-600 dark:bg-error-900/20'
                      : 'border-gray-300 bg-white focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600'
                  }`}
                />
                <datalist id="artistas-disponiveis">
                  {artistas.map((artista) => (
                    <option key={artista.artistaId} value={artista.nomeArtista ?? ''} />
                  ))}
                </datalist>
                {errors.artistaNome && (
                  <span className="mt-1 block text-sm text-error-600 dark:text-error-400">{errors.artistaNome.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="generoMusicalId">Gênero Musical</Label>
                <select
                  id="generoMusicalId"
                  {...register('generoMusicalId')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                >
                  <option value="">-- Selecione --</option>
                  {generosMusicais.map((genero) => (
                    <option
                      key={genero.generoMusicalId}
                      value={genero.generoMusicalId ?? ''}
                    >
                      {genero.nomeGenero}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="album">Álbum *</Label>
                <input
                  type="text"
                  id="album"
                  placeholder="Nome do álbum"
                  {...register('album', { required: 'Álbum é obrigatório' })}
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Informações Técnicas</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <input
                  type="text"
                  id="nacionalidade"
                  placeholder="Ex: Brasil"
                  {...register('nacionalidade')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>

              <div>
                <Label htmlFor="prensagem">Prensagem</Label>
                <input
                  type="text"
                  id="prensagem"
                  placeholder="Ex: Vinyl, CD..."
                  {...register('prensagem')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>

              <div>
                <Label htmlFor="encarte">Encarte</Label>
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
                <Label htmlFor="gravadora">Gravadora</Label>
                <input
                  type="text"
                  id="gravadora"
                  placeholder="Ex: Sony"
                  {...register('gravadora')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>

              <div>
                <Label htmlFor="anoLancamento">Ano de Lançamento</Label>
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Condição do Disco</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="condicaoCapa">Condição da Capa</Label>
                <input
                  type="text"
                  id="condicaoCapa"
                  placeholder="Ex: Excelente, Bom..."
                  {...register('condicaoCapa')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>

              <div>
                <Label htmlFor="condicaoDisco">Condição do Disco</Label>
                <input
                  type="text"
                  id="condicaoDisco"
                  placeholder="Ex: Excelente, Bom..."
                  {...register('condicaoDisco')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600"
                />
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Valores</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="custoDisco">Custo do Disco *</Label>
                <Controller
                  control={control}
                  name="custoDisco"
                  rules={{
                    required: 'Custo é obrigatório',
                    min: { value: 0, message: 'Custo não pode ser negativo' },
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
                <Label htmlFor="valorMercado">Valor de Mercado *</Label>
                <Controller
                  control={control}
                  name="valorMercado"
                  rules={{
                    required: 'Valor de mercado é obrigatório',
                    min: { value: 0, message: 'Valor não pode ser negativo' },
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
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Margem</p>
                    <p className={`text-lg font-bold ${margem >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                      {formatBRL(margem)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Percentual</p>
                    <p className={`text-lg font-bold ${margem >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                      {margemPct}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Preço de Venda</p>
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
            <Button type="submit" disabled={criando} size="lg" variant="primary" fullWidth>
              {criando ? 'Salvando...' : 'Salvar Disco'}
            </Button>
            <Button type="reset" size="lg" variant="secondary" fullWidth>
              Limpar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
