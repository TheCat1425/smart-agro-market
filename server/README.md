# Smart Agro Market — Backend API Server

> Node.js + Express + TypeScript REST API for the Smart Agro Market platform.

---

## Prerequisites

- **Node.js** 18+ (tested with v24.14.1)
- **MySQL 8.0+** installed and running
- The database schema and seed data applied (see `database/README.md`)

---

## Setup

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_agro_market
DB_USER=root
DB_PASSWORD=your_password
```

### 3. Set up MySQL database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 4. Start the development server

```bash
npm run dev
```

Or from the project root:

```bash
npm run server
```

The API server starts on `http://localhost:3001`.

---

## API Base URL

```
http://localhost:3001/api
```

---

## Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (API + DB status) |
| **Commodities** | | |
| GET | `/api/commodities` | List active commodities |
| GET | `/api/commodities/:id` | Get commodity by ID |
| **Markets** | | |
| GET | `/api/markets` | List markets (optional `?district=`) |
| GET | `/api/markets/:id` | Get market by ID |
| **Market Prices** | | |
| GET | `/api/market-prices` | Filtered prices |
| GET | `/api/market-prices/latest` | Latest price per market |
| GET | `/api/market-prices/history` | Chronological price data |
| **Predictions** | | |
| GET | `/api/predictions` | Filtered predictions |
| GET | `/api/predictions/latest` | Latest prediction |
| **Farmers** | | |
| GET | `/api/farmers` | List farmers |
| GET | `/api/farmers/:id` | Get farmer details |
| GET | `/api/farmers/:id/products` | Farmer's products |
| GET | `/api/farmers/:id/orders` | Farmer's orders |
| **Products** | | |
| GET | `/api/products` | List with filters |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Deactivate product |
| **Orders** | | |
| GET | `/api/orders` | List orders |
| GET | `/api/orders/:id` | Order with items |
| POST | `/api/orders` | Create order (transactional) |
| PUT | `/api/orders/:id/status` | Update order status |
| GET | `/api/orders/:orderId/shipment` | Order's shipment |
| **Shipments** | | |
| GET | `/api/shipments/:id` | Get shipment by ID |
| **Recommendations** | | |
| POST | `/api/recommendations/analyze` | Run recommendation engine |
| POST | `/api/recommendations` | Save recommendation |
| **Admin** | | |
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/revenue` | Revenue by month |
| GET | `/api/admin/district-revenue` | Revenue by district |

---

## Architecture

```
React Frontend (port 5173)
        ↓  HTTP
   REST API /api/*
        ↓
  Express + TypeScript (port 3001)
        ↓  mysql2 pool
   MySQL 8+ (port 3306)
```

### Project Structure

```
server/
├── src/
│   ├── config/database.ts      — MySQL connection pool
│   ├── controllers/            — Request handlers (11 files)
│   ├── routes/                 — Express route definitions (12 files)
│   ├── services/
│   │   ├── recommendationService.ts  — Ported recommendation engine
│   │   └── orderService.ts           — Transactional order creation
│   ├── middleware/
│   │   ├── errorHandler.ts     — Centralized error handling
│   │   └── validateRequest.ts  — Input validation helpers
│   ├── types/index.ts          — TypeScript types (DB rows + API contracts)
│   ├── utils/queryHelpers.ts   — Parameterized SQL builders
│   └── app.ts                  — Express entry point
├── .env.example
├── package.json
├── tsconfig.json
├── API.md                      — Detailed API reference
└── README.md                   — This file
```

---

## Key Design Decisions

1. **Parameterized SQL** — All queries use `?` placeholders. Zero string concatenation from user input.
2. **Transactional Orders** — Order creation uses `BEGIN → validate → INSERT → COMMIT/ROLLBACK`.
3. **Prices from DB** — Order prices are retrieved from MySQL, never trusted from the browser.
4. **Recommendation Engine** — Ported from `src/data/recommendationEngine.ts` with identical scoring formulas, adapted to accept DB data.
5. **Soft Deletes** — Products are set to `INACTIVE`, never physically deleted.
6. **CORS** — Restricted to `http://localhost:5173` (Vite dev server).

---

## Current Limitations

- ⚠️ **No authentication** — All endpoints are publicly accessible. Auth will be added in a separate task.
- ⚠️ **No real ML models** — Predictions come from database seed data.
- ⚠️ **No courier integration** — Shipment data is read-only from MySQL.
- ⚠️ **No payment gateway** — Payment status is managed manually.

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `tsx watch src/app.ts` | Start dev server with hot reload |
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/app.js` | Run compiled production build |
