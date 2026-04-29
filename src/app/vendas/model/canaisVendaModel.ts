import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { canaisVendaService, type RequestCanalVendaDTO } from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chaves = {
  todas: ['canais-venda'],
  lista: () => ['canais-venda', 'lista'],
  porId: (id: number) => ['canais-venda', 'detalhe', id],
};

export function useCanaisVendaModel(id?: number) {
  const qc = useQueryClient();

  const lista = useQuery({
    queryKey: chaves.lista(),
    queryFn: ({ signal }) => canaisVendaService.list(signal),
  });

  const porId = useQuery({
    queryKey: chaves.porId(id ?? 0),
    queryFn: ({ signal }) => canaisVendaService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const criar = useMutation({
    mutationFn: (payload: RequestCanalVendaDTO) => canaisVendaService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Canal de venda cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar canal de venda', erro),
  });

  const atualizar = useMutation({
    mutationFn: (payload: RequestCanalVendaDTO) => canaisVendaService.update(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Canal de venda atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar canal de venda', erro),
  });

  const excluir = useMutation({
    mutationFn: (canalVendaId: number) => canaisVendaService.delete(canalVendaId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Canal de venda excluído.');
    },
    onError: (erro) => notificarErro('Falha ao excluir canal de venda', erro),
  });

  return { lista, porId, criar, atualizar, excluir };
}
