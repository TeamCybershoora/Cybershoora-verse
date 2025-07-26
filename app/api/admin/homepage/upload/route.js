import { uploadToCloudinary, testCloudinaryConnection } from '@/lib/cloudinary';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

// Cloudinary configuration - Single preset with subfolders
const CLOUDINARY_UPLOAD_PRESET = 'shoora_verse';
const HERO_FOLDER = 'hero-media';
const COMPANY_FOLDER = 'companies-logo';
const DEFAULT_FOLDER = 'hero-media';

// Company logos will use different preset
const COMPANY_UPLOAD_PRESET = 'shooraverse_companies';

// Supported file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req) {
  console.log('=== UPLOAD API CALLED ===');
  
  try {
    // Test Cloudinary connection first
    try {
      await testCloudinaryConnection();
      console.log('✅ Cloudinary connection test passed');
    } catch (error) {
      console.error('❌ Cloudinary connection test failed:', error);
      return new Response(JSON.stringify({ 
        error: 'Cloudinary connection failed. Please check your credentials.' 
      }), { status: 500 });
    }

    const formData = await req.formData();
    const imageField = formData.get('image');
    const type = formData.get('type');
    
    console.log('Form data received:', {
      hasImage: !!imageField,
      imageName: imageField?.name,
      imageType: imageField?.type,
      imageSize: imageField?.size,
      uploadType: type
    });

    // Validate file
    if (!imageField || typeof imageField !== 'object' || !imageField.name) {
      console.error('❌ No file uploaded or invalid file');
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    // Check file size
    if (imageField.size > MAX_FILE_SIZE) {
      console.error('❌ File too large:', imageField.size, 'bytes');
      return new Response(JSON.stringify({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }), { status: 400 });
    }

    // Check file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(imageField.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(imageField.type);
    
    if (!isImage && !isVideo) {
      console.error('❌ Invalid file type:', imageField.type);
      return new Response(JSON.stringify({ 
        error: 'Invalid file type. Please upload an image or video file.' 
      }), { status: 400 });
    }

    // Determine folder based on type with subfolder structure
    let folder = DEFAULT_FOLDER;
    if (type === 'hero') {
      folder = HERO_FOLDER;
    } else if (type === 'company') {
      folder = 'companies-logo'; // Direct folder for company logos
    } else if (type === 'hero-banner') {
      folder = 'hero-media/banners';
    } else if (type === 'hero-video') {
      folder = 'hero-media/videos';
    } else if (type === 'hero-image') {
      folder = 'hero-media/images';
    } else if (type === 'company-large') {
      folder = 'companies-logo/large';
    } else if (type === 'company-small') {
      folder = 'companies-logo/small';
    }
    
    console.log('📁 Selected folder:', folder);
    console.log('🎯 Upload preset:', type === 'company' ? COMPANY_UPLOAD_PRESET : CLOUDINARY_UPLOAD_PRESET);
    console.log('📄 File type:', imageField.type);
    console.log('📏 File size:', imageField.size, 'bytes');

    // Create temporary file
    const buffer = Buffer.from(await imageField.arrayBuffer());
    const tempFilePath = path.join(process.cwd(), 'tmp', `${Date.now()}_${imageField.name}`);
    
    // Ensure tmp directory exists
    if (!fs.existsSync(path.dirname(tempFilePath))) {
      fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
      console.log('📁 Created tmp directory');
    }
    
    // Write file to temp location
    fs.writeFileSync(tempFilePath, buffer);
    console.log('💾 File written to temp location:', tempFilePath);

    let url = '';
    try {
      // Upload to Cloudinary
      console.log('🚀 Starting Cloudinary upload...');
      
      // Use different preset for company logos
      const uploadPreset = type === 'company' ? COMPANY_UPLOAD_PRESET : CLOUDINARY_UPLOAD_PRESET;
      console.log('🎯 Using upload preset:', uploadPreset);
      
      url = await uploadToCloudinary(tempFilePath, folder, uploadPreset);
      console.log('✅ Upload successful, URL:', url);
    } catch (uploadError) {
      console.error('❌ Upload failed:', uploadError);
      throw uploadError;
    } finally {
      // Clean up temp file
      try {
        fs.unlinkSync(tempFilePath);
        console.log('🧹 Temp file cleaned up');
      } catch (cleanupError) {
        console.error('⚠️ Failed to clean up temp file:', cleanupError);
      }
    }
    
    console.log('=== UPLOAD API SUCCESS ===');
    return new Response(JSON.stringify({ 
      url,
      success: true,
      message: 'File uploaded successfully'
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (err) {
    console.error('❌ UPLOAD API ERROR:', err);
    console.error('Error stack:', err.stack);
    
    return new Response(JSON.stringify({ 
      error: err.message || 'Upload failed',
      success: false
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 