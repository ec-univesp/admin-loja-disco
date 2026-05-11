import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  recordsService,
  type RecordPayload,
  type RecordSearchParams,
} from '@/shared/services/api';
import { notifyError, notifySuccess } from '@/shared/utils/notify';

const keys = {
  all: ['records'],
  list: () => ['records', 'list'],
  filtered: (tipo: 1 | 2) => ['records', 'filtered', tipo],
  detail: (id: number) => ['records', 'detail', id],
  search: (params: RecordSearchParams) => ['records', 'search', params],
};

export function useRecordsModel(id?: number, searchFilters?: RecordSearchParams) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: keys.list(),
    queryFn: ({ signal }) => recordsService.list(signal),
  });

  const listAvailable = useQuery({
    queryKey: keys.filtered(1),
    queryFn: ({ signal }) => recordsService.listFiltered(1, signal),
  });

  const listSold = useQuery({
    queryKey: keys.filtered(2),
    queryFn: ({ signal }) => recordsService.listFiltered(2, signal),
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => {
      if (id === undefined) throw new Error('id is required');
      return recordsService.getById(id, signal);
    },
    enabled: id !== undefined,
  });

  const searchTerm = searchFilters?.termo ?? '';
  const search = useQuery({
    queryKey: keys.search({ termo: searchTerm }),
    queryFn: ({ signal }) => recordsService.search({ termo: searchTerm }, signal),
    enabled: searchTerm.length > 0,
  });

  const create = useMutation({
    mutationFn: (payload: RecordPayload) => recordsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Disco adicionado.');
    },
    onError: (error) => notifyError('Erro ao adicionar disco', error),
  });

  const update = useMutation({
    mutationFn: (payload: RecordPayload) => recordsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Disco atualizado.');
    },
    onError: (error) => notifyError('Erro ao atualizar disco', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => recordsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Disco excluído.');
    },
    onError: (error) => notifyError('Erro ao excluir disco', error),
  });

  return { list, listAvailable, listSold, byId, search, create, update, remove };
}
