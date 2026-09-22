// ────────────────────────────────────────────────────────
// Market Recommendation Service
//
// Ported from src/data/recommendationEngine.ts
// Same formulas, adapted to work with DB data instead of mock imports.
//
// Core formula:
//   Net Return = Gross Revenue − Transport Cost − Platform Fee − Other Costs
//   Gross Revenue = Predicted Price × Quantity
//
// Score (0-100):
//   Net Return:        50%
//   Predicted Price:   20%
//   Transport Efficiency: 20%
//   Price Trend:       10%
// ────────────────────────────────────────────────────────

import type {
  MarketData,
  PriceData,
  PredictionData,
  MarketAnalysisResult,
  RecommendationEngineResult,
} from '../types/index.js';

// ──────────── Distance Matrix (km) ────────────
// Approximate road distances between districts

const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  Rajshahi: { Rajshahi: 5, Naogaon: 65, Pabna: 120, Bogura: 110, Dhaka: 254 },
  Naogaon:  { Rajshahi: 65, Naogaon: 5, Pabna: 155, Bogura: 80, Dhaka: 280 },
  Pabna:    { Rajshahi: 120, Naogaon: 155, Pabna: 5, Bogura: 135, Dhaka: 180 },
  Bogura:   { Rajshahi: 110, Naogaon: 80, Pabna: 135, Bogura: 5, Dhaka: 210 },
  Dhaka:    { Rajshahi: 254, Naogaon: 280, Pabna: 180, Bogura: 210, Dhaka: 10 },
};

export function getDistance(farmerLocation: string, marketDistrict: string): number {
  return DISTANCE_MATRIX[farmerLocation]?.[marketDistrict] ?? 200;
}

// ──────────── Transport Cost ────────────

const TRANSPORT_BASE = 200;
const TRANSPORT_PER_KM = 8;
const TRANSPORT_PER_KG = 0.5;

export function calculateTransportCost(distanceKm: number, quantityKg: number): number {
  if (distanceKm <= 5) {
    return 100 + quantityKg * 0.2;
  }
  return TRANSPORT_BASE + (distanceKm * TRANSPORT_PER_KM) + (quantityKg * TRANSPORT_PER_KG);
}

// ──────────── Platform Fee & Other Costs ────────────

const PLATFORM_FEE_RATE = 0.01;   // 1% of gross revenue
const OTHER_COSTS_RATE = 0.005;   // 0.5%
const OTHER_COSTS_FIXED = 150;    // ৳

export function calculatePlatformFee(grossRevenue: number): number {
  return Math.round(grossRevenue * PLATFORM_FEE_RATE);
}

export function calculateOtherCosts(grossRevenue: number): number {
  return Math.round(OTHER_COSTS_FIXED + grossRevenue * OTHER_COSTS_RATE);
}

// ──────────── Predicted Price ────────────

function getPredictedPriceInfo(
  commodityId: number,
  marketId: number,
  currentPrice: number,
  predictions: PredictionData[]
): { predictedPrice: number; confidence: number; trend: 'up' | 'down' | 'stable' } {
  const pred = predictions.find(
    (p) => p.commodityId === commodityId && p.marketId === marketId
  );

  if (pred) {
    const trend: 'up' | 'down' | 'stable' =
      pred.predictedPrice > currentPrice * 1.02
        ? 'up'
        : pred.predictedPrice < currentPrice * 0.98
          ? 'down'
          : 'stable';
    return {
      predictedPrice: pred.predictedPrice,
      confidence: pred.confidenceScore,
      trend,
    };
  }

  // Deterministic fallback from original engine
  const seed = (commodityId * 7 + marketId * 13) % 100;
  const delta = seed < 40 ? 1.05 : seed < 70 ? 0.97 : 1.02;
  const predictedPrice = Math.round(currentPrice * delta);
  const confidence = 65 + (seed % 25);
  const trend: 'up' | 'down' | 'stable' =
    delta > 1.03 ? 'up' : delta < 0.98 ? 'down' : 'stable';

  return { predictedPrice, confidence, trend };
}

// ──────────── Score Calculation ────────────

interface ScoreBreakdown {
  netReturnScore: number;
  predictedPriceScore: number;
  transportEfficiency: number;
  priceTrendScore: number;
}

function calculateScore(
  netReturn: number,
  maxNetReturn: number,
  predictedPrice: number,
  maxPredictedPrice: number,
  transportCost: number,
  maxTransportCost: number,
  priceTrend: 'up' | 'down' | 'stable'
): { score: number; breakdown: ScoreBreakdown } {
  const netReturnNorm = maxNetReturn > 0 ? netReturn / maxNetReturn : 0;
  const priceNorm = maxPredictedPrice > 0 ? predictedPrice / maxPredictedPrice : 0;
  const transportNorm = maxTransportCost > 0 ? 1 - (transportCost / maxTransportCost) : 1;
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

// ──────────── Format BDT ────────────

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

// ──────────── Insight Generation ────────────

function generateInsight(
  analyses: MarketAnalysisResult[],
  recommended: MarketAnalysisResult | null
): string {
  if (!recommended || analyses.length === 0) {
    return 'No market data available for analysis.';
  }

  const highestPriceMarket = [...analyses].sort(
    (a, b) => b.predictedPrice - a.predictedPrice
  )[0];

  if (highestPriceMarket.market.id !== recommended.market.id) {
    return (
      `${highestPriceMarket.market.name} offers the highest predicted price at ` +
      `${formatBDT(highestPriceMarket.predictedPrice)}/kg, but higher transportation ` +
      `costs (${formatBDT(Math.round(highestPriceMarket.estimatedTransportCost))}) reduce the ` +
      `expected net return. ${recommended.market.name} is currently the most ` +
      `profitable option with a net return of ${formatBDT(Math.round(recommended.netReturn))}.`
    );
  }

  return (
    `${recommended.market.name} offers both the highest predicted price at ` +
    `${formatBDT(recommended.predictedPrice)}/kg and the highest net return of ` +
    `${formatBDT(Math.round(recommended.netReturn))}. This market is the clear best choice.`
  );
}

// ──────────── Main Analysis Function ────────────

export function analyzeMarkets(
  commodityId: number,
  quantity: number,
  farmerLocation: string,
  minimumAcceptablePrice: number,
  markets: MarketData[],
  prices: PriceData[],
  predictionsList: PredictionData[]
): RecommendationEngineResult {
  if (markets.length === 0) {
    return {
      analyses: [],
      recommended: null,
      anyMeetsMinPrice: false,
      insight: 'No market data available for analysis.',
    };
  }

  // Phase 1: Calculate raw numbers for every market
  type RawAnalysis = Omit<MarketAnalysisResult, 'score' | 'scoreBreakdown' | 'isRecommended' | 'rank'>;
  const rawAnalyses: RawAnalysis[] = [];

  for (const market of markets) {
    const priceEntry = prices.find(
      (p) => p.commodityId === commodityId && p.marketId === market.id
    );
    const currentPrice = priceEntry?.price ?? 0;

    const { predictedPrice, confidence, trend } = getPredictedPriceInfo(
      commodityId, market.id, currentPrice, predictionsList
    );

    const grossRevenue = predictedPrice * quantity;
    const distanceKm = getDistance(farmerLocation, market.district);
    const transportCost = calculateTransportCost(distanceKm, quantity);
    const platformFee = calculatePlatformFee(grossRevenue);
    const otherCosts = calculateOtherCosts(grossRevenue);
    const totalCosts = transportCost + platformFee + otherCosts;
    const netReturn = grossRevenue - totalCosts;
    const profitPerKg = quantity > 0 ? netReturn / quantity : 0;
    const meetsMinPrice = predictedPrice >= minimumAcceptablePrice;

    rawAnalyses.push({
      market,
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

  // Phase 2: Compute scores
  const maxNetReturn = Math.max(...rawAnalyses.map((a) => a.netReturn), 1);
  const maxPredictedPrice = Math.max(...rawAnalyses.map((a) => a.predictedPrice), 1);
  const maxTransportCost = Math.max(...rawAnalyses.map((a) => a.estimatedTransportCost), 1);

  const analysesWithScores: MarketAnalysisResult[] = rawAnalyses.map((raw) => {
    const { score, breakdown } = calculateScore(
      raw.netReturn, maxNetReturn,
      raw.predictedPrice, maxPredictedPrice,
      raw.estimatedTransportCost, maxTransportCost,
      raw.priceTrend
    );
    return { ...raw, score, scoreBreakdown: breakdown, isRecommended: false, rank: 0 };
  });

  // Phase 3: Rank
  analysesWithScores.sort((a, b) => {
    if (b.netReturn !== a.netReturn) return b.netReturn - a.netReturn;
    return b.score - a.score;
  });
  analysesWithScores.forEach((a, i) => { a.rank = i + 1; });

  // Phase 4: Determine recommendation
  const anyMeetsMinPrice = analysesWithScores.some((a) => a.meetsMinPrice);
  const qualifying = analysesWithScores.filter((a) => a.meetsMinPrice);
  const recommended = qualifying.length > 0 ? qualifying[0] : analysesWithScores[0];

  if (recommended) {
    recommended.isRecommended = true;
  }

  // Phase 5: Insight
  const insight = generateInsight(analysesWithScores, recommended);

  return {
    analyses: analysesWithScores,
    recommended,
    anyMeetsMinPrice,
    insight,
  };
}
