import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dbConnect from '../lib/dbConnect.js';

async function seedSuperAdmin() {
  await dbConnect();
  const email = process.env.SUPERADMIN_EMAIL || 'cybershoora@gmail.com';
  const password = process.env.SUPERADMIN_PASSWORD || '9870691784@maa';
  const role = 'superadmin';
  const fullName = process.env.SUPERADMIN_NAME || 'Shoora Superadmin';
  const profilePhoto = process.env.SUPERADMIN_PHOTO || '/uploads/admins/default-superadmin.png';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Super admin already exists.');
    mongoose.connection.close();
    return;
  }

  await Admin.create({ email, password, role, fullName, profilePhoto });
  console.log('Super admin created!');
  mongoose.connection.close();
}

seedSuperAdmin(); 