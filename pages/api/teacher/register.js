import connectDB from '@/lib/dbConnect';
import Teacher from '@/models/Teacher';
import { sendTeacherEmail } from '@/lib/emailSender';
import { getNextTeacherCode } from '@/lib/getNextTeacherCode';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '5mb',
  },
};

function getUniqueFileName(originalName) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const unique = `${base}_${Date.now()}_${Math.floor(Math.random()*10000)}${ext}`;
  return unique;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch teacher by ID
    await connectDB();
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Teacher ID is required' });
    }
    try {
      const teacher = await Teacher.findById(id).lean();
      if (!teacher) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
      }
      // Return only public info
      return res.status(200).json({
        success: true,
        teacher: {
          _id: teacher._id,
          fullName: teacher.fullName,
          email: teacher.email,
          profilePhoto: teacher.profilePhoto,
          subject: teacher.subject,
          qualification: teacher.qualification,
          status: teacher.status,
          teacherCode: teacher.teacherCode,
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
  if (req.method === 'POST') {
    try {
      await connectDB();
      const form = formidable({
        multiples: false,
        maxFileSize: 5 * 1024 * 1024, // 5MB
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
            if (Array.isArray(fields[key])) fields[key] = fields[key][0];
            if (typeof fields[key] !== 'string') fields[key] = String(fields[key] || '');
          });
          // Optional fields
          if (fields.github === undefined) fields.github = '';
          if (fields.linkedin === undefined) fields.linkedin = '';
          if (fields.otherLink === undefined) fields.otherLink = '';
          // Handle profile photo upload
          let profilePhotoUrl = '';
          if (files.profilePhoto) {
            try {
              // Use Cloudinary for upload
              const profilePhotoFile = Array.isArray(files.profilePhoto)
                ? files.profilePhoto[0]
                : files.profilePhoto;
              if (profilePhotoFile.size > 0) {
                const tempFilePath = profilePhotoFile.filepath;
                // Upload to Cloudinary
                profilePhotoUrl = await uploadToCloudinary(tempFilePath, 'teachers');
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
          // Generate teacher code
          const teacherCode = await getNextTeacherCode(fields.fullName);
          // Create new teacher
          const newTeacher = await Teacher.create({
            ...fields,
            profilePhoto: profilePhotoUrl,
            teacherCode,
          });
          // Send welcome email
          try {
            await sendTeacherEmail(
              fields.email,
              fields.fullName,
              profilePhotoUrl,
              teacherCode
            );
          } catch (emailErr) {
            console.error('❌ Teacher email failed:', emailErr);
          }
          return res.status(201).json({
            success: true,
            message: '✅ Registration successful! Welcome email sent.',
            teacher: {
              _id: newTeacher._id,
              teacherCode: newTeacher.teacherCode,
              fullName: newTeacher.fullName,
              email: newTeacher.email,
              profilePhoto: newTeacher.profilePhoto,
              subject: newTeacher.subject,
              qualification: newTeacher.qualification,
              status: newTeacher.status,
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
} 