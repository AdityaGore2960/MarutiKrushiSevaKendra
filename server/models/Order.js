/**
 * Order model — Firestore implementation.
 * Replaces Mongoose Order.js — same public API.
 *
 * Firestore collection: orders
 */

const crypto = require('crypto');
const { db, admin } = require('../config/firebase');

const COLLECTION = 'orders';
const USERS_COLLECTION = 'users';

const generateId = () => crypto.randomBytes(12).toString('hex');

const convertTs = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (typeof data.toDate === 'function') return data.toDate();
  if (Array.isArray(data)) return data.map(convertTs);
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = convertTs(v);
  return out;
};

// ─── User populate helper ─────────────────────────────────────────────────────

const populateUser = async (doc, select = 'name email phone') => {
  if (!doc || !doc.user) return doc;
  try {
    const userSnap = await db.collection(USERS_COLLECTION).doc(String(doc.user)).get();
    if (userSnap.exists) {
      const ud = convertTs(userSnap.data());
      const fields = select.split(' ');
      const populated = { _id: userSnap.id, id: userSnap.id };
      fields.forEach(f => { if (ud[f] !== undefined) populated[f] = ud[f]; });
      doc.user = populated;
    }
  } catch (_) { /* ignore */ }
  return doc;
};

// ─── Document factory ─────────────────────────────────────────────────────────

const makeOrderDoc = (snap) => {
  const raw = convertTs(snap.data());

  const doc = {
    _id: snap.id,
    id: snap.id,
    user: raw.user,
    items: raw.items || [],
    shippingAddress: raw.shippingAddress || {},
    subtotal: raw.subtotal,
    shippingCharge: raw.shippingCharge,
    taxes: raw.taxes,
    total: raw.total,
    paymentMethod: raw.paymentMethod,
    razorpayOrderId: raw.razorpayOrderId,
    razorpayPaymentId: raw.razorpayPaymentId,
    razorpaySignature: raw.razorpaySignature,
    paymentStatus: raw.paymentStatus,
    orderStatus: raw.orderStatus,
    amountPaidNow: raw.amountPaidNow,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };

  doc.populate = async function (path, select = 'name email phone') {
    if (path === 'user') await populateUser(this, select);
    return this;
  };

  doc.save = async function () {
    const userId = this.user && typeof this.user === 'object'
      ? (this.user._id || this.user.id)
      : this.user;

    const saveData = {
      user: userId,
      items: this.items || [],
      shippingAddress: this.shippingAddress || {},
      subtotal: this.subtotal,
      shippingCharge: this.shippingCharge || 0,
      taxes: this.taxes || 0,
      total: this.total,
      paymentMethod: this.paymentMethod,
      razorpayOrderId: this.razorpayOrderId || '',
      razorpayPaymentId: this.razorpayPaymentId || '',
      razorpaySignature: this.razorpaySignature || '',
      paymentStatus: this.paymentStatus,
      orderStatus: this.orderStatus,
      amountPaidNow: this.amountPaidNow || 0,
      updatedAt: new Date(),
    };

    await db.collection(COLLECTION).doc(this._id).set(saveData, { merge: true });
    this.updatedAt = saveData.updatedAt;
    return this;
  };

  doc.toObject = function () {
    const { save, deleteOne, populate, toObject, ...rest } = this;
    return rest;
  };

  return doc;
};

// ─── QueryBuilder ─────────────────────────────────────────────────────────────

const makeQuery = (firestoreQueryPromise) => {
  let _populatePath = null;
  let _populateSelect = 'name email phone';
  let _sortField = null;
  let _sortDir = -1;
  let _limitNum = null;
  let _selectExclude = null;

  const builder = {
    populate(path, select = 'name email phone') {
      _populatePath = path;
      _populateSelect = select;
      return this;
    },
    sort(sortObj) {
      _sortField = Object.keys(sortObj)[0];
      _sortDir = sortObj[_sortField];
      return this;
    },
    limit(n) {
      _limitNum = n;
      return this;
    },
    select(fields) {
      // e.g. '-razorpayOrderId -razorpayPaymentId -razorpaySignature'
      if (typeof fields === 'string' && fields.startsWith('-')) {
        _selectExclude = fields.split(' ').map(f => f.replace('-', ''));
      }
      return this;
    },
    async then(resolve, reject) {
      try {
        const snap = await firestoreQueryPromise.get();
        let docs = snap.docs.map(makeOrderDoc);

        if (_sortField) {
          docs.sort((a, b) => {
            const av = a[_sortField];
            const bv = b[_sortField];
            let diff = 0;
            if (av instanceof Date && bv instanceof Date) {
              diff = av.getTime() - bv.getTime();
            } else {
              diff = av < bv ? -1 : av > bv ? 1 : 0;
            }
            return _sortDir === 1 ? diff : -diff;
          });
        }

        if (_limitNum !== null) docs = docs.slice(0, _limitNum);

        if (_populatePath === 'user') {
          docs = await Promise.all(docs.map(d => populateUser(d, _populateSelect)));
        }

        if (_selectExclude) {
          docs = docs.map(d => {
            const copy = { ...d };
            _selectExclude.forEach(f => delete copy[f]);
            return copy;
          });
        }

        resolve(docs);
      } catch (e) {
        reject(e);
      }
    },
  };
  return builder;
};

// ─── Static methods ───────────────────────────────────────────────────────────

const find = (query = {}) => {
  let q = db.collection(COLLECTION);

  if (query.user) q = q.where('user', '==', String(query.user));
  if (query.paymentStatus) q = q.where('paymentStatus', '==', query.paymentStatus);
  if (query.orderStatus && !Array.isArray(query.orderStatus)) {
    q = q.where('orderStatus', '==', query.orderStatus);
  }

  // Date range: query.createdAt = { $gte: date } or { $gte, $lt }
  if (query.createdAt) {
    if (query.createdAt.$gte) {
      q = q.where('createdAt', '>=', admin.firestore.Timestamp.fromDate(query.createdAt.$gte));
    }
    if (query.createdAt.$lt) {
      q = q.where('createdAt', '<', admin.firestore.Timestamp.fromDate(query.createdAt.$lt));
    }
  }

  return makeQuery(q);
};

const findById = (id) => {
  let _populatePath = null;
  let _populateSelect = 'name email phone';

  const builder = {
    populate(path, select = 'name email phone') {
      _populatePath = path;
      _populateSelect = select;
      return this;
    },
    async then(resolve, reject) {
      try {
        if (!id) return resolve(null);
        const snap = await db.collection(COLLECTION).doc(String(id)).get();
        if (!snap.exists) return resolve(null);
        let doc = makeOrderDoc(snap);
        if (_populatePath === 'user') doc = await populateUser(doc, _populateSelect);
        resolve(doc);
      } catch (e) {
        reject(e);
      }
    },
  };
  return builder;
};

const create = async (data) => {
  const id = generateId();
  const now = new Date();

  const userId = data.user && typeof data.user === 'object'
    ? (data.user._id || data.user.id)
    : String(data.user);

  const docData = {
    user: userId,
    items: data.items || [],
    shippingAddress: data.shippingAddress || {},
    subtotal: data.subtotal || 0,
    shippingCharge: data.shippingCharge || 0,
    taxes: data.taxes || 0,
    total: data.total || 0,
    paymentMethod: data.paymentMethod,
    razorpayOrderId: data.razorpayOrderId || '',
    razorpayPaymentId: data.razorpayPaymentId || '',
    razorpaySignature: data.razorpaySignature || '',
    paymentStatus: data.paymentStatus || 'pending',
    orderStatus: data.orderStatus || 'pending',
    amountPaidNow: data.amountPaidNow || 0,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(id).set(docData);
  const snap = await db.collection(COLLECTION).doc(id).get();
  return makeOrderDoc(snap);
};

const findByIdAndUpdate = async (id, updateData, _options = {}) => {
  if (!id) return null;
  const docRef = db.collection(COLLECTION).doc(String(id));
  const existing = await docRef.get();
  if (!existing.exists) return null;

  const cleanUpdate = { ...updateData, updatedAt: new Date() };
  delete cleanUpdate._id;
  delete cleanUpdate.id;

  await docRef.set(cleanUpdate, { merge: true });
  const updated = await docRef.get();
  return makeOrderDoc(updated);
};

const countDocuments = async (query = {}) => {
  let q = db.collection(COLLECTION);

  if (query.paymentStatus) q = q.where('paymentStatus', '==', query.paymentStatus);

  if (query.createdAt) {
    if (query.createdAt.$gte) {
      q = q.where('createdAt', '>=', admin.firestore.Timestamp.fromDate(query.createdAt.$gte));
    }
  }

  // orderStatus.$in filter — apply client-side after fetch
  const snap = await q.get();

  if (query.orderStatus && query.orderStatus.$in) {
    const allowedStatuses = query.orderStatus.$in;
    return snap.docs.filter(d => allowedStatuses.includes(d.data().orderStatus)).length;
  }

  return snap.size;
};

/**
 * aggregate() — only status-group aggregation is needed (in productController getStats).
 * Returns: [{ _id: 'pending', count: 5 }, ...]
 */
const aggregate = async (pipeline) => {
  // Only the $group by orderStatus pipeline is used
  const snap = await db.collection(COLLECTION).get();
  const counts = {};
  snap.docs.forEach(d => {
    const status = d.data().orderStatus;
    counts[status] = (counts[status] || 0) + 1;
  });
  return Object.entries(counts).map(([_id, count]) => ({ _id, count }));
};

module.exports = { find, findById, create, findByIdAndUpdate, countDocuments, aggregate };
