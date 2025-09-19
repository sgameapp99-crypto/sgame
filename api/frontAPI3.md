## 前端串接與測試指南 — 大頭貼上傳（本機儲存）

基底 URL：`http://localhost:8080/api`
認證：HttpOnly Cookie（`sgame_session`）。請先完成登入，再進行上傳。

---

### 1) 端點規格
- `POST /me/avatar`（需登入）
  - Content-Type：`multipart/form-data`
  - 欄位：`file`（圖片檔）
  - 成功：`200 { url: "/static/avatars/{userId}.webp", updatedAt: string }`
  - 失敗：
    - 401 未登入
    - 413 `AVATAR_FILE_TOO_LARGE`（> 5MB）
    - 415 `AVATAR_FILE_INVALID`（非 jpg/png/webp）
    - 500 `AVATAR_UPLOAD_FAILED`

儲存策略：固定檔名 `{userId}.webp`，覆寫為最新；建議前端在 URL 後加 `?v=timestamp` 破快取。

---

### 2) Axios 串接範例
```ts
import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export async function uploadAvatar(file: File) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  // 建議：data.url 後帶版本參數避免快取
  // const src = `${data.url}?v=${new Date(data.updatedAt).getTime()}`;
  return data;
}
```

---

### 3) cURL 測試流程
```bash
BASE=http://localhost:8080/api

# 1) 先登入取得 Cookie
LOGIN_RES=$(curl -s -i -X POST "$BASE/auth/login" -H 'Content-Type: application/json' \
  --data '{"email":"test@example.com","password":"password"}')
COOKIE=$(printf '%s' "$LOGIN_RES" | awk 'BEGIN{IGNORECASE=1}/^Set-Cookie: sgame_session=/{print $2}' | sed 's/;.*//')
echo "COOKIE=$COOKIE"

# 2) 上傳圖片（請替換路徑 /path/to/avatar.png）
curl -i -X POST "$BASE/me/avatar" -H "Cookie: $COOKIE" -F "file=@/path/to/avatar.png"

# 3) 成功回應預期（HTTP/1.1 200 OK）
# { "url": "/static/avatars/{userId}.webp", "updatedAt": "2025-09-18T09:10:00Z" }

# 4) 驗證檔案可讀
# curl -I "http://localhost:8080/static/avatars/{userId}.webp"
```

---

### 4) 常見問題
- 401：尚未登入或 Cookie 未帶到 → 請先依文件完成登入（同源代理建議）。
- 413：檔案超過 5MB → 壓縮或降低解析度。
- 415：格式不支援 → 僅接受 jpeg/png/webp。
- 200 但前端看不到新圖：請在圖片 URL 後加 `?v=Date.now()` 或使用回傳的 `updatedAt` 轉成時間戳。

---

### 5) 前端整合建議
- 上傳成功後：
  - 直接使用回傳的 `url` + 版本參數顯示；或
  - 重新呼叫 `GET /api/members/{id}/profile` 取得最新頭像 URL。
- 圖片顯示示例：
```html
<img :src="avatarUrl + '?v=' + Date.now()" alt="avatar" />
```



