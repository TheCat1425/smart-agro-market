/**
 * Smart Agro Market — Recommendation Calculation Engine
 *
 * Core academic concept:
 *   Net Return = Expected Selling Revenue − Transportation Cost − Platform Fee − Other Costs
 *   Expected Selling Revenue = Expected Market Price × Quantity
 *
 * This module is intentionally deterministic and explainable.
 * All formulas are transparent so the prototype can be defended
 * in an academic presentation.
 */

import {
  markets,
  commodities,
  priceData,
  predictions,
  type Market,
  type Commodity,
  type PricePrediction,
  type PriceEntry,
  formatBDT,
} from './mockData';

// ────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────

export interface FarmerInput {
  commodityId: string;
  quantity: number;       // kg
  farmerLocation: string; // district name, e.g. "Rajshahi"
  harvestDate: string;    // ISO date string
  minPricePerKg: number;  // ৳ per kg
}

export interface MarketAnalysis {
  market: Market;
  commodity: Commodity;

  // Prices
  currentPrice: number;     // ৳/kg — today's market price
  predictedPrice: number;   // ৳/kg — AI predicted price
  confidence: number;       // 0-100
  priceTrend: 'up' | 'down' | 'stable';

  // Revenue
  quantity: number;
  grossRevenue: number;     // predictedPrice × quantity

  // Costs
  estimatedDistanceKm: number;
  estimatedTransportCost: number;
  platformFee: number;      // 1% of gross revenue
  otherCosts: number;       // loading/unloading, wastage allowance
  totalCosts: number;

  // Bottom line
  netReturn: number;
  profitPerKg: number;

  // Score
  score: number;            // 0-100 composite
  scoreBreakdown: ScoreBreakdown;

  // Flags
  meetsMinPrice: boolean;
  isRecommended: boolean;
  rank: number;
}

export interface ScoreBreakdown {
  netReturnScore: number;       // 0-50
  predictedPriceScore: number;  // 0-20
  transportEfficiency: number;  // 0-20
  priceTrendScore: number;      // 0-10
}

export interface RecommendationResult {
  analyses: MarketAnalysis[];
  recommended: MarketAnalysis | null;
  anyMeetsMinPrice: boolean;
  insight: string;
  aiExplanation: string[];
  farmerInput: FarmerInput;
}

// ────────────────────────────────────────────────────────
// DISTANCE MATRIX (km)  —  Approximate road distances
// ────────────────────────────────────────────────────────

const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  Rajshahi: {
    Rajshahi: 5,      // local market, still some intra-city distance
    Naogaon: 65,
    Pabna: 120,
    Bogura: 110,
    Dhaka: 254,
  },
  Naogaon: {
    Rajshahi: 65,
    Naogaon: 5,
    Pabna: 155,
    Bogura: 80,
    Dhaka: 280,
  },
  Pabna: {
    Rajshahi: 120,
    Naogaon: 155,
    Pabna: 5,
    Bogura: 135,
    Dhaka: 180,
  },
  Bogura: {
    Rajshahi: 110,
    Naogaon: 80,
    Pabna: 135,
    Bogura: 5,
    Dhaka: 210,
  },
  Dhaka: {
    Rajshahi: 254,
    Naogaon: 280,
    Pabna: 180,
    Bogura: 210,
    Dhaka: 10,
  },
};

/**
 * Get estimated road distance between a farmer location and a market.
 */
export function getDistance(farmerLocation: string, marketDistrict: string): number {
  return DISTANCE_MATRIX[farmerLocation]?.[marketDistrict] ?? 200; // fallback
}

// ────────────────────────────────────────────────────────
// TRANSPORT COST FORMULA
// ────────────────────────────────────────────────────────

/**
 * Estimated transport cost (৳):
 *   base = ৳200 (fixed loading/fuel startup)
 *   per-km = ৳8/km
 *   quantity factor = ৳0.5 per kg (for weight-based surcharge)
 *
 * Total = base + (distance × perKm) + (quantity × quantityRate)
 *
 * This is a simplified, deterministic formula.
 * A production system would use real logistics APIs.
 */
const TRANSPORT_BASE = 200;       // ৳
const TRANSPORT_PER_KM = 8;       // ৳/km
const TRANSPORT_PER_KG = 0.5;     // ৳/kg

export function calculateTransportCost(distanceKm: number, quantityKg: number): number {
  if (distanceKm <= 5) {
    // Local market — minimal transport
    return 100 + quantityKg * 0.2;
  }
  return TRANSPORT_BASE + (distanceKm * TRANSPORT_PER_KM) + (quantityKg * TRANSPORT_PER_KG);
}

// ────────────────────────────────────────────────────────
// PLATFORM FEE & OTHER COSTS
// ────────────────────────────────────────────────────────

const PLATFORM_FEE_RATE = 0.01;   // 1% of gross revenue
const OTHER_COSTS_RATE = 0.005;   // 0.5% — loading, wastage, etc.
const OTHER_COSTS_FIXED = 150;    // ৳ fixed handling per transaction

export function calculatePlatformFee(grossRevenue: number): number {
  return Math.round(grossRevenue * PLATFORM_FEE_RATE);
}

export function calculateOtherCosts(grossRevenue: number): number {
  return Math.round(OTHER_COSTS_FIXED + grossRevenue * OTHER_COSTS_RATE);
}

// ────────────────────────────────────────────────────────
// PREDICTED PRICE HELPER
// ────────────────────────────────────────────────────────

/**
 * Get predicted price for a commodity at a market.
 * Falls back to generating a mock prediction from current price
 * if no prediction exists in the data.
 */
export function getPredictedPriceInfo(
  commodityId: string,
  marketId: string,
  currentPrice: number
): { predictedPrice: number; confidence: number; trend: 'up' | 'down' | 'stable' } {
  const pred = predictions.find(
    (p) => p.commodityId === commodityId && p.marketId === marketId
  );

  if (pred) {
    return {
      predictedPrice: pred.predictedPrice,
      confidence: pred.confidence,
      trend: pred.trend,
    };
  }

  // Generate a realistic mock prediction based on current price
  // Use a deterministic seed from commodity+market IDs
  const seed = (commodityId.charCodeAt(1) * 7 + marketId.charCodeAt(1) * 13) % 100;
  const delta = seed < 40 ? 1.05 : seed < 70 ? 0.97 : 1.02;
  const predictedPrice = Math.round(currentPrice * delta);
  const confidence = 65 + (seed % 25);
  const trend: 'up' | 'down' | 'stable' =
    delta > 1.03 ? 'up' : delta < 0.98 ? 'down' : 'stable';

  return { predictedPrice, confidence, trend };
}

// ────────────────────────────────────────────────────────
// SCORE CALCULATION
// ────────────────────────────────────────────────────────

/**
 * Recommendation score out of 100:
 *   Net Return weight:        50%
 *   Predicted Price weight:   20%
 *   Transport Efficiency:     20%
 *   Price Trend:              10%
 */
function calculateScore(
  netReturn: number,
  maxNetReturn: number,
  predictedPrice: number,
  maxPredictedPrice: number,
  transportCost: number,
  maxTransportCost: number,
  priceTrend: 'up' | 'down' | 'stable'
): { score: number; breakdown: ScoreBreakdown } {
  // Normalize each factor to 0-1
  const netReturnNorm = maxNetReturn > 0 ? netReturn / maxNetReturn : 0;
  const priceNorm = maxPredictedPrice > 0 ? predictedPrice / maxPredictedPrice : 0;
  // Transport efficiency: lower cost = better → invert
  const transportNorm = maxTransportCost > 0
    ? 1 - (transportCost / maxTransportCost)
    : 1;
  const trendNorm = priceTrend === 'up' ? 1 : priceTrend === 'stable' ? 0.6 : 0.2;

  const breakdown: ScoreBreakdown = {
    netReturnScore: Math.round(netReturnNorm * 50),
    predictedPriceScore: Math.round(priceNorm * 20),
    transportEfficiency: Math.round(transportNorm * 20),
    priceTrendScore: Math.round(trendNorm * 10),
  };

  const score = breakdown.netReturnScore +
    breakdown.predictedPriceScore +
    breakdown.transportEfficiency +
    breakdown.priceTrendScore;

  return { score: Math.min(100, Math.max(0, score)), breakdown };
}

// ────────────────────────────────────────────────────────
// MAIN ANALYSIS FUNCTION
// ────────────────────────────────────────────────────────

export function analyzeMarkets(input: FarmerInput): RecommendationResult {
  const { commodityId, quantity, farmerLocation, minPricePerKg } = input;
  const commodity = commodities.find((c) => c.id === commodityId);

  if (!commodity) {
    return {
      analyses: [],
      recommended: null,
      anyMeetsMinPrice: false,
      insight: 'Please select a valid commodity.',
      aiExplanation: [],
      farmerInput: input,
    };
  }

  // Phase 1: Calculate raw numbers for every market
  const rawAnalyses: Omit<MarketAnalysis, 'score' | 'scoreBreakdown' | 'isRecommended' | 'rank'>[] = [];

  for (const market of markets) {
    const priceEntry = priceData.find(
      (p) => p.commodityId === commodityId && p.marketId === market.id
    );
    const currentPrice = priceEntry?.price ?? 0;

    const { predictedPrice, confidence, trend } = getPredictedPriceInfo(
      commodityId,
      market.id,
      currentPrice
    );

    const grossRevenue = predictedPrice * quantity;
    const distanceKm = getDistance(farmerLocation, market.district);
    const transportCost = calculateTransportCost(distanceKm, quantity);
    const platformFee = calculatePlatformFee(grossRevenue);
    const otherCosts = calculateOtherCosts(grossRevenue);
    const totalCosts = transportCost + platformFee + otherCosts;
    const netReturn = grossRevenue - totalCosts;
    const profitPerKg = quantity > 0 ? netReturn / quantity : 0;
    const meetsMinPrice = predictedPrice >= minPricePerKg;

    rawAnalyses.push({
      market,
      commodity,
      currentPrice,
      predictedPrice,
      confidence,
      priceTrend: trend,
      quantity,
      grossRevenue,
      estimatedDistanceKm: distanceKm,
      estimatedTransportCost: transportCost,
      platformFee,
      otherCosts,
      totalCosts,
      netReturn,
      profitPerKg,
      meetsMinPrice,
    });
  }

  // Phase 2: Compute scores (requires knowing max values across all markets)
  const maxNetReturn = Math.max(...rawAnalyses.map((a) => a.netReturn), 1);
  const maxPredictedPrice = Math.max(...rawAnalyses.map((a) => a.predictedPrice), 1);
  const maxTransportCost = Math.max(...rawAnalyses.map((a) => a.estimatedTransportCost), 1);

  const analysesWithScores: MarketAnalysis[] = rawAnalyses.map((raw) => {
    const { score, breakdown } = calculateScore(
      raw.netReturn,
      maxNetReturn,
      raw.predictedPrice,
      maxPredictedPrice,
      raw.estimatedTransportCost,
      maxTransportCost,
      raw.priceTrend
    );

    return {
      ...raw,
      score,
      scoreBreakdown: breakdown,
      isRecommended: false,
      rank: 0,
    };
  });

  // Phase 3: Rank by net return (primary), then by score (tiebreaker)
  analysesWithScores.sort((a, b) => {
    if (b.netReturn !== a.netReturn) return b.netReturn - a.netReturn;
    return b.score - a.score;
  });

  analysesWithScores.forEach((a, i) => {
    a.rank = i + 1;
  });

  // Phase 4: Determine recommendation
  const anyMeetsMinPrice = analysesWithScores.some((a) => a.meetsMinPrice);
  const qualifying = analysesWithScores.filter((a) => a.meetsMinPrice);
  const recommended = qualifying.length > 0 ? qualifying[0] : analysesWithScores[0];

  if (recommended) {
    recommended.isRecommended = true;
  }

  // Phase 5: Generate dynamic insight
  const insight = generateInsight(analysesWithScores, commodity, recommended, anyMeetsMinPrice);
  const aiExplanation = generateAIExplanation(analysesWithScores, recommended, minPricePerKg, anyMeetsMinPrice);

  return {
    analyses: analysesWithScores,
    recommended,
    anyMeetsMinPrice,
    insight,
    aiExplanation,
    farmerInput: input,
  };
}

// ────────────────────────────────────────────────────────
// INSIGHT GENERATION (dynamic, not hard-coded)
// ────────────────────────────────────────────────────────

function generateInsight(
  analyses: MarketAnalysis[],
  commodity: Commodity,
  recommended: MarketAnalysis | null,
  anyMeetsMinPrice: boolean
): string {
  if (!recommended || analyses.length === 0) {
    return 'No market data available for analysis.';
  }

  // Find highest-price market
  const highestPriceMarket = [...analyses].sort(
    (a, b) => b.predictedPrice - a.predictedPrice
  )[0];

  // If the highest price market is NOT the recommended one
  if (highestPriceMarket.market.id !== recommended.market.id) {
    return (
      `${highestPriceMarket.market.name} offers the highest predicted price at ` +
      `${formatBDT(highestPriceMarket.predictedPrice)}/kg, but higher transportation ` +
      `costs (${formatBDT(highestPriceMarket.estimatedTransportCost)}) reduce the ` +
      `expected net return. ${recommended.market.name} is currently the most ` +
      `profitable option with a net return of ${formatBDT(Math.round(recommended.netReturn))}.`
    );
  }

  // Highest price market IS the recommended one
  return (
    `${recommended.market.name} offers both the highest predicted price at ` +
    `${formatBDT(recommended.predictedPrice)}/kg and the highest net return of ` +
    `${formatBDT(Math.round(recommended.netReturn))}. This market is ` +
    `the clear best choice for ${commodity.name}.`
  );
}

// ────────────────────────────────────────────────────────
// AI EXPLANATION (dynamic bullet points)
// ────────────────────────────────────────────────────────

function generateAIExplanation(
  analyses: MarketAnalysis[],
  recommended: MarketAnalysis | null,
  minPricePerKg: number,
  anyMeetsMinPrice: boolean
): string[] {
  if (!recommended) return ['No markets available for analysis.'];

  const bullets: string[] = [];

  // 1. Net return
  bullets.push(
    `Highest expected net return of ${formatBDT(Math.round(recommended.netReturn))} ` +
    `after deducting all estimated costs.`
  );

  // 2. Transport
  const avgTransport =
    analyses.reduce((sum, a) => sum + a.estimatedTransportCost, 0) / analyses.length;
  if (recommended.estimatedTransportCost <= avgTransport) {
    bullets.push(
      `Transportation cost (${formatBDT(Math.round(recommended.estimatedTransportCost))}) ` +
      `is below the average of ${formatBDT(Math.round(avgTransport))} across all markets.`
    );
  } else {
    bullets.push(
      `Transportation cost is ${formatBDT(Math.round(recommended.estimatedTransportCost))} — ` +
      `higher than average, but offset by the better selling price.`
    );
  }

  // 3. Price
  if (recommended.priceTrend === 'up') {
    bullets.push(
      `Predicted price trend is upward (${formatBDT(recommended.predictedPrice)}/kg), ` +
      `suggesting favorable selling conditions.`
    );
  } else if (recommended.priceTrend === 'stable') {
    bullets.push(
      `Predicted price is stable at ${formatBDT(recommended.predictedPrice)}/kg ` +
      `with ${recommended.confidence}% confidence.`
    );
  } else {
    bullets.push(
      `Price trend is slightly downward, but the net return at ` +
      `${formatBDT(recommended.predictedPrice)}/kg still makes this the best option.`
    );
  }

  // 4. Min price check
  if (recommended.meetsMinPrice) {
    bullets.push(
      `Meets your minimum acceptable price of ${formatBDT(minPricePerKg)}/kg.`
    );
  } else {
    bullets.push(
      `⚠ Does not meet your minimum acceptable price of ${formatBDT(minPricePerKg)}/kg. ` +
      `This is shown as the best available alternative.`
    );
  }

  // 5. Markets failing min price
  const failingMarkets = analyses.filter((a) => !a.meetsMinPrice);
  if (failingMarkets.length > 0 && anyMeetsMinPrice) {
    const names = failingMarkets.map((a) => a.market.name).join(', ');
    bullets.push(
      `Markets below minimum price threshold: ${names}.`
    );
  }

  return bullets;
}

// ────────────────────────────────────────────────────────
// FARMER LOCATIONS (for form dropdown)
// ────────────────────────────────────────────────────────

export const farmerLocations = [
  { value: 'Rajshahi', label: 'Rajshahi', labelBn: 'রাজশাহী' },
  { value: 'Naogaon', label: 'Naogaon', labelBn: 'নওগাঁ' },
  { value: 'Pabna', label: 'Pabna', labelBn: 'পাবনা' },
  { value: 'Bogura', label: 'Bogura', labelBn: 'বগুড়া' },
  { value: 'Dhaka', label: 'Dhaka', labelBn: 'ঢাকা' },
];

// ────────────────────────────────────────────────────────
// SCORE WEIGHT LABELS (for UI display)
// ────────────────────────────────────────────────────────

export const SCORE_WEIGHTS = [
  { label: 'Net Return', weight: '50%', color: '#16a34a', description: 'Expected profit after all costs' },
  { label: 'Predicted Price', weight: '20%', color: '#2563eb', description: 'AI-predicted selling price at market' },
  { label: 'Transport Efficiency', weight: '20%', color: '#f59e0b', description: 'Lower transport cost = higher score' },
  { label: 'Price Trend', weight: '10%', color: '#8b5cf6', description: 'Upward trend earns more points' },
];

// ────────────────────────────────────────────────────────
// VALIDATION
// ────────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export function validateInput(input: Partial<FarmerInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.commodityId) {
    errors.push({ field: 'commodityId', message: 'Please select a commodity.' });
  }

  if (!input.quantity || input.quantity <= 0) {
    errors.push({ field: 'quantity', message: 'Please enter a valid quantity (> 0 kg).' });
  } else if (input.quantity > 50000) {
    errors.push({ field: 'quantity', message: 'Maximum quantity is 50,000 kg per analysis.' });
  }

  if (!input.farmerLocation) {
    errors.push({ field: 'farmerLocation', message: 'Please select your location.' });
  }

  if (!input.harvestDate) {
    errors.push({ field: 'harvestDate', message: 'Please select an expected harvest date.' });
  }

  if (input.minPricePerKg !== undefined && input.minPricePerKg < 0) {
    errors.push({ field: 'minPricePerKg', message: 'Minimum price cannot be negative.' });
  }

  return errors;
}
