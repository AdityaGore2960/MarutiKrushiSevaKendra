const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getProductsByBrand
} = require('../controllers/brandController');

router.route('/')
  .get(getBrands)
  .post(protect, upload.single('image'), createBrand);

router.route('/:id')
  .put(protect, upload.single('image'), updateBrand)
  .delete(protect, deleteBrand);

router.get('/:name/products', protect, getProductsByBrand);

module.exports = router;
