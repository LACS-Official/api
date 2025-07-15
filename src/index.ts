import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { timing } from 'hono/timing';
import { Env } from './types';
import auth from './routes/auth';
import analytics from './routes/analytics';

// 创建 Hono 应用实例
const app = new Hono<{ Bindings: Env }>();

// 添加环境变量中间件
app.use('*', async (c, next) => {
  // 在本地开发环境中，从 process.env 获取环境变量
  if (process.env.NODE_ENV === 'development') {
    c.env = {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
      UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID || '',
      UMAMI_API_TOKEN: process.env.UMAMI_API_TOKEN || '',
      UMAMI_API_URL: process.env.UMAMI_API_URL || ''
    };
  }
  await next();
});

// 中间件
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', timing());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:1313', 'https://your-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 静态文件服务 - 为 oauth-example.html 提供访问
app.get('/oauth-example.html', async (c) => {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const htmlPath = path.join(process.cwd(), 'oauth-example.html');
    const htmlContent = await fs.readFile(htmlPath, 'utf-8');
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: '文件不存在',
      path: '/oauth-example.html'
    }, 404);
  }
});

// 健康检查
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Hugo 网站 API 服务运行正常',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/appweb/auth',
      analytics: '/api/analytics',
      health: '/'
    }
  });
});

// API 路由
app.route('/appweb/auth', auth);
app.route('/api/analytics', analytics);

// 404 处理
app.notFound((c) => {
  return c.json({
    success: false,
    error: '接口不存在',
    path: c.req.path,
    availableEndpoints: [
      'GET /',
      'GET /oauth-example.html',
      'POST /appweb/auth/exchange-token',
      'POST /appweb/auth/validate-token',
      'GET /api/analytics/pageviews',
      'GET /api/analytics/stats',
      'GET /api/analytics/top-pages'
    ]
  }, 404);
});

// 错误处理
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({
    success: false,
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试',
    timestamp: new Date().toISOString()
  }, 500);
});

export default app; 