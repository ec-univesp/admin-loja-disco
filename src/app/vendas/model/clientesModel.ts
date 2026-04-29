import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientesService, type RequestClienteDTO } from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chaves = {
  todas: ['clientes'],
  lista: () => ['clientes', 'lista'],
  porId: (id: number) => ['clientes', 'detalhe', id],
};

export function useClientesModel(id?: number) {
  const qc = useQueryClient();

  const lista = useQuery({
    queryKey: chaves.lista(),
    queryFn: ({ signal }) => clientesService.list(signal),
  });

  const porId = useQuery({
    queryKey: chaves.porId(id ?? 0),
    queryFn: ({ signal }) => clientesService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const criar = useMutation({
    mutationFn: (payload: RequestClienteDTO) => clientesService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Cliente cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar cliente', erro),
  });

  const atualizar = useMutation({
    mutationFn: (payload: RequestClienteDTO) => clientesService.update(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Cliente atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar cliente', erro),
  });

  const excluir = useMutation({
    mutationFn: (clienteId: number) => clientesService.delete(clienteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Cliente excluído.');
    },
    onError: (erro) => notificarErro('Falha ao excluir cliente', erro),
  });

  return { lista, porId, criar, atualizar, excluir };
}
