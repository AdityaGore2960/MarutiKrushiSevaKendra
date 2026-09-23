/**
 * Cart model — Firestore implementation.
 * Replaces Mongoose Cart.js — same public API.
 *
 * Firestore collection: carts
 * Document ID = user ID (1 cart per user)
 */

const { db } = require('../config/firebase');

const COLLECTION = 'carts';

const generateId = () => require('crypto').randomBytes(12).toString('hex');

const convertTs = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (typeof data.toDate === 'function') return data.toDate();
  if (Array.isArray(data)) return data.map(convertTs);
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = convertTs(v);
  return out;
};

// ─── Document factory ─────────────────────────────────────────────────────────

const makeCartDoc = (snap) => {
  const raw = convertTs(snap.data());

  const doc = {
    _id: snap.id,
    id: snap.id,
    user: raw.user,
    items: raw.items || [],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };

  // Mongoose subdocument helper for cart.items.id(itemId)
  doc.items.id = function (itemId) {
    return this.find((i) => i._id === itemId || i.id === itemId);
  };

  doc.save = async function () {
    const userId = this.user && typeof this.user === 'object'
      ? (this.user._id || this.user.id)
      : this.user;

    // Ensure all items have an _id
    this.items = this.items.map((i) => {
      if (!i._id) i._id = generateId();
      i.id = i._id;
      // Convert nested product ObjectId if present
      if (i.product && typeof i.product === 'object') {
        i.product = i.product._id || i.product.id;
      }
      return i;
    });

    const saveData = {
      user: userId,
      items: this.items,
      updatedAt: new Date(),
    };

    if (!this.createdAt) saveData.createdAt = new Date();

    await db.collection(COLLECTION).doc(String(userId)).set(saveData, { merge: true });
    this.updatedAt = saveData.updatedAt;
    return this;
  };

  return doc;
};

// ─── Static methods ───────────────────────────────────────────────────────────

const findOne = async (query = {}) => {
  if (query.user) {
    // We use the user ID as the document ID for carts
    const snap = await db.collection(COLLECTION).doc(String(query.user)).get();
    if (!snap.exists) return null;
    return makeCartDoc(snap);
  }

  // Fallback for other queries (not typically used for carts)
  let q = db.collection(COLLECTION);
  for (const [key, val] of Object.entries(query)) {
    if (typeof val !== 'object' || val === null) {
      q = q.where(key, '==', val);
    }
  }
  const snap = await q.limit(1).get();
  if (snap.empty) return null;
  return makeCartDoc(snap.docs[0]);
};

// Emulate Mongoose `new Cart({ user: id, items: [] })`
function Cart(data) {
  const doc = {
    user: data.user,
    items: data.items || [],
  };

  doc.items.id = function (itemId) {
    return this.find((i) => i._id === itemId || i.id === itemId);
  };

  doc.save = async function () {
    const userId = this.user && typeof this.user === 'object'
      ? (this.user._id || this.user.id)
      : this.user;

    this.items = this.items.map((i) => {
      if (!i._id) i._id = generateId();
      i.id = i._id;
      if (i.product && typeof i.product === 'object') {
        i.product = i.product._id || i.product.id;
      }
      return i;
    });

    const saveData = {
      user: userId,
      items: this.items,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection(COLLECTION).doc(String(userId)).set(saveData);
    
    // Fetch and return to get full document methods
    const snap = await db.collection(COLLECTION).doc(String(userId)).get();
    return makeCartDoc(snap);
  };

  return doc;
}

Cart.findOne = findOne;

module.exports = Cart;
