import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  cuisine: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  priceRange: 'low' | 'medium' | 'high';
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  menu: string[];
  reviews: {
    user: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
  images: string[];
  categories: string[];
  isActive: boolean;
  averagePreparationTime: number; // в минутах
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    images: [{
      type: String,
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    priceRange: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    openingHours: {
      type: Map,
      of: {
        open: String,
        close: String,
      },
      required: true,
    },
    menu: [{
      type: String,
    }],
    reviews: [{
      user: String,
      rating: Number,
      comment: String,
      date: Date,
    }],
    categories: [{
      type: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    averagePreparationTime: {
      type: Number,
      required: true,
      default: 15, // среднее время приготовления в минутах
    },
  },
  {
    timestamps: true,
  }
);

// Индексы для быстрого поиска
restaurantSchema.index({ name: 'text', description: 'text' });
restaurantSchema.index({ 'address.coordinates': '2dsphere' });

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema); 