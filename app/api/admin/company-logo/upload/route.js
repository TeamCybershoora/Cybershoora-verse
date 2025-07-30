import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../../../lib/cloudinary.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const type = formData.get('type');
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided',
        message: 'No file provided'
      }, { status: 400 });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create temp file path (Windows compatible)
    const os = require('os');
    const path = require('path');
    const tempFilePath = path.join(os.tmpdir(), file.name);
    require('fs').writeFileSync(tempFilePath, buffer);
    
    try {
             // Upload to Cloudinary with specific folder and preset
       const uploadedUrl = await uploadToCloudinary(
         tempFilePath,
         'cybershooraverse_companies/companies-logo',
         'cybershooraverse_companies'
       );
      
      // Clean up temp file
      try {
        require('fs').unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error('Failed to clean up temp file:', cleanupError);
      }
      
      return NextResponse.json({
        success: true,
        url: uploadedUrl,
        message: 'Company logo uploaded successfully'
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
        error: 'Failed to upload company logo to Cloudinary',
        message: 'Failed to upload company logo to Cloudinary'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Company Logo Upload API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      message: 'Internal server error'
    }, { status: 500 });
  }
} 