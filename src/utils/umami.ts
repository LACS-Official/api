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
      // 设置10秒超时时间
      const response = await Promise.race([
        fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Umami页面数据请求超时')), 10000)
        )
      ]) as Response;

      if (!response.ok) {
        throw new Error(`Umami API request failed: ${response.status}`);
      }

      const data = await response.json() as any;

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
      
      // 设置10秒超时时间
      const response = await Promise.race([
        fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Umami网站统计请求超时')), 10000)
        )
      ]) as Response;

      if (!response.ok) {
        throw new Error(`Umami API request failed: ${response.status}`);
      }

      const data = await response.json() as any;

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
      
      // 设置10秒超时时间
      const response = await Promise.race([
        fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Umami热门页面请求超时')), 10000)
        )
      ]) as Response;
      

      if (!response.ok) {
        throw new Error(`Umami API request failed: ${response.status}`);
      }

      const data = await response.json() as any;

      return data.pages || [];
    } catch (error) {
      console.error('Umami API error:', error);
      throw error;
    }
  }
}