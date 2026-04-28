'use client';

import React from 'react';
import { Modal } from '@/shared/components/ui/modal';
import FornecedorForm from './FornecedorForm';

interface FornecedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (nome: string) => void;
}

export default function FornecedorModal({ isOpen, onClose, onCreated }: FornecedorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[520px]">
      <div className="p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Cadastrar Fornecedor
        </h4>
        <FornecedorForm onClose={onClose} onCreated={onCreated} />
      </div>
    </Modal>
  );
}
