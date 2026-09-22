// ────────────────────────────────────────────────────────
// Route Index — Mounts all route modules under /api
// ────────────────────────────────────────────────────────

import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import commodityRoutes from './commodityRoutes.js';
import marketRoutes from './marketRoutes.js';
import marketPriceRoutes from './marketPriceRoutes.js';
import predictionRoutes from './predictionRoutes.js';
import farmerRoutes from './farmerRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import shipmentRoutes from './shipmentRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/commodities', commodityRoutes);
router.use('/markets', marketRoutes);
router.use('/market-prices', marketPriceRoutes);
router.use('/predictions', predictionRoutes);
router.use('/farmers', farmerRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/admin', adminRoutes);

export default router;
