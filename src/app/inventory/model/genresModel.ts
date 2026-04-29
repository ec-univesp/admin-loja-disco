import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { genresService, type MusicGenrePayload } from '@/shared/services/api';
import { notifyError, notifySuccess } from '@/shared/utils/notify';

const keys = {
  all: ['genres'],
  list: () => ['genres', 'list'],
  detail: (id: number) => ['genres', 'detail', id],
};

export function useGenresModel(id?: number) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: keys.list(),
    queryFn: ({ signal }) => genresService.list(signal),
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => genresService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const create = useMutation({
    mutationFn: (payload: MusicGenrePayload) => genresService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Genre added.');
    },
    onError: (error) => notifyError('Failed to add genre', error),
  });

  const update = useMutation({
    mutationFn: (payload: MusicGenrePayload) => genresService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Genre updated.');
    },
    onError: (error) => notifyError('Failed to update genre', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => genresService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Genre deleted.');
    },
    onError: (error) => notifyError('Failed to delete genre', error),
  });

  return { list, byId, create, update, remove };
}
