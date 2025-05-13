import { Request, Response, NextFunction } from 'express';
import { AppError } from './error';
import { validateEmail, validatePassword, validatePhone } from './validation';

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, name, phone } = req.body;

  if (!email || !validateEmail(email)) {
    throw new AppError('Invalid email format', 400);
  }

  if (!password || !validatePassword(password)) {
    throw new AppError(
      'Password must be at least 8 characters long and contain at least one letter and one number',
      400
    );
  }

  if (!name || name.length < 2) {
    throw new AppError('Name must be at least 2 characters long', 400);
  }

  if (!phone || !validatePhone(phone)) {
    throw new AppError('Invalid phone number format', 400);
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    throw new AppError('Invalid email format', 400);
  }

  if (!password) {
    throw new AppError('Password is required', 400);
  }

  next();
};

export const validateRestaurant = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description, cuisine, address, phone, email } = req.body;

  if (!name || name.length < 2) {
    throw new AppError('Name must be at least 2 characters long', 400);
  }

  if (!description || description.length < 10) {
    throw new AppError('Description must be at least 10 characters long', 400);
  }

  if (!cuisine) {
    throw new AppError('Cuisine is required', 400);
  }

  if (!address) {
    throw new AppError('Address is required', 400);
  }

  if (!phone || !validatePhone(phone)) {
    throw new AppError('Invalid phone number format', 400);
  }

  if (!email || !validateEmail(email)) {
    throw new AppError('Invalid email format', 400);
  }

  next();
};

export const validateMenuItem = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description, price, category, restaurant } = req.body;

  if (!name || name.length < 2) {
    throw new AppError('Name must be at least 2 characters long', 400);
  }

  if (!description || description.length < 10) {
    throw new AppError('Description must be at least 10 characters long', 400);
  }

  if (!price || price <= 0) {
    throw new AppError('Price must be greater than 0', 400);
  }

  if (!category) {
    throw new AppError('Category is required', 400);
  }

  if (!restaurant) {
    throw new AppError('Restaurant is required', 400);
  }

  next();
};

export const validateOrder = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { items, deliveryAddress, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError('Order must contain at least one item', 400);
  }

  if (!deliveryAddress) {
    throw new AppError('Delivery address is required', 400);
  }

  if (!paymentMethod || !['cash', 'card'].includes(paymentMethod)) {
    throw new AppError('Invalid payment method', 400);
  }

  next();
};

export const validateReview = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }

  if (!comment || comment.length < 10) {
    throw new AppError('Comment must be at least 10 characters long', 400);
  }

  next();
}; 