const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// Helper: parse comma-separated string to array
const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v) => v.trim());
  return value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v);
};

// @desc    Get all products (with search & filter)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { search, category, available } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  if (available !== undefined && available !== '') {
    query.available = available === 'true';
  }

  let products = await Product.find(query)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  // Client-side regex text search for Firestore
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => {
      const n = (p.name || '').toLowerCase();
      const d = (p.description || '').toLowerCase();
      const c = (p.suitableCrops || []).some(crop => (crop || '').toLowerCase().includes(s));
      return n.includes(s) || d.includes(s) || c;
    });
  }

  res.json({ success: true, count: products.length, data: products });
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  res.json({ success: true, data: product });
};

// @desc    Create product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  const {
    name, category, description, purpose, composition,
    activeIngredient, targetProblem, manufacturer, brand,
    price, discount, stock, weight, available,
  } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ success: false, message: 'Product name is required.' });
  }
  if (!category) {
    return res.status(400).json({ success: false, message: 'Category is required.' });
  }

  const suitableCrops = parseArrayField(req.body.suitableCrops);
  const packSizes = parseArrayField(req.body.packSizes);

  const parsedPrice = Number(price) || 0;
  const parsedDiscount = Number(discount) || 0;
  const parsedStock = Number(stock) || 0;

  if (parsedPrice < 0) {
    return res.status(400).json({ success: false, message: 'Price cannot be negative.' });
  }
  if (parsedDiscount < 0 || parsedDiscount > 100) {
    return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100.' });
  }
  if (parsedStock < 0) {
    return res.status(400).json({ success: false, message: 'Stock cannot be negative.' });
  }

  const productData = {
    name: name.trim(),
    category,
    description: description?.trim() || '',
    suitableCrops,
    purpose: purpose?.trim() || '',
    composition: composition?.trim() || '',
    activeIngredient: activeIngredient?.trim() || '',
    targetProblem: targetProblem?.trim() || '',
    packSizes,
    manufacturer: manufacturer?.trim() || '',
    brand: brand?.trim() || '',
    price: parsedPrice,
    discount: parsedDiscount,
    stock: parsedStock,
    weight: weight?.trim() || '',
    available: available === 'false' ? false : true,
    imageUrl: '',
    cloudinaryPublicId: '',
  };

  if (req.file) {
    productData.imageUrl = req.file.path;
    productData.cloudinaryPublicId = req.file.filename;
  }

  const product = await Product.create(productData);
  await product.populate('category', 'name slug');

  res.status(201).json({ success: true, data: product, message: 'Product created successfully.' });
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const {
    name, category, description, purpose, composition,
    activeIngredient, targetProblem, manufacturer, brand,
    price, discount, stock, weight, available,
  } = req.body;

  if (name !== undefined && !name.trim()) {
    return res.status(400).json({ success: false, message: 'Product name cannot be empty.' });
  }

  const suitableCrops = req.body.suitableCrops !== undefined ? parseArrayField(req.body.suitableCrops) : product.suitableCrops;
  const packSizes = req.body.packSizes !== undefined ? parseArrayField(req.body.packSizes) : product.packSizes;

  // Handle image replacement
  if (req.file) {
    // Delete old image from Cloudinary
    if (product.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(product.cloudinaryPublicId);
      } catch (err) {
        console.error('Error deleting old image from Cloudinary:', err.message);
      }
    }
    product.imageUrl = req.file.path;
    product.cloudinaryPublicId = req.file.filename;
  }

  // Validate and clamp numeric fields before applying them
  if (price !== undefined) {
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, message: 'Price cannot be negative.' });
    }
    product.price = parsedPrice;
  }
  if (discount !== undefined) {
    const parsedDiscount = Number(discount);
    if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
      return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100.' });
    }
    product.discount = parsedDiscount;
  }
  if (stock !== undefined) {
    const parsedStock = Number(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative.' });
    }
    product.stock = parsedStock;
  }

  product.name = name?.trim() ?? product.name;
  product.category = category ?? product.category;
  product.description = description?.trim() ?? product.description;
  product.suitableCrops = suitableCrops;
  product.purpose = purpose?.trim() ?? product.purpose;
  product.composition = composition?.trim() ?? product.composition;
  product.activeIngredient = activeIngredient?.trim() ?? product.activeIngredient;
  product.targetProblem = targetProblem?.trim() ?? product.targetProblem;
  product.packSizes = packSizes;
  product.manufacturer = manufacturer?.trim() ?? product.manufacturer;
  product.brand = brand?.trim() ?? product.brand;
  product.weight = weight?.trim() ?? product.weight;
  product.available = available !== undefined ? available === 'true' || available === true : product.available;

  await product.save();
  await product.populate('category', 'name slug');

  res.json({ success: true, data: product, message: 'Product updated successfully.' });
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  // Remove image from Cloudinary
  if (product.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(product.cloudinaryPublicId);
    } catch (err) {
      console.error('Error deleting image from Cloudinary:', err.message);
    }
  }

  await product.deleteOne();

  res.json({ success: true, message: 'Product deleted successfully.' });
};

// @desc    Toggle product availability
// @route   PUT /api/products/:id/toggle-availability
// @access  Private
const toggleAvailability = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  product.available = !product.available;
  await product.save();

  res.json({
    success: true,
    data: { available: product.available },
    message: `Product marked as ${product.available ? 'available' : 'unavailable'}.`,
  });
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private
const updateStock = async (req, res) => {
  const { stock } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  if (stock === undefined || isNaN(Number(stock))) {
    return res.status(400).json({ success: false, message: 'Valid stock number is required.' });
  }

  const parsedStock = Number(stock);
  if (parsedStock < 0) {
    return res.status(400).json({ success: false, message: 'Stock cannot be negative.' });
  }

  product.stock = parsedStock;
  // Optional: Auto-update availability based on stock
  if (product.stock <= 0) {
    product.available = false;
  } else if (product.stock > 0 && !product.available) {
    product.available = true;
  }

  await product.save();

  res.json({
    success: true,
    data: { stock: product.stock, available: product.available },
    message: 'Stock updated successfully.',
  });
};

// @desc    Get dashboard stats
// @route   GET /api/products/stats
// @access  Private
const getStats = async (req, res) => {
  const [totalProducts, unavailableProducts] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ available: false }),
  ]);

  const Category = require('../models/Category');
  const Order = require('../models/Order');
  const User = require('../models/User');

  const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
  const pendingOrders = await Order.countDocuments({ paymentStatus: 'pending' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const ACTIVE_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out for delivery'];

  const todaysAllOrdersList = await Order.find({ createdAt: { $gte: today } });
  const todaysSales = todaysAllOrdersList.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.total, 0);

  // Today's Orders: only count active statuses (excludes cancelled, returned, delivered)
  const todaysOrders = await Order.countDocuments({
    createdAt: { $gte: today },
    orderStatus: { $in: ACTIVE_STATUSES },
  });

  const yesterdaysOrdersList = await Order.find({ createdAt: { $gte: yesterday, $lt: today } });
  const yesterdaysSales = yesterdaysOrdersList.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.total, 0);

  const salesGrowth = yesterdaysSales === 0 ? (todaysSales > 0 ? 100 : 0) : ((todaysSales - yesterdaysSales) / yesterdaysSales) * 100;

  // Order status summary
  const orderStatuses = ['pending', 'confirmed', 'packed', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'returned'];
  const statusCounts = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
  ]);

  const orderStatusSummary = {};
  orderStatuses.forEach(status => {
    if (status === 'pending') {
      orderStatusSummary[status] = 0; // Temporarily set to 0
    } else {
      const found = statusCounts.find(s => s._id === status);
      orderStatusSummary[status] = found ? found.count : 0;
    }
  });

  // Recent Orders (top 5-10)
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('user', 'name');

  res.json({
    success: true,
    data: {
      todaysSales,
      salesGrowth: salesGrowth.toFixed(1),
      todaysOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStock: unavailableProducts,
      orderStatusSummary,
      recentOrders
    },
  });
};

module.exports = {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, toggleAvailability, updateStock, getStats,
};
