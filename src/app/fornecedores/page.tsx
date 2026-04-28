'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Users } from 'lucide-react';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import Button from '@/shared/components/ui/button/Button';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { useFornecedores } from '@/shared/store/useStore';
import FornecedorModal from '@/features/compras/components/FornecedorModal';

const iconPlus = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const WhatsappIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const apenasDigitos = (texto: string) => texto.replace(/\D/g, '');

const montarLinkWhatsapp = (contato: string): string | null => {
  const numero = apenasDigitos(contato);
  if (!numero) return null;
  const numeroComDdi = numero.length <= 11 ? `55${numero}` : numero;
  return `https://wa.me/${numeroComDdi}`;
};

export default function FornecedoresPage() {
  return (
    <Suspense fallback={null}>
      <FornecedoresContent />
    </Suspense>
  );
}

function FornecedoresContent() {
  const { fornecedores, fetchFornecedores, deleteFornecedor } = useFornecedores();

  const [busca, setBusca] = useState('');
  const [showFornecedorModal, setShowFornecedorModal] = useState(false);
  const [fornecedorIdParaEditar, setFornecedorIdParaEditar] = useState<string | undefined>();

  const deleteFornecedorModal = useModal();
  const [fornecedorParaApagar, setFornecedorParaApagar] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  const handleConfirmarApagar = async () => {
    if (!fornecedorParaApagar) return;
    await deleteFornecedor(fornecedorParaApagar.id);
    setFornecedorParaApagar(null);
    deleteFornecedorModal.closeModal();
  };

  const abrirNovoFornecedor = () => {
    setFornecedorIdParaEditar(undefined);
    setShowFornecedorModal(true);
  };

  const abrirEdicaoFornecedor = (id: string) => {
    setFornecedorIdParaEditar(id);
    setShowFornecedorModal(true);
  };

  const buscaNormalizada = busca.toLowerCase();
  const fornecedoresFiltrados = useMemo(
    () =>
      fornecedores.filter(
        (f) =>
          f.nome.toLowerCase().includes(buscaNormalizada) ||
          (f.responsavel ?? '').toLowerCase().includes(buscaNormalizada) ||
          (f.contato ?? '').toLowerCase().includes(buscaNormalizada)
      ),
    [fornecedores, buscaNormalizada]
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Fornecedores" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Fornecedores
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {fornecedoresFiltrados.length} fornecedor(es) cadastrado(s)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por nome, responsável ou contato..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="focus:border-brand-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none sm:w-72 md:w-80 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Button size="md" variant="primary" startIcon={iconPlus} onClick={abrirNovoFornecedor}>
              Novo Fornecedor
            </Button>
          </div>
        </div>

        {fornecedoresFiltrados.length === 0 && busca === '' ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
            <Users size={40} className="text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum fornecedor cadastrado ainda.
            </p>
            <Button size="sm" variant="primary" startIcon={iconPlus} onClick={abrirNovoFornecedor}>
              Cadastrar primeiro fornecedor
            </Button>
          </div>
        ) : fornecedoresFiltrados.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
            Nenhum fornecedor encontrado para &ldquo;{busca}&rdquo;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                    WhatsApp
                  </th>
                  <th className="w-24 px-6 py-3" aria-hidden="true" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {fornecedoresFiltrados.map((fornecedor) => {
                  const linkWhatsapp = montarLinkWhatsapp(fornecedor.contato ?? '');
                  return (
                    <tr
                      key={fornecedor.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                        {fornecedor.nome}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {fornecedor.responsavel || '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {fornecedor.contato ? (
                          <a
                            href={`tel:${apenasDigitos(fornecedor.contato)}`}
                            className="hover:text-brand-600 dark:hover:text-brand-400 underline underline-offset-2"
                          >
                            {fornecedor.contato}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {fornecedor.endereco || '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {linkWhatsapp ? (
                          <a
                            href={linkWhatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Chamar ${fornecedor.nome} no WhatsApp`}
                            title={`Chamar ${fornecedor.nome} no WhatsApp`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#25D366] text-white shadow-sm transition-colors hover:bg-[#1ebe57]"
                          >
                            <WhatsappIcon size={16} />
                          </a>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            aria-label={`Editar fornecedor ${fornecedor.nome}`}
                            title={`Editar fornecedor ${fornecedor.nome}`}
                            onClick={() => abrirEdicaoFornecedor(fornecedor.id)}
                            className="bg-brand-500 hover:bg-brand-600 inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                          >
                            <Pencil size={15} strokeWidth={2.25} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Apagar fornecedor ${fornecedor.nome}`}
                            title={`Apagar fornecedor ${fornecedor.nome}`}
                            onClick={() => {
                              setFornecedorParaApagar({ id: fornecedor.id, nome: fornecedor.nome });
                              deleteFornecedorModal.openModal();
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                          >
                            <Trash2 size={15} strokeWidth={2.25} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FornecedorModal
        isOpen={showFornecedorModal}
        onClose={() => setShowFornecedorModal(false)}
        fornecedorIdInicial={fornecedorIdParaEditar}
      />

      <Modal
        isOpen={deleteFornecedorModal.isOpen}
        onClose={deleteFornecedorModal.closeModal}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar fornecedor
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar o fornecedor{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {fornecedorParaApagar?.nome}
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteFornecedorModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarApagar}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>

      <div className="mt-4 text-right">
        <Link
          href="/compras"
          className="text-sm text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          Ver compras registradas →
        </Link>
      </div>
    </div>
  );
}
