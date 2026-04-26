'use client';

import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import AddDiscoForm from '@/features/estoque/components/AddDiscoForm';

export default function AddProdutoPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Adicionar Produto" />
      <div className="grid gap-6">
        <AddDiscoForm />
      </div>
    </>
  );
}

