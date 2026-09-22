import { apiGet, apiPost, apiPut } from './client';
import type { ApiOrder } from './types';

export function fetchOrders(): Promise<ApiOrder[]> {
  return apiGet<ApiOrder[]>('/orders');
}

export function fetchOrderById(id: number): Promise<ApiOrder> {
  return apiGet<ApiOrder>(`/orders/${id}`);
}

export interface CreateOrderInput {
  consumerId: number;
  items: Array<{ productId: number; quantity: number }>;
  deliveryAddress: string;
  deliveryDistrict: string;
  deliveryUpazila?: string;
}

export function createOrder(data: CreateOrderInput): Promise<{
  orderId: number;
  totalAmount: number;
  deliveryFee: number;
  platformFee: number;
  grandTotal: number;
}> {
  return apiPost('/orders', data);
}

export function updateOrderStatus(id: number, status: string): Promise<{ message: string }> {
  return apiPut<{ message: string }>(`/orders/${id}/status`, { status });
}
