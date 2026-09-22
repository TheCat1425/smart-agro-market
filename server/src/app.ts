// ────────────────────────────────────────────────────────
// Smart Agro Market — Express API Server
// ────────────────────────────────────────────────────────

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { testConnection } from './config/database.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ──────────── Middleware ────────────

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ──────────── Routes ────────────

app.use('/api', apiRoutes);

// Root route — API info
app.get('/', (_req, res) => {
  res.json({
    name: 'Smart Agro Market API',
    version: '1.0.0',
    description: 'REST API for AI-Powered Agricultural Marketplace',
    docs: '/api/health',
    endpoints: {
      health: 'GET /api/health',
      commodities: 'GET /api/commodities',
      markets: 'GET /api/markets',
      marketPrices: 'GET /api/market-prices',
      predictions: 'GET /api/predictions',
      farmers: 'GET /api/farmers',
      products: 'GET /api/products',
      orders: 'GET /api/orders',
      shipments: 'GET /api/shipments/:id',
      recommendations: 'POST /api/recommendations/analyze',
      admin: 'GET /api/admin/stats',
    },
  });
});

// ──────────── Error Handler (must be last) ────────────

app.use(errorHandler);

// ──────────── Start Server ────────────

app.listen(PORT, async () => {
  console.log(`\n🌾 Smart Agro Market API Server`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   API base:   http://localhost:${PORT}/api`);
  console.log(`   CORS:       ${CORS_ORIGIN}`);
  console.log(`   Mode:       ${process.env.NODE_ENV || 'development'}\n`);

  // Test database connection at startup
  const dbConnected = await testConnection();
  if (dbConnected) {
    console.log(`   ✅ MySQL:    Connected to ${process.env.DB_NAME || 'smart_agro_market'}\n`);
  } else {
    console.log(`   ⚠️  MySQL:    NOT connected — API will return database errors`);
    console.log(`               Set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD in .env\n`);
  }
});

export default app;
