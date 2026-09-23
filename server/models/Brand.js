/**
 * Brand model — Firestore implementation.
 * Replaces Mongoose Brand.js — same public API.
 *
 * Firestore collection: brands
 */

const crypto = require('crypto');
const { db } = require('../config/firebase');

const COLLECTION = 'brands';

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

const makeBrandDoc = (snap) => {
  const raw = convertTs(snap.data());

  const doc = {
    _id: snap.id,
    id: snap.id,
    name: raw.name,
    imageUrl: raw.imageUrl,
    cloudinaryPublicId: raw.cloudinaryPublicId,
    active: raw.active !== undefined ? raw.active : true,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };

  doc.save = async function () {
    const saveData = {
      name: this.name,
      imageUrl: this.imageUrl || '',
      cloudinaryPublicId: this.cloudinaryPublicId || '',
      active: this.active !== undefined ? this.active : true,
      updatedAt: new Date(),
    };

    await db.collection(COLLECTION).doc(this._id).set(saveData, { merge: true });
    this.updatedAt = saveData.updatedAt;
    return this;
  };

  doc.deleteOne = async function () {
    await db.collection(COLLECTION).doc(this._id).delete();
  };

  return doc;
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
        let docs = snap.docs.map(makeBrandDoc);

        if (_sortField) {
          docs.sort((a, b) => {
            const av = (a[_sortField] || '').toString().toLowerCase();
            const bv = (b[_sortField] || '').toString().toLowerCase();
            return _sortDir === 1 ? av.localeCompare(bv) : bv.localeCompare(av);
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

const findOne = async (query = {}) => {
  let q = db.collection(COLLECTION);
  for (const [key, val] of Object.entries(query)) {
    if (typeof val !== 'object' || val === null) {
      q = q.where(key, '==', val);
    }
  }
  const snap = await q.limit(1).get();
  if (snap.empty) return null;
  return makeBrandDoc(snap.docs[0]);
};

const findById = async (id) => {
  if (!id) return null;
  const snap = await db.collection(COLLECTION).doc(String(id)).get();
  if (!snap.exists) return null;
  return makeBrandDoc(snap);
};

const create = async (data) => {
  const id = generateId();
  const now = new Date();

  const docData = {
    name: data.name.trim(),
    imageUrl: data.imageUrl || '',
    cloudinaryPublicId: data.cloudinaryPublicId || '',
    active: data.active !== undefined ? data.active : true,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(id).set(docData);
  const snap = await db.collection(COLLECTION).doc(id).get();
  return makeBrandDoc(snap);
};

module.exports = { find, findOne, findById, create };
