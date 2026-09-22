# Smart Agro Market — Database Documentation

> MySQL 8+ relational database for **AI-Powered Agricultural Price Intelligence and Direct-to-Consumer Marketplace for Rural Bangladesh**.

---

## Quick Reference

| Item               | Value                              |
|--------------------|-------------------------------------|
| **RDBMS**          | MySQL 8.0+                         |
| **Database name**  | `smart_agro_market`                |
| **Character set**  | `utf8mb4`                          |
| **Collation**      | `utf8mb4_unicode_ci`               |
| **Engine**         | InnoDB (all tables)                |
| **Schema file**    | `database/schema.sql`              |
| **Seed file**      | `database/seed.sql`                |

---

## Prerequisites

- **MySQL 8.0+** installed and running
- A MySQL user with `CREATE DATABASE` privileges

---

## Setup Instructions

### 1. Create the schema

```bash
mysql -u root -p < database/schema.sql
```

This will:
- Create the `smart_agro_market` database
- Create all 11 tables in dependency-safe order
- Set up foreign keys, indexes, and constraints

### 2. Insert seed data

```bash
mysql -u root -p < database/seed.sql
```

This will populate the database with realistic demo data that matches the frontend mockData.ts.

### 3. Verify

```bash
mysql -u root -p smart_agro_market

-- Check all tables
SHOW TABLES;

-- Verify record counts
SELECT 'users' AS tbl, COUNT(*) AS cnt FROM users
UNION ALL SELECT 'farmers',       COUNT(*) FROM farmers
UNION ALL SELECT 'commodities',   COUNT(*) FROM commodities
UNION ALL SELECT 'markets',       COUNT(*) FROM markets
UNION ALL SELECT 'market_prices', COUNT(*) FROM market_prices
UNION ALL SELECT 'price_predictions', COUNT(*) FROM price_predictions
UNION ALL SELECT 'market_recommendations', COUNT(*) FROM market_recommendations
UNION ALL SELECT 'products',      COUNT(*) FROM products
UNION ALL SELECT 'orders',        COUNT(*) FROM orders
UNION ALL SELECT 'order_items',   COUNT(*) FROM order_items
UNION ALL SELECT 'shipments',     COUNT(*) FROM shipments
UNION ALL SELECT 'reviews',       COUNT(*) FROM reviews;
```

---

## Table Overview

### Core Entity Tables

| Table           | Description                                  | Rows (seed) |
|-----------------|----------------------------------------------|-------------|
| `users`         | All platform users (Farmers, Consumers, Admins) | 10       |
| `farmers`       | Extended farmer profiles (linked to `users`) | 3           |
| `commodities`   | Agricultural products tracked on the platform | 5          |
| `markets`       | Physical market locations across Bangladesh   | 5           |

### Price Intelligence Tables

| Table                | Description                                  | Rows (seed) |
|----------------------|----------------------------------------------|-------------|
| `market_prices`      | Daily commodity prices per market             | 175         |
| `price_predictions`  | ML model predictions for future prices        | 10          |
| `market_recommendations` | Recommendation results for farmers        | 5           |

### Marketplace Tables

| Table         | Description                                    | Rows (seed) |
|---------------|------------------------------------------------|-------------|
| `products`    | Farmer product listings                        | 8           |
| `orders`      | Consumer purchase orders                       | 6           |
| `order_items` | Individual items within an order               | 6           |
| `shipments`   | Delivery/logistics tracking                    | 4           |
| `reviews`     | Consumer reviews and ratings                   | 3           |

---

## Entity-Relationship Diagram

```
users
 ├─► farmers ─────────────────────┐
 │    ├─► products                │
 │    │    └─► order_items        │
 │    ├─► market_recommendations  │
 │    └─► reviews (as farmer)     │
 │                                │
 └─► orders (as consumer)        │
      ├─► order_items            │
      ├─► shipments              │
      └─► reviews (as consumer)  │

commodities
 ├─► market_prices
 ├─► price_predictions
 ├─► market_recommendations
 └─► products

markets
 ├─► market_prices
 ├─► price_predictions
 └─► market_recommendations
```

### Key Relationships

| Parent           | Child                    | Relationship | FK Behavior              |
|------------------|--------------------------|-------------|--------------------------|
| `users`          | `farmers`                | 1:1         | CASCADE / RESTRICT       |
| `users`          | `orders`                 | 1:N         | CASCADE / RESTRICT       |
| `farmers`        | `products`               | 1:N         | CASCADE / RESTRICT       |
| `farmers`        | `order_items`            | 1:N         | CASCADE / RESTRICT       |
| `farmers`        | `market_recommendations` | 1:N         | CASCADE / RESTRICT       |
| `farmers`        | `reviews`                | 1:N         | CASCADE / RESTRICT       |
| `commodities`    | `market_prices`          | 1:N         | CASCADE / RESTRICT       |
| `commodities`    | `price_predictions`      | 1:N         | CASCADE / RESTRICT       |
| `commodities`    | `products`               | 1:N         | CASCADE / RESTRICT       |
| `markets`        | `market_prices`          | 1:N         | CASCADE / RESTRICT       |
| `markets`        | `price_predictions`      | 1:N         | CASCADE / RESTRICT       |
| `markets`        | `market_recommendations` | 1:N         | CASCADE / RESTRICT       |
| `orders`         | `order_items`            | 1:N         | CASCADE / RESTRICT       |
| `orders`         | `shipments`              | 1:N         | CASCADE / RESTRICT       |
| `orders`         | `reviews`                | 1:N         | CASCADE / RESTRICT       |
| `products`       | `order_items`            | 1:N         | CASCADE / RESTRICT       |
| `products`       | `reviews`                | 1:N         | CASCADE / RESTRICT       |

> **ON UPDATE CASCADE / ON DELETE RESTRICT**: Updates propagate automatically; deletes are blocked to preserve historical data integrity (orders, prices, predictions).

---

## Important Design Decisions

### 1. No CASCADE on DELETE

Historical records (orders, prices, predictions, reviews) must never be accidentally deleted. All foreign keys use `ON DELETE RESTRICT`. If a farmer account needs to be deactivated, set `users.is_active = 0` and `products.status = 'INACTIVE'` instead of deleting rows.

### 2. DECIMAL for Money

All monetary values use `DECIMAL(12,2)` — never `FLOAT` or `DOUBLE`. This prevents floating-point rounding errors in financial calculations (prices, fees, revenue, net returns).

### 3. Historical Price Preservation in Order Items

`order_items.unit_price` captures the price at the time of purchase. Even if `products.price` changes later, the historical order record remains accurate.

### 4. Recommendation Architecture

The `market_recommendations` table stores **inputs** and **results**, but the recommendation algorithm runs in the application layer. The database does not compute recommendations — it only persists them.

### 5. Bangla Text Support

The database uses `utf8mb4` character set with `utf8mb4_unicode_ci` collation, fully supporting Bangla (বাংলা) Unicode characters in commodity names, market names, and user-facing text.

### 6. Composite Unique Constraint on Market Prices

`market_prices` has a unique key on `(commodity_id, market_id, price_date)` to prevent duplicate price entries for the same commodity at the same market on the same day.

### 7. Password Storage

The `users.password_hash` field stores bcrypt (or argon2) hashes — never plaintext passwords. The seed data uses placeholder hashes for demo purposes only.

---

## Useful Queries

### Latest price for a commodity across all markets

```sql
SELECT m.name AS market, c.name AS commodity,
       mp.price, mp.min_price, mp.max_price, mp.price_date
FROM market_prices mp
JOIN markets m ON m.id = mp.market_id
JOIN commodities c ON c.id = mp.commodity_id
WHERE mp.commodity_id = 1
  AND mp.price_date = (SELECT MAX(price_date) FROM market_prices WHERE commodity_id = 1)
ORDER BY mp.price DESC;
```

### Price predictions for next week

```sql
SELECT c.name AS commodity, m.name AS market,
       pp.predicted_price, pp.confidence_score,
       pp.model_name, pp.target_date
FROM price_predictions pp
JOIN commodities c ON c.id = pp.commodity_id
JOIN markets m ON m.id = pp.market_id
WHERE pp.target_date >= CURDATE()
ORDER BY pp.target_date, c.name;
```

### Farmer's recommendation results

```sql
SELECT c.name AS commodity, m.name AS recommended_market,
       mr.current_price, mr.predicted_price,
       mr.expected_revenue, mr.expected_net_return,
       mr.recommendation_score
FROM market_recommendations mr
JOIN commodities c ON c.id = mr.commodity_id
JOIN markets m ON m.id = mr.recommended_market_id
WHERE mr.farmer_id = 1
ORDER BY mr.recommendation_score DESC;
```

### Order details with items and farmer info

```sql
SELECT o.id AS order_id, u.full_name AS consumer,
       p.name AS product, f_u.full_name AS farmer,
       oi.quantity, oi.unit_price, oi.subtotal,
       o.grand_total, o.order_status
FROM orders o
JOIN users u ON u.id = o.consumer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
JOIN farmers f ON f.id = oi.farmer_id
JOIN users f_u ON f_u.id = f.user_id
ORDER BY o.created_at DESC;
```

---

## Current Limitations

- The database is **not yet connected** to the React frontend — the frontend currently uses mock data in `src/data/mockData.ts`.
- Price predictions use mock model output (model_version `v1.0-proto`). Real ML models will be integrated in a future phase.
- Courier/shipment tracking is simulated — no real logistics API integration yet.
- Payment processing is not integrated — `payment_status` is managed manually.
- No platform analytics table yet — aggregate stats come from queries on existing tables.

---

## Next Steps

1. **Backend API** — Create a Node.js/Express (or equivalent) REST API to bridge MySQL and the React frontend.
2. **Authentication** — Implement JWT-based auth using `users.password_hash`.
3. **ML Integration** — Replace mock predictions with real trained models writing to `price_predictions`.
4. **Payment Gateway** — Integrate bKash / Nagad / SSLCommerz for `orders.payment_status`.
5. **Real-time Prices** — Set up scrapers/API connections to DAM for `market_prices`.
