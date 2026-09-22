// ────────────────────────────────────────────────────────
// API Client — Reusable HTTP helpers for the REST API
//
// Uses native fetch(). No external dependencies.
// Base URL from VITE_API_URL env var (default: http://localhost:3001/api)
// ────────────────────────────────────────────────────────

const BASE_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3001/api';

const DEFAULT_TIMEOUT = 10_000; // 10 seconds

/**
 * Custom error for API failures.
 * Contains the HTTP status code and the error code from the API response.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Internal helper — performs a fetch with timeout, JSON parsing, and error handling.
 */
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: controller.signal,
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // Try to parse JSON even on error responses
    let json: Record<string, unknown>;
    try {
      json = await response.json();
    } catch {
      throw new ApiError(
        response.status,
        'PARSE_ERROR',
        `Server returned status ${response.status} with non-JSON response`
      );
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const error = json.error as { code?: string; message?: string } | undefined;
      throw new ApiError(
        response.status,
        error?.code || 'API_ERROR',
        error?.message || `Request failed with status ${response.status}`
      );
    }

    // Return the data payload
    return (json as { success: boolean; data: T }).data;
  } catch (err) {
    if (err instanceof ApiError) throw err;

    // AbortController timeout
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(0, 'TIMEOUT', 'Request timed out');
    }

    // Network error (server not running, CORS, DNS, etc.)
    if (err instanceof TypeError) {
      throw new ApiError(0, 'NETWORK_ERROR', 'Unable to reach the API server');
    }

    throw new ApiError(0, 'UNKNOWN_ERROR', String(err));
  } finally {
    clearTimeout(timer);
  }
}

// ──────────── Public API ────────────

export function apiGet<T>(path: string, timeoutMs?: number): Promise<T> {
  return request<T>('GET', path, undefined, timeoutMs);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>('POST', path, body);
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PUT', path, body);
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>('DELETE', path);
}

/**
 * Build a query string from an object of optional params.
 * Skips null/undefined/empty values.
 */
export function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
}
