const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} = require('../controllers/cartController');
const { protectUser } = require('../middleware/userAuth');

// All cart routes require a logged-in user
router.use(protectUser);

router.get('/', getCart);           // GET  /api/cart
router.post('/add', addToCart);     // POST /api/cart/add
router.post('/merge', mergeCart);   // POST /api/cart/merge  (called on login)
router.put('/:itemId', updateCartItem);     // PUT  /api/cart/:itemId
router.delete('/:itemId', removeCartItem); // DELETE /api/cart/:itemId
router.delete('/', clearCart);      // DELETE /api/cart

module.exports = router;
