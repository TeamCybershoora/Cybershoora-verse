import connectDB from '@/lib/dbConnect';
import Student from '@/models/Student';

export async function POST(req) {
  try {
    await connectDB();
    const { studentId, imageBase64 } = await req.json();

    if (!studentId || !imageBase64) {
      return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
    }

    const updated = await Student.findByIdAndUpdate(studentId, {
      profileImage: imageBase64,
    });

    if (!updated) {
      return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('[UPLOAD_PROFILE_ERROR]', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}