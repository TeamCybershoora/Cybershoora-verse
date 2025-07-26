import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/models/Teacher';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Teacher ID is required' 
      }, { status: 400 });
    }

    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return NextResponse.json({ 
        success: false, 
        message: 'Teacher not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      teacher: teacher
    });

  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 