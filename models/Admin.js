import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  fullName: { type: String, default: '' },
}, {
  timestamps: true,
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema); 