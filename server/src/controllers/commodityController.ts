// ────────────────────────────────────────────────────────
// Commodity Controller
// ────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import pool from '../config/database.js';
import type { CommodityRow } from '../types/index.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { validateId } from '../middleware/validateRequest.js';

/**
 * GET /api/commodities
 * Return all active commodities.
 */
export async function getCommodities(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [rows] = await pool.query<CommodityRow[]>(
      'SELECT id, name, name_bn, category, unit, description, is_active, created_at FROM commodities WHERE is_active = 1 ORDER BY name'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/commodities/:id
 * Return a single commodity by ID.
 */
export async function getCommodityById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'commodityId');
    const [rows] = await pool.query<CommodityRow[]>(
      'SELECT id, name, name_bn, category, unit, description, is_active, created_at FROM commodities WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      throw NotFoundError('Commodity');
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}
