// ────────────────────────────────────────────────────────
// Centralized Error Handling Middleware
// ────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';

/**
 * Custom application error with HTTP status code and error code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Common error factories
export const NotFoundError = (resource: string) =>
  new AppError(404, 'NOT_FOUND', `${resource} not found`);

export const ValidationError = (message: string) =>
  new AppError(400, 'VALIDATION_ERROR', message);

export const DatabaseError = (message: string) =>
  new AppError(500, 'DATABASE_ERROR', message);

/**
 * Express error-handling middleware.
 * Must have 4 parameters for Express to recognize it as an error handler.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error for debugging (never expose DB credentials)
  console.error(`[ERROR] ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Catch MySQL errors
  if ('code' in err && typeof (err as Record<string, unknown>).code === 'string') {
    const mysqlCode = (err as Record<string, unknown>).code as string;

    if (mysqlCode === 'ECONNREFUSED' || mysqlCode === 'PROTOCOL_CONNECTION_LOST') {
      res.status(503).json({
        success: false,
        error: {
          code: 'DATABASE_UNAVAILABLE',
          message: 'Database connection is unavailable. Please try again later.',
        },
      });
      return;
    }

    if (mysqlCode === 'ER_DUP_ENTRY') {
      res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'A record with this value already exists.',
        },
      });
      return;
    }
  }

  // Unexpected error — never expose internals
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
    },
  });
}
