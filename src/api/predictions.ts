import { apiGet, buildQuery } from './client';
import type { ApiPrediction } from './types';

export function fetchPredictions(commodityId?: number, marketId?: number): Promise<ApiPrediction[]> {
  return apiGet<ApiPrediction[]>(`/predictions${buildQuery({ commodityId, marketId })}`);
}

export function fetchLatestPrediction(commodityId?: number, marketId?: number): Promise<ApiPrediction | null> {
  return apiGet<ApiPrediction | null>(`/predictions/latest${buildQuery({ commodityId, marketId })}`);
}
