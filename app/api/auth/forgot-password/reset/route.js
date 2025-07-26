import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';

export async function POST(request) {
  try {
    await connectDB();
    
    const { otp, newPassword, userType, method } = await request.json();
    
    if (!otp || !newPassword || !userType || !method) {
      return NextResponse.json({ 
        success: false, 
        message: 'All fields are required' 
      }, { status: 400 });
    }

    let user;
    
    // Find user based on method and userType
    if (method === 'mobile-otp') {
      if (userType === 'student') {
        user = await Student.findOne({ 
          resetOtp: otp,
          resetOtpExpiry: { $gt: new Date() }
        });
      } else {
        user = await Teacher.findOne({ 
          resetOtp: otp,
          resetOtpExpiry: { $gt: new Date() }
        });
      }
    } else if (method === 'email-otp') {
      if (userType === 'student') {
        user = await Student.findOne({ 
          resetOtp: otp,
          resetOtpExpiry: { $gt: new Date() }
        });
      } else {
        user = await Teacher.findOne({ 
          resetOtp: otp,
          resetOtpExpiry: { $gt: new Date() }
        });
      }
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid method' 
      }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid OTP or OTP expired' 
      }, { status: 400 });
    }

    // Update password and clear OTP fields (plain text)
    const updateData = {
      password: newPassword,
      resetOtp: null,
      resetOtpExpiry: null
    };

    if (userType === 'student') {
      await Student.findByIdAndUpdate(user._id, updateData);
    } else {
      await Teacher.findByIdAndUpdate(user._id, updateData);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully' 
    });

  } catch (error) {
    console.error('Error in password reset:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 