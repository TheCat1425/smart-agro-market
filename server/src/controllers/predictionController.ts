// ────────────────────────────────────────────────────────
// Prediction Controller
// ────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import pool from '../config/database.js';
import type { PricePredictionRow } from '../types/index.js';
import { buildWhereClause, type FilterCondition } from '../utils/queryHelpers.js';

/**
 * GET /api/predictions
 * Filter by: ?commodityId, ?marketId, ?targetDate
 */
export async function getPredictions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { commodityId, marketId, targetDate } = req.query;

    const conditions: FilterCondition[] = [];
    if (commodityId) conditions.push({ field: 'pp.commodity_id', value: Number(commodityId) });
    if (marketId) conditions.push({ field: 'pp.market_id', value: Number(marketId) });
    if (targetDate) conditions.push({ field: 'pp.target_date', value: targetDate });

    const { whereClause, params } = buildWhereClause(conditions);

    const [rows] = await pool.query<PricePredictionRow[]>(
      `SELECT pp.id, pp.commodity_id, pp.market_id, pp.prediction_date, pp.target_date,
              pp.predicted_price, pp.confidence_score, pp.model_name, pp.model_version,
              c.name AS commodity_name, m.name AS market_name
       FROM price_predictions pp
       JOIN commodities c ON c.id = pp.commodity_id
       JOIN markets m ON m.id = pp.market_id
       ${whereClause}
       ORDER BY pp.target_date DESC
       LIMIT 100`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/predictions/latest
 * Latest prediction for a commodity/market pair.
 * Query: ?commodityId=1&marketId=1
 */
export async function getLatestPrediction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { commodityId, marketId } = req.query;

    const conditions: FilterCondition[] = [];
    if (commodityId) conditions.push({ field: 'pp.commodity_id', value: Number(commodityId) });
    if (marketId) conditions.push({ field: 'pp.market_id', value: Number(marketId) });

    const { whereClause, params } = buildWhereClause(conditions);

    const [rows] = await pool.query<PricePredictionRow[]>(
      `SELECT pp.id, pp.commodity_id, pp.market_id, pp.prediction_date, pp.target_date,
              pp.predicted_price, pp.confidence_score, pp.model_name, pp.model_version,
              c.name AS commodity_name, m.name AS market_name
       FROM price_predictions pp
       JOIN commodities c ON c.id = pp.commodity_id
       JOIN markets m ON m.id = pp.market_id
       ${whereClause}
       ORDER BY pp.target_date DESC
       LIMIT 1`,
      params
    );

    if (rows.length === 0) {
      res.json({ success: true, data: null });
      return;
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}
