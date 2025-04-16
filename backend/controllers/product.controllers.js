import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIError } from '../utils/APIError.js';
import { APIResponse } from '../utils/APIResponse.js';
import { User } from '../models/user.models.js';
import { Product } from '../models/product.models.js';
import { Review } from '../models/reviews.models.js';

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res
    .status(200)
    .json(new APIResponse(200, 'Products Fetched', products));
});
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new APIError(404, 'Product not found or Invalid product ID');
  }
  return res.status(200).json(new APIResponse(200, 'Product fetched', product));
});
const createProduct = asyncHandler(async (req, res) => {
  const { name, content, category, stock, brand, price, images } = req.body;

  if (!name || !content || !category || !stock || !brand || !price || !images) {
    throw new APIError(400, 'All fields are required.');
  }

  const product = await Product.create({
    name,
    content,
    category,
    stock,
    brand,
    price,
    images,
    seller: req.user._id,
  });

  if (!product) {
    throw new APIError(401, 'Error creating the product');
  }

  return res
    .status(201)
    .json(new APIResponse(201, 'Product created successfully', product));
});
const updateProduct = asyncHandler(async (req, res) => {
  const { name, content, category, stock, brand, price, images } = req.body;

  if (!name && !content && !category && !stock && !brand && !price && !images) {
    return;
  }

  const product = await Product.findById(req.params.id);

  const isProductOwner = product.seller.toString() === req.user._id.toString();

  if (!isProductOwner) {
    throw new APIError(403, 'You are not authorized to update this product');
  }

  product.name = name || product.name;
  product.content = content || product.content;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.stock = stock || product.stock;
  product.price = price || product.price;
  product.images = images || product.images;
  const savedProduct = await product.save();

  if (!savedProduct) {
    throw new APIError(401, 'Something went wrong while updating the product');
  }

  return res
    .status(200)
    .json(new APIResponse(200, 'Product updated successfully', savedProduct));
});
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  const isProductOwner = product.seller.toString() === req.user._id.toString();

  if (!isProductOwner) {
    throw new APIError(403, 'You are not authorized to delete this product');
  }

  const deletedProduct = await product.deleteOne();

  if (!deletedProduct) {
    throw new APIError(401, 'Something went wrong while deleting the product');
  }

  return res
    .status(200)
    .json(new APIResponse(200, 'Product deleted successfully'));
});
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).populate(
    'user',
    'name'
  );
  return res.status(200).json(new APIResponse(200, 'Reviews fetched', reviews));
});
const createReview = asyncHandler(async (req, res) => {
  const { title, score, comment } = req.body;

  if (!score) {
    throw new APIError(401, 'Score is required.');
  }

  const alreadyReviewed = await Review.findOne({
    $and: [{ user: req.user._id }, { product: req.params.id }],
  });

  if (alreadyReviewed) {
    throw new APIError(409, 'You have already reviewed this product');
  }

  const review = await Review.create({
    title,
    score,
    comment,
    user: req.user._id,
    product: req.params.id,
  });

  if (!review) {
    throw new APIError(401, 'Something went wrong creating a review');
  }

  // update product info
  const currProduct = await Product.findById(req.params.id);
  const allReviews = await Review.find({ product: currProduct._id });

  if (!currProduct) {
    throw new APIError(404, 'Product not found');
  }

  currProduct.numReviews = currProduct.numReviews + 1;
  currProduct.rating =
    allReviews.reduce((acc, review) => acc + review.score, 0) /
    allReviews.length;
  currProduct.save();

  return res.status(201).json(new APIResponse(201, 'Review created', review));
});
const updateReview = asyncHandler(async (req, res) => {
  const { title, score, comment } = req.body;

  const alreadyReviewed = await Review.findOne({
    $and: [{ user: req.user._id }, { product: req.params.id }],
  });

  if (!alreadyReviewed) {
    throw new APIError(409, "You haven't reviewed this product");
  }

  if (alreadyReviewed.user.toString() !== req.user._id.toString()) {
    throw new APIError(403, 'You are not authorized to update this review');
  }

  alreadyReviewed.title = title || alreadyReviewed.title;
  alreadyReviewed.score = score || alreadyReviewed.score;
  alreadyReviewed.comment = comment || alreadyReviewed.comment;
  const review = await alreadyReviewed.save();

  if (!review) {
    throw new APIError(401, 'Something went wrong updating a review');
  }

  // update product info
  const currProduct = await Product.findById(req.params.id);
  const allReviews = await Review.find({ product: currProduct._id });

  if (!currProduct) {
    throw new APIError(404, 'Product not found');
  }

  currProduct.rating =
    allReviews.reduce((acc, review) => acc + review.score, 0) /
    allReviews.length;
  currProduct.save();

  return res.status(201).json(new APIResponse(201, 'Review updated', review));
});
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({
    $and: [{ user: req.user._id }, { product: req.params.id }],
  });

  if (!review) {
    throw new APIError(401, "You don't have a review or is already deleted");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new APIError(403, 'You are not authorized to delete this review');
  }

  const deletedReview = await review.deleteOne();
  if (!deleteReview) {
    throw new APIError(401, 'Something went wrong deleting this review');
  }

  // update product info
  const currProduct = await Product.findById(req.params.id);
  const allReviews = await Review.find({ product: currProduct._id });

  if (!currProduct) {
    throw new APIError(404, 'Product not found');
  }

  currProduct.numReviews = currProduct.numReviews - 1;
  currProduct.rating =
    allReviews.reduce((acc, review) => acc + review.score, 0) /
    allReviews.length;
  currProduct.save();

  return res.status(200).json(new APIResponse(201, 'Review Deleted'));
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
