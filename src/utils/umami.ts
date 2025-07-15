import { UmamiMetrics } from '../types';

export class UmamiAPI {
  private websiteId: string;
  private apiToken: string;
  private apiUrl: string;

  constructor(websiteId: string, apiToken: string, apiUrl: string = 'https://umami.lacs.cc') {
    this.websiteId = websiteId;
    this.apiToken = apiToken;
    this.apiUrl = apiUrl;
  }

  /**
   * 获取页面访问量数据
   */
  async getPageMetrics(page: string): Promise<UmamiMetrics> {
    try {
      const url = `${this.apiUrl}/api/websites/${this.websiteId}/metrics?page=${encodeURIComponent(page)}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Umami API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // 根据 Umami API 响应格式调整
      return {
        pageviews: data.pageviews || 0,
        visitors: data.visitors || 0,
        sessions: data.sessions || 0,
        bounceRate: data.bounceRate || 0,
        avgSession: data.avgSession || 0
      };
    } catch (error) {
      console.error('Umami API error:', error);
      throw error;
    }
  }

  /**
   * 获取网站总体统计
   */
  async getWebsiteStats(): Promise<UmamiMetrics> {
    try {
      const url = `${this.apiUrl}/api/websites/${this.websiteId}/stats`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Umami API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        pageviews: data.pageviews || 0,
        visitors: data.visitors || 0,
        sessions: data.sessions || 0,
        bounceRate: data.bounceRate || 0,
        avgSession: data.avgSession || 0
      };
    } catch (error) {
      console.error('Umami API error:', error);
      throw error;
    }
  }

  /**
   * 获取热门页面列表
   */
  async getTopPages(limit: number = 10): Promise<Array<{ page: string; pageviews: number }>> {
    try {
      const url = `${this.apiUrl}/api/websites/${this.websiteId}/pages?limit=${limit}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Umami API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      return data.pages || [];
    } catch (error) {
      console.error('Umami API error:', error);
      throw error;
    }
  }
} 