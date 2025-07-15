# Hugo 网站 API 服务

基于 Hono 框架构建的现代化 API 服务，提供 GitHub OAuth 认证和 Umami 网站分析功能。

## 🚀 功能特性

- **GitHub OAuth 认证** - 完整的 OAuth 2.0 流程
- **Umami 网站分析** - 获取网站访问统计和页面分析
- **TypeScript 支持** - 完整的类型安全
- **现代化架构** - 基于 Hono 框架
- **部署就绪** - 支持 Vercel 部署

## 📋 环境要求

- Node.js >= 18.0.0
- TypeScript 5.3+

## 🛠️ 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量配置

创建 `.env` 文件：

```env
# GitHub OAuth 配置
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Umami 分析配置
UMAMI_WEBSITE_ID=your_umami_website_id
UMAMI_API_TOKEN=your_umami_api_token
UMAMI_API_URL=https://umami.lacs.cc

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 3. 开发模式运行

```bash
npm run dev
```

### 4. 生产构建

```bash
npm run build
npm start
```

## 📚 API 文档

### 基础信息

- **基础 URL**: `http://localhost:3000` (开发环境)
- **内容类型**: `application/json`
- **认证**: 部分接口需要 GitHub 访问令牌

### 健康检查

```http
GET /
```

**响应示例:**
```json
{
  "success": true,
  "message": "Hugo 网站 API 服务运行正常",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "endpoints": {
    "auth": "/appweb/auth",
    "analytics": "/api/analytics",
    "health": "/"
  }
}
```

### GitHub OAuth 认证

#### 1. 交换访问令牌

```http
POST /appweb/auth/exchange-token
Content-Type: application/json

{
  "code": "github_authorization_code"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "access_token": "gho_xxxxxxxxxxxxxxxxxxxx",
    "user": {
      "id": 123456,
      "login": "username",
      "name": "User Name",
      "email": "user@example.com",
      "avatar_url": "https://avatars.githubusercontent.com/u/123456?v=4",
      "html_url": "https://github.com/username",
      "type": "User",
      "public_repos": 10,
      "followers": 5,
      "following": 3,
      "created_at": "2020-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### 2. 验证访问令牌

```http
POST /appweb/auth/validate-token
Content-Type: application/json

{
  "token": "github_access_token"
}
```

### Umami 网站分析

#### 1. 获取页面访问量

```http
GET /api/analytics/pageviews?page=/blog/post-1
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "pageviews": 150,
    "visitors": 120,
    "sessions": 135,
    "bounceRate": 0.25,
    "avgSession": 180
  }
}
```

#### 2. 获取网站总体统计

```http
GET /api/analytics/stats
```

#### 3. 获取热门页面

```http
GET /api/analytics/top-pages?limit=10
```

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "page": "/",
      "pageviews": 500
    },
    {
      "page": "/blog/post-1",
      "pageviews": 150
    }
  ]
}
```

## 🔧 开发指南

### 项目结构

```
src/
├── index.ts          # 主应用入口
├── server.ts         # 服务器启动文件
├── routes/           # 路由模块
│   ├── auth.ts       # GitHub 认证路由
│   └── analytics.ts  # Umami 分析路由
├── utils/            # 工具类
│   ├── github.ts     # GitHub API 工具
│   └── umami.ts      # Umami API 工具
└── types/            # TypeScript 类型定义
    └── index.ts      # 类型定义文件
```

### 添加新路由

1. 在 `src/routes/` 目录下创建新的路由文件
2. 在 `src/index.ts` 中注册路由
3. 更新类型定义（如需要）

### 环境变量

- `GITHUB_CLIENT_ID`: GitHub OAuth 应用客户端 ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth 应用客户端密钥
- `UMAMI_WEBSITE_ID`: Umami 网站 ID
- `UMAMI_API_TOKEN`: Umami API 令牌
- `UMAMI_API_URL`: Umami API 地址（可选，默认为 https://umami.lacs.cc）

## 🚀 部署

### Vercel 部署

项目已配置 `vercel.json`，可直接部署到 Vercel：

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 其他平台

项目支持部署到任何支持 Node.js 的平台：

- Railway
- Render
- Heroku
- 自托管服务器

## 🧪 测试

### 运行测试

```bash
npm test
```

### 手动测试

1. 启动开发服务器：`npm run dev`
2. 访问 `http://localhost:3000/oauth-example.html`
3. 测试 GitHub OAuth 流程
4. 测试分析 API 接口

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请提交 Issue 或联系开发者。 