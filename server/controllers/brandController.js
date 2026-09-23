const Brand = require('../models/Brand');
const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = async (req, res) => {
  const brands = await Brand.find().sort({ name: 1 });
  res.json({ success: true, data: brands });
};

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = async (req, res) => {
  const { name, active } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Brand name is required.' });
  }

  const existing = await Brand.findOne({ name: name.trim() });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Brand already exists.' });
  }

  let imageUrl = '';
  let cloudinaryPublicId = '';

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'marutikrushisevakendra/brands' });
      imageUrl = result.secure_url;
      cloudinaryPublicId = result.public_id;
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Image upload failed' });
    }
  }

  const brand = await Brand.create({
    name: name.trim(),
    imageUrl,
    cloudinaryPublicId,
    active: active === 'false' || active === false ? false : true,
  });

  res.status(201).json({ success: true, data: brand, message: 'Brand created successfully.' });
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = async (req, res) => {
  const { name, active } = req.body;
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return res.status(404).json({ success: false, message: 'Brand not found.' });
  }

  if (name && name.trim() !== brand.name) {
    const existing = await Brand.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Another brand with this name already exists.' });
    }
    brand.name = name.trim();
  }

  if (active !== undefined) {
    brand.active = active === 'false' || active === false ? false : true;
  }

  if (req.file) {
    if (brand.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(brand.cloudinaryPublicId);
      } catch (err) {
        console.error('Failed to delete old image from Cloudinary', err);
      }
    }
    try {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'marutikrushisevakendra/brands' });
      brand.imageUrl = result.secure_url;
      brand.cloudinaryPublicId = result.public_id;
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Image upload failed' });
    }
  }

  await brand.save();
  res.json({ success: true, data: brand, message: 'Brand updated successfully.' });
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return res.status(404).json({ success: false, message: 'Brand not found.' });
  }

  // Optional: Delete from cloudinary
  if (brand.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(brand.cloudinaryPublicId);
    } catch (err) {
      console.error('Failed to delete image from Cloudinary', err);
    }
  }

  await brand.deleteOne();
  res.json({ success: true, message: 'Brand deleted successfully.' });
};

// @desc    Get products by brand name
// @route   GET /api/brands/:name/products
// @access  Private/Admin
const getProductsByBrand = async (req, res) => {
  const brandName = req.params.name;
  // Use regex for case-insensitive exact match
  const products = await Product.find({ brand: new RegExp('^' + brandName + '$', 'i') })
    .populate('category', 'name')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, data: products });
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand, getProductsByBrand };
