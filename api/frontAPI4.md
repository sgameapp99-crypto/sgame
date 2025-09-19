## 前端串接與測試指南 — 註冊（POST /auth/register）

基底 URL：`http://localhost:8080/api`
認證機制：後端以 Set-Cookie HttpOnly 下發 `sgame_session`，註冊成功後視為已登入。

---

### 1) 端點與規格
- `POST /auth/register`
  - Content-Type: `application/json`
  - Body：
    ```json
    { "email": "user@example.com", "password": "password123", "name": "User" }
    ```
  - 成功（201）：
    - Set-Cookie: `sgame_session=...; HttpOnly; SameSite=Lax`（dev 可非 Secure）
    - 回傳：`{ "redirectUrl": "/" }`（可忽略或用於導頁）
  - 失敗：
    - 409 `{ code: "EMAIL_TAKEN" }`
    - 422 `{ code: "VALIDATION_FAILED", message }`

---

### 2) Axios 串接（同源代理建議）
```ts
import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export async function register(email: string, password: string, name: string) {
  const { data } = await api.post('/auth/register', { email, password, name });
  // 註冊成功後，已取得 HttpOnly Cookie，可直接導頁
  return data; // { redirectUrl?: string }
}

export async function getSession() {
  const { data } = await api.get('/auth/session');
  return data as { loggedIn: boolean; userId?: string };
}
```

---

### 3) cURL 測試（本機）
```bash
BASE=http://localhost:8080/api

# 註冊（成功 201 並回 Set-Cookie）
REG_RES=$(curl -s -i -X POST "$BASE/auth/register" \
  -H 'Content-Type: application/json' \
  --data '{"email":"user+demo@example.com","password":"password123","name":"Demo"}')
echo "$REG_RES" | sed -n '1,20p'

# 擷取 Cookie 並驗證 Session
COOKIE=$(printf '%s' "$REG_RES" | awk 'BEGIN{IGNORECASE=1}/^Set-Cookie: sgame_session=/{print $2}' | sed 's/;.*//')
echo "COOKIE=$COOKIE"
curl -s -H "Cookie: $COOKIE" "$BASE/auth/session" | jq .
```

預期：
- `Set-Cookie` 存在且 `/auth/session` 回 `{ "loggedIn": true, "userId": "..." }`

---

### 4) 表單驗證與錯誤
- 409 `EMAIL_TAKEN`：Email 已被註冊
- 422 `VALIDATION_FAILED`：
  - Email 格式不正確
  - 密碼少於 8 字元
  - name 為空

前端建議：
- 顯示明確訊息，阻止重複送出
- 針對 409 顯示「Email 已被使用」，引導使用登入

---

### 5) 頁面流程建議
1. 送出註冊表單 → 等待 201
2. 成功後不需保存 Token，瀏覽器已有 HttpOnly Cookie
3. 直接導頁（例：`/member`）或先呼叫 `/api/auth/session` 確認狀態

---

### 6) 疑難排解
- 「已註冊但顯示未登入」：
  - 前端請求是否有 `withCredentials: true`（或 fetch 的 `credentials: 'include'`）
  - 若跨網域：後端需設定 CORS 並允許 credentials；Cookie SameSite 需依部署調整
- 「一直 409」：
  - 換一個 Email 測試（或在資料庫刪除先前測試帳號）
- 「201 但沒有 Set-Cookie」：
  - 確認瀏覽器是否阻擋第三方 Cookie；開發建議走同源代理


