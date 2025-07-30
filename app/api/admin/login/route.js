import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect.js';
import Admin from '../../../../models/Admin.js';

export async function POST(request) {
  try {
    console.log('🔐 Admin Login API called');
    
    const body = await request.json();
    const { email, password } = body;
    
    console.log('📝 Admin login request:', { email, hasPassword: !!password });
    
    if (!email || !password) {
      console.log('❌ Missing required fields');
      return NextResponse.json({ 
        success: false, 
        message: 'Email and password are required' 
      }, { status: 400 });
    }
    
    await connectDB();
    console.log('✅ Database connected');
    
    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      console.log('❌ Admin not found');
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Check password
    if (admin.password !== password) {
      console.log('❌ Invalid password');
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    console.log('✅ Admin login successful:', { 
      id: admin._id, 
      email: admin.email 
    });
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
    
  } catch (error) {
    console.error('❌ Admin Login API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 