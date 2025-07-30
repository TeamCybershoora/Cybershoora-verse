import { NextResponse } from 'next/server';
import { deleteFromCloudinary } from '../../../../lib/cloudinary.js';

export async function POST(request) {
  try {
    console.log('🗑️ Delete Cloudinary API called');
    
    const body = await request.json();
    const { imageUrl } = body;
    
    if (!imageUrl) {
      return NextResponse.json({
        success: false,
        message: 'Image URL is required'
      }, { status: 400 });
    }
    
    console.log('🗑️ Deleting from Cloudinary:', imageUrl);
    
    // Delete from Cloudinary
    await deleteFromCloudinary(imageUrl);
    
    console.log('✅ Media deleted from Cloudinary successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Media deleted from Cloudinary successfully'
    });
    
  } catch (error) {
    console.error('❌ Delete Cloudinary API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete media from Cloudinary'
    }, { status: 500 });
  }
} 