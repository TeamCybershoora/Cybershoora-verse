import 'dotenv/config';
import mongoose from 'mongoose';
import Student from './models/Student.js';
import dbConnect from './lib/dbConnect.js';

async function testStudents() {
  try {
    await dbConnect();
    console.log('✅ Connected to database');

    // Check if students exist
    const studentCount = await Student.countDocuments();
    console.log(`📊 Total students in database: ${studentCount}`);

    if (studentCount === 0) {
      console.log('⚠️  No students found. Creating sample students...');
      
      // Create sample students
      const sampleStudents = [
        {
          fullName: 'Rahul Kumar',
          email: 'rahul@example.com',
          phone: '9876543210',
          guardianName: 'Rajesh Kumar',
          guardianPhone: '9876543211',
          course: 'Web Development',
          class: '12th',
          collegeName: 'Delhi University',
          studentId: 'STU001',
          idCardNumber: 'ID001',
          status: 'enrolled'
        },
        {
          fullName: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '9876543212',
          guardianName: 'Sunil Sharma',
          guardianPhone: '9876543213',
          course: 'Python Programming',
          class: '11th',
          schoolName: 'Kendriya Vidyalaya',
          studentId: 'STU002',
          idCardNumber: 'ID002',
          status: 'trial'
        },
        {
          fullName: 'Amit Patel',
          email: 'amit@example.com',
          phone: '9876543214',
          guardianName: 'Ramesh Patel',
          guardianPhone: '9876543215',
          course: 'Data Science',
          class: 'Graduate',
          collegeName: 'Mumbai University',
          studentId: 'STU003',
          idCardNumber: 'ID003',
          status: 'enrolled'
        }
      ];

      await Student.insertMany(sampleStudents);
      console.log('✅ Sample students created successfully!');
      
      // Show the created students
      const newStudents = await Student.find().sort({ createdAt: -1 });
      console.log('📋 Created students:');
      newStudents.forEach((student, index) => {
        console.log(`${index + 1}. ${student.fullName} - ${student.course} - ${student.studentId}`);
      });
    } else {
      // Show existing students
      const students = await Student.find().sort({ createdAt: -1 }).limit(5);
      console.log('📋 Recent students:');
      students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.fullName} - ${student.course} - ${student.studentId}`);
      });
    }

    mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
}

testStudents(); 