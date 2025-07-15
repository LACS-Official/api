# Vercel 部署指南

## 修复内容

1. **创建了专门的 Vercel API 入口文件** (`api/index.ts`)
   - 移除了静态文件服务，避免与 API 路由冲突
   - 正确配置了环境变量处理
   - 添加了中文错误消息

2. **更新了 Vercel 配置** (`vercel.json`)
   - 将构建入口改为 `api/index.ts`
   - 保持了 CORS 配置

3. **修复了 TypeScript 配置**
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

### 问题 1: 404 错误
**原因**: Vercel 配置指向了错误的入口文件
**解决**: 创建了专门的 `api/index.ts` 作为 Vercel 入口

### 问题 2: 返回 HTML 而不是 JSON
**原因**: 静态文件服务中间件干扰了 API 路由
**解决**: 在 Vercel 入口文件中移除了静态文件服务

### 问题 3: 中文错误消息
**原因**: 错误处理没有正确的中文消息
**解决**: 更新了 404 和错误处理器，添加了详细的中文错误信息

## 验证部署
使用提供的测试脚本验证部署：
```bash
node test-vercel-api.js
```

现在您的 API 应该能正确响应 JSON 格式的数据，并且所有端点都能正常工作。
