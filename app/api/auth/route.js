import { NextResponse } from 'next/server';
import connectDB from '../../../lib/dbConnect.js';
import Admin from '../../../models/Admin.js';
import Student from '../../../models/Student.js';
import Teacher from '../../../models/Teacher.js';
import { signJwt, verifyJwt } from '../../../lib/jwt.js';

// User type configurations for authentication
const AUTH_CONFIGS = {
  admin: {
    model: Admin,
    cookieName: 'admin_auth',
    tokenExpiry: 60 * 24 * 60 * 60, // 60 days
    redirectPath: '/admin/dashboard'
  },
  student: {
    model: Student,
    cookieName: 'shoora_auth',
    tokenExpiry: 60 * 24 * 60 * 60, // 60 days
    redirectPath: '/student-dashboard'
  },
  teacher: {
    model: Teacher,
    cookieName: 'shoora_auth',
    tokenExpiry: 60 * 24 * 60 * 60, // 60 days
    redirectPath: '/teacher-dashboard'
  }
};

// OTP store (in production, use Redis or database)
const otpStore = global._otpStore = global._otpStore || {};

// Login endpoint
export async function POST(request) {
  try {
    console.log('🔐 Authentication API called');
    
    const body = await request.json();
    const { email, password, userType } = body;
    
    console.log('📝 Login request:', { email, userType, hasPassword: !!password });
    
    if (!email || !password || !userType) {
      console.log('❌ Missing required fields');
      return NextResponse.json({ 
        success: false, 
        message: 'Email, password, and user type are required' 
      }, { status: 400 });
    }
    
    if (!AUTH_CONFIGS[userType]) {
      console.log('❌ Invalid user type');
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid user type' 
      }, { status: 400 });
    }
    
    await connectDB();
    console.log('✅ Database connected');
    
    const config = AUTH_CONFIGS[userType];
    
    // Find user by email
    const user = await config.model.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Check if user is disabled (for teachers)
    if (userType === 'teacher' && user.isDisabled) {
      console.log('❌ Teacher account is disabled');
      return NextResponse.json({ 
        success: false, 
        message: 'Account is disabled. Please contact administrator.' 
      }, { status: 403 });
    }
    
    // Check password
    if (user.password !== password) {
      console.log('❌ Invalid password');
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    console.log('✅ Login successful:', { 
      id: user._id, 
      email: user.email,
      userType 
    });
    
    // Generate JWT token
    const token = signJwt({ 
      id: user._id, 
      email: user.email,
      role: userType 
    });
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName || user.name,
        type: userType
      },
      redirectPath: config.redirectPath
    });
    
    // Set authentication cookie
    response.cookies.set(config.cookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: config.tokenExpiry,
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    });
    
    console.log('✅ Authentication cookie set');
    return response;
    
  } catch (error) {
    console.error('❌ Authentication API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// Logout endpoint
export async function DELETE(request) {
  try {
    console.log('🚪 Logout API called');
    
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('type') || 'student';
    
    if (!AUTH_CONFIGS[userType]) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid user type' 
      }, { status: 400 });
    }
    
    const config = AUTH_CONFIGS[userType];
    
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear authentication cookie
    response.cookies.set(config.cookieName, '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });
    
    // Clear OTP cookie if exists
    response.cookies.set('shoora_otp_user', '', {
      path: '/',
      expires: new Date(0),
    });
    
    console.log('✅ Logout successful');
    return response;
    
  } catch (error) {
    console.error('❌ Logout API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// Verify JWT token endpoint
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('type') || 'student';
    
    if (!AUTH_CONFIGS[userType]) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid user type' 
      }, { status: 400 });
    }
    
    const config = AUTH_CONFIGS[userType];
    
    // Get token from cookie
    const token = request.cookies.get(config.cookieName)?.value;
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'No authentication token found'
      }, { status: 401 });
    }
    
    // Verify token
    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token'
      }, { status: 401 });
    }
    
    // Check if user still exists
    await connectDB();
    const user = await config.model.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName || user.name,
        type: userType
      }
    });
    
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
} 