import express from 'express';
import {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  payForOrder,
  addOrderUpdates,
  cancelOrderBySeller,
  getMySellerOrders,
  getSellerOrderById,
  markOrderAsDelivered,
} from '../controllers/order.controller.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { sellerMiddleware } from '../middlewares/sellermiddleware.js';
const router = express.Router();

router
  .route('/')
  .get(authMiddleware, getMyOrders)
  .post(authMiddleware, createOrder);

router
  .route('/seller')
  .get(authMiddleware, sellerMiddleware, getMySellerOrders);

router
  .route('/seller/deliver/:id')
  .post(authMiddleware, sellerMiddleware, markOrderAsDelivered);

router
  .route('/seller/:id')
  .get(authMiddleware, sellerMiddleware, getSellerOrderById)
  .post(authMiddleware, sellerMiddleware, addOrderUpdates)
  .delete(authMiddleware, sellerMiddleware, cancelOrderBySeller);

router.route('/pay/:id').post(authMiddleware, payForOrder);

router
  .route('/:id')
  .get(authMiddleware, getOrderById)
  .delete(authMiddleware, cancelOrder);

export default router;
