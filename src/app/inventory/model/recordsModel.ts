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
  detail: (id: number) => ['records', 'detail', id],
  search: (params: RecordSearchParams) => ['records', 'search', params],
};

export function useRecordsModel(id?: number, searchFilters?: RecordSearchParams) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: keys.list(),
    queryFn: ({ signal }) => recordsService.list(signal),
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => recordsService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const search = useQuery({
    queryKey: keys.search(searchFilters ?? { termo: '' }),
    queryFn: ({ signal }) => recordsService.search(searchFilters as RecordSearchParams, signal),
    enabled: Boolean(searchFilters?.termo),
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

  return { list, byId, search, create, update, remove };
}
