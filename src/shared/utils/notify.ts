import { toast } from 'sonner';
import { ApiError } from '@/shared/services/api';

export function notifySuccess(message: string) {
  toast.success(message);
}

export function notifyError(context: string, error: unknown) {
  const detail =
    error instanceof ApiError
      ? `${error.status}: ${formatErrorBody(error.body)}`
      : error instanceof Error
        ? error.message
        : 'Unknown error';

  toast.error(context, { description: detail });
}

function formatErrorBody(body: unknown): string {
  if (typeof body === 'string') return body;
  if (body && typeof body === 'object') {
    const msg =
      (body as { message?: string; error?: string }).message ??
      (body as { message?: string; error?: string }).error;
    if (msg) return msg;
  }
  return 'Check the data and try again.';
}
