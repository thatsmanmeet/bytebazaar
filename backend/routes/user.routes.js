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
  generateResetPasswordToken,
  resetPassword,
  generateTwoFactorCode,
  verifyTwoFactorCode,
  disableTwoFactorAuthentication,
} from '../controllers/user.controllers.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { resetPasswordMiddleware } from '../middlewares/resetpasswordmiddleware.js';

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

router.post('/refreshToken', refreshUserTokens);
router.post('/forgotpassword', generateResetPasswordToken);
router.post('/resetpassword/:token', resetPasswordMiddleware, resetPassword);
router.post('/2fa/enable', authMiddleware, generateTwoFactorCode);
router.post('/2fa/verify', authMiddleware, verifyTwoFactorCode);
router.post('/2fa/disable', authMiddleware, disableTwoFactorAuthentication);
export default router;
