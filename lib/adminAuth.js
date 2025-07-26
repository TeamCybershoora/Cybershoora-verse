import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function verifyAdminAuth(request) {
  try {
    // Get the admin token from cookies
    const token = request.cookies.get('adminToken')?.value;
    
    if (!token) {
      return { isAuthenticated: false, message: 'No token found' };
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if admin still exists in database
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return { isAuthenticated: false, message: 'Admin not found' };
    }

    return { 
      isAuthenticated: true, 
      admin: {
        _id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        profilePhoto: admin.profilePhoto
      }
    };

  } catch (error) {
    console.error('Auth verification error:', error);
    return { isAuthenticated: false, message: 'Invalid token' };
  }
} 