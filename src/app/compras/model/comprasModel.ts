import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { comprasService, type RequestCompraDTO } from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chaves = {
  todas: ['compras'],
  lista: () => ['compras', 'lista'],
  porId: (id: number) => ['compras', 'detalhe', id],
};

export function useComprasModel(id?: number) {
  const qc = useQueryClient();

  const lista = useQuery({
    queryKey: chaves.lista(),
    queryFn: ({ signal }) => comprasService.list(signal),
  });

  const porId = useQuery({
    queryKey: chaves.porId(id ?? 0),
    queryFn: ({ signal }) => comprasService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const criar = useMutation({
    mutationFn: (payload: RequestCompraDTO) => comprasService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Compra registrada.');
    },
    onError: (erro) => notificarErro('Falha ao registrar compra', erro),
  });

  const atualizar = useMutation({
    mutationFn: (payload: RequestCompraDTO) => comprasService.update(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Compra atualizada.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar compra', erro),
  });

  const excluir = useMutation({
    mutationFn: (compraId: number) => comprasService.delete(compraId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Compra excluída.');
    },
    onError: (erro) => notificarErro('Falha ao excluir compra', erro),
  });

  return { lista, porId, criar, atualizar, excluir };
}
