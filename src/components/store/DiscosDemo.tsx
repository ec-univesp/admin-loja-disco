'use client';

import { useEffect } from 'react';
import { useDiscos } from '@/hooks/useStore';
import ComponentCard from '@/components/common/ComponentCard';

export default function DiscosDemo() {
  const { discosComArtista, fetchDiscos, loading, error } = useDiscos();

  useEffect(() => {
    fetchDiscos();
  }, [fetchDiscos]);

  return (
    <ComponentCard title="Demonstração: Discos com Zustand">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
          <p className="text-sm text-red-900 dark:text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Total de Discos: {discosComArtista.length}
            </h3>
          </div>

          <div className="space-y-3">
            {discosComArtista.map((disco) => (
              <div
                key={disco.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Artista
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {disco.artistaNome}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Álbum
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {disco.album}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Gravadora
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {disco.gravadora}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Valor de Mercado
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      R$ {disco.valorMercado.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ano de Lançamento
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {disco.anoLancamento}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </p>
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
                      {disco.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {discosComArtista.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum disco encontrado
              </p>
            </div>
          )}
        </div>
      )}
    </ComponentCard>
  );
}
