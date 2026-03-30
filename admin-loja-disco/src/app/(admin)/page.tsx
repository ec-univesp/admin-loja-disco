"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

export default function Ecommerce() {
  const router = useRouter();

  const handleNewSale = () => {
    router.push("/nova-venda");
  };

  const handleNewPurchase = () => {
    router.push("/nova-compra");
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
        </div>
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
