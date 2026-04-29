'use client';

import React from 'react';
import { Modal } from '@/shared/components/ui/modal';
import CustomerAddressForm from './CustomerAddressForm';

interface CustomerAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: number;
  onSaved?: (customerId: number, addressId: number | null) => void;
}

export default function CustomerAddressModal({
  isOpen,
  onClose,
  customerId,
  onSaved,
}: CustomerAddressModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-[640px]">
      <div className="p-6">
        <CustomerAddressForm
          key={customerId ?? 'novo'}
          onClose={onClose}
          customerId={customerId}
          onSaved={onSaved}
        />
      </div>
    </Modal>
  );
}
