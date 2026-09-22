// ────────────────────────────────────────────────────────
// Health Check Controller
// ────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import { testConnection } from '../config/database.js';

export async function getHealth(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dbConnected = await testConnection();

    const status = dbConnected ? 'ok' : 'degraded';
    const httpStatus = dbConnected ? 200 : 503;

    res.status(httpStatus).json({
      success: true,
      data: {
        status,
        database: dbConnected ? 'connected' : 'unavailable',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    next(error);
  }
}
