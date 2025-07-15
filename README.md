# Hugo 网站 API 服务

基于 Hono 框架构建的轻量级 API 服务，为 Hugo 网站提供 GitHub OAuth 认证和 Umami 访问量统计功能。

## ✨ 功能特性

- 🔐 GitHub OAuth 认证
- 📊 Umami 访问量统计
- 🚀 Vercel 一键部署
- ⚡ TypeScript 支持
- 🌐 CORS 跨域支持
- 📝 详细日志记录

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 设置环境变量
cp env.example .env
# 编辑 .env 文件，添加必要的环境变量

# 启动开发服务器
npm run dev
```

### 环境变量配置

在 `.env` 文件中设置以下环境变量：

```env
# GitHub OAuth 配置
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Umami 分析配置
UMAMI_WEBSITE_ID=your_umami_website_id
UMAMI_API_TOKEN=your_umami_api_token
UMAMI_API_URL=https://umami.lacs.cc
```

## 📡 API 端点

### 认证相关
- `POST /appweb/auth/exchange-token` - 交换 GitHub OAuth 令牌
- `GET /appweb/auth/user` - 获取用户信息

### 统计相关
- `GET /api/analytics/pageviews` - 获取页面访问量
- `GET /api/analytics/stats` - 获取网站统计
- `GET /api/analytics/top-pages` - 获取热门页面

### 其他
- `GET /` - 健康检查

## 🚀 部署到 Vercel

1. **准备项目**
   ```bash
   git add .
   git commit -m "准备部署"
   ```

2. **连接 Vercel**
   - 在 [Vercel](https://vercel.com) 创建新项目
   - 连接您的 GitHub 仓库
   - 设置环境变量（在 Vercel 控制台中）

3. **环境变量设置**
   在 Vercel 项目设置中添加以下环境变量：
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `UMAMI_WEBSITE_ID`
   - `UMAMI_API_TOKEN`
   - `UMAMI_API_URL`

4. **自动部署**
   - Vercel 会自动检测项目类型并部署
   - 每次推送到主分支都会触发自动部署

## 🛠️ 开发脚本

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 运行测试
npm test

# 生产启动
npm start
```

## 📁 项目结构

```
src/
├── index.ts          # 主应用入口
├── server.ts         # 本地开发服务器
├── routes/           # API 路由
│   ├── auth.ts       # 认证相关路由
│   └── analytics.ts  # 统计相关路由
├── types/            # TypeScript 类型定义
└── utils/            # 工具函数
    ├── github.ts     # GitHub API 工具
    └── umami.ts      # Umami API 工具
```

## 📄 许可证

MIT 