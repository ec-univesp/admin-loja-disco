'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import AddDiscoForm from '@/components/products/AddDiscoForm';

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

