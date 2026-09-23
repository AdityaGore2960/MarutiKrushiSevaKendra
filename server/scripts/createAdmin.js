require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Admin details
    const email = process.env.ADMIN_EMAIL || 'admin@marutikrushiseva.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists.`);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Super Admin',
      email: email,
      phone: '9999999999', // Provide a valid Indian phone number
      password: password, // Pre-save hook in User model will hash this automatically
      role: 'ADMIN'
    });

    console.log(`Admin user created successfully!`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`); // Only logging this for setup purposes
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
