import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import app from './index';

// 加载环境变量
config();

const port = process.env.PORT || 3000;

console.log(`🚀 服务器启动在 http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: Number(port)
}); 