/**
 * Notification model — Firestore implementation.
 * Replaces Mongoose Notification.js
 *
 * Firestore collection: notifications
 */

const crypto = require('crypto');
const { db } = require('../config/firebase');

const COLLECTION = 'notifications';

const generateId = () => crypto.randomBytes(12).toString('hex');

const convertTs = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (typeof data.toDate === 'function') return data.toDate();
  if (Array.isArray(data)) return data.map(convertTs);
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = convertTs(v);
  return out;
};

const makeNotificationDoc = (snap) => {
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
        let docs = snap.docs.map(makeNotificationDoc);

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

const create = async (data) => {
  const id = generateId();
  const now = new Date();

  const docData = {
    title: data.title,
    message: data.message,
    type: data.type,
    link: data.link || '',
    isRead: data.isRead !== undefined ? data.isRead : false,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(id).set(docData);
  const snap = await db.collection(COLLECTION).doc(id).get();
  return makeNotificationDoc(snap);
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
  return makeNotificationDoc(updated);
};

const findByIdAndDelete = async (id) => {
  if (!id) return null;
  const docRef = db.collection(COLLECTION).doc(String(id));
  const snap = await docRef.get();
  if (!snap.exists) return null;
  const doc = makeNotificationDoc(snap);
  await docRef.delete();
  return doc;
};

const updateMany = async (filter, update) => {
  let q = db.collection(COLLECTION);
  for (const [key, val] of Object.entries(filter)) {
    q = q.where(key, '==', val);
  }
  const snap = await q.get();
  
  if (snap.empty) return { modifiedCount: 0 };

  const batch = db.batch();
  snap.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, { ...update, updatedAt: new Date() });
  });

  await batch.commit();
  return { modifiedCount: snap.size };
};

const deleteMany = async (filter) => {
  // We only use deleteMany({}) in the controller
  if (Object.keys(filter).length > 0) {
    throw new Error('deleteMany with filters not implemented for Firestore adapter');
  }
  const snap = await db.collection(COLLECTION).get();
  if (snap.empty) return { deletedCount: 0 };

  const batch = db.batch();
  snap.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
  return { deletedCount: snap.size };
};

module.exports = { find, countDocuments, create, findByIdAndUpdate, findByIdAndDelete, updateMany, deleteMany };
