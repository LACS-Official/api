# API 使用示例

## 1. GitHub OAuth 认证流程

### 步骤 1: 重定向用户到 GitHub
```javascript
const clientId = 'your_github_client_id';
const redirectUri = 'https://your-domain.com/admin/callback.html';
const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;

window.location.href = authUrl;
```

### 步骤 2: 处理回调并交换令牌
```javascript
// 在回调页面中
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
  const response = await fetch('/appweb/auth/exchange-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  });

  const data = await response.json();
  
  if (data.success) {
    // 保存令牌和用户信息
    localStorage.setItem('github_token', data.data.access_token);
    localStorage.setItem('github_user', JSON.stringify(data.data.user));
  }
}
```

## 2. 获取访问量统计

```javascript
// 获取特定页面访问量
const response = await fetch('/api/analytics/pageviews?page=/software/visual-studio-code/');
const result = await response.json();

if (result.success) {
  console.log('页面访问量:', result.data);
}

// 获取网站总体统计
const statsResponse = await fetch('/api/analytics/stats');
const statsResult = await statsResponse.json();

if (statsResult.success) {
  console.log('网站统计:', statsResult.data);
}

// 获取热门页面
const topPagesResponse = await fetch('/api/analytics/top-pages?limit=10');
const topPagesResult = await topPagesResponse.json();

if (topPagesResult.success) {
  console.log('热门页面:', topPagesResult.data);
}
```

## 3. 错误处理

```javascript
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    if (!data.success) {
      throw new Error(data.error || '请求失败');
    }
    
    return data;
  } catch (error) {
    console.error('API 调用失败:', error);
    throw error;
  }
}

// 使用示例
try {
  const result = await apiCall('/api/analytics/stats');
  console.log('成功:', result.data);
} catch (error) {
  console.error('失败:', error.message);
}
```

## 4. 环境变量配置

在 Vercel 控制台中设置以下环境变量：

```env
# GitHub OAuth 配置
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Umami 分析配置
UMAMI_WEBSITE_ID=your_umami_website_id
UMAMI_API_TOKEN=your_umami_api_token
UMAMI_API_URL=https://umami.lacs.cc
```

## 5. 本地开发

```bash
# 安装依赖
npm install

# 设置环境变量
cp env.example .env
# 编辑 .env 文件

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建项目
npm run build
```

## 6. 部署

```bash
# 使用部署脚本
chmod +x deploy.sh
./deploy.sh

# 或手动部署
npm run build
vercel --prod
``` 