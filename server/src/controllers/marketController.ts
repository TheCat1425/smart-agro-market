// ────────────────────────────────────────────────────────
// Market Controller
// ────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import pool from '../config/database.js';
import type { MarketRow } from '../types/index.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { validateId } from '../middleware/validateRequest.js';
import { buildWhereClause, type FilterCondition } from '../utils/queryHelpers.js';

/**
 * GET /api/markets
 * Return active markets. Optional filter: ?district=Rajshahi
 */
export async function getMarkets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const conditions: FilterCondition[] = [
      { field: 'is_active', value: 1 },
    ];
    if (req.query.district) {
      conditions.push({ field: 'district', value: req.query.district });
    }

    const { whereClause, params } = buildWhereClause(conditions);
    const [rows] = await pool.query<MarketRow[]>(
      `SELECT id, name, name_bn, market_type, district, upazila, address,
              latitude, longitude, base_transport_cost, transport_cost_per_km,
              is_active, created_at, updated_at
       FROM markets ${whereClause} ORDER BY name`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/markets/:id
 * Return a single market by ID.
 */
export async function getMarketById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'marketId');
    const [rows] = await pool.query<MarketRow[]>(
      `SELECT id, name, name_bn, market_type, district, upazila, address,
              latitude, longitude, base_transport_cost, transport_cost_per_km,
              is_active, created_at, updated_at
       FROM markets WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      throw NotFoundError('Market');
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}
