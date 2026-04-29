'use client';

import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import AddDiscoForm from '@/app/inventory/components/AddRecordForm';

export default function AddRecordPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Add Record" />
      <div className="grid gap-6">
        <AddDiscoForm />
      </div>
    </>
  );
}

