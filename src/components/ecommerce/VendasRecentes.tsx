'use client';
import { useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import { useVendas, useItensVenda, useDiscos } from '@/shared/store/useStore';

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  Entregue: 'success',
  Concluída: 'success',
  Pendente: 'warning',
  Cancelada: 'error',
  Confirmada: 'info',
  Enviada: 'info',
};

const formatNumeroVenda = (posicaoNaLista: number): string =>
  `VND-${String(posicaoNaLista + 1).padStart(4, '0')}`;

const LIMITE_VENDAS_RECENTES = 5;

export default function VendasRecentes() {
  const { vendasComDetalhes, fetchVendas } = useVendas();
  const { itensVenda, fetchItensVenda } = useItensVenda();
  const { discos, fetchDiscos } = useDiscos();

  useEffect(() => {
    fetchVendas();
    fetchItensVenda();
    fetchDiscos();
  }, [fetchVendas, fetchItensVenda, fetchDiscos]);

  const linhas = useMemo(() => {
    const vendasOrdenadas = [...vendasComDetalhes].sort((vendaA, vendaB) =>
      vendaA.dataVenda < vendaB.dataVenda ? 1 : -1
    );

    return vendasOrdenadas.slice(0, LIMITE_VENDAS_RECENTES).map((venda, posicao) => {
      const itensDaVenda = itensVenda.filter((item) => item.vendaId === venda.id);
      const primeiroItem = itensDaVenda[0];
      const discoPrincipal = primeiroItem
        ? discos.find((disco) => disco.id === primeiroItem.discoId)
        : undefined;

      return {
        id: venda.id,
        numero: formatNumeroVenda(posicao),
        disco: discoPrincipal?.album || '—',
        quantidade: itensDaVenda.length,
        valor: venda.valorTotal,
        status: venda.statusPedido || 'Pendente',
        cliente: venda.clienteNome,
      };
    });
  }, [vendasComDetalhes, itensVenda, discos]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Vendas Recentes
      </h3>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="min-w-[110px] px-4 py-3">
                Nº Venda
              </TableCell>
              <TableCell isHeader className="min-w-[200px] px-4 py-3">
                Disco
              </TableCell>
              <TableCell isHeader className="min-w-[150px] px-4 py-3">
                Cliente
              </TableCell>
              <TableCell isHeader className="px-4 py-3">
                Qtd.
              </TableCell>
              <TableCell isHeader className="min-w-[120px] px-4 py-3">
                Valor
              </TableCell>
              <TableCell isHeader className="min-w-[120px] px-4 py-3">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {linhas.length === 0 ? (
              <TableRow>
                <TableCell className="px-4 py-6 text-center text-gray-400">
                  Nenhuma venda registrada ainda.
                </TableCell>
              </TableRow>
            ) : (
              linhas.map((linha) => (
                <TableRow key={linha.id}>
                  <TableCell className="px-4 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {linha.numero}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="font-medium text-gray-800 dark:text-white">{linha.disco}</div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-gray-600 dark:text-gray-400">
                    {linha.cliente}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-medium text-gray-800 dark:text-white">
                    {linha.quantidade}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-semibold text-gray-800 dark:text-white">
                    R$ {linha.valor.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <Badge color={statusColor[linha.status] || 'warning'}>{linha.status}</Badge>
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
