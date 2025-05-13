import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { RATE_LIMIT } from './constants';

// Create Redis client
const redis = new Redis(process.env.REDIS_URL);

// Create rate limiter store
const store = new RedisStore({
  sendCommand: (...args: string[]) => redis.call(...args),
});

// Create rate limiter middleware
export const rateLimiter = rateLimit({
  store,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Create stricter rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
  store,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create rate limiter for specific endpoints
export const createEndpointRateLimiter = (
  windowMs: number,
  max: number,
  message?: string
) => {
  return rateLimit({
    store,
    windowMs,
    max,
    message: {
      status: 'error',
      message: message || 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Create rate limiter for file uploads
export const uploadRateLimiter = rateLimit({
  store,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    status: 'error',
    message: 'Too many file uploads, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create rate limiter for API keys
export const apiKeyRateLimiter = rateLimit({
  store,
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    status: 'error',
    message: 'API rate limit exceeded, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create rate limiter for IP addresses
export const ipRateLimiter = rateLimit({
  store,
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create rate limiter for specific user roles
export const createRoleRateLimiter = (role: string) => {
  return rateLimit({
    store,
    windowMs: 60 * 1000, // 1 minute
    max: role === 'admin' ? 1000 : 100, // Different limits for different roles
    message: {
      status: 'error',
      message: 'Rate limit exceeded for your role, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Create rate limiter for specific endpoints with dynamic limits
export const createDynamicRateLimiter = (
  getLimit: (req: any) => number,
  windowMs: number = 60 * 1000
) => {
  return rateLimit({
    store,
    windowMs,
    max: getLimit,
    message: {
      status: 'error',
      message: 'Rate limit exceeded, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Create rate limiter for specific endpoints with custom key generator
export const createCustomKeyRateLimiter = (
  keyGenerator: (req: any) => string,
  windowMs: number = 60 * 1000,
  max: number = 100
) => {
  return rateLimit({
    store,
    windowMs,
    max,
    keyGenerator,
    message: {
      status: 'error',
      message: 'Rate limit exceeded, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Create rate limiter for specific endpoints with custom handler
export const createCustomHandlerRateLimiter = (
  handler: (req: any, res: any) => void,
  windowMs: number = 60 * 1000,
  max: number = 100
) => {
  return rateLimit({
    store,
    windowMs,
    max,
    handler,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Create rate limiter for specific endpoints with custom skip function
export const createSkipRateLimiter = (
  skip: (req: any) => boolean,
  windowMs: number = 60 * 1000,
  max: number = 100
) => {
  return rateLimit({
    store,
    windowMs,
    max,
    skip,
    message: {
      status: 'error',
      message: 'Rate limit exceeded, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export default {
  rateLimiter,
  authRateLimiter,
  createEndpointRateLimiter,
  uploadRateLimiter,
  apiKeyRateLimiter,
  ipRateLimiter,
  createRoleRateLimiter,
  createDynamicRateLimiter,
  createCustomKeyRateLimiter,
  createCustomHandlerRateLimiter,
  createSkipRateLimiter,
}; 