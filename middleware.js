import { NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // requests per windowMs
  skipPaths: ['/api/health', '/api/upload'], // paths to skip rate limiting
};

// Security headers configuration
const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; media-src 'self' https:; connect-src 'self' https:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';",
};

// Authentication paths that require verification
const AUTH_PATHS = [
  '/admin',
  '/student-dashboard',
  '/teacher-dashboard',
];

// Public paths that don't need authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/student-login',
  '/teacher-login',
  '/forgot-password',
  '/api/auth',
  '/api/courses',
  '/api/upload',
  '/api/health',
];

// Rate limiting function
function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimitStore.set(ip, validRequests);
  
  // Check if limit exceeded
  if (validRequests.length >= RATE_LIMIT_CONFIG.maxRequests) {
    return false;
  }
  
  // Add current request
  validRequests.push(now);
  return true;
}

// Get client IP
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown';
}

// Check if path requires authentication
function requiresAuth(pathname) {
  // Check if it's a public path
  if (PUBLIC_PATHS.some(publicPath => pathname.startsWith(publicPath))) {
    return false;
  }
  
  // Check if it's an auth path
  return AUTH_PATHS.some(authPath => pathname.startsWith(authPath));
}

// Check if path should skip rate limiting
function shouldSkipRateLimit(pathname) {
  return RATE_LIMIT_CONFIG.skipPaths.some(skipPath => pathname.startsWith(skipPath));
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  
  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Apply security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }
  
  // Rate limiting (skip for certain paths)
  if (!shouldSkipRateLimit(pathname)) {
    if (!checkRateLimit(ip)) {
      console.log(`🚫 Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many requests. Please try again later.' 
        },
        { 
          status: 429,
          headers: response.headers
        }
      );
    }
  }
  
  // Authentication check for protected routes
  if (requiresAuth(pathname)) {
    const authCookie = request.cookies.get('shoora_auth')?.value || 
                      request.cookies.get('admin_auth')?.value;
    
    if (!authCookie) {
      console.log(`🔒 Unauthorized access attempt to: ${pathname}`);
      
      // Redirect to appropriate login page
      let loginUrl = '/login';
      if (pathname.startsWith('/admin')) {
        loginUrl = '/login';
      } else if (pathname.startsWith('/student-dashboard')) {
        loginUrl = '/student-login';
      } else if (pathname.startsWith('/teacher-dashboard')) {
        loginUrl = '/teacher-login';
      }
      
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
  }
  
  // Performance optimization: Add cache headers for static assets
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Add request ID for tracking
  const requestId = Math.random().toString(36).substring(2, 15);
  response.headers.set('X-Request-ID', requestId);
  
  // Log important requests
  if (pathname.startsWith('/api/') || requiresAuth(pathname)) {
    console.log(`📝 ${request.method} ${pathname} - IP: ${ip} - ID: ${requestId}`);
  }
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 