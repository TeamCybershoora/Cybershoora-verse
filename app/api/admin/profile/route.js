import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect.js';
import Admin from '../../../../models/Admin.js';
import Student from '../../../../models/Student.js';
import Teacher from '../../../../models/Teacher.js';
import Course from '../../../../models/Course.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const students = searchParams.get('students');
    const teachers = searchParams.get('teachers');
    const stats = searchParams.get('stats');
    
    await connectDB();
    
    if (students) {
      // Return students data
      const studentsData = await Student.find({}).lean();
      return NextResponse.json({
        success: true,
        students: studentsData
      });
    }
    
    if (teachers) {
      // Return teachers data
      const teachersData = await Teacher.find({}).lean();
      return NextResponse.json({
        success: true,
        teachers: teachersData
      });
    }
    
    if (stats) {
      // Return stats data
      const studentCount = await Student.countDocuments();
      const teacherCount = await Teacher.countDocuments();
      const courseCount = await Course.countDocuments();
      
      return NextResponse.json({
        success: true,
        studentCount: studentCount,
        teacherCount: teacherCount,
        courseCount: courseCount
      });
    }
    
    // Return admin profile data
    return NextResponse.json({
      success: true,
      admin: {
        id: 'admin-123',
        email: 'cybershoora@gmail.com',
        name: 'Super Admin'
      }
    });
    
  } catch (error) {
    console.error('❌ Admin Profile API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
} 