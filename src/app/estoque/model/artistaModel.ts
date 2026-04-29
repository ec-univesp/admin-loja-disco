import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { artistasService, type RequestArtistaDTO } from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chaves = {
  todas: ['artistas'],
  lista: () => ['artistas', 'lista'],
  porId: (id: number) => ['artistas', 'detalhe', id],
};

export function useArtistasModel(id?: number) {
  const qc = useQueryClient();

  const lista = useQuery({
    queryKey: chaves.lista(),
    queryFn: ({ signal }) => artistasService.list(signal),
  });

  const porId = useQuery({
    queryKey: chaves.porId(id ?? 0),
    queryFn: ({ signal }) => artistasService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const criar = useMutation({
    mutationFn: (payload: RequestArtistaDTO) => artistasService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Artista cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar artista', erro),
  });

  const atualizar = useMutation({
    mutationFn: (payload: RequestArtistaDTO) => artistasService.update(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Artista atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar artista', erro),
  });

  const excluir = useMutation({
    mutationFn: (artistaId: number) => artistasService.delete(artistaId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Artista excluído.');
    },
    onError: (erro) => notificarErro('Falha ao excluir artista', erro),
  });

  return { lista, porId, criar, atualizar, excluir };
}
