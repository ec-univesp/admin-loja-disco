import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  vendasService,
  type RequestVendaDTO,
} from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chavesDeVendas = {
  todas: ['vendas'],
  lista: () => ['vendas', 'lista'],
  porId: (id: number) => ['vendas', 'detalhe', id],
};

export function useListaDeVendas() {
  return useQuery({
    queryKey: chavesDeVendas.lista(),
    queryFn: ({ signal }) => vendasService.list(signal),
  });
}

export function useVendaPorId(id: number | undefined) {
  return useQuery({
    queryKey: chavesDeVendas.porId(id ?? 0),
    queryFn: ({ signal }) => vendasService.getById(id as number, signal),
    enabled: id !== undefined,
  });
}

export function useCriarVenda() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestVendaDTO) => vendasService.create(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeVendas.todas });
      notificarSucesso('Venda registrada.');
    },
    onError: (erro) => notificarErro('Falha ao registrar venda', erro),
  });
}

export function useAtualizarVenda() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestVendaDTO) => vendasService.update(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeVendas.todas });
      notificarSucesso('Venda atualizada.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar venda', erro),
  });
}

export function useExcluirVenda() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendasService.delete(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeVendas.todas });
      notificarSucesso('Venda excluída.');
    },
    onError: (erro) => notificarErro('Falha ao excluir venda', erro),
  });
}
