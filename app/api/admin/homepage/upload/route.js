import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../../../lib/cloudinary.js';

export async function POST(request) {
  try {
    console.log('📁 Homepage Upload API called');
    
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
    
    console.log('📁 Processing file upload:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadType: type
    });
    
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
        'cybershoora_verse/hero-media',
        'cybershoora_verse'
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
         error: 'Failed to upload file to Cloudinary',
         message: 'Failed to upload file to Cloudinary'
       }, { status: 500 });
    }
    
     } catch (error) {
     console.error('❌ Homepage Upload API error:', error);
     return NextResponse.json({
       success: false,
       error: error.message || 'Internal server error',
       message: 'Internal server error'
     }, { status: 500 });
   }
} 