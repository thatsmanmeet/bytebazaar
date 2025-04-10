import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Product name is required.'],
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Product description is required.'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product Category is required.'],
    },
    stock: {
      type: Number,
      min: 0,
      required: [true, 'Product Stock is required.'],
    },
    brand: {
      type: String,
      trim: true,
      required: [true, 'Product Brand is required.'],
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
      required: [true, 'Product price is required.'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
