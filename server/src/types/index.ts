// ────────────────────────────────────────────────────────
// Smart Agro Market — Database Row & API Types
// Aligned with database/schema.sql
// ────────────────────────────────────────────────────────

import type { RowDataPacket } from 'mysql2';

// ──────────── Database Row Types ────────────

export interface UserRow extends RowDataPacket {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: 'FARMER' | 'CONSUMER' | 'ADMIN';
  location: string | null;
  district: string | null;
  upazila: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

export interface FarmerRow extends RowDataPacket {
  id: number;
  user_id: number;
  farm_name: string | null;
  farm_location: string | null;
  district: string | null;
  upazila: string | null;
  farm_size: number | null;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  created_at: Date;
  updated_at: Date;
}

export interface CommodityRow extends RowDataPacket {
  id: number;
  name: string;
  name_bn: string | null;
  category: string;
  unit: string;
  description: string | null;
  is_active: number;
  created_at: Date;
}

export interface MarketRow extends RowDataPacket {
  id: number;
  name: string;
  name_bn: string | null;
  market_type: 'Wholesale' | 'Retail' | 'Mixed';
  district: string;
  upazila: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  base_transport_cost: number;
  transport_cost_per_km: number;
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

export interface MarketPriceRow extends RowDataPacket {
  id: number;
  market_id: number;
  commodity_id: number;
  price: number;
  min_price: number | null;
  max_price: number | null;
  unit: string;
  price_date: string;
  source: string | null;
  created_at: Date;
}

export interface PricePredictionRow extends RowDataPacket {
  id: number;
  commodity_id: number;
  market_id: number;
  prediction_date: string;
  target_date: string;
  predicted_price: number;
  confidence_score: number | null;
  model_name: string | null;
  model_version: string | null;
  created_at: Date;
}

export interface MarketRecommendationRow extends RowDataPacket {
  id: number;
  farmer_id: number;
  commodity_id: number;
  quantity: number;
  farmer_location: string | null;
  harvest_date: string | null;
  minimum_acceptable_price: number | null;
  recommended_market_id: number;
  current_price: number | null;
  predicted_price: number | null;
  estimated_distance: number | null;
  transport_cost: number | null;
  platform_fee: number | null;
  other_cost: number | null;
  expected_revenue: number | null;
  expected_net_return: number | null;
  recommendation_score: number | null;
  created_at: Date;
}

export interface ProductRow extends RowDataPacket {
  id: number;
  farmer_id: number;
  commodity_id: number;
  name: string;
  description: string | null;
  price: number;
  quantity_available: number;
  unit: string;
  quality_grade: string | null;
  image_url: string | null;
  organic: number;
  status: 'DRAFT' | 'ACTIVE' | 'SOLD_OUT' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
}

export interface OrderRow extends RowDataPacket {
  id: number;
  consumer_id: number;
  total_amount: number;
  delivery_fee: number;
  platform_fee: number;
  grand_total: number;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  order_status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  delivery_address: string | null;
  delivery_district: string | null;
  delivery_upazila: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItemRow extends RowDataPacket {
  id: number;
  order_id: number;
  product_id: number;
  farmer_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
}

export interface ShipmentRow extends RowDataPacket {
  id: number;
  order_id: number;
  courier_name: string | null;
  tracking_number: string | null;
  delivery_fee: number;
  status: 'CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'AT_DESTINATION' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  estimated_delivery_date: string | null;
  picked_up_at: Date | null;
  delivered_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewRow extends RowDataPacket {
  id: number;
  order_id: number;
  product_id: number;
  consumer_id: number;
  farmer_id: number;
  rating: number;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
}

// ──────────── API Request Types ────────────

export interface CreateProductRequest {
  farmerId: number;
  commodityId: number;
  name: string;
  description?: string;
  price: number;
  quantityAvailable: number;
  unit?: string;
  qualityGrade?: string;
  imageUrl?: string;
  organic?: boolean;
  status?: 'DRAFT' | 'ACTIVE';
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  quantityAvailable?: number;
  unit?: string;
  qualityGrade?: string;
  imageUrl?: string;
  organic?: boolean;
  status?: 'DRAFT' | 'ACTIVE' | 'SOLD_OUT' | 'INACTIVE';
}

export interface CreateOrderRequest {
  consumerId: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  deliveryAddress: string;
  deliveryDistrict: string;
  deliveryUpazila?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export interface RecommendationAnalyzeRequest {
  commodityId: number;
  quantity: number;
  farmerLocation: string;
  harvestDate: string;
  minimumAcceptablePrice: number;
}

export interface SaveRecommendationRequest {
  farmerId: number;
  commodityId: number;
  quantity: number;
  farmerLocation: string;
  harvestDate: string;
  minimumAcceptablePrice: number;
  recommendedMarketId: number;
  currentPrice: number;
  predictedPrice: number;
  estimatedDistance: number;
  transportCost: number;
  platformFee: number;
  otherCost: number;
  expectedRevenue: number;
  expectedNetReturn: number;
  recommendationScore: number;
}

// ──────────── API Response Types ────────────

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface HealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'unavailable';
  timestamp: string;
  uptime: number;
}

// ──────────── Recommendation Engine Types ────────────

export interface MarketData {
  id: number;
  name: string;
  district: string;
  baseTransportCost: number;
  transportCostPerKm: number;
}

export interface PriceData {
  marketId: number;
  commodityId: number;
  price: number;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface PredictionData {
  commodityId: number;
  marketId: number;
  predictedPrice: number;
  confidenceScore: number;
  targetDate: string;
}

export interface MarketAnalysisResult {
  market: MarketData;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  priceTrend: 'up' | 'down' | 'stable';
  quantity: number;
  grossRevenue: number;
  estimatedDistanceKm: number;
  estimatedTransportCost: number;
  platformFee: number;
  otherCosts: number;
  totalCosts: number;
  netReturn: number;
  profitPerKg: number;
  score: number;
  scoreBreakdown: {
    netReturnScore: number;
    predictedPriceScore: number;
    transportEfficiency: number;
    priceTrendScore: number;
  };
  meetsMinPrice: boolean;
  isRecommended: boolean;
  rank: number;
}

export interface RecommendationEngineResult {
  analyses: MarketAnalysisResult[];
  recommended: MarketAnalysisResult | null;
  anyMeetsMinPrice: boolean;
  insight: string;
}
