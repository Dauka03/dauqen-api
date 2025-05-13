// API Constants
export const API_PREFIX = '/api/v1';
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_SORT = '-createdAt';

// Authentication Constants
export const JWT_EXPIRES_IN = '7d';
export const JWT_COOKIE_EXPIRES_IN = 7;
export const PASSWORD_RESET_EXPIRES_IN = '1h';
export const VERIFICATION_TOKEN_EXPIRES_IN = '24h';
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_ATTEMPTS_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

// File Upload Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
export const UPLOAD_DIR = 'uploads';
export const TEMP_DIR = 'temp';

// Order Constants
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export const PAYMENT_METHOD = {
  CASH: 'CASH',
  CARD: 'CARD',
  ONLINE: 'ONLINE',
} as const;

// Delivery Constants
export const DELIVERY_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export const MAX_DELIVERY_DISTANCE = 10000; // 10km
export const BASE_DELIVERY_FEE = 500;
export const PER_KM_DELIVERY_FEE = 100;
export const FREE_DELIVERY_THRESHOLD = 5000;

// Restaurant Constants
export const RESTAURANT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  CLOSED: 'CLOSED',
} as const;

export const CUISINE_TYPES = [
  'Kazakh',
  'Russian',
  'Chinese',
  'Japanese',
  'Italian',
  'Mexican',
  'Indian',
  'Turkish',
  'American',
  'Other',
] as const;

// User Constants
export const USER_ROLE = {
  ADMIN: 'ADMIN',
  RESTAURANT_OWNER: 'RESTAURANT_OWNER',
  CUSTOMER: 'CUSTOMER',
  DELIVERY_PERSON: 'DELIVERY_PERSON',
} as const;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  BLOCKED: 'BLOCKED',
} as const;

// Cache Constants
export const CACHE_TTL = {
  SHORT: 60 * 5, // 5 minutes
  MEDIUM: 60 * 30, // 30 minutes
  LONG: 60 * 60 * 24, // 24 hours
} as const;

// Rate Limiting Constants
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const;

// Notification Constants
export const NOTIFICATION_TYPE = {
  ORDER_STATUS: 'ORDER_STATUS',
  PAYMENT: 'PAYMENT',
  PROMOTION: 'PROMOTION',
  SYSTEM: 'SYSTEM',
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
} as const;

// Error Messages
export const ERROR_MESSAGE = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  RESTAURANT_NOT_FOUND: 'Restaurant not found',
  ORDER_NOT_FOUND: 'Order not found',
  PAYMENT_FAILED: 'Payment failed',
  DELIVERY_NOT_AVAILABLE: 'Delivery not available for this location',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File too large',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
} as const;

// Success Messages
export const SUCCESS_MESSAGE = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  RESTAURANT_CREATED: 'Restaurant created successfully',
  RESTAURANT_UPDATED: 'Restaurant updated successfully',
  RESTAURANT_DELETED: 'Restaurant deleted successfully',
  ORDER_CREATED: 'Order created successfully',
  ORDER_UPDATED: 'Order updated successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  PAYMENT_SUCCESSFUL: 'Payment successful',
  DELIVERY_STARTED: 'Delivery started',
  DELIVERY_COMPLETED: 'Delivery completed',
} as const;

export const CACHE = {
  TTL: 3600, // 1 hour in seconds
  PREFIX: 'cache:',
};

export const NOTIFICATION = {
  TYPES: {
    ORDER: 'order',
    PAYMENT: 'payment',
    SYSTEM: 'system',
  },
  PRIORITIES: {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
  },
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
};

export const PAYMENT = {
  CURRENCY: 'usd',
  MIN_AMOUNT: 50, // cents
  MAX_AMOUNT: 1000000, // cents
};

export default {
  API_PREFIX,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_SORT,
  JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN,
  PASSWORD_RESET_EXPIRES_IN,
  VERIFICATION_TOKEN_EXPIRES_IN,
  MAX_LOGIN_ATTEMPTS,
  LOGIN_ATTEMPTS_WINDOW,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  UPLOAD_DIR,
  TEMP_DIR,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  DELIVERY_STATUS,
  MAX_DELIVERY_DISTANCE,
  BASE_DELIVERY_FEE,
  PER_KM_DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  RESTAURANT_STATUS,
  CUISINE_TYPES,
  USER_ROLE,
  USER_STATUS,
  CACHE_TTL,
  RATE_LIMIT,
  NOTIFICATION_TYPE,
  VALIDATION,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  CACHE,
  NOTIFICATION,
  DEFAULT_PAGINATION,
  PAYMENT,
}; 