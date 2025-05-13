import nodemailer from 'nodemailer';
import { compile } from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Load email templates
const loadTemplate = (templateName: string): string => {
  const templatePath = join(__dirname, '../templates/emails', `${templateName}.hbs`);
  return readFileSync(templatePath, 'utf-8');
};

// Send email
export const sendEmail = async (
  to: string,
  subject: string,
  template: string,
  context: any
): Promise<void> => {
  try {
    const templateContent = loadTemplate(template);
    const compiledTemplate = compile(templateContent);
    const html = compiledTemplate(context);

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user: any): Promise<void> => {
  await sendEmail(
    user.email,
    'Welcome to Our Platform',
    'welcome',
    {
      name: user.name,
      loginUrl: `${process.env.FRONTEND_URL}/login`,
    }
  );
};

// Send password reset email
export const sendPasswordResetEmail = async (
  user: any,
  resetToken: string
): Promise<void> => {
  await sendEmail(
    user.email,
    'Password Reset Request',
    'password-reset',
    {
      name: user.name,
      resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
    }
  );
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  user: any,
  order: any
): Promise<void> => {
  await sendEmail(
    user.email,
    'Order Confirmation',
    'order-confirmation',
    {
      name: user.name,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      items: order.items,
      total: order.total,
      deliveryAddress: order.deliveryAddress,
    }
  );
};

// Send order status update email
export const sendOrderStatusUpdateEmail = async (
  user: any,
  order: any
): Promise<void> => {
  await sendEmail(
    user.email,
    'Order Status Update',
    'order-status-update',
    {
      name: user.name,
      orderNumber: order.orderNumber,
      status: order.status,
      trackingUrl: order.trackingUrl,
    }
  );
};

// Send restaurant approval email
export const sendRestaurantApprovalEmail = async (
  restaurant: any
): Promise<void> => {
  await sendEmail(
    restaurant.email,
    'Restaurant Approval',
    'restaurant-approval',
    {
      name: restaurant.name,
      dashboardUrl: `${process.env.FRONTEND_URL}/restaurant/dashboard`,
    }
  );
};

// Send restaurant rejection email
export const sendRestaurantRejectionEmail = async (
  restaurant: any,
  reason: string
): Promise<void> => {
  await sendEmail(
    restaurant.email,
    'Restaurant Application Status',
    'restaurant-rejection',
    {
      name: restaurant.name,
      reason,
      supportEmail: process.env.SUPPORT_EMAIL,
    }
  );
};

// Send payment confirmation email
export const sendPaymentConfirmationEmail = async (
  user: any,
  payment: any
): Promise<void> => {
  await sendEmail(
    user.email,
    'Payment Confirmation',
    'payment-confirmation',
    {
      name: user.name,
      amount: payment.amount,
      date: payment.date,
      transactionId: payment.transactionId,
    }
  );
};

// Send account verification email
export const sendAccountVerificationEmail = async (
  user: any,
  verificationToken: string
): Promise<void> => {
  await sendEmail(
    user.email,
    'Verify Your Account',
    'account-verification',
    {
      name: user.name,
      verificationUrl: `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`,
    }
  );
};

// Send notification email
export const sendNotificationEmail = async (
  user: any,
  notification: any
): Promise<void> => {
  await sendEmail(
    user.email,
    notification.subject,
    'notification',
    {
      name: user.name,
      message: notification.message,
      actionUrl: notification.actionUrl,
    }
  );
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendRestaurantApprovalEmail,
  sendRestaurantRejectionEmail,
  sendPaymentConfirmationEmail,
  sendAccountVerificationEmail,
  sendNotificationEmail,
}; 