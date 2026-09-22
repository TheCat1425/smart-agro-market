import { apiGet, buildQuery } from './client';
import type { ApiMarket } from './types';

export function fetchMarkets(district?: string): Promise<ApiMarket[]> {
  return apiGet<ApiMarket[]>(`/markets${buildQuery({ district })}`);
}

export function fetchMarketById(id: number): Promise<ApiMarket> {
  return apiGet<ApiMarket>(`/markets/${id}`);
}
