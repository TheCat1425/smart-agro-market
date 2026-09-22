// ────────────────────────────────────────────────────────
// Request Validation Helpers
// ────────────────────────────────────────────────────────

import { ValidationError } from './errorHandler.js';

/**
 * Validate that a value is a positive integer (for IDs).
 */
export function validateId(value: unknown, fieldName: string = 'id'): number {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    throw ValidationError(`${fieldName} must be a positive integer`);
  }
  return num;
}

/**
 * Validate that a value is a positive number.
 */
export function validatePositiveNumber(value: unknown, fieldName: string): number {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    throw ValidationError(`${fieldName} must be a positive number`);
  }
  return num;
}

/**
 * Validate that a value is a non-negative number.
 */
export function validateNonNegativeNumber(value: unknown, fieldName: string): number {
  const num = Number(value);
  if (isNaN(num) || num < 0) {
    throw ValidationError(`${fieldName} must be zero or a positive number`);
  }
  return num;
}

/**
 * Validate that a string is non-empty.
 */
export function validateRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw ValidationError(`${fieldName} is required and must be a non-empty string`);
  }
  return value.trim();
}

/**
 * Validate that a value is one of the allowed enum values.
 */
export function validateEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fieldName: string
): T {
  if (!allowed.includes(value as T)) {
    throw ValidationError(`${fieldName} must be one of: ${allowed.join(', ')}`);
  }
  return value as T;
}

/**
 * Validate a rating (1-5 integer).
 */
export function validateRating(value: unknown): number {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    throw ValidationError('rating must be an integer between 1 and 5');
  }
  return num;
}

/**
 * Validate a date string (YYYY-MM-DD format).
 */
export function validateDateString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw ValidationError(`${fieldName} must be a valid date in YYYY-MM-DD format`);
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw ValidationError(`${fieldName} must be a valid date`);
  }
  return value;
}

/**
 * Validate multiple required fields exist in a request body.
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  fields: string[]
): void {
  const missing = fields.filter(
    (f) => body[f] === undefined || body[f] === null || body[f] === ''
  );
  if (missing.length > 0) {
    throw ValidationError(`Missing required fields: ${missing.join(', ')}`);
  }
}
