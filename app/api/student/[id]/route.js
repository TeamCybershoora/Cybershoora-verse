import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Student ID is required' 
      }, { status: 400 });
    }

    const student = await Student.findById(id);
    
    if (!student) {
      return NextResponse.json({ 
        success: false, 
        message: 'Student not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      student: student
    });

  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}