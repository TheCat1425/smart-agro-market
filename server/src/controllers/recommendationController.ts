// ────────────────────────────────────────────────────────
// Recommendation Controller
// ────────────────────────────────────────────────────────
// Uses the recommendation service (ported from frontend engine)
// to analyze markets with data from MySQL.

import type { Request, Response, NextFunction } from 'express';
import type { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/database.js';
import type {
  MarketRow,
  MarketPriceRow,
  PricePredictionRow,
  RecommendationAnalyzeRequest,
  SaveRecommendationRequest,
  MarketData,
  PriceData,
  PredictionData,
} from '../types/index.js';
import { ValidationError } from '../middleware/errorHandler.js';
import {
  validateRequiredFields,
  validateId,
  validatePositiveNumber,
  validateRequiredString,
  validateDateString,
} from '../middleware/validateRequest.js';
import { analyzeMarkets } from '../services/recommendationService.js';

/**
 * POST /api/recommendations/analyze
 * Run the recommendation engine with live DB data.
 */
export async function analyzeRecommendation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body: RecommendationAnalyzeRequest = req.body;
    validateRequiredFields(body as unknown as Record<string, unknown>, [
      'commodityId', 'quantity', 'farmerLocation', 'harvestDate', 'minimumAcceptablePrice',
    ]);

    const commodityId = validateId(body.commodityId, 'commodityId');
    const quantity = validatePositiveNumber(body.quantity, 'quantity');
    const farmerLocation = validateRequiredString(body.farmerLocation, 'farmerLocation');
    const harvestDate = validateDateString(body.harvestDate, 'harvestDate');
    const minimumAcceptablePrice = body.minimumAcceptablePrice;

    if (minimumAcceptablePrice < 0) {
      throw ValidationError('minimumAcceptablePrice must not be negative');
    }

    // Fetch markets from DB
    const [marketRows] = await pool.query<MarketRow[]>(
      'SELECT id, name, district, base_transport_cost, transport_cost_per_km FROM markets WHERE is_active = 1'
    );

    const markets: MarketData[] = marketRows.map((m) => ({
      id: m.id,
      name: m.name,
      district: m.district,
      baseTransportCost: m.base_transport_cost,
      transportCostPerKm: m.transport_cost_per_km,
    }));

    // Fetch latest prices for this commodity
    const [priceRows] = await pool.query<MarketPriceRow[]>(
      `SELECT mp.market_id, mp.commodity_id, mp.price, mp.min_price, mp.max_price
       FROM market_prices mp
       WHERE mp.commodity_id = ?
         AND mp.price_date = (
           SELECT MAX(mp2.price_date) FROM market_prices mp2
           WHERE mp2.commodity_id = mp.commodity_id AND mp2.market_id = mp.market_id
         )`,
      [commodityId]
    );

    const prices: PriceData[] = priceRows.map((p) => ({
      marketId: p.market_id,
      commodityId: p.commodity_id,
      price: p.price,
      minPrice: p.min_price,
      maxPrice: p.max_price,
    }));

    // Fetch predictions
    const [predRows] = await pool.query<PricePredictionRow[]>(
      `SELECT commodity_id, market_id, predicted_price, confidence_score, target_date
       FROM price_predictions
       WHERE commodity_id = ?
       ORDER BY target_date DESC`,
      [commodityId]
    );

    const predictionsList: PredictionData[] = predRows.map((p) => ({
      commodityId: p.commodity_id,
      marketId: p.market_id,
      predictedPrice: p.predicted_price,
      confidenceScore: p.confidence_score ?? 0,
      targetDate: p.target_date,
    }));

    // Run the recommendation engine
    const result = analyzeMarkets(
      commodityId,
      quantity,
      farmerLocation,
      minimumAcceptablePrice,
      markets,
      prices,
      predictionsList
    );

    res.json({
      success: true,
      data: {
        ...result,
        input: {
          commodityId,
          quantity,
          farmerLocation,
          harvestDate,
          minimumAcceptablePrice,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/recommendations
 * Save a recommendation result to the database.
 */
export async function saveRecommendation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body: SaveRecommendationRequest = req.body;
    validateRequiredFields(body as unknown as Record<string, unknown>, [
      'farmerId', 'commodityId', 'quantity', 'farmerLocation', 'harvestDate',
      'recommendedMarketId', 'currentPrice', 'predictedPrice', 'expectedRevenue',
      'expectedNetReturn', 'recommendationScore',
    ]);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO market_recommendations (
         farmer_id, commodity_id, quantity, farmer_location, harvest_date,
         minimum_acceptable_price, recommended_market_id, current_price, predicted_price,
         estimated_distance, transport_cost, platform_fee, other_cost,
         expected_revenue, expected_net_return, recommendation_score
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.farmerId,
        body.commodityId,
        body.quantity,
        body.farmerLocation,
        body.harvestDate,
        body.minimumAcceptablePrice ?? null,
        body.recommendedMarketId,
        body.currentPrice,
        body.predictedPrice,
        body.estimatedDistance ?? null,
        body.transportCost ?? null,
        body.platformFee ?? null,
        body.otherCost ?? null,
        body.expectedRevenue,
        body.expectedNetReturn,
        body.recommendationScore,
      ]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, message: 'Recommendation saved successfully' },
    });
  } catch (error) {
    next(error);
  }
}
