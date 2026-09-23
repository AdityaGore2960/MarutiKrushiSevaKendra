require('dotenv').config();
const mongoose = require('mongoose');
const { db } = require('../config/firebase');

// Collections to migrate
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

async function migrate() {
  try {
    // 2. Connect to MongoDB using standard URI to bypass SRV resolution errors
    console.log('🔌 Connecting to MongoDB...');
    const resolvedUri = 'mongodb://Maruti123:maruti123@ac-cwnqa57-shard-00-00.8rr6uea.mongodb.net:27017,ac-cwnqa57-shard-00-01.8rr6uea.mongodb.net:27017,ac-cwnqa57-shard-00-02.8rr6uea.mongodb.net:27017/maruti-krushiseva?ssl=true&replicaSet=atlas-moy1pd-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1';
    await mongoose.connect(resolvedUri);
    console.log('✅ MongoDB connected successfully');

    for (const collName of collections) {
      console.log(`\n⏳ Migrating collection: ${collName}...`);
      
      const coll = mongoose.connection.collection(collName);
      const docs = await coll.find({}).toArray();
      
      console.log(`Found ${docs.length} documents in MongoDB.`);

      let migratedCount = 0;
      let failedCount = 0;

      for (const doc of docs) {
        try {
          const docId = doc._id.toString();
          
          // Clean MongoDB-specific object fields before pushing to Firestore
          const firestoreDoc = { ...doc };
          delete firestoreDoc._id;
          delete firestoreDoc.__v;

          // Recursively convert ObjectIds and Dates
          const cleanData = JSON.parse(JSON.stringify(firestoreDoc), (key, value) => {
            // Mongoose ObjectId is exported as a string by stringify natively if not handled, 
            // but dates get converted to ISO strings. Let's fix that below.
            return value;
          });

          // Recover true dates (JSON stringify turns them into strings)
          const fixDates = (obj) => {
            for (let k in obj) {
              if (obj[k] !== null && typeof obj[k] === 'object') {
                fixDates(obj[k]);
              } else if (typeof obj[k] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(obj[k])) {
                obj[k] = new Date(obj[k]);
              }
            }
          };
          fixDates(cleanData);

          // Write to Firestore with merge: true (idempotent, won't duplicate)
          const ref = db.collection(collName).doc(docId);
          await ref.set(cleanData, { merge: true });
          
          migratedCount++;
        } catch (err) {
          console.error(`❌ Failed to migrate document ${doc._id}: ${err.message}`);
          failedCount++;
        }
      }

      console.log(`✅ [${collName}] Migrated: ${migratedCount} | Failed: ${failedCount}`);
      
      // Verification Step
      const fsSnap = await db.collection(collName).get();
      console.log(`🔍 Verification [${collName}]: MongoDB = ${docs.length} vs Firestore = ${fsSnap.size}`);
    }

    console.log('\n🎉 MIGRATION COMPLETE! 🎉');
    process.exit(0);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
