import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// JWT Configuration
export const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '7d';

// Database Configuration
export const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/food-delivery';

// Server Configuration
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Email Configuration
export const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASS = process.env.SMTP_PASS || '';
export const SMTP_FROM = process.env.SMTP_FROM || '';

// Stripe Configuration
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Redis Configuration
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

// File Upload Configuration
export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
];

// API Configuration
export const API_PREFIX = process.env.API_PREFIX || '/api/v1';
export const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '900000'); // 15 minutes
export const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100');

// Cache Configuration
export const CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600'); // 1 hour

// Logging Configuration
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const LOG_FILE = process.env.LOG_FILE || 'app.log';

// Security Configuration
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
export const CORS_HEADERS = ['Content-Type', 'Authorization'];

// Feature Flags
export const ENABLE_EMAIL_VERIFICATION = process.env.ENABLE_EMAIL_VERIFICATION === 'true';
export const ENABLE_SMS_VERIFICATION = process.env.ENABLE_SMS_VERIFICATION === 'true';
export const ENABLE_PUSH_NOTIFICATIONS = process.env.ENABLE_PUSH_NOTIFICATIONS === 'true';

// External Services
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

// Application URLs
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@example.com';

// Feature Configuration
export const FEATURES = {
  ENABLE_LOYALTY_PROGRAM: process.env.ENABLE_LOYALTY_PROGRAM === 'true',
  ENABLE_REVIEWS: process.env.ENABLE_REVIEWS === 'true',
  ENABLE_DELIVERY_TRACKING: process.env.ENABLE_DELIVERY_TRACKING === 'true',
  ENABLE_PROMOTIONS: process.env.ENABLE_PROMOTIONS === 'true',
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
};

// Error Messages
export const ERROR_MESSAGES = {
  AUTHENTICATION_FAILED: 'Authentication failed',
  AUTHORIZATION_FAILED: 'Authorization failed',
  INVALID_INPUT: 'Invalid input',
  RESOURCE_NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  OPERATION_SUCCESSFUL: 'Operation successful',
  RESOURCE_CREATED: 'Resource created successfully',
  RESOURCE_UPDATED: 'Resource updated successfully',
  RESOURCE_DELETED: 'Resource deleted successfully',
}; 