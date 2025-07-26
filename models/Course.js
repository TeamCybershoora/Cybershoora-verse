import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  languages: { type: String },
  originalPrice: { type: String, required: true },
  currentPrice: { type: String, required: true },
  discount: { type: String },
  details: { type: String },
  technologies: [{ type: String }],
  image: { type: String, required: true }, // Image URL or uploaded file path
  badge: { type: String, default: 'INSTITUTE' },
  link: { type: String, default: '#' },
  status: { type: String, default: 'active' }, // active, inactive
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  teacherName: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema); 