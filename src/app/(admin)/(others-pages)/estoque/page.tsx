'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import React, { useState, useMemo, useEffect } from 'react';
import { useDiscos, useGenerosMusical } from '@/hooks/useStore';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';

interface ProdutoDisplay {
  id: string;
  codigo: string;
  titulo: string;
  artista: string;
  premsagem: string;
  quantidade: number;
  preco: number;
  status: 'Disponível' | 'Baixo Estoque' | 'Esgotado';
}

const statusColor: Record<string, string> = {
  Disponível: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  'Baixo Estoque': 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  Esgotado: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
};

const gerarCodigo = (index: number): string => {
  return `DISC-${String(index + 1).padStart(4, '0')}`;
};

const determinarStatus = (condicaoCapa: string, condicaoDisco: string): 'Disponível' | 'Baixo Estoque' | 'Esgotado' => {
  if ((condicaoCapa === 'Excelente' || condicaoCapa === 'Bom') &&
      (condicaoDisco === 'Excelente' || condicaoDisco === 'Bom')) {
    return 'Disponível';
  }
  if (condicaoCapa === 'Razoável' || condicaoDisco === 'Razoável') {
    return 'Baixo Estoque';
  }
  return 'Esgotado';
};

export default function EstoquePage() {
  const { discosComArtista, loading, deleteDisco } = useDiscos();
  const { generosMusical, fetchGenerosMusical, createGeneroMusical } = useGenerosMusical();
  const [busca, setBusca] = useState('');
  const [novoGenero, setNovoGenero] = useState('');
  const generoModal = useModal();

  useEffect(() => {
    fetchGenerosMusical();
  }, [fetchGenerosMusical]);

  const handleAddGenero = async () => {
    const nome = novoGenero.trim();
    if (!nome) return;
    await createGeneroMusical({ nome });
    setNovoGenero('');
    generoModal.closeModal();
  };

  const produtos = useMemo<ProdutoDisplay[]>(
    () =>
      discosComArtista.map((disco, index) => ({
        id: disco.id,
        codigo: gerarCodigo(index),
        titulo: disco.album,
        artista: disco.artistaNome,
        premsagem: disco.premsagem,
        quantidade: 1,
        preco: disco.valorMercado,
        status: determinarStatus(disco.condicaoCapa, disco.condicaoDisco),
      })),
    [discosComArtista]
  );

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      p.artista.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busca.toLowerCase())
  );

  const handleRemover = (id: string) => {
    deleteDisco(id);
  };

  const iconPlus = (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const iconEdit = (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const iconDelete = (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                placeholder="🔍 Buscar álbum, artista ou código..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="focus:border-brand-700 focus:ring-brand-600/20 rounded-lg border border-brand-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all dark:border-brand-700/40 dark:bg-gray-800/50 dark:text-gray-200 dark:focus:border-brand-600"
              />
              <Button
                size="md"
                variant="outline"
                startIcon={iconPlus}
                onClick={generoModal.openModal}
              >
                Gênero Musical
              </Button>
              <Link href="/estoque/add-produto" className="inline-block">
                <Button size="md" variant="primary" startIcon={iconPlus}>
                  Adicionar Disco
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Álbum
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Artista
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Prensagem
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
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
                      <td className="px-6 py-4 font-mono text-xs font-medium text-gray-600 dark:text-gray-400">
                        {produto.codigo}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {produto.titulo}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {produto.artista}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {produto.premsagem}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-brand-700 dark:text-brand-400">
                        R$ {produto.preco.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor[produto.status]}`}
                        >
                          {produto.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="Editar"
                            className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-brand-100 hover:text-brand-700 dark:hover:bg-brand-900/30 dark:hover:text-brand-400"
                          >
                            {iconEdit}
                          </button>
                          <button
                            title="Remover"
                            onClick={() => handleRemover(produto.id)}
                            className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-error-100 hover:text-error-700 dark:hover:bg-error-900/30 dark:hover:text-error-400"
                          >
                            {iconDelete}
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
        isOpen={generoModal.isOpen}
        onClose={generoModal.closeModal}
        className="m-4 max-w-[500px]"
      >
        <div className="p-6">
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

            {generosMusical.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Gêneros já cadastrados:
                </p>
                <div className="flex flex-wrap gap-2">
                  {generosMusical.map((genero) => (
                    <span
                      key={genero.id}
                      className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                    >
                      {genero.nome}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={generoModal.closeModal}>
                Cancelar
              </Button>
              <Button size="sm" variant="primary" onClick={handleAddGenero}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
