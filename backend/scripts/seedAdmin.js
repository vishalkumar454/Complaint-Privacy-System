import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env.config.js';
import { User } from '../src/models/User.model.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@privacyshield.com' });
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    const admin = new User({
      name: 'System Admin',
      email: 'admin@privacyshield.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@privacyshield.com | Password: adminpassword123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
