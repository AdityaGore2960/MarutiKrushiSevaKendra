/**
 * User model — Firestore implementation.
 * Replaces Mongoose User.js — same public API for controllers and middleware.
 *
 * Firestore collection: users
 * Document ID = MongoDB ObjectId string (preserved on migration)
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db } = require('../config/firebase');

const COLLECTION = 'users';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateId = () => crypto.randomBytes(12).toString('hex');

/** Recursively convert Firestore Timestamps → JS Dates */
const convertTs = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (typeof data.toDate === 'function') return data.toDate();
  if (Array.isArray(data)) return data.map(convertTs);
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = convertTs(v);
  return out;
};

/**
 * Wraps raw Firestore data into a document object that mirrors Mongoose's
 * document interface: _id, instance methods (save, comparePassword, toObject).
 *
 * @param {FirebaseFirestore.DocumentSnapshot} snap
 * @param {boolean} includePassword  Set true only for login flows
 */
const makeUserDoc = (snap, includePassword = false) => {
  const raw = convertTs(snap.data());

  const doc = {
    _id: snap.id,
    id: snap.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    role: raw.role,
    accountStatus: raw.accountStatus,
    addresses: (raw.addresses || []).map(a => ({ ...a })),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    // Keep hashed password internally for comparePassword — always loaded
    __passwordHash: raw.password,
  };

  if (includePassword) {
    doc.password = raw.password;
  }

  // ── comparePassword ───────────────────────────────────────────────────────
  doc.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.__passwordHash);
  };

  // ── save ──────────────────────────────────────────────────────────────────
  doc.save = async function () {
    let passwordHash = this.__passwordHash;

    // If controller set a plain-text password, hash it before saving
    if (
      this.password &&
      typeof this.password === 'string' &&
      !this.password.startsWith('$2')
    ) {
      passwordHash = await bcrypt.hash(this.password, 12);
      this.__passwordHash = passwordHash;
    }

    const saveData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: passwordHash,
      role: this.role,
      accountStatus: this.accountStatus || 'Active',
      addresses: this.addresses.map(({ _id, name, house, street, city, state, pincode, phone, country }) => ({
        _id: _id || generateId(),
        name: name || '',
        house: house || '',
        street: street || '',
        city: city || '',
        state: state || '',
        pincode: pincode || '',
        phone: phone || '',
        country: country || 'India',
      })),
      updatedAt: new Date(),
    };

    const docRef = db.collection(COLLECTION).doc(this._id);
    const existing = await docRef.get();
    if (!existing.exists) {
      saveData.createdAt = this.createdAt || new Date();
    }

    await docRef.set(saveData, { merge: true });
    this.updatedAt = saveData.updatedAt;
    return this;
  };

  // ── toObject ──────────────────────────────────────────────────────────────
  doc.toObject = function () {
    return {
      _id: this._id,
      id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      accountStatus: this.accountStatus,
      addresses: this.addresses,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  return doc;
};

// ─── Static Methods ──────────────────────────────────────────────────────────

/**
 * Find a single user by Firestore document ID.
 * Returns null if not found.
 */
const findById = async (id) => {
  if (!id) return null;
  const snap = await db.collection(COLLECTION).doc(String(id)).get();
  if (!snap.exists) return null;
  return makeUserDoc(snap, false);
};

/**
 * Find a single user matching a query object.
 * Supported filter keys: email, phone, role, accountStatus
 * Chain .select('+password') to include the password hash.
 */
const findOne = (query = {}) => {
  let _includePassword = false;

  const builder = {
    select(fields) {
      if (typeof fields === 'string' && fields.includes('+password')) {
        _includePassword = true;
      }
      return this;
    },

    async then(resolve, reject) {
      try {
        let q = db.collection(COLLECTION);

        for (const [key, val] of Object.entries(query)) {
          if (typeof val !== 'object' || val === null) {
            q = q.where(key, '==', val);
          }
        }

        const snap = await q.limit(1).get();
        if (snap.empty) return resolve(null);
        resolve(makeUserDoc(snap.docs[0], _includePassword));
      } catch (e) {
        reject(e);
      }
    },
  };

  return builder;
};

/**
 * Create a new user document. Password is hashed automatically.
 */
const create = async (data) => {
  const { name, email, phone, password, role = 'CUSTOMER', accountStatus = 'Active', addresses = [] } = data;

  const hashedPassword = await bcrypt.hash(password, 12);
  const id = generateId();
  const now = new Date();

  const docData = {
    name,
    email: email.toLowerCase(),
    phone,
    password: hashedPassword,
    role,
    accountStatus,
    addresses,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(id).set(docData);

  const snap = await db.collection(COLLECTION).doc(id).get();
  return makeUserDoc(snap, false);
};

/**
 * Count users matching a query.
 */
const countDocuments = async (query = {}) => {
  let q = db.collection(COLLECTION);
  for (const [key, val] of Object.entries(query)) {
    if (typeof val !== 'object' || val === null) {
      q = q.where(key, '==', val);
    }
  }
  const snap = await q.get();
  return snap.size;
};

module.exports = { findById, findOne, create, countDocuments };
