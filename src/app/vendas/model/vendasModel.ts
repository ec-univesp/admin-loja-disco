import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vendasService, type RequestVendaDTO } from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chaves = {
  todas: ['vendas'],
  lista: () => ['vendas', 'lista'],
  porId: (id: number) => ['vendas', 'detalhe', id],
};

export function useVendasModel(id?: number) {
  const qc = useQueryClient();

  const lista = useQuery({
    queryKey: chaves.lista(),
    queryFn: ({ signal }) => vendasService.list(signal),
  });

  const porId = useQuery({
    queryKey: chaves.porId(id ?? 0),
    queryFn: ({ signal }) => vendasService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const criar = useMutation({
    mutationFn: (payload: RequestVendaDTO) => vendasService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Venda registrada.');
    },
    onError: (erro) => notificarErro('Falha ao registrar venda', erro),
  });

  const atualizar = useMutation({
    mutationFn: (payload: RequestVendaDTO) => vendasService.update(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Venda atualizada.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar venda', erro),
  });

  const excluir = useMutation({
    mutationFn: (vendaId: number) => vendasService.delete(vendaId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Venda excluída.');
    },
    onError: (erro) => notificarErro('Falha ao excluir venda', erro),
  });

  return { lista, porId, criar, atualizar, excluir };
}
