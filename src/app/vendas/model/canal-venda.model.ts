import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  canaisVendaService,
  type RequestCanalVendaDTO,
} from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chavesDeCanaisVenda = {
  todas: ['canais-venda'],
  lista: () => ['canais-venda', 'lista'],
  porId: (id: number) => ['canais-venda', 'detalhe', id],
};

export function useListaDeCanaisVenda() {
  return useQuery({
    queryKey: chavesDeCanaisVenda.lista(),
    queryFn: ({ signal }) => canaisVendaService.list(signal),
  });
}

export function useCanalVendaPorId(id: number | undefined) {
  return useQuery({
    queryKey: chavesDeCanaisVenda.porId(id ?? 0),
    queryFn: ({ signal }) => canaisVendaService.getById(id as number, signal),
    enabled: id !== undefined,
  });
}

export function useCriarCanalVenda() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestCanalVendaDTO) =>
      canaisVendaService.create(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeCanaisVenda.todas });
      notificarSucesso('Canal de venda cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar canal de venda', erro),
  });
}

export function useAtualizarCanalVenda() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestCanalVendaDTO) =>
      canaisVendaService.update(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeCanaisVenda.todas });
      notificarSucesso('Canal de venda atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar canal de venda', erro),
  });
}

export function useExcluirCanalVenda() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => canaisVendaService.delete(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeCanaisVenda.todas });
      notificarSucesso('Canal de venda excluido.');
    },
    onError: (erro) => notificarErro('Falha ao excluir canal de venda', erro),
  });
}
