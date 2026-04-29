import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  artistasService,
  type RequestArtistaDTO,
} from '@/shared/services/api';
import { chavesDeArtistas } from './keys';
import { notificarErro, notificarSucesso } from './toastHelpers';

export function useListaDeArtistas() {
  return useQuery({
    queryKey: chavesDeArtistas.lista(),
    queryFn: ({ signal }) => artistasService.list(signal),
  });
}

export function useArtistaPorId(id: number | undefined) {
  return useQuery({
    queryKey: chavesDeArtistas.porId(id ?? 0),
    queryFn: ({ signal }) => artistasService.getById(id as number, signal),
    enabled: id !== undefined,
  });
}

export function useCriarArtista() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestArtistaDTO) => artistasService.create(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeArtistas.todas });
      notificarSucesso('Artista cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar artista', erro),
  });
}

export function useAtualizarArtista() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestArtistaDTO) => artistasService.update(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeArtistas.todas });
      notificarSucesso('Artista atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar artista', erro),
  });
}

export function useExcluirArtista() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => artistasService.delete(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeArtistas.todas });
      notificarSucesso('Artista excluido.');
    },
    onError: (erro) => notificarErro('Falha ao excluir artista', erro),
  });
}
