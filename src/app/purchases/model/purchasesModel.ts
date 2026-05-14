import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { purchasesService, type PurchasePayload } from '@/shared/services/api';
import { notifyError, notifySuccess } from '@/shared/utils/notify';

const keys = {
  all: ['purchases'],
  list: () => ['purchases', 'list'],
  detail: (id: number) => ['purchases', 'detail', id],
};

export function usePurchasesModel(id?: number) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: keys.list(),
    queryFn: ({ signal }) => purchasesService.list(signal),
    staleTime: 2 * 60_000,
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => {
      if (id === undefined) throw new Error('Identificador obrigatório.');
      return purchasesService.getById(id, signal);
    },
    enabled: id !== undefined,
    staleTime: 2 * 60_000,
  });

  const invalidatePurchasesAndStock = () => {
    queryClient.invalidateQueries({ queryKey: keys.all });
    queryClient.invalidateQueries({ queryKey: ['records'] });
  };

  const create = useMutation({
    mutationFn: (payload: PurchasePayload) => purchasesService.create(payload),
    onSuccess: () => {
      invalidatePurchasesAndStock();
      notifySuccess('Compra registrada.');
    },
    onError: (error) => notifyError('Erro ao registrar compra', error),
  });

  const update = useMutation({
    mutationFn: (payload: PurchasePayload) => purchasesService.update(payload),
    onSuccess: () => {
      invalidatePurchasesAndStock();
      notifySuccess('Compra atualizada.');
    },
    onError: (error) => notifyError('Erro ao atualizar compra', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => purchasesService.delete(id),
    onSuccess: () => {
      invalidatePurchasesAndStock();
      notifySuccess('Compra excluída.');
    },
    onError: (error) => notifyError('Erro ao excluir compra', error),
  });

  return { list, byId, create, update, remove };
}
