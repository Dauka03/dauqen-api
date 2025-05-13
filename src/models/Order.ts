import mongoose, { Document, Schema } from 'mongoose';

// Интерфейс для элемента заказа
interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  quantity: number;
  selectedOptions: {
    name: string;
    price: number;
  }[];
  price: number;
  notes?: string;
}

// Интерфейс для заказа
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'card' | 'cash';
  pickupTime: Date;
  pickupType: 'takeaway' | 'dine-in';
  orderNumber: string;
  estimatedPreparationTime: number; // в минутах
  actualPickupTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    items: [{
      menuItem: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      selectedOptions: [{
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      }],
      price: {
        type: Number,
        required: true,
      },
      notes: String,
    }],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
      required: true,
    },
    pickupTime: {
      type: Date,
      required: true,
    },
    pickupType: {
      type: String,
      enum: ['takeaway', 'dine-in'],
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    estimatedPreparationTime: {
      type: Number,
      required: true,
    },
    actualPickupTime: {
      type: Date,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Генерация номера заказа
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `${year}${month}${day}-${random}`;
  }
  next();
});

// Индексы для быстрого поиска
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema); 