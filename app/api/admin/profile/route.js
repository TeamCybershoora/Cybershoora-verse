import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/dbConnect';
import { verifyAdminAuth } from '@/lib/adminAuth';
import path from 'path';
import fs from 'fs';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import { GET as getCourses } from '../../courses/route.js';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    await dbConnect();
    
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    const formData = await request.formData();
    const email = formData.get('email');
    const name = formData.get('name');
    const file = formData.get('photo');

    // Only allow the authenticated admin to update their profile
    if (email !== authResult.admin.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    let profilePhoto = null;
    if (file && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const tempFilePath = path.join(process.cwd(), 'tmp', `${Date.now()}_${file.name}`);
      if (!fs.existsSync(path.dirname(tempFilePath))) fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
      fs.writeFileSync(tempFilePath, buffer);
      profilePhoto = await uploadToCloudinary(tempFilePath, 'admins');
      fs.unlinkSync(tempFilePath);
    }

    const update = { fullName: name };
    if (profilePhoto) update.profilePhoto = profilePhoto;

    const admin = await Admin.findOneAndUpdate(
      { email },
      update,
      { new: true }
    );

    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, admin });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Profile update failed' 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    // If query param ?students=1, return student list
    const url = new URL(request.url);
    if (url.searchParams.get('students') === '1') {
      const course = url.searchParams.get('course');
      const filter = course ? { course } : {};
      const studentsRaw = await Student.find(filter, {
        fullName: 1,
        email: 1,
        profilePhoto: 1,
        idCardNumber: 1,
        class: 1,
        course: 1,
        createdAt: 1,
        phone: 1,
        guardianName: 1,
        guardianPhone: 1,
        collegeName: 1,
        customCollege: 1,
        schoolName: 1,
        customSchool: 1
      }).sort({ createdAt: -1 });
      // Fetch all courses for mapping
      const allCourses = await (await getCourses()).json();
      const courseMap = {};
      if (allCourses.success && Array.isArray(allCourses.courses)) {
        for (const c of allCourses.courses) {
          courseMap[c.title] = c.currentPrice;
        }
      }
      // Attach fee to each student
      const students = studentsRaw.map(s => ({
        ...s._doc,
        fee: courseMap[s.course] || '--'
      }));
      return NextResponse.json({ success: true, students });
    }
    
    // If query param ?courses=1, return all available courses
    if (url.searchParams.get('courses') === '1') {
      // Use the courses API route to get all courses
      const res = await getCourses();
      const courses = await res.json();
      // The courses API returns an array directly, so we need to handle both cases
      const coursesArray = Array.isArray(courses) ? courses : (courses.courses || []);
      return NextResponse.json({ success: true, courses: coursesArray });
    }
    
    // If query param ?stats=1, return student/teacher counts
    if (url.searchParams.get('stats') === '1') {
      const studentCount = await Student.countDocuments();
      const teacherCount = await Teacher.countDocuments();
      return NextResponse.json({ success: true, studentCount, teacherCount });
    }
    
    if (url.searchParams.get('teachers') === '1') {
      const teachers = await Teacher.find({}, {
        fullName: 1,
        email: 1,
        profilePhoto: 1,
        subject: 1,
        status: 1,
        teacherCode: 1,
        phone: 1,
        createdAt: 1
      }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, teachers });
    }
    
    // Return the authenticated admin's profile
    return NextResponse.json({ 
      success: true, 
      admin: authResult.admin 
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch profile' 
    }, { status: 500 });
  }
} 