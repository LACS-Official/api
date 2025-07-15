import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import app from './index';

// 加载环境变量
config();

const port = process.env.PORT || 3000;

console.log(`🚀 服务器启动在 http://localhost:${port}`);

// 仅本地开发使用，Vercel 部署不需要监听端口
if (process.env.VERCEL !== '1') {
  serve({
    fetch: app.fetch,
    port: Number(port)
  });
}

// Vercel 部署时只需导出 handler
export default app.fetch;
