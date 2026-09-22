import { apiPost } from './client';
import type { ApiRecommendationResult } from './types';

export interface RecommendationInput {
  commodityId: number;
  quantity: number;
  farmerLocation: string;
  harvestDate: string;
  minimumAcceptablePrice: number;
}

export function analyzeRecommendation(input: RecommendationInput): Promise<ApiRecommendationResult> {
  return apiPost<ApiRecommendationResult>('/recommendations/analyze', input);
}

export function saveRecommendation(data: Record<string, unknown>): Promise<{ id: number; message: string }> {
  return apiPost<{ id: number; message: string }>('/recommendations', data);
}
