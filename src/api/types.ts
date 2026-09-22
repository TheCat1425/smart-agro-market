// ────────────────────────────────────────────────────────
// API Response Types
//
// TypeScript interfaces for REST API responses.
// Aligned with server/src/types/index.ts but using camelCase
// for frontend consumption.
// ────────────────────────────────────────────────────────

// ──────────── Wrapper ────────────

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

// ──────────── Health ────────────

export interface ApiHealth {
  status: 'ok' | 'degraded';
  database: 'connected' | 'unavailable';
  timestamp: string;
  uptime: number;
}

// ──────────── Commodities ────────────

export interface ApiCommodity {
  id: number;
  name: string;
  name_bn: string | null;
  category: string;
  unit: string;
  description: string | null;
  is_active: number;
  created_at: string;
}

// ──────────── Markets ────────────

export interface ApiMarket {
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
  created_at: string;
  updated_at: string;
}

// ──────────── Market Prices ────────────

export interface ApiMarketPrice {
  id?: number;
  market_id: number;
  commodity_id: number;
  price: number;
  min_price: number | null;
  max_price: number | null;
  unit: string;
  price_date: string;
  source?: string | null;
  market_name: string;
  market_district?: string;
  commodity_name: string;
}

// ──────────── Predictions ────────────

export interface ApiPrediction {
  id: number;
  commodity_id: number;
  market_id: number;
  prediction_date: string;
  target_date: string;
  predicted_price: number;
  confidence_score: number | null;
  model_name: string | null;
  model_version: string | null;
  commodity_name: string;
  market_name: string;
}

// ──────────── Products ────────────

export interface ApiProduct {
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
  created_at: string;
  updated_at: string;
  commodity_name: string;
  farmer_name: string;
  farm_name?: string;
  farmer_district?: string;
}

// ──────────── Orders ────────────

export interface ApiOrder {
  id: number;
  consumer_id: number;
  total_amount: number;
  delivery_fee: number;
  platform_fee: number;
  grand_total: number;
  payment_status: string;
  order_status: string;
  delivery_address: string | null;
  delivery_district: string | null;
  delivery_upazila: string | null;
  created_at: string;
  updated_at: string;
  consumer_name: string;
  items?: ApiOrderItem[];
}

export interface ApiOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  farmer_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_name: string;
  farmer_name: string;
}

// ──────────── Recommendations ────────────

export interface ApiMarketAnalysis {
  market: {
    id: number;
    name: string;
    district: string;
    baseTransportCost: number;
    transportCostPerKm: number;
  };
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

export interface ApiRecommendationResult {
  analyses: ApiMarketAnalysis[];
  recommended: ApiMarketAnalysis | null;
  anyMeetsMinPrice: boolean;
  insight: string;
  input: {
    commodityId: number;
    quantity: number;
    farmerLocation: string;
    harvestDate: string;
    minimumAcceptablePrice: number;
  };
}

// ──────────── Admin ────────────

export interface ApiAdminStats {
  totalFarmers: number;
  totalConsumers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeMarkets: number;
  activeCommodities: number;
}

export interface ApiRevenueEntry {
  period: string;
  revenue: number;
  order_count: number;
}

export interface ApiDistrictRevenue {
  district: string;
  revenue: number;
  order_count: number;
}

// ──────────── Shipments ────────────

export interface ApiShipment {
  id: number;
  order_id: number;
  courier_name: string | null;
  tracking_number: string | null;
  delivery_fee: number;
  status: string;
  estimated_delivery_date: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}
