import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Create response with success message
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the admin session cookie by setting it to expire in the past
    response.cookies.set('adminToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // This makes the cookie expire immediately
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      message: 'Logout failed'
    }, { status: 500 });
  }
} 