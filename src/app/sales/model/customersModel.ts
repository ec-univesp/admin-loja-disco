import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customersService, type CustomerPayload } from '@/shared/services/api';
import { notifyError, notifySuccess } from '@/shared/utils/notify';

const keys = {
  all: ['customers'],
  list: () => ['customers', 'list'],
  detail: (id: number) => ['customers', 'detail', id],
};

export function useCustomersModel(id?: number) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: keys.list(),
    queryFn: ({ signal }) => customersService.list(signal),
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => customersService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const create = useMutation({
    mutationFn: async (payload: CustomerPayload) => {
      const before = new Set((await customersService.list()).map((c) => c.clienteId));
      await customersService.create(payload);
      const after = await customersService.list();
      return after.find((c) => !before.has(c.clienteId)) ?? payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Cliente adicionado.');
    },
    onError: (error) => notifyError('Erro ao adicionar cliente', error),
  });

  const update = useMutation({
    mutationFn: (payload: CustomerPayload) => customersService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Cliente atualizado.');
    },
    onError: (error) => notifyError('Erro ao atualizar cliente', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => customersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Cliente excluído.');
    },
    onError: (error) => notifyError('Erro ao excluir cliente', error),
  });

  return { list, byId, create, update, remove };
}
