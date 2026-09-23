const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, sendOtp, verifyOtp, updateProfile, addAddress, removeAddress, updateAddress, getAllUsers, getUserById } = require('../controllers/userController');
const { protectUser } = require('../middleware/userAuth');
const { protect } = require('../middleware/auth'); // Admin auth middleware
const { loginLimiter, otpLimiter } = require('../middleware/rateLimiter');

router.get('/', protect, getAllUsers); // Admin route
router.get('/:id', protect, getUserById); // Admin route
router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', protectUser, getMe);
router.put('/profile', protectUser, updateProfile);
router.post('/address', protectUser, addAddress);
router.put('/address/:id', protectUser, updateAddress);
router.delete('/address/:id', protectUser, removeAddress);

module.exports = router;
