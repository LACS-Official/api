import { Hono } from 'hono';
import { UmamiAPI } from '../utils/umami';
import { ApiResponse, UmamiMetrics, Env } from '../types';

const analytics = new Hono<{ Bindings: Env }>();

// 获取页面访问量数据
analytics.get('/pageviews', async (c) => {
  try {
    const { page } = c.req.query();
    
    if (!page) {
      return c.json<ApiResponse>({
        success: false,
        error: '缺少页面参数'
      }, 400);
    }

    const websiteId = c.env.UMAMI_WEBSITE_ID;
    const apiToken = c.env.UMAMI_API_TOKEN;
    const apiUrl = c.env.UMAMI_API_URL || 'https://umami.lacs.cc';

    if (!websiteId || !apiToken) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Umami 配置缺失'
      }, 500);
    }

    const umamiAPI = new UmamiAPI(websiteId, apiToken, apiUrl);
    const metrics: UmamiMetrics = await umamiAPI.getPageMetrics(page);

    return c.json<ApiResponse<UmamiMetrics>>({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Pageviews error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '获取访问量数据失败'
    }, 500);
  }
});

// 获取网站总体统计
analytics.get('/stats', async (c) => {
  try {
    const websiteId = c.env.UMAMI_WEBSITE_ID;
    const apiToken = c.env.UMAMI_API_TOKEN;
    const apiUrl = c.env.UMAMI_API_URL || 'https://umami.lacs.cc';

    if (!websiteId || !apiToken) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Umami 配置缺失'
      }, 500);
    }

    const umamiAPI = new UmamiAPI(websiteId, apiToken, apiUrl);
    const stats: UmamiMetrics = await umamiAPI.getWebsiteStats();

    return c.json<ApiResponse<UmamiMetrics>>({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '获取统计数据失败'
    }, 500);
  }
});

// 获取热门页面列表
analytics.get('/top-pages', async (c) => {
  try {
    const { limit = '10' } = c.req.query();
    const websiteId = c.env.UMAMI_WEBSITE_ID;
    const apiToken = c.env.UMAMI_API_TOKEN;
    const apiUrl = c.env.UMAMI_API_URL || 'https://umami.lacs.cc';

    if (!websiteId || !apiToken) {
      return c.json<ApiResponse>({
        success: false,
        error: 'Umami 配置缺失'
      }, 500);
    }

    const umamiAPI = new UmamiAPI(websiteId, apiToken, apiUrl);
    const topPages = await umamiAPI.getTopPages(parseInt(limit));

    return c.json<ApiResponse>({
      success: true,
      data: topPages
    });
  } catch (error) {
    console.error('Top pages error:', error);
    return c.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '获取热门页面失败'
    }, 500);
  }
});

export default analytics; 