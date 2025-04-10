import express from 'express';
import {
  createCategory,
  getAllCategories,
} from '../controllers/category.controllers.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { adminMiddleware } from '../middlewares/adminmiddleware.js';
const router = express.Router();

router
  .route('/')
  .post(authMiddleware, adminMiddleware, createCategory)
  .get(getAllCategories);
export default router;
