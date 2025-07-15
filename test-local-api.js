// 测试本地 API 的脚本
import app from './dist/api/index.js';

async function testLocalAPI() {
  console.log('🧪 测试本地 API...\n');

  // 创建测试请求
  const createRequest = (path, options = {}) => {
    const url = new URL(path, 'http://localhost:3000');
    return new Request(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
  };

  // 测试健康检查
  try {
    console.log('1. 测试健康检查 (GET /)');
    const request = createRequest('/');
    const response = await app(request);
    const data = await response.json();
    
    console.log('状态码:', response.status);
    console.log('响应:', JSON.stringify(data, null, 2));
    console.log('✅ 健康检查通过\n');
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
  }

  // 测试 exchange-token 端点（无效 code）
  try {
    console.log('2. 测试 exchange-token 端点 (POST /appweb/auth/exchange-token)');
    const request = createRequest('/appweb/auth/exchange-token', {
      method: 'POST',
      body: JSON.stringify({ code: 'invalid-test-code' })
    });
    const response = await app(request);
    const data = await response.json();
    
    console.log('状态码:', response.status);
    console.log('响应:', JSON.stringify(data, null, 2));
    console.log('✅ exchange-token 端点响应正常\n');
  } catch (error) {
    console.log('❌ exchange-token 端点测试失败:', error.message);
  }

  // 测试不存在的端点
  try {
    console.log('3. 测试不存在的端点 (GET /nonexistent)');
    const request = createRequest('/nonexistent');
    const response = await app(request);
    const data = await response.json();
    
    console.log('状态码:', response.status);
    console.log('响应:', JSON.stringify(data, null, 2));
    console.log('✅ 404 处理正常\n');
  } catch (error) {
    console.log('❌ 404 测试失败:', error.message);
  }

  // 测试缺少 Content-Type 的请求
  try {
    console.log('4. 测试缺少 Content-Type 的请求');
    const request = createRequest('/appweb/auth/exchange-token', {
      method: 'POST',
      headers: {},
      body: JSON.stringify({ code: 'test' })
    });
    const response = await app(request);
    const data = await response.json();
    
    console.log('状态码:', response.status);
    console.log('响应:', JSON.stringify(data, null, 2));
    console.log('✅ Content-Type 验证正常\n');
  } catch (error) {
    console.log('❌ Content-Type 验证测试失败:', error.message);
  }
}

testLocalAPI().catch(console.error);
