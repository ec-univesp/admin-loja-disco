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
    queryFn: ({ signal }) => {
      if (id === undefined) throw new Error('Identificador obrigatório.');
      return genresService.getById(id, signal);
    },
    enabled: id !== undefined,
  });

  const create = useMutation({
    mutationFn: (payload: MusicGenrePayload) => genresService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Gênero adicionado.');
    },
    onError: (error) => notifyError('Erro ao adicionar gênero', error),
  });

  const update = useMutation({
    mutationFn: (payload: MusicGenrePayload) => genresService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Gênero atualizado.');
    },
    onError: (error) => notifyError('Erro ao atualizar gênero', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => genresService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Gênero excluído.');
    },
    onError: (error) => notifyError('Erro ao excluir gênero', error),
  });

  return { list, byId, create, update, remove };
}
