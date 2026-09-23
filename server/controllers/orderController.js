const Order = require('../models/Order');

// ─── Valid statuses (must match Order model enum exactly) ───────────────────
const VALID_STATUSES = [
  'placed',
  'processing',
  'confirmed',
  'packed',
  'shipped',
  'out for delivery',
  'delivered',
  'cancelled',
  'returned',
];

// Forward-only state machine.
// Defines which transitions are permitted from each status.
// Admins can always cancel or mark returned from any non-terminal state.
const ALLOWED_TRANSITIONS = {
  placed:             ['processing', 'cancelled'],
  processing:         ['confirmed', 'cancelled'],
  confirmed:          ['packed', 'cancelled'],
  packed:             ['shipped', 'cancelled'],
  shipped:            ['out for delivery', 'cancelled'],
  'out for delivery': ['delivered', 'cancelled'],
  delivered:          ['returned'],
  cancelled:          [],   // terminal
  returned:           [],   // terminal
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
};

// @desc    Get order by ID (Admin)
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: order });
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;

  // 1. Validate the requested status is a known value
  if (!VALID_STATUSES.includes(orderStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid order status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const currentStatus = order.orderStatus;

  // 2. Enforce forward-only state machine
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(orderStatus)) {
    return res.status(400).json({
      success: false,
      message: `Cannot transition order from '${currentStatus}' to '${orderStatus}'. Allowed: ${allowedNext.length ? allowedNext.join(', ') : 'none (terminal state)'}`,
    });
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.json({ success: true, data: order, message: 'Order status updated successfully' });
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
