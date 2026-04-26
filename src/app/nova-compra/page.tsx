import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import ComponentCard from '@/shared/components/layout/ComponentCard';
import PurchaseFormZustand from '@/components/form/PurchaseFormZustand';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Nova Compra | Admin Loja de Disco',
  description: 'Registrar nova compra na loja de disco',
};

export default function NovaCompraPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Nova Compra" />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12 dark:border-gray-800 dark:bg-white/[0.03]">
        <ComponentCard title="Registrar Nova Compra">
          <PurchaseFormZustand />
        </ComponentCard>
      </div>
    </div>
  );
}
