// ────────────────────────────────────────────────────────
// Market Price Controller
// ────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import pool from '../config/database.js';
import type { MarketPriceRow } from '../types/index.js';
import { buildWhereClause, dateRangeConditions, type FilterCondition } from '../utils/queryHelpers.js';

/**
 * GET /api/market-prices
 * Filter by: ?commodityId, ?marketId, ?startDate, ?endDate
 */
export async function getMarketPrices(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { commodityId, marketId, startDate, endDate } = req.query;

    const conditions: FilterCondition[] = [];
    if (commodityId) conditions.push({ field: 'mp.commodity_id', value: Number(commodityId) });
    if (marketId) conditions.push({ field: 'mp.market_id', value: Number(marketId) });
    conditions.push(...dateRangeConditions('mp.price_date', startDate as string, endDate as string));

    const { whereClause, params } = buildWhereClause(conditions);

    const [rows] = await pool.query<MarketPriceRow[]>(
      `SELECT mp.id, mp.market_id, mp.commodity_id, mp.price, mp.min_price, mp.max_price,
              mp.unit, mp.price_date, mp.source,
              m.name AS market_name, c.name AS commodity_name
       FROM market_prices mp
       JOIN markets m ON m.id = mp.market_id
       JOIN commodities c ON c.id = mp.commodity_id
       ${whereClause}
       ORDER BY mp.price_date DESC, m.name
       LIMIT 500`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/market-prices/latest
 * Latest price per market for a commodity.
 * Query: ?commodityId=1
 */
export async function getLatestPrices(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const commodityId = req.query.commodityId ? Number(req.query.commodityId) : null;

    // Subquery to find latest date per commodity-market pair
    let sql: string;
    const params: unknown[] = [];

    if (commodityId) {
      sql = `
        SELECT mp.market_id, mp.commodity_id, mp.price, mp.min_price, mp.max_price,
               mp.unit, mp.price_date,
               m.name AS market_name, m.district AS market_district,
               c.name AS commodity_name
        FROM market_prices mp
        JOIN markets m ON m.id = mp.market_id
        JOIN commodities c ON c.id = mp.commodity_id
        WHERE mp.commodity_id = ?
          AND mp.price_date = (
            SELECT MAX(mp2.price_date) FROM market_prices mp2
            WHERE mp2.commodity_id = mp.commodity_id AND mp2.market_id = mp.market_id
          )
        ORDER BY mp.price DESC`;
      params.push(commodityId);
    } else {
      sql = `
        SELECT mp.market_id, mp.commodity_id, mp.price, mp.min_price, mp.max_price,
               mp.unit, mp.price_date,
               m.name AS market_name, m.district AS market_district,
               c.name AS commodity_name
        FROM market_prices mp
        JOIN markets m ON m.id = mp.market_id
        JOIN commodities c ON c.id = mp.commodity_id
        WHERE mp.price_date = (
          SELECT MAX(mp2.price_date) FROM market_prices mp2
          WHERE mp2.commodity_id = mp.commodity_id AND mp2.market_id = mp.market_id
        )
        ORDER BY c.name, mp.price DESC`;
    }

    const [rows] = await pool.query<MarketPriceRow[]>(sql, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/market-prices/history
 * Chronological price data suitable for Recharts.
 * Query: ?commodityId=1&marketId=1&days=7
 */
export async function getPriceHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const commodityId = req.query.commodityId ? Number(req.query.commodityId) : null;
    const marketId = req.query.marketId ? Number(req.query.marketId) : null;
    const days = req.query.days ? Number(req.query.days) : 7;

    const conditions: FilterCondition[] = [];
    if (commodityId) conditions.push({ field: 'mp.commodity_id', value: commodityId });
    if (marketId) conditions.push({ field: 'mp.market_id', value: marketId });

    const { whereClause, params } = buildWhereClause(conditions);

    // Add date filter — note: if whereClause is empty, we need WHERE; if not, AND
    const dateFilter = whereClause
      ? `${whereClause} AND mp.price_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`
      : `WHERE mp.price_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
    params.push(days);

    const [rows] = await pool.query<MarketPriceRow[]>(
      `SELECT mp.price_date, mp.price, mp.min_price, mp.max_price,
              mp.market_id, mp.commodity_id,
              m.name AS market_name, c.name AS commodity_name
       FROM market_prices mp
       JOIN markets m ON m.id = mp.market_id
       JOIN commodities c ON c.id = mp.commodity_id
       ${dateFilter}
       ORDER BY mp.price_date ASC, m.name`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}
