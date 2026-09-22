// ────────────────────────────────────────────────────────
// Order Service — Transactional Order Creation
//
// Uses MySQL transactions to ensure atomicity:
//   BEGIN → validate → retrieve prices → calculate → INSERT → COMMIT/ROLLBACK
//
// IMPORTANT: Prices are retrieved from MySQL, NOT trusted from the browser.
// ────────────────────────────────────────────────────────

import type { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/database.js';
import type { ProductRow, CreateOrderRequest } from '../types/index.js';
import { AppError, NotFoundError, ValidationError } from '../middleware/errorHandler.js';

// Fee constants (consistent with recommendation service)
const PLATFORM_FEE_RATE = 0.02;        // 2% of subtotal for orders
const DELIVERY_FEE_BASE = 60;          // ৳ base delivery fee
const DELIVERY_FEE_PER_ITEM = 20;      // ৳ per additional item

interface OrderItem {
  productId: number;
  farmerId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderResult {
  orderId: number;
  totalAmount: number;
  deliveryFee: number;
  platformFee: number;
  grandTotal: number;
  items: OrderItem[];
}

/**
 * Create an order using a database transaction.
 *
 * Steps:
 * 1. Validate all product IDs exist and are ACTIVE
 * 2. Validate requested quantities
 * 3. Retrieve current prices from MySQL (NOT from client)
 * 4. Calculate line subtotals, delivery fee, platform fee, grand total
 * 5. INSERT order and order_items
 * 6. COMMIT on success, ROLLBACK on any failure
 */
export async function createOrder(request: CreateOrderRequest): Promise<OrderResult> {
  if (!request.items || request.items.length === 0) {
    throw ValidationError('Order must contain at least one item');
  }

  const connection: PoolConnection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    // Step 1-3: Validate each item and retrieve prices from DB
    for (const item of request.items) {
      if (!Number.isInteger(item.productId) || item.productId <= 0) {
        throw ValidationError(`Invalid product ID: ${item.productId}`);
      }
      if (item.quantity <= 0) {
        throw ValidationError(`Quantity must be positive for product ${item.productId}`);
      }

      // Retrieve product from MySQL — price comes from DB, not client
      const [products] = await connection.query<ProductRow[]>(
        'SELECT * FROM products WHERE id = ? AND status = ?',
        [item.productId, 'ACTIVE']
      );

      if (products.length === 0) {
        throw NotFoundError(`Product with ID ${item.productId} (must be ACTIVE)`);
      }

      const product = products[0];

      if (item.quantity > product.quantity_available) {
        throw new AppError(
          400,
          'INSUFFICIENT_QUANTITY',
          `Requested ${item.quantity} ${product.unit} of "${product.name}" but only ${product.quantity_available} available`
        );
      }

      const unitPrice = product.price; // From MySQL, NOT from browser
      const subtotal = unitPrice * item.quantity;

      orderItems.push({
        productId: product.id,
        farmerId: product.farmer_id,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      });

      totalAmount += subtotal;
    }

    // Step 4: Calculate fees
    const deliveryFee = DELIVERY_FEE_BASE + (orderItems.length - 1) * DELIVERY_FEE_PER_ITEM;
    const platformFee = Math.round(totalAmount * PLATFORM_FEE_RATE);
    const grandTotal = totalAmount + deliveryFee + platformFee;

    // Step 5a: INSERT order
    const [orderResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO orders (consumer_id, total_amount, delivery_fee, platform_fee, grand_total,
         payment_status, order_status, delivery_address, delivery_district, delivery_upazila)
       VALUES (?, ?, ?, ?, ?, 'PENDING', 'PENDING', ?, ?, ?)`,
      [
        request.consumerId,
        totalAmount,
        deliveryFee,
        platformFee,
        grandTotal,
        request.deliveryAddress,
        request.deliveryDistrict,
        request.deliveryUpazila || null,
      ]
    );

    const orderId = orderResult.insertId;

    // Step 5b: INSERT order_items
    for (const item of orderItems) {
      await connection.query<ResultSetHeader>(
        `INSERT INTO order_items (order_id, product_id, farmer_id, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.farmerId, item.quantity, item.unitPrice, item.subtotal]
      );
    }

    // Step 6: COMMIT
    await connection.commit();

    return {
      orderId,
      totalAmount,
      deliveryFee,
      platformFee,
      grandTotal,
      items: orderItems,
    };
  } catch (error) {
    // ROLLBACK on any failure
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
