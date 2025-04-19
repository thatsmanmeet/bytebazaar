import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIError } from '../utils/APIError.js';
import { APIResponse } from '../utils/APIResponse.js';
import { Order } from '../models/orders.models.js';
import { Cart } from '../models/cart.models.js';
import validator from 'validator';
import { Product } from '../models/product.models.js';

// get my orders

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    'items.product'
  );
  return res.status(200).json(new APIResponse(200, 'Orders fetched', orders));
});

// get order by id

const getOrderById = asyncHandler(async (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    throw new APIError(401, 'Invalid order ID');
  }
  const order = await Order.findById(req.params.id).populate('items.product');

  if (!order) {
    throw new APIError(404, 'Order not found or Invalid order ID');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new APIError(403, "This order doesn't belong to you");
  }

  return res.status(200).json(new APIResponse(200, 'Order Fetched', order));
});

// create order
const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product'
  );
  if (!cart || cart.items.length === 0) {
    throw new APIError(400, 'Cart is empty. Cannot create order');
  }

  // get data from frontend
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    throw new APIError(401, 'Shipping Address or Payment Method is required');
  }

  const orders = [];

  for (const item of cart.items) {
    const productItem = await Product.findById(item.product._id);

    if (!productItem || productItem.stock < item.quantity) {
      throw new APIError(400, 'Insufficient stock for ' + item.product.name);
    }

    const itemsPrice = item.product.price * item.quantity;
    const taxPrice = itemsPrice * 0.18;
    const shippingPrice = itemsPrice < 500 ? 500 : 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    // extract relevant data from the cart
    const order = await Order.create({
      user: req.user._id,
      seller: item.product.seller,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentMethod,
      shippingAddress,
      items: [
        {
          product: item.product._id,
          quantity: item.quantity,
        },
      ],
    });

    if (!order) {
      throw new APIError(401, 'Something went wrong creating order');
    }

    const stockUpdate = await Product.updateOne(
      { _id: item.product._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (stockUpdate.modifiedCount === 0) {
      throw new APIError(404, 'Insufficient stocks for ' + item.product.name);
    }
    orders.push(order);
  }

  // empty cart
  cart.items = [];
  await cart.save();

  return res.status(201).json(new APIResponse(201, 'Orders created', orders));
});
// cancel my order
const cancelOrder = asyncHandler(async (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    throw new APIError(401, 'Invalid order ID');
  }

  const order = await Order.findById(req.params.id).populate('items.product');

  if (!order) {
    throw new APIError(404, 'Order not found or Invalid order ID');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new APIError(403, "This order doesn't belong to you");
  }

  if (order.isCancelled) {
    throw new APIError(409, 'order is already cancelled.');
  }

  order.isCancelled = true;
  const cancelledOrder = await order.save();

  const updatedStock = await Product.updateOne(
    { _id: order.items[0].product._id },
    { $inc: { stock: Number(order.items[0].quantity) } }
  );
  if (updatedStock.modifiedCount === 0) {
    throw new APIError(400, 'Something went wrong cancelling order.');
  }

  if (!cancelledOrder) {
    throw new APIError(401, 'Something went wrong cancelling order');
  }

  return res
    .status(200)
    .json(new APIResponse(200, 'Order cancelled', cancelledOrder));
});
// pay for order
const payForOrder = asyncHandler(async (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    throw new APIError(401, 'Invalid order ID');
  }
});

// SELLER

// get order by id
const getSellerOrderById = asyncHandler(async (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    throw new APIError(401, 'Invalid order ID');
  }
  const order = await Order.findById(req.params.id)
    .populate('items.product')
    .populate('user');

  if (!order) {
    throw new APIError(404, 'Order not found or Invalid order ID');
  }

  if (order.seller.toString() !== req.user._id.toString()) {
    throw new APIError(403, "This order doesn't belong to you");
  }

  return res.status(200).json(new APIResponse(200, 'Order Fetched', order));
});

// get my orders
const getMySellerOrders = asyncHandler(async (req, res) => {
  console.log('test');
  const orders = await Order.find({ seller: req.user._id }).populate(
    'items.product'
  );
  return res.status(200).json(new APIResponse(200, 'Orders fetched', orders));
});

// cancel my order
const cancelOrderBySeller = asyncHandler(async (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    throw new APIError(401, 'Invalid order ID');
  }

  const order = await Order.findById(req.params.id).populate('items.product');

  if (!order) {
    throw new APIError(404, 'Order not found or Invalid order ID');
  }

  if (order.seller.toString() !== req.user._id.toString()) {
    throw new APIError(403, "This order doesn't belong to you");
  }

  if (order.isCancelled) {
    throw new APIError(409, 'order is already cancelled.');
  }

  const { message } = req.body;

  if (!message) {
    throw new APIError(400, 'Message is required for update');
  }

  order.isCancelled = true;
  order.cancelMessage = message;
  const cancelledOrder = await order.save();
  const updateStock = await Product.updateOne(
    { _id: order.items[0].product._id },
    { $inc: { stock: Number(order.items[0].quantity) } }
  );

  if (updateStock.modifiedCount === 0) {
    throw new APIError(400, 'Unable to cancel the order');
  }

  if (!cancelledOrder) {
    throw new APIError(401, 'Something went wrong cancelling order');
  }

  return res
    .status(200)
    .json(new APIResponse(200, 'Order cancelled by Seller', cancelledOrder));
});

// provide updates for order
const addOrderUpdates = asyncHandler(async (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    throw new APIError(401, 'Invalid order ID');
  }

  const order = await Order.findById(req.params.id).populate('items.product');

  if (!order) {
    throw new APIError(404, 'Order not found or Invalid order ID');
  }

  if (order.seller.toString() !== req.user._id.toString()) {
    throw new APIError(403, "This order doesn't belong to you");
  }

  const { message } = req.body;

  if (!message) {
    throw new APIError(401, 'Message is required for update');
  }

  order.updates.push({ message });
  const updatedOrder = await order.save();

  if (!updatedOrder) {
    throw new APIError(401, 'Something went wrong while adding updates');
  }

  return res
    .status(200)
    .json(new APIResponse(200, 'Message added successfully', updatedOrder));
});

export {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  payForOrder,
  addOrderUpdates,
  cancelOrderBySeller,
  getMySellerOrders,
  getSellerOrderById,
};
