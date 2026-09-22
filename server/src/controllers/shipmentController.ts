// ────────────────────────────────────────────────────────
// Shipment Controller
// ────────────────────────────────────────────────────────
// Shipment data comes from MySQL.
// No real courier integration yet (Pathao, RedX, Steadfast).

import type { Request, Response, NextFunction } from 'express';
import pool from '../config/database.js';
import type { ShipmentRow } from '../types/index.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { validateId } from '../middleware/validateRequest.js';

/**
 * GET /api/shipments/:id
 * Return a shipment by its ID.
 */
export async function getShipmentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'shipmentId');
    const [rows] = await pool.query<ShipmentRow[]>(
      `SELECT s.id, s.order_id, s.courier_name, s.tracking_number, s.delivery_fee,
              s.status, s.estimated_delivery_date, s.picked_up_at, s.delivered_at,
              s.created_at, s.updated_at
       FROM shipments s
       WHERE s.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      throw NotFoundError('Shipment');
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/:orderId/shipment
 * Return the shipment for a specific order.
 */
export async function getShipmentByOrderId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const orderId = validateId(req.params.orderId, 'orderId');
    const [rows] = await pool.query<ShipmentRow[]>(
      `SELECT s.id, s.order_id, s.courier_name, s.tracking_number, s.delivery_fee,
              s.status, s.estimated_delivery_date, s.picked_up_at, s.delivered_at,
              s.created_at, s.updated_at
       FROM shipments s
       WHERE s.order_id = ?`,
      [orderId]
    );
    if (rows.length === 0) {
      throw NotFoundError('Shipment for this order');
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}
