'use client';

import React from 'react';
import { Modal } from '@/shared/components/ui/modal';
import CustomerAddressForm from './CustomerAddressForm';

interface CustomerAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId?: number;
  onSaved?: (clienteId: number, enderecoId: number | null) => void;
}

export default function CustomerAddressModal({
  isOpen,
  onClose,
  clienteId,
  onSaved,
}: CustomerAddressModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[640px]">
      <div className="p-6">
        <CustomerAddressForm
          key={clienteId ?? 'novo'}
          onClose={onClose}
          clienteId={clienteId}
          onSaved={onSaved}
        />
      </div>
    </Modal>
  );
}
