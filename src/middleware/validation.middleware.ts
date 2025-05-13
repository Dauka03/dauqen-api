import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Registration validation schema
const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
});

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Password reset validation schema
const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

// Email verification schema
const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

// Validation middleware
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    registrationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
};

export const validatePasswordReset = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    passwordResetSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
};

export const validateEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    emailVerificationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
}; 