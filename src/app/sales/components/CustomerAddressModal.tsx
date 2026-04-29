'use client';

import React from 'react';
import { Modal } from '@/shared/components/ui/modal';
import ClienteEnderecoForm from './ClienteEnderecoForm';

interface ClienteEnderecoModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Se passado, abre em modo edição */
  clienteId?: number;
  /** Callback chamado quando salva, com clienteId e enderecoId resultantes */
  onSaved?: (clienteId: number, enderecoId: number | null) => void;
}

export default function ClienteEnderecoModal({
  isOpen,
  onClose,
  clienteId,
  onSaved,
}: ClienteEnderecoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[640px]">
      <div className="p-6">
        {/* O título é renderizado pelo próprio form quando showTitle=true (default) */}
        <ClienteEnderecoForm
          key={clienteId ?? 'novo'}
          onClose={onClose}
          clienteId={clienteId}
          onSaved={onSaved}
        />
      </div>
    </Modal>
  );
}
