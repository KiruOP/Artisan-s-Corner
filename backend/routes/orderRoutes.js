import express from 'express';
import {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getVendorOrders,
    updateOrderToDelivered,
} from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, addOrderItems);

router.get('/myorders', protect, getMyOrders);
router.get('/vendor', protect, authorizeRoles('vendor'), getVendorOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.put('/:id/deliver', protect, authorizeRoles('vendor', 'admin'), updateOrderToDelivered);

export default router;
