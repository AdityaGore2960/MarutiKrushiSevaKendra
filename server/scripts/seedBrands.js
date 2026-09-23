require('dotenv').config({ path: './.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const Brand = require('../models/Brand');

// All brands from the current website products
const BRANDS = [
  { name: 'Syngenta' },
  { name: 'Bayer' },
  { name: 'UPL' },
  { name: 'BASF' },
  { name: 'Mahyco' },
  { name: 'Seminis' },
  { name: 'Adama' },
  { name: 'Dhanuka' },
  { name: 'IFFCO' },
  { name: 'Coromandel' },
  { name: 'Godrej Agrovet' },
  { name: 'Mahindra Agri' },
  { name: 'VNR' },
  { name: 'Sakata' },
  { name: 'Clause' },
  { name: 'Advanta' },
  { name: 'Bioneem' },
  { name: 'Multiplex' },
  { name: 'PI Industries' },
  { name: 'Biostadt' },
  { name: 'Koppert' },
  { name: 'Wolf Garten' },
  { name: 'Honda' },
  { name: 'Stihl' },
  { name: 'Local Nursery' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
    console.log('MongoDB connected\n');

    let added = 0, skipped = 0;

    for (const b of BRANDS) {
      const existing = await Brand.findOne({ name: b.name });
      if (existing) {
        console.log(`  Skipped (already exists): ${b.name}`);
        skipped++;
      } else {
        await Brand.create({ name: b.name, active: true });
        console.log(`  Added: ${b.name}`);
        added++;
      }
    }

    console.log(`\nDone! Added: ${added}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seed();
