'use client';
import React from 'react';
import Badge from '../ui/badge/Badge';
import { ArrowUpIcon, BoxIconLine, GroupIcon } from '@/icons';

export const MetricasLoja = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Clientes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Clientes</span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">1,284</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            8.2%
          </Badge>
        </div>
      </div>

      {/* Discos Vendidos */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Discos Vendidos</span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">3,847</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            12.5%
          </Badge>
        </div>
      </div>
    </div>
  );
};
