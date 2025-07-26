import { testCloudinaryConnection } from '@/lib/cloudinary';

export async function GET() {
  console.log('=== TESTING CLOUDINARY CONNECTION ===');
  
  try {
    const result = await testCloudinaryConnection();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Cloudinary connection successful',
      data: result,
      config: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
        uploadPreset: 'shoora_verse'
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      config: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
        uploadPreset: 'shoora_verse'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 