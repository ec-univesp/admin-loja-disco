import { toast } from 'sonner';

export interface ToastCall {
  type: 'success' | 'error';
  message: string;
  description?: string;
}

export function spyToast() {
  const calls: ToastCall[] = [];
  const originalSuccess = toast.success;
  const originalError = toast.error;

  toast.success = ((message: string) => {
    calls.push({ type: 'success', message: String(message) });
    return 0 as unknown as ReturnType<typeof toast.success>;
  }) as typeof toast.success;

  toast.error = ((message: string, options?: { description?: string }) => {
    calls.push({ type: 'error', message: String(message), description: options?.description });
    return 0 as unknown as ReturnType<typeof toast.error>;
  }) as typeof toast.error;

  return {
    calls,
    last: () => calls[calls.length - 1],
    clear: () => {
      calls.length = 0;
    },
    restore: () => {
      toast.success = originalSuccess;
      toast.error = originalError;
    },
  };
}
