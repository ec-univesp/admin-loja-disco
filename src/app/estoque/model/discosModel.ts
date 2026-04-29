import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  discosService,
  type RequestDiscoDTO,
  type BuscarDiscoQuery,
} from '@/shared/services/api';
import { notificarErro, notificarSucesso } from '@/shared/utils/notify';

const chaves = {
  todas: ['discos'],
  lista: () => ['discos', 'lista'],
  porId: (id: number) => ['discos', 'detalhe', id],
  busca: (filtros: BuscarDiscoQuery) => ['discos', 'busca', filtros],
};

export function useDiscosModel(id?: number, filtrosBusca?: BuscarDiscoQuery) {
  const qc = useQueryClient();

  const lista = useQuery({
    queryKey: chaves.lista(),
    queryFn: ({ signal }) => discosService.list(signal),
  });

  const porId = useQuery({
    queryKey: chaves.porId(id ?? 0),
    queryFn: ({ signal }) => discosService.getById(id as number, signal),
    enabled: id !== undefined,
  });

  const busca = useQuery({
    queryKey: chaves.busca(filtrosBusca ?? { termo: '' }),
    queryFn: ({ signal }) => discosService.buscar(filtrosBusca as BuscarDiscoQuery, signal),
    enabled: Boolean(filtrosBusca?.termo),
  });

  const criar = useMutation({
    mutationFn: (payload: RequestDiscoDTO) => discosService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Disco cadastrado.');
    },
    onError: (erro) => notificarErro('Falha ao cadastrar disco', erro),
  });

  const atualizar = useMutation({
    mutationFn: (payload: RequestDiscoDTO) => discosService.update(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Disco atualizado.');
    },
    onError: (erro) => notificarErro('Falha ao atualizar disco', erro),
  });

  const excluir = useMutation({
    mutationFn: (discoId: number) => discosService.delete(discoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chaves.todas });
      notificarSucesso('Disco excluído.');
    },
    onError: (erro) => notificarErro('Falha ao excluir disco', erro),
  });

  return { lista, porId, busca, criar, atualizar, excluir };
}
