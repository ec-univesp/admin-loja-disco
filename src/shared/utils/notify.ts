import { toast } from 'sonner';
import { z } from 'zod';
import { ApiError } from '@/shared/services/api';

const errorBodySchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  Erro: z.string().optional(),
});

export function notifySuccess(message: string) {
  toast.success(message);
}

export function notifyError(context: string, error: unknown) {
  const detail =
    error instanceof ApiError
      ? `${error.status}: ${formatErrorBody(error.body)}`
      : error instanceof Error
        ? error.message
        : 'Erro desconhecido';

  toast.error(context, { description: detail });
}

function formatErrorBody(body: unknown): string {
  if (typeof body === 'string') return body;
  const parsed = errorBodySchema.safeParse(body);
  const extractedMessage = parsed.success
    ? parsed.data.message ?? parsed.data.error ?? parsed.data.Erro
    : undefined;
  return extractedMessage ?? 'Verifique os dados e tente novamente.';
}
