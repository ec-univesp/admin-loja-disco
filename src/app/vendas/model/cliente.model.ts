import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  clientesService,
  type RequestClienteDTO,
} from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chavesDeClientes = {
  todas: ['clientes'],
  lista: () => ['clientes', 'lista'],
  porId: (id: number) => ['clientes', 'detalhe', id],
};

export function useListaDeClientes() {
  return useQuery({
    queryKey: chavesDeClientes.lista(),
    queryFn: ({ signal }) => clientesService.list(signal),
  });
}

export function useClientePorId(id: number | undefined) {
  return useQuery({
    queryKey: chavesDeClientes.porId(id ?? 0),
    queryFn: ({ signal }) => clientesService.getById(id as number, signal),
    enabled: id !== undefined,
  });
}

export function useCriarCliente() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestClienteDTO) => clientesService.create(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeClientes.todas });
      notificarSucesso('Cliente cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar cliente', erro),
  });
}

export function useAtualizarCliente() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestClienteDTO) => clientesService.update(payload),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeClientes.todas });
      notificarSucesso('Cliente atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar cliente', erro),
  });
}

export function useExcluirCliente() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientesService.delete(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesDeClientes.todas });
      notificarSucesso('Cliente excluido.');
    },
    onError: (erro) => notificarErro('Falha ao excluir cliente', erro),
  });
}
