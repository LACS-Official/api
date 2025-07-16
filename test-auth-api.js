// 测试配置
const API_BASE_URL = 'https://api-g.lacs.cc'; // 或者 'http://localhost:3000' 用于本地测试

async function testAuthAPI() {
  console.log('🧪 开始测试 Auth API...\n');

  // 测试1: 检查服务是否运行
  console.log('1️⃣ 测试服务状态...');
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    console.log('✅ 服务状态:', data);
  } catch (error) {
    console.log('❌ 服务状态检查失败:', error.message);
  }

  // 测试2: 测试 exchange-token 端点（使用无效的code）
  console.log('\n2️⃣ 测试 exchange-token 端点...');
  try {
    const response = await fetch(`${API_BASE_URL}/appweb/auth/exchange-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: 'invalid_test_code'
      })
    });
    
    const data = await response.json();
    console.log('📊 响应状态:', response.status);
    console.log('📄 响应数据:', data);
    
    if (response.status === 400) {
      console.log('✅ 端点正常工作，正确返回了错误响应');
    } else if (response.status === 404) {
      console.log('❌ 端点返回404，路由配置可能有问题');
    } else {
      console.log('⚠️ 意外的响应状态');
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }

  // 测试3: 测试 validate-token 端点
  console.log('\n3️⃣ 测试 validate-token 端点...');
  try {
    const response = await fetch(`${API_BASE_URL}/appweb/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: 'invalid_test_token'
      })
    });
    
    const data = await response.json();
    console.log('📊 响应状态:', response.status);
    console.log('📄 响应数据:', data);
    
    if (response.status === 401) {
      console.log('✅ 端点正常工作，正确返回了401错误');
    } else if (response.status === 404) {
      console.log('❌ 端点返回404，路由配置可能有问题');
    } else {
      console.log('⚠️ 意外的响应状态');
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }

  // 测试4: 测试不存在的端点
  console.log('\n4️⃣ 测试不存在的端点...');
  try {
    const response = await fetch(`${API_BASE_URL}/appweb/auth/nonexistent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    const data = await response.json();
    console.log('📊 响应状态:', response.status);
    console.log('📄 响应数据:', data);
    
    if (response.status === 404) {
      console.log('✅ 404处理正常工作');
    } else {
      console.log('⚠️ 意外的响应状态');
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }

  console.log('\n🏁 测试完成！');
}

// 运行测试
testAuthAPI().catch(console.error); 