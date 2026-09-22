// ────────────────────────────────────────────────────────
// Order Controller
// ────────────────────────────────────────────────────────
// NOTE: Authentication is NOT yet implemented.
// Order creation does NOT verify consumer identity.
// This will be secured in a separate task.

import type { Request, Response, NextFunction } from 'express';
import pool from '../config/database.js';
import type { OrderRow, OrderItemRow, CreateOrderRequest } from '../types/index.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { validateId, validateRequiredFields, validateEnum } from '../middleware/validateRequest.js';
import { createOrder } from '../services/orderService.js';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

/**
 * GET /api/orders
 * Return all orders.
 */
export async function getOrders(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [rows] = await pool.query<OrderRow[]>(
      `SELECT o.id, o.consumer_id, o.total_amount, o.delivery_fee, o.platform_fee,
              o.grand_total, o.payment_status, o.order_status, o.delivery_address,
              o.delivery_district, o.delivery_upazila, o.created_at, o.updated_at,
              u.full_name AS consumer_name
       FROM orders o
       JOIN users u ON u.id = o.consumer_id
       ORDER BY o.created_at DESC
       LIMIT 100`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/:id
 * Return a single order with its items.
 */
export async function getOrderById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'orderId');

    const [orders] = await pool.query<OrderRow[]>(
      `SELECT o.id, o.consumer_id, o.total_amount, o.delivery_fee, o.platform_fee,
              o.grand_total, o.payment_status, o.order_status, o.delivery_address,
              o.delivery_district, o.delivery_upazila, o.created_at, o.updated_at,
              u.full_name AS consumer_name
       FROM orders o
       JOIN users u ON u.id = o.consumer_id
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      throw NotFoundError('Order');
    }

    const [items] = await pool.query<OrderItemRow[]>(
      `SELECT oi.id, oi.order_id, oi.product_id, oi.farmer_id, oi.quantity,
              oi.unit_price, oi.subtotal,
              p.name AS product_name,
              u.full_name AS farmer_name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       JOIN farmers f ON f.id = oi.farmer_id
       JOIN users u ON u.id = f.user_id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...orders[0],
        items,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/orders
 * Create a new order with transaction.
 * Prices are retrieved from MySQL — NOT trusted from the browser.
 */
export async function createNewOrder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body: CreateOrderRequest = req.body;
    validateRequiredFields(body as unknown as Record<string, unknown>, [
      'consumerId', 'items', 'deliveryAddress', 'deliveryDistrict',
    ]);

    if (!Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Order must contain at least one item' },
      });
      return;
    }

    const result = await createOrder(body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/orders/:id/status
 * Update order status.
 */
export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'orderId');
    const status = validateEnum(req.body.status, ORDER_STATUSES, 'status');

    const [result] = await pool.query<import('mysql2/promise').ResultSetHeader>(
      'UPDATE orders SET order_status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      throw NotFoundError('Order');
    }

    res.json({ success: true, data: { message: `Order status updated to ${status}` } });
  } catch (error) {
    next(error);
  }
}
