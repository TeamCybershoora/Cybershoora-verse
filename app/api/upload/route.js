import { NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '../../../lib/cloudinary.js';

// Upload configuration for different types
const UPLOAD_CONFIGS = {
  homepage: {
    folder: 'cybershoora_verse/hero-media',
    preset: 'cybershoora_verse',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'],
    maxSize: 50 * 1024 * 1024 // 50MB
  },
  company: {
    folder: 'cybershooraverse_companies/companies-logo',
    preset: 'cybershooraverse_companies',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  course: {
    folder: 'cybershoora_courses/courses-image',
    preset: 'cybershoora_courses',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  profile: {
    folder: 'cybershoora_profiles/profile-photos',
    preset: 'cybershoora_profiles',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024 // 5MB
  }
};

export async function POST(request) {
  try {
    console.log('📁 Unified Upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');
    const deleteOldUrl = formData.get('deleteOldUrl'); // Optional: URL to delete old file
    
    // Validation
    if (!file || !type) {
      return NextResponse.json({
        success: false,
        message: 'File and type are required'
      }, { status: 400 });
    }
    
    const config = UPLOAD_CONFIGS[type];
    if (!config) {
      return NextResponse.json({
        success: false,
        message: 'Invalid upload type'
      }, { status: 400 });
    }
    
    // File validation
    if (!config.allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: `File type not allowed. Allowed types: ${config.allowedTypes.join(', ')}`
      }, { status: 400 });
    }
    
    if (file.size > config.maxSize) {
      return NextResponse.json({
        success: false,
        message: `File too large. Maximum size: ${config.maxSize / (1024 * 1024)}MB`
      }, { status: 400 });
    }
    
    console.log('📁 Processing file upload:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadType: type
    });
    
    // Delete old file if provided
    if (deleteOldUrl && deleteOldUrl.includes('cloudinary.com')) {
      try {
        await deleteFromCloudinary(deleteOldUrl);
        console.log('🗑️ Old file deleted from Cloudinary');
      } catch (deleteError) {
        console.error('❌ Failed to delete old file:', deleteError);
      }
    }
    
    // Convert file to buffer and create temp file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const os = require('os');
    const path = require('path');
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}_${file.name}`);
    require('fs').writeFileSync(tempFilePath, buffer);
    
    try {
      // Upload to Cloudinary
      const uploadedUrl = await uploadToCloudinary(
        tempFilePath,
        config.folder,
        config.preset
      );
      
      console.log('✅ File uploaded to Cloudinary:', uploadedUrl);
      
      // Clean up temp file
      try {
        require('fs').unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error('Failed to clean up temp file:', cleanupError);
      }
      
      return NextResponse.json({
        success: true,
        url: uploadedUrl,
        message: 'File uploaded successfully'
      });
      
    } catch (uploadError) {
      console.error('❌ Cloudinary upload failed:', uploadError);
      
      // Clean up temp file on error
      try {
        require('fs').unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error('Failed to clean up temp file:', cleanupError);
      }
      
      return NextResponse.json({
        success: false,
        message: 'Failed to upload file to Cloudinary'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Upload API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// Delete file endpoint
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    
    if (!fileUrl) {
      return NextResponse.json({
        success: false,
        message: 'File URL is required'
      }, { status: 400 });
    }
    
    if (!fileUrl.includes('cloudinary.com')) {
      return NextResponse.json({
        success: false,
        message: 'Invalid Cloudinary URL'
      }, { status: 400 });
    }
    
    await deleteFromCloudinary(fileUrl);
    
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Delete file error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete file'
    }, { status: 500 });
  }
} 