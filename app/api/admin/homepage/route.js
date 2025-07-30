import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/dbConnect.js';
import Homepage from '../../../../models/Homepage.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../../../lib/cloudinary.js';

export async function GET() {
  try {
    await connectDB();
    
    // Get homepage data from database
    const homepage = await Homepage.getHomepage();
    
    return NextResponse.json(homepage);
    
  } catch (error) {
    console.error('❌ Homepage GET API error:', error);
    return NextResponse.json({
      mainHeadingWhite: "Welcome to",
      mainHeadingOrange: "Shoora Tech",
      typewriterTexts: [],
      stats: { studentsTaught: "1000+", instructors: "25+", liveProjects: "50+" },
      companies: [],
      faqs: []
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    // Check if it's a form data request (file upload) or JSON
    const contentType = request.headers.get('content-type');
    
    let body;
    let uploadedMediaUrl = null;
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      body = {};
      
      // Extract form fields
      for (const [key, value] of formData.entries()) {
        if (key === 'heroMediaFile' && value instanceof File) {
          // Handle file upload to Cloudinary
          
          // Convert file to buffer
          const bytes = await value.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Upload to Cloudinary (Windows compatible)
          const os = require('os');
          const path = require('path');
          const tempFilePath = path.join(os.tmpdir(), value.name);
          require('fs').writeFileSync(tempFilePath, buffer);
          
          try {
            uploadedMediaUrl = await uploadToCloudinary(
              tempFilePath, 
              'cybershoora_verse/hero-media',
              'cybershoora_verse'
            );
            
            // Clean up temp file
            try {
              require('fs').unlinkSync(tempFilePath);
            } catch (cleanupError) {
              console.error('Failed to clean up temp file:', cleanupError);
            }
          } catch (uploadError) {
            console.error('❌ Cloudinary upload failed:', uploadError);
            return NextResponse.json({
              success: false,
              message: 'Failed to upload media to Cloudinary'
            }, { status: 500 });
          }
        } else if (key !== 'heroMediaFile') {
          // Handle other form fields
          try {
            body[key] = JSON.parse(value);
          } catch {
            body[key] = value;
          }
        }
      }
      
      // Update hero media URL if file was uploaded
      if (uploadedMediaUrl) {
        body.heroMedia = {
          type: body.heroMediaType || 'image',
          url: uploadedMediaUrl
        };
      }
    } else {
      // Handle JSON request
      body = await request.json();
    }
    
    // Get existing homepage or create new one
    let homepage = await Homepage.findOne();
    
    if (homepage) {
      // Check if we need to delete old media from Cloudinary
      if (homepage.heroMedia && homepage.heroMedia.url && 
          body.heroMedia && body.heroMedia.url && 
          homepage.heroMedia.url !== body.heroMedia.url &&
          homepage.heroMedia.url.includes('cloudinary.com')) {
        
        try {
          await deleteFromCloudinary(homepage.heroMedia.url);
        } catch (deleteError) {
          console.error('❌ Failed to delete old media from Cloudinary:', deleteError);
        }
      }
      
      // Update existing homepage
      homepage.set(body);
      await homepage.save();
    } else {
      // Create new homepage
      homepage = await Homepage.create(body);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Homepage updated successfully',
      heroMediaUrl: uploadedMediaUrl
    });
    
  } catch (error) {
    console.error('❌ Homepage POST API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update homepage'
    }, { status: 500 });
  }
} 