import Razorpay from 'razorpay';
import crypto from 'crypto';
import config from '../config/env.js';

let razorpayInstance = null;

if (config.RAZORPAY_KEY_ID && config.RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.warn('⚠️ Razorpay initialization warning:', err.message);
  }
}

export const paymentService = {
  createOrder: async (amountInINR, receiptId, notes = {}) => {
    if (!razorpayInstance) {
      // Return simulated order for local / test environments
      return {
        id: `order_mock_${Date.now()}`,
        entity: 'order',
        amount: amountInINR * 100,
        currency: 'INR',
        receipt: receiptId,
        status: 'created',
        notes,
      };
    }

    const options = {
      amount: Math.round(amountInINR * 100), // amount in paisa
      currency: 'INR',
      receipt: receiptId,
      notes,
    };

    return razorpayInstance.orders.create(options);
  },

  verifySignature: (orderId, paymentId, signature) => {
    if (!config.RAZORPAY_KEY_SECRET) return true;

    const generatedSignature = crypto
      .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  },
};

export default paymentService;
