import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  dob: String,
  guardianName: String,
  guardianPhone: String,
  annualIncome: String,
  address: String,
  qualification: String,
  schoolName: String,
  customSchool: String,
  collegeName: String,
  customCollege: String,
  year: String,
  course: String,
  class: String,
  password: String,
  
  // Student ID generated automatically
  studentId: { type: String, unique: true },
  
  // Profile photo URL - stores the path to uploaded image
  profilePhoto: { 
    type: String, 
    default: '' 
  },
  
  // Face verification status
  faceVerified: { 
    type: Boolean, 
    default: false 
  },
  
  // ID card number
  idCardNumber: { type: String },
  
  // Student status
  status: { 
    type: String, 
    default: 'trial' 
  }, // 'trial' | 'enrolled'
  
  // Password reset fields
  resetOtp: { type: String },
  resetOtpExpiry: { type: Date },
  
}, {
  timestamps: true,
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
