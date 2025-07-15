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
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
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
      });

      if (!tokenResponse.ok) {
        throw new Error(`GitHub token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json() as GitHubTokenResponse;

      if (tokenData.access_token) {
        // 获取用户信息
        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${tokenData.access_token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user info: ${userResponse.status}`);
        }

        const userData = await userResponse.json() as GitHubUser;

        return {
          access_token: tokenData.access_token,
          user: userData
        };
      } else {
        throw new Error('No access token received from GitHub');
      }
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
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

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