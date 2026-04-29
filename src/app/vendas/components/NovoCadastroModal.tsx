'use client';

import React, { useState } from 'react';
import { Modal } from '@/shared/components/ui/modal';
import CanalVendaForm from './CanalVendaForm';
import ClienteEnderecoForm from './ClienteEnderecoForm';
import SalesForm from './SalesForm';

type View = 'select' | 'cliente' | 'canal' | 'venda';

interface NovoCadastroModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: View;
}

const iconCliente = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 14a4 4 0 10-8 0M12 11a3 3 0 100-6 3 3 0 000 6zM4 20c1.5-3 4.5-4 8-4s6.5 1 8 4"
    />
  </svg>
);

const iconCanal = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h12" />
  </svg>
);

const iconVenda = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h2l2 12h12l2-8H6M9 21a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z"
    />
  </svg>
);

const iconChevron = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const iconBack = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export default function NovoCadastroModal({
  isOpen,
  onClose,
  initialView = 'select',
}: NovoCadastroModalProps) {
  const [view, setView] = useState<View>(initialView);

  const handleClose = () => {
    setView(initialView);
    onClose();
  };

  const titulo =
    view === 'cliente'
      ? 'Cadastrar Novo Cliente'
      : view === 'canal'
        ? 'Cadastrar Canal de Venda'
        : view === 'venda'
          ? 'Registrar Nova Venda'
          : 'O que você quer criar?';

  const maxWidth =
    view === 'venda'
      ? 'max-w-3xl'
      : view === 'cliente'
        ? 'max-w-[640px]'
        : view === 'canal'
          ? 'max-w-[520px]'
          : 'max-w-[720px]';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={`m-4 ${maxWidth}`}>
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-6 py-4 pr-16 dark:border-gray-800">
          {view !== 'select' && (
            <button
              type="button"
              onClick={() => setView('select')}
              className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors dark:border-gray-700 dark:text-gray-300"
            >
              {iconBack}
              Voltar
            </button>
          )}
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">{titulo}</h4>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {view === 'select' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escolha o que deseja criar.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setView('venda')}
                  className="hover:border-brand-500 hover:bg-brand-50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20 group flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-left transition-colors dark:border-gray-700"
                >
                  <span className="bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    {iconVenda}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                        Nova Venda
                      </h5>
                      <span className="group-hover:text-brand-500 text-gray-400">
                        {iconChevron}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Registrar uma nova venda completa com itens e cliente.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setView('cliente')}
                  className="hover:border-brand-500 hover:bg-brand-50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20 group flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-left transition-colors dark:border-gray-700"
                >
                  <span className="bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    {iconCliente}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                        Cliente
                      </h5>
                      <span className="group-hover:text-brand-500 text-gray-400">
                        {iconChevron}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Cadastre um novo cliente com endereço completo.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setView('canal')}
                  className="hover:border-brand-500 hover:bg-brand-50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20 group flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-left transition-colors dark:border-gray-700"
                >
                  <span className="bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    {iconCanal}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                        Canal de Venda
                      </h5>
                      <span className="group-hover:text-brand-500 text-gray-400">
                        {iconChevron}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Adicione um canal (Mercado Livre, Shopee, Loja Física…).
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {view === 'cliente' && <ClienteEnderecoForm onClose={handleClose} showTitle={false} />}

          {view === 'canal' && <CanalVendaForm onClose={handleClose} />}

          {view === 'venda' && <SalesForm onSuccess={handleClose} />}
        </div>
      </div>
    </Modal>
  );
}
