// Cloudinary utility for uploading images and videos
// Requires env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// Usage: uploadToCloudinary(filePath, folder, uploadPreset)
// Returns: secure_url string
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(filePath, folder = 'uploads', uploadPreset) {
  return new Promise((resolve, reject) => {
    const options = { 
      resource_type: 'auto', // Allow both images and videos
      folder: folder // Always set the folder
    };
    
    // If upload preset is provided, use it for unsigned uploads
    if (uploadPreset) {
      options.upload_preset = uploadPreset;
    }
    
    cloudinary.uploader.upload(
      filePath,
      options,
      (error, result) => {
        if (error) {
          console.error('❌ CLOUDINARY UPLOAD ERROR:', error);
          return reject(error);
        }
        
        resolve(result.secure_url);
      }
    );
  });
}

// Delete image/video from Cloudinary by public_id or URL
export async function deleteFromCloudinary(imageUrlOrPublicId) {
  return new Promise((resolve, reject) => {
    let publicId = imageUrlOrPublicId;
    
    // If a full URL is provided, extract the public_id
    if (publicId.startsWith('http')) {
      // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
      // Extract everything after '/upload/' and before file extension
      const matches = publicId.match(/\/upload\/(?:v\d+\/)?(.+?)(\.[a-zA-Z0-9]+)?$/);
      if (matches && matches[1]) {
        publicId = matches[1];
      }
    }
    
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('❌ CLOUDINARY DELETE ERROR:', error);
        return reject(error);
      }
      resolve(result);
    });
  });
}

// Test Cloudinary connection
export async function testCloudinaryConnection() {
  return new Promise((resolve, reject) => {
    console.log('Testing Cloudinary connection...');
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API key exists:', !!process.env.CLOUDINARY_API_KEY);
    console.log('API secret exists:', !!process.env.CLOUDINARY_API_SECRET);
    
    // Try to get account info to test connection
    cloudinary.api.ping((error, result) => {
      if (error) {
        console.error('❌ CLOUDINARY CONNECTION TEST FAILED:', error);
        reject(error);
      } else {
        console.log('✅ CLOUDINARY CONNECTION TEST SUCCESS:', result);
        resolve(result);
      }
    });
  });
} 