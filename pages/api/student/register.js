import connectDB from '@/lib/dbConnect';
import Student from '@/models/Student';
import { getNextStudentCode } from '@/lib/getNextStudentCode';
import { sendStudentEmail } from '@/lib/emailSender';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  },
};

function getUniqueFileName(originalName) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const unique = `${base}_${Date.now()}_${Math.floor(Math.random()*10000)}${ext}`;
  return unique;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await connectDB();
    
    const form = formidable({ 
      multiples: false, 
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true 
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          console.error('❌ Formidable error:', err);
          return res.status(400).json({ 
            success: false, 
            message: 'File upload error. Please try again.' 
          });
        }

        // Convert array fields to strings
        Object.keys(fields).forEach(key => {
          if (Array.isArray(fields[key])) {
            fields[key] = fields[key][0];
          }
          if (typeof fields[key] !== 'string') {
            fields[key] = String(fields[key] || '');
          }
        });

        console.log('📋 Received fields:', Object.keys(fields));
        console.log('📁 Received files:', Object.keys(files));

        const {
          fullName, email, phone, password, dob,
          guardianName, guardianPhone, annualIncome,
          address, qualification, schoolName, customSchool,
          collegeName, customCollege, course, year,
          class: studentClass
        } = fields;

        // Validate required fields
        if (!fullName || !email || !phone || !password) {
          return res.status(400).json({ 
            success: false, 
            message: '❌ All required fields must be filled' 
          });
        }

        // Check if user already exists
        const existingUser = await Student.findOne({
          $or: [{ email: email.toLowerCase() }, { phone }]
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: '⚠️ User already registered with this Email or Phone'
          });
        }

        // Handle profile photo upload
        let profilePhotoUrl = '';
        
        console.log('🔍 Checking files object:', files);
        console.log('🔍 profilePhoto file:', files.profilePhoto);
        
        if (files.profilePhoto) {
          try {
            // Use Cloudinary for upload
            const profilePhotoFile = Array.isArray(files.profilePhoto) 
              ? files.profilePhoto[0] 
              : files.profilePhoto;

            if (profilePhotoFile.size > 0) {
              const tempFilePath = profilePhotoFile.filepath;
              // Upload to Cloudinary
              profilePhotoUrl = await uploadToCloudinary(tempFilePath, 'students');
              // Clean up temp file
              try {
                fs.unlinkSync(tempFilePath);
              } catch (cleanupError) {
                console.log('⚠️ Could not clean temp file:', cleanupError.message);
              }
            } else {
              console.log('⚠️ Profile photo file size is 0');
            }
          } catch (fileError) {
            console.error('❌ Error uploading profile photo to Cloudinary:', fileError);
          }
        } else {
          console.log('⚠️ No profile photo file received');
        }

        // Log the URL before saving to DB
        console.log('➡️ profilePhotoUrl to be saved in DB:', profilePhotoUrl);

        // Generate student ID
        const studentId = await getNextStudentCode(fullName);

        // Create new student with profile photo URL
        const newStudent = await Student.create({
          fullName,
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
          class: studentClass,
          studentId,
          profilePhoto: profilePhotoUrl, // This should now have the correct path
          status: 'trial',
          idCardNumber: studentId,
          faceVerified: true,
        });

        console.log('✅ Student created with profile photo:', {
          id: newStudent._id,
          profilePhoto: newStudent.profilePhoto
        });

        // Send welcome email
        try {
          await sendStudentEmail(email, fullName, studentId, profilePhotoUrl, studentId);
          console.log('✅ Welcome email sent');
        } catch (emailErr) {
          console.error('❌ Student email failed:', emailErr);
        }

        return res.status(201).json({
          success: true,
          message: '✅ Registration successful! Welcome email sent.',
          student: {
            _id: newStudent._id,
            studentId: newStudent.studentId,
            fullName: newStudent.fullName,
            email: newStudent.email,
            profilePhoto: newStudent.profilePhoto,
            faceVerified: newStudent.faceVerified,
          }
        });

      } catch (innerErr) {
        console.error('❌ Inner error:', innerErr);
        return res.status(500).json({
          success: false,
          message: 'Registration failed. Please try again.',
          error: process.env.NODE_ENV === 'development' ? innerErr.message : undefined
        });
      }
    });

  } catch (outerErr) {
    console.error('❌ Outer error:', outerErr);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? outerErr.message : undefined
    });
  }
}