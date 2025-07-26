import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import { sendWhatsAppOtp } from '@/lib/whatsappSender';

export async function POST(request) {
  try {
    await connectDB();
    
    const { mobile, userType } = await request.json();
    
    if (!mobile || !userType) {
      return NextResponse.json({ 
        success: false, 
        message: 'Mobile number and user type are required' 
      }, { status: 400 });
    }

    let user;
    
    if (userType === 'student') {
      user = await Student.findOne({ phone: mobile });
    } else if (userType === 'teacher') {
      user = await Teacher.findOne({ phone: mobile });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid user type' 
      }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found with this mobile number' 
      }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in user document with expiry (10 minutes)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    if (userType === 'student') {
      await Student.findByIdAndUpdate(user._id, {
        resetOtp: otp,
        resetOtpExpiry: otpExpiry
      });
    } else {
      await Teacher.findByIdAndUpdate(user._id, {
        resetOtp: otp,
        resetOtpExpiry: otpExpiry
      });
    }

    // Send OTP via WhatsApp
    const message = `🔐 Shooraverse Password Reset OTP\n\nYour OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this, please ignore this message.`;
    
    await sendWhatsAppOtp(mobile, message);

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to your mobile number successfully',
      otp: otp // Always show OTP for testing
    });

  } catch (error) {
    console.error('Error in mobile OTP:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 