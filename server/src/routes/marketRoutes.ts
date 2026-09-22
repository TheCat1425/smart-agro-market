import { Router } from 'express';
import { getMarkets, getMarketById } from '../controllers/marketController.js';

const router = Router();

router.get('/', getMarkets);
router.get('/:id', getMarketById);

export default router;
