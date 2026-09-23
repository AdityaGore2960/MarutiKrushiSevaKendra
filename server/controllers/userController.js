const jwt = require('jsonwebtoken');
const User = require('../models/User');
const twilio = require('twilio');

const generateToken = (id) =>
  jwt.sign({ id, role: 'CUSTOMER' }, process.env.JWT_SECRET, { expiresIn: '7d' });

const otpStore = new Map();

// Periodically clean up expired OTP entries to prevent memory accumulation
setInterval(() => {
  const now = Date.now();
  for (const [phone, entry] of otpStore.entries()) {
    if (entry.expires < now) otpStore.delete(phone);
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email, phone number, and password are required.' });
  }

  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    return res.status(409).json({ success: false, message: 'An account with this phone number already exists.' });
  }

  const user = await User.create({ name, email, phone, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses },
  });
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    return res.status(400).json({ success: false, message: 'Email/Phone and password are required.' });
  }

  let user;
  if (email) {
    user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  } else if (phone) {
    user = await User.findOne({ phone }).select('+password');
  }

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses },
  });
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private (user token)
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone, addresses: req.user.addresses },
  });
};

// @desc    Send OTP to phone
// @route   POST /api/users/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone number is required.' });

  const user = await User.findOne({ phone });
  if (!user) {
    // Return a generic success response to prevent phone number enumeration
    return res.json({ success: true, message: 'If this number is registered, an OTP has been sent.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });

  if (process.env.ACCOUNT_SID && process.env.TWILIO_API_KEY_SID && process.env.TWILIO_API_KEY_SECRET) {
    try {
      const client = twilio(process.env.TWILIO_API_KEY_SID, process.env.TWILIO_API_KEY_SECRET, { accountSid: process.env.ACCOUNT_SID });

      if (!process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER === 'your_twilio_phone_number') {
        throw new Error("TWILIO_PHONE_NUMBER is not set or invalid in .env file");
      }

      await client.messages.create({
        body: `Your MarutiKrushiSevaKendra login OTP is ${otp}. It is valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`
      });
      return res.json({ success: true, message: 'OTP sent successfully to your phone.' });
    } catch (error) {
      console.error('Error sending OTP via Twilio:', error);
      return res.status(500).json({ success: false, message: 'Failed to send OTP via SMS. ' + error.message });
    }
  } else {
    console.log(`\n\n=== DEMO OTP ===\nPhone: ${phone}\nOTP: ${otp}\n================\n\n`);
    return res.json({ success: true, message: 'OTP generated in Development Mode. Please check the server console for the OTP code.' });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });

  const stored = otpStore.get(phone);
  if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
    return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });
  }

  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  otpStore.delete(phone);
  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses },
  });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
      },
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

// @desc    Add new address
// @route   POST /api/users/address
// @access  Private
const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Whitelist only known-safe address fields
    const {
      name: addrName,
      house,
      street,
      city,
      state,
      pincode,
      phone: addrPhone,
      country,
    } = req.body;

    user.addresses.push({
      name: addrName,
      house,
      street,
      city,
      state,
      pincode,
      phone: addrPhone,
      country: country || 'India',
    });
    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
      },
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

// @desc    Update existing address
// @route   PUT /api/users/address/:id
// @access  Private
const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const addressId = req.params.id;
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

    if (addressIndex !== -1) {
      // Whitelist only known-safe address fields to prevent prototype pollution
      const {
        name: addrName,
        house,
        street,
        city,
        state,
        pincode,
        phone: addrPhone,
        country,
      } = req.body;

      const existing = user.addresses[addressIndex].toObject();
      user.addresses[addressIndex] = {
        ...existing,
        ...(addrName !== undefined && { name: addrName }),
        ...(house !== undefined && { house }),
        ...(street !== undefined && { street }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(pincode !== undefined && { pincode }),
        ...(addrPhone !== undefined && { phone: addrPhone }),
        ...(country !== undefined && { country }),
      };
      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          addresses: updatedUser.addresses,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'Address not found' });
    }
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

// @desc    Remove an address
// @route   DELETE /api/users/address/:id
// @access  Private
const removeAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
      },
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // 1. Get all CUSTOMER users
  const usersRef = require('../config/firebase').db.collection('users');
  const usersSnap = await usersRef.where('role', '==', 'CUSTOMER').get();

  const usersList = [];
  const userIds = [];
  usersSnap.docs.forEach(doc => {
    const data = doc.data();
    userIds.push(doc.id);
    usersList.push({
      _id: doc.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      accountStatus: data.accountStatus,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
    });
  });

  // 2. Fetch all orders (simplification: fetch all, group in memory)
  // In a massive app we'd paginate, but for the dashboard stats this is fine
  const ordersRef = require('../config/firebase').db.collection('orders');
  const ordersSnap = await ordersRef.get();

  const userOrderStats = {};
  userIds.forEach(id => {
    userOrderStats[id] = { orderCount: 0, totalSpent: 0, lastOrderDate: null };
  });

  ordersSnap.docs.forEach(doc => {
    const order = doc.data();
    const uid = String(order.user);
    if (userOrderStats[uid]) {
      userOrderStats[uid].orderCount += 1;
      userOrderStats[uid].totalSpent += (order.total || 0);

      const orderDate = order.createdAt ? order.createdAt.toDate() : new Date();
      if (!userOrderStats[uid].lastOrderDate || orderDate > userOrderStats[uid].lastOrderDate) {
        userOrderStats[uid].lastOrderDate = orderDate;
      }
    }
  });

  // 3. Merge data
  const finalUsers = usersList.map(u => {
    const stats = userOrderStats[u._id];
    const isNew = u.createdAt > thirtyDaysAgo;
    const isActive = stats.lastOrderDate && stats.lastOrderDate > thirtyDaysAgo;
    const isRepeat = stats.orderCount >= 2;

    return {
      ...u,
      orderCount: stats.orderCount,
      totalSpent: stats.totalSpent,
      lastOrderDate: stats.lastOrderDate,
      isActive,
      isNew,
      isRepeat
    };
  });

  finalUsers.sort((a, b) => b.createdAt - a.createdAt);

  res.json({ success: true, data: finalUsers });
};

// @desc    Get user by ID with orders (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const Order = require('../models/Order'); // Local import to avoid circular dep issues at top
  const orders = await Order.find({ user: req.params.id })
    .select('-razorpayOrderId -razorpayPaymentId -razorpaySignature')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: { user, orders } });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  sendOtp,
  verifyOtp,
  updateProfile,
  addAddress,
  updateAddress,
  removeAddress,
  getAllUsers,
  getUserById,
};
