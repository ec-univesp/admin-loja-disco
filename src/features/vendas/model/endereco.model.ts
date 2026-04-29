import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  enderecosService,
  type RequestEnderecoDTO,
} from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chavesDeEnderecos = {
  todas: ['enderecos'],
  lista: () => ['enderecos', 'lista'],
  porId: (id: number) => ['enderecos', 'detalhe', id],
};

export function useListaDeEnderecos() {
  return useQuery({
    queryKey: chavesDeEnderecos.lista(),
    queryFn: ({ signal }) => enderecosService.list(signal),
  });
}

export function useEnderecoPorId(id: number | undefined) {
  return useQuery({
    queryKey: chavesDeEnderecos.porId(id ?? 0),
    queryFn: ({ signal }) => enderecosService.getById(id as number, signal),
    enabled: id !== undefined,
  });
}

export function useCriarEndereco() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestEnderecoDTO) => enderecosService.create(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeEnderecos.todas });
      notificarSucesso('Endereco cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar endereco', erro),
  });
}

export function useAtualizarEndereco() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestEnderecoDTO) => enderecosService.update(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeEnderecos.todas });
      notificarSucesso('Endereco atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar endereco', erro),
  });
}

export function useExcluirEndereco() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => enderecosService.delete(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeEnderecos.todas });
      notificarSucesso('Endereco excluido.');
    },
    onError: (erro) => notificarErro('Falha ao excluir endereco', erro),
  });
}
