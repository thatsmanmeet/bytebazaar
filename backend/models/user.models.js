import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  isDefault: { type: Boolean, default: false },
  city: String,
  state: String,
  house: String,
  country: String,
  zipcode: String,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    address: [addressSchema],
    role: {
      type: String,
      enum: {
        values: ['customer', 'seller', 'admin'],
      },
      default: 'customer',
    },
    refreshToken: String,
    sellerInfo: {
      businessName: {
        type: String,
        required: function () {
          return this.role === 'seller';
        },
      },
      email: {
        type: String,
        required: function () {
          return this.role === 'seller';
        },
      },
      phone: {
        type: String,
        required: function () {
          return this.role === 'seller';
        },
      },
      website: {
        type: String,
      },
      location: {
        type: String,
        required: function () {
          return this.role === 'seller';
        },
      },
      description: {
        type: String,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      businessIcon: {
        type: String,
      },
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: String,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
