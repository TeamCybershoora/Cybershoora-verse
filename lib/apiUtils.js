import { NextResponse } from 'next/server';

// Standard API response formats
export const ApiResponse = {
  success: (data = null, message = 'Success', status = 200) => {
    return NextResponse.json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    }, { status });
  },

  error: (message = 'Internal server error', status = 500, errors = null) => {
    return NextResponse.json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    }, { status });
  },

  validationError: (errors, message = 'Validation failed') => {
    return NextResponse.json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    }, { status: 400 });
  },

  notFound: (message = 'Resource not found') => {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    }, { status: 404 });
  },

  unauthorized: (message = 'Unauthorized access') => {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    }, { status: 401 });
  },

  forbidden: (message = 'Access forbidden') => {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    }, { status: 403 });
  },

  conflict: (message = 'Resource conflict') => {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    }, { status: 409 });
  },

  tooManyRequests: (message = 'Too many requests') => {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    }, { status: 429 });
  }
};

// Validation utilities
export const Validation = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation
  isValidPhone: (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },

  // Password validation
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  // Required field validation
  isRequired: (value) => {
    return value !== null && value !== undefined && value !== '';
  },

  // File validation
  isValidFile: (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
    if (!file) return false;
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) return false;
    if (file.size > maxSize) return false;
    return true;
  },

  // URL validation
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

// Error handling wrapper
export const withErrorHandling = (handler) => {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('❌ API Error:', error);
      
      // Handle specific error types
      if (error.name === 'ValidationError') {
        return ApiResponse.validationError(error.errors);
      }
      
      if (error.name === 'CastError') {
        return ApiResponse.error('Invalid ID format', 400);
      }
      
      if (error.code === 11000) {
        return ApiResponse.conflict('Duplicate entry found');
      }
      
      if (error.name === 'JsonWebTokenError') {
        return ApiResponse.unauthorized('Invalid token');
      }
      
      if (error.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized('Token expired');
      }
      
      // Default error response
      return ApiResponse.error(
        process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message
      );
    }
  };
};

// Pagination utilities
export const Pagination = {
  // Parse pagination parameters
  parseParams: (searchParams) => {
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = Math.min(parseInt(searchParams.get('limit')) || 50, 100);
    const skip = (page - 1) * limit;
    
    return { page, limit, skip };
  },

  // Create pagination response
  createResponse: (data, page, limit, total) => {
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }
};

// Authentication utilities
export const Auth = {
  // Extract token from request
  getToken: (request) => {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  },

  // Get user from cookie
  getUserFromCookie: (request, cookieName) => {
    const token = request.cookies.get(cookieName)?.value;
    return token;
  },

  // Create secure cookie
  createSecureCookie: (response, name, value, options = {}) => {
    response.cookies.set(name, value, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      ...options
    });
    return response;
  },

  // Clear cookie
  clearCookie: (response, name) => {
    response.cookies.set(name, '', {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });
    return response;
  }
};

// File upload utilities
export const FileUpload = {
  // Validate file
  validateFile: (file, config) => {
    const { allowedTypes, maxSize, required = true } = config;
    
    if (required && !file) {
      return { isValid: false, error: 'File is required' };
    }
    
    if (!file) {
      return { isValid: true };
    }
    
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }
    
    if (maxSize && file.size > maxSize) {
      return { 
        isValid: false, 
        error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB` 
      };
    }
    
    return { isValid: true };
  },

  // Process file upload
  processFile: async (file) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const os = require('os');
    const path = require('path');
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}_${file.name}`);
    require('fs').writeFileSync(tempFilePath, buffer);
    
    return { tempFilePath, buffer };
  },

  // Clean up temp file
  cleanupTempFile: (tempFilePath) => {
    try {
      require('fs').unlinkSync(tempFilePath);
    } catch (error) {
      console.error('Failed to clean up temp file:', error);
    }
  }
};

// Database utilities
export const Database = {
  // Safe database operation
  safeOperation: async (operation) => {
    try {
      return await operation();
    } catch (error) {
      console.error('❌ Database operation failed:', error);
      throw error;
    }
  },

  // Check if document exists
  exists: async (model, query) => {
    const count = await model.countDocuments(query);
    return count > 0;
  },

  // Find with pagination
  findWithPagination: async (model, query = {}, options = {}) => {
    const { page = 1, limit = 50, sort = { createdAt: -1 }, select } = options;
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      model.find(query)
        .select(select)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .lean(),
      model.countDocuments(query)
    ]);
    
    return { data, total, page, limit };
  }
};

// Logging utilities
export const Logger = {
  info: (message, data = {}) => {
    console.log(`ℹ️ ${message}`, data);
  },

  error: (message, error = {}) => {
    console.error(`❌ ${message}`, error);
  },

  warn: (message, data = {}) => {
    console.warn(`⚠️ ${message}`, data);
  },

  success: (message, data = {}) => {
    console.log(`✅ ${message}`, data);
  },

  request: (method, path, ip, requestId) => {
    console.log(`📝 ${method} ${path} - IP: ${ip} - ID: ${requestId}`);
  }
}; 