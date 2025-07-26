import dbConnect from '../../../lib/dbConnect';
import Student from '../../../models/Student';
import Teacher from '../../../models/Teacher';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { emailOrPhone, userType } = req.body;
    await dbConnect();

    let exists = false;
    let type = null;
    if (userType === 'student') {
      const emailMatch = await Student.exists({ email: emailOrPhone });
      const phoneMatch = await Student.exists({ phone: emailOrPhone });
      if (emailMatch) {
        exists = true;
        type = 'email';
      } else if (phoneMatch) {
        exists = true;
        type = 'phone';
      }
    } else if (userType === 'teacher') {
      const emailMatch = await Teacher.exists({ email: emailOrPhone });
      const phoneMatch = await Teacher.exists({ phone: emailOrPhone });
      if (emailMatch) {
        exists = true;
        type = 'email';
      } else if (phoneMatch) {
        exists = true;
        type = 'phone';
      }
    }

    res.json({ exists: !!exists, type });
  } catch (err) {
    res.status(500).json({ exists: false, type: null, error: 'Server error' });
  }
} 