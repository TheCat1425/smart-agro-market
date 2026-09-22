import { apiGet, buildQuery } from './client';
import type { ApiMarketPrice } from './types';

export interface MarketPriceFilters {
  commodityId?: number;
  marketId?: number;
  startDate?: string;
  endDate?: string;
}

export function fetchMarketPrices(filters?: MarketPriceFilters): Promise<ApiMarketPrice[]> {
  return apiGet<ApiMarketPrice[]>(`/market-prices${buildQuery(filters || {})}`);
}

export function fetchLatestPrices(commodityId?: number): Promise<ApiMarketPrice[]> {
  return apiGet<ApiMarketPrice[]>(`/market-prices/latest${buildQuery({ commodityId })}`);
}

export function fetchPriceHistory(
  commodityId?: number,
  marketId?: number,
  days?: number
): Promise<ApiMarketPrice[]> {
  return apiGet<ApiMarketPrice[]>(`/market-prices/history${buildQuery({ commodityId, marketId, days })}`);
}
