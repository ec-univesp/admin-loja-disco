'use client';

import { useEffect, useState } from 'react';
import { useVendas, useClientes, useEnderecos, useDiscos, useItensVenda } from '@/hooks/useStore';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';

export default function VendasStoreExample() {
  const {
    vendasComDetalhes,
    fetchVendas,
    createVenda,
    loading,
    error,
  } = useVendas();

  const { clientes, fetchClientes } = useClientes();
  const { enderecos, fetchEnderecos } = useEnderecos();
  const { discosComArtista, fetchDiscos } = useDiscos();
  const { createItemVenda, fetchItensVenda } = useItensVenda();

  const [formData, setFormData] = useState({
    clienteId: '',
    enderecoId: '',
    dataVenda: new Date().toISOString().split('T')[0],
    frete: 0,
    pagamento: 'Cartão',
    canalVendaId: '',
    custosAdicionais: 0,
    statusPedido: 'Pendente',
  });

  const [selectedDisco, setSelectedDisco] = useState({
    discoId: '',
    precoVenda: 0,
  });

  useEffect(() => {
    fetchVendas();
    fetchClientes();
    fetchEnderecos();
    fetchDiscos();
    fetchItensVenda();
  }, [fetchVendas, fetchClientes, fetchEnderecos, fetchDiscos, fetchItensVenda]);

  const handleSubmitVenda = async () => {
    if (!formData.clienteId || !formData.enderecoId) {
      alert('Selecione cliente e endereço');
      return;
    }

    const venda = await createVenda({
      clienteId: formData.clienteId,
      enderecoId: formData.enderecoId,
      dataVenda: formData.dataVenda,
      frete: Number(formData.frete),
      valorTotal: selectedDisco.precoVenda + Number(formData.frete) + Number(formData.custosAdicionais),
      pagamento: formData.pagamento,
      canalVendaId: formData.canalVendaId,
      custosAdicionais: Number(formData.custosAdicionais),
      statusPedido: formData.statusPedido,
    });

    if (venda && selectedDisco.discoId) {
      await createItemVenda({
        vendaId: venda.id,
        discoId: selectedDisco.discoId,
        precoVenda: Number(selectedDisco.precoVenda),
      });

      alert('Venda criada com sucesso!');
      setFormData({
        clienteId: '',
        enderecoId: '',
        dataVenda: new Date().toISOString().split('T')[0],
        frete: 0,
        pagamento: 'Cartão',
        canalVendaId: '',
        custosAdicionais: 0,
        statusPedido: 'Pendente',
      });
      setSelectedDisco({ discoId: '', precoVenda: 0 });
      fetchVendas();
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Criação */}
      <ComponentCard title="Criar Nova Venda (com Zustand + localStorage)">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
            <p className="text-sm text-red-900 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <select
                id="cliente"
                value={formData.clienteId}
                onChange={(e) =>
                  setFormData({ ...formData, clienteId: e.target.value })
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="endereco">Endereço de Entrega</Label>
              <select
                id="endereco"
                value={formData.enderecoId}
                onChange={(e) =>
                  setFormData({ ...formData, enderecoId: e.target.value })
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">Selecione um endereço</option>
                {enderecos.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.logradouro}, {e.numero} - {e.cidade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="disco">Disco</Label>
              <select
                id="disco"
                value={selectedDisco.discoId}
                onChange={(e) => {
                  const disco = discosComArtista.find((d) => d.id === e.target.value);
                  setSelectedDisco({
                    discoId: e.target.value,
                    precoVenda: disco?.valorMercado || 0,
                  });
                }}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">Selecione um disco</option>
                {discosComArtista.map((disco) => (
                  <option key={disco.id} value={disco.id}>
                    {disco.artistaNome} - {disco.album}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="preco">Preço de Venda (R$)</Label>
              <input
                type="number"
                id="preco"
                value={selectedDisco.precoVenda}
                onChange={(e) =>
                  setSelectedDisco({
                    ...selectedDisco,
                    precoVenda: Number(e.target.value),
                  })
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="frete">Frete (R$)</Label>
              <input
                type="number"
                id="frete"
                value={formData.frete}
                onChange={(e) =>
                  setFormData({ ...formData, frete: Number(e.target.value) })
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div>
              <Label htmlFor="pagamento">Forma de Pagamento</Label>
              <select
                id="pagamento"
                value={formData.pagamento}
                onChange={(e) =>
                  setFormData({ ...formData, pagamento: e.target.value })
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="Cartão">Cartão</option>
                <option value="PIX">PIX</option>
                <option value="Boleto">Boleto</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmitVenda}
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 px-6 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Criar Venda'}
          </button>
        </div>
      </ComponentCard>

      {/* Lista de Vendas */}
      <ComponentCard title="Vendas Registradas">
        <div className="space-y-3">
          {vendasComDetalhes.length > 0 ? (
            vendasComDetalhes.map((venda) => (
              <div
                key={venda.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {venda.clienteNome}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {venda.enderecoCidade} • R$ {venda.valorTotal.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {venda.dataVenda}
                  </p>
                </div>
                <div>
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    {venda.statusPedido}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma venda registrada
              </p>
            </div>
          )}
        </div>
      </ComponentCard>
    </div>
  );
}
