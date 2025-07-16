// Vercel部署后的接口测试脚本
const API_BASE = 'https://api-g.lacs.cc';

async function testEndpoint(method, path, body = null, description = '') {
  console.log(`\n🧪 测试: ${description || `${method} ${path}`}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${path}`, options);
    const data = await response.json();
    
    console.log(`📊 状态码: ${response.status}`);
    console.log(`📄 响应:`, data);
    
    if (response.ok) {
      console.log('✅ 成功');
    } else {
      console.log('❌ 失败');
    }
  } catch (error) {
    console.log(`❌ 错误: ${error.message}`);
  }
}

async function testAllEndpoints() {
  console.log('🚀 开始测试 Vercel 部署的 API 接口...\n');

  // 1. 测试服务状态
  await testEndpoint('GET', '/', null, '服务状态检查');

  // 2. 测试认证接口
  await testEndpoint('POST', '/appweb/auth/exchange-token', 
    { code: 'test_code' }, 'GitHub OAuth 令牌交换');

  await testEndpoint('POST', '/appweb/auth/validate-token', 
    { token: 'test_token' }, '访问令牌验证');

  // 3. 测试分析接口
  await testEndpoint('GET', '/api/analytics/pageviews', null, '获取页面浏览量');
  await testEndpoint('GET', '/api/analytics/stats', null, '获取统计数据');
  await testEndpoint('GET', '/api/analytics/top-pages', null, '获取热门页面');

  // 4. 测试静态文件
  await testEndpoint('GET', '/oauth-example.html', null, 'OAuth示例页面');

  // 5. 测试404处理
  await testEndpoint('GET', '/nonexistent', null, '404错误处理');

  console.log('\n🏁 所有接口测试完成！');
}

// 运行测试
testAllEndpoints().catch(console.error); 