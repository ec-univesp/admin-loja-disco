'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/shared/components/ui/modal';
import Button from '@/shared/components/ui/button/Button';
import Label from '@/shared/components/form/Label';
import CurrencyInput from '@/shared/components/form/CurrencyInput';
import { useDiscos, useArtistas } from '@/shared/store/useStore';
import { useListaDeGenerosMusicais } from '@/shared/queries/generos-musicais.queries';
import type { Disco } from '@/shared/types/models';

interface EditDiscoModalProps {
  isOpen: boolean;
  onClose: () => void;
  discoId: string | null;
}

interface FormState {
  album: string;
  artistaNome: string;
  generoId: string;
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

const initialForm: FormState = {
  album: '',
  artistaNome: '',
  generoId: '',
  nacionalidade: '',
  premsagem: '',
  encarte: 'Ok',
  gravadora: '',
  anoLancamento: 0,
  anoPremsagem: 0,
  condicaoCapa: '',
  condicaoDisco: '',
  valorMercado: 0,
  custoDisco: 0,
  status: 'Disponível',
};

export default function EditDiscoModal({ isOpen, onClose, discoId }: EditDiscoModalProps) {
  const { discosComArtista, updateDisco } = useDiscos();
  const { data: generosMusicais = [] } = useListaDeGenerosMusicais();
  const { artistas, updateArtista } = useArtistas();

  const [form, setForm] = useState<FormState>(initialForm);
  const [artistaId, setArtistaId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !discoId) return;
    const disco = discosComArtista.find((d) => d.id === discoId);
    if (!disco) return;
    setArtistaId(disco.artistaId);
    setForm({
      album: disco.album,
      artistaNome: disco.artistaNome,
      generoId: disco.generoId ?? '',
      nacionalidade: disco.nacionalidade,
      premsagem: disco.premsagem,
      encarte: disco.encarte,
      gravadora: disco.gravadora,
      anoLancamento: disco.anoLancamento,
      anoPremsagem: disco.anoPremsagem,
      condicaoCapa: disco.condicaoCapa,
      condicaoDisco: disco.condicaoDisco,
      valorMercado: disco.valorMercado,
      custoDisco: disco.custoDisco,
      status: disco.status,
    });
  }, [isOpen, discoId, discosComArtista]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: ['anoLancamento', 'anoPremsagem'].includes(field) ? Number(val) : val,
      }));
    };

  const handleSave = async () => {
    if (!discoId) return;
    setSaving(true);
    try {
      // Atualiza nome do artista se mudou
      const artista = artistas.find((a) => a.id === artistaId);
      if (artista && artista.nome !== form.artistaNome) {
        await updateArtista(artistaId, { nome: form.artistaNome });
      }

      const updates: Partial<Disco> = {
        album: form.album,
        generoId: form.generoId || undefined,
        nacionalidade: form.nacionalidade,
        premsagem: form.premsagem,
        encarte: form.encarte,
        gravadora: form.gravadora,
        anoLancamento: form.anoLancamento,
        anoPremsagem: form.anoPremsagem,
        condicaoCapa: form.condicaoCapa,
        condicaoDisco: form.condicaoDisco,
        valorMercado: form.valorMercado,
        custoDisco: form.custoDisco,
        status: form.status,
      };

      await updateDisco(discoId, updates);
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
          {/* Informações Básicas */}
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
                  value={form.artistaNome}
                  onChange={handleChange('artistaNome')}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="edit-genero">Genero Musical</Label>
                <select
                  id="edit-genero"
                  value={form.generoId}
                  onChange={handleChange('generoId')}
                  className={inputClass}
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
                <Label htmlFor="edit-album">Album</Label>
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

          {/* Informações Técnicas */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Informacoes Tecnicas
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
                <Label htmlFor="edit-premsagem">Prensagem</Label>
                <input
                  id="edit-premsagem"
                  type="text"
                  value={form.premsagem}
                  onChange={handleChange('premsagem')}
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
                <Label htmlFor="edit-anoLancamento">Ano Lancamento</Label>
                <input
                  id="edit-anoLancamento"
                  type="number"
                  value={form.anoLancamento || ''}
                  onChange={handleChange('anoLancamento')}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="edit-anoPremsagem">Ano Prensagem</Label>
                <input
                  id="edit-anoPremsagem"
                  type="number"
                  value={form.anoPremsagem || ''}
                  onChange={handleChange('anoPremsagem')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Condição */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Condicao
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-condicaoCapa">Condicao da Capa</Label>
                <input
                  id="edit-condicaoCapa"
                  type="text"
                  value={form.condicaoCapa}
                  onChange={handleChange('condicaoCapa')}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="edit-condicaoDisco">Condicao do Disco</Label>
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

          {/* Valores */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Valores
            </h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-custoDisco">Custo do Disco</Label>
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

          {/* Status */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={form.status}
                onChange={handleChange('status')}
                className={inputClass}
              >
                <option value="Disponível">Disponível</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-2">
            <Button size="sm" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button size="sm" variant="primary" onClick={handleSave} isLoading={saving}>
              Salvar alteracoes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
