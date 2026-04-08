'use client';

import { useState } from 'react';
import SalesForm from '@/components/form/SalesForm';
import ComponentCard from '@/components/common/ComponentCard';

interface SalesFormData {
  productName: string;
  clientName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: string;
  status: string;
  notes: string;
  receipt?: FileList;
}

export default function SalesFormExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormSubmit = async (data: SalesFormData) => {
    setIsLoading(true);
    try {
      // Simular envio para a API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Dados do formulário:', data);

      // Exibir mensagem de sucesso
      setSuccessMessage('Venda registrada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Aqui você pode fazer a chamada para a API
      // const response = await fetch('/api/vendas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentCard title="Registrar Nova Venda">
      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-900 dark:text-green-200">
            ✓ {successMessage}
          </p>
        </div>
      )}

      <SalesForm onSubmit={handleFormSubmit} isLoading={isLoading} />
    </ComponentCard>
  );
}
