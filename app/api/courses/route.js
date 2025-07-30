import { NextResponse } from 'next/server';
import connectDB from '../../../lib/dbConnect.js';
import Course from '../../../models/Course.js';

export async function GET() {
  try {
    await connectDB();
    
    const courses = await Course.find({}).limit(6).lean();
    
    return NextResponse.json(courses);
    
  } catch (error) {
    console.error('❌ Courses API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    
    // Extract course data
    const courseData = {
      title: formData.get('title') || '',
      duration: formData.get('duration') || '',
      languages: formData.get('languages') || '',
      originalPrice: formData.get('originalPrice') || '',
      currentPrice: formData.get('currentPrice') || '',
      discount: formData.get('discount') || '',
      details: formData.get('details') || '',
      teacherName: formData.get('teacherName') || '',
      technologies: formData.get('technologies') ? formData.get('technologies').split(',') : []
    };
    
    // Handle image upload
    const imageFile = formData.get('image');
    if (imageFile instanceof File) {
      // Upload to Cloudinary
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const os = require('os');
      const path = require('path');
      const tempFilePath = path.join(os.tmpdir(), imageFile.name);
      require('fs').writeFileSync(tempFilePath, buffer);
      
      try {
        const { uploadToCloudinary } = await import('../../../lib/cloudinary.js');
                 const uploadedUrl = await uploadToCloudinary(
           tempFilePath,
           'cybershoora_courses/courses-image',
           'cybershoora_courses'
         );
        courseData.image = uploadedUrl;
        
        // Clean up temp file
        require('fs').unlinkSync(tempFilePath);
      } catch (uploadError) {
        console.error('❌ Course image upload failed:', uploadError);
        return NextResponse.json({
          success: false,
          message: 'Failed to upload course image'
        }, { status: 500 });
      }
    } else if (typeof imageFile === 'string' && imageFile.trim()) {
      courseData.image = imageFile.trim();
    }
    
    // Create course
    const course = await Course.create(courseData);
    
    return NextResponse.json({
      success: true,
      message: 'Course added successfully',
      course: course
    });
    
  } catch (error) {
    console.error('❌ Course creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create course'
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');
    
    if (!courseId) {
      return NextResponse.json({
        success: false,
        message: 'Course ID is required'
      }, { status: 400 });
    }
    
    // Get existing course to check old image
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return NextResponse.json({
        success: false,
        message: 'Course not found'
      }, { status: 404 });
    }
    
    const formData = await request.formData();
    
    // Extract course data
    const courseData = {
      title: formData.get('title') || '',
      duration: formData.get('duration') || '',
      languages: formData.get('languages') || '',
      originalPrice: formData.get('originalPrice') || '',
      currentPrice: formData.get('currentPrice') || '',
      discount: formData.get('discount') || '',
      details: formData.get('details') || '',
      teacherName: formData.get('teacherName') || '',
      technologies: formData.get('technologies') ? formData.get('technologies').split(',') : []
    };
    
    // Handle image upload
    const imageFile = formData.get('image');
    if (imageFile instanceof File) {
      // Delete old image from Cloudinary if it exists
      if (existingCourse.image && existingCourse.image.includes('cloudinary.com')) {
        try {
          const { deleteFromCloudinary } = await import('../../../lib/cloudinary.js');
          await deleteFromCloudinary(existingCourse.image);
        } catch (deleteError) {
          console.error('❌ Failed to delete old course image from Cloudinary:', deleteError);
        }
      }
      
      // Upload new image to Cloudinary
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const os = require('os');
      const path = require('path');
      const tempFilePath = path.join(os.tmpdir(), imageFile.name);
      require('fs').writeFileSync(tempFilePath, buffer);
      
      try {
        const { uploadToCloudinary } = await import('../../../lib/cloudinary.js');
        const uploadedUrl = await uploadToCloudinary(
          tempFilePath,
          'cybershoora_courses/courses-image',
          'cybershoora_courses'
        );
        courseData.image = uploadedUrl;
        
        // Clean up temp file
        require('fs').unlinkSync(tempFilePath);
      } catch (uploadError) {
        console.error('❌ Course image upload failed:', uploadError);
        return NextResponse.json({
          success: false,
          message: 'Failed to upload course image'
        }, { status: 500 });
      }
    } else if (typeof imageFile === 'string' && imageFile.trim()) {
      courseData.image = imageFile.trim();
    }
    
    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(courseId, courseData, { new: true });
    
    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
    
  } catch (error) {
    console.error('❌ Course update error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update course'
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');
    
    if (!courseId) {
      return NextResponse.json({
        success: false,
        message: 'Course ID is required'
      }, { status: 400 });
    }
    
    // Get course before deleting to get image URL
    const courseToDelete = await Course.findById(courseId);
    
    if (!courseToDelete) {
      return NextResponse.json({
        success: false,
        message: 'Course not found'
      }, { status: 404 });
    }
    
    // Delete course from database
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    
    // Delete image from Cloudinary if it exists
    if (courseToDelete.image && courseToDelete.image.includes('cloudinary.com')) {
      try {
        const { deleteFromCloudinary } = await import('../../../lib/cloudinary.js');
        await deleteFromCloudinary(courseToDelete.image);
      } catch (deleteError) {
        console.error('❌ Failed to delete course image from Cloudinary:', deleteError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Course deletion error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete course'
    }, { status: 500 });
  }
} 