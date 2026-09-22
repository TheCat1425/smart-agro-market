// ────────────────────────────────────────────────────────
// Farmer Controller
// ────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import pool from '../config/database.js';
import type { FarmerRow, ProductRow, OrderRow } from '../types/index.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { validateId } from '../middleware/validateRequest.js';

/**
 * GET /api/farmers
 * Return all farmers with their user info.
 */
export async function getFarmers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [rows] = await pool.query<FarmerRow[]>(
      `SELECT f.id, f.user_id, f.farm_name, f.farm_location, f.district, f.upazila,
              f.farm_size, f.verification_status, f.created_at,
              u.full_name, u.email, u.phone, u.location AS user_location
       FROM farmers f
       JOIN users u ON u.id = f.user_id
       WHERE u.is_active = 1
       ORDER BY u.full_name`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/farmers/:id
 * Return a single farmer with user info.
 */
export async function getFarmerById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'farmerId');
    const [rows] = await pool.query<FarmerRow[]>(
      `SELECT f.id, f.user_id, f.farm_name, f.farm_location, f.district, f.upazila,
              f.farm_size, f.verification_status, f.created_at, f.updated_at,
              u.full_name, u.email, u.phone, u.location AS user_location,
              u.latitude, u.longitude
       FROM farmers f
       JOIN users u ON u.id = f.user_id
       WHERE f.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      throw NotFoundError('Farmer');
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/farmers/:id/products
 * Return all products for a farmer.
 */
export async function getFarmerProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'farmerId');
    const [rows] = await pool.query<ProductRow[]>(
      `SELECT p.id, p.farmer_id, p.commodity_id, p.name, p.description, p.price,
              p.quantity_available, p.unit, p.quality_grade, p.image_url, p.organic,
              p.status, p.created_at, p.updated_at,
              c.name AS commodity_name
       FROM products p
       JOIN commodities c ON c.id = p.commodity_id
       WHERE p.farmer_id = ?
       ORDER BY p.created_at DESC`,
      [id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/farmers/:id/orders
 * Return all orders where this farmer has items.
 */
export async function getFarmerOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'farmerId');
    const [rows] = await pool.query<OrderRow[]>(
      `SELECT DISTINCT o.id, o.consumer_id, o.total_amount, o.delivery_fee,
              o.platform_fee, o.grand_total, o.payment_status, o.order_status,
              o.delivery_address, o.delivery_district, o.created_at, o.updated_at,
              u.full_name AS consumer_name
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN users u ON u.id = o.consumer_id
       WHERE oi.farmer_id = ?
       ORDER BY o.created_at DESC`,
      [id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}
