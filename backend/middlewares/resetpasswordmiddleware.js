import { User } from '../models/user.models.js';
import { APIError } from '../utils/APIError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import crypto from 'crypto';

export const resetPasswordMiddleware = asyncHandler(async (req, res, next) => {
  const incomingToken = req.params.token;

  if (!incomingToken) {
    throw new APIError(400, 'Reset Token not found');
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(incomingToken)
    .digest('hex');

  const user = await User.findOne({
    forgetPasswordToken: hashedToken,
    forgetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new APIError(400, 'Invalid or expired password reset token.');
  }

  req.resetUser = user;
  next();
});
