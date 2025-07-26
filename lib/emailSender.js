import nodemailer from 'nodemailer';

export const sendStudentEmail = async (toEmail, name, studentId, profileImage, loginToken, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Convert relative path to absolute URL for email
  let profileImageUrl = '';
  if (profileImage) {
    // If profileImage starts with /, it's a relative path - convert to absolute
    if (profileImage.startsWith('/')) {
      profileImageUrl = `${process.env.BASE_URL || 'http://localhost:3000'}${profileImage}`;
    } else {
      // If it's already an absolute URL, use as is
      profileImageUrl = profileImage;
    }
  }

  console.log('📧 Email profileImage input:', profileImage);
  console.log('📧 Email profileImageUrl final:', profileImageUrl);

  const mailOptions = {
    from: `"Shoora.tech Coaching" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🎓 Welcome to Shoora.tech Coaching!',
    html: `
      <div style="background: transparent; min-height: 100vh; padding: 0; margin: 0; font-family: 'Arial', sans-serif;">
        <div style="max-width: 400px; margin: 40px auto; background: #fff; border-radius: 30px 30px 0 0; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10);">
          <div style="background: #1e1e1e; padding: 24px 0 0 0; text-align: center; border-radius: 30px 30px 0 0;">
            <img src="https://shoora.tech/assets/Shoora-tech-text.svg" alt="Shoora.tech Logo" style="height: 2.2rem; margin-bottom: 8px;" />
            <h2 style="margin: 0; color: #9747FF; font-weight: bold; font-size: 2rem;">Shoora.tech</h2>
          </div>
          <div style="padding: 32px 24px 24px 24px; text-align: center; background: #fff;">
            <div style="display: flex; justify-content: center;">
              <div style="background: #fff; border-radius: 50%; box-shadow: 0 2px 8px rgba(151,71,255,0.10); width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                ${profileImageUrl ? `<img src="${profileImageUrl}" alt="Profile Photo" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;" />` : 
                  '<div style="width: 100px; height: 100px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 0.9rem;">No Photo</div>'}
              </div>
            </div>
            <h3 style="color: #222; font-size: 1.3rem; margin-bottom: 0.5rem;">Hi <span style="color: #9747FF;">${name}</span></h3>
            <p style="font-size: 1.1rem; color: #333; margin: 0 0 10px 0;">Welcome to <b>Shoora.tech</b> 🚀</p>
            <p style="font-size: 1rem; color: #555; margin: 0 0 10px 0;">Thank you for joining as a <b>Student</b>! We are excited to have you on board <span>🙌🙌</span></p>
            <p style="font-size: 1rem; color: #555; margin: 0 0 10px 0;">Your Student ID: <b style="color: #ff6a32;">${studentId}</b></p>
            <p style="font-size: 1rem; color: #555; margin: 0 0 10px 0;">Your Login Token: <b style="color: #9747FF;">${loginToken || studentId}</b></p>
            ${otp ? `<div style='margin: 18px 0 0 0; padding: 12px; background: #f6f6f6; border-radius: 8px;'><b style='color:#ff6a32;font-size:1.2rem;'>Your OTP for login: ${otp}</b><br/><span style='color:#555;font-size:0.95rem;'>This OTP is valid for 5 minutes.</span></div>` : ''}
          </div>
          <div style="background: #9747FF; color: #fff; padding: 18px 0 10px 0; border-radius: 0 0 30px 30px; text-align: center;">
            <p style="margin: 0; font-size: 1rem;">Thanks & Regards,<br/>team Shoora.tech💻</p>
            <p style="margin: 6px 0 0 0; font-size: 0.95rem;">✉️ teamcybershoora@gmail.com &nbsp;|&nbsp; 🌐 <a href="https://shoora.tech" style="color: #fff; text-decoration: underline;">Shoora.Tech</a></p>
          </div>
        </div>
      </div>
    `,
  };

  // Log the final HTML email content for debugging
  console.log('📧 Final email HTML contains profileImageUrl:', profileImageUrl);

  await transporter.sendMail(mailOptions);
};

export const sendTeacherEmail = async (toEmail, name, profileImage, teacherCode, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Convert relative path to absolute URL for email
  let profileImageUrl = '';
  if (profileImage) {
    // If profileImage starts with /, it's a relative path - convert to absolute
    if (profileImage.startsWith('/')) {
      profileImageUrl = `${process.env.BASE_URL || 'http://localhost:3000'}${profileImage}`;
    } else {
      // If it's already an absolute URL, use as is
      profileImageUrl = profileImage;
    }
  }

  const mailOptions = {
    from: `"Shoora.tech Coaching" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '👨‍🏫 Welcome to Shoora.tech as a Teacher!',
    html: `
      <div style="background:rgba(255, 255, 255, 0); min-height: 100vh; padding: 0; margin: 0; font-family: 'Arial', sans-serif;">
        <div style="max-width: 400px; margin: 40px auto; background: src('/assets/bg2.svg'); border-radius: 30px 30px 0 0; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10);">
          <div style="background: #1e1e1e; padding: 24px 0 0 0; text-align: center; border-radius: 30px 30px 0 0;">
            <img url="https://ik.imagekit.io/cybershoora/Shoora.tech/Logos%20of%20Web%20Panel%20or%20Web%20aap/Shoora-tech-text.svg?updatedAt=1750497732898" alt="Shoora.tech Logo" style="height: 2.2rem; margin-bottom: 8px;" />
            <h2 style="margin: 0; color: #9747FF; font-weight: bold; font-size: 2rem;">Shoora.tech</h2>
          </div>
          <div style="padding: 32px 24px 24px 24px; text-align: center; background: #fff;">
            <div style="display: flex; justify-content: center;">
              <div style="background: #fff; border-radius: 50%; box-shadow: 0 2px 8px rgba(151,71,255,0.10); width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                ${profileImageUrl ? `<img src="${profileImageUrl}" alt="Profile Photo" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;" />` : 
                  '<div style="width: 100px; height: 100px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 0.9rem;">No Photo</div>'}
              </div>
            </div>
            <h3 style="color: #222; font-size: 1.3rem; margin-bottom: 0.5rem;">Hi <span style="color: #9747FF;">${name}</span></h3>
            <p style="font-size: 1.1rem; color: #333; margin: 0 0 10px 0;">Welcome to <b>Shoora.tech</b> 🚀</p>
            <p style="font-size: 1rem; color: #555; margin: 0 0 10px 0;">Thank you for joining as a <b>Teacher</b>! We are excited to have you on board <span>🙌🙌</span></p>
            <p style="font-size: 1rem; color: #555; margin: 0 0 10px 0;">Your Teacher ID: <b style="color: #ff6a32;">${teacherCode || ''}</b></p>
            ${otp ? `<div style='margin: 18px 0 0 0; padding: 12px; background: #f6f6f6; border-radius: 8px;'><b style='color:#ff6a32;font-size:1.2rem;'>Your OTP for login: ${otp}</b><br/><span style='color:#555;font-size:0.95rem;'>This OTP is valid for 5 minutes.</span></div>` : ''}
          </div>
          <div style="background: #9747FF; color: #fff; padding: 18px 0 10px 0; border-radius: 0 0 30px 30px; text-align: center;">
            <p style="margin: 0; font-size: 1rem;">Thanks & Regards,<br/>team Shoora.tech💻</p>
            <p style="margin: 6px 0 0 0; font-size: 0.95rem;">✉️ teamcybershoora@gmail.com &nbsp;|&nbsp; 🌐 <a href="https://shoora.tech" style="color: #fff; text-decoration: underline;">Shoora.Tech</a></p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOtpEmail = async (toEmail, name, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Shoora.tech Coaching" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Shoora.tech Login OTP',
    html: `
      <div style="background: transparent; min-height: 100vh; padding: 0; margin: 0; font-family: 'Arial', sans-serif;">
        <div style="max-width: 400px; margin: 40px auto; background: #fff; border-radius: 30px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10);">
          <div style="background: #1e1e1e; padding: 24px 0 0 0; text-align: center; border-radius: 30px 30px 0 0;">
            <img src="https://shoora.tech/assets/Shoora-tech-text.svg" alt="Shoora.tech Logo" style="height: 2.2rem; margin-bottom: 8px;" />
            <h2 style="margin: 0; color: #9747FF; font-weight: bold; font-size: 2rem;">Shoora.tech</h2>
          </div>
          <div style="padding: 32px 24px 24px 24px; text-align: center; background: #fff;">
            <h3 style="color: #222; font-size: 1.3rem; margin-bottom: 0.5rem;">Hi <span style="color: #9747FF;">${name}</span></h3>
            <p style="font-size: 1.1rem; color: #333; margin: 0 0 10px 0;">Your OTP for login is:</p>
            <div style='margin: 18px 0 0 0; padding: 16px; background: #f6f6f6; border-radius: 8px; display: inline-block;'>
              <b style='color:#ff6a32;font-size:2rem;letter-spacing:2px;'>${otp}</b><br/>
              <span style='color:#555;font-size:0.95rem;'>This OTP is valid for 5 minutes. Please do not share it with anyone.</span>
            </div>
          </div>
          <div style="background: #9747FF; color: #fff; padding: 18px 0 10px 0; border-radius: 0 0 30px 30px; text-align: center;">
            <p style="margin: 0; font-size: 1rem;">Thanks & Regards,<br/>team Shoora.tech💻</p>
            <p style="margin: 6px 0 0 0; font-size: 0.95rem;">✉️ teamcybershoora@gmail.com &nbsp;|&nbsp; 🌐 <a href="https://shoora.tech" style="color: #fff; text-decoration: underline;">Shoora.Tech</a></p>
          </div>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// Generic email sender function
export const sendEmail = async (toEmail, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Shoora.tech Coaching" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};