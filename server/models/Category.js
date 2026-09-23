/**
 * Category model — Firestore implementation.
 * Replaces Mongoose Category.js — same public API.
 *
 * Firestore collection: categories
 */

const crypto = require('crypto');
const { db } = require('../config/firebase');

const COLLECTION = 'categories';

const generateId = () => crypto.randomBytes(12).toString('hex');

const convertTs = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (typeof data.toDate === 'function') return data.toDate();
  if (Array.isArray(data)) return data.map(convertTs);
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = convertTs(v);
  return out;
};

/** Build slug from name */
const buildSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ─── Document factory ─────────────────────────────────────────────────────────

const makeCategoryDoc = (snap) => {
  const raw = convertTs(snap.data());

  const doc = {
    _id: snap.id,
    id: snap.id,
    name: raw.name,
    description: raw.description,
    slug: raw.slug,
    parentCategory: raw.parentCategory || null,
    active: raw.active !== undefined ? raw.active : true,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };

  doc.save = async function () {
    const saveData = {
      name: this.name,
      description: this.description || '',
      slug: buildSlug(this.name),
      parentCategory: this.parentCategory || null,
      active: this.active !== undefined ? this.active : true,
      updatedAt: new Date(),
    };
    await db.collection(COLLECTION).doc(this._id).set(saveData, { merge: true });
    this.updatedAt = saveData.updatedAt;
    this.slug = saveData.slug;
    return this;
  };

  doc.toObject = function () {
    return { ...this, toObject: undefined, save: undefined, deleteOne: undefined };
  };

  return doc;
};

// ─── populate helper ──────────────────────────────────────────────────────────

const populateParent = async (doc) => {
  if (!doc || !doc.parentCategory) return doc;
  try {
    const snap = await db.collection(COLLECTION).doc(String(doc.parentCategory)).get();
    if (snap.exists) {
      const p = convertTs(snap.data());
      doc.parentCategory = { _id: snap.id, id: snap.id, name: p.name };
    }
  } catch (_) { /* ignore */ }
  return doc;
};

// ─── Static methods ───────────────────────────────────────────────────────────

/**
 * Find all categories.
 * Supports .populate('parentCategory', 'name').sort({ name: 1 })
 */
const find = () => {
  let _populate = false;
  let _sortField = null;
  let _sortDir = 1;

  const builder = {
    populate(path) {
      if (path === 'parentCategory') _populate = true;
      return this;
    },
    sort(sortObj) {
      const key = Object.keys(sortObj)[0];
      _sortField = key;
      _sortDir = sortObj[key];
      return this;
    },
    async then(resolve, reject) {
      try {
        const snap = await db.collection(COLLECTION).get();
        let docs = snap.docs.map(makeCategoryDoc);

        if (_populate) {
          docs = await Promise.all(docs.map(populateParent));
        }

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

const findOne = async (query = {}) => {
  let q = db.collection(COLLECTION);
  for (const [key, val] of Object.entries(query)) {
    if (key === '_id') {
      // handled separately
      continue;
    }
    // Handle $ne operator
    if (typeof val === 'object' && val !== null && val.$ne !== undefined) {
      // We'll filter after fetching
      continue;
    }
    if (typeof val !== 'object' || val === null) {
      q = q.where(key, '==', val);
    }
  }

  const snap = await q.get();
  if (snap.empty) return null;

  // Apply $ne filter in memory
  for (const docSnap of snap.docs) {
    let match = true;
    for (const [key, val] of Object.entries(query)) {
      if (key === '_id') continue;
      if (typeof val === 'object' && val !== null && val.$ne !== undefined) {
        if (docSnap.id === String(val.$ne) || docSnap.data()[key] === val.$ne) {
          match = false;
          break;
        }
      }
    }
    if (match) return makeCategoryDoc(docSnap);
  }
  return null;
};

const findById = async (id) => {
  if (!id) return null;
  const snap = await db.collection(COLLECTION).doc(String(id)).get();
  if (!snap.exists) return null;
  return makeCategoryDoc(snap);
};

const create = async (data) => {
  const { name, description = '', parentCategory = null, active = true } = data;
  const id = generateId();
  const now = new Date();

  const docData = {
    name: name.trim(),
    description: description.trim(),
    slug: buildSlug(name.trim()),
    parentCategory: parentCategory || null,
    active,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(id).set(docData);
  const snap = await db.collection(COLLECTION).doc(id).get();
  return makeCategoryDoc(snap);
};

const findByIdAndUpdate = (id, updateData, options = {}) => {
  let _populate = false;

  const builder = {
    populate(path) {
      if (path === 'parentCategory') _populate = true;
      return this;
    },
    async then(resolve, reject) {
      try {
        const docRef = db.collection(COLLECTION).doc(String(id));
        const existing = await docRef.get();
        if (!existing.exists) return resolve(null);

        const { name, description, parentCategory, active } = updateData;
        const saveData = {
          name: (name || '').trim(),
          description: (description || '').trim(),
          slug: buildSlug((name || '').trim()),
          parentCategory: parentCategory || null,
          active: active !== undefined ? active : true,
          updatedAt: new Date(),
        };

        await docRef.set(saveData, { merge: true });
        const updated = await docRef.get();
        let doc = makeCategoryDoc(updated);
        if (_populate) doc = await populateParent(doc);
        resolve(doc);
      } catch (e) {
        reject(e);
      }
    },
  };
  return builder;
};

const findByIdAndDelete = async (id) => {
  const docRef = db.collection(COLLECTION).doc(String(id));
  const snap = await docRef.get();
  if (!snap.exists) return null;
  const doc = makeCategoryDoc(snap);
  await docRef.delete();
  return doc;
};

module.exports = { find, findOne, findById, create, findByIdAndUpdate, findByIdAndDelete };
