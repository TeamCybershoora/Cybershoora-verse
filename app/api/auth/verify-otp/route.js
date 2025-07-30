import { NextResponse } from 'next/server';
import Student from '../../../../models/Student.js';
import Teacher from '../../../../models/Teacher.js';
import connectDB from '../../../../lib/dbConnect.js';
import { signJwt } from '../../../../lib/jwt.js';

const otpStore = global._otpStore = global._otpStore || {};

export async function POST(request) {
  try {
    console.log('🔐 OTP Verification API called');
    
    const body = await request.json();
    const { studentId, teacherId, userId, otp, userType } = body;
    const finalUserId = userId || studentId || teacherId;
    
    console.log('📝 OTP verification request:', { finalUserId, userType, otpLength: otp?.length });

    if (!finalUserId || !otp || !userType) {
      console.log('❌ Missing required fields');
      return NextResponse.json({ 
        success: false, 
        message: 'All fields are required' 
      }, { status: 400 });
    }

    await connectDB();
    console.log('✅ Database connected');
    
    // Check OTP
    const otpData = otpStore[finalUserId];
    if (!otpData) {
      console.log('❌ No OTP found for user:', finalUserId);
      return NextResponse.json({ 
        success: false, 
        message: 'No OTP found. Please login again.' 
      }, { status: 400 });
    }
    
    if (otpData.otp !== otp) {
      console.log('❌ Invalid OTP for user:', finalUserId);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid OTP' 
      }, { status: 401 });
    }
    
    if (Date.now() > otpData.otpExpiry) {
      console.log('❌ OTP expired for user:', finalUserId);
      delete otpStore[finalUserId];
      return NextResponse.json({ 
        success: false, 
        message: 'OTP expired. Please login again.' 
      }, { status: 401 });
    }
    
    console.log('✅ OTP verified successfully for user:', finalUserId);
    
    // OTP valid, clear it
    delete otpStore[finalUserId];
    
    // Set JWT cookie for 60 days
    let role = userType;
    if (userType === 'student') role = 'student';
    if (userType === 'teacher') role = 'teacher';
    
    const token = signJwt({ id: finalUserId, role });
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful' 
    });
    
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
    
    console.log('✅ Login successful, JWT token set for user:', finalUserId);
    return response;
    
  } catch (error) {
    console.error('❌ OTP verification error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 