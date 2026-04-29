'use client';
import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/shared/components/ui/table';
import Badge from '@/shared/components/ui/badge/Badge';
import { useSalesModel } from '@/app/vendas/model/salesModel';

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  Entregue: 'success',
  Concluída: 'success',
  Pendente: 'warning',
  Cancelada: 'error',
  Confirmada: 'info',
  Enviada: 'info',
};

const formatSaleNumber = (index: number): string =>
  `VND-${String(index + 1).padStart(4, '0')}`;

const RECENT_SALES_LIMIT = 5;

export default function VendasRecentes() {
  const { list } = useSalesModel();
  const sales = list.data ?? [];

  const rows = useMemo(() => {
    const sortedSales = [...sales].sort((a, b) =>
      (a.dataVenda ?? '') < (b.dataVenda ?? '') ? 1 : -1
    );

    return sortedSales.slice(0, RECENT_SALES_LIMIT).map((sale, index) => {
      const firstItem = sale.itens?.[0];
      return {
        id: sale.vendaId ?? index,
        numero: formatSaleNumber(index),
        disco: firstItem?.nomeDisco ?? '—',
        quantidade: sale.itens?.length ?? 0,
        valor: sale.valorTotal ?? 0,
        status: sale.statusPedido ?? 'Pendente',
        cliente: sale.cliente?.nomeCliente ?? '',
      };
    });
  }, [sales]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Vendas Recentes
      </h3>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className="min-w-[110px] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Nº Venda
              </TableCell>
              <TableCell
                isHeader
                className="min-w-[200px] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Disco
              </TableCell>
              <TableCell
                isHeader
                className="min-w-[150px] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Cliente
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Qtd.
              </TableCell>
              <TableCell
                isHeader
                className="min-w-[120px] px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Valor
              </TableCell>
              <TableCell
                isHeader
                className="min-w-[120px] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell className="px-4 py-6 text-center text-gray-400">
                  Nenhuma venda registrada ainda.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="px-4 py-4 text-left font-mono text-xs text-gray-500 dark:text-gray-400">
                    {row.numero}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-left">
                    <div className="font-medium text-gray-800 dark:text-white">{row.disco}</div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-left text-gray-600 dark:text-gray-400">
                    {row.cliente}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center font-medium text-gray-800 dark:text-white">
                    {row.quantidade}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right font-semibold text-gray-800 dark:text-white">
                    R$ {row.valor.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <Badge color={statusColor[row.status] || 'warning'}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
