'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import Button from '@/shared/components/ui/button/Button';
import { useState, useMemo, useEffect } from 'react';
import { RecordStatus } from '@/shared/types';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import { useGenresModel } from '@/app/inventory/model/genresModel';
import { useArtistsModel } from '@/app/inventory/model/artistsModel';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import EditRecordModal from '@/app/inventory/components/EditRecordModal';
import AddRecordForm from '@/app/inventory/components/AddRecordForm';
import { Pencil, Trash2 } from 'lucide-react';

type AddOption = 'menu' | 'genre' | 'artist' | 'record';

interface RecordRow {
  id: number;
  code: string;
  title: string;
  artist: string;
  genre: string;
  nationality: string;
  pressing: string;
  insert: string;
  label: string;
  releaseYear: number;
  pressingYear: number;
  coverCondition: string;
  recordCondition: string;
  marketValue: number;
  recordCost: number;
  price: number;
  status: string;
}

const generateCode = (index: number): string => {
  return `DISC-${String(index + 1).padStart(4, '0')}`;
};

const SEARCH_DEBOUNCE_MS = 300;

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [hideSoldRecords, setHideSoldRecords] = useState(false);
  const [newGenre, setNewGenre] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [editRecordId, setEditRecordId] = useState<number | null>(null);
  const addModal = useModal();
  const [addOption, setAddOption] = useState<AddOption>('menu');

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setDebouncedSearchTerm(searchTerm.trim()),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const searchFilters = debouncedSearchTerm
    ? { termo: debouncedSearchTerm }
    : undefined;

  const {
    list: recordsList,
    search: searchResults,
    remove: removeRecord,
  } = useRecordsModel(undefined, searchFilters);
  const { list: genresList, create: createGenre, remove: removeGenre } = useGenresModel();
  const { list: artistsList, create: createArtist, remove: removeArtist } = useArtistsModel();

  const isSearching = Boolean(debouncedSearchTerm);
  const records = useMemo(() => {
    if (isSearching) return searchResults.data ?? [];
    return recordsList.data ?? [];
  }, [isSearching, searchResults.data, recordsList.data]);
  const loading = isSearching ? searchResults.isLoading : recordsList.isLoading;
  const genres = useMemo(() => genresList.data ?? [], [genresList.data]);
  const artists = useMemo(() => artistsList.data ?? [], [artistsList.data]);

  const closeAddModal = () => {
    addModal.closeModal();
    setAddOption('menu');
  };

  const deleteRecordModal = useModal();
  const [recordToDelete, setRecordToDelete] = useState<{ id: number; title: string } | null>(null);

  const deleteGenreModal = useModal();
  const [genreToDelete, setGenreToDelete] = useState<{
    generoMusicalId: number;
    nomeGenero: string;
  } | null>(null);

  const deleteArtistModal = useModal();
  const [artistToDelete, setArtistToDelete] = useState<{
    artistaId: number;
    nomeArtista: string;
  } | null>(null);

  const handleAddGenre = async () => {
    const nomeGenero = newGenre.trim();
    if (!nomeGenero) return;
    await createGenre.mutateAsync({ nomeGenero });
    setNewGenre('');
  };

  const handleConfirmDeleteRecord = async () => {
    if (!recordToDelete) return;
    await removeRecord.mutateAsync(recordToDelete.id);
    setRecordToDelete(null);
    deleteRecordModal.closeModal();
  };

  const handleConfirmDeleteGenre = async () => {
    if (!genreToDelete) return;
    await removeGenre.mutateAsync(genreToDelete.generoMusicalId);
    setGenreToDelete(null);
    deleteGenreModal.closeModal();
  };

  const handleAddArtist = async () => {
    const nomeArtista = newArtist.trim();
    if (!nomeArtista) return;
    await createArtist.mutateAsync({ nomeArtista });
    setNewArtist('');
  };

  const handleConfirmDeleteArtist = async () => {
    if (!artistToDelete) return;
    await removeArtist.mutateAsync(artistToDelete.artistaId);
    setArtistToDelete(null);
    deleteArtistModal.closeModal();
  };

  const rows = useMemo<RecordRow[]>(
    () =>
      records.map((record, index) => ({
        id: record.discoId ?? 0,
        code: generateCode(index),
        title: record.album ?? '',
        artist: record.artista?.nomeArtista ?? 'Desconhecido',
        genre:
          record.generosMusicais
            ?.map((g) => g.nomeGenero)
            .filter(Boolean)
            .join(', ') ?? '',
        nationality: record.nacionalidade ?? '',
        pressing: record.prensagem ?? '',
        insert: record.encarte ?? '',
        label: record.gravadora ?? '',
        releaseYear: record.anoLancamento ?? 0,
        pressingYear: record.anoPrensagem ?? 0,
        coverCondition: record.condicaoCapa ?? '',
        recordCondition: record.condicaoDisco ?? '',
        marketValue: record.valorMercado ?? 0,
        recordCost: record.custoDisco ?? 0,
        price: record.valorMercado ?? 0,
        status: record.status ?? RecordStatus.DISPONIVEL,
      })),
    [records]
  );

  const filteredRows = hideSoldRecords
    ? rows.filter((row) => row.status !== RecordStatus.VENDIDO)
    : rows;

  const soldCount = rows.filter((row) => row.status === RecordStatus.VENDIDO).length;

  const iconPlus = (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Estoque" />

      <div className="grid gap-4">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 via-white to-brand-25 dark:border-gray-700 dark:from-brand-950/50 dark:via-gray-900 dark:to-brand-900/30">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-brand-900 dark:text-brand-50">
                Meu Estoque
              </h3>
              <p className="mt-1 text-sm text-brand-700/70 dark:text-brand-200/60">
                {filteredRows.length} disco(s){' '}
                {isSearching
                  ? 'encontrado(s)'
                  : hideSoldRecords
                    ? 'disponível(is)'
                    : 'cadastrado(s)'}
                {soldCount > 0 && hideSoldRecords && !isSearching && (
                  <span className="ml-1 text-brand-600/70 dark:text-brand-300/60">
                    · {soldCount} vendido(s) ocultos
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-brand-700/40 dark:bg-gray-800/50 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={hideSoldRecords}
                  onChange={(toggleEvent) => setHideSoldRecords(toggleEvent.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-brand-600"
                />
                Ocultar vendidos
              </label>
              <input
                type="text"
                placeholder="Buscar álbum ou artista..."
                value={searchTerm}
                onChange={(searchChangeEvent) => setSearchTerm(searchChangeEvent.target.value)}
                className="focus:border-brand-700 focus:ring-brand-600/20 rounded-lg border border-brand-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all dark:border-brand-700/40 dark:bg-gray-800/50 dark:text-gray-200 dark:focus:border-brand-600"
              />
              <Button
                size="md"
                variant="primary"
                startIcon={iconPlus}
                onClick={addModal.openModal}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Código</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Álbum</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Artista</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Gênero</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Nacionalidade</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Prensagem</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Encarte</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Gravadora</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Ano Lanç.</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Ano Prens.</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Cond. Capa</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Cond. Disco</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Valor de Mercado</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Custo</th>
                  <th className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={16} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">
                          {loading ? 'Carregando estoque...' : 'Nenhum disco encontrado'}
                        </p>
                        {!loading && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Clique em &quot;Adicionar&quot; para começar
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-all duration-200 hover:bg-brand-50/50 dark:hover:bg-brand-900/20"
                    >
                      <td className="px-4 py-4 font-mono text-xs font-medium text-gray-600 dark:text-gray-400">
                        {row.code}
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                        {row.title}
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {row.artist}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.genre || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.nationality || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.pressing || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.insert || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.label || '—'}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {row.releaseYear || '—'}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {row.pressingYear || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.coverCondition || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {row.recordCondition || '—'}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-brand-700 dark:text-brand-400">
                        R$ {row.marketValue.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        R$ {row.recordCost.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            row.status === RecordStatus.VENDIDO
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}
                        >
                          {row.status === RecordStatus.VENDIDO ? 'Vendido' : 'Disponível'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            aria-label={`Editar disco ${row.title}`}
                            title={`Editar disco ${row.title}`}
                            onClick={() => setEditRecordId(row.id > 0 ? row.id : null)}
                            className="bg-brand-500 hover:bg-brand-600 inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                          >
                            <Pencil size={15} strokeWidth={2.25} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Apagar disco ${row.title}`}
                            title={`Apagar disco ${row.title}`}
                            onClick={() => {
                              setRecordToDelete({ id: row.id > 0 ? row.id : 0, title: row.title });
                              deleteRecordModal.openModal();
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                          >
                            <Trash2 size={15} strokeWidth={2.25} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredRows.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total em estoque:{' '}
                  <span className="font-semibold text-brand-700 dark:text-brand-400">
                    {filteredRows.length} disco(s)
                  </span>
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Valor total:{' '}
                  <span className="font-semibold text-brand-700 dark:text-brand-400">
                    R$ {filteredRows.reduce((sum, row) => sum + row.price, 0).toFixed(2)}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={addModal.isOpen}
        onClose={closeAddModal}
        className={`m-4 ${addOption === 'record' ? 'max-w-[1000px]' : 'max-w-[560px]'}`}
      >
        <div className="p-6">
          {addOption !== 'menu' && (
            <button
              type="button"
              onClick={() => setAddOption('menu')}
              className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
          )}

          {addOption === 'menu' && (
            <>
              <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
                O que deseja adicionar?
              </h4>
              <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                Escolha uma das opções abaixo para continuar.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setAddOption('genre')}
                  className="group flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20"
                >
                  <span className="rounded-lg bg-brand-100 p-2 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-3a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">Gênero Musical</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Cadastre um novo gênero.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAddOption('artist')}
                  className="group flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20"
                >
                  <span className="rounded-lg bg-brand-100 p-2 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">Artista</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Cadastre um novo artista.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAddOption('record')}
                  className="group flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20"
                >
                  <span className="rounded-lg bg-brand-100 p-2 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth={2} />
                      <circle cx="12" cy="12" r="3" strokeWidth={2} />
                    </svg>
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">Adicionar Disco</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Adicione um disco ao estoque.</span>
                </button>
              </div>
            </>
          )}

          {addOption === 'genre' && (
            <>
              <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Cadastrar Gênero Musical
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome do gênero *
                  </label>
                  <input
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Ex: MPB, Reggae, Samba..."
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddGenre();
                    }}
                    autoFocus
                  />
                </div>

                {genres.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Gêneros cadastrados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {genres.map((genre) => (
                        <div
                          key={genre.generoMusicalId}
                          className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
                        >
                          <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                            {genre.nomeGenero}
                          </span>
                          <button
                            type="button"
                            aria-label={`Apagar gênero ${genre.nomeGenero}`}
                            title={`Apagar gênero ${genre.nomeGenero}`}
                            onClick={() => {
                              if (genre.generoMusicalId === undefined) return;
                              setGenreToDelete({
                                generoMusicalId: genre.generoMusicalId,
                                nomeGenero: genre.nomeGenero ?? '',
                              });
                              deleteGenreModal.openModal();
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
                  <Button size="sm" variant="outline" onClick={closeAddModal}>
                    Cancelar
                  </Button>
                  <Button size="sm" variant="primary" onClick={handleAddGenre}>
                    Salvar
                  </Button>
                </div>
              </div>
            </>
          )}

          {addOption === 'artist' && (
            <>
              <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Cadastrar Artista
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome do artista *
                  </label>
                  <input
                    type="text"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder="Ex: The Beatles, Caetano Veloso..."
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddArtist();
                    }}
                    autoFocus
                  />
                </div>

                {artists.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Artistas cadastrados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {artists.map((artist) => (
                        <div
                          key={artist.artistaId}
                          className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
                        >
                          <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                            {artist.nomeArtista}
                          </span>
                          <button
                            type="button"
                            aria-label={`Apagar artista ${artist.nomeArtista}`}
                            title={`Apagar artista ${artist.nomeArtista}`}
                            onClick={() => {
                              if (artist.artistaId === undefined) return;
                              setArtistToDelete({
                                artistaId: artist.artistaId,
                                nomeArtista: artist.nomeArtista ?? '',
                              });
                              deleteArtistModal.openModal();
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
                  <Button size="sm" variant="outline" onClick={closeAddModal}>
                    Cancelar
                  </Button>
                  <Button size="sm" variant="primary" onClick={handleAddArtist}>
                    Salvar
                  </Button>
                </div>
              </div>
            </>
          )}

          {addOption === 'record' && (
            <>
              <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Adicionar Disco
              </h4>
              <div className="max-h-[70vh] overflow-y-auto pr-1">
                <AddRecordForm embedded onSuccess={closeAddModal} />
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={deleteArtistModal.isOpen}
        onClose={deleteArtistModal.closeModal}
        className="m-4 max-w-110"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar artista
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar o artista{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {artistToDelete?.nomeArtista}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteArtistModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDeleteArtist}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>

      <EditRecordModal
        isOpen={editRecordId !== null}
        onClose={() => setEditRecordId(null)}
        recordId={editRecordId}
      />

      <Modal
        isOpen={deleteRecordModal.isOpen}
        onClose={deleteRecordModal.closeModal}
        className="m-4 max-w-110"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar disco
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar o disco{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {recordToDelete?.title}
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteRecordModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDeleteRecord}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteGenreModal.isOpen}
        onClose={deleteGenreModal.closeModal}
        className="m-4 max-w-110"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar gênero musical
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar o gênero{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {genreToDelete?.nomeGenero}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteGenreModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDeleteGenre}
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
