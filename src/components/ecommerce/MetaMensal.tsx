"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MetaMensal() {
  const series = [68.5];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Meta Mensal
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Progresso da meta de vendas
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Detalhes
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {series && (
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={330}
          />
        )}

        <div className="flex justify-center mt-5 gap-20">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Meta
            </p>
            <h3 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white">
              R$ 10.000
            </h3>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Alcançado
            </p>
            <h3 className="mt-2 text-xl font-semibold text-brand-500 dark:text-brand-400">
              R$ 6.850
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
