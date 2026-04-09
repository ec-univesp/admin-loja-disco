import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import DiscosDemo from '@/components/store/DiscosDemo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zustand Store Demo | Admin Loja de Disco',
  description: 'Demonstração do Zustand com localStorage',
};

export default function StoreDemo() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Zustand Store Demo" />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12 dark:border-gray-800 dark:bg-white/[0.03]">
        <DiscosDemo />
      </div>
    </div>
  );
}
