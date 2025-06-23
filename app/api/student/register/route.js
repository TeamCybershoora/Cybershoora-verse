// app/api/register/route.js
import connectDB from '@/lib/dbConnect';
import Student from '@/models/Student';

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      fullName, email, phone, password, dob,
      guardianName, guardianPhone, annualIncome,
      address, qualification, schoolName, customSchool,
      collegeName, customCollege, course, year,
      class: studentClass  // 🆕 Add this line
    } = body;

    if (!fullName || !email || !phone || !password) {
      return Response.json({ success: false, message: '❌ All fields are required' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await Student.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }]
    });

    if (existingUser) {
      return Response.json({
        success: false,
        message: '⚠️ User already registered with this Email or Phone'
      }, { status: 409 });
    }

    const newStudent = await Student.create({
      name: fullName,
      email: email.toLowerCase(),
      phone,
      password,
      dob,
      guardianName,
      guardianPhone,
      annualIncome,
      address,
      qualification,
      schoolName,
      customSchool,
      collegeName,
      customCollege,
      course,
      year,
      class: studentClass  // 🆕 Add here too
    });

    return Response.json({
      success: true,
      message: '✅ Registration successful',
      student: newStudent
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: '❌ Server error'
    }, { status: 500 });
  }
}
