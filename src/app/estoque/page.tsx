'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import Button from '@/shared/components/ui/button/Button';
import { useState, useMemo, useEffect } from 'react';
import { useDiscos, useArtistas } from '@/shared/store/useStore';
import {
  useListaDeGenerosMusicais,
  useCriarGeneroMusical,
  useExcluirGeneroMusical,
} from '@/shared/queries/generos-musicais.queries';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import EditDiscoModal from '@/features/estoque/components/EditDiscoModal';
import AddDiscoForm from '@/features/estoque/components/AddDiscoForm';
import { Pencil, Trash2 } from 'lucide-react';

type AddOption = 'menu' | 'genero' | 'artista' | 'disco';

interface ProdutoDisplay {
  id: string;
  artistaId: string;
  codigo: string;
  titulo: string;
  artista: string;
  genero: string;
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
  preco: number;
  status: string;
}

const gerarCodigo = (index: number): string => {
  return `DISC-${String(index + 1).padStart(4, '0')}`;
};

export default function EstoquePage() {
  const { discosComArtista, loading, deleteDisco } = useDiscos();
  const { data: generosMusicais = [] } = useListaDeGenerosMusicais();
  const { mutateAsync: criarGeneroMusical } = useCriarGeneroMusical();
  const { mutateAsync: excluirGeneroMusical } = useExcluirGeneroMusical();
  const { artistas, fetchArtistas, createArtista, deleteArtista } = useArtistas();
  const [busca, setBusca] = useState('');
  const [novoGenero, setNovoGenero] = useState('');
  const [novoArtista, setNovoArtista] = useState('');
  const [editDiscoId, setEditDiscoId] = useState<string | null>(null);
  const addModal = useModal();
  const [addOption, setAddOption] = useState<AddOption>('menu');

  const closeAddModal = () => {
    addModal.closeModal();
    setAddOption('menu');
  };

  const deleteDiscoModal = useModal();
  const [discoParaApagar, setDiscoParaApagar] = useState<{ id: string; titulo: string } | null>(null);

  const deleteGeneroModal = useModal();
  const [generoParaApagar, setGeneroParaApagar] = useState<{
    generoMusicalId: number;
    nomeGenero: string;
  } | null>(null);

  const deleteArtistaModal = useModal();
  const [artistaParaApagar, setArtistaParaApagar] = useState<{ id: string; nome: string } | null>(null);

  useEffect(() => {
    fetchArtistas();
  }, [fetchArtistas]);

  const handleAddGenero = async () => {
    const nomeGenero = novoGenero.trim();
    if (!nomeGenero) return;
    await criarGeneroMusical({ nomeGenero });
    setNovoGenero('');
  };

  const handleConfirmarApagarDisco = async () => {
    if (!discoParaApagar) return;
    await deleteDisco(discoParaApagar.id); // TODO: API
    setDiscoParaApagar(null);
    deleteDiscoModal.closeModal();
  };

  const handleConfirmarApagarGenero = async () => {
    if (!generoParaApagar) return;
    await excluirGeneroMusical(generoParaApagar.generoMusicalId);
    setGeneroParaApagar(null);
    deleteGeneroModal.closeModal();
  };

  const handleAddArtista = async () => {
    const nome = novoArtista.trim();
    if (!nome) return;
    await createArtista({ nome, generoId: '' });
    setNovoArtista('');
  };

  const handleConfirmarApagarArtista = async () => {
    if (!artistaParaApagar) return;
    await deleteArtista(artistaParaApagar.id); // TODO: API
    setArtistaParaApagar(null);
    deleteArtistaModal.closeModal();
  };

  const produtos = useMemo<ProdutoDisplay[]>(
    () =>
      discosComArtista.map((disco, index) => ({
        id: disco.id,
        artistaId: disco.artistaId,
        codigo: gerarCodigo(index),
        titulo: disco.album,
        artista: disco.artistaNome,
        genero: disco.generoNome,
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
        preco: disco.valorMercado,
        status: disco.status || 'Disponível',
      })),
    [discosComArtista]
  );

  const produtosFiltrados = produtos.filter((p) => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    return (
      p.titulo.toLowerCase().includes(termo) ||
      p.artista.toLowerCase().includes(termo) ||
      p.codigo.toLowerCase().includes(termo)
    );
  });

  const iconPlus = (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Estoque – Produtos" />

      <div className="grid gap-4">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 via-white to-brand-25 dark:border-gray-700 dark:from-brand-950/50 dark:via-gray-900 dark:to-brand-900/30">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-brand-900 dark:text-brand-50">
                Meu Estoque
              </h3>
              <p className="mt-1 text-sm text-brand-700/70 dark:text-brand-200/60">
                {produtosFiltrados.length} disco(s) disponível(is)
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Buscar album, artista ou codigo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
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
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Nome Artista</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Gênero</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Nacionalidade</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Prensagem</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Encarte</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Gravadora</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Ano Lanç.</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Ano Prens.</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Cond. Capa</th>
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Cond. Disco</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Valor Mercado</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Custo</th>
                  <th className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">
                          {loading ? '⏳ Carregando estoque...' : '📭 Nenhum disco encontrado'}
                        </p>
                        {!loading && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Clique em &quot;Adicionar Disco&quot; para começar
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((produto) => (
                    <tr
                      key={produto.id}
                      className="transition-all duration-200 hover:bg-brand-50/50 dark:hover:bg-brand-900/20"
                    >
                      <td className="px-4 py-4 font-mono text-xs font-medium text-gray-600 dark:text-gray-400">
                        {produto.codigo}
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                        {produto.titulo}
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {produto.artista}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {produto.genero || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {produto.nacionalidade || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {produto.premsagem || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {produto.encarte || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {produto.gravadora || '—'}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {produto.anoLancamento || '—'}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        {produto.anoPremsagem || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {produto.condicaoCapa || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {produto.condicaoDisco || '—'}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-brand-700 dark:text-brand-400">
                        R$ {produto.valorMercado.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        R$ {produto.custoDisco.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            aria-label={`Editar disco ${produto.titulo}`}
                            title={`Editar disco ${produto.titulo}`}
                            onClick={() => setEditDiscoId(produto.id)}
                            className="bg-brand-500 hover:bg-brand-600 inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                          >
                            <Pencil size={15} strokeWidth={2.25} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Apagar disco ${produto.titulo}`}
                            title={`Apagar disco ${produto.titulo}`}
                            onClick={() => {
                              setDiscoParaApagar({ id: produto.id, titulo: produto.titulo });
                              deleteDiscoModal.openModal();
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

          {produtosFiltrados.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total em estoque:{' '}
                  <span className="font-semibold text-brand-700 dark:text-brand-400">
                    {produtosFiltrados.length} disco(s)
                  </span>
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Valor total:{' '}
                  <span className="font-semibold text-brand-700 dark:text-brand-400">
                    R$ {produtosFiltrados.reduce((sum, p) => sum + p.preco, 0).toFixed(2)}
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
        className={`m-4 ${addOption === 'disco' ? 'max-w-[1000px]' : 'max-w-[560px]'}`}
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
                  onClick={() => setAddOption('genero')}
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
                  onClick={() => setAddOption('artista')}
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
                  onClick={() => setAddOption('disco')}
                  className="group flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20"
                >
                  <span className="rounded-lg bg-brand-100 p-2 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth={2} />
                      <circle cx="12" cy="12" r="3" strokeWidth={2} />
                    </svg>
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">Adicionar Disco</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Cadastre um novo disco no estoque.</span>
                </button>
              </div>
            </>
          )}

          {addOption === 'genero' && (
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
                    value={novoGenero}
                    onChange={(e) => setNovoGenero(e.target.value)}
                    placeholder="Ex: MPB, Reggae, Samba..."
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddGenero();
                    }}
                    autoFocus
                  />
                </div>

                {generosMusicais.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Gêneros já cadastrados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {generosMusicais.map((genero) => (
                        <div
                          key={genero.generoMusicalId}
                          className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
                        >
                          <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                            {genero.nomeGenero}
                          </span>
                          <button
                            type="button"
                            aria-label={`Excluir gênero ${genero.nomeGenero}`}
                            title={`Excluir gênero ${genero.nomeGenero}`}
                            onClick={() => {
                              if (genero.generoMusicalId === undefined) return;
                              setGeneroParaApagar({
                                generoMusicalId: genero.generoMusicalId,
                                nomeGenero: genero.nomeGenero ?? '',
                              });
                              deleteGeneroModal.openModal();
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
                  <Button size="sm" variant="primary" onClick={handleAddGenero}>
                    Salvar
                  </Button>
                </div>
              </div>
            </>
          )}

          {addOption === 'artista' && (
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
                    value={novoArtista}
                    onChange={(e) => setNovoArtista(e.target.value)}
                    placeholder="Ex: The Beatles, Caetano Veloso..."
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddArtista();
                    }}
                    autoFocus
                  />
                </div>

                {artistas.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Artistas já cadastrados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {artistas.map((artista) => (
                        <div
                          key={artista.id}
                          className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
                        >
                          <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                            {artista.nome}
                          </span>
                          <button
                            type="button"
                            aria-label={`Excluir artista ${artista.nome}`}
                            title={`Excluir artista ${artista.nome}`}
                            onClick={() => {
                              setArtistaParaApagar({ id: artista.id, nome: artista.nome });
                              deleteArtistaModal.openModal();
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
                  <Button size="sm" variant="primary" onClick={handleAddArtista}>
                    Salvar
                  </Button>
                </div>
              </div>
            </>
          )}

          {addOption === 'disco' && (
            <>
              <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Adicionar Disco
              </h4>
              <div className="max-h-[70vh] overflow-y-auto pr-1">
                <AddDiscoForm embedded onSuccess={closeAddModal} />
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={deleteArtistaModal.isOpen}
        onClose={deleteArtistaModal.closeModal}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Excluir artista
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja excluir esse artista{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {artistaParaApagar?.nome}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteArtistaModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarApagarArtista}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>

      <EditDiscoModal
        isOpen={editDiscoId !== null}
        onClose={() => setEditDiscoId(null)}
        discoId={editDiscoId}
      />

      <Modal
        isOpen={deleteDiscoModal.isOpen}
        onClose={deleteDiscoModal.closeModal}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar disco
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar o disco{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {discoParaApagar?.titulo}
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteDiscoModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarApagarDisco}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteGeneroModal.isOpen}
        onClose={deleteGeneroModal.closeModal}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Excluir gênero musical
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja excluir esse gênero{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {generoParaApagar?.nomeGenero}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteGeneroModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarApagarGenero}
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
