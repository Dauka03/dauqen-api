import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ERROR_MESSAGE } from './constants';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error types
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  DUPLICATE_KEY_ERROR = 'DUPLICATE_KEY_ERROR',
  JWT_ERROR = 'JWT_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FILE_ERROR = 'FILE_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  DELIVERY_ERROR = 'DELIVERY_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Error messages
export const ErrorMessage = {
  [ErrorType.VALIDATION_ERROR]: 'Validation error',
  [ErrorType.AUTHENTICATION_ERROR]: 'Authentication error',
  [ErrorType.AUTHORIZATION_ERROR]: 'Authorization error',
  [ErrorType.NOT_FOUND_ERROR]: 'Resource not found',
  [ErrorType.DUPLICATE_KEY_ERROR]: 'Duplicate key error',
  [ErrorType.JWT_ERROR]: 'JWT error',
  [ErrorType.DATABASE_ERROR]: 'Database error',
  [ErrorType.FILE_ERROR]: 'File error',
  [ErrorType.PAYMENT_ERROR]: 'Payment error',
  [ErrorType.DELIVERY_ERROR]: 'Delivery error',
  [ErrorType.EXTERNAL_SERVICE_ERROR]: 'External service error',
  [ErrorType.UNKNOWN_ERROR]: 'Unknown error',
};

// Global error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('Error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

// Async error handler wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Create specific error types
export const createValidationError = (message: string) => {
  return new AppError(message, 400);
};

export const createAuthenticationError = (message: string = ERROR_MESSAGE.UNAUTHORIZED) => {
  return new AppError(message, 401);
};

export const createAuthorizationError = (message: string = ERROR_MESSAGE.FORBIDDEN) => {
  return new AppError(message, 403);
};

export const createNotFoundError = (message: string = ERROR_MESSAGE.USER_NOT_FOUND) => {
  return new AppError(message, 404);
};

export const createDuplicateKeyError = (message: string) => {
  return new AppError(message, 409);
};

export const createDatabaseError = (message: string) => {
  return new AppError(message, 500);
};

export const createFileError = (message: string) => {
  return new AppError(message, 400);
};

export const createPaymentError = (message: string = ERROR_MESSAGE.PAYMENT_FAILED) => {
  return new AppError(message, 400);
};

export const createDeliveryError = (message: string = ERROR_MESSAGE.DELIVERY_NOT_AVAILABLE) => {
  return new AppError(message, 400);
};

export const createExternalServiceError = (message: string) => {
  return new AppError(message, 502);
};

// Handle mongoose errors
export const handleMongooseError = (err: MongooseError): AppError => {
  if (err instanceof MongooseError.ValidationError) {
    const message = Object.values(err.errors).map((val) => val.message);
    return createValidationError(message.join('. '));
  }

  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return createDuplicateKeyError(
      `Duplicate field value: ${field}. Please use another value.`
    );
  }

  return createDatabaseError(err.message);
};

// Handle JWT errors
export const handleJwtError = (err: JsonWebTokenError): AppError => {
  return createAuthenticationError(err.message);
};

export default {
  AppError,
  ErrorType,
  ErrorMessage,
  errorHandler,
  catchAsync,
  createValidationError,
  createAuthenticationError,
  createAuthorizationError,
  createNotFoundError,
  createDuplicateKeyError,
  createDatabaseError,
  createFileError,
  createPaymentError,
  createDeliveryError,
  createExternalServiceError,
  handleMongooseError,
  handleJwtError,
}; 