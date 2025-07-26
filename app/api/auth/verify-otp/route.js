import { NextResponse } from 'next/server';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/dbConnect';
import { signJwt } from '@/lib/jwt';

const otpStore = global._otpStore = global._otpStore || {};

export async function POST(request) {
  const body = await request.json();
  const { studentId, teacherId, otp, userType } = body;
  const userId = userType === 'student' ? studentId : teacherId;
  if (!userId || !otp || !userType) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }
  await dbConnect();
  // Check OTP
  const otpData = otpStore[userId];
  if (!otpData) {
    return NextResponse.json({ success: false, message: 'No OTP found. Please login again.' }, { status: 400 });
  }
  if (otpData.otp !== otp) {
    return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 401 });
  }
  if (Date.now() > otpData.otpExpiry) {
    delete otpStore[userId];
    return NextResponse.json({ success: false, message: 'OTP expired. Please login again.' }, { status: 401 });
  }
  // OTP valid, clear it
  delete otpStore[userId];
  // Set JWT cookie for 60 days
  let role = userType;
  if (userType === 'student') role = 'student';
  if (userType === 'teacher') role = 'teacher';
  const token = signJwt({ id: userId, role });
  const response = NextResponse.json({ success: true, message: 'Login successful' });
  response.cookies.set('shoora_auth', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 24 * 60 * 60, // 60 days in seconds
    path: '/',
  });
  // Clear temp OTP cookie
  response.cookies.set('shoora_otp_user', '', {
    path: '/',
    expires: new Date(0),
  });
  return response;
} 