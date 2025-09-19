## 前端連接後端交接文件（本機開發）

### 概要
- 後端 Base URL（本機）：`http://localhost:8080`
- API 前綴：`/api`
- 認證策略：Set-Cookie HttpOnly（Cookie 名稱：`sgame_session`）
- Cookie 屬性（開發）：`HttpOnly; SameSite=Lax; Path=/`（dev 可非 HTTPS）
- 測試帳號：`test@example.com` / `password`

---

### 拍板決議（不擋開發的最小定稿）

1) 登入 body 欄位名稱
- 最終統一使用：`email`（建議前端就送 email）。
- 暫不強制支援 `username`。若有需要，再追加「後端同時接受 `username` 並等價視為 email」的兼容。

2) /auth/session 回傳結構
- 採用「寬鬆超集」策略，至少保證：
  - `loggedIn: boolean`（必回）
  - 若為已登入（true）時，最少回：`userId: string`
- 其餘可選欄位（視需要可加）：`email?: string`, `expiresAt?: string`

前端解析建議：只依賴 `loggedIn` 與（在 true 時）`userId`，其餘欄位存在則顯示/使用，不存在不擋流程。

---

### 推薦方案 A：同源代理（Vite / Nuxt 開發最簡單）
同源可避免 CORS，瀏覽器會自動帶 Cookie。

1) Vite 專案 `vite.config.ts`
```ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

2) Nuxt 3 專案 `nuxt.config.ts`
```ts
export default defineNuxtConfig({
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true
        }
      }
    }
  }
});
```

3) 前端請求（同源代理時使用相對路徑 `/api/...`）
```ts
// fetch 登入
await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password',
    rememberme: 'yes',
    redirectUrl: '/member'
  })
});

// 取得會話
await fetch('/api/auth/session', { credentials: 'include' });

// 登出
await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
```

4) Axios 實作（同源代理）
```ts
import axios from 'axios';

export const api = axios.create({ baseURL: '/api', withCredentials: true });

await api.post('/auth/login', {
  email: 'test@example.com',
  password: 'password',
  rememberme: 'yes',
  redirectUrl: '/member'
});

await api.get('/auth/session');
await api.post('/auth/logout');
```

---

### 方案 B：跨源直連（僅在必要時）
若前端直連 `http://localhost:8080/api`，請求必須攜帶憑證；同時後端需允許特定來源並開啟 credentials。

- 前端呼叫（fetch 範例）：
```ts
await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password, rememberme: 'yes' })
});
```

- 後端需設定（由後端調整）：
  - `Access-Control-Allow-Origin: http://localhost:3000`（或你的前端實際來源）
  - `Access-Control-Allow-Credentials: true`

注意：`Allow-Origin: *` 與攜帶 Cookie 衝突，跨源一定要指定來源且允許 credentials。

---

### 認證相關 API 規格（後端已實作）

- POST `/api/auth/login`
  - Body：`{ email: string, password: string, rememberme: 'yes'|'no', redirectUrl?: string }`
  - 成功：`200 { redirectUrl?: string }`，同時以 Set-Cookie 回 `sgame_session`
  - 失敗：`401 { code: 'AUTH_INVALID_CREDENTIALS', message: '帳號或密碼錯誤' }`

- GET `/api/auth/session`
  - 成功：`200 { loggedIn: boolean, userId?: string, email?: string, expiresAt?: string }`

- POST `/api/auth/logout`
  - 成功：`204 No Content`（清除 Cookie）

---

### 快速檢核清單（能否連通與登入）

- Vite/Nuxt 代理 `/api` 已啟用（同源最佳），或已改為跨源且後端允許 CORS + credentials。
- 前端請求有帶 `credentials: 'include'`（Axios 為 `withCredentials: true`）。
- Cookie（開發）屬性符合：不強制 Secure，但有 `HttpOnly; SameSite=Lax; Path=/`。
- 登入成功後，瀏覽器可看到 `sgame_session` Cookie。
- 重新整理頁面後，`GET /api/auth/session` 能回 `{"loggedIn": true, ...}`。

---

### 回應格式拍板與寬鬆解析

- 登入成功：`200 { redirectUrl?: string }` 並以 Set-Cookie 回 `sgame_session`（目前採 200；openapi 亦允許 204）。
- 登出：`204 No Content`（清 Cookie）。
- Session：至少 `loggedIn: boolean`；若為 true 保證 `userId: string`；可選 `email`, `expiresAt`。

與 openapi.yaml 差異說明：
- openapi.yaml 已列舉登入成功 `200 { redirectUrl? }` 或 `204` 兩種；實務上本階段統一採 `200 + Set-Cookie`，前端可寬鬆解析。
- /auth/session 在文件與實作間可能多寡不同（文件列 `userId, expiresAt`），前端請「以 `loggedIn` 為主，`userId` 為已登入最小依賴，其餘欄位存在則用、缺省則忽略」。

---

### 前端 .env 建議
- 同源代理：不需要 API URL，直接走 `/api`
- 跨源：
  - `VITE_API_BASE=http://localhost:8080/api`
  - Axios 初始化：`baseURL: import.meta.env.VITE_API_BASE` 並 `withCredentials: true`

---

### 測試流程（前端）
1. 設定代理（或確認跨源的 CORS 與 credentials 設定）
2. 在登入頁呼叫 POST `/api/auth/login`（帶 `credentials: 'include'`）
3. 成功後瀏覽器保存 HttpOnly Cookie
4. 刷新頁或進入會員頁，呼叫 GET `/api/auth/session` 檢查登入狀態
5. 登出呼叫 POST `/api/auth/logout`

---

### 疑難排解
- 401 Unauthorized：
  - 檢查帳密是否為測試帳號 `test@example.com` / `password`
  - 請求是否帶上 `credentials: 'include'`
  - 若跨源：後端是否已設定「特定來源 + Allow-Credentials」

- Cookie 沒帶上：
  - 優先使用同源代理（最穩定）
  - 跨源時務必 `credentials: 'include'`，且瀏覽器非第三方 Cookie 阻擋情境

---

### 其他說明
- 正式環境建議 `Secure; SameSite=Lax` 或跨站需求用 `SameSite=None; Secure`（需 HTTPS 與 CSRF 機制）。
- 本文件對齊後端規格文件 `api/API-SPEC.md` 與 `api/openapi.yaml`（登入/會話/登出）。


