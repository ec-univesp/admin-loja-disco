import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generosMusicaisService, type RequestGeneroMusicalDTO } from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chaves = {
  todas: ['generos-musicais'],
  lista: () => ['generos-musicais', 'lista'],
  porId: (id: number) => ['generos-musicais', 'detalhe', id],
};

export function useGenerosMusicaisModel(id?: number) {
  const qc = useQueryClient();

  const lista = useQuery({
    queryKey: chaves.lista(),
    queryFn: ({ signal }) => generosMusicaisService.list(signal),
  });

  const porId = useQuery({
    queryKey: chaves.porId(id ?? 0),
    queryFn: ({ signal }) => generosMusicaisService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const criar = useMutation({
    mutationFn: (payload: RequestGeneroMusicalDTO) => generosMusicaisService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Gênero musical cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar gênero musical', erro),
  });

  const atualizar = useMutation({
    mutationFn: (payload: RequestGeneroMusicalDTO) => generosMusicaisService.update(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Gênero musical atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar gênero musical', erro),
  });

  const excluir = useMutation({
    mutationFn: (generoMusicalId: number) => generosMusicaisService.delete(generoMusicalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Gênero musical excluído.');
    },
    onError: (erro) => notificarErro('Falha ao excluir gênero musical', erro),
  });

  return { lista, porId, criar, atualizar, excluir };
}
