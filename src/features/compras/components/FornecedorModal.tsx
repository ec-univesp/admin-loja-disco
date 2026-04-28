'use client';

import React from 'react';
import { Modal } from '@/shared/components/ui/modal';
import FornecedorForm from './FornecedorForm';

interface FornecedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (nome: string) => void;
  fornecedorIdInicial?: string;
}

export default function FornecedorModal({
  isOpen,
  onClose,
  onSaved,
  fornecedorIdInicial,
}: FornecedorModalProps) {
  const editando = Boolean(fornecedorIdInicial);
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[640px]">
      <div className="p-6">
        <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editando ? 'Editar fornecedor' : 'Novo fornecedor'}
        </h4>
        <p className="mb-5 text-xs text-gray-500 dark:text-gray-400">
          {editando
            ? 'Atualize as informações cadastrais e de contato.'
            : 'Preencha as informações para cadastrar um novo fornecedor.'}
        </p>
        <FornecedorForm
          onClose={onClose}
          onSaved={onSaved}
          fornecedorIdInicial={fornecedorIdInicial}
        />
      </div>
    </Modal>
  );
}
