import { Router } from 'express';
import { getFarmers, getFarmerById, getFarmerProducts, getFarmerOrders } from '../controllers/farmerController.js';

const router = Router();

router.get('/', getFarmers);
router.get('/:id', getFarmerById);
router.get('/:id/products', getFarmerProducts);
router.get('/:id/orders', getFarmerOrders);

export default router;
