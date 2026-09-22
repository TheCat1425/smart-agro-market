import { Router } from 'express';
import { getMarketPrices, getLatestPrices, getPriceHistory } from '../controllers/marketPriceController.js';

const router = Router();

// Static routes MUST come before parameterized routes
router.get('/latest', getLatestPrices);
router.get('/history', getPriceHistory);
router.get('/', getMarketPrices);

export default router;
