import { User } from '../models/User';
import { NOTIFICATION } from './constants';
import admin from 'firebase-admin';
import { Expo } from 'expo-server-sdk';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Expo client
const expo = new Expo();

// Notification types
export enum NotificationType {
  ORDER_STATUS = 'ORDER_STATUS',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILURE = 'PAYMENT_FAILURE',
  DELIVERY_UPDATE = 'DELIVERY_UPDATE',
  PROMOTION = 'PROMOTION',
}

// Interface for notification data
interface NotificationData {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
}

// Interface for notification
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority: string;
  read: boolean;
  createdAt: Date;
}

// Interface for notification template
interface NotificationTemplate {
  type: string;
  title: string;
  message: string;
  data?: any;
}

// Function to send notification to a single user
export const sendNotification = async (
  user: typeof User,
  notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
): Promise<void> => {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.message,
      },
      data: notification.data || {},
      token: user.fcmToken,
    };

    await admin.messaging().send(message);
  } catch (error) {
    console.error('Notification error:', error);
    throw error;
  }
};

// Function to send notification to multiple users
export const sendBulkNotifications = async (
  users: typeof User[],
  notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
): Promise<void> => {
  try {
    const tokens = users.map(user => user.fcmToken).filter(Boolean);
    
    if (tokens.length === 0) return;

    const message = {
      notification: {
        title: notification.title,
        body: notification.message,
      },
      data: notification.data || {},
      tokens,
    };

    await admin.messaging().sendMulticast(message);
  } catch (error) {
    console.error('Bulk notification error:', error);
    throw error;
  }
};

// Function to create a notification
export const createNotification = (
  type: string,
  title: string,
  message: string,
  data?: any
): Notification => {
  return {
    id: generateId(),
    type,
    title,
    message,
    data,
    priority: 'default',
    read: false,
    createdAt: new Date(),
  };
};

// Function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Function to format notification message
export const formatNotificationMessage = (
  template: string,
  data: Record<string, any>
): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
};

// Function to create order status notification
export const createOrderStatusNotification = (
  orderId: string,
  status: string,
  customerName: string
): Notification => {
  const templates: Record<string, NotificationTemplate> = {
    PENDING: {
      type: 'ORDER_STATUS',
      title: 'Order Received',
      message: 'Your order #{orderId} has been received and is being processed.',
    },
    CONFIRMED: {
      type: 'ORDER_STATUS',
      title: 'Order Confirmed',
      message: 'Your order #{orderId} has been confirmed and is being prepared.',
    },
    PREPARING: {
      type: 'ORDER_STATUS',
      title: 'Order Preparing',
      message: 'Your order #{orderId} is being prepared by the restaurant.',
    },
    READY: {
      type: 'ORDER_STATUS',
      title: 'Order Ready',
      message: 'Your order #{orderId} is ready for pickup/delivery.',
    },
    DELIVERING: {
      type: 'ORDER_STATUS',
      title: 'Order Delivering',
      message: 'Your order #{orderId} is on its way to you.',
    },
    DELIVERED: {
      type: 'ORDER_STATUS',
      title: 'Order Delivered',
      message: 'Your order #{orderId} has been delivered. Enjoy your meal!',
    },
    CANCELLED: {
      type: 'ORDER_STATUS',
      title: 'Order Cancelled',
      message: 'Your order #{orderId} has been cancelled.',
    },
  };

  const template = templates[status] || {
    type: 'ORDER_STATUS',
    title: 'Order Update',
    message: 'Your order #{orderId} status has been updated to {status}.',
  };

  return createNotification(
    template.type,
    template.title,
    formatNotificationMessage(template.message, { orderId, status }),
    { orderId, status, customerName }
  );
};

// Function to create payment notification
export const createPaymentNotification = (
  orderId: string,
  status: string,
  amount: number
): Notification => {
  const templates: Record<string, NotificationTemplate> = {
    PENDING: {
      type: 'PAYMENT',
      title: 'Payment Pending',
      message: 'Payment of {amount} for order #{orderId} is pending.',
    },
    COMPLETED: {
      type: 'PAYMENT',
      title: 'Payment Completed',
      message: 'Payment of {amount} for order #{orderId} has been completed.',
    },
    FAILED: {
      type: 'PAYMENT',
      title: 'Payment Failed',
      message: 'Payment of {amount} for order #{orderId} has failed.',
    },
    REFUNDED: {
      type: 'PAYMENT',
      title: 'Payment Refunded',
      message: 'Payment of {amount} for order #{orderId} has been refunded.',
    },
  };

  const template = templates[status] || {
    type: 'PAYMENT',
    title: 'Payment Update',
    message: 'Payment status for order #{orderId} has been updated to {status}.',
  };

  return createNotification(
    template.type,
    template.title,
    formatNotificationMessage(template.message, { orderId, status, amount }),
    { orderId, status, amount }
  );
};

// Function to create promotion notification
export const createPromotionNotification = (
  title: string,
  message: string,
  promotionData: any
): Notification => {
  return createNotification(
    'PROMOTION',
    title,
    message,
    { promotion: promotionData }
  );
};

// Function to create system notification
export const createSystemNotification = (
  title: string,
  message: string,
  data?: any
): Notification => {
  return createNotification('SYSTEM', title, message, data);
};

// Function to mark notification as read
export const markNotificationAsRead = (notification: Notification): Notification => {
  return {
    ...notification,
    read: true,
  };
};

// Function to filter notifications by type
export const filterNotificationsByType = (
  notifications: Notification[],
  type: string
): Notification[] => {
  return notifications.filter((notification) => notification.type === type);
};

// Function to filter unread notifications
export const filterUnreadNotifications = (
  notifications: Notification[]
): Notification[] => {
  return notifications.filter((notification) => !notification.read);
};

// Function to sort notifications by date
export const sortNotificationsByDate = (
  notifications: Notification[],
  ascending: boolean = false
): Notification[] => {
  return [...notifications].sort((a, b) => {
    const dateA = a.createdAt.getTime();
    const dateB = b.createdAt.getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Send push notification
export const sendPushNotification = async (
  pushToken: string,
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  try {
    if (!Expo.isExpoPushToken(pushToken)) {
      throw new Error('Invalid push token');
    }

    const message = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
    };

    await expo.sendPushNotificationsAsync([message]);
  } catch (error) {
    console.error('Push notification error:', error);
    throw error;
  }
};

// Send multiple push notifications
export const sendMultiplePushNotifications = async (
  notifications: {
    pushToken: string;
    title: string;
    body: string;
    data?: any;
  }[]
): Promise<void> => {
  try {
    const messages = notifications
      .filter((notification) => Expo.isExpoPushToken(notification.pushToken))
      .map((notification) => ({
        to: notification.pushToken,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
      }));

    if (messages.length > 0) {
      await expo.sendPushNotificationsAsync(messages);
    }
  } catch (error) {
    console.error('Multiple push notifications error:', error);
    throw error;
  }
};

// Send order status notification
export const sendOrderStatusNotification = async (
  user: any,
  order: any
): Promise<void> => {
  if (user.pushToken) {
    await sendPushNotification(
      user.pushToken,
      'Order Status Update',
      `Your order #${order.orderNumber} status has been updated to ${order.status}`,
      {
        type: 'ORDER_STATUS',
        orderId: order._id,
        status: order.status,
      }
    );
  }
};

// Send payment notification
export const sendPaymentNotification = async (
  user: any,
  payment: any
): Promise<void> => {
  if (user.pushToken) {
    await sendPushNotification(
      user.pushToken,
      'Payment Confirmation',
      `Payment of $${payment.amount} has been processed successfully`,
      {
        type: 'PAYMENT',
        paymentId: payment._id,
        amount: payment.amount,
      }
    );
  }
};

// Send delivery notification
export const sendDeliveryNotification = async (
  user: any,
  delivery: any
): Promise<void> => {
  if (user.pushToken) {
    await sendPushNotification(
      user.pushToken,
      'Delivery Update',
      `Your order is ${delivery.status.toLowerCase()}`,
      {
        type: 'DELIVERY',
        deliveryId: delivery._id,
        status: delivery.status,
      }
    );
  }
};

// Send promotion notification
export const sendPromotionNotification = async (
  users: any[],
  promotion: any
): Promise<void> => {
  const notifications = users
    .filter((user) => user.pushToken)
    .map((user) => ({
      pushToken: user.pushToken,
      title: 'New Promotion',
      body: promotion.message,
      data: {
        type: 'PROMOTION',
        promotionId: promotion._id,
        discount: promotion.discount,
      },
    }));

  await sendMultiplePushNotifications(notifications);
};

// Send restaurant notification
export const sendRestaurantNotification = async (
  restaurant: any,
  message: string,
  data?: any
): Promise<void> => {
  if (restaurant.pushToken) {
    await sendPushNotification(
      restaurant.pushToken,
      'Restaurant Update',
      message,
      {
        type: 'RESTAURANT',
        ...data,
      }
    );
  }
};

// Send system notification
export const sendSystemNotification = async (
  users: any[],
  title: string,
  message: string,
  data?: any
): Promise<void> => {
  const notifications = users
    .filter((user) => user.pushToken)
    .map((user) => ({
      pushToken: user.pushToken,
      title,
      body: message,
      data: {
        type: 'SYSTEM',
        ...data,
      },
    }));

  await sendMultiplePushNotifications(notifications);
};

// Send chat notification
export const sendChatNotification = async (
  user: any,
  sender: any,
  message: string
): Promise<void> => {
  if (user.pushToken) {
    await sendPushNotification(
      user.pushToken,
      `New message from ${sender.name}`,
      message,
      {
        type: 'CHAT',
        senderId: sender._id,
        message,
      }
    );
  }
};

// Send review notification
export const sendReviewNotification = async (
  restaurant: any,
  review: any
): Promise<void> => {
  if (restaurant.pushToken) {
    await sendPushNotification(
      restaurant.pushToken,
      'New Review',
      `You have received a new ${review.rating}-star review`,
      {
        type: 'REVIEW',
        reviewId: review._id,
        rating: review.rating,
      }
    );
  }
};

export default {
  sendNotification,
  sendBulkNotifications,
  createNotification,
  createOrderStatusNotification,
  createPaymentNotification,
  createPromotionNotification,
  createSystemNotification,
  markNotificationAsRead,
  filterNotificationsByType,
  filterUnreadNotifications,
  sortNotificationsByDate,
  sendPushNotification,
  sendMultiplePushNotifications,
  sendOrderStatusNotification,
  sendPaymentNotification,
  sendDeliveryNotification,
  sendPromotionNotification,
  sendRestaurantNotification,
  sendSystemNotification,
  sendChatNotification,
  sendReviewNotification,
}; 