const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Razorpay's SDK throws immediately if key_id is missing, so we must NOT construct
// it at module load time (that would crash the entire server on startup whenever
// RAZORPAY_KEY_ID/SECRET aren't set yet). Instead we lazily create it on first use,
// and return a clear 503 error if the keys are still missing.
let razorpayClient = null;
const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(
      503,
      'Online payments are not configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env, or choose Cash on Delivery.'
    );
  }
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayClient;
};

// @desc Create a Razorpay order (before placing the actual food order)
// @route POST /api/payments/create-order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body; // amount in INR
  if (!amount || amount <= 0) throw new ApiError(400, 'Invalid amount');

  const razorpay = getRazorpayClient();

  const options = {
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.status(201).json({
    success: true,
    razorpayOrder,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc Verify Razorpay payment signature and mark order as paid
// @route POST /api/payments/verify
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(503, 'Online payments are not configured yet. Set RAZORPAY_KEY_SECRET in backend/.env.');
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, 'Payment verification failed - invalid signature');
  }

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  order.paymentStatus = 'paid';
  order.razorpayOrderId = razorpay_order_id;
  order.razorpayPaymentId = razorpay_payment_id;
  order.status = order.status === 'placed' ? 'confirmed' : order.status;
  order.statusHistory.push({ status: 'confirmed', at: new Date() });
  await order.save();

  await Payment.create({
    order: order._id,
    user: order.user,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    amount: order.total,
    status: 'paid',
  });

  res.status(200).json({ success: true, message: 'Payment verified successfully', order });
});

module.exports = { createRazorpayOrder, verifyPayment };
