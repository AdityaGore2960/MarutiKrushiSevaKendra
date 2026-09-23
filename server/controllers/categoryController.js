const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find().populate('parentCategory', 'name').sort({ name: 1 });
  res.json({ success: true, data: categories });
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  const { name, description, parentCategory, active } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Category already exists.' });
  }

  const category = await Category.create({ 
    name: name.trim(), 
    description: description?.trim() || '',
    parentCategory: parentCategory || null,
    active: active !== undefined ? active : true
  });
  res.status(201).json({ success: true, data: category, message: 'Category created successfully.' });
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  const { name, description, parentCategory, active } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }

  const existing = await Category.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
  if (existing) {
    return res.status(400).json({ success: false, message: 'A category with this name already exists.' });
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { 
      name: name.trim(), 
      description: description?.trim() || '',
      parentCategory: parentCategory || null,
      active: active !== undefined ? active : true
    },
    { new: true, runValidators: true }
  ).populate('parentCategory', 'name');

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }

  res.json({ success: true, data: category, message: 'Category updated successfully.' });
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  const productsUsingCategory = await Product.countDocuments({ category: req.params.id });

  if (productsUsingCategory > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category. ${productsUsingCategory} product(s) are still using it. Reassign them first.`,
    });
  }

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }

  res.json({ success: true, message: 'Category deleted successfully.' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
