# Vercel 部署指南

## 最新修复内容 (2025-07-15)

### 主要问题解决方案

1. **修复了 Vercel 运行时版本错误** (`vercel.json`)
   - 错误: `Function Runtimes must have a valid version`
   - 解决: 使用完整版本号 `@vercel/node@3.0.0`
   - 回到 `builds` 配置，因为这是当前推荐的方式
   - 使用 `routes` 而不是 `rewrites`

2. **修复了 Node.js 版本兼容性** (`package.json`)
   - 将 Node.js 版本从 `>=18.0.0` 改为 `18.x`
   - 将模块类型从 `module` 改为 `commonjs`

3. **更新了 TypeScript 配置** (`tsconfig.json`)
   - 将 target 从 `ES2022` 改为 `ES2020`
   - 将 module 从 `ESNext` 改为 `CommonJS`
   - 添加了 `lib: ["ES2020"]` 配置

4. **修复了 API 导出方式** (`api/index.ts`)
   - 添加了 CommonJS 导出以确保兼容性
   - 同时支持 ES6 和 CommonJS 模块系统

5. **修复了 TypeScript 类型错误**
   - 在 `src/utils/github.ts` 中使用类型断言
   - 在 `src/utils/umami.ts` 中修复 JSON 响应类型

## 之前的修复内容

1. **创建了专门的 Vercel API 入口文件** (`api/index.ts`)
   - 移除了静态文件服务，避免与 API 路由冲突
   - 正确配置了环境变量处理
   - 添加了中文错误消息

2. **修复了 TypeScript 配置**
   - 包含了 `api` 目录
   - 移除了 `rootDir` 限制

## 部署步骤

### 1. 确保环境变量已设置
在 Vercel 项目设置中添加以下环境变量：
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
UMAMI_WEBSITE_ID=your_umami_website_id
UMAMI_API_TOKEN=your_umami_api_token
UMAMI_API_URL=your_umami_api_url
```

### 2. 构建项目
```bash
npm run build
```

### 3. 部署到 Vercel
```bash
# 如果还没有安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 4. 或者通过 Git 自动部署
如果您的项目连接到 Git 仓库，只需推送更改：
```bash
git add .
git commit -m "修复 Vercel API 部署问题"
git push origin main
```

### 3. 测试 API 端点
部署完成后，测试以下端点：

- **健康检查**: `GET https://your-domain.vercel.app/`
- **Token 交换**: `POST https://your-domain.vercel.app/appweb/auth/exchange-token`
- **Token 验证**: `POST https://your-domain.vercel.app/appweb/auth/validate-token`
- **分析数据**: `GET https://your-domain.vercel.app/api/analytics/stats`

## 主要修复

### 问题 1: 部署检查失败
**原因**: Vercel 配置中的运行时版本格式不正确
**解决**: 更新了 vercel.json，使用完整版本号 `@vercel/node@3.0.0`

### 问题 2: Node.js 版本兼容性
**原因**: 项目使用了 ESM 模块，但 Vercel 默认使用 CommonJS
**解决**: 将项目配置为 CommonJS，并更新了 Node.js 版本要求

### 问题 3: TypeScript 类型错误
**原因**: 严格模式下 JSON 解析返回 `unknown` 类型
**解决**: 使用类型断言处理 API 响应

### 问题 4: 404 错误
**原因**: Vercel 配置指向了错误的入口文件
**解决**: 创建了专门的 `api/index.ts` 作为 Vercel 入口

### 问题 5: 返回 HTML 而不是 JSON
**原因**: 静态文件服务中间件干扰了 API 路由
**解决**: 在 Vercel 入口文件中移除了静态文件服务

### 问题 6: 中文错误消息
**原因**: 错误处理没有正确的中文消息
**解决**: 更新了 404 和错误处理器，添加了详细的中文错误信息

## 验证部署
使用提供的测试脚本验证部署：
```bash
node test-vercel-api.js
```

现在您的 API 应该能正确响应 JSON 格式的数据，并且所有端点都能正常工作。
