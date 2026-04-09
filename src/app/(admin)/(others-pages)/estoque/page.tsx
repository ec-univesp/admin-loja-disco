'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { useDiscos, useGenerosDisco } from '@/hooks/useStore';

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
  Disponível: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Baixo Estoque': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Esgotado: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

// Função para gerar código do disco
const gerarCodigo = (index: number): string => {
  return `DISC-${String(index + 1).padStart(4, '0')}`;
};

// Função para determinar status baseado na condição
const determinarStatus = (condicaoCapa: string, condicaoDisco: string): 'Disponível' | 'Baixo Estoque' | 'Esgotado' => {
  // Se ambas as condições são boas/excelentes = Disponível
  if ((condicaoCapa === 'Excelente' || condicaoCapa === 'Bom') &&
      (condicaoDisco === 'Excelente' || condicaoDisco === 'Bom')) {
    return 'Disponível';
  }
  // Se uma está ruim = Baixo Estoque
  if (condicaoCapa === 'Razoável' || condicaoDisco === 'Razoável') {
    return 'Baixo Estoque';
  }
  // Se está muito ruim = Esgotado
  return 'Esgotado';
};

export default function EstoquePage() {
  const { discosComArtista, loading, error, deleteDisco } = useDiscos();
  const [busca, setBusca] = useState('');

  // Mapear discos para formato de produto para exibição
  const produtos = useMemo<ProdutoDisplay[]>(
    () =>
      discosComArtista.map((disco, index) => ({
        id: disco.id,
        codigo: gerarCodigo(index),
        titulo: disco.album,
        artista: disco.artistaNome,
        premsagem: disco.premsagem,
        quantidade: 1, // Quantidade em estoque (sempre 1 por disco)
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Estoque – Produtos" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        {/* Header */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Produtos em Estoque
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {produtosFiltrados.length} produto(s) encontrado(s)
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Link
              href="/estoque/add-produto"
              className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              + Adicionar Produto
            </Link>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Código
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Título
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Artista
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Prensagem
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                  Preço
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((produto) => (
                  <tr
                    key={produto.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/2"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {produto.codigo}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                      {produto.titulo}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {produto.artista}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{produto.genero}</td>
                    <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                      {produto.quantidade}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                      R$ {produto.preco.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[produto.status]}`}
                      >
                        {produto.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="Editar"
                          className="hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded p-1 text-gray-400 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          title="Remover"
                          onClick={() => handleRemover(produto.id)}
                          className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            Total em estoque:{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {produtosFiltrados.reduce((acc, p) => acc + p.quantidade, 0)} unidades
            </span>{' '}
            · Valor total:{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              R$ {produtosFiltrados.reduce((acc, p) => acc + p.quantidade * p.preco, 0).toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
