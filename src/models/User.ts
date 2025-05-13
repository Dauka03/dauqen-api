import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  favoriteRestaurants: mongoose.Types.ObjectId[];
  orderHistory: mongoose.Types.ObjectId[];
  savedCards?: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault: boolean;
  }[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'restaurant_owner'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    favoriteRestaurants: [{
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    }],
    orderHistory: [{
      type: Schema.Types.ObjectId,
      ref: 'Order',
    }],
    savedCards: [{
      cardNumber: {
        type: String,
        required: true,
      },
      cardHolder: {
        type: String,
        required: true,
      },
      expiryDate: {
        type: String,
        required: true,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Индексы для быстрого поиска
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

export const User = mongoose.model<IUser>('User', userSchema); 