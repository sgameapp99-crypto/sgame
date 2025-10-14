# 後端 SSL 配置指南

## 📁 要交給後端的檔案

請將 `backend-ssl/` 目錄下的所有檔案交給後端開發團隊：

### 📂 backend-ssl/ 目錄內容
```
backend-ssl/
├── cert.pem    # SSL 證書檔案
└── key.pem     # SSL 私鑰檔案
```

## 🔐 證書資訊
- **主體名稱 (CN)**: `10.2.0.2`
- **替代名稱 (SAN)**: `IP:10.2.0.2`, `DNS:localhost`
- **有效期**: 2025/10/10 - 2026/10/10
- **演算法**: RSA 2048位
- **類型**: 自簽名證書

## 🚀 後端配置步驟

### 1. 放置證書檔案
將 `cert.pem` 和 `key.pem` 檔案放置在後端服務器的安全位置，例如：
```
/etc/ssl/certs/playSport-cert.pem
/etc/ssl/private/playSport-key.pem
```

### 2. 配置 HTTPS 監聽
根據您的後端框架進行 HTTPS 配置：

#### Node.js/Express 範例：
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/path/to/key.pem'),
  cert: fs.readFileSync('/path/to/cert.pem')
};

const server = https.createServer(options, app);
server.listen(8080, '10.2.0.2', () => {
  console.log('HTTPS Server running on https://10.2.0.2:8080');
});
```

#### Python/Flask 範例：
```python
from flask import Flask
import ssl

app = Flask(__name__)

context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
context.load_cert_chain('/path/to/cert.pem', '/path/to/key.pem')

if __name__ == '__main__':
    app.run(host='10.2.0.2', port=8080, ssl_context=context)
```

#### Java/Spring Boot 範例：
```yaml
# application.yml
server:
  port: 8080
  address: 10.2.0.2
  ssl:
    key-store: classpath:ssl/cert.pem
    key-store-password: your_password
    keyStoreType: PEM
```

### 3. 防火牆配置
確保防火牆允許 HTTPS 流量：
```bash
# Ubuntu/Debian
sudo ufw allow 8080

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### 4. 測試 HTTPS 連線
啟動後端服務後，使用以下命令測試：
```bash
# 測試 HTTPS 連線（忽略證書驗證，因為是自簽名）
curl -k https://10.2.0.2:8080/health

# 測試前端到後端的代理
# 前端會自動將 /api/* 請求代理到 https://10.2.0.2:8080/api/*
```

## ⚠️ 安全注意事項

1. **檔案權限**: 確保 `key.pem` 檔案只有後端進程所有者可讀
   ```bash
   chmod 600 key.pem
   chown backend_user:backend_group key.pem
   ```

2. **備份**: 妥善備份證書檔案，遺失將無法恢復

3. **生產環境**: 自簽名證書僅適用於內網開發環境
   - 生產環境建議使用 Let's Encrypt 或商業 CA 證書
   - 考慮使用更安全的密碼套件和金鑰交換演算法

4. **證書更新**: 證書到期前需要重新生成並重新部署

## 🔄 前端配置說明

前端已經配置為使用 HTTPS 連接後端：
- **代理目標**: `https://10.2.0.2:8080`
- **SSL 驗證**: 停用（因為是自簽名證書）
- **API 路徑**: `/api/*`, `/health`, `/static/*`

## 📞 聯繫方式

如果在配置過程中遇到問題，請聯繫前端開發團隊。

---
**生成時間**: 2025-10-10
**適用環境**: 內網開發環境
**證書類型**: 自簽名 SSL 證書
