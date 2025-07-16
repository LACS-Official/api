import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { timing } from 'hono/timing';
import { Env } from './types/index';
import auth from './routes/auth';
import analytics from './routes/analytics';
import { serveStatic } from '@hono/node-server/serve-static';
import { handle } from '@hono/node-server/vercel';

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
  } else {
    // 在Vercel环境中，确保环境变量可用
    c.env = {
      GITHUB_CLIENT_ID: c.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || '',
      GITHUB_CLIENT_SECRET: c.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET || '',
      UMAMI_WEBSITE_ID: c.env.UMAMI_WEBSITE_ID || process.env.UMAMI_WEBSITE_ID || '',
      UMAMI_API_TOKEN: c.env.UMAMI_API_TOKEN || process.env.UMAMI_API_TOKEN || '',
      UMAMI_API_URL: c.env.UMAMI_API_URL || process.env.UMAMI_API_URL || ''
    };
  }
  await next();
});

// 中间件
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', timing());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:1313', 'https://your-domain.com', 'https://lacs.cc', 'https://*.lacs.cc'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 调试中间件 - 记录所有请求
app.use('*', async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.path}`);
  await next();
});

// 让根路径返回服务已开启的 JSON 信息
app.get('/', (c) => {
  return c.json({
    success: true,
    message: '服务已开启',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 只对非根路径的 GET 请求提供静态服务
app.use(async (c, next) => {
  if (c.req.path !== '/') {
    return serveStatic({ root: './public' })(c, next);
  }
  return next();
});

// 静态文件支持 favicon.ico
app.use('/favicon.ico', serveStatic({ root: './public' }));

// API 路由 - 确保在静态文件中间件之后
app.route('/appweb/auth', auth);
app.route('/api/analytics', analytics);

// 404 处理
app.notFound((c) => {
  console.log(`[404] 路径不存在: ${c.req.method} ${c.req.path}`);
  return c.json({
    success: false,
    error: '接口不存在',
    path: c.req.path,
    method: c.req.method,
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