import { Cart } from '../models/cart.models.js';
import { Product } from '../models/product.models.js';
import { APIError } from '../utils/APIError.js';
import { APIResponse } from '../utils/APIResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import validator from 'validator';

// get all items in cart
const getAllCartItems = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(200).json(new APIResponse(200, 'Cart is Empty', []));
  }
  return res.status(200).json(new APIResponse(200, 'Cart Fetched', cart));
});

// add to cart
const addToCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id });
  }

  const { product, quantity } = req.body;

  if (!validator.isMongoId(product)) {
    throw new APIError(404, 'Invalid product ID');
  }

  if (!product || !quantity) {
    throw new APIError(401, 'Product or Quantity is required');
  }

  if (quantity < 1) {
    throw new APIError(401, 'Quantity must be greater than 0');
  }

  const doesProductExists = await Product.findById(product);

  if (!doesProductExists) {
    throw new APIError(404, 'Invalid product ID found');
  }

  // check if product already exists in the cart or not

  const existingItem = cart.items.find(
    (item) => item.product.toString() === product.toString()
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ product, quantity });
  }

  const updatedCart = await cart.save();

  if (!updatedCart) {
    throw new APIError(401, 'Something went wrong while adding to cart');
  }

  return res
    .status(201)
    .json(new APIResponse(201, 'Added to cart', updatedCart));
});

// update cart
const updateMyCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new APIError(404, "Cart doesn't exist");
  }

  const { product, quantity } = req.body;

  if (!validator.isMongoId(product)) {
    throw new APIError(404, 'Invalid product ID');
  }

  if (!product || !quantity) {
    throw new APIError(401, 'Product or Quantity is required');
  }

  if (quantity < 0) {
    throw new APIError(401, 'Quantity must be greater than 0');
  }

  const doesProductExists = await Product.findById(product);

  if (!doesProductExists) {
    throw new APIError(404, 'Invalid product ID found');
  }

  // check if product already exists in the cart or not

  const existingItem = cart.items.find(
    (item) => item.product.toString() === product.toString()
  );

  if (!existingItem) {
    throw new APIError(404, "Item doesn't exist in cart");
  }

  existingItem.quantity = Number(quantity);

  const updatedCart = await cart.save();

  if (!updatedCart) {
    throw new APIError(401, 'Something went wrong while updating the cart');
  }

  return res
    .status(200)
    .json(new APIResponse(200, 'updated cart', updatedCart));
});

// remove from cart
const removeFromCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new APIError(404, "Cart doesn't exist");
  }

  const { product } = req.body;

  if (!validator.isMongoId(product)) {
    throw new APIError(404, 'Invalid product ID');
  }

  if (!product) {
    throw new APIError(401, 'Product or Quantity is required');
  }

  const doesProductExists = await Product.findById(product);

  if (!doesProductExists) {
    throw new APIError(404, 'Invalid product ID found');
  }

  // check if product already exists in the cart or not

  const existingItem = cart.items.find(
    (item) => item.product.toString() === product.toString()
  );

  if (!existingItem) {
    throw new APIError(404, "Item doesn't exist in cart");
  }

  cart.items.pull(existingItem._id);

  const updatedCart = await cart.save();

  if (!updatedCart) {
    throw new APIError(
      401,
      'Something went wrong while removing from the cart'
    );
  }

  return res
    .status(200)
    .json(new APIResponse(200, 'Removed from cart', updatedCart));
});

export { getAllCartItems, addToCart, updateMyCart, removeFromCart };
