import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  subject: String,
  experience: String,
  qualification: String,
  course: String,
  college: String,
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  otherLink: { type: String, default: '' },
  password: String,
  profilePhoto: String,
  status: { type: String, default: 'pending' }, // e.g. 'pending', 'approved'
  verifiedFaceImage: { type: String, default: '' },
  teacherCode: { type: String, unique: true },
  
  // Password reset fields
  resetOtp: { type: String },
  resetOtpExpiry: { type: Date },
}, {
  timestamps: true,
});

export default mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
