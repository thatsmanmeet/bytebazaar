import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/product.controllers.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { sellerMiddleware } from '../middlewares/sellermiddleware.js';
const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(authMiddleware, sellerMiddleware, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(authMiddleware, sellerMiddleware, updateProduct)
  .delete(authMiddleware, sellerMiddleware, deleteProduct);

router
  .route('/reviews/:id')
  .get(getReviews)
  .post(authMiddleware, createReview)
  .put(authMiddleware, updateReview)
  .delete(authMiddleware, deleteReview);

export default router;
