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
    mutationFn: (payload: CustomerPayload) => customersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Customer added.');
    },
    onError: (error) => notifyError('Failed to add customer', error),
  });

  const update = useMutation({
    mutationFn: (payload: CustomerPayload) => customersService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Customer updated.');
    },
    onError: (error) => notifyError('Failed to update customer', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => customersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Customer deleted.');
    },
    onError: (error) => notifyError('Failed to delete customer', error),
  });

  return { list, byId, create, update, remove };
}
