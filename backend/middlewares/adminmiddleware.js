import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIError } from '../utils/APIError.js';

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user._id && req.user.role === 'admin') {
    next();
  } else {
    throw new APIError(403, 'Unauthorized admin privilege required.');
  }
});
