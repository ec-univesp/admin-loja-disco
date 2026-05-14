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
    staleTime: 10 * 60_000,
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => {
      if (id === undefined) throw new Error('Identificador obrigatório.');
      return artistsService.getById(id, signal);
    },
    enabled: id !== undefined,
    staleTime: 10 * 60_000,
  });

  const create = useMutation({
    mutationFn: async (payload: ArtistPayload) => {
      const before = new Set((await artistsService.list()).map((a) => a.artistaId));
      await artistsService.create(payload);
      const after = await artistsService.list();
      return after.find((a) => !before.has(a.artistaId)) ?? payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Artista adicionado.');
    },
    onError: (error) => notifyError('Erro ao adicionar artista', error),
  });

  const update = useMutation({
    mutationFn: (payload: ArtistPayload) => artistsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Artista atualizado.');
    },
    onError: (error) => notifyError('Erro ao atualizar artista', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => artistsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Artista excluído.');
    },
    onError: (error) => notifyError('Erro ao excluir artista', error),
  });

  return { list, byId, create, update, remove };
}
