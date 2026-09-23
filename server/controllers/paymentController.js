const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { createNotification } = require('./notificationController');

// Initialise Razorpay with keys stored ONLY on the server
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── POST /api/payment/create-order ────────────────────────────────────────
// Creates a Razorpay order and saves a pending Order document in DB.
// The Razorpay Key ID (public) is returned so the client can open the popup.
exports.createOrder = async (req, res) => {
  const { items, shippingAddress, subtotal, shippingCharge, taxes, total, paymentMethod } =
    req.body;

  // ── Debug: log what we received ──────────────────────────────────────────
  console.log('[Razorpay] create-order body:', {
    itemCount: items?.length,
    subtotal,
    shippingCharge,
    taxes,
    total,
    paymentMethod,
  });

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty.' });
  }

  // Ensure total is a valid positive number
  const parsedTotal = parseFloat(total);
  if (isNaN(parsedTotal) || parsedTotal <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid order total. Please check your cart.' });
  }

  // Amount to charge right now (in paise – Razorpay minimum is 100 paise = ₹1)
  const amountPaidNow = paymentMethod === 'cod'
    ? Math.round(parsedTotal * 0.1)
    : Math.round(parsedTotal);

  // Enforce Razorpay minimum of 100 paise (₹1)
  const amountInPaise = Math.max(Math.round(amountPaidNow * 100), 100);

  if (process.env.NODE_ENV === 'development') {
    console.log('[Razorpay] amount in paise:', amountInPaise, '| key_id:', process.env.RAZORPAY_KEY_ID?.slice(0, 15) + '...');
  }

  // Create order on Razorpay
  const rzpOrder = await razorpay.orders.create({
    amount: amountInPaise,           // Must be integer, in paise
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,   // Max 40 chars
    notes: {
      userId: req.user._id.toString(),
      paymentMethod,
    },
  });

  console.log('[Razorpay] order created:', rzpOrder.id);

  // Save a pending order in our DB
  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    subtotal: Math.round(parsedTotal - (parseFloat(shippingCharge) || 0) - (parseFloat(taxes) || 0)),
    shippingCharge: parseFloat(shippingCharge) || 0,
    taxes: parseFloat(taxes) || 0,
    total: parsedTotal,
    paymentMethod,
    razorpayOrderId: rzpOrder.id,
    paymentStatus: 'pending',
    amountPaidNow,
  });

  res.status(201).json({
    success: true,
    razorpayOrderId: rzpOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    orderId: order._id,
    keyId: process.env.RAZORPAY_KEY_ID,   // Public key only – safe to send
  });
};

// ─── POST /api/payment/verify ───────────────────────────────────────────────
// Verifies Razorpay's HMAC signature – NEVER trust the client without this.
exports.verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  // Re-compute expected signature
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    // Mark order as failed so we have a record
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
    return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
  }

  // Signature valid — verify the order belongs to the requesting user before updating
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Forbidden. You do not own this order.' });
  }

  // Update order as paid
  await Order.findByIdAndUpdate(
    orderId,
    {
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus: 'paid',
      orderStatus: 'placed',
    },
    { new: true }
  );

  // Re-fetch for the response (populate is optional here)
  const updatedOrder = await Order.findById(orderId);

  // Create Admin Notification
  await createNotification({
    title: 'New Order Received',
    message: `Order #${updatedOrder._id.toString().slice(-6).toUpperCase()} placed for ₹${updatedOrder.total}.`,
    type: 'ORDER',
    link: `/admin/orders/${updatedOrder._id}`
  });

  res.json({ success: true, message: 'Payment verified successfully.', order: updatedOrder });
};

// ─── GET /api/payment/orders ────────────────────────────────────────────────
// Fetch all orders for the logged-in user
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
};
