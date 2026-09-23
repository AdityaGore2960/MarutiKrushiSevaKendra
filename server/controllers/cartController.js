const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Constants for business-rule limits
const MAX_QTY_PER_ITEM = 100;   // Max quantity per single cart line item
const MAX_CART_ITEMS = 50;      // Max distinct items in a cart

// ─── Helper: serialize cart for API response ────────────────────────────────
const serializeCart = (cart) => ({
  items: cart.items.map((item) => ({
    _id: item._id,
    product: item.product,
    name: item.name,
    imageUrl: item.imageUrl,
    packSize: item.packSize,
    quantity: item.quantity,
  })),
  totalItems: cart.items.reduce((sum, i) => sum + i.quantity, 0),
});

// ─── GET /api/cart ──────────────────────────────────────────────────────────
const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = { items: [] };
  return res.json({ success: true, cart: serializeCart(cart) });
};

// ─── POST /api/cart/add ─────────────────────────────────────────────────────
const addToCart = async (req, res) => {
  const { productId, quantity = 1, packSize = '', name = '', imageUrl = '' } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required.' });
  }

  // Quantity must be a positive integer
  const parsedQty = Math.floor(Number(quantity));
  if (!parsedQty || parsedQty < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be a positive integer.' });
  }
  if (parsedQty > MAX_QTY_PER_ITEM) {
    return res.status(400).json({ success: false, message: `Quantity cannot exceed ${MAX_QTY_PER_ITEM} per item.` });
  }

  let finalName = name;
  let finalImageUrl = imageUrl;

  // Check if productId is a valid MongoDB ObjectId
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productId);

  if (isValidObjectId) {
    try {
      const product = await Product.findById(productId);
      if (product) {
        finalName = product.name;
        finalImageUrl = product.imageUrl || '';
      }
    } catch (err) {
      // ignore cast error
    }
  }

  if (!finalName) {
    if (name) {
      finalName = name;
      finalImageUrl = imageUrl;
    } else {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Check if same product+packSize already in cart
  const existingIdx = cart.items.findIndex(
    (i) => i.product.toString() === productId.toString() && i.packSize === packSize
  );

  if (existingIdx >= 0) {
    const newQty = cart.items[existingIdx].quantity + parsedQty;
    if (newQty > MAX_QTY_PER_ITEM) {
      return res.status(400).json({ success: false, message: `Total quantity for this item cannot exceed ${MAX_QTY_PER_ITEM}.` });
    }
    cart.items[existingIdx].quantity = newQty;
  } else {
    // Enforce max distinct item count
    if (cart.items.length >= MAX_CART_ITEMS) {
      return res.status(400).json({ success: false, message: `Cart cannot have more than ${MAX_CART_ITEMS} distinct items.` });
    }
    cart.items.push({
      product: productId,
      quantity: parsedQty,
      name: finalName,
      imageUrl: finalImageUrl,
      packSize,
    });
  }

  await cart.save();
  return res.json({ success: true, message: 'Added to cart.', cart: serializeCart(cart) });
};

// ─── PUT /api/cart/:itemId ──────────────────────────────────────────────────
const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  // Quantity must be a positive integer
  const parsedQty = Math.floor(Number(quantity));
  if (!parsedQty || parsedQty < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be a positive integer of at least 1.' });
  }
  if (parsedQty > MAX_QTY_PER_ITEM) {
    return res.status(400).json({ success: false, message: `Quantity cannot exceed ${MAX_QTY_PER_ITEM} per item.` });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ success: false, message: 'Cart item not found.' });

  item.quantity = parsedQty;
  await cart.save();
  return res.json({ success: true, message: 'Cart updated.', cart: serializeCart(cart) });
};

// ─── DELETE /api/cart/:itemId ───────────────────────────────────────────────
const removeCartItem = async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

  cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
  await cart.save();
  return res.json({ success: true, message: 'Item removed.', cart: serializeCart(cart) });
};

// ─── DELETE /api/cart ───────────────────────────────────────────────────────
const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return res.json({ success: true, message: 'Cart cleared.', cart: { items: [], totalItems: 0 } });
};

// ─── POST /api/cart/merge ───────────────────────────────────────────────────
// Merge guest localStorage cart into DB cart on login
const mergeCart = async (req, res) => {
  const { guestItems = [] } = req.body; // [{ productId, quantity, packSize, name, imageUrl }]

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  for (const guestItem of guestItems) {
    // Validate productId format — must be a valid MongoDB ObjectId
    if (!guestItem.productId || !/^[0-9a-fA-F]{24}$/.test(guestItem.productId)) continue;

    const guestQty = Math.floor(Number(guestItem.quantity) || 1);
    if (guestQty < 1) continue;

    const existingIdx = cart.items.findIndex(
      (i) => i.product.toString() === guestItem.productId && i.packSize === (guestItem.packSize || '')
    );
    if (existingIdx >= 0) {
      const newQty = cart.items[existingIdx].quantity + guestQty;
      // Cap at maximum allowed
      cart.items[existingIdx].quantity = Math.min(newQty, MAX_QTY_PER_ITEM);
    } else {
      // Only add if we haven't hit the cart item cap
      if (cart.items.length < MAX_CART_ITEMS) {
        cart.items.push({
          product: guestItem.productId,
          quantity: Math.min(guestQty, MAX_QTY_PER_ITEM),
          name: guestItem.name || 'Product',
          imageUrl: guestItem.imageUrl || '',
          packSize: guestItem.packSize || '',
        });
      }
    }
  }

  await cart.save();
  return res.json({ success: true, message: 'Cart merged.', cart: serializeCart(cart) });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart, mergeCart };
