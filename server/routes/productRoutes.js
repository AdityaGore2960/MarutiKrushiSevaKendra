const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, toggleAvailability, updateStock, getStats,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Stats route (before /:id to avoid conflict)
router.get('/stats', protect, getStats);

// Public routes
router.get('/', getProducts);

// Protected routes
router.post('/', protect, upload.single('image'), createProduct);
router.route('/:id')
  .get(getProduct)
  .put(protect, upload.single('image'), updateProduct)
  .delete(protect, deleteProduct);

router.put('/:id/toggle-availability', protect, toggleAvailability);
router.put('/:id/stock', protect, updateStock);

module.exports = router;
