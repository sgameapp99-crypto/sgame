# SGame API 總覽

## 基礎資訊

### API端點

- **Base URL**: `https://10.2.0.2:8080/api`
- **備用URL**: `https://10.2.0.2:8080` (無`/api`前綴也支援)
- **Health Check**: `GET https://10.2.0.2:8080/health`

### 認證方式

本API支援兩種認證方式：

1. **Session Cookie**（推薦）
   - Cookie名稱: `sgame_session`
   - HttpOnly: `true`
   - SameSite: `strict`
   - 有效期: 7天

2. **JWT Token**
   - Header: `Authorization: Bearer <token>`
   - 有效期: 7天

### 跨域請求配置

**重要**: 所有請求必須設置 `credentials: 'include'`

```javascript
fetch('https://10.2.0.2:8080/api/auth/login', {
  method: 'POST',
  credentials: 'include',  // 必須！
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
})
```

## 已實作功能

### ✅ 認證模組
- 註冊/登入/登出
- Session管理
- 郵箱驗證（6位數驗證碼）
- 密碼重設（Email連結）
- 密碼修改
- 密碼過期檢查
- Google OAuth

### ✅ 會員模組
- 會員資料查詢
- 追蹤/取消追蹤
- 關係查詢
- 等級系統（5個等級）
- 等級統計

### ✅ 檔案上傳
- 頭像上傳（最大5MB）
- 支援格式：JPEG, PNG, WebP

### ✅ 安全機制
- HTTPS加密
- bcrypt密碼哈希
- Redis Session儲存
- 速率限制（可配置）

## 環境配置

### 前端環境變數

```env
VITE_API_BASE_URL=https://10.2.0.2:8080/api
VITE_FRONTEND_URL=http://localhost:3000
```

### CORS配置

後端已配置允許以下來源：
- `10.1.0.0/24` 網段
- `localhost:3000`

如需添加其他來源，請聯繫後端團隊。

## 快速開始

### 1. 安裝HTTP客戶端

```bash
npm install axios
# 或使用原生 fetch
```

### 2. 創建API Service

```javascript
// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://10.2.0.2:8080/api',
  withCredentials: true,  // 啟用Cookie
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

### 3. 測試連接

```javascript
// 測試健康檢查
fetch('https://10.2.0.2:8080/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 通用響應格式

### 成功響應

```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

### 錯誤響應

```json
{
  "success": false,
  "message": "錯誤描述",
  "code": "ERROR_CODE"
}
```

## HTTP狀態碼

| 狀態碼 | 說明 | 處理方式 |
|--------|------|----------|
| 200 | 成功 | 正常處理數據 |
| 201 | 創建成功 | 資源已創建 |
| 204 | 成功無內容 | 操作成功，無返回數據 |
| 400 | 請求錯誤 | 檢查請求參數 |
| 401 | 未認證 | 跳轉登入頁 |
| 403 | 無權限 | 顯示權限錯誤 |
| 404 | 未找到 | 資源不存在 |
| 409 | 衝突 | 資源已存在 |
| 413 | 請求過大 | 檔案太大 |
| 415 | 不支援的類型 | 檔案格式錯誤 |
| 429 | 請求過多 | 等待後重試 |
| 500 | 伺服器錯誤 | 顯示錯誤訊息 |

## 速率限制

開發環境已禁用速率限制（`DISABLE_RATE_LIMIT=true`）

生產環境限制：
- 全域：15分鐘 100次請求
- 登入：15分鐘 5次嘗試
- 註冊：1小時 3次註冊
- 驗證碼：1分鐘 1次發送
- 密碼重設：1小時 3次請求

超過限制時返回 HTTP 429，響應包含 `retryAfter` 秒數。

## 下一步

- 閱讀 [認證API文檔](./02-認證API.md)
- 查看 [整合範例](./06-整合範例.md)
- 參考 [快速參考](./07-快速參考.md)

