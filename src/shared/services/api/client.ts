import { z } from 'zod';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
};

const buildUrl = (path: string, query?: RequestOptions['query']): string => {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, API_BASE_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
};

const safeJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const stripNulls = (value: unknown): unknown => {
  if (value === null) return undefined;
  if (Array.isArray(value)) return value.map(stripNulls);
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      const normalized = stripNulls(entry);
      if (normalized !== undefined) result[key] = normalized;
    }
    return result;
  }
  return value;
};

export async function request<Schema extends z.ZodTypeAny>(
  path: string,
  schema: Schema,
  options: RequestOptions = {}
): Promise<z.infer<Schema>> {
  const { method = 'GET', body, query, signal } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await response.text();
  const rawPayload = text ? safeJson(text) : undefined;

  if (!response.ok) {
    throw new ApiError(
      `Request failed (${response.status}) for ${method} ${path}`,
      response.status,
      rawPayload
    );
  }

  return schema.parse(stripNulls(rawPayload));
}

export const apiClient = {
  get: <Schema extends z.ZodTypeAny>(
    path: string,
    schema: Schema,
    query?: RequestOptions['query'],
    signal?: AbortSignal
  ) => request(path, schema, { method: 'GET', query, signal }),

  post: <Schema extends z.ZodTypeAny>(
    path: string,
    schema: Schema,
    body?: unknown,
    signal?: AbortSignal
  ) => request(path, schema, { method: 'POST', body, signal }),

  put: <Schema extends z.ZodTypeAny>(
    path: string,
    schema: Schema,
    body?: unknown,
    signal?: AbortSignal
  ) => request(path, schema, { method: 'PUT', body, signal }),

  patch: <Schema extends z.ZodTypeAny>(
    path: string,
    schema: Schema,
    body?: unknown,
    signal?: AbortSignal
  ) => request(path, schema, { method: 'PATCH', body, signal }),

  delete: <Schema extends z.ZodTypeAny>(
    path: string,
    schema: Schema,
    signal?: AbortSignal
  ) => request(path, schema, { method: 'DELETE', signal }),
};
