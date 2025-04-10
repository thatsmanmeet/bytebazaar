import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIError } from '../utils/APIError.js';
import { APIResponse } from '../utils/APIResponse.js';
import { Category } from '../models/category.models.js';

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new APIError(400, 'All fields are required.');
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new APIError(400, 'Category already exists');
  }

  const category = await Category.create({ name, description });

  if (!category) {
    throw new APIError(401, 'Something went wrong creating category');
  }

  return res
    .status(201)
    .json(new APIResponse(201, 'Category created', category));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  return res
    .status(200)
    .json(new APIResponse(200, 'Categories Fetched', categories));
});

export { createCategory, getAllCategories };
