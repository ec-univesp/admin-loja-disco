'use client';

import { StoreMetrics } from '@/app/_dashboard/components/StoreMetrics';
import React from 'react';
import MonthlySalesChart from '@/app/_dashboard/components/MonthlySalesChart';
import RecentSales from '@/app/_dashboard/components/RecentSales';
import Button from '@/shared/components/ui/button/Button';
import { useRouter } from 'next/navigation';

export default function AdminLojaDisco() {
  const router = useRouter();

  const handleNewSale = () => {
    router.push('/sales?novo=1');
  };

  const handleNewPurchase = () => {
    router.push('/purchases?novo=1');
  };

  const handleAddProduct = () => {
    router.push('/inventory/add-record');
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="flex gap-4">
          <Button variant="primary" onClick={handleNewSale}>
            + Nova Venda
          </Button>
          <Button variant="primary" onClick={handleNewPurchase}>
            + Nova Compra
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            + Adicionar Disco
          </Button>
        </div>
      </div>

      <div className="col-span-12 space-y-6">
        <StoreMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12">
        <RecentSales />
      </div>
    </div>
  );
}
