import express from 'express';
import {
  addToCart,
  getAllCartItems,
  updateMyCart,
  removeFromCart,
} from '../controllers/cart.controllers.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
const router = express.Router();

router
  .route('/')
  .get(authMiddleware, getAllCartItems)
  .post(authMiddleware, addToCart)
  .put(authMiddleware, updateMyCart)
  .delete(authMiddleware, removeFromCart);

export default router;
