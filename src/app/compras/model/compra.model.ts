import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  comprasService,
  type RequestCompraDTO,
} from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chavesDeCompras = {
  todas: ['compras'],
  lista: () => ['compras', 'lista'],
  porId: (id: number) => ['compras', 'detalhe', id],
};

export function useListaDeCompras() {
  return useQuery({
    queryKey: chavesDeCompras.lista(),
    queryFn: ({ signal }) => comprasService.list(signal),
  });
}

export function useCompraPorId(id: number | undefined) {
  return useQuery({
    queryKey: chavesDeCompras.porId(id ?? 0),
    queryFn: ({ signal }) => comprasService.getById(id as number, signal),
    enabled: id !== undefined,
  });
}

export function useCriarCompra() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestCompraDTO) => comprasService.create(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeCompras.todas });
      notificarSucesso('Compra registrada.');
    },
    onError: (erro) => notificarErro('Falha ao registrar compra', erro),
  });
}

export function useAtualizarCompra() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestCompraDTO) => comprasService.update(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeCompras.todas });
      notificarSucesso('Compra atualizada.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar compra', erro),
  });
}

export function useExcluirCompra() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => comprasService.delete(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeCompras.todas });
      notificarSucesso('Compra excluída.');
    },
    onError: (erro) => notificarErro('Falha ao excluir compra', erro),
  });
}
