import { Router } from 'express';
import { getOrders, getOrderById, createNewOrder, updateOrderStatus } from '../controllers/orderController.js';
import { getShipmentByOrderId } from '../controllers/shipmentController.js';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createNewOrder);
router.put('/:id/status', updateOrderStatus);
router.get('/:orderId/shipment', getShipmentByOrderId);

export default router;
