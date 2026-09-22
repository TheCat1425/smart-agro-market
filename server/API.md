# Smart Agro Market — API Reference

Base URL: `http://localhost:3001/api`

All responses follow the format:
```json
// Success
{ "success": true, "data": ... }

// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

---

## Health

### GET /api/health

Check API and database status.

**Response (200 — DB connected):**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "2026-09-11T08:00:00.000Z",
    "uptime": 123.45
  }
}
```

**Response (503 — DB unavailable):**
```json
{
  "success": true,
  "data": {
    "status": "degraded",
    "database": "unavailable",
    "timestamp": "...",
    "uptime": 123.45
  }
}
```

---

## Commodities

### GET /api/commodities

List all active commodities.

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Tomato", "name_bn": "টমেটো", "category": "Vegetable", "unit": "kg", "description": "..." }
  ]
}
```

### GET /api/commodities/:id

Get a single commodity.

**404 Response:**
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Commodity not found" } }
```

---

## Markets

### GET /api/markets

List active markets. Optional filter: `?district=Rajshahi`

### GET /api/markets/:id

Get a single market with transport cost info.

---

## Market Prices

### GET /api/market-prices

Filter: `?commodityId=1&marketId=2&startDate=2026-09-01&endDate=2026-09-11`

### GET /api/market-prices/latest

Latest price per market. Filter: `?commodityId=1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "market_id": 1, "commodity_id": 1, "price": 55.00,
      "min_price": 52.00, "max_price": 58.00, "price_date": "2026-09-11",
      "market_name": "Rajshahi Central Market", "commodity_name": "Tomato"
    }
  ]
}
```

### GET /api/market-prices/history

Chronological data for charts. Filter: `?commodityId=1&marketId=1&days=7`

---

## Predictions

### GET /api/predictions

Filter: `?commodityId=1&marketId=1&targetDate=2026-09-18`

### GET /api/predictions/latest

Latest prediction. Filter: `?commodityId=1&marketId=1`

**Response:**
```json
{
  "success": true,
  "data": {
    "commodity_id": 1, "market_id": 1, "predicted_price": 58.00,
    "confidence_score": 82.00, "model_name": "XGBoost", "model_version": "v1.0-proto",
    "target_date": "2026-09-18", "commodity_name": "Tomato", "market_name": "Rajshahi Central Market"
  }
}
```

---

## Farmers

### GET /api/farmers

List all active farmers with user info.

### GET /api/farmers/:id

Get farmer details.

### GET /api/farmers/:id/products

Farmer's product listings.

### GET /api/farmers/:id/orders

Orders containing this farmer's products.

---

## Products

### GET /api/products

Filter: `?commodityId=1&farmerId=1&status=ACTIVE&search=tomato`

### GET /api/products/:id

Single product with farmer and commodity info.

### POST /api/products

Create a product. **No authentication required yet.**

**Request:**
```json
{
  "farmerId": 1,
  "commodityId": 1,
  "name": "Fresh Tomatoes",
  "description": "Freshly harvested",
  "price": 55.00,
  "quantityAvailable": 500,
  "unit": "kg",
  "qualityGrade": "A",
  "organic": true,
  "status": "ACTIVE"
}
```

**Response (201):**
```json
{ "success": true, "data": { "id": 9, "message": "Product created successfully" } }
```

### PUT /api/products/:id

Update product fields (partial update supported).

### DELETE /api/products/:id

Soft-delete: sets status to `INACTIVE`.

---

## Orders

### GET /api/orders

List all orders.

### GET /api/orders/:id

Order with line items, product names, and farmer names.

### POST /api/orders

Create an order. Uses a **database transaction** (BEGIN/COMMIT/ROLLBACK).

**Prices are retrieved from MySQL — NOT trusted from the browser.**

**Request:**
```json
{
  "consumerId": 4,
  "items": [
    { "productId": 1, "quantity": 50 },
    { "productId": 2, "quantity": 100 }
  ],
  "deliveryAddress": "House 12, Road 5, Mirpur, Dhaka",
  "deliveryDistrict": "Dhaka",
  "deliveryUpazila": "Mirpur"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "orderId": 7,
    "totalAmount": 5950.00,
    "deliveryFee": 80,
    "platformFee": 119,
    "grandTotal": 6149.00,
    "items": [
      { "productId": 1, "farmerId": 1, "quantity": 50, "unitPrice": 55.00, "subtotal": 2750.00 },
      { "productId": 2, "farmerId": 1, "quantity": 100, "unitPrice": 32.00, "subtotal": 3200.00 }
    ]
  }
}
```

### PUT /api/orders/:id/status

**Request:**
```json
{ "status": "CONFIRMED" }
```

Valid statuses: `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### GET /api/orders/:orderId/shipment

Get the shipment for an order.

---

## Shipments

### GET /api/shipments/:id

Get shipment by its own ID.

---

## Recommendations

### POST /api/recommendations/analyze

Run the recommendation engine with live DB data.

**Request:**
```json
{
  "commodityId": 1,
  "quantity": 500,
  "farmerLocation": "Rajshahi",
  "harvestDate": "2026-09-30",
  "minimumAcceptablePrice": 50
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "market": { "id": 5, "name": "Dhaka Wholesale Market", "district": "Dhaka" },
        "currentPrice": 65, "predictedPrice": 62, "confidence": 75,
        "priceTrend": "down", "quantity": 500, "grossRevenue": 31000,
        "estimatedDistanceKm": 254, "estimatedTransportCost": 2482,
        "platformFee": 310, "otherCost": 305, "totalCosts": 3097,
        "netReturn": 27903, "profitPerKg": 55.81,
        "score": 92, "meetsMinPrice": true, "isRecommended": true, "rank": 1
      }
    ],
    "recommended": { ... },
    "anyMeetsMinPrice": true,
    "insight": "Dhaka Wholesale Market offers..."
  }
}
```

### POST /api/recommendations

Save a recommendation result.

**Request:**
```json
{
  "farmerId": 1,
  "commodityId": 1,
  "quantity": 500,
  "farmerLocation": "Rajshahi",
  "harvestDate": "2026-09-30",
  "minimumAcceptablePrice": 50,
  "recommendedMarketId": 5,
  "currentPrice": 65,
  "predictedPrice": 62,
  "estimatedDistance": 254,
  "transportCost": 2482,
  "platformFee": 310,
  "otherCost": 305,
  "expectedRevenue": 31000,
  "expectedNetReturn": 27903,
  "recommendationScore": 92
}
```

---

## Admin

### GET /api/admin/stats

Platform statistics from MySQL aggregation.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFarmers": 3,
    "totalConsumers": 7,
    "totalProducts": 8,
    "totalOrders": 6,
    "totalRevenue": 23774,
    "activeMarkets": 5,
    "activeCommodities": 5
  }
}
```

### GET /api/admin/revenue

Revenue grouped by month.

### GET /api/admin/district-revenue

Revenue grouped by delivery district.

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_ENTRY` | 409 | Unique constraint violation |
| `INSUFFICIENT_QUANTITY` | 400 | Not enough stock |
| `DATABASE_UNAVAILABLE` | 503 | MySQL connection failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
