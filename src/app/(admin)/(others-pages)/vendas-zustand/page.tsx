import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import VendasStoreExample from '@/components/store/VendasStoreExample';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendas com Zustand | Admin Loja de Disco',
  description: 'Gerenciar vendas com Zustand e localStorage',
};

export default function VendasZustandPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Vendas com Zustand" />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12 dark:border-gray-800 dark:bg-white/[0.03]">
        <VendasStoreExample />
      </div>
    </div>
  );
}
