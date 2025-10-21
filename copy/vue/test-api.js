import https from 'https';
import http from 'http';

// 測試前端代理到後端API
function testAPI() {
  console.log('測試前端API代理...');

  const options = {
    hostname: '34.80.46.175',
    port: 5175,
    path: '/api/auth/session',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Node.js Test Script'
    },
    rejectUnauthorized: false, // 忽略SSL證書驗證
    timeout: 10000
  };

  const req = https.request(options, (res) => {
    console.log(`狀態碼: ${res.statusCode}`);
    console.log(`響應頭:`, JSON.stringify(res.headers, null, 2));

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('響應數據:', data);
      if (res.statusCode === 500) {
        console.log('代理失敗，檢查Vite配置');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`請求失敗: ${e.message}`);
    console.error('可能的原因：');
    console.error('1. 前端代理配置錯誤');
    console.error('2. 後端服務不可達');
    console.error('3. SSL證書問題');
  });

  req.on('timeout', () => {
    console.error('請求超時');
    req.destroy();
  });

  req.end();
}

// 測試後端直接API
function testBackendDirect() {
  console.log('測試後端直接API...');

  const options = {
    hostname: '10.2.0.2',
    port: 8080,
    path: '/health',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    rejectUnauthorized: false
  };

  const req = https.request(options, (res) => {
    console.log(`狀態碼: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('響應數據:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`請求失敗: ${e.message}`);
  });

  req.end();
}

// 運行測試
console.log('開始API測試...');
testBackendDirect();

setTimeout(() => {
  testAPI();
}, 1000);
