'use client';

import { MetricasLoja } from '@/components/ecommerce/MetricasLoja';
import React from 'react';
import VendasMensaisChart from '@/components/ecommerce/VendasMensaisChart';
import VendasRecentes from '@/components/ecommerce/VendasRecentes';
import Button from '@/shared/components/ui/button/Button';
import { useRouter } from 'next/navigation';

export default function AdminLojaDisco() {
  const router = useRouter();

  const handleNewSale = () => {
    router.push('/nova-venda');
  };

  const handleNewPurchase = () => {
    router.push('/nova-compra');
  };

  const handleAddProduct = () => {
    router.push('/estoque/add-produto');
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
            + Add Produto
          </Button>
        </div>
      </div>

      <div className="col-span-12 space-y-6">
        <MetricasLoja />

        <VendasMensaisChart />
      </div>

      <div className="col-span-12">
        <VendasRecentes />
      </div>
    </div>
  );
}
