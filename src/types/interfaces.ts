import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'user' | 'admin' | 'restaurant';
  favoriteRestaurants: string[];
  orderHistory: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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
}

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  restaurant: string;
  image: string;
  isAvailable: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
}

export interface IOrder extends Document {
  user: string;
  items: {
    menuItem: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: 'cash' | 'card';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
} 