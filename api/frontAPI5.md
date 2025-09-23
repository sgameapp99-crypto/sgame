@## 前端串接與測試指南 — Google OAuth 第三方登入

基底 URL：`http://104.199.172.204.nip.io:8080/api`
認證機制：後端以 Set-Cookie HttpOnly 下發 `sgame_session`，OAuth 登入成功後視為已登入。

---

### 1) 端點與規格

#### Google OAuth 起始端點
- `GET /auth/oauth/google/start?redirectUrl=/member`
  - 參數：
    - `redirectUrl`（可選）：登入成功後的重定向 URL，預設為 `/member`
  - 成功：`302` 重定向到 Google 授權頁面
  - 失敗：
    - `400` `{ code: "OAUTH_REDIRECT_INVALID", message: "無效的重定向 URL" }`
    - `500` `{ code: "OAUTH_START_FAILED", message: "OAuth 起始失敗" }`

#### Google OAuth 回調端點
- `GET /auth/oauth/google/callback?code=...&state=...`
  - 參數：
    - `code`：Google 返回的授權碼
    - `state`：狀態參數（防 CSRF）
    - `error`：錯誤參數（如果用戶拒絕授權）
  - 成功：`302` 重定向到指定頁面，同時設定 `sgame_session` Cookie
  - 失敗：`302` 重定向到 `/login?error=ERROR_CODE`

---

### 2) Axios 串接（同源代理建議）

```ts
import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

// Google OAuth 登入按鈕點擊處理
export function handleGoogleLogin(redirectUrl = '/member') {
  // 直接重定向到 OAuth 起始端點
  window.location.href = `/api/auth/oauth/google/start?redirectUrl=${encodeURIComponent(redirectUrl)}`;
}

// 檢查登入狀態
export async function getSession() {
  const { data } = await api.get('/auth/session');
  return data as { loggedIn: boolean; userId?: string };
}
```

---

### 3) 前端頁面整合

#### 登入頁面 HTML 範例
```html
<!-- Google 登入按鈕 -->
<button 
  onclick="handleGoogleLogin('/member')"
  class="google-login-btn">
  <img src="/images/google-icon.svg" alt="Google">
  使用 Google 登入
</button>

<!-- 或使用 Vue.js -->
<button @click="handleGoogleLogin('/member')" class="btn-google">
  <i class="fab fa-google"></i>
  以 Google 帳號登入
</button>
```

#### Vue.js 組件範例
```vue
<template>
  <div class="oauth-login">
    <button 
      @click="loginWithGoogle"
      :disabled="loading"
      class="google-btn">
      <span v-if="loading">登入中...</span>
      <span v-else>
        <i class="fab fa-google"></i>
        使用 Google 登入
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);

const loginWithGoogle = () => {
  loading.value = true;
  // 直接重定向到 Google OAuth
  window.location.href = '/api/auth/oauth/google/start?redirectUrl=/member';
};
</script>
```

---

### 4) cURL 測試流程

```bash
BASE=http://104.199.172.204.nip.io:8080/api

# 1) 測試 API 健康檢查（確認 API 路由正常）
curl -s "$BASE/health" | jq .
# 預期回應：{"status":"healthy","timestamp":"...","api":true}

# 2) 測試 OAuth 起始端點（會重定向到 Google）
curl -I "$BASE/auth/oauth/google/start?redirectUrl=/member" \
  -H "Origin: http://104.199.172.204.nip.io:8080"

# 預期回應：HTTP/1.1 302 Found
# Access-Control-Allow-Origin: http://104.199.172.204.nip.io:8080
# Access-Control-Allow-Credentials: true
# Access-Control-Expose-Headers: Set-Cookie
# Location: https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=...

# 3) 測試回調端點（模擬錯誤情況）
curl -I "$BASE/auth/oauth/google/callback?error=access_denied"

# 預期回應：HTTP/1.1 302 Found
# Location: /login?error=OAUTH_PROVIDER_DENIED

# 4) 測試無效重定向 URL
curl -I "$BASE/auth/oauth/google/start?redirectUrl=https://malicious.com"

# 預期回應：HTTP/1.1 400 Bad Request
# { "code": "OAUTH_REDIRECT_INVALID", "message": "無效的重定向 URL" }
```

---

### 5) 完整登入流程測試

#### 瀏覽器測試步驟：
1. **訪問 OAuth 起始 URL**：
   ```
   http://104.199.172.204.nip.io:8080/api/auth/oauth/google/start?redirectUrl=/member
   ```

2. **在 Google 授權頁面**：
   - 選擇要授權的 Google 帳號
   - 點擊「允許」按鈕

3. **自動重定向回應用程式**：
   - 系統會自動重定向到 `/member` 頁面
   - 瀏覽器會設定 `sgame_session` Cookie

4. **驗證登入狀態**：
   ```javascript
   // 在瀏覽器控制台執行
   fetch('/api/auth/session', { credentials: 'include' })
     .then(res => res.json())
     .then(data => console.log('登入狀態:', data));
   ```

---

### 6) 錯誤處理

#### 常見錯誤碼：
- `OAUTH_PROVIDER_DENIED`：用戶在 Google 頁面拒絕授權
- `OAUTH_INVALID_STATE`：狀態參數驗證失敗
- `OAUTH_EXCHANGE_FAILED`：授權碼交換失敗
- `OAUTH_REDIRECT_INVALID`：重定向 URL 不在白名單中

#### 前端錯誤處理範例：
```ts
// 檢查 URL 參數中的錯誤
const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');

if (error) {
  switch (error) {
    case 'OAUTH_PROVIDER_DENIED':
      showError('您已取消 Google 登入');
      break;
    case 'OAUTH_INVALID_STATE':
      showError('登入請求無效，請重試');
      break;
    case 'OAUTH_EXCHANGE_FAILED':
      showError('Google 登入失敗，請重試');
      break;
    default:
      showError('登入過程中發生錯誤');
  }
}
```

---

### 7) 重定向 URL 白名單

系統允許的重定向 URL：
- `/`（首頁）
- `/member`（會員頁面）
- `/profile`（個人資料）
- `/dashboard`（儀表板）
- `/predictions`（預測頁面）

**注意**：重定向 URL 必須是相對路徑或同域名的絕對 URL。

---

### 8) 用戶資料處理

#### 首次登入：
- 系統會自動創建新用戶帳號
- 使用 Google 提供的 `name`、`email`、`picture`
- 自動設定 `isVerified: true`
- 預設等級為 `NEWBIE`

#### 再次登入：
- 使用現有的用戶資料
- 更新頭像等可能變化的資訊

#### 帳號綁定規則：
- 一個 Google 帳號只能綁定一個系統帳號
- 如果 Google 帳號的 email 已存在，會自動綁定到現有帳號
- 不允許重複綁定不同的 OAuth 供應商

---

### 9) 安全性考量

#### Cookie 設定：
- `HttpOnly`：防止 XSS 攻擊
- `SameSite=Lax`：防止 CSRF 攻擊
- `Secure`：生產環境必須使用 HTTPS

#### CSRF 防護：
- 使用隨機 `state` 參數
- 驗證重定向 URL 白名單

#### 資料保護：
- 不儲存 Google 的 access token
- 僅儲存必要的用戶識別資訊

---

### 10) 疑難排解

#### 「API 返回 HTML 而非 JSON」錯誤：
- **已修復**：確認 `GET /api/health` 返回 JSON 格式
- 如果仍返回 HTML，檢查前端代理設定是否正確

#### 「重定向無效」錯誤：
- 確認重定向 URL 在白名單中
- 使用相對路徑而非絕對 URL

#### 「登入失敗」錯誤：
- 檢查 Google OAuth 憑證是否正確
- **重要**：確認 Google Console 中的重定向 URI 包含端口號 `:8080`
  - 正確：`http://104.199.172.204.nip.io:8080/api/auth/oauth/google/callback`
  - 錯誤：`http://104.199.172.204.nip.io/api/auth/oauth/google/callback`

#### 「redirect_uri_mismatch」錯誤：
- 這是 Google OAuth 常見錯誤，表示 Google Console 中的重定向 URI 與後端使用的不一致
- **解決方案**：在 Google Cloud Console 中添加正確的重定向 URI：
  1. 前往 https://console.cloud.google.com/
  2. 選擇專案 → "API 和服務" → "憑證"
  3. 編輯 OAuth 2.0 客戶端 ID
  4. 在 "已授權的重新導向 URI" 中添加：
     ```
     http://104.199.172.204.nip.io:8080/api/auth/oauth/google/callback
     ```

#### 「Route not found」錯誤：
- **問題**：OAuth 錯誤重定向到後端 API 端口（`:8080`）而非前端主站
- **已修復**：後端現在正確重定向到前端主站（無端口）
  - 成功：`http://104.199.172.204.nip.io/member`
  - 失敗：`http://104.199.172.204.nip.io/login?error=...`
- **技術細節**：使用 `FRONTEND_BASE_URL` 環境變數強制指定前端基底，避免從請求推斷

#### 重定向邏輯確認：
- **OAuth 起始**：`http://104.199.172.204.nip.io:8080/api/auth/oauth/google/start`
- **Google 回調**：`http://104.199.172.204.nip.io:8080/api/auth/oauth/google/callback`
- **成功重定向**：`http://104.199.172.204.nip.io/member`（前端主站）
- **失敗重定向**：`http://104.199.172.204.nip.io/login?error=...`（前端主站）

#### Cookie 未設定：
- **已修復**：後端已優化 Cookie 設定
- 開發環境：`SameSite=Lax; Secure=false`
- 生產環境：`SameSite=None; Secure=true`
- 確認瀏覽器允許第三方 Cookie

#### CORS 跨域問題：
- **已修復**：後端已設定完整的 CORS 支援
- 確認回應包含 `Access-Control-Allow-Credentials: true`
- 確認回應包含 `Access-Control-Expose-Headers: Set-Cookie`

#### 外部訪問問題：
- 確認 GCP 防火牆規則已正確設定
- 測試 `http://104.199.172.204:8080/health` 是否可以訪問

---

### 11) 生產環境注意事項

#### Google Cloud Console 設定：
1. 確保重定向 URI 包含生產域名
2. 設定正確的授權來源
3. 啟用必要的 API 服務

#### 環境變數：
```bash
# 生產環境設定
GOOGLE_CLIENT_ID="your-production-client-id"
GOOGLE_CLIENT_SECRET="your-production-client-secret"
GOOGLE_REDIRECT_URI="https://yourdomain.com/api/auth/oauth/google/callback"
OAUTH_REDIRECT_BASE="https://yourdomain.com"
```

#### HTTPS 要求：
- 生產環境必須使用 HTTPS
- Cookie 設定 `Secure` 屬性
- 更新 Google Console 的重定向 URI

---

### 12) 測試檢查清單

#### 基礎 API 測試：
- [ ] `GET /api/health` 返回 JSON 格式（非 HTML）
- [ ] API 路由正常運作，不會被前端 SPA 攔截

#### OAuth 流程測試：
- [ ] OAuth 起始端點返回 302 重定向
- [ ] 回應包含正確的 CORS 標頭
- [ ] Google 授權頁面正常顯示
- [ ] 用戶授權後正確重定向回應用程式
- [ ] `sgame_session` Cookie 正確設定
- [ ] `/api/auth/session` 返回正確的登入狀態

#### 錯誤處理測試：
- [ ] 錯誤情況正確處理和顯示
- [ ] 重定向 URL 白名單驗證正常
- [ ] 無效重定向 URL 返回 400 錯誤

#### 用戶資料測試：
- [ ] 首次登入自動創建用戶帳號
- [ ] 再次登入使用現有用戶資料
- [ ] Google 用戶資料正確匯入（姓名、頭像、email）

#### CORS 和 Cookie 測試：
- [ ] 跨域請求包含正確的 CORS 標頭
- [ ] Cookie 在跨域環境下正確設定和傳遞
- [ ] `Access-Control-Allow-Credentials: true` 存在
- [ ] `Access-Control-Expose-Headers: Set-Cookie` 存在

---

### 13) 前端整合建議

#### 登入頁面：
```html
<div class="login-options">
  <!-- 一般登入 -->
  <form @submit="handleEmailLogin">
    <input v-model="email" type="email" placeholder="Email">
    <input v-model="password" type="password" placeholder="密碼">
    <button type="submit">登入</button>
  </form>
  
  <!-- 分隔線 -->
  <div class="divider">或</div>
  
  <!-- Google OAuth -->
  <button @click="loginWithGoogle" class="google-btn">
    <i class="fab fa-google"></i>
    使用 Google 登入
  </button>
</div>
```

#### 會員頁面載入檢查：
```ts
// 頁面載入時檢查登入狀態
onMounted(async () => {
  try {
    const session = await getSession();
    if (!session.loggedIn) {
      // 未登入，重定向到登入頁
      router.push('/login');
    } else {
      // 已登入，載入會員資料
      loadMemberData(session.userId);
    }
  } catch (error) {
    console.error('檢查登入狀態失敗:', error);
    router.push('/login');
  }
});
```

---

**重要提醒**：
- ✅ 後端已修復 API 路由、CORS 和 Cookie 問題
- 確保 Google OAuth 憑證已正確設定
- 測試時使用真實的 Google 帳號
- 生產環境部署前請更新所有相關設定

**最新修復狀態**：
- ✅ API 路由問題已解決（`/api/health` 返回 JSON）
- ✅ CORS 跨域問題已修復（支援憑證傳遞）
- ✅ Cookie 設定已優化（支援跨域環境）
- ✅ OAuth 重定向 URI 端口問題已修復（包含 `:8080`）
- ✅ OAuth 重定向邏輯已修復（成功/失敗重定向到前端主站）
- ✅ Express trust proxy 已設定（避免從請求推斷錯誤 URL）
- ✅ 專用前端基底環境變數已設定（`FRONTEND_BASE_URL`）
- ✅ OAuth state 參數編碼問題已修復
- ✅ Prisma 客戶端重新生成，OAuth 用戶創建正常
- ✅ 帳密登入功能完全正常（測試帳密可用）
- ✅ OAuth 流程測試通過

---

## 14) 前端問題處理建議

### 立即測試方案

#### 測試帳密（後端已確認可用）
```javascript
const testCredentials = {
  email: "test@example.com",
  password: "password"
};
```

#### 登入測試代碼
```javascript
const loginResponse = await fetch('http://104.199.172.204.nip.io:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // 關鍵：必須包含
  body: JSON.stringify(testCredentials)
});

console.log('登入回應:', loginResponse.status);
console.log('Set-Cookie:', loginResponse.headers.get('Set-Cookie'));
```

#### 驗證 Session 狀態
```javascript
const sessionResponse = await fetch('http://104.199.172.204.nip.io:8080/api/auth/session', {
  credentials: 'include'
});

const sessionData = await sessionResponse.json();
console.log('Session 狀態:', sessionData);
// 預期: { loggedIn: true, userId: "test123" }
```

### 前端整合檢查清單

#### ✅ 確認請求格式
```javascript
const loginData = {
  email: "test@example.com",    // 確切匹配
  password: "password"          // 確切匹配
};

const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',  // 必須設定
  },
  credentials: 'include',                // 必須包含
  body: JSON.stringify(loginData)
});
```

#### ✅ 確認 CORS 設定（Axios）
```javascript
const api = axios.create({
  baseURL: 'http://104.199.172.204.nip.io:8080/api',
  withCredentials: true,  // 關鍵設定
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### 錯誤排查步驟

#### 步驟 1：檢查請求格式
在瀏覽器開發者工具的 Network 面板檢查：
- 請求 URL 是否正確
- Content-Type 是否為 `application/json`
- 請求 body 是否正確
- 是否包含 `credentials: 'include'`

#### 步驟 2：檢查回應
```javascript
fetch('/api/auth/login', { /* ... */ })
  .then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Set-Cookie:', response.headers.get('Set-Cookie'));
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);
  });
```

#### 步驟 3：檢查 Cookie 設定
```javascript
console.log('Cookies:', document.cookie);
// 應該看到 sgame_session=... 的 Cookie
```

### 前端路由守衛處理

#### 登入狀態檢查
```javascript
const checkAuthStatus = async () => {
  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.loggedIn) {
      return true; // 已登入，允許訪問
    } else {
      window.location.href = '/login'; // 未登入，重定向
      return false;
    }
  } catch (error) {
    console.error('檢查登入狀態失敗:', error);
    window.location.href = '/login';
    return false;
  }
};
```

### Google OAuth 整合

#### OAuth 登入按鈕
```javascript
const handleGoogleLogin = () => {
  window.location.href = 'http://104.199.172.204.nip.io:8080/api/auth/oauth/google/start?redirectUrl=/member';
};
```

#### OAuth 回調處理
```javascript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  
  if (error) {
    switch (error) {
      case 'OAUTH_PROVIDER_DENIED':
        showError('您已取消 Google 登入');
        break;
      case 'OAUTH_EXCHANGE_FAILED':
        showError('Google 登入失敗，請重試');
        break;
      default:
        showError('登入過程中發生錯誤');
    }
  }
}, []);
```

### 完整登入頁面組件範例

```javascript
import { useState, useEffect } from 'react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 檢查 OAuth 錯誤
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      setError('OAuth 登入失敗，請重試');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://104.199.172.204.nip.io:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        window.location.href = '/member'; // 登入成功，重定向
      } else {
        const data = await response.json();
        setError(data.message || '登入失敗');
      }
    } catch (error) {
      setError('網路錯誤，請重試');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://104.199.172.204.nip.io:8080/api/auth/oauth/google/start?redirectUrl=/member';
  };

  return (
    <div className="login-page">
      <h1>登入</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="密碼"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '登入中...' : '登入'}
        </button>
      </form>
      
      <div className="divider">或</div>
      
      <button onClick={handleGoogleLogin} className="google-btn">
        使用 Google 登入
      </button>
    </div>
  );
};
```

### Google OAuth 自動註冊功能

#### ✅ 支援自動用戶創建
- **首次 Google 登入** = 自動註冊
- **自動創建用戶資料**：
  ```javascript
  {
    email: "user@gmail.com",           // Google email
    name: "User Name",                 // Google 顯示名稱
    avatar: "https://...",             // Google 頭像 URL
    oauthProvider: "GOOGLE",           // OAuth 供應商
    oauthProviderUserId: "google_id",  // Google 用戶 ID
    isVerified: true,                  // 自動驗證
    level: "NEWBIE"                    // 預設等級
  }
  ```

#### 用戶綁定邏輯
1. **現有 Google 用戶**：更新用戶資訊
2. **現有 Email 用戶**：綁定 Google OAuth
3. **全新用戶**：自動創建新用戶

### 測試建議

#### 立即測試步驟
1. **使用測試帳密**：`test@example.com` / `password`
2. **檢查 Network 面板**：確認請求格式正確
3. **檢查回應**：確認返回 200 和 Set-Cookie
4. **檢查 Cookie**：確認瀏覽器儲存了 sgame_session

#### 如果仍然 401
- 檢查前端發送的 email/password 是否完全匹配
- 檢查 Content-Type 是否正確設定
- 檢查是否有其他驗證邏輯干擾

### 後端狀態確認

**✅ 後端功能完全正常**：
- 登入端點返回 200 OK
- 正確設定 Set-Cookie
- Session 端點返回正確狀態
- CORS 設定支援跨域
- OAuth 流程完整運作
- 自動用戶創建功能正常
