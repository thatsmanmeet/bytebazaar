import jwt from 'jsonwebtoken';
import { APIError } from './APIError.js';
import { cookieOptions } from '../constants.js';

export const generateRefreshToken = (res, userId) => {
  try {
    const token = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
    res.cookie('refreshToken', token, cookieOptions);
    return token;
  } catch (error) {
    console.log(error);
    throw new APIError(400, 'Unable to generate authentication token.');
  }
};
