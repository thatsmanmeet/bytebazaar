import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      max: 5,
      min: 1,
    },
    comment: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true, background: true });

export const Review = mongoose.model('Review', reviewSchema);
