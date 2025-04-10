import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIError } from '../utils/APIError.js';
import { APIResponse } from '../utils/APIResponse.js';
import { User } from '../models/user.models.js';
import validator from 'validator';
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
    throw new APIError(400, 'All fields are required.');
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
    throw new APIError(401, 'Invalid Email or Password');
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

  console.log(saveUser);

  return res
    .status(200)
    .json(new APIResponse(200, 'User updated successfully', saveUser));
});

// delete profile
const deleteUserProfile = asyncHandler(async (req, res) => {});

// get address
const getUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new APIError(404, 'User not found or not autheticated');
  const addresses = user.address || [];

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

  const { id, house, state, city, country, zipcode } = req.body;

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
const refreshUserTokens = asyncHandler(async (req, res) => {});
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
};
