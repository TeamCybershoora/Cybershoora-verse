import connectDB from '@/lib/dbConnect';
import Student from '@/models/student';
import { getNextStudentCode } from '@/lib/getNextStudentCode';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const studentCode = await getNextStudentCode();
    const student = await Student.create({
      ...body,
      studentCode,
      profileImage: ''
    });

    return new Response(JSON.stringify({ success: true, student }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[REGISTER_ERROR]', err);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}