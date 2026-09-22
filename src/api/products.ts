import { apiGet, apiPost, apiPut, apiDelete, buildQuery } from './client';
import type { ApiProduct } from './types';

export interface ProductFilters {
  commodityId?: number;
  farmerId?: number;
  status?: string;
  search?: string;
}

export function fetchProducts(filters?: ProductFilters): Promise<ApiProduct[]> {
  return apiGet<ApiProduct[]>(`/products${buildQuery(filters || {})}`);
}

export function fetchProductById(id: number): Promise<ApiProduct> {
  return apiGet<ApiProduct>(`/products/${id}`);
}

export function createProduct(data: Record<string, unknown>): Promise<{ id: number; message: string }> {
  return apiPost<{ id: number; message: string }>('/products', data);
}

export function updateProduct(id: number, data: Record<string, unknown>): Promise<{ message: string }> {
  return apiPut<{ message: string }>(`/products/${id}`, data);
}

export function deleteProduct(id: number): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/products/${id}`);
}
