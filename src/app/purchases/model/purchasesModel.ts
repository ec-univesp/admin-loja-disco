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
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => purchasesService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const create = useMutation({
    mutationFn: (payload: PurchasePayload) => purchasesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Compra registrada.');
    },
    onError: (error) => notifyError('Erro ao registrar compra', error),
  });

  const update = useMutation({
    mutationFn: (payload: PurchasePayload) => purchasesService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Compra atualizada.');
    },
    onError: (error) => notifyError('Erro ao atualizar compra', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => purchasesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Compra excluída.');
    },
    onError: (error) => notifyError('Erro ao excluir compra', error),
  });

  return { list, byId, create, update, remove };
}
