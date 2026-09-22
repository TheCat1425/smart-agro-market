// ────────────────────────────────────────────────────────
// SQL Query Builder Helpers
// All queries use parameterized placeholders (?) — never string concatenation.
// ────────────────────────────────────────────────────────

/**
 * Dynamically builds WHERE clauses from optional filter parameters.
 * Returns the WHERE string and an array of parameter values.
 *
 * Usage:
 *   const { whereClause, params } = buildWhereClause([
 *     { field: 'commodity_id', value: commodityId },
 *     { field: 'market_id', value: marketId },
 *     { field: 'status', value: status },
 *   ]);
 *   const sql = `SELECT * FROM products ${whereClause}`;
 *   const [rows] = await pool.query(sql, params);
 */
export interface FilterCondition {
  field: string;
  value: unknown;
  operator?: '=' | '>' | '<' | '>=' | '<=' | 'LIKE';
}

export function buildWhereClause(
  conditions: FilterCondition[]
): { whereClause: string; params: unknown[] } {
  const activeConditions = conditions.filter(
    (c) => c.value !== undefined && c.value !== null && c.value !== ''
  );

  if (activeConditions.length === 0) {
    return { whereClause: '', params: [] };
  }

  const clauses: string[] = [];
  const params: unknown[] = [];

  for (const condition of activeConditions) {
    const op = condition.operator || '=';
    clauses.push(`${condition.field} ${op} ?`);
    params.push(condition.value);
  }

  return {
    whereClause: `WHERE ${clauses.join(' AND ')}`,
    params,
  };
}

/**
 * Builds a date range filter for a given field.
 * Returns filter conditions that can be passed to buildWhereClause.
 */
export function dateRangeConditions(
  field: string,
  startDate?: string,
  endDate?: string
): FilterCondition[] {
  const conditions: FilterCondition[] = [];
  if (startDate) {
    conditions.push({ field, value: startDate, operator: '>=' });
  }
  if (endDate) {
    conditions.push({ field, value: endDate, operator: '<=' });
  }
  return conditions;
}
