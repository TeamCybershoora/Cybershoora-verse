import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect.js';
import Teacher from '../../../../models/Teacher.js';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    // Find and update teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedTeacher) {
      return NextResponse.json({
        success: false,
        message: 'Teacher not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Teacher updated successfully',
      teacher: updatedTeacher
    });
    
  } catch (error) {
    console.error('❌ Teacher update error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update teacher'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Find and delete teacher
    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    
    if (!deletedTeacher) {
      return NextResponse.json({
        success: false,
        message: 'Teacher not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Teacher deletion error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete teacher'
    }, { status: 500 });
  }
} 