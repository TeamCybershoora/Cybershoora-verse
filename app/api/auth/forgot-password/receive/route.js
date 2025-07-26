import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import { sendEmail } from '@/lib/emailSender';

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, userType } = await request.json();
    
    if (!email || !userType) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email and user type are required' 
      }, { status: 400 });
    }

    let user;
    
    if (userType === 'student') {
      user = await Student.findOne({ email: email.toLowerCase() });
    } else if (userType === 'teacher') {
      user = await Teacher.findOne({ email: email.toLowerCase() });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid user type' 
      }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found with this email' 
      }, { status: 404 });
    }

    // Send password to email
    const emailSubject = '🔐 Your Password - Shooraverse';
    const emailBody = `
      <div style="background: transparent; min-height: 100vh; padding: 0; margin: 0; font-family: 'Arial', sans-serif;">
        <div style="max-width: 400px; margin: 40px auto; background: #fff; border-radius: 30px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10);">
          <div style="background: #1e1e1e; padding: 24px 0 0 0; text-align: center; border-radius: 30px 30px 0 0;">
            <img src="https://shooraverse/assets/Shooraverse-text.svg" alt="Shooraverse Logo" style="height: 2.2rem; margin-bottom: 8px;" />
            <h2 style="margin: 0; color: #9747FF; font-weight: bold; font-size: 2rem;">Shooraverse</h2>
          </div>
          <div style="padding: 32px 24px 24px 24px; text-align: center; background: #fff;">
            <h3 style="color: #222; font-size: 1.3rem; margin-bottom: 0.5rem;">Hi <span style="color: #9747FF;">${user.fullName}</span></h3>
            <p style="font-size: 1.1rem; color: #333; margin: 0 0 10px 0;">You requested to receive your password</p>
            <p style="font-size: 1rem; color: #555; margin: 0 0 20px 0;">Here is your current password:</p>
            <div style='margin: 18px 0 0 0; padding: 16px; background: #f6f6f6; border-radius: 8px; display: inline-block;'>
              <b style='color:#ff6a32;font-size:1.5rem;letter-spacing:1px;'>${user.password}</b><br/>
              <span style='color:#555;font-size:0.95rem;'>Please keep your password secure and do not share it with anyone.</span>
            </div>
            <p style="font-size: 0.9rem; color: #777; margin: 20px 0 0 0;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="background: #9747FF; color: #fff; padding: 18px 0 10px 0; border-radius: 0 0 30px 30px; text-align: center;">
            <p style="margin: 0; font-size: 1rem;">Thanks & Regards,<br/>team Shooraverse💻</p>
            <p style="margin: 6px 0 0 0; font-size: 0.95rem;">✉️ teamcybershoora@gmail.com &nbsp;|&nbsp; 🌐 <a href="https://shooraverse" style="color: #fff; text-decoration: underline;">Shooraverse</a></p>
          </div>
        </div>
      </div>
    `;

    await sendEmail(user.email, emailSubject, emailBody);

    return NextResponse.json({ 
      success: true, 
      message: 'Password sent to your email successfully' 
    });

  } catch (error) {
    console.error('Error in receive password:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 