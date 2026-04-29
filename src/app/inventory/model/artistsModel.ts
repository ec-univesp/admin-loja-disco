import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { artistsService, type ArtistPayload } from '@/shared/services/api';
import { notifyError, notifySuccess } from '@/shared/utils/notify';

const keys = {
  all: ['artists'],
  list: () => ['artists', 'list'],
  detail: (id: number) => ['artists', 'detail', id],
};

export function useArtistsModel(id?: number) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: keys.list(),
    queryFn: ({ signal }) => artistsService.list(signal),
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => artistsService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const create = useMutation({
    mutationFn: (payload: ArtistPayload) => artistsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Artist added.');
    },
    onError: (error) => notifyError('Failed to add artist', error),
  });

  const update = useMutation({
    mutationFn: (payload: ArtistPayload) => artistsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Artist updated.');
    },
    onError: (error) => notifyError('Failed to update artist', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => artistsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Artist deleted.');
    },
    onError: (error) => notifyError('Failed to delete artist', error),
  });

  return { list, byId, create, update, remove };
}
