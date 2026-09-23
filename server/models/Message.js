/**
 * Message model — Firestore implementation.
 * Replaces Mongoose Message.js
 *
 * Firestore collection: messages
 */

const crypto = require('crypto');
const { db } = require('../config/firebase');

const COLLECTION = 'messages';

const generateId = () => crypto.randomBytes(12).toString('hex');

const convertTs = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (typeof data.toDate === 'function') return data.toDate();
  if (Array.isArray(data)) return data.map(convertTs);
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = convertTs(v);
  return out;
};

// ─── Document factory ─────────────────────────────────────────────────────────

const makeMessageDoc = (snap) => {
  const raw = convertTs(snap.data());
  return {
    _id: snap.id,
    id: snap.id,
    ...raw,
  };
};

// ─── QueryBuilder ─────────────────────────────────────────────────────────────

const makeQuery = (firestoreQueryPromise) => {
  let _sortField = null;
  let _sortDir = -1;

  const builder = {
    sort(sortObj) {
      _sortField = Object.keys(sortObj)[0];
      _sortDir = sortObj[_sortField];
      return this;
    },
    async then(resolve, reject) {
      try {
        const snap = await firestoreQueryPromise.get();
        let docs = snap.docs.map(makeMessageDoc);

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
  for (const [key, val] of Object.entries(query)) {
    if (typeof val !== 'object' || val === null) {
      q = q.where(key, '==', val);
    }
  }
  return makeQuery(q);
};

const create = async (data) => {
  const id = generateId();
  const now = new Date();

  const docData = {
    name: (data.name || '').trim(),
    mobile: (data.mobile || '').trim(),
    email: (data.email || '').trim().toLowerCase(),
    subject: (data.subject || '').trim(),
    category: data.category || 'General Inquiry',
    orderId: (data.orderId || '').trim(),
    message: (data.message || '').trim(),
    status: data.status || 'NEW',
    adminReply: (data.adminReply || '').trim(),
    adminRepliedAt: data.adminRepliedAt || null,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(id).set(docData);
  const snap = await db.collection(COLLECTION).doc(id).get();
  return makeMessageDoc(snap);
};

const findByIdAndUpdate = async (id, updateData, options = {}) => {
  if (!id) return null;
  const docRef = db.collection(COLLECTION).doc(String(id));
  const existing = await docRef.get();
  if (!existing.exists) return null;

  const cleanUpdate = { ...updateData, updatedAt: new Date() };
  delete cleanUpdate._id;
  delete cleanUpdate.id;

  await docRef.set(cleanUpdate, { merge: true });
  const updated = await docRef.get();
  return makeMessageDoc(updated);
};

const findByIdAndDelete = async (id) => {
  if (!id) return null;
  const docRef = db.collection(COLLECTION).doc(String(id));
  const snap = await docRef.get();
  if (!snap.exists) return null;
  const doc = makeMessageDoc(snap);
  await docRef.delete();
  return doc;
};

module.exports = { find, create, findByIdAndUpdate, findByIdAndDelete };
