import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  discosService,
  type BuscarDiscoQuery,
  type RequestDiscoDTO,
} from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chavesDeDiscos = {
  todas: ['discos'],
  lista: () => ['discos', 'lista'],
  porId: (id: number) => ['discos', 'detalhe', id],
  busca: (filtros: BuscarDiscoQuery) => ['discos', 'busca', filtros],
};

export function useListaDeDiscos() {
  return useQuery({
    queryKey: chavesDeDiscos.lista(),
    queryFn: ({ signal }) => discosService.list(signal),
  });
}

export function useDiscoPorId(id: number | undefined) {
  return useQuery({
    queryKey: chavesDeDiscos.porId(id ?? 0),
    queryFn: ({ signal }) => discosService.getById(id as number, signal),
    enabled: id !== undefined,
  });
}

export function useBuscarDiscos(filtros: BuscarDiscoQuery, habilitado = true) {
  return useQuery({
    queryKey: chavesDeDiscos.busca(filtros),
    queryFn: ({ signal }) => discosService.buscar(filtros, signal),
    enabled: habilitado && Boolean(filtros.termo),
  });
}

export function useCriarDisco() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestDiscoDTO) => discosService.create(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeDiscos.todas });
      notificarSucesso('Disco cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar disco', erro),
  });
}

export function useAtualizarDisco() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestDiscoDTO) => discosService.update(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeDiscos.todas });
      notificarSucesso('Disco atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar disco', erro),
  });
}

export function useExcluirDisco() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => discosService.delete(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeDiscos.todas });
      notificarSucesso('Disco excluido.');
    },
    onError: (erro) => notificarErro('Falha ao excluir disco', erro),
  });
}
