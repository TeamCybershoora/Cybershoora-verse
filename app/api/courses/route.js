import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Course from '@/models/Course';
import path from 'path';
import fs from 'fs';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({ status: 'active' }).sort({ createdAt: -1 });
    // Transform database courses to match the expected format
    const formattedCourses = courses.map(course => ({
      _id: course._id, // Ensure _id is included
      image: course.image,
      badge: course.badge,
      title: course.title,
      duration: course.duration,
      languages: course.languages,
      originalPrice: course.originalPrice,
      currentPrice: course.currentPrice,
      discount: course.discount,
      link: course.link,
      details: course.details,
      technologies: course.technologies, // Add technologies to API response
      teacherName: course.teacherName, // Add teacher name
      createdAt: course.createdAt, // Add creation timestamp
      updatedAt: course.updatedAt, // Add update timestamp
      status: course.status // Add status
    }));
    
    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    let imageUrl = '';
    const imageField = formData.get('image');
    if (imageField && typeof imageField === 'object' && imageField.name) {
      // It's a File object
      const buffer = Buffer.from(await imageField.arrayBuffer());
      const tempFilePath = path.join(process.cwd(), 'tmp', `${Date.now()}_${imageField.name}`);
      if (!fs.existsSync(path.dirname(tempFilePath))) fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
      fs.writeFileSync(tempFilePath, buffer);
      imageUrl = await uploadToCloudinary(tempFilePath, 'courses');
      fs.unlinkSync(tempFilePath);
    } else if (typeof imageField === 'string') {
      // It's a direct URL
      imageUrl = imageField;
    }

    let technologies = formData.get('technologies');
    if (typeof technologies === 'string') {
      technologies = technologies.split(',').map(t => t.trim()).filter(Boolean);
    }

    const courseData = {
      title: formData.get('title'),
      duration: formData.get('duration'),
      languages: formData.get('languages') || '',
      originalPrice: formData.get('originalPrice'),
      currentPrice: formData.get('currentPrice'),
      discount: formData.get('discount'),
      details: formData.get('details') || '',
      image: imageUrl,
      badge: formData.get('badge') || 'INSTITUTE',
      link: formData.get('link') || '#',
      status: 'active',
      technologies // always array
    };
    // Add teacherName if present
    const teacherName = formData.get('teacherName');
    if (teacherName) {
      courseData.teacherName = teacherName;
    }

    const course = new Course(courseData);
    await course.save();

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 

export async function PATCH(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Course id is required' }, { status: 400 });
    }

    const formData = await req.formData();
    
    // Handle image upload
    let imageUrl = '';
    const imageField = formData.get('image');
    if (imageField && typeof imageField === 'object' && imageField.name) {
      // It's a File object
      const buffer = Buffer.from(await imageField.arrayBuffer());
      const tempFilePath = path.join(process.cwd(), 'tmp', `${Date.now()}_${imageField.name}`);
      if (!fs.existsSync(path.dirname(tempFilePath))) fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
      fs.writeFileSync(tempFilePath, buffer);
      imageUrl = await uploadToCloudinary(tempFilePath, 'courses');
      fs.unlinkSync(tempFilePath);
    } else if (typeof imageField === 'string') {
      // It's a direct URL
      imageUrl = imageField;
    }

    // Handle technologies
    let technologies = formData.get('technologies');
    if (typeof technologies === 'string') {
      technologies = technologies.split(',').map(t => t.trim()).filter(Boolean);
    }

    // Prepare update data
    const updateData = {
      title: formData.get('title'),
      duration: formData.get('duration'),
      languages: formData.get('languages') || '',
      originalPrice: formData.get('originalPrice'),
      currentPrice: formData.get('currentPrice'),
      discount: formData.get('discount'),
      details: formData.get('details') || '',
      badge: formData.get('badge') || 'INSTITUTE',
      link: formData.get('link') || '#',
      technologies
    };

    // Add image if provided
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // Add teacherName if present
    const teacherName = formData.get('teacherName');
    if (teacherName !== null) {
      updateData.teacherName = teacherName;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Course id is required' }, { status: 400 });
    }
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }
    // Delete image from Cloudinary if it exists
    if (deleted.image && deleted.image.startsWith('http')) {
      try {
        await deleteFromCloudinary(deleted.image);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 