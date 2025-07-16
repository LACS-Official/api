// Vercel部署诊断脚本
const API_BASE = 'https://api-g.lacs.cc';

async function diagnoseEndpoint(method, path, body = null) {
  console.log(`\n🔍 诊断: ${method} ${path}`);
  
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
    
    console.log(`📊 状态码: ${response.status}`);
    console.log(`📋 响应头:`, Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log(`📄 原始响应:`, text);
    
    // 尝试解析JSON
    try {
      const json = JSON.parse(text);
      console.log(`📄 JSON响应:`, json);
    } catch (e) {
      console.log(`❌ 非JSON响应: ${text.substring(0, 200)}...`);
    }
    
  } catch (error) {
    console.log(`❌ 网络错误: ${error.message}`);
  }
}

async function diagnoseAll() {
  console.log('🔧 开始诊断 Vercel 部署问题...\n');

  // 1. 检查服务状态
  await diagnoseEndpoint('GET', '/');

  // 2. 检查auth接口
  await diagnoseEndpoint('POST', '/appweb/auth/exchange-token', { code: 'test' });
  
  // 3. 检查不同的路径格式
  await diagnoseEndpoint('POST', '/appweb/auth/exchange-token/', { code: 'test' });
  await diagnoseEndpoint('POST', '/auth/exchange-token', { code: 'test' });
  
  // 4. 检查OPTIONS请求（CORS预检）
  await diagnoseEndpoint('OPTIONS', '/appweb/auth/exchange-token');

  console.log('\n🏁 诊断完成！');
}

// 运行诊断
diagnoseAll().catch(console.error); 