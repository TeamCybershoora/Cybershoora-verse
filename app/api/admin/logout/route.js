import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🚪 Admin Logout API called');
    
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear admin cookie
    response.cookies.set('admin_auth', '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });
    
    console.log('✅ Admin logged out successfully');
    return response;
    
  } catch (error) {
    console.error('❌ Admin Logout API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
} 