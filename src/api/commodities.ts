import { apiGet } from './client';
import type { ApiCommodity } from './types';

export function fetchCommodities(): Promise<ApiCommodity[]> {
  return apiGet<ApiCommodity[]>('/commodities');
}

export function fetchCommodityById(id: number): Promise<ApiCommodity> {
  return apiGet<ApiCommodity>(`/commodities/${id}`);
}
