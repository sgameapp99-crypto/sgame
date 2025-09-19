## 前端串接與測試指南 — 會員四個 API（profile/relationships/follow/unfollow）

基底 URL：`http://localhost:8080/api`

前置：登入採 HttpOnly Cookie（`sgame_session`）。正式環境前端不需保存 token，只要同源請求會自動帶 Cookie。

---

### 1) 登入流程（取得 Cookie）

請在登入頁以 Email/Password 打 `POST /auth/login`。

Axios（前端）
```ts
import axios from 'axios';

export async function login(email: string, password: string) {
  const res = await axios.post('/api/auth/login', { email, password }, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // 關鍵：攜帶/接收 Cookie
  });
  // 成功：後端以 Set-Cookie 下發會話；可用 res.data.redirectUrl 導頁（若存在）
  return res.data;
}
```

cURL（本機測試）
```bash
BASE=http://localhost:8080/api
curl -i -X POST "$BASE/auth/login" \
  -H 'Content-Type: application/json' \
  --data '{"email":"test@example.com","password":"password"}'
```

---

### 2) 會員基本資料 — GET `/members/{id}/profile`

用途：載入會員主頁頭像、名稱、等級、加入時間、追蹤/被追蹤數。

回傳（摘錄）
```json
{
  "id": "test123",
  "name": "Test User",
  "avatar": "/images/avatar.jpg",
  "level": "NEWBIE",
  "joinedAt": "2025-09-17T16:46:37.333Z",
  "followersCount": 10,
  "followingCount": 5
}
```

Axios
```ts
const res = await axios.get(`/api/members/${memberId}/profile`, { withCredentials: true });
return res.data;
```

cURL
```bash
curl -s "$BASE/members/test123/profile" | jq
```

---

### 3) 與目前使用者關係 — GET `/members/{id}/relationships`

用途：決定是否顯示「追蹤/已追蹤」按鈕，或是否本人的頁面。

回傳
```json
{ "isSelf": false, "isFollowing": true, "isMutual": false }
```

Axios
```ts
const res = await axios.get(`/api/members/${memberId}/relationships`, { withCredentials: true });
return res.data; // 未登入則 isFollowing=false
```

cURL（未登入/已登入）
```bash
# 未登入
curl -s "$BASE/members/test2/relationships" | jq

# 已登入（帶 Cookie）
COOKIE="$(curl -i -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' \
  --data '{"email":"test@example.com","password":"password"}' | awk -F': ' '/Set-Cookie: sgame_session/ {print $2}' | sed 's/;.*//')"
curl -s -H "Cookie: $COOKIE" "$BASE/members/test2/relationships" | jq
```

---

### 4) 追蹤/取消追蹤 — POST/DELETE `/members/{id}/follow`

用途：登入後對目標會員追蹤或取消追蹤。回應均為 204（無內容）。

狀態碼
- 204：成功
- 401：未登入
- 422：追蹤自己（`FOLLOW_SELF_NOT_ALLOWED`）

Axios
```ts
// 追蹤
await axios.post(`/api/members/${memberId}/follow`, null, { withCredentials: true });
// 取消追蹤
await axios.delete(`/api/members/${memberId}/follow`, { withCredentials: true });
```

cURL
```bash
# 需先登入取得 COOKIE 變數（見上）
curl -i -X POST   -H "Cookie: $COOKIE" "$BASE/members/test2/follow"
curl -i -X DELETE -H "Cookie: $COOKIE" "$BASE/members/test2/follow"
```

---

### 5) 前端頁面載入建議（首屏並行）

並行請求：
- GET `/members/{id}/profile`
- GET `/members/{id}/relationships`
- GET `/members/{id}/stats`
- GET `/filters/leagues`
- GET `/filters/dates?range=7`

待首屏載入後，再載入列表：
- GET `/members/{id}/predictions?league=&dateRange=today&page=1&size=20`
- GET `/members/{id}/posts?page=1&size=10`

---

### 6) 常見錯誤處理

- 401 未登入：請導向登入或提示登入；登入成功後自動帶 Cookie 再重試。
- 404 資源不存在：顯示「找不到會員」。
- 422 表單/行為錯誤：例如自追蹤，顯示可讀訊息。

---

### 7) 本地快速驗收（狀態碼）

```bash
BASE=http://localhost:8080/api

# 健康檢查
curl -s -w "\n%{http_code}\n" $BASE/../health

# 登入
LOGIN_RES=$(curl -s -i -X POST "$BASE/auth/login" -H 'Content-Type: application/json' \
  --data '{"email":"test@example.com","password":"password"}')
COOKIE=$(printf '%s' "$LOGIN_RES" | awk 'BEGIN{IGNORECASE=1}/^Set-Cookie: sgame_session=/{print $2}' | sed 's/;.*//')
echo "COOKIE=$COOKIE"

# Profile 200 / 404
curl -s -w "\n%{http_code}\n" "$BASE/members/test123/profile"
curl -s -w "\n%{http_code}\n" "$BASE/members/not-exist/profile"

# Relationships 未登入 / 已登入
curl -s -w "\n%{http_code}\n" "$BASE/members/test2/relationships"
curl -s -w "\n%{http_code}\n" -H "Cookie: $COOKIE" "$BASE/members/test2/relationships"

# Follow 未登入(401) / 已登入(204) / 取消(204)
curl -s -w "\n%{http_code}\n" -X POST "$BASE/members/test2/follow"
curl -s -w "\n%{http_code}\n" -X POST -H "Cookie: $COOKIE" "$BASE/members/test2/follow"
curl -s -w "\n%{http_code}\n" -X DELETE -H "Cookie: $COOKIE" "$BASE/members/test2/follow"
```

---

小提示
- 前端請確保 Axios 設定 `withCredentials: true`（同源 Cookie）。
- 若跨網域，需伺服器設定 CORS 並允許憑證；Cookie `SameSite` 需對齊部署策略。


