import express from 'express';
import {
    getProducts,
    getProductById,
    getVendorProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, authorizeRoles('vendor', 'admin'), upload.array('images', 5), createProduct);

router.get('/vendor', protect, authorizeRoles('vendor'), getVendorProducts);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorizeRoles('vendor', 'admin'), upload.array('images', 5), updateProduct)
    .delete(protect, authorizeRoles('vendor', 'admin'), deleteProduct);

export default router;
