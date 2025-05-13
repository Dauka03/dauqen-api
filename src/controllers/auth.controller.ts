import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config';
import { sendWelcomeEmail, sendPasswordResetEmail, sendAccountVerificationEmail } from '../utils/email';
import { AppError } from '../utils/error';
import { Types } from 'mongoose';

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: 'error',
        message: 'User already exists',
      });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      phone,
    });

    await user.save();

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send welcome email with verification link
    await sendWelcomeEmail(user);
    await sendAccountVerificationEmail(user, verificationToken);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to register user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to login',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to process password reset request',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token',
      });
      return;
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid or expired verification token',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    // Generate new access token
    const token = jwt.sign(
      { id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid refresh token',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
}; 