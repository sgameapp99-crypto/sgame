# 內網 SSL 配置指南

## 配置總覽

本項目已完成內網 HTTPS 配置，支持前端與後端的安全通信。

### 網路配置
- **前端服務器 IP**: `10.1.0.2:5175` (HTTPS)
- **後端 API 服務器**: `10.2.0.2:8080` (HTTP)
- **證書類型**: 自簽名 SSL 證書

## 已完成的配置

### 1. SSL 證書生成
- 位置: `ssl/cert.pem` 和 `ssl/key.pem`
- 有效期: 2025/10/10 - 2026/10/10
- CN: `10.1.0.2`
- Subject Alternative Name: `IP:10.1.0.2`, `DNS:localhost`

### 2. 環境配置 (.env)
```bash
# HTTPS 配置
VITE_HTTPS=true

# 服務器配置
VITE_DEV_HOST=0.0.0.0
VITE_DEV_PORT=5175

# HMR 配置
VITE_HMR_HOST=10.1.0.2
VITE_HMR_PORT=5175

# API 代理配置
VITE_PROXY_PREFIX=/api
VITE_PROXY_TARGET=http://10.2.0.2:8080
VITE_PROXY_ENABLE=true
VITE_PROXY_SECURE=false
VITE_PROXY_CHANGE_ORIGIN=true
```

### 3. Vite 配置更新
- `allowedHosts` 已添加 `10.1.0.2` 和 `127.0.0.1`
- 支持開發服務器和預覽模式

## 使用方法

### 啟動 HTTPS 開發服務器
```bash
# 使用 PM2 啟動
./manage-ssl.sh enable
./manage-ssl.sh restart

# 或直接使用 npm
npm run pm2:dev
```

### 訪問方式
- **HTTPS URL**: `https://10.1.0.2:5175`
- **備用 HTTP**: `http://10.1.0.2:5175` (如果證書問題)

### 瀏覽器安全警告
由於使用自簽名證書，首次訪問時會看到安全警告：
1. 點擊「進階」
2. 選擇「繼續前往 10.1.0.2（不安全）」
3. 添加到瀏覽器的例外列表

## 代理配置說明

前端會自動將以下請求代理到後端：
- `/api/*` → `http://10.2.0.2:8080/api/*`
- `/health` → `http://10.2.0.2:8080/health`
- `/static/*` → `http://10.2.0.2:8080/static/*`

## 故障排除

### 證書相關問題
```bash
# 檢查證書狀態
./manage-ssl.sh status

# 重新生成證書
rm -rf ssl/
openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
  -subj "/C=TW/ST=Taiwan/L=Taipei/O=PlaySport/CN=10.1.0.2" \
  -addext "subjectAltName=IP:10.1.0.2,DNS:localhost"
```

### 網路連線問題
- 確保防火牆允許 5175 端口
- 確認 IP 地址配置正確
- 檢查後端服務 (10.2.0.2:8080) 是否運行

### PM2 管理
```bash
# 查看狀態
pm2 list

# 重啟服務
pm2 restart app:dev

# 查看日誌
pm2 logs app:dev
```

## 安全注意事項

1. **自簽名證書**: 僅適用於內網開發環境
2. **生產環境**: 應使用正式 CA 頒發的 SSL 證書
3. **防火牆**: 限制對 5175 端口的外部訪問
4. **API 安全**: 後端應實現適當的認證和授權機制

## 配置驗證

運行以下命令驗證配置：
```bash
# 測試 HTTPS 連線
curl -k https://10.1.0.2:5175

# 測試 API 代理
curl -k https://10.1.0.2:5175/api/health

# 檢查證書信息
openssl x509 -in ssl/cert.pem -noout -text
```
