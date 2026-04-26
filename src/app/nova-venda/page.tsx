import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import SalesFormZustand from '@/components/form/SalesFormZustand';
import ComponentCard from '@/shared/components/layout/ComponentCard';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Nova Venda | Admin Loja de Disco',
  description: 'Registrar nova venda na loja de disco',
};

export default function NovaVendaPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Nova Venda" />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12 dark:border-gray-800 dark:bg-white/[0.03]">
        <ComponentCard title="Registrar Nova Venda">
          <SalesFormZustand />
        </ComponentCard>
      </div>
    </div>
  );
}
