import mongoose, { Document, Schema } from 'mongoose';

// Интерфейс для дополнительных опций блюда
interface IMenuItemOption {
  name: string;
  price: number;
  isRequired: boolean;
}

// Интерфейс для блюда
export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  options: IMenuItemOption[];
  preparationTime: number; // в минутах
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  calories?: number;
  allergens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс для категории меню
export interface IMenuCategory extends Document {
  name: string;
  description: string;
  restaurant: mongoose.Types.ObjectId;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Схема для блюда
const menuItemSchema = new Schema<IMenuItem>(
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'MenuCategory',
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    options: [{
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      isRequired: {
        type: Boolean,
        default: false,
      },
    }],
    preparationTime: {
      type: Number,
      required: true,
      default: 15,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isSpicy: {
      type: Boolean,
      default: false,
    },
    calories: {
      type: Number,
    },
    allergens: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Схема для категории меню
const menuCategorySchema = new Schema<IMenuCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Индексы для быстрого поиска
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ restaurant: 1, category: 1 });
menuCategorySchema.index({ restaurant: 1, order: 1 });

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
export const MenuCategory = mongoose.model<IMenuCategory>('MenuCategory', menuCategorySchema); 