'use client';

import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { useArtistsModel } from '@/app/inventory/model/artistsModel';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import type { ArtistDTO } from '@/shared/services/api';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { FormEvent, useCallback, useMemo, useState } from 'react';

const iconPlus = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const formatArtistCode = (id: number) => `ART-${String(id).padStart(4, '0')}`;
const getArtistName = (artist: ArtistDTO) => artist.nomeArtista ?? 'Artista sem nome';

export default function ArtistsPage() {
  const { list, create, update, remove } = useArtistsModel();
  const { list: recordsList } = useRecordsModel();

  const artists = useMemo(() => list.data ?? [], [list.data]);
  const records = useMemo(() => recordsList.data ?? [], [recordsList.data]);

  const [searchTerm, setSearchTerm] = useState('');
  const [artistName, setArtistName] = useState('');
  const [artistFormError, setArtistFormError] = useState<string | null>(null);
  const [artistToEdit, setArtistToEdit] = useState<ArtistDTO | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<ArtistDTO | null>(null);
  const [artistToDelete, setArtistToDelete] = useState<{ id: number; name: string } | null>(null);

  const formModal = useModal();
  const detailsModal = useModal();
  const deleteModal = useModal();

  const recordsByArtistName = useMemo(() => {
    const counter = new Map<string, number>();
    records.forEach((record) => {
      const name = record.artista?.nomeArtista?.trim().toLowerCase();
      if (!name) return;
      counter.set(name, (counter.get(name) ?? 0) + 1);
    });
    return counter;
  }, [records]);

  const filteredArtists = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return artists;

    return artists.filter((artist) =>
      getArtistName(artist).toLowerCase().includes(normalizedSearch)
    );
  }, [artists, searchTerm]);

  const getRecordCount = useCallback(
    (artist: ArtistDTO) => recordsByArtistName.get(getArtistName(artist).trim().toLowerCase()) ?? 0,
    [recordsByArtistName]
  );

  const handleOpenCreate = useCallback(() => {
    setArtistToEdit(null);
    setArtistName('');
    setArtistFormError(null);
    formModal.openModal();
  }, [formModal]);

  const handleOpenEdit = useCallback(
    (artist: ArtistDTO) => {
      setArtistToEdit(artist);
      setArtistName(artist.nomeArtista ?? '');
      setArtistFormError(null);
      formModal.openModal();
    },
    [formModal]
  );

  const handleCloseForm = useCallback(() => {
    formModal.closeModal();
    setArtistToEdit(null);
    setArtistName('');
    setArtistFormError(null);
  }, [formModal]);

  const handleSubmitArtist = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nomeArtista = artistName.trim();

      if (!nomeArtista) {
        setArtistFormError('Nome do artista é obrigatório.');
        return;
      }

      if (artistToEdit?.artistaId) {
        await update.mutateAsync({ artistaId: artistToEdit.artistaId, nomeArtista });
      } else {
        await create.mutateAsync({ nomeArtista });
      }

      handleCloseForm();
    },
    [artistName, artistToEdit, create, update, handleCloseForm]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!artistToDelete) return;
    await remove.mutateAsync(artistToDelete.id);
    setArtistToDelete(null);
    deleteModal.closeModal();
  }, [artistToDelete, remove, deleteModal]);

  const isSaving = create.isPending || update.isPending;

  return (
    <div>
      <PageBreadcrumb pageTitle="Artistas" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Artistas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredArtists.length} artista(s) cadastrado(s)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Buscar artista..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Button size="md" variant="primary" startIcon={iconPlus} onClick={handleOpenCreate}>
              Novo artista
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Código
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Artista
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Discos cadastrados
                </th>
                <th className="w-28 px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredArtists.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    {list.isLoading ? 'Carregando artistas...' : 'Nenhum artista encontrado.'}
                  </td>
                </tr>
              ) : (
                filteredArtists.map((artist) => {
                  const id = artist.artistaId ?? 0;
                  const artistDisplayName = getArtistName(artist);
                  const recordCount = getRecordCount(artist);

                  return (
                    <tr
                      key={artist.artistaId ?? artistDisplayName}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-white/2"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                        {id > 0 ? formatArtistCode(id) : '—'}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                        {artistDisplayName}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                        {recordCount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            type="button"
                            aria-label={`Visualizar artista ${artistDisplayName}`}
                            title={`Visualizar artista ${artistDisplayName}`}
                            onClick={() => {
                              setSelectedArtist(artist);
                              detailsModal.openModal();
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-500 text-white shadow-sm transition-colors hover:bg-gray-600"
                          >
                            <Eye size={15} strokeWidth={2.25} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Editar artista ${artistDisplayName}`}
                            title={`Editar artista ${artistDisplayName}`}
                            onClick={() => handleOpenEdit(artist)}
                            className="bg-brand-500 hover:bg-brand-600 inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                          >
                            <Pencil size={15} strokeWidth={2.25} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Excluir artista ${artistDisplayName}`}
                            title={`Excluir artista ${artistDisplayName}`}
                            onClick={() => {
                              if (artist.artistaId === undefined) return;
                              setArtistToDelete({ id: artist.artistaId, name: artistDisplayName });
                              deleteModal.openModal();
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                          >
                            <Trash2 size={15} strokeWidth={2.25} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={formModal.isOpen} onClose={handleCloseForm} className="m-4 max-w-130">
        <form onSubmit={handleSubmitArtist} className="p-6 pr-14">
          <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
            {artistToEdit ? 'Editar artista' : 'Cadastrar artista'}
          </h4>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            Informe o nome do artista para manter o catálogo organizado.
          </p>
          <div>
            <Label htmlFor="artist-name">Nome do artista *</Label>
            <input
              id="artist-name"
              type="text"
              value={artistName}
              onChange={(event) => {
                setArtistName(event.target.value);
                setArtistFormError(null);
              }}
              placeholder="Ex: Caetano Veloso"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              autoFocus
            />
            {artistFormError && (
              <span className="mt-1 block text-xs text-red-600 dark:text-red-400">
                {artistFormError}
              </span>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCloseForm}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" isLoading={isSaving}>
              {artistToEdit ? 'Salvar alterações' : 'Cadastrar artista'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={detailsModal.isOpen}
        onClose={() => {
          detailsModal.closeModal();
          setSelectedArtist(null);
        }}
        className="m-4 max-w-130"
      >
        <div className="p-6 pr-14">
          <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
            Detalhes do artista
          </h4>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            Informações do cadastro do artista selecionado.
          </p>
          <div className="space-y-3 text-sm">
            <DetailRow
              label="Código"
              value={selectedArtist?.artistaId ? formatArtistCode(selectedArtist.artistaId) : '—'}
            />
            <DetailRow label="Nome" value={selectedArtist ? getArtistName(selectedArtist) : '—'} />
            <DetailRow
              label="Discos"
              value={selectedArtist ? String(getRecordCount(selectedArtist)) : '—'}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="m-4 max-w-110"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Excluir artista
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja excluir o artista{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {artistToDelete?.name}
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={remove.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60 dark:bg-red-700 dark:hover:bg-red-600"
            >
              {remove.isPending ? 'Excluindo...' : 'Apagar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-lg border border-gray-100 px-4 py-3 sm:grid-cols-[120px_1fr] dark:border-gray-800">
      <span className="font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-gray-800 dark:text-white/90">{value}</span>
    </div>
  );
}
