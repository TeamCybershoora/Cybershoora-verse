# Production Deployment Guide

## 🚀 Optimized Production Setup

This guide will help you deploy your Shoora Tech application to production with all optimizations and security measures in place.

## 📋 Prerequisites

- Node.js 20.x or higher
- MongoDB database (Atlas recommended)
- Cloudinary account
- Domain name with SSL certificate
- Vercel account (recommended) or other hosting platform

## 🔧 Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Database Configuration
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
JWT_EXPIRES_IN=60d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Application Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Shoora Tech
NEXT_PUBLIC_APP_VERSION=1.0.0

# Security Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=https://yourdomain.com

# Performance Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## 🏗️ Build and Deploy

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

### 3. Start Production Server
```bash
npm start
```

### 4. Or use the production script
```bash
npm run production
```

## 🔒 Security Optimizations Implemented

### API Security
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ JWT token authentication
- ✅ Secure cookie settings
- ✅ XSS protection headers
- ✅ CSRF protection

### File Upload Security
- ✅ File type validation
- ✅ File size limits
- ✅ Secure file storage (Cloudinary)
- ✅ Automatic old file cleanup

### Database Security
- ✅ Connection pooling
- ✅ Query optimization
- ✅ Input sanitization
- ✅ Secure connection strings

## 📊 Performance Optimizations

### Bundle Optimization
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Bundle analysis
- ✅ Image optimization
- ✅ Font optimization
- ✅ CSS optimization

### Caching Strategy
- ✅ Static asset caching
- ✅ API response caching
- ✅ Database query caching
- ✅ CDN integration ready

### Monitoring
- ✅ Health check endpoints
- ✅ Performance metrics
- ✅ Error tracking
- ✅ Request logging

## 🔄 API Endpoints

### Unified APIs (New)
- `POST /api/auth` - Login for all user types
- `DELETE /api/auth` - Logout
- `GET /api/auth` - Verify token
- `POST /api/upload` - File upload (all types)
- `DELETE /api/upload` - File deletion
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users` - Update user
- `DELETE /api/users` - Delete user
- `GET /api/health` - Health check

### Legacy APIs (Deprecated)
- `/api/admin/login` → Use `/api/auth`
- `/api/admin/logout` → Use `/api/auth`
- `/api/admin/profile` → Use `/api/users`
- `/api/student/[id]` → Use `/api/users`
- `/api/teacher/[id]` → Use `/api/users`
- `/api/admin/homepage/upload` → Use `/api/upload`
- `/api/admin/company-logo/upload` → Use `/api/upload`
- `/api/admin/delete-cloudinary` → Use `/api/upload`

## 🚀 Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Railway
1. Connect your repository
2. Set environment variables
3. Deploy with automatic scaling

### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure environment variables
3. Set build command: `npm run build`
4. Set run command: `npm start`

### AWS/Google Cloud
1. Build Docker image
2. Deploy to container service
3. Configure load balancer
4. Set up monitoring

## 📈 Monitoring and Maintenance

### Health Checks
- Monitor `/api/health` endpoint
- Set up alerts for unhealthy status
- Monitor response times

### Logs
- Application logs in console
- Error tracking with Sentry (optional)
- Performance monitoring

### Database
- Regular backups
- Monitor connection pool
- Optimize slow queries

### Security
- Regular security updates
- Monitor failed login attempts
- Review access logs

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (20.x required)
   - Clear `.next` folder: `npm run clean`
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Verify database credentials

3. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Verify file types

4. **Authentication Issues**
   - Check JWT_SECRET configuration
   - Verify cookie settings
   - Check CORS configuration

### Performance Issues
- Use bundle analyzer: `npm run analyze`
- Monitor memory usage
- Check database query performance
- Optimize images and assets

## 📞 Support

For production issues:
1. Check health endpoint: `/api/health`
2. Review application logs
3. Monitor error rates
4. Contact development team

## 🔄 Migration Guide

### From Old APIs to New APIs

1. **Authentication**
   ```javascript
   // Old
   fetch('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) })
   
   // New
   fetch('/api/auth', { method: 'POST', body: JSON.stringify({ email, password, userType: 'admin' }) })
   ```

2. **File Upload**
   ```javascript
   // Old
   const formData = new FormData();
   formData.append('image', file);
   fetch('/api/admin/homepage/upload', { method: 'POST', body: formData })
   
   // New
   const formData = new FormData();
   formData.append('file', file);
   formData.append('type', 'homepage');
   fetch('/api/upload', { method: 'POST', body: formData })
   ```

3. **User Management**
   ```javascript
   // Old
   fetch(`/api/student/${id}`, { method: 'PUT', body: JSON.stringify(data) })
   
   // New
   fetch(`/api/users?id=${id}&type=student`, { method: 'PUT', body: JSON.stringify(data) })
   ```

## ✅ Production Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] File upload working
- [ ] Authentication working
- [ ] Health check passing
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Security headers verified
- [ ] Performance tested
- [ ] Error handling verified
- [ ] Logging configured
- [ ] Rate limiting tested
- [ ] CORS configured
- [ ] Cache headers set
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] SEO meta tags added
- [ ] Analytics configured 