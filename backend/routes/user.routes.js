import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  becomeSeller,
  updateSellerInfo,
  getUserAddress,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  refreshUserTokens,
} from '../controllers/user.controllers.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router
  .route('/profile')
  .get(authMiddleware, getUserProfile)
  .patch(authMiddleware, updateUserProfile)
  .delete(authMiddleware, deleteUserProfile);
router
  .route('/profile/address')
  .get(authMiddleware, getUserAddress)
  .post(authMiddleware, addUserAddress)
  .patch(authMiddleware, updateUserAddress)
  .delete(authMiddleware, deleteUserAddress);

router
  .route('/profile/seller')
  .post(authMiddleware, becomeSeller)
  .patch(authMiddleware, updateSellerInfo);
export default router;
