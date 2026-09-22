import { Router } from 'express';
import { getCommodities, getCommodityById } from '../controllers/commodityController.js';

const router = Router();

router.get('/', getCommodities);
router.get('/:id', getCommodityById);

export default router;
