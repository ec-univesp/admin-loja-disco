import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salesChannelsService, type SalesChannelPayload } from '@/shared/services/api';
import { notifyError, notifySuccess } from '@/shared/utils/notify';

const keys = {
  all: ['sales-channels'],
  list: () => ['sales-channels', 'list'],
  detail: (id: number) => ['sales-channels', 'detail', id],
};

export function useSalesChannelsModel(id?: number) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: keys.list(),
    queryFn: ({ signal }) => salesChannelsService.list(signal),
  });

  const byId = useQuery({
    queryKey: keys.detail(id ?? 0),
    queryFn: ({ signal }) => salesChannelsService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const create = useMutation({
    mutationFn: async (payload: SalesChannelPayload) => {
      const before = new Set((await salesChannelsService.list()).map((c) => c.idCanalVenda));
      await salesChannelsService.create(payload);
      const after = await salesChannelsService.list();
      const found = after.find((c) => !before.has(c.idCanalVenda));
      return found
        ? { canalVendaId: found.idCanalVenda, nomeCanalVenda: found.nomeCanalVenda }
        : payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Canal de venda adicionado.');
    },
    onError: (error) => notifyError('Erro ao adicionar canal de venda', error),
  });

  const update = useMutation({
    mutationFn: (payload: SalesChannelPayload) => salesChannelsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Canal de venda atualizado.');
    },
    onError: (error) => notifyError('Erro ao atualizar canal de venda', error),
  });

  const remove = useMutation({
    mutationFn: (id: number) => salesChannelsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      notifySuccess('Canal de venda excluído.');
    },
    onError: (error) => notifyError('Erro ao excluir canal de venda', error),
  });

  return { list, byId, create, update, remove };
}
