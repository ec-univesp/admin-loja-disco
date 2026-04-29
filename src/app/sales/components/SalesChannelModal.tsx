'use client';

import React from 'react';
import { Modal } from '@/shared/components/ui/modal';
import CanalVendaForm from './CanalVendaForm';

interface CanalVendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (id: number) => void;
}

export default function CanalVendaModal({ isOpen, onClose, onCreated }: CanalVendaModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[520px]">
      <div className="p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Cadastrar Canal de Venda
        </h4>
        <CanalVendaForm onClose={onClose} onCreated={onCreated} />
      </div>
    </Modal>
  );
}
