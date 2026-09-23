/**
 * Setting model — Firestore implementation.
 * Replaces Mongoose Setting.js
 *
 * Firestore collection: settings
 * We use a singleton document with ID "global"
 */

const { db } = require('../config/firebase');

const COLLECTION = 'settings';
const GLOBAL_DOC_ID = 'global';

const convertTs = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (typeof data.toDate === 'function') return data.toDate();
  if (Array.isArray(data)) return data.map(convertTs);
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = convertTs(v);
  return out;
};

const makeSettingDoc = (snap) => {
  const raw = convertTs(snap.data());

  const doc = {
    _id: snap.id,
    id: snap.id,
    storeName: raw.storeName || 'Maruti Krushiseva Kendra',
    storeLogoUrl: raw.storeLogoUrl || '',
    cloudinaryPublicId: raw.cloudinaryPublicId || '',
    businessEmail: raw.businessEmail || 'contact@marutikrushi.com',
    customerSupportPhone: raw.customerSupportPhone || '+91 9999999999',
    businessAddress: raw.businessAddress || 'Main Market, City, State, India',
    shippingEnabled: raw.shippingEnabled !== undefined ? raw.shippingEnabled : true,
    flatShippingRate: raw.flatShippingRate || 50,
    freeShippingThreshold: raw.freeShippingThreshold || 1000,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };

  doc.save = async function () {
    const saveData = {
      storeName: this.storeName,
      storeLogoUrl: this.storeLogoUrl,
      cloudinaryPublicId: this.cloudinaryPublicId,
      businessEmail: this.businessEmail,
      customerSupportPhone: this.customerSupportPhone,
      businessAddress: this.businessAddress,
      shippingEnabled: this.shippingEnabled,
      flatShippingRate: this.flatShippingRate,
      freeShippingThreshold: this.freeShippingThreshold,
      updatedAt: new Date(),
    };
    if (!this.createdAt) saveData.createdAt = new Date();

    await db.collection(COLLECTION).doc(GLOBAL_DOC_ID).set(saveData, { merge: true });
    this.updatedAt = saveData.updatedAt;
    return this;
  };

  return doc;
};

// ─── Static methods ───────────────────────────────────────────────────────────

const findOne = async () => {
  const snap = await db.collection(COLLECTION).doc(GLOBAL_DOC_ID).get();
  if (!snap.exists) return null;
  return makeSettingDoc(snap);
};

const create = async (data = {}) => {
  const docData = {
    storeName: data.storeName || 'Maruti Krushiseva Kendra',
    storeLogoUrl: data.storeLogoUrl || '',
    cloudinaryPublicId: data.cloudinaryPublicId || '',
    businessEmail: data.businessEmail || 'contact@marutikrushi.com',
    customerSupportPhone: data.customerSupportPhone || '+91 9999999999',
    businessAddress: data.businessAddress || 'Main Market, City, State, India',
    shippingEnabled: data.shippingEnabled !== undefined ? data.shippingEnabled : true,
    flatShippingRate: data.flatShippingRate !== undefined ? Number(data.flatShippingRate) : 50,
    freeShippingThreshold: data.freeShippingThreshold !== undefined ? Number(data.freeShippingThreshold) : 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection(COLLECTION).doc(GLOBAL_DOC_ID).set(docData);
  const snap = await db.collection(COLLECTION).doc(GLOBAL_DOC_ID).get();
  return makeSettingDoc(snap);
};

// Used to emulate `new Setting()` in settingController
function Setting() {
  const doc = {
    save: async function () {
      const saved = await create(this);
      Object.assign(this, saved);
      return this;
    }
  };
  return doc;
}

Setting.findOne = findOne;
Setting.create = create;

module.exports = Setting;
