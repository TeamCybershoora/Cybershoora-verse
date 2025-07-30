import { NextResponse } from 'next/server';
import connectDB from '../../../lib/dbConnect.js';
import Student from '../../../models/Student.js';
import Teacher from '../../../models/Teacher.js';

// User type configurations
const USER_CONFIGS = {
  student: {
    model: Student,
    fields: ['fullName', 'email', 'phone', 'dob', 'guardianName', 'guardianPhone', 'annualIncome', 'address', 'qualification', 'schoolName', 'customSchool', 'collegeName', 'customCollege', 'year', 'course', 'class', 'password', 'profilePhoto', 'faceVerified', 'idCardNumber', 'status'],
    requiredFields: ['fullName', 'email', 'phone', 'password']
  },
  teacher: {
    model: Teacher,
    fields: ['fullName', 'email', 'phone', 'subject', 'experience', 'qualification', 'course', 'college', 'github', 'linkedin', 'otherLink', 'password', 'profilePhoto', 'status', 'isDisabled', 'verifiedFaceImage', 'teacherCode'],
    requiredFields: ['fullName', 'email', 'phone', 'password']
  }
};

// Validation helper
function validateUserData(data, userType) {
  const config = USER_CONFIGS[userType];
  const missingFields = config.requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      isValid: false,
      message: 'Invalid email format'
    };
  }
  
  // Phone validation (basic)
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
    return {
      isValid: false,
      message: 'Invalid phone number format'
    };
  }
  
  return { isValid: true };
}

// GET - List users or get user by ID
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('type'); // 'student' or 'teacher'
    const userId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;
    
    if (!userType || !USER_CONFIGS[userType]) {
      return NextResponse.json({
        success: false,
        message: 'Valid user type (student/teacher) is required'
      }, { status: 400 });
    }
    
    const config = USER_CONFIGS[userType];
    
    if (userId) {
      // Get specific user
      const user = await config.model.findById(userId).select('-password');
      
      if (!user) {
        return NextResponse.json({
          success: false,
          message: `${userType} not found`
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        user
      });
    } else {
      // List users with pagination
      const users = await config.model.find({})
        .select('-password')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .lean();
      
      const total = await config.model.countDocuments();
      
      return NextResponse.json({
        success: true,
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Users GET API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// POST - Create new user
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userType, ...userData } = body;
    
    if (!userType || !USER_CONFIGS[userType]) {
      return NextResponse.json({
        success: false,
        message: 'Valid user type (student/teacher) is required'
      }, { status: 400 });
    }
    
    // Validate user data
    const validation = validateUserData(userData, userType);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: validation.message
      }, { status: 400 });
    }
    
    const config = USER_CONFIGS[userType];
    
    // Check if email already exists
    const existingUser = await config.model.findOne({ 
      email: userData.email.toLowerCase() 
    });
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Email already registered'
      }, { status: 409 });
    }
    
    // Create user
    const user = await config.model.create({
      ...userData,
      email: userData.email.toLowerCase()
    });
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return NextResponse.json({
      success: true,
      message: `${userType} created successfully`,
      user: userResponse
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Users POST API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const userType = searchParams.get('type');
    
    if (!userId || !userType || !USER_CONFIGS[userType]) {
      return NextResponse.json({
        success: false,
        message: 'User ID and valid user type are required'
      }, { status: 400 });
    }
    
    const body = await request.json();
    const config = USER_CONFIGS[userType];
    
    // Check if user exists
    const existingUser = await config.model.findById(userId);
    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: `${userType} not found`
      }, { status: 404 });
    }
    
    // If email is being updated, check for duplicates
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await config.model.findOne({ 
        email: body.email.toLowerCase(),
        _id: { $ne: userId }
      });
      
      if (emailExists) {
        return NextResponse.json({
          success: false,
          message: 'Email already registered'
        }, { status: 409 });
      }
    }
    
    // Update user
    const updatedUser = await config.model.findByIdAndUpdate(
      userId,
      { 
        ...body,
        ...(body.email && { email: body.email.toLowerCase() })
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    return NextResponse.json({
      success: true,
      message: `${userType} updated successfully`,
      user: updatedUser
    });
    
  } catch (error) {
    console.error('❌ Users PUT API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const userType = searchParams.get('type');
    
    if (!userId || !userType || !USER_CONFIGS[userType]) {
      return NextResponse.json({
        success: false,
        message: 'User ID and valid user type are required'
      }, { status: 400 });
    }
    
    const config = USER_CONFIGS[userType];
    
    // Check if user exists
    const existingUser = await config.model.findById(userId);
    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: `${userType} not found`
      }, { status: 404 });
    }
    
    // Delete user
    await config.model.findByIdAndDelete(userId);
    
    return NextResponse.json({
      success: true,
      message: `${userType} deleted successfully`
    });
    
  } catch (error) {
    console.error('❌ Users DELETE API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
} 