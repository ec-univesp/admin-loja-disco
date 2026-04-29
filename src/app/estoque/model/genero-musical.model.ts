import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  generosMusicaisService,
  type RequestGeneroMusicalDTO,
} from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chavesDeGenerosMusicais = {
  todas: ['generos-musicais'],
  lista: () => ['generos-musicais', 'lista'],
  porId: (id: number) => ['generos-musicais', 'detalhe', id],
};

export function useListaDeGenerosMusicais() {
  return useQuery({
    queryKey: chavesDeGenerosMusicais.lista(),
    queryFn: ({ signal }) => generosMusicaisService.list(signal),
  });
}

export function useGeneroMusicalPorId(id: number | undefined) {
  return useQuery({
    queryKey: chavesDeGenerosMusicais.porId(id ?? 0),
    queryFn: ({ signal }) => generosMusicaisService.getById(id as number, signal),
    enabled: id !== undefined,
  });
}

export function useCriarGeneroMusical() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestGeneroMusicalDTO) =>
      generosMusicaisService.create(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeGenerosMusicais.todas });
      notificarSucesso('Genero musical cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar genero musical', erro),
  });
}

export function useAtualizarGeneroMusical() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestGeneroMusicalDTO) =>
      generosMusicaisService.update(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeGenerosMusicais.todas });
      notificarSucesso('Genero musical atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar genero musical', erro),
  });
}

export function useExcluirGeneroMusical() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => generosMusicaisService.delete(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeGenerosMusicais.todas });
      notificarSucesso('Genero musical excluido.');
    },
    onError: (erro) => notificarErro('Falha ao excluir genero musical', erro),
  });
}
