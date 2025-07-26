import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return new Response(JSON.stringify({ 
        error: 'Image URL is required' 
      }), { status: 400 });
    }
    
    console.log('Deleting image from Cloudinary:', imageUrl);
    
    // Delete from Cloudinary
    const result = await deleteFromCloudinary(imageUrl);
    
    console.log('Cloudinary delete result:', result);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Image deleted from Cloudinary successfully',
      result
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to delete from Cloudinary',
      success: false
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 