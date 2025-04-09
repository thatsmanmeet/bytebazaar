import { User } from '../models/user.models.js';
import { APIError } from '../utils/APIError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    // if no access token send an error
    if (!accessToken) {
      throw new APIError(401, 'Authorization Token not found.');
    }

    // try to decode this token
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new APIError(401, 'Invalid access token');
    }

    // find user

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new APIError(404, 'User not found with associated token');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new APIError(401, 'Token has expired.');
    } else if (error.name === 'JsonWebTokenError') {
      throw new APIError(401, 'Invalid token.');
    }
    // Fallback error
    throw new APIError(401, 'Authentication failed. Login Again');
  }
});
