import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salesService, type SalePayload } from '@/shared/services/api';
import { notifyError, notifySuccess } from '@/shared/utils/notify';

const keys = {
  all: ['sales'],
  list: () => ['sales', 'list'],
  detail: (id: number) => ['sales', 'detail', id],
};

export function useSalesModel(id?: number) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: keys.list(),
    queryFn: ({ signal }) => salesService.list(signal),
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => {
      if (id === undefined) throw new Error('id is required');
      return salesService.getById(id, signal);
    },
    enabled: id !== undefined,
  });

  const create = useMutation({
    mutationFn: (payload: SalePayload) => salesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Venda registrada.');
    },
    onError: (error) => notifyError('Erro ao registrar venda', error),
  });

  const update = useMutation({
    mutationFn: (payload: SalePayload) => salesService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Venda atualizada.');
    },
    onError: (error) => notifyError('Erro ao atualizar venda', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => salesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Venda excluída.');
    },
    onError: (error) => notifyError('Erro ao excluir venda', error),
  });

  return { list, byId, create, update, remove };
}
