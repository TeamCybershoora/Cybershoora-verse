import { NextResponse } from 'next/server';
import connectDB from '../../../lib/dbConnect.js';
import { testCloudinaryConnection } from '../../../lib/cloudinary.js';

export async function GET() {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: { status: 'unknown', responseTime: 0 },
      cloudinary: { status: 'unknown', responseTime: 0 },
      memory: { status: 'unknown', usage: 0 },
      disk: { status: 'unknown', usage: 0 }
    }
  };

  try {
    // Check database connectivity
    const dbStart = Date.now();
    try {
      await connectDB();
      health.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - dbStart
      };
    } catch (dbError) {
      health.checks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - dbStart,
        error: dbError.message
      };
      health.status = 'degraded';
    }

    // Check Cloudinary connectivity
    const cloudinaryStart = Date.now();
    try {
      await testCloudinaryConnection();
      health.checks.cloudinary = {
        status: 'healthy',
        responseTime: Date.now() - cloudinaryStart
      };
    } catch (cloudinaryError) {
      health.checks.cloudinary = {
        status: 'unhealthy',
        responseTime: Date.now() - cloudinaryStart,
        error: cloudinaryError.message
      };
      health.status = 'degraded';
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    health.checks.memory = {
      status: memUsagePercent < 80 ? 'healthy' : 'warning',
      usage: Math.round(memUsagePercent * 100) / 100,
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100
    };

    if (memUsagePercent > 90) {
      health.status = 'degraded';
    }

    // Overall response time
    health.responseTime = Date.now() - startTime;

    // Determine overall status
    const unhealthyChecks = Object.values(health.checks).filter(check => check.status === 'unhealthy');
    if (unhealthyChecks.length > 0) {
      health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });

  } catch (error) {
    console.error('❌ Health check error:', error);
    
    health.status = 'unhealthy';
    health.error = error.message;
    health.responseTime = Date.now() - startTime;

    return NextResponse.json(health, { status: 503 });
  }
}

// Detailed health check for admin monitoring
export async function POST(request) {
  try {
    const body = await request.json();
    const { detailed = false } = body;

    if (!detailed) {
      return NextResponse.json({
        success: false,
        message: 'Detailed health check requires detailed=true'
      }, { status: 400 });
    }

    const health = await GET(request);
    const healthData = await health.json();

    // Add additional detailed information
    const detailedHealth = {
      ...healthData,
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        pid: process.pid,
        title: process.title
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'not configured',
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured',
        JWT_SECRET: process.env.JWT_SECRET ? 'configured' : 'not configured'
      },
      performance: {
        cpuUsage: process.cpuUsage(),
        resourceUsage: process.resourceUsage()
      }
    };

    return NextResponse.json(detailedHealth, { status: health.status });

  } catch (error) {
    console.error('❌ Detailed health check error:', error);
    return NextResponse.json({
      success: false,
      message: 'Health check failed',
      error: error.message
    }, { status: 500 });
  }
} 