require('dotenv').config();
const mongoose = require('mongoose');
const { db } = require('../config/firebase');

const collections = [
  'users',
  'products',
  'categories',
  'orders',
  'carts',
  'brands',
  'messages',
  'notifications',
  'settings'
];

async function verify() {
  console.log('🔌 Connecting to MongoDB...');
  const resolvedUri = 'mongodb://Maruti123:maruti123@ac-cwnqa57-shard-00-00.8rr6uea.mongodb.net:27017,ac-cwnqa57-shard-00-01.8rr6uea.mongodb.net:27017,ac-cwnqa57-shard-00-02.8rr6uea.mongodb.net:27017/maruti-krushiseva?ssl=true&replicaSet=atlas-moy1pd-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1';
  await mongoose.connect(resolvedUri);
  console.log('✅ MongoDB connected successfully\n');

  let allPass = true;

  for (const collName of collections) {
    const coll = mongoose.connection.collection(collName);
    
    // Count docs
    const mongoCount = await coll.countDocuments();
    const fsSnap = await db.collection(collName).get();
    const fsCount = fsSnap.size;
    
    const missing = Math.max(0, mongoCount - fsCount);
    const extra = Math.max(0, fsCount - mongoCount);
    let relStatus = 'N/A';
    
    // Relationship Checks
    if (collName === 'orders' && fsCount > 0) {
      let validUsers = true;
      let validProducts = true;
      for (const doc of fsSnap.docs) {
        const order = doc.data();
        if (order.user) {
          const userSnap = await db.collection('users').doc(String(order.user)).get();
          if (!userSnap.exists) validUsers = false;
        }
        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
             const prodId = typeof item.product === 'object' ? String(item.product) : String(item.product);
             const prodSnap = await db.collection('products').doc(prodId).get();
             if (!prodSnap.exists) validProducts = false;
          }
        }
      }
      relStatus = (validUsers ? 'Orders→Users OK ' : 'Orders→Users FAIL ') + 
                  (validProducts ? 'Orders→Products OK' : 'Orders→Products FAIL');
    }
    
    if (collName === 'products' && fsCount > 0) {
       let validCat = true;
       for (const doc of fsSnap.docs) {
          const prod = doc.data();
          if (prod.category) {
             const catId = typeof prod.category === 'object' ? String(prod.category) : String(prod.category);
             const catSnap = await db.collection('categories').doc(catId).get();
             if (!catSnap.exists) validCat = false;
          }
       }
       relStatus = validCat ? 'Products→Categories OK' : 'Products→Categories FAIL';
    }

    if (collName === 'messages' && fsCount > 0) {
      let validUsers = true;
      for (const doc of fsSnap.docs) {
          const msg = doc.data();
          if (msg.user) {
              const uSnap = await db.collection('users').doc(String(msg.user)).get();
              if (!uSnap.exists) validUsers = false;
          }
      }
      relStatus = validUsers ? 'Messages→Users OK' : 'Messages→Users FAIL';
    }

    const passed = missing === 0 && extra === 0 && !relStatus.includes('FAIL');
    if (!passed) allPass = false;

    console.log(`Collection: ${collName}`);
    console.log(`MongoDB count: ${mongoCount}`);
    console.log(`Firestore count: ${fsCount}`);
    console.log(`Missing: ${missing}`);
    console.log(`Extra: ${extra}`);
    console.log(`Relationship status: ${relStatus}`);
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}\n`);
  }

  console.log(`Migration Status: ${allPass ? 'PASS' : 'NEEDS ATTENTION'}`);
  process.exit(0);
}

verify().catch(console.error);
