'use client';

import React from 'react';
import { Modal } from '@/shared/components/ui/modal';
import PurchaseForm from './PurchaseForm';

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewPurchaseModal({ isOpen, onClose }: NewPurchaseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-3xl">
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-6 py-4 pr-16 dark:border-gray-800">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Nova Compra
          </h4>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <PurchaseForm onSuccess={onClose} />
        </div>
      </div>
    </Modal>
  );
}
