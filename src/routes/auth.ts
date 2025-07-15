import { Hono } from 'hono';
import { GitHubAPI } from '../utils/github.js';
import { ApiResponse, GitHubAuthResponse, Env } from '../types/index.js';

const auth = new Hono<{ Bindings: Env }>();

// 交换 GitHub 访问令牌
auth.post('/exchange-token', async (c) => {
  try {
    // 检查请求体是否为空
    const contentType = c.req.header('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return c.json<ApiResponse>({
        success: false,
        error: '请求必须包含 application/json 内容类型'
      }, 400);
    }

    let body;
    try {
      body = await c.req.json();
    } catch (parseError) {
      return c.json<ApiResponse>({
        success: false,
        error: '请求体必须是有效的 JSON 格式'
      }, 400);
    }

    const { code } = body;
    
    if (!code) {
      return c.json<ApiResponse>({
        success: false,
        error: '缺少授权码'
      }, 400);
    }

    const clientId = c.env.GITHUB_CLIENT_ID;
    const clientSecret = c.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return c.json<ApiResponse>({
        success: false,
        error: 'GitHub 配置缺失'
      }, 500);
    }

    const githubAPI = new GitHubAPI(clientId, clientSecret);
    const authResponse: GitHubAuthResponse = await githubAPI.exchangeToken(code);

    return c.json<ApiResponse<GitHubAuthResponse>>({
      success: true,
      data: authResponse
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, 500);
  }
});

// 验证访问令牌
auth.post('/validate-token', async (c) => {
  try {
    // 检查请求体是否为空
    const contentType = c.req.header('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return c.json<ApiResponse>({
        success: false,
        error: '请求必须包含 application/json 内容类型'
      }, 400);
    }

    let body;
    try {
      body = await c.req.json();
    } catch (parseError) {
      return c.json<ApiResponse>({
        success: false,
        error: '请求体必须是有效的 JSON 格式'
      }, 400);
    }

    const { token } = body;
    
    if (!token) {
      return c.json<ApiResponse>({
        success: false,
        error: '缺少访问令牌'
      }, 400);
    }

    const githubAPI = new GitHubAPI('', ''); // 验证令牌不需要 client credentials
    const user = await githubAPI.validateToken(token);

    return c.json<ApiResponse>({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '令牌验证失败'
    }, 401);
  }
});

export default auth; 