// GitHub 相关类型
export interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  html_url: string;
  type: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubAuthResponse {
  access_token: string;
  user: GitHubUser;
}



// Umami 相关类型
export interface UmamiMetrics {
  pageviews: number;
  visitors: number;
  sessions: number;
  bounceRate: number;
  avgSession: number;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 环境变量类型
export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  UMAMI_WEBSITE_ID?: string;
  UMAMI_API_TOKEN?: string;
  UMAMI_API_URL?: string;
} 