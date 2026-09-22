import { Router } from 'express';
import { getShipmentById } from '../controllers/shipmentController.js';

const router = Router();

router.get('/:id', getShipmentById);

export default router;
