import { apiGet } from './client';
import type { ApiAdminStats, ApiRevenueEntry, ApiDistrictRevenue } from './types';

export function fetchAdminStats(): Promise<ApiAdminStats> {
  return apiGet<ApiAdminStats>('/admin/stats');
}

export function fetchRevenue(): Promise<ApiRevenueEntry[]> {
  return apiGet<ApiRevenueEntry[]>('/admin/revenue');
}

export function fetchDistrictRevenue(): Promise<ApiDistrictRevenue[]> {
  return apiGet<ApiDistrictRevenue[]>('/admin/district-revenue');
}
