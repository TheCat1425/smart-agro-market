// ────────────────────────────────────────────────────────
// useApiData — Custom hook with automatic mock fallback
//
// Usage:
//   const { data, loading, error, isDemo } = useApiData(
//     () => fetchMarketPrices(),
//     mockPriceData
//   );
//
// Behavior:
//   1. Checks API availability (cached one-time health check)
//   2. If API available → calls apiFn
//   3. If API unavailable OR apiFn throws → returns mockFallback
//   4. isDemo = true when using mock fallback
// ────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { checkApiAvailability } from '../api/apiStatus';

export interface UseApiDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  refetch: () => void;
}

export function useApiData<T>(
  apiFn: () => Promise<T>,
  mockFallback: T,
  deps: unknown[] = []
): UseApiDataResult<T> {
  const [data, setData] = useState<T>(mockFallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiAvailable = await checkApiAvailability();

      if (!apiAvailable) {
        // API not available — use mock data
        setData(mockFallback);
        setIsDemo(true);
        setLoading(false);
        return;
      }

      // API available — try fetching
      const result = await apiFn();
      setData(result);
      setIsDemo(false);
    } catch (err) {
      // API call failed — fall back to mock data
      console.warn('[useApiData] API call failed, using mock fallback:', err);
      setData(mockFallback);
      setIsDemo(true);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, isDemo, refetch: fetchData };
}
