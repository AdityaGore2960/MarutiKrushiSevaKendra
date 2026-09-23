/**
 * Product model — Firestore implementation.
 * Replaces Mongoose Product.js — same public API.
 *
 * Firestore collection: products
 *
 * NOTE: Firestore does not support regex queries.
 * Text search is handled in productController by fetching all docs and
 * filtering client-side (suitable for this application's scale).
 */

const crypto = require('crypto');
const { db } = require('../config/firebase');

const COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';

const generateId = () => crypto.randomBytes(12).toString('hex');

const convertTs = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (typeof data.toDate === 'function') return data.toDate();
  if (Array.isArray(data)) return data.map(convertTs);
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = convertTs(v);
  return out;
};

// ─── Category populate helper ─────────────────────────────────────────────────

const populateCategory = async (doc, select = 'name slug') => {
  if (!doc || !doc.category) return doc;
  try {
    const catSnap = await db.collection(CATEGORIES_COLLECTION).doc(String(doc.category)).get();
    if (catSnap.exists) {
      const catData = convertTs(catSnap.data());
      const fields = select.split(' ');
      const populated = { _id: catSnap.id, id: catSnap.id };
      fields.forEach(f => { if (catData[f] !== undefined) populated[f] = catData[f]; });
      doc.category = populated;
    }
  } catch (_) { /* ignore */ }
  return doc;
};

// ─── Document factory ─────────────────────────────────────────────────────────

const makeProductDoc = (snap) => {
  const raw = convertTs(snap.data());

  const doc = {
    _id: snap.id,
    id: snap.id,
    name: raw.name,
    category: raw.category,
    description: raw.description,
    suitableCrops: raw.suitableCrops || [],
    purpose: raw.purpose,
    composition: raw.composition,
    activeIngredient: raw.activeIngredient,
    targetProblem: raw.targetProblem,
    packSizes: raw.packSizes || [],
    manufacturer: raw.manufacturer,
    brand: raw.brand,
    price: raw.price,
    discount: raw.discount,
    stock: raw.stock,
    weight: raw.weight,
    imageUrl: raw.imageUrl,
    cloudinaryPublicId: raw.cloudinaryPublicId,
    available: raw.available,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };

  // ── populate (instance method, returns Promise so await works) ────────────
  doc.populate = async function (path, select = 'name slug') {
    if (path === 'category') {
      await populateCategory(this, select);
    }
    return this;
  };

  // ── save ──────────────────────────────────────────────────────────────────
  doc.save = async function () {
    // If category was populated (object), store only the ID
    const categoryId = this.category && typeof this.category === 'object'
      ? (this.category._id || this.category.id)
      : this.category;

    const saveData = {
      name: this.name,
      category: categoryId || null,
      description: this.description || '',
      suitableCrops: this.suitableCrops || [],
      purpose: this.purpose || '',
      composition: this.composition || '',
      activeIngredient: this.activeIngredient || '',
      targetProblem: this.targetProblem || '',
      packSizes: this.packSizes || [],
      manufacturer: this.manufacturer || '',
      brand: this.brand || '',
      price: this.price || 0,
      discount: this.discount || 0,
      stock: this.stock || 0,
      weight: this.weight || '',
      imageUrl: this.imageUrl || '',
      cloudinaryPublicId: this.cloudinaryPublicId || '',
      available: this.available !== undefined ? this.available : true,
      updatedAt: new Date(),
    };

    await db.collection(COLLECTION).doc(this._id).set(saveData, { merge: true });
    this.updatedAt = saveData.updatedAt;
    return this;
  };

  // ── deleteOne ─────────────────────────────────────────────────────────────
  doc.deleteOne = async function () {
    await db.collection(COLLECTION).doc(this._id).delete();
  };

  doc.toObject = function () {
    const { save, deleteOne, populate, toObject, ...rest } = this;
    return rest;
  };

  return doc;
};

// ─── QueryBuilder ─────────────────────────────────────────────────────────────
// Supports: .populate(path, select).sort({ field: dir })

const makeQuery = (firestoreQuery) => {
  let _populatePath = null;
  let _populateSelect = 'name slug';
  let _sortField = null;
  let _sortDir = -1;

  const builder = {
    populate(path, select = 'name slug') {
      _populatePath = path;
      _populateSelect = select;
      return this;
    },
    sort(sortObj) {
      _sortField = Object.keys(sortObj)[0];
      _sortDir = sortObj[_sortField];
      return this;
    },
    async then(resolve, reject) {
      try {
        const snap = await firestoreQuery.get();
        let docs = snap.docs.map(makeProductDoc);

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

        if (_populatePath) {
          docs = await Promise.all(docs.map(d => populateCategory(d, _populateSelect)));
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

/**
 * find(query) — returns a QueryBuilder.
 * query.search handled in productController (client-side filtering).
 * Supported Firestore filters: category, available.
 */
const find = (query = {}) => {
  let q = db.collection(COLLECTION);

  if (query.category) {
    // category may be a string ID
    q = q.where('category', '==', String(query.category));
  }

  if (query.available !== undefined) {
    q = q.where('available', '==', query.available);
  }

  // brand regex — handled client-side in brandController
  // $or (search) — handled client-side in productController

  return makeQuery(q);
};

const findById = (id) => {
  let _populatePath = null;
  let _populateSelect = 'name slug';

  const builder = {
    populate(path, select = 'name slug') {
      _populatePath = path;
      _populateSelect = select;
      return this;
    },
    async then(resolve, reject) {
      try {
        if (!id) return resolve(null);
        const snap = await db.collection(COLLECTION).doc(String(id)).get();
        if (!snap.exists) return resolve(null);
        let doc = makeProductDoc(snap);
        if (_populatePath === 'category') {
          doc = await populateCategory(doc, _populateSelect);
        }
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

  // Resolve category to ID string
  const categoryId = data.category && typeof data.category === 'object'
    ? (data.category._id || data.category.id)
    : data.category;

  const docData = {
    name: data.name,
    category: categoryId || null,
    description: data.description || '',
    suitableCrops: data.suitableCrops || [],
    purpose: data.purpose || '',
    composition: data.composition || '',
    activeIngredient: data.activeIngredient || '',
    targetProblem: data.targetProblem || '',
    packSizes: data.packSizes || [],
    manufacturer: data.manufacturer || '',
    brand: data.brand || '',
    price: data.price || 0,
    discount: data.discount || 0,
    stock: data.stock || 0,
    weight: data.weight || '',
    imageUrl: data.imageUrl || '',
    cloudinaryPublicId: data.cloudinaryPublicId || '',
    available: data.available !== undefined ? data.available : true,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(id).set(docData);
  const snap = await db.collection(COLLECTION).doc(id).get();
  return makeProductDoc(snap);
};

const countDocuments = async (query = {}) => {
  let q = db.collection(COLLECTION);
  if (query.available !== undefined) {
    q = q.where('available', '==', query.available);
  }
  const snap = await q.get();
  return snap.size;
};

module.exports = { find, findById, create, countDocuments };
