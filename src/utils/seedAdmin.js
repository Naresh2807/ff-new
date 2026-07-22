import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (adminExists) {
      console.log('✅ Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Platform Administrator',
      profileImage: '',
    });

    await admin.save();
    console.log('✅ Admin created: admin@gmail.com / admin');
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    // Close connection if we opened it
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdmin();
}

export default seedAdmin;