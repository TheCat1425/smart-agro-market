// ────────────────────────────────────────────────────────
// Admin Controller
// ────────────────────────────────────────────────────────
// Read-only endpoints using MySQL aggregation queries.
// NOTE: No authentication — accessible to anyone for now.

import type { Request, Response, NextFunction } from 'express';
import pool from '../config/database.js';
import type { RowDataPacket } from 'mysql2';

interface StatsRow extends RowDataPacket {
  count: number;
}

interface RevenueRow extends RowDataPacket {
  period: string;
  revenue: number;
  order_count: number;
}

interface DistrictRevenueRow extends RowDataPacket {
  district: string;
  revenue: number;
  order_count: number;
}

/**
 * GET /api/admin/stats
 * Platform-wide statistics from MySQL aggregation.
 */
export async function getStats(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Run all stat queries in parallel
    const [
      [farmersResult],
      [consumersResult],
      [productsResult],
      [ordersResult],
      [revenueResult],
      [marketsResult],
      [commoditiesResult],
    ] = await Promise.all([
      pool.query<StatsRow[]>("SELECT COUNT(*) AS count FROM farmers"),
      pool.query<StatsRow[]>("SELECT COUNT(*) AS count FROM users WHERE role = 'CONSUMER' AND is_active = 1"),
      pool.query<StatsRow[]>("SELECT COUNT(*) AS count FROM products WHERE status = 'ACTIVE'"),
      pool.query<StatsRow[]>("SELECT COUNT(*) AS count FROM orders"),
      pool.query<StatsRow[]>("SELECT COALESCE(SUM(grand_total), 0) AS count FROM orders WHERE payment_status = 'PAID'"),
      pool.query<StatsRow[]>("SELECT COUNT(*) AS count FROM markets WHERE is_active = 1"),
      pool.query<StatsRow[]>("SELECT COUNT(*) AS count FROM commodities WHERE is_active = 1"),
    ]);

    res.json({
      success: true,
      data: {
        totalFarmers: farmersResult[0].count,
        totalConsumers: consumersResult[0].count,
        totalProducts: productsResult[0].count,
        totalOrders: ordersResult[0].count,
        totalRevenue: revenueResult[0].count,
        activeMarkets: marketsResult[0].count,
        activeCommodities: commoditiesResult[0].count,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/revenue
 * Revenue grouped by month.
 */
export async function getRevenue(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [rows] = await pool.query<RevenueRow[]>(
      `SELECT
         DATE_FORMAT(created_at, '%Y-%m') AS period,
         SUM(grand_total) AS revenue,
         COUNT(*) AS order_count
       FROM orders
       WHERE payment_status = 'PAID'
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY period DESC
       LIMIT 12`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/district-revenue
 * Revenue grouped by delivery district.
 */
export async function getDistrictRevenue(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [rows] = await pool.query<DistrictRevenueRow[]>(
      `SELECT
         COALESCE(delivery_district, 'Unknown') AS district,
         SUM(grand_total) AS revenue,
         COUNT(*) AS order_count
       FROM orders
       WHERE payment_status = 'PAID'
       GROUP BY delivery_district
       ORDER BY revenue DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}
