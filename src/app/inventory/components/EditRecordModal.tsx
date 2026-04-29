'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/shared/components/ui/modal';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import CurrencyInput from '@/shared/components/form/CurrencyInput';
import { RecordStatus } from '@/shared/types';
import { useRecordsModel } from '@/app/inventory/model/recordsModel';
import { useGenresModel } from '@/app/inventory/model/genresModel';
import { useArtistsModel } from '@/app/inventory/model/artistsModel';

interface EditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: number | null;
}

interface FormState {
  album: string;
  artistaId: number | undefined;
  artistaNome: string;
  generoMusicalId: string;
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

const initialForm: FormState = {
  album: '',
  artistaId: undefined,
  artistaNome: '',
  generoMusicalId: '',
  nacionalidade: '',
  prensagem: '',
  encarte: 'Ok',
  gravadora: '',
  anoLancamento: 0,
  anoPrensagem: 0,
  condicaoCapa: '',
  condicaoDisco: '',
  valorMercado: 0,
  custoDisco: 0,
  status: RecordStatus.AVAILABLE,
};

export default function EditRecordModal({ isOpen, onClose, recordId }: EditRecordModalProps) {
  const activeId = isOpen && recordId !== null ? recordId : undefined;
  const { byId, update: updateRecord } = useRecordsModel(activeId);
  const { list: genresList } = useGenresModel();
  const { list: artistsList, update: updateArtist } = useArtistsModel();
  const record = byId.data;
  const genres = genresList.data ?? [];
  const artists = artistsList.data ?? [];

  const [form, setForm] = useState<FormState>(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !record) return;
    setForm({
      album: record.album ?? '',
      artistaId: record.artista?.artistaId,
      artistaNome: record.artista?.nomeArtista ?? '',
      generoMusicalId: String(record.generosMusicais?.[0]?.generoMusicalId ?? ''),
      nacionalidade: record.nacionalidade ?? '',
      prensagem: record.prensagem ?? '',
      encarte: record.encarte ?? 'Ok',
      gravadora: record.gravadora ?? '',
      anoLancamento: record.anoLancamento ?? 0,
      anoPrensagem: record.anoPrensagem ?? 0,
      condicaoCapa: record.condicaoCapa ?? '',
      condicaoDisco: record.condicaoDisco ?? '',
      valorMercado: record.valorMercado ?? 0,
      custoDisco: record.custoDisco ?? 0,
      status: record.status ?? RecordStatus.AVAILABLE,
    });
  }, [isOpen, record]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: ['anoLancamento', 'anoPrensagem'].includes(field) ? Number(val) : val,
      }));
    };

  const handleSave = async () => {
    if (!recordId) return;
    setSaving(true);
    try {
      if (form.artistaId !== undefined) {
        const currentArtist = artists.find((a) => a.artistaId === form.artistaId);
        if (currentArtist && currentArtist.nomeArtista !== form.artistaNome) {
          await updateArtist.mutateAsync({ artistaId: form.artistaId, nomeArtista: form.artistaNome });
        }
      }

      await updateRecord.mutateAsync({
        discoId: recordId,
        artista: { artistaId: form.artistaId, nomeArtista: form.artistaNome },
        album: form.album,
        nacionalidade: form.nacionalidade,
        prensagem: form.prensagem,
        encarte: form.encarte,
        gravadora: form.gravadora,
        anoLancamento: form.anoLancamento,
        anoPrensagem: form.anoPrensagem,
        condicaoCapa: form.condicaoCapa,
        condicaoDisco: form.condicaoDisco,
        valorMercado: form.valorMercado,
        custoDisco: form.custoDisco,
        status: form.status,
        generosMusicais: form.generoMusicalId
          ? [{ generoMusicalId: Number(form.generoMusicalId) }]
          : [],
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white';

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[720px]">
      <div className="max-h-[80vh] overflow-y-auto p-6">
        <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Editar Disco
        </h4>

        <div className="space-y-5">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Informações Básicas
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <Label htmlFor="edit-artista">Artista</Label>
                <input
                  id="edit-artista"
                  type="text"
                  list="artistas-edit-disponiveis"
                  value={form.artistaNome}
                  onChange={handleChange('artistaNome')}
                  className={inputClass}
                />
                <datalist id="artistas-edit-disponiveis">
                  {artists.map((artist) => (
                    <option key={artist.artistaId} value={artist.nomeArtista ?? ''} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label htmlFor="edit-genero">Gênero Musical</Label>
                <select
                  id="edit-genero"
                  value={form.generoMusicalId}
                  onChange={handleChange('generoMusicalId')}
                  className={inputClass}
                >
                  <option value="">-- Selecione --</option>
                  {genres.map((genre) => (
                    <option key={genre.generoMusicalId} value={genre.generoMusicalId ?? ''}>
                      {genre.nomeGenero}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-album">Álbum</Label>
                <input
                  id="edit-album"
                  type="text"
                  value={form.album}
                  onChange={handleChange('album')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Informações Técnicas
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <Label htmlFor="edit-nacionalidade">Nacionalidade</Label>
                <input
                  id="edit-nacionalidade"
                  type="text"
                  value={form.nacionalidade}
                  onChange={handleChange('nacionalidade')}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="edit-prensagem">Prensagem</Label>
                <input
                  id="edit-prensagem"
                  type="text"
                  value={form.prensagem}
                  onChange={handleChange('prensagem')}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="edit-encarte">Encarte</Label>
                <select
                  id="edit-encarte"
                  value={form.encarte}
                  onChange={handleChange('encarte')}
                  className={inputClass}
                >
                  <option value="Ok">Ok</option>
                  <option value="N/A">N/A</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-gravadora">Gravadora</Label>
                <input
                  id="edit-gravadora"
                  type="text"
                  value={form.gravadora}
                  onChange={handleChange('gravadora')}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="edit-anoLancamento">Ano de Lançamento</Label>
                <input
                  id="edit-anoLancamento"
                  type="number"
                  value={form.anoLancamento || ''}
                  onChange={handleChange('anoLancamento')}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="edit-anoPrensagem">Ano de Prensagem</Label>
                <input
                  id="edit-anoPrensagem"
                  type="number"
                  value={form.anoPrensagem || ''}
                  onChange={handleChange('anoPrensagem')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Condição
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-condicaoCapa">Cond. Capa</Label>
                <input
                  id="edit-condicaoCapa"
                  type="text"
                  value={form.condicaoCapa}
                  onChange={handleChange('condicaoCapa')}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="edit-condicaoDisco">Cond. Disco</Label>
                <input
                  id="edit-condicaoDisco"
                  type="text"
                  value={form.condicaoDisco}
                  onChange={handleChange('condicaoDisco')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Preços
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-custoDisco">Custo</Label>
                <CurrencyInput
                  id="edit-custoDisco"
                  value={form.custoDisco}
                  onChange={(v) => setForm((prev) => ({ ...prev, custoDisco: v }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-valorMercado">Valor de Mercado</Label>
                <CurrencyInput
                  id="edit-valorMercado"
                  value={form.valorMercado}
                  onChange={(v) => setForm((prev) => ({ ...prev, valorMercado: v }))}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={form.status}
                onChange={handleChange('status')}
                className={inputClass}
              >
                <option value={RecordStatus.AVAILABLE}>Disponível</option>
                <option value={RecordStatus.SOLD}>Vendido</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button size="sm" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button size="sm" variant="primary" onClick={handleSave} isLoading={saving}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
