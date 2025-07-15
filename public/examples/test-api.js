// API 测试脚本
const API_BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 开始测试 API...\n');

  // 测试健康检查
  console.log('1. 测试健康检查...');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/`);
    const healthData = await healthResponse.json();
    console.log('✅ 健康检查成功:', healthData.message);
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
  }

  // 测试 404 处理
  console.log('\n2. 测试 404 处理...');
  try {
    const notFoundResponse = await fetch(`${API_BASE_URL}/nonexistent`);
    const notFoundData = await notFoundResponse.json();
    console.log('✅ 404 处理正常:', notFoundData.error);
  } catch (error) {
    console.log('❌ 404 测试失败:', error.message);
  }

  // 测试 GitHub 认证接口（需要有效参数）
  console.log('\n3. 测试 GitHub 认证接口...');
  try {
    const authResponse = await fetch(`${API_BASE_URL}/appweb/auth/exchange-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: 'invalid_code' })
    });
    const authData = await authResponse.json();
    console.log('✅ 认证接口响应正常:', authData.error);
  } catch (error) {
    console.log('❌ 认证接口测试失败:', error.message);
  }

  // 测试 Umami 分析接口（需要配置）
  console.log('\n4. 测试 Umami 分析接口...');
  try {
    const analyticsResponse = await fetch(`${API_BASE_URL}/api/analytics/pageviews?page=/test`);
    const analyticsData = await analyticsResponse.json();
    console.log('✅ 分析接口响应正常:', analyticsData.error || '需要配置 Umami');
  } catch (error) {
    console.log('❌ 分析接口测试失败:', error.message);
  }

  console.log('\n🎉 API 测试完成！');
  console.log('\n📝 注意事项:');
  console.log('- 确保服务器正在运行 (npm run dev)');
  console.log('- 配置环境变量以测试完整功能');
  console.log('- 访问 http://localhost:3000/oauth-example.html 测试 OAuth 流程');
}

// 运行测试
testAPI().catch(console.error); 