const express = require('express');
const router = express.Router();
const { protectUser } = require('../middleware/userAuth');
const { createOrder, verifyPayment, getMyOrders } = require('../controllers/paymentController');

// All routes require a logged-in user
router.post('/create-order', protectUser, createOrder);
router.post('/verify', protectUser, verifyPayment);
router.get('/orders', protectUser, getMyOrders);

module.exports = router;
