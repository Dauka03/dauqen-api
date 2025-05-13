import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './error';
import { z } from 'zod';
import { ZodError } from 'zod';

// Interface for validation error
interface ValidationError {
  field: string;
  message: string;
}

// Function to validate request
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  };
};

// Function to validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate phone number format
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Function to validate password strength
export const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// Function to validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Function to validate date format
export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

// Function to validate time format
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Function to validate price format
export const isValidPrice = (price: number): boolean => {
  return price >= 0 && price <= 1000000 && Number.isFinite(price);
};

// Function to validate coordinates
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return (
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
};

// Function to validate string length
export const isValidLength = (
  str: string,
  min: number,
  max: number
): boolean => {
  return str.length >= min && str.length <= max;
};

// Function to validate array length
export const isValidArrayLength = (
  arr: any[],
  min: number,
  max: number
): boolean => {
  return arr.length >= min && arr.length <= max;
};

// Function to validate object properties
export const hasRequiredProperties = (
  obj: Record<string, any>,
  requiredProps: string[]
): boolean => {
  return requiredProps.every((prop) => prop in obj);
};

// Function to validate enum values
export const isValidEnumValue = <T extends string>(
  value: string,
  enumValues: T[]
): value is T => {
  return enumValues.includes(value as T);
};

// Function to sanitize string input
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

// Function to sanitize email input
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// Function to sanitize phone input
export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Function to format validation errors
export const formatValidationErrors = (
  errors: ValidationError[]
): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Минимум 8 символов, минимум одна буква и одна цифра
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhone = (phone: string): boolean => {
  // Простой формат для номера телефона
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 1000000;
};

export const validateRating = (rating: number): boolean => {
  return rating >= 0 && rating <= 5;
};

export const validateOrderStatus = (status: string): boolean => {
  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  return validStatuses.includes(status);
};

export const validatePaymentMethod = (method: string): boolean => {
  const validMethods = ['cash', 'card'];
  return validMethods.includes(method);
};

export const validatePriceRange = (range: string): boolean => {
  const validRanges = ['low', 'medium', 'high'];
  return validRanges.includes(range);
};

export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const validateOpeningHours = (hours: { [key: string]: { open: string; close: string } }): boolean => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  for (const day of days) {
    if (!hours[day]) return false;
    if (!validateTimeFormat(hours[day].open) || !validateTimeFormat(hours[day].close)) return false;
  }
  
  return true;
};

export const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({ errors });
      }
      next(error);
    }
  };
};

export default {
  validate,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isValidUrl,
  isValidDate,
  isValidTime,
  isValidPrice,
  isValidCoordinates,
  isValidLength,
  isValidArrayLength,
  hasRequiredProperties,
  isValidEnumValue,
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  formatValidationErrors,
}; 