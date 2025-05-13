import Stripe from 'stripe';
import { PAYMENT } from './constants';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create payment intent
export const createPaymentIntent = async (
  amount: number,
  currency: string = PAYMENT.CURRENCY
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw error;
  }
};

// Create customer
export const createCustomer = async (
  email: string,
  name: string,
  paymentMethod?: string
): Promise<Stripe.Customer> => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: paymentMethod,
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    return customer;
  } catch (error) {
    console.error('Customer creation error:', error);
    throw error;
  }
};

// Add payment method to customer
export const addPaymentMethod = async (
  customerId: string,
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return paymentMethod;
  } catch (error) {
    console.error('Payment method attachment error:', error);
    throw error;
  }
};

// Remove payment method from customer
export const removePaymentMethod = async (
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> => {
  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    console.error('Payment method detachment error:', error);
    throw error;
  }
};

// Get customer payment methods
export const getCustomerPaymentMethods = async (
  customerId: string
): Promise<Stripe.PaymentMethod[]> => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  } catch (error) {
    console.error('Payment methods retrieval error:', error);
    throw error;
  }
};

// Process refund
export const processRefund = async (
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return refund;
  } catch (error) {
    console.error('Refund processing error:', error);
    throw error;
  }
};

// Create subscription
export const createSubscription = async (
  customerId: string,
  priceId: string,
  paymentMethodId: string
): Promise<Stripe.Subscription> => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Subscription creation error:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (
  subscriptionId: string
): Promise<Stripe.Subscription> => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    throw error;
  }
};

// Update subscription
export const updateSubscription = async (
  subscriptionId: string,
  priceId: string
): Promise<Stripe.Subscription> => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    });

    return updatedSubscription;
  } catch (error) {
    console.error('Subscription update error:', error);
    throw error;
  }
};

// Get subscription
export const getSubscription = async (
  subscriptionId: string
): Promise<Stripe.Subscription> => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Subscription retrieval error:', error);
    throw error;
  }
};

// Get customer subscriptions
export const getCustomerSubscriptions = async (
  customerId: string
): Promise<Stripe.Subscription[]> => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    return subscriptions.data;
  } catch (error) {
    console.error('Customer subscriptions retrieval error:', error);
    throw error;
  }
};

export default {
  createPaymentIntent,
  createCustomer,
  addPaymentMethod,
  removePaymentMethod,
  getCustomerPaymentMethods,
  processRefund,
  createSubscription,
  cancelSubscription,
  updateSubscription,
  getSubscription,
  getCustomerSubscriptions,
}; 