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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [cartItemsSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartSchema.index({ user: 1 }, { unique: true, background: true });

cartSchema.virtual('totalPrice').get(function () {
  // Make sure items are populated
  if (!this.populated('items.product')) return 0;

  if (this.items.length === 0) return 0;

  // Calculate subtotal from the cart items
  const itemsPrice = this.items.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );

  // Define the tax rate (18% GST)
  const TAX_RATE = 0.18;
  const taxPrice = itemsPrice * TAX_RATE;

  // Shipping is free if the itemsPrice is at least 500, otherwise 500 is added as shipping cost.
  const shippingPrice = itemsPrice >= 500 ? 0 : 100;

  // Total price includes subtotal, tax, and shipping
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  return totalPrice;
});

cartSchema.virtual('itemsPrice').get(function () {
  if (!this.populated('items.product')) return 0;
  return this.items.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );
});

cartSchema.virtual('taxPrice').get(function () {
  if (!this.populated('items.product')) return 0;
  const itemsPrice = this.items.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );
  return itemsPrice * 0.18;
});

cartSchema.virtual('shippingPrice').get(function () {
  if (!this.populated('items.product')) return 0;

  if (this.items.length === 0) return 0;

  const itemsPrice = this.items.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );
  return itemsPrice >= 500 ? 0 : 100;
});

export const Cart = mongoose.model('Cart', cartSchema);
