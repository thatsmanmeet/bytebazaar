import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIError } from '../utils/APIError.js';
import { APIResponse } from '../utils/APIResponse.js';
import { User } from '../models/user.models.js';
import validator from 'validator';
import { generateAccessToken } from '../utils/generateAccessToken.js';
import { generateRefreshToken } from '../utils/generateRefreshToken.js';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    throw new APIError(400, 'All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw new APIError(401, 'Invalid email address found.');
  }

  if (password !== confirmPassword) {
    throw new APIError(401, "Passwords don't match");
  }

  if (password.toString().length < 8 || confirmPassword.toString().length < 8) {
    throw new APIError(400, 'Password must have a minimum length of 8');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new APIError(401, 'User already exist.');
  }

  const newUser = await User.create({ name, email, password });

  const user = await User.findById(newUser);

  if (!user) {
    throw new APIError(400, 'Something went wrong creating a user');
  }

  return res
    .status(201)
    .json(new APIResponse(201, 'User created successfully!', user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIError(401, 'All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw new APIError(401, 'Invalid email address.');
  }

  if (password.toString().length < 8) {
    throw new APIError(400, 'Password must have a minimum length of 8');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new APIError(401, "User doesn't exist");
  }

  if (!(await user.matchPassword(password))) {
    throw new APIError(403, 'Invalid Email or Password');
  }

  const accessToken = generateAccessToken(res, user._id, user.email, user.role);
  const refreshToken = generateRefreshToken(res, user._id);

  const returnUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
    sellerInfo: user.sellerInfo,
    accessToken,
    refreshToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res
    .status(200)
    .json(new APIResponse(200, 'Logged in successfully', returnUser));
});

// update user profile

export { registerUser, loginUser };
