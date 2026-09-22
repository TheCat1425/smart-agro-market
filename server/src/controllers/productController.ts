// ────────────────────────────────────────────────────────
// Product Controller
// ────────────────────────────────────────────────────────
// NOTE: Authentication is NOT yet implemented.
// All write operations currently work without auth.
// This will be secured in a separate task.

import type { Request, Response, NextFunction } from 'express';
import type { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/database.js';
import type { ProductRow, CreateProductRequest, UpdateProductRequest } from '../types/index.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { validateId, validateRequiredFields, validatePositiveNumber, validateEnum } from '../middleware/validateRequest.js';
import { buildWhereClause, type FilterCondition } from '../utils/queryHelpers.js';

const PRODUCT_STATUSES = ['DRAFT', 'ACTIVE', 'SOLD_OUT', 'INACTIVE'] as const;

/**
 * GET /api/products
 * Filter by: ?commodityId, ?farmerId, ?status, ?search
 */
export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { commodityId, farmerId, status, search } = req.query;

    const conditions: FilterCondition[] = [];
    if (commodityId) conditions.push({ field: 'p.commodity_id', value: Number(commodityId) });
    if (farmerId) conditions.push({ field: 'p.farmer_id', value: Number(farmerId) });
    if (status) conditions.push({ field: 'p.status', value: status });
    if (search) conditions.push({ field: 'p.name', value: `%${search}%`, operator: 'LIKE' });

    const { whereClause, params } = buildWhereClause(conditions);

    const [rows] = await pool.query<ProductRow[]>(
      `SELECT p.id, p.farmer_id, p.commodity_id, p.name, p.description, p.price,
              p.quantity_available, p.unit, p.quality_grade, p.image_url, p.organic,
              p.status, p.created_at, p.updated_at,
              c.name AS commodity_name,
              u.full_name AS farmer_name
       FROM products p
       JOIN commodities c ON c.id = p.commodity_id
       JOIN farmers f ON f.id = p.farmer_id
       JOIN users u ON u.id = f.user_id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT 100`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/:id
 * Return a single product with farmer and commodity info.
 */
export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'productId');
    const [rows] = await pool.query<ProductRow[]>(
      `SELECT p.id, p.farmer_id, p.commodity_id, p.name, p.description, p.price,
              p.quantity_available, p.unit, p.quality_grade, p.image_url, p.organic,
              p.status, p.created_at, p.updated_at,
              c.name AS commodity_name,
              u.full_name AS farmer_name, f.farm_name, f.district AS farmer_district
       FROM products p
       JOIN commodities c ON c.id = p.commodity_id
       JOIN farmers f ON f.id = p.farmer_id
       JOIN users u ON u.id = f.user_id
       WHERE p.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      throw NotFoundError('Product');
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/products
 * Create a new product.
 * NOTE: No authentication — any valid farmer ID is accepted for now.
 */
export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body: CreateProductRequest = req.body;
    validateRequiredFields(body as unknown as Record<string, unknown>, ['farmerId', 'commodityId', 'name', 'price', 'quantityAvailable']);

    const farmerId = validateId(body.farmerId, 'farmerId');
    const commodityId = validateId(body.commodityId, 'commodityId');
    const price = validatePositiveNumber(body.price, 'price');
    const quantityAvailable = validatePositiveNumber(body.quantityAvailable, 'quantityAvailable');
    const status = body.status ? validateEnum(body.status, ['DRAFT', 'ACTIVE'] as const, 'status') : 'DRAFT';

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products (farmer_id, commodity_id, name, description, price,
         quantity_available, unit, quality_grade, image_url, organic, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        farmerId,
        commodityId,
        body.name,
        body.description || null,
        price,
        quantityAvailable,
        body.unit || 'kg',
        body.qualityGrade || null,
        body.imageUrl || null,
        body.organic ? 1 : 0,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, message: 'Product created successfully' },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/products/:id
 * Update an existing product.
 * NOTE: No authentication — any request can update for now.
 */
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'productId');
    const body: UpdateProductRequest = req.body;

    // Build SET clause dynamically
    const updates: string[] = [];
    const values: unknown[] = [];

    if (body.name !== undefined) { updates.push('name = ?'); values.push(body.name); }
    if (body.description !== undefined) { updates.push('description = ?'); values.push(body.description); }
    if (body.price !== undefined) {
      validatePositiveNumber(body.price, 'price');
      updates.push('price = ?'); values.push(body.price);
    }
    if (body.quantityAvailable !== undefined) {
      updates.push('quantity_available = ?'); values.push(body.quantityAvailable);
    }
    if (body.unit !== undefined) { updates.push('unit = ?'); values.push(body.unit); }
    if (body.qualityGrade !== undefined) { updates.push('quality_grade = ?'); values.push(body.qualityGrade); }
    if (body.imageUrl !== undefined) { updates.push('image_url = ?'); values.push(body.imageUrl); }
    if (body.organic !== undefined) { updates.push('organic = ?'); values.push(body.organic ? 1 : 0); }
    if (body.status !== undefined) {
      validateEnum(body.status, PRODUCT_STATUSES, 'status');
      updates.push('status = ?'); values.push(body.status);
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'No fields to update' },
      });
      return;
    }

    values.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw NotFoundError('Product');
    }

    res.json({ success: true, data: { message: 'Product updated successfully' } });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/products/:id
 * Soft-delete: sets status to INACTIVE instead of removing the row.
 * Orders reference products, so hard deletion would violate FK constraints.
 */
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = validateId(req.params.id, 'productId');

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE products SET status = 'INACTIVE' WHERE id = ? AND status != 'INACTIVE'`,
      [id]
    );

    if (result.affectedRows === 0) {
      throw NotFoundError('Product (or already inactive)');
    }

    res.json({ success: true, data: { message: 'Product deactivated successfully' } });
  } catch (error) {
    next(error);
  }
}
