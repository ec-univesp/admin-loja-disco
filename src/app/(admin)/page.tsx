"use client";

import { MetricasLoja } from "@/components/ecommerce/MetricasLoja";
import React from "react";
import MetaMensal from "@/components/ecommerce/MetaMensal";
import VendasMensaisChart from "@/components/ecommerce/VendasMensaisChart";
import VendasRecentes from "@/components/ecommerce/VendasRecentes";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

export default function AdminLojaDisco() {
  const router = useRouter();

  const handleNewSale = () => {
    router.push("/nova-venda");
  };

  const handleNewPurchase = () => {
    router.push("/nova-compra");
  };

  const handleAddProduct = () => {
    router.push("/estoque/add-produto");
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

      <div className="col-span-12 space-y-6 xl:col-span-7">
        <MetricasLoja />

        <VendasMensaisChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MetaMensal />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <VendasRecentes />
      </div>
    </div>
  );
}
