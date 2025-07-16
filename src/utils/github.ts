import { GitHubTokenResponse, GitHubUser, GitHubAuthResponse } from '../types';

export class GitHubAPI {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * 交换 GitHub 访问令牌
   */
  async exchangeToken(code: string): Promise<GitHubAuthResponse> {
    try {
      // 向 GitHub API 交换访问令牌
      // 设置5秒超时时间
      const tokenResponse = await Promise.race([
        fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code
          })
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('GitHub令牌交换请求超时')), 5000)
        )
       ]) as Response;

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`GitHub token exchange failed: ${tokenResponse.status} - ${errorText}`);
      }

      const tokenData = await tokenResponse.json() as GitHubTokenResponse & { error?: string; error_description?: string };

      if (tokenData.error) {
        throw new Error(tokenData.error_description || 'GitHub返回错误: ' + tokenData.error);
      }

      if (!tokenData.access_token) {
        throw new Error('未获取到 access_token');
      }

      // 获取用户信息
      // 设置5秒超时时间
      const userResponse = await Promise.race([
        fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${tokenData.access_token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('GitHub用户信息请求超时')), 5000)
        )
      ]) as Response;

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(`Failed to fetch user info: ${userResponse.status} - ${errorText}`);
      }

      const userData = await userResponse.json() as GitHubUser;

      return {
        access_token: tokenData.access_token,
        user: userData
      };
    } catch (error) {
      console.error('GitHub API error:', error);
      throw error;
    }
  }

  /**
   * 验证访问令牌
   */
  async validateToken(token: string): Promise<GitHubUser> {
    try {
      // 设置5秒超时时间
      const response = await Promise.race([
        fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('GitHub令牌验证请求超时')), 5000)
        )
      ]) as Response;

      if (!response.ok) {
        throw new Error(`Token validation failed: ${response.status}`);
      }

      return await response.json() as GitHubUser;
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  }
}
