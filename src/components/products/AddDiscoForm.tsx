'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDiscos, useArtistas } from '@/hooks/useStore';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';

interface AddDiscoFormData {
  artistaNome: string;
  album: string;
  nacionalidade: string;
  premsagem: string;
  encarte: string;
  gravadora: string;
  anoLancamento: number;
  anoPremsagem: number;
  condicaoCapa: string;
  condicaoDisco: string;
  valorMercado: number;
  custoDisco: number;
  status: string;
}

export default function AddDiscoForm() {
  const { createDisco, loading, error } = useDiscos();
  const { createArtista } = useArtistas();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDiscoFormData>({
    defaultValues: {
      artistaNome: '',
      album: '',
      nacionalidade: 'Brasil',
      premsagem: 'Vinyl',
      encarte: 'Papel',
      gravadora: '',
      anoLancamento: new Date().getFullYear(),
      anoPremsagem: new Date().getFullYear(),
      condicaoCapa: 'Excelente',
      condicaoDisco: 'Excelente',
      valorMercado: 0,
      custoDisco: 0,
      status: 'Ativo',
    },
  }); 

  const onSubmit = async (data: AddDiscoFormData) => {
    try {
      // Gerar um ID único para o artista baseado no nome
      const artistaId = `artista-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Criar o artista automaticamente
      await createArtista({
        nome: data.artistaNome,
        generoId: '', // Vazio por padrão
      });

      // Criar o disco associado ao artista
      await createDisco({
        artistaId: artistaId,
        album: data.album,
        nacionalidade: data.nacionalidade,
        premsagem: data.premsagem,
        encarte: data.encarte,
        gravadora: data.gravadora,
        anoLancamento: Number(data.anoLancamento),
        anoPremsagem: Number(data.anoPremsagem),
        condicaoCapa: data.condicaoCapa,
        condicaoDisco: data.condicaoDisco,
        valorMercado: Number(data.valorMercado),
        custoDisco: Number(data.custoDisco),
        status: data.status,
      });

      setSuccessMessage('✅ Produto adicionado com sucesso!');
      reset();

      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao adicionar disco:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Adicionar Disco */}
      <ComponentCard title="➕ Adicionar Novo Disco">
        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-900 dark:text-green-200">
              {successMessage}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-900 dark:text-red-200">
              ❌ Erro ao adicionar: {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Artista e Básico */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="artistaNome">Artista *</Label>
              <input
                type="text"
                id="artistaNome"
                placeholder="Ex: The Beatles"
                {...register('artistaNome', { required: 'Artista é obrigatório' })}
                className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-900 ${
                  errors.artistaNome
                    ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
                    : 'border-gray-300 bg-white dark:border-gray-700'
                }`}
              />
              {errors.artistaNome && (
                <span className="mt-1 text-sm text-red-500">{errors.artistaNome.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="album">Álbum *</Label>
              <input
                type="text"
                id="album"
                placeholder="Nome do álbum"
                {...register('album', { required: 'Álbum é obrigatório' })}
                className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-900 ${
                  errors.album
                    ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
                    : 'border-gray-300 bg-white dark:border-gray-700'
                }`}
              />
              {errors.album && (
                <span className="mt-1 text-sm text-red-500">{errors.album.message}</span>
              )}
            </div>
          </div>

          {/* Informações Técnicas */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Informações Técnicas
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <input
                  type="text"
                  id="nacionalidade"
                  placeholder="Ex: Brasil, USA, Inglaterra"
                  {...register('nacionalidade')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="premsagem">Prensagem</Label>
                <select
                  id="premsagem"
                  {...register('premsagem')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="Vinyl">Vinyl</option>
                  <option value="CD">CD</option>
                  <option value="Cassete">Cassete</option>
                  <option value="Digital">Digital</option>
                </select>
              </div>

              <div>
                <Label htmlFor="encarte">Encarte</Label>
                <select
                  id="encarte"
                  {...register('encarte')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="Papel">Papel</option>
                  <option value="Plástico">Plástico</option>
                  <option value="Nenhum">Nenhum</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="gravadora">Gravadora</Label>
                <input
                  type="text"
                  id="gravadora"
                  placeholder="Ex: Sony, Warner, Universal"
                  {...register('gravadora')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="anoLancamento">Ano de Lançamento</Label>
                <input
                  type="number"
                  id="anoLancamento"
                  {...register('anoLancamento')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Condição */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Condição do Disco
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="condicaoCapa">Condição da Capa</Label>
                <select
                  id="condicaoCapa"
                  {...register('condicaoCapa')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="Excelente">Excelente</option>
                  <option value="Bom">Bom</option>
                  <option value="Razoável">Razoável</option>
                  <option value="Ruim">Ruim</option>
                </select>
              </div>

              <div>
                <Label htmlFor="condicaoDisco">Condição do Disco</Label>
                <select
                  id="condicaoDisco"
                  {...register('condicaoDisco')}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="Excelente">Excelente</option>
                  <option value="Bom">Bom</option>
                  <option value="Razoável">Razoável</option>
                  <option value="Ruim">Ruim</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preços */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Valores
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="valorMercado">Valor de Mercado (R$) *</Label>
                <input
                  type="number"
                  id="valorMercado"
                  placeholder="0.00"
                  step="0.01"
                  {...register('valorMercado', {
                    required: 'Valor de mercado é obrigatório',
                    min: { value: 0, message: 'Valor não pode ser negativo' },
                  })}
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-900 ${
                    errors.valorMercado
                      ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
                      : 'border-gray-300 bg-white dark:border-gray-700'
                  }`}
                />
                {errors.valorMercado && (
                  <span className="mt-1 text-sm text-red-500">
                    {errors.valorMercado.message}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="custoDisco">Custo do Disco (R$) *</Label>
                <input
                  type="number"
                  id="custoDisco"
                  placeholder="0.00"
                  step="0.01"
                  {...register('custoDisco', {
                    required: 'Custo é obrigatório',
                    min: { value: 0, message: 'Custo não pode ser negativo' },
                  })}
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-900 ${
                    errors.custoDisco
                      ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20'
                      : 'border-gray-300 bg-white dark:border-gray-700'
                  }`}
                />
                {errors.custoDisco && (
                  <span className="mt-1 text-sm text-red-500">
                    {errors.custoDisco.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status')}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Descontinuado">Descontinuado</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-brand-500 px-6 py-2.5 font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </button>
            <button
              type="reset"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Limpar
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
