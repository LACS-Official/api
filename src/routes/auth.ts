import { Hono } from 'hono';
import { GitHubAPI } from '../utils/github';
import { ApiResponse, GitHubAuthResponse, Env } from '../types/index';

const auth = new Hono<{ Bindings: Env }>();

// 交换 GitHub 访问令牌
auth.post('/exchange-token', async (c) => {
  console.log(`[AUTH] 收到 exchange-token 请求: ${c.req.path}`);
  
  try {
    // 检查请求体是否为空
    const contentType = c.req.header('content-type');
    console.log(`[AUTH] Content-Type: ${contentType}`);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.log(`[AUTH] 错误: 无效的 Content-Type`);
      return c.json<ApiResponse>({
        success: false,
        error: '请求必须包含 application/json 内容类型'
      }, 400);
    }

    let body;
    try {
      body = await c.req.json();
      console.log(`[AUTH] 请求体:`, body);
    } catch (parseError) {
      console.log(`[AUTH] JSON 解析错误:`, parseError);
      return c.json<ApiResponse>({
        success: false,
        error: '请求体必须是有效的 JSON 格式'
      }, 400);
    }

    const { code } = body;
    
    if (!code) {
      console.log(`[AUTH] 错误: 缺少授权码`);
      return c.json<ApiResponse>({
        success: false,
        error: '缺少授权码'
      }, 400);
    }

    const clientId = c.env.GITHUB_CLIENT_ID;
    const clientSecret = c.env.GITHUB_CLIENT_SECRET;

    console.log(`[AUTH] 环境变量检查: clientId=${!!clientId}, clientSecret=${!!clientSecret}`);

    if (!clientId || !clientSecret) {
      console.log(`[AUTH] 错误: GitHub 配置缺失`);
      return c.json<ApiResponse>({
        success: false,
        error: 'GitHub 配置缺失'
      }, 500);
    }

    console.log(`[AUTH] 开始交换令牌...`);
    const githubAPI = new GitHubAPI(clientId, clientSecret);
    let authResponse: GitHubAuthResponse;
    try {
      authResponse = await githubAPI.exchangeToken(code);
    } catch (error) {
      console.error('[AUTH] GitHub token exchange error:', error);
      // 根据错误类型返回不同的状态码
      const statusCode = error instanceof Error && error.message.includes('超时') ? 408 : 400;
      return c.json<ApiResponse>({
        success: false,
        error: error instanceof Error ? error.message : 'GitHub认证失败'
      }, statusCode);
    }

    console.log(`[AUTH] 令牌交换成功`);
    return c.json<ApiResponse<GitHubAuthResponse>>({
      success: true,
      data: authResponse
    });
  } catch (error) {
    console.error('[AUTH] Token exchange error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, 500);
  }
});

// 验证访问令牌
auth.post('/validate-token', async (c) => {
  console.log(`[AUTH] 收到 validate-token 请求: ${c.req.path}`);
  
  try {
    // 检查请求体是否为空
    const contentType = c.req.header('content-type');
    console.log(`[AUTH] Content-Type: ${contentType}`);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.log(`[AUTH] 错误: 无效的 Content-Type`);
      return c.json<ApiResponse>({
        success: false,
        error: '请求必须包含 application/json 内容类型'
      }, 400);
    }

    let body;
    try {
      body = await c.req.json();
      console.log(`[AUTH] 请求体:`, body);
    } catch (parseError) {
      console.log(`[AUTH] JSON 解析错误:`, parseError);
      return c.json<ApiResponse>({
        success: false,
        error: '请求体必须是有效的 JSON 格式'
      }, 400);
    }

    const { token } = body;
    
    if (!token) {
      console.log(`[AUTH] 错误: 缺少访问令牌`);
      return c.json<ApiResponse>({
        success: false,
        error: '缺少访问令牌'
      }, 400);
    }

    console.log(`[AUTH] 开始验证令牌...`);
    const githubAPI = new GitHubAPI('', ''); // 验证令牌不需要 client credentials
    const user = await githubAPI.validateToken(token);

    console.log(`[AUTH] 令牌验证成功`);
    return c.json<ApiResponse>({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('[AUTH] Token validation error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '令牌验证失败'
    }, 401);
  }
});

export default auth; 
