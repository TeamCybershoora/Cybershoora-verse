import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect.js';
import Student from '../../../../models/Student.js';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    // Find and update student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedStudent) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      student: updatedStudent
    });
    
  } catch (error) {
    console.error('❌ Student update error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update student'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Find and delete student
    const deletedStudent = await Student.findByIdAndDelete(id);
    
    if (!deletedStudent) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Student deletion error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete student'
    }, { status: 500 });
  }
} 