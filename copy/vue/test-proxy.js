import https from 'https';

const options = {
  hostname: '10.1.0.2',
  port: 5175,
  path: '/health',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  },
  rejectUnauthorized: false
};

console.log('測試代理到 /health...');

const req = https.request(options, (res) => {
  console.log(`狀態碼: ${res.statusCode}`);
  console.log(`響應頭:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('響應數據:', data);
  });
});

req.on('error', (e) => {
  console.error(`請求錯誤: ${e.message}`);
});

req.end();

// 同時測試API端點
setTimeout(() => {
  const apiOptions = {
    ...options,
    path: '/api/auth/session'
  };

  console.log('\n測試代理到 /api/auth/session...');

  const req2 = https.request(apiOptions, (res) => {
    console.log(`狀態碼: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('響應數據:', data);
    });
  });

  req2.on('error', (e) => {
    console.error(`請求錯誤: ${e.message}`);
  });

  req2.end();
}, 1000);







