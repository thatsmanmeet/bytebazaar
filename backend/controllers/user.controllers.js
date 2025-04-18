import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIError } from '../utils/APIError.js';
import { APIResponse } from '../utils/APIResponse.js';
import { User } from '../models/user.models.js';
import { Cart } from '../models/cart.models.js';
import { Product } from '../models/product.models.js';
import { Review } from '../models/reviews.models.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { generateAccessToken } from '../utils/generateAccessToken.js';
import { generateRefreshToken } from '../utils/generateRefreshToken.js';
import { cookieOptions } from '../constants.js';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    throw new APIError(400, 'All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw new APIError(400, 'Invalid email address found.');
  }

  if (password !== confirmPassword) {
    throw new APIError(422, "Passwords don't match");
  }

  if (password.toString().length < 8 || confirmPassword.toString().length < 8) {
    throw new APIError(400, 'Password must have a minimum length of 8');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new APIError(409, 'User already exist.');
  }

  const newUser = await User.create({ name, email, password });

  const user = await User.findById(newUser._id);

  if (!user) {
    throw new APIError(400, 'Something went wrong creating a user');
  }

  return res
    .status(201)
    .json(new APIResponse(201, 'User created successfully!', user));
});

// create a 2fa code
const generateTwoFactorCode = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+twoFactorSecret');
  if (!user) {
    throw new APIError(404, 'User not found');
  }

  if (user.twoFactorEnabled) {
    throw new APIError(409, 'Two factor authentication is already enabled');
  }

  // generate secret
  const secret = speakeasy.generateSecret();

  user.twoFactorSecret = secret.base32;
  await user.save({ validateBeforeSave: false });

  const qrCodeData = await QRCode.toDataURL(secret.otpauth_url);

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        '2fa secret generated. Scan the QR Code with an authenticator app',
        { qrCodeData, secret: secret.base32 }
      )
    );
});
// verify and enable 2fa
const verifyTwoFactorCode = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user._id).select('+twoFactorSecret');
  if (!user || !user.twoFactorSecret) {
    throw new APIError(404, 'User not found or 2FA process not started');
  }

  if (user.twoFactorEnabled) {
    throw new APIError(409, 'Two factor authentication is already enabled');
  }

  if (!token) {
    throw new APIError(401, 'Token is required to enable 2FA on this account');
  }

  // verify OTP
  const isVerified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 1,
  });

  if (!isVerified) {
    throw new APIError(400, 'Invalid Totp code.');
  }

  // Now enable 2FA
  user.twoFactorEnabled = true;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new APIResponse(200, '2FA enabled successfully.'));
});

// disable 2fa
const disableTwoFactorAuthentication = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new APIError(401, 'Password is required.');
  }

  const user = await User.findById(req.user._id).select(
    '+twoFactorSecret +password'
  );
  if (!user) {
    throw new APIError(404, 'User not found');
  }

  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new APIError(409, 'Two factor authentication is already disabled');
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    throw new APIError(403, 'Invalid password. Cannot disable 2FA.');
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new APIResponse(200, '2FA disabled successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, twoFactorToken } = req.body;

  if (!email || !password) {
    throw new APIError(400, 'All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw new APIError(401, 'Invalid email address.');
  }

  if (password.toString().length < 8) {
    throw new APIError(400, 'Password must have a minimum length of 8');
  }

  const user = await User.findOne({ email }).select(
    '+password +twoFactorSecret'
  );
  if (!user) {
    throw new APIError(401, "User doesn't exist");
  }

  if (!(await user.matchPassword(password))) {
    throw new APIError(401, 'Invalid Email or Password');
  }

  // console.log('2FA: ', twoFactorToken);

  if (user.twoFactorEnabled) {
    if (!twoFactorToken || twoFactorToken === '') {
      return res
        .status(200)
        .json(new APIResponse(200, '2FA Token is required', { token: true }));
    }

    // verify token
    const isVerified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      token: twoFactorToken,
      window: 1,
      encoding: 'base32',
    });

    if (!isVerified) {
      throw new APIError(401, 'Invalid 2FA token found. Cannot login');
    }
  }

  const accessToken = generateAccessToken(res, user._id, user.email, user.role);
  const refreshToken = generateRefreshToken(res, user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

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

// logout
const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  if (!user) {
    throw new APIError(401, 'User not authenticated.');
  }

  return res
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .status(200)
    .json(new APIResponse(200, 'User logged out successfully'));
});

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new APIError(404, 'User not found or not authenticated');
  }
  return res
    .status(200)
    .json(new APIResponse(200, 'User profile fecthed successfully!', user));
});

// update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name && !email && !password) {
    return res.status(200).json(new APIResponse(200, 'Nothing to update'));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new APIError(404, 'User not found or not authenticated');
  }

  user.name = name || user.name;
  user.email = email || user.email;

  if (password) {
    user.password = password;
  }

  const saveUser = await user.save();

  if (!saveUser) {
    throw new APIError(400, 'Error updating the user');
  }

  // console.log(saveUser);

  return res
    .status(200)
    .json(new APIResponse(200, 'User updated successfully', saveUser));
});

// delete profile
const deleteUserProfile = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIError(401, 'All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw new APIError(401, 'Invalid Email Format');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new APIError(404, 'User not found');
  }

  if (user._id.toString() !== req.user._id.toString()) {
    throw new APIError(403, 'You need to login first to delete your account');
  }

  const isValidPassword = await user.matchPassword(password);

  if (!isValidPassword) {
    throw new APIError(403, 'Invalid email or password');
  }

  // now start deletion process
  await Cart.findOneAndDelete({ user: user._id });
  await Review.deleteMany({ user: user._id });
  await Product.deleteMany({ seller: user._id });

  // now delete the account
  await User.deleteOne({ _id: user._id });

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new APIResponse(200, 'Account deleted successfully!'));
});

// get address
const getUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new APIError(404, 'User not found or not autheticated');
  const addresses = user.address || [];
  // console.log(addresses);
  return res
    .status(200)
    .json(new APIResponse(200, 'Addresses fetched successfully', addresses));
});

// add address
const addUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new APIError(404, 'User not found or not autheticated');

  const { house, city, state, country, zipcode } = req.body;

  if (!house || !city || !state || !country || !zipcode) {
    throw new APIError(401, 'All fields are required.');
  }

  const newAddress = { house, city, state, country, zipcode };

  user.address.push(newAddress);
  const savedUser = await user.save({ validateBeforeSave: false });

  if (!savedUser) {
    throw new APIError(400, 'Unable to save addresses');
  }

  return res
    .status(201)
    .json(new APIResponse(201, 'Address saved successfully', savedUser));
});
// update address
const updateUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new APIError(404, 'User not found or not authenticated');
  }

  const { id, house, state, city, country, zipcode, isDefault } = req.body;

  if (!id) {
    throw new APIError(400, 'No Address ID found');
  }

  if (!house && !state && !city && !country && !zipcode) {
    return res.status(200).json(new APIResponse(200, 'Nothing to update'));
  }

  // find the subdocument address using .id() from mongoose
  const address = user.address.id(id);
  if (!address) {
    throw new APIError(401, 'Address not found');
  }

  address.house = house || address.house;
  address.state = state || address.state;
  address.city = city || address.city;
  address.country = country || address.country;
  address.zipcode = zipcode || address.zipcode;

  if (isDefault) {
    user.address.forEach((addr) => {
      addr.isDefault = addr._id.equals(id);
    });
  }

  const savedUser = await user.save({ validateBeforeSave: false });

  if (!savedUser) {
    throw new APIError(401, "Error updating the user's address");
  }

  return res
    .status(200)
    .json(new APIResponse(200, 'Address updated successfully', savedUser));
});
// delete address
const deleteUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new APIError(404, 'User not found or not authenticated');
  }

  const { id: addressId } = req.body;

  if (!addressId) {
    throw new APIError(400, 'No Address ID found');
  }

  const address = user.address.id(addressId);

  if (!address) {
    throw new APIError(401, 'Address not found');
  }

  user.address.pull({ _id: addressId });
  const savedUser = await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new APIResponse(200, 'Address deleted successfully', savedUser));
});

// become seller
const becomeSeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new APIError(404, 'User not found or not authenticated');
  }

  if (user.role === 'seller') {
    throw new APIError(403, 'You are already a seller!');
  }

  const { businessName, email, phone, website, location, description } =
    req.body;

  if (!email || !businessName || !phone || !location) {
    throw new APIError(
      401,
      'Email, businessName, phone and location are required'
    );
  }

  const sellerInfo = {
    businessName,
    email,
    phone,
    location,
    website: website ?? null,
    description: description ?? null,
  };

  user.role = 'seller';
  user.sellerInfo = sellerInfo;
  const savedUser = await user.save();

  if (!savedUser) {
    throw new APIError(400, 'Unable to save the seller information');
  }

  return res
    .status(200)
    .json(new APIResponse(200, 'Your are now an seller', savedUser));
});

// update seller info

const updateSellerInfo = asyncHandler(async (req, res) => {
  const { businessName, email, phone, website, location, description } =
    req.body;

  if (
    !businessName &&
    !email &&
    !phone &&
    !website &&
    !location &&
    !description
  ) {
    return res.status(200).json(new APIResponse(200, 'Nothing to update'));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new APIError(404, 'User not found or not authenticated');
  }

  if (user.role !== 'seller') {
    throw new APIError(403, 'You are not a seller!');
  }

  const sellerInfo = {
    businessName: businessName || user.sellerInfo.businessName,
    phone: phone || user.sellerInfo.phone,
    email: email || user.sellerInfo.email,
    location: location || user.sellerInfo.location,
    description: description || user.sellerInfo.description,
    website: website || user.sellerInfo.website,
  };

  user.sellerInfo = sellerInfo;
  const savedUser = await user.save();

  if (!savedUser) {
    throw new APIError(400, 'Unable to save the seller information');
  }

  return res
    .status(200)
    .json(
      new APIResponse(
        200,
        'Your seller information has been updated',
        savedUser
      )
    );
});

// refresh tokens
const refreshUserTokens = asyncHandler(async (req, res) => {
  // get incoming tokens
  const incomingToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingToken) {
    throw new APIError(403, 'Unauthorized access');
  }

  // decode token
  const decodedToken = jwt.verify(
    incomingToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!decodedToken) {
    throw new APIError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new APIError(404, 'User not found with assocuiated token');
  }

  if (user.refreshToken !== incomingToken) {
    throw new APIError(401, 'Refresh token is invalid/expired');
  }

  const accessToken = generateAccessToken(res, user._id, user.email, user.role);

  const refreshToken = generateRefreshToken(res, user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const validUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
    sellerInfo: user.sellerInfo,
    accessToken,
    refreshToken,
  };

  return res
    .status(200)
    .json(new APIResponse(200, 'Token Refreshed', validUser));
});

// generate reset password token
const generateResetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new APIError(401, 'Email is required.');
  }

  if (!validator.isEmail(email)) {
    throw new APIError(401, 'Invalid email address');
  }

  // find the user
  const user = await User.findOne({ email });

  if (!user) {
    throw new APIError(404, 'User not found with this email');
  }

  // generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const resetExpiry = Date.now() + 15 * 60 * 1000;

  user.forgetPasswordToken = hashedResetToken;
  user.forgetPasswordExpiry = resetExpiry;
  await user.save({ validateBeforeSave: false });

  const url = {
    url: `/forgetPassword/${resetToken}`,
  };

  return res
    .status(200)
    .json(new APIResponse(200, 'Reset token generated', url));
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    throw new APIError(
      400,
      'Please provide both password and confirmPassword.'
    );
  }

  if (password !== confirmPassword) {
    throw new APIError(422, "Passwords don't match.");
  }

  // Retrieve the user attached by the middleware
  const user = req.resetUser;

  // Update the user's password and clear reset token fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return res
    .status(200)
    .json(new APIResponse(200, 'Password has been reset successfully.', {}));
});

export {
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
};
