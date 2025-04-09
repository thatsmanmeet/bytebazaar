import jwt from 'jsonwebtoken';
import { APIError } from './APIError.js';
import { cookieOptions } from '../constants.js';

export const generateAccessToken = (res, userId, userEmail, userRole) => {
  try {
    const token = jwt.sign(
      { _id: userId, email: userEmail, role: userRole },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    res.cookie('accessToken', token, cookieOptions);
    return token;
  } catch (error) {
    console.log(error);
    throw new APIError(400, 'Unable to generate authentication token.');
  }
};
