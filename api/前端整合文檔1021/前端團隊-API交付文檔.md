# 🎉 SGame API 前端交付文檔

**交付日期**: 2025-10-21  
**API版本**: v1.0.2  
**狀態**: ✅ 生產就緒

---

## 📦 交付摘要

✅ **21個API端點**全部測試通過  
✅ **測試通過率100%**  
✅ **完整文檔和測試腳本**  
✅ **準備立即整合**

---

## 🚀 快速開始（3分鐘）

### 1. 測試連接

```javascript
// 測試健康檢查
fetch('https://10.2.0.2:8080/health')
  .then(res => res.json())
  .then(data => console.log(data));
// 預期輸出: { status: "healthy", ... }
```

### 2. 創建API Client

```javascript
// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://10.2.0.2:8080/api',
  withCredentials: true,  // ⚠️ 重要！必須設置
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

### 3. 測試登入

```javascript
import api from './client';

// 註冊
await api.post('/auth/register', {
  email: 'test@example.com',
  password: 'Test1234!',
  name: 'Test User'
});

// 登入
const { data } = await api.post('/auth/login', {
  email: 'test@example.com',
  password: 'Test1234!'
});

console.log('登入成功！', data);
```

---

## 📚 完整文檔

### 核心文檔（必讀）

1. **[完整交付清單](./api文檔/前端整合文檔/完整交付清單.md)**  
   📄 包含所有API端點、請求/響應範例、快速開始指南

2. **[API總覽](./api文檔/前端整合文檔/01-API總覽.md)**  
   📄 基礎資訊、認證方式、CORS配置

3. **[API-Check清單](./api文檔/API-Check.md)**  
   📋 所有端點的完整清單和測試狀態

### 詳細文檔（參考）

- **[完整功能測試報告](./api文檔/完整功能測試報告-2025-10-21.md)**  
  詳細的測試結果、效能指標、修復記錄

- **[最終測試報告](./api文檔/最終測試報告.md)**  
  測試總結、前端整合建議

- **[頭像上傳快速參考](./api文檔/頭像上傳-快速參考.md)**  
  頭像上傳的快速指南

- **[OpenAPI規格](./api文檔/openapi.yaml)**  
  標準OpenAPI格式的API規格

---

## 🎯 已實作功能清單

### ✅ 認證（14個端點）

| 功能 | 端點 | 方法 | 狀態 |
|------|------|------|------|
| 註冊 | `/auth/register` | POST | ✅ |
| 登入 | `/auth/login` | POST | ✅ |
| 登出 | `/auth/logout` | POST | ✅ |
| Session狀態 | `/auth/session` | GET | ✅ |
| 發送驗證碼 | `/auth/send-verification` | POST | ✅ |
| 驗證郵箱 | `/auth/verify-email` | POST | ✅ |
| 驗證狀態 | `/auth/verification-status` | GET | ✅ |
| 忘記密碼 | `/auth/forgot-password` | POST | ✅ |
| 驗證重設Token | `/auth/verify-reset-token` | POST | ✅ |
| 重設密碼 | `/auth/reset-password` | POST | ✅ |
| 修改密碼 | `/auth/change-password` | POST | ✅ |
| 密碼過期狀態 | `/auth/password-expiry-status` | GET | ✅ |
| Google OAuth啟動 | `/auth/oauth/google/start` | GET | ✅ |
| Google OAuth回調 | `/auth/oauth/google/callback` | GET | ✅ |

### ✅ 會員（6個端點）

| 功能 | 端點 | 方法 | 狀態 |
|------|------|------|------|
| 會員資料 | `/members/{id}/profile` | GET | ✅ |
| 追蹤會員 | `/members/{id}/follow` | POST | ✅ |
| 取消追蹤 | `/members/{id}/follow` | DELETE | ✅ |
| 等級列表 | `/levels` | GET | ✅ |
| 等級統計 | `/levels/stats` | GET | ✅ |
| 上傳頭像 | `/me/avatar` | POST | ✅ |

### ✅ 核心

| 功能 | 端點 | 方法 | 狀態 |
|------|------|------|------|
| 健康檢查 | `/health` | GET | ✅ |

---

## ⚠️ 重要配置

### 1. 跨域請求 (必須配置)

**所有請求必須包含**:
```javascript
credentials: 'include'  // fetch
// 或
withCredentials: true    // axios
```

### 2. 環境變數

```env
# 前端 .env
VITE_API_BASE_URL=https://10.2.0.2:8080/api
VITE_FRONTEND_URL=http://localhost:3000
```

### 3. HTTPS自簽證書

開發環境使用自簽證書，需要：
- 瀏覽器信任證書，或
- 配置開發代理，或
- 使用HTTPS前端

---

## 📋 API核心資訊

### Base URL
```
https://10.2.0.2:8080/api
```

### 認證方式
- **Session Cookie** (推薦): `sgame_session`
- **JWT Token**: `Authorization: Bearer <token>`

### 響應格式

**成功**:
```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

**失敗**:
```json
{
  "success": false,
  "message": "錯誤描述",
  "code": "ERROR_CODE"
}
```

### 常見狀態碼

| 碼 | 說明 | 處理 |
|----|------|------|
| 200 | 成功 | 正常處理 |
| 201 | 創建成功 | 資源已創建 |
| 204 | 成功無內容 | 操作成功 |
| 400 | 請求錯誤 | 檢查參數 |
| 401 | 未認證 | 跳轉登入 |
| 404 | 未找到 | 資源不存在 |
| 429 | 請求過多 | 等待重試 |
| 500 | 伺服器錯誤 | 顯示錯誤 |

---

## 🔐 密碼規則

- 長度: 8-12字元
- 必須: 大寫+小寫+數字+特殊符號
- 禁止: 空白、與email相關
- 過期: 180天（7天前警告）

---

## 💡 前端實作建議

### 1. API Service封裝

```javascript
// src/api/auth.js
import api from './client';

export const authAPI = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getSession: () =>
    api.get('/auth/session')
};
```

### 2. 錯誤處理

```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 跳轉登入
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
```

### 3. 頭像上傳

```javascript
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const { data } = await api.post('/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return data.url; // /uploads/avatars/xxx.jpg
};
```

---

## 🧪 測試腳本

所有測試腳本位於項目根目錄：

- `test-email-verification-complete.sh` - 郵箱驗證
- `test-password-reset-complete.sh` - 密碼重設
- `test-member-follow-complete.sh` - 會員追蹤
- `test-avatar-upload.sh` - 頭像上傳
- `test-login-function.sh` - 登入功能

---

## 📞 技術支援

### 遇到問題？

1. **檢查文檔**
   - [完整交付清單](./api文檔/前端整合文檔/完整交付清單.md)
   - [測試報告](./api文檔/完整功能測試報告-2025-10-21.md)

2. **常見問題**
   - ❌ CORS錯誤 → 檢查 `credentials: 'include'`
   - ❌ 401錯誤 → 未登入或Session過期
   - ❌ Cookie未設置 → 檢查 `withCredentials`

3. **測試工具**
   - 使用提供的測試腳本驗證API
   - 使用Postman/Insomnia測試

---

## ✅ 整合檢查清單

- [ ] 閱讀完整交付清單
- [ ] 配置API Client (`withCredentials: true`)
- [ ] 測試健康檢查端點
- [ ] 實作註冊/登入功能
- [ ] 測試Session管理
- [ ] 實作錯誤處理
- [ ] 測試Cookie跨域
- [ ] 實作密碼重設頁面 (`/reset-password`)
- [ ] 測試檔案上傳
- [ ] 整合OAuth流程

---

## 🎉 準備就緒！

所有API已測試完成，文檔齊全，可以開始前端整合！

**關鍵提醒**:
1. ✅ 所有請求必須 `credentials: 'include'`
2. ✅ 使用HTTPS
3. ✅ 實作 `/reset-password` 頁面

**祝開發順利！** 🚀

---

**交付團隊**: SGame 後端開發團隊  
**交付日期**: 2025-10-21  
**聯繫方式**: 查閱項目文檔

