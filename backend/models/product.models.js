import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Product name is required.'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Product description is required.'],
    },
    features: [
      {
        name: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product Category is required.'],
    },
    Stock: {
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
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
