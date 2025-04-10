import { APIError } from '../utils/APIError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

export const sellerMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user._id && req.user.role === 'seller') {
    next();
  } else {
    throw new APIError(403, 'You are not a seller');
  }
});
