// Payment API service for backend integration
// Payment API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface PaymentData {
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface OrderData {
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  phone_model: string;
  phone_model_id: string;
  design_image: string;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  fulfillment_method: string;
  store_location_id?: string;
  delivery_address?: string;
  amount: number;
  status: string;
}

// Create payment intent
export const createPaymentIntent = async (paymentData: PaymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    throw new Error(error.message || 'Payment initialization failed');
  }
};

// Confirm payment and create order
export const confirmPaymentAndCreateOrder = async (
  paymentIntentId: string,
  orderData: OrderData
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        order_data: orderData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to confirm payment');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    throw new Error(error.message || 'Payment confirmation failed');
  }
};

// Get payment status
export const getPaymentStatus = async (paymentIntentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/payment-status/${paymentIntentId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get payment status');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting payment status:', error);
    throw new Error(error.message || 'Failed to get payment status');
  }
};