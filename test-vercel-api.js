// 测试 Vercel API 的简单脚本
// 使用 Node.js 内置的 fetch (Node.js 18+)

const BASE_URL = 'https://api-g.lacs.cc';

async function testAPI() {
  console.log('🧪 测试 Vercel API...\n');

  // 测试健康检查
  try {
    console.log('1. 测试健康检查 (GET /)');
    const healthResponse = await fetch(`${BASE_URL}/`);
    console.log('状态码:', healthResponse.status);
    console.log('Content-Type:', healthResponse.headers.get('content-type'));

    const responseText = await healthResponse.text();
    console.log('响应内容 (前200字符):', responseText.substring(0, 200));

    if (healthResponse.headers.get('content-type')?.includes('application/json')) {
      const healthData = JSON.parse(responseText);
      console.log('JSON 响应:', JSON.stringify(healthData, null, 2));
      console.log('✅ 健康检查通过\n');
    } else {
      console.log('❌ 响应不是 JSON 格式\n');
    }
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
  }

  // 测试 exchange-token 端点
  try {
    console.log('2. 测试 exchange-token 端点 (POST /appweb/auth/exchange-token)');
    const tokenResponse = await fetch(`${BASE_URL}/appweb/auth/exchange-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: 'test-code'
      })
    });
    const tokenData = await tokenResponse.json();
    console.log('状态码:', tokenResponse.status);
    console.log('响应:', JSON.stringify(tokenData, null, 2));
    console.log('✅ exchange-token 端点响应正常\n');
  } catch (error) {
    console.log('❌ exchange-token 端点测试失败:', error.message);
  }

  // 测试不存在的端点
  try {
    console.log('3. 测试不存在的端点 (GET /nonexistent)');
    const notFoundResponse = await fetch(`${BASE_URL}/nonexistent`);
    const notFoundData = await notFoundResponse.json();
    console.log('状态码:', notFoundResponse.status);
    console.log('响应:', JSON.stringify(notFoundData, null, 2));
    console.log('✅ 404 处理正常\n');
  } catch (error) {
    console.log('❌ 404 测试失败:', error.message);
  }
}

testAPI().catch(console.error);
