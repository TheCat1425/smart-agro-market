// ────────────────────────────────────────────────────────
// API Status — One-time health check with caching
//
// Checks GET /api/health once on first call.
// Caches the result — does NOT continuously poll.
// ────────────────────────────────────────────────────────

import { apiGet } from './client';
import type { ApiHealth } from './types';

let cachedStatus: boolean | null = null;
let statusChecked = false;

/**
 * Check if the API is available.
 * Performs the health check only once, then caches.
 */
export async function checkApiAvailability(): Promise<boolean> {
  if (statusChecked) return cachedStatus!;

  try {
    const health = await apiGet<ApiHealth>('/health', 3000); // 3s timeout for health check
    cachedStatus = health.database === 'connected';
  } catch {
    cachedStatus = false;
  }

  statusChecked = true;
  return cachedStatus;
}

/**
 * Returns the cached API status synchronously.
 * Returns false if not yet checked.
 */
export function isApiAvailable(): boolean {
  return cachedStatus === true;
}

/**
 * Returns a human-readable status message.
 */
export function getApiStatusMessage(): string {
  if (!statusChecked) return 'Checking API...';
  if (cachedStatus) return 'Connected to live database';
  return 'Demo Mode — Using Local Data';
}

/**
 * Reset the cached status (useful for testing or manual retry).
 */
export function resetApiStatus(): void {
  cachedStatus = null;
  statusChecked = false;
}
