import { toast } from 'sonner';
import { ApiError } from '@/shared/services/api';

export function notificarSucesso(mensagem: string) {
  toast.success(mensagem);
}

export function notificarErro(contexto: string, erro: unknown) {
  const detalhe =
    erro instanceof ApiError
      ? `${erro.status}: ${formatarCorpoDoErro(erro.body)}`
      : erro instanceof Error
        ? erro.message
        : 'Erro desconhecido';

  toast.error(contexto, { description: detalhe });
}

function formatarCorpoDoErro(corpo: unknown): string {
  if (typeof corpo === 'string') return corpo;
  if (corpo && typeof corpo === 'object') {
    const possivelMensagem =
      (corpo as { message?: string; error?: string }).message ??
      (corpo as { message?: string; error?: string }).error;
    if (possivelMensagem) return possivelMensagem;
  }
  return 'Verifique os dados e tente novamente.';
}
