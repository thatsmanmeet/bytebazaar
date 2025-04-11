import mongoose from 'mongoose';

const cartItemsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [cartItemsSchema],
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 }, { unique: true, background: true });

export const Cart = mongoose.model('Cart', cartSchema);
