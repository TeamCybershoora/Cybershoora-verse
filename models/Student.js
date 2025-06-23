import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
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
  studentCode: String, // ✅ Unique readable ID
  profileImage: String, // base64
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', studentSchema);

