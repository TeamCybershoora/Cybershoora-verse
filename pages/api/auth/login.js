import connectDB from '@/lib/dbConnect';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import { sendOtpEmail } from '@/lib/emailSender';
import { signJwt } from '@/lib/jwt';

const otpStore = global._otpStore = global._otpStore || {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
  const { emailOrPhone, password, userType } = req.body;
  if (!emailOrPhone || !password || !userType) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  await connectDB();
  let user = null;
  if (userType === 'student') {
    user = await Student.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ],
      password
    });
  } else if (userType === 'teacher') {
    user = await Teacher.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ],
      password
    });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid user type' });
  }
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
  otpStore[user._id] = { otp, otpExpiry, userType };
  // Send OTP to email
  try {
    await sendOtpEmail(user.email, user.fullName, otp);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
  // Set a temp cookie for OTP verification (optional, for demo)
  res.setHeader('Set-Cookie', `shoora_otp_user=${user._id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`);
  return res.status(200).json({
    success: true,
    message: 'OTP sent to your email',
    studentId: userType === 'student' ? user._id : undefined,
    teacherId: userType === 'teacher' ? user._id : undefined
  });
} 