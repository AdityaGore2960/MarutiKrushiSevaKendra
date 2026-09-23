require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = require('../config/db');

const defaultCategories = [
  { name: 'Fertilizers', slug: 'fertilizers', description: 'Nutrient-rich products to improve soil fertility and boost crop yield.' },
  { name: 'Insecticides', slug: 'insecticides', description: 'Products to control and eliminate harmful insects affecting crops.' },
  { name: 'Fungicides', slug: 'fungicides', description: 'Products to prevent and treat fungal diseases in crops.' },
  { name: 'Herbicides', slug: 'herbicides', description: 'Products to control unwanted weeds competing with crops.' },
  { name: 'Micronutrients', slug: 'micronutrients', description: 'Essential trace elements for healthy plant growth and development.' },
  { name: 'Other', slug: 'other', description: 'Other agricultural products and supplements.' },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    await User.deleteMany({ role: 'ADMIN' });
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data.');

    // Create admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@marutikrushiseva.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    const admin = await User.create({
      name: 'Store Admin',
      email: adminEmail,
      phone: '9999999999',
      password: adminPassword,
      role: 'ADMIN'
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create categories
    const categories = await Category.insertMany(defaultCategories);
    console.log(`✅ Created ${categories.length} categories.`);

    // Map category names to IDs
    const catMap = {};
    categories.forEach((c) => { catMap[c.name] = c._id; });

    // Sample products (clearly marked as samples, no fake dosage info)
    const sampleProducts = [
      {
        name: '10:26:26 NPK Fertilizer',
        category: catMap['Fertilizers'],
        description: 'A balanced NPK fertilizer suitable for various crops. Provides nitrogen, phosphorus, and potassium for healthy plant growth. Always follow the product label for correct application rates.',
        suitableCrops: ['Cotton', 'Soybean', 'Wheat', 'Sugarcane'],
        purpose: 'Provides essential macro-nutrients (N, P, K) for healthy crop growth.',
        composition: 'Nitrogen (N): 10%, Phosphorus (P₂O₅): 26%, Potassium (K₂O): 26%',
        activeIngredient: '',
        targetProblem: 'Nutrient deficiency in soil',
        packSizes: ['1 kg', '5 kg', '10 kg', '50 kg'],
        manufacturer: 'IFFCO',
        available: true,
        imageUrl: '',
        cloudinaryPublicId: '',
      },
      {
        name: 'Imidacloprid 17.8% SL',
        category: catMap['Insecticides'],
        description: '[SAMPLE PRODUCT] A systemic insecticide for controlling sucking pests. Refer to official product label for dosage, safety precautions, and application instructions. Do not apply based on this description alone.',
        suitableCrops: ['Cotton', 'Rice', 'Vegetables'],
        purpose: 'Controls sucking pests such as aphids, whiteflies, and thrips.',
        composition: 'Imidacloprid 17.8% SL',
        activeIngredient: 'Imidacloprid 17.8%',
        targetProblem: 'Aphids, Whiteflies, Jassids, Thrips',
        packSizes: ['100 ml', '250 ml', '500 ml', '1 L'],
        manufacturer: 'Bayer CropScience',
        available: true,
        imageUrl: '',
        cloudinaryPublicId: '',
      },
      {
        name: 'Mancozeb 75% WP Fungicide',
        category: catMap['Fungicides'],
        description: '[SAMPLE PRODUCT] A broad-spectrum fungicide for controlling various fungal diseases. Refer to official product label for dosage and safety instructions.',
        suitableCrops: ['Tomato', 'Potato', 'Onion', 'Grapes'],
        purpose: 'Controls early blight, late blight, downy mildew, and other fungal diseases.',
        composition: 'Mancozeb 75% WP',
        activeIngredient: 'Mancozeb 75%',
        targetProblem: 'Early blight, Late blight, Downy mildew, Leaf spot',
        packSizes: ['100 g', '250 g', '500 g', '1 kg'],
        manufacturer: 'UPL Limited',
        available: true,
        imageUrl: '',
        cloudinaryPublicId: '',
      },
      {
        name: 'Glyphosate 41% SL Herbicide',
        category: catMap['Herbicides'],
        description: '[SAMPLE PRODUCT] A non-selective systemic herbicide. Use strictly as per product label. Avoid contact with crop plants. Follow all safety and disposal instructions on the label.',
        suitableCrops: ['Orchards', 'Non-crop areas', 'Pre-planting'],
        purpose: 'Controls a wide range of annual and perennial weeds.',
        composition: 'Glyphosate 41% SL (Isopropylamine salt)',
        activeIngredient: 'Glyphosate 41%',
        targetProblem: 'Annual and perennial weeds, grasses',
        packSizes: ['250 ml', '500 ml', '1 L', '5 L'],
        manufacturer: 'Monsanto India',
        available: true,
        imageUrl: '',
        cloudinaryPublicId: '',
      },
      {
        name: 'Boron 20% Micronutrient',
        category: catMap['Micronutrients'],
        description: 'A micronutrient supplement providing boron for plant development. Boron is essential for cell wall formation, pollination, and fruit setting. Follow label instructions for application rate.',
        suitableCrops: ['Cotton', 'Sunflower', 'Vegetables', 'Fruits'],
        purpose: 'Corrects boron deficiency. Improves flowering, fruit set, and seed development.',
        composition: 'Boron 20% (as Sodium Tetraborate)',
        activeIngredient: '',
        targetProblem: 'Boron deficiency, Poor flowering, Poor fruit set',
        packSizes: ['250 g', '500 g', '1 kg'],
        manufacturer: 'Multiplex',
        available: true,
        imageUrl: '',
        cloudinaryPublicId: '',
      },
    ];

    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${products.length} sample products.`);

    console.log('\n🎉 Seeding complete!');
    console.log('─'.repeat(50));
    console.log(`Admin Email: ${adminEmail}`);
    console.log(`Admin Password: ${adminPassword}`);
    console.log('─'.repeat(50));
    console.log('⚠️  IMPORTANT: Change these credentials in production!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
