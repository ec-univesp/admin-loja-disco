import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  cleanup,
  renderHook,
  type RenderHookOptions,
  type RenderHookResult,
} from '@pokujs/react/react-testing';
import type { ComponentType, PropsWithChildren, ReactElement } from 'react';
import React from 'react';

export { cleanup };

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function withQueryClient(client: QueryClient): ComponentType<PropsWithChildren<unknown>> {
  return function QueryWrapper({ children }: PropsWithChildren<unknown>) {
    return React.createElement(QueryClientProvider, { client }, children);
  };
}

export function renderHookWithQuery<Result>(
  hook: () => Result,
  options: RenderHookOptions = {}
): RenderHookResult<Result> & { client: QueryClient } {
  const client = createTestQueryClient();
  const result = renderHook(hook, { ...options, wrapper: withQueryClient(client) });
  return Object.assign(result, { client });
}

export function renderWithQuery(
  element: ReactElement,
  client: QueryClient = createTestQueryClient()
): ReactElement {
  return React.createElement(QueryClientProvider, { client }, element);
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function waitFor(
  expectation: () => void | Promise<void>,
  { timeoutMs = 1000, intervalMs = 10 }: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<void> {
  const start = Date.now();
  let lastError: unknown;
  while (Date.now() - start < timeoutMs) {
    await act(async () => {
      await sleep(intervalMs);
    });
    try {
      await expectation();
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error('waitFor: timeout');
}
