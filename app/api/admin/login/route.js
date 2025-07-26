import { NextResponse } from 'next/server';
import Admin from '../../../../models/Admin.js';
import dbConnect from '../../../../lib/dbConnect.js';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid admin email" 
      }, { status: 401 });
    }
    
    if (password !== admin.password) {
      return NextResponse.json({ 
        success: false, 
        message: "Incorrect password" 
      }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        email: admin.email,
        role: admin.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' } // 1 week expiration
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        _id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        profilePhoto: admin.profilePhoto
      }
    });

    // Set session cookie with 1-week expiration
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed'
    }, { status: 500 });
  }
} 