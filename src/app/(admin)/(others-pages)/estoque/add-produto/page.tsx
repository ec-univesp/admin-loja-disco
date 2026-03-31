"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ProdutoForm {
  codigo: string;
  titulo: string;
  artista: string;
  genero: string;
  quantidade: string;
  preco: string;
  descricao: string;
  formato: string;
  ano: string;
  gravadora: string;
}

const generos = ["Rock", "Pop", "Jazz", "Blues", "Samba", "MPB", "Eletrônico", "Hip-Hop", "Clássico", "Country", "Reggae", "Metal", "Grunge", "Rock Progressivo", "Outro"];
const formatos = ["LP (12\")", "EP (10\")", "Single (7\")", "CD", "Compacto"];

export default function AddProdutoPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProdutoForm>({
    codigo: "",
    titulo: "",
    artista: "",
    genero: "",
    quantidade: "",
    preco: "",
    descricao: "",
    formato: "",
    ano: "",
    gravadora: "",
  });
  const [errors, setErrors] = useState<Partial<ProdutoForm>>({});
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<ProdutoForm> = {};
    if (!form.codigo) newErrors.codigo = "Código é obrigatório";
    if (!form.titulo) newErrors.titulo = "Título é obrigatório";
    if (!form.artista) newErrors.artista = "Artista é obrigatório";
    if (!form.genero) newErrors.genero = "Gênero é obrigatório";
    if (!form.formato) newErrors.formato = "Formato é obrigatório";
    if (!form.quantidade || isNaN(Number(form.quantidade)) || Number(form.quantidade) < 0)
      newErrors.quantidade = "Quantidade inválida";
    if (!form.preco || isNaN(Number(form.preco)) || Number(form.preco) <= 0)
      newErrors.preco = "Preço inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSucesso(true);
    setTimeout(() => {
      router.push("/estoque");
    }, 1500);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Adicionar Produto" />

      {sucesso && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-5 py-4 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
          ✅ Produto cadastrado com sucesso! Redirecionando...
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Dados do Produto
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Código */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Código <span className="text-red-500">*</span>
            </label>
            <input
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              placeholder="Ex: LP-009"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors dark:bg-gray-800 dark:text-white ${
                errors.codigo
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500 dark:border-gray-700"
              }`}
            />
            {errors.codigo && <p className="mt-1 text-xs text-red-500">{errors.codigo}</p>}
          </div>

          {/* Formato */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Formato <span className="text-red-500">*</span>
            </label>
            <select
              name="formato"
              value={form.formato}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors dark:bg-gray-800 dark:text-white ${
                errors.formato
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500 dark:border-gray-700"
              }`}
            >
              <option value="">Selecione...</option>
              {formatos.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {errors.formato && <p className="mt-1 text-xs text-red-500">{errors.formato}</p>}
          </div>

          {/* Título */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título do Álbum <span className="text-red-500">*</span>
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ex: Abbey Road"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors dark:bg-gray-800 dark:text-white ${
                errors.titulo
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500 dark:border-gray-700"
              }`}
            />
            {errors.titulo && <p className="mt-1 text-xs text-red-500">{errors.titulo}</p>}
          </div>

          {/* Artista */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Artista / Banda <span className="text-red-500">*</span>
            </label>
            <input
              name="artista"
              value={form.artista}
              onChange={handleChange}
              placeholder="Ex: The Beatles"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors dark:bg-gray-800 dark:text-white ${
                errors.artista
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500 dark:border-gray-700"
              }`}
            />
            {errors.artista && <p className="mt-1 text-xs text-red-500">{errors.artista}</p>}
          </div>

          {/* Gênero */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gênero Musical <span className="text-red-500">*</span>
            </label>
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors dark:bg-gray-800 dark:text-white ${
                errors.genero
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500 dark:border-gray-700"
              }`}
            >
              <option value="">Selecione...</option>
              {generos.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.genero && <p className="mt-1 text-xs text-red-500">{errors.genero}</p>}
          </div>

          {/* Gravadora */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gravadora
            </label>
            <input
              name="gravadora"
              value={form.gravadora}
              onChange={handleChange}
              placeholder="Ex: Apple Records"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Ano */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ano de Lançamento
            </label>
            <input
              name="ano"
              value={form.ano}
              onChange={handleChange}
              placeholder="Ex: 1969"
              type="number"
              min="1900"
              max="2026"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Quantidade */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantidade em Estoque <span className="text-red-500">*</span>
            </label>
            <input
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="Ex: 10"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors dark:bg-gray-800 dark:text-white ${
                errors.quantidade
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500 dark:border-gray-700"
              }`}
            />
            {errors.quantidade && <p className="mt-1 text-xs text-red-500">{errors.quantidade}</p>}
          </div>

          {/* Preço */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço de Venda (R$) <span className="text-red-500">*</span>
            </label>
            <input
              name="preco"
              value={form.preco}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex: 89.90"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors dark:bg-gray-800 dark:text-white ${
                errors.preco
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500 dark:border-gray-700"
              }`}
            />
            {errors.preco && <p className="mt-1 text-xs text-red-500">{errors.preco}</p>}
          </div>

          {/* Descrição */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição / Observações
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
              placeholder="Informações adicionais sobre o produto..."
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
            >
              Salvar Produto
            </button>
            <button
              type="button"
              onClick={() => router.push("/estoque")}
              className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

