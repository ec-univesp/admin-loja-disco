'use client';
import PageBreadcrumb from '@/shared/components/layout/PageBreadCrumb';
import { useSearchParams } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useVendas, useClientes, useItensVenda } from '@/shared/store/useStore';
import { useListaDeCanaisVenda } from '@/shared/queries/canais-venda.queries';
import ClienteEnderecoModal from '@/features/vendas/components/ClienteEnderecoModal';
import NovoCadastroModal from '@/features/vendas/components/NovoCadastroModal';
import { Modal } from '@/shared/components/ui/modal';
import { useModal } from '@/shared/hooks/useModal';
import { exportarTabelaExcel } from '@/shared/services/exportExcel';
import Button from '@/shared/components/ui/button/Button';

const iconPlus = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const statusColor: Record<string, string> = {
  Concluída: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Entregue: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Confirmada: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Enviada: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Pendente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Cancelada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const formatNumeroVenda = (posicaoNaLista: number) =>
  `VND-${String(posicaoNaLista + 1).padStart(4, '0')}`;

const formatarDataBR = (dataIso: string) => {
  if (!dataIso || dataIso.length < 10) return dataIso || '—';
  const [ano, mes, dia] = dataIso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
};

const STATUS_CONCLUIDOS = ['Concluída', 'Entregue'] as const;

export default function VendasPage() {
  return (
    <Suspense fallback={null}>
      <VendasContent />
    </Suspense>
  );
}

function VendasContent() {
  const { vendasComDetalhes, fetchVendas, deleteVenda, updateVenda } = useVendas();
  const { clientes, fetchClientes, deleteCliente } = useClientes();
  const { itensVenda, fetchItensVenda } = useItensVenda();
  const { data: canaisVenda = [] } = useListaDeCanaisVenda();

  const searchParams = useSearchParams();
  const abrirNaVenda = searchParams.get('novo') === '1';

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showNovoCadastroModal, setShowNovoCadastroModal] = useState(() => abrirNaVenda);
  const [editClienteId, setEditClienteId] = useState<string | undefined>();

  const deleteVendaModal = useModal();
  const [vendaParaApagar, setVendaParaApagar] = useState<{ id: string; numero: string } | null>(
    null
  );

  const deleteClienteModal = useModal();
  const [clienteParaApagar, setClienteParaApagar] = useState<{ id: string; nome: string } | null>(
    null
  );

  const handleConfirmarApagarVenda = async () => {
    if (!vendaParaApagar) return;
    await deleteVenda(vendaParaApagar.id);
    setVendaParaApagar(null);
    deleteVendaModal.closeModal();
  };

  const handleConfirmarApagarCliente = async () => {
    if (!clienteParaApagar) return;
    await deleteCliente(clienteParaApagar.id);
    setClienteParaApagar(null);
    deleteClienteModal.closeModal();
  };

  const handleToggleEntregue = async (id: string, statusAtual: string) => {
    const novoStatus = statusAtual === 'Entregue' ? 'Pendente' : 'Entregue';
    await updateVenda(id, { statusPedido: novoStatus });
  };

  useEffect(() => {
    fetchVendas();
    fetchClientes();
    fetchItensVenda();
  }, [fetchVendas, fetchClientes, fetchItensVenda]);

  const linhas = useMemo(() => {
    const vendasOrdenadas = [...vendasComDetalhes].sort((vendaA, vendaB) =>
      vendaA.dataVenda < vendaB.dataVenda ? 1 : -1
    );

    return vendasOrdenadas.map((venda, posicao) => ({
      id: venda.id,
      numero: formatNumeroVenda(posicao),
      cliente: venda.clienteNome,
      clienteId: venda.clienteId,
      data: venda.dataVenda,
      itens: itensVenda.filter((item) => item.vendaId === venda.id).length,
      total: venda.valorTotal,
      pagamento: venda.pagamento,
      canalVenda:
        canaisVenda.find(
          (canal) => String(canal.canalVendaId) === venda.canalVendaId
        )?.nomeCanalVenda ?? '—',
      status: venda.statusPedido || 'Pendente',
    }));
  }, [vendasComDetalhes, itensVenda, canaisVenda]);

  const buscaNormalizada = busca.toLowerCase();
  const linhasFiltradas = linhas.filter((linha) => {
    const correspondeBusca =
      linha.numero.toLowerCase().includes(buscaNormalizada) ||
      linha.cliente.toLowerCase().includes(buscaNormalizada);
    const correspondeStatus = filtroStatus === 'Todos' || linha.status === filtroStatus;
    return correspondeBusca && correspondeStatus;
  });

  const totalReceita = linhasFiltradas
    .filter((linha) =>
      STATUS_CONCLUIDOS.includes(linha.status as (typeof STATUS_CONCLUIDOS)[number])
    )
    .reduce((acumulado, linha) => acumulado + linha.total, 0);

  const linhasParaExportar = () =>
    linhasFiltradas.map(({ numero, cliente, data, itens, total, pagamento, canalVenda, status }) => ({
      'Nº Venda': numero,
      Cliente: cliente,
      Data: formatarDataBR(data),
      Itens: itens,
      'Total (R$)': total.toFixed(2),
      Pagamento: pagamento,
      'Canal de Venda': canalVenda,
      Status: status,
    }));

  const handleExportExcel = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    exportarTabelaExcel(
      'Vendas',
      linhasParaExportar() as Array<Record<string, unknown>>,
      `vendas-${stamp}.xlsx`
    );
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Vendas" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Lista de Vendas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {linhasFiltradas.length} venda(s) · Receita:{' '}
              <span className="font-medium text-green-600">R$ {totalReceita.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Enviada">Enviada</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <input
              type="text"
              placeholder="Buscar venda..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="focus:border-brand-500 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />
            <Button
              size="md"
              variant="primary"
              startIcon={iconPlus}
              onClick={() => setShowNovoCadastroModal(true)}
            >
              Novo
            </Button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Exportar Excel
            </button>
          </div>
        </div>

        {clientes.length === 0 ? (
          <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">Nenhum cliente cadastrado.</p>
          </div>
        ) : (
          <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Clientes cadastrados:
            </p>
            <div className="flex flex-wrap gap-2">
              {clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="bg-brand-50 dark:bg-brand-900/30 inline-flex items-center gap-2 rounded-lg border border-brand-100 py-1.5 pr-1.5 pl-3 dark:border-brand-900/50"
                >
                  <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                    {cliente.nome}
                  </span>
                  <button
                    type="button"
                    aria-label={`Editar cliente ${cliente.nome}`}
                    title={`Editar cliente ${cliente.nome}`}
                    onClick={() => {
                      setEditClienteId(cliente.id);
                      setShowClienteModal(true);
                    }}
                    className="bg-brand-500 hover:bg-brand-600 inline-flex h-7 w-7 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                  >
                    <Pencil size={14} strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Excluir cliente ${cliente.nome}`}
                    title={`Excluir cliente ${cliente.nome}`}
                    onClick={() => {
                      setClienteParaApagar({ id: cliente.id, nome: cliente.nome });
                      deleteClienteModal.openModal();
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                  >
                    <Trash2 size={14} strokeWidth={2.25} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Nº Venda
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Data
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Itens
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                  Total
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Canal de Venda
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="w-20 px-6 py-3" aria-hidden="true" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {linhasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-400">
                    Nenhuma venda encontrada.
                  </td>
                </tr>
              ) : (
                linhasFiltradas.map((venda) => (
                  <tr
                    key={venda.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {venda.numero}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                      {venda.cliente}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {formatarDataBR(venda.data)}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                      {venda.itens}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-white/90">
                      R$ {venda.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {venda.pagamento}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {venda.canalVenda}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[venda.status] || statusColor.Pendente}`}
                      >
                        {venda.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditClienteId(venda.clienteId);
                            setShowClienteModal(true);
                          }}
                          aria-label="Editar cliente / endereço"
                          title="Editar cliente / endereço"
                          className="bg-brand-500 hover:bg-brand-600 inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-colors"
                        >
                          <Pencil size={15} strokeWidth={2.25} />
                        </button>
                        <label
                          title={
                            venda.status === 'Entregue'
                              ? 'Marcar como não entregue'
                              : 'Marcar como entregue'
                          }
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                        >
                          <input
                            type="checkbox"
                            checked={venda.status === 'Entregue'}
                            onChange={() => handleToggleEntregue(venda.id, venda.status)}
                            aria-label={`Marcar venda ${venda.numero} como entregue`}
                            className="h-4 w-4 cursor-pointer accent-green-600"
                          />
                        </label>
                        <button
                          type="button"
                          aria-label={`Deletar venda ${venda.numero}`}
                          title={`Deletar venda ${venda.numero}`}
                          onClick={() => {
                            setVendaParaApagar({ id: venda.id, numero: venda.numero });
                            deleteVendaModal.openModal();
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                        >
                          <Trash2 size={15} strokeWidth={2.25} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClienteEnderecoModal
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        clienteId={editClienteId}
      />
      <NovoCadastroModal
        isOpen={showNovoCadastroModal}
        onClose={() => setShowNovoCadastroModal(false)}
        initialView={abrirNaVenda ? 'venda' : 'select'}
      />

      <Modal
        isOpen={deleteVendaModal.isOpen}
        onClose={deleteVendaModal.closeModal}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Apagar venda
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja apagar a venda{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {vendaParaApagar?.numero}
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteVendaModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarApagarVenda}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteClienteModal.isOpen}
        onClose={deleteClienteModal.closeModal}
        className="m-4 max-w-[440px]"
        showCloseButton={false}
      >
        <div className="p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Excluir cliente
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja excluir esse cliente{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {clienteParaApagar?.nome}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={deleteClienteModal.closeModal}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarApagarCliente}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Apagar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
