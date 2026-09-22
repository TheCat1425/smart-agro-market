import { Router } from 'express';
import { getStats, getRevenue, getDistrictRevenue } from '../controllers/adminController.js';

const router = Router();

router.get('/stats', getStats);
router.get('/revenue', getRevenue);
router.get('/district-revenue', getDistrictRevenue);

export default router;
