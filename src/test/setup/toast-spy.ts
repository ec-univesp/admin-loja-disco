import { toast } from 'sonner';

export interface ToastCall {
  type: 'success' | 'error';
  message: string;
  description?: string;
}

type ToastSuccessFn = typeof toast.success;
type ToastErrorFn = typeof toast.error;

export function spyToast() {
  const calls: ToastCall[] = [];
  const originalSuccess = toast.success;
  const originalError = toast.error;

  const successSpy: ToastSuccessFn = (...args) => {
    const [message] = args;
    calls.push({ type: 'success', message: String(message) });
    return originalSuccess(...args);
  };

  const errorSpy: ToastErrorFn = (...args) => {
    const [message, options] = args;
    const rawDescription = options?.description;
    const description = typeof rawDescription === 'string' ? rawDescription : undefined;
    calls.push({ type: 'error', message: String(message), description });
    return originalError(...args);
  };

  Object.assign(toast, { success: successSpy, error: errorSpy });

  return {
    calls,
    last: () => calls[calls.length - 1],
    clear: () => {
      calls.length = 0;
    },
    restore: () => {
      Object.assign(toast, { success: originalSuccess, error: originalError });
    },
  };
}
