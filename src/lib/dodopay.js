// DodoPay integration library
const DODOPAY_BASE_URL = process.env.DODOPAY_BASE_URL || 'https://api.dodopayments.com';

export class DodoPayClient {
  constructor(apiKey, secretKey) {
    if (!apiKey || !secretKey || secretKey.includes('your_dodopay_secret_key_here')) {
      throw new Error('DodoPay API keys not configured. Please check your environment variables.');
    }
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.baseURL = DODOPAY_BASE_URL;
  }

  async createPaymentSession({
    amount,
    currency = 'USD',
    customerEmail,
    customerName,
    productName,
    successUrl,
    cancelUrl,
    metadata = {}
  }) {
    try {
      const response = await fetch(`${this.baseURL}/v1/payment-sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          customer: {
            email: customerEmail,
            name: customerName,
          },
          product_name: productName,
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(`DodoPay API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DodoPay createPaymentSession error:', error);
      throw error;
    }
  }

  async retrievePaymentSession(sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/v1/payment-sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`DodoPay API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DodoPay retrievePaymentSession error:', error);
      throw error;
    }
  }

  async createSubscription({
    customerEmail,
    customerName,
    priceId,
    successUrl,
    cancelUrl,
    metadata = {}
  }) {
    try {
      const response = await fetch(`${this.baseURL}/v1/subscriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            email: customerEmail,
            name: customerName,
          },
          price_id: priceId,
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(`DodoPay API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DodoPay createSubscription error:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`${this.baseURL}/v1/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`DodoPay API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DodoPay cancelSubscription error:', error);
      throw error;
    }
  }

  async getCustomerSubscriptions(customerEmail) {
    try {
      const response = await fetch(`${this.baseURL}/v1/subscriptions?customer_email=${encodeURIComponent(customerEmail)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`DodoPay API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DodoPay getCustomerSubscriptions error:', error);
      throw error;
    }
  }

  verifyWebhook(payload, signature) {
    // Implement webhook signature verification
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

// Initialize DodoPay client
export function getDodoPayClient() {
  const apiKey = process.env.DODOPAY_API_KEY;
  const secretKey = process.env.DODOPAY_SECRET_KEY;
  
  return new DodoPayClient(apiKey, secretKey);
}

// Pricing plans configuration
export const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '300 words per month',
      'Basic AI detection',
      'Limited humanization',
    ],
    limits: {
      words: 300,
      detections: 5,
      humanizations: 3,
    }
  },
  PRO_MONTHLY: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 12,
    currency: 'USD',
    interval: 'month',
    dodoPayPriceId: process.env.DODOPAY_PRO_MONTHLY_PRICE_ID,
    features: [
      'Unlimited words',
      'Advanced AI detection',
      'Unlimited humanization',
      'Priority support',
      'Export documents',
    ],
    limits: {
      words: -1, // unlimited
      detections: -1,
      humanizations: -1,
    }
  },
  PRO_YEARLY: {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: 99,
    currency: 'USD',
    interval: 'year',
    dodoPayPriceId: process.env.DODOPAY_PRO_YEARLY_PRICE_ID,
    features: [
      'Unlimited words',
      'Advanced AI detection',
      'Unlimited humanization',
      'Priority support',
      'Export documents',
      '2 months free',
    ],
    limits: {
      words: -1,
      detections: -1,
      humanizations: -1,
    }
  }
};
