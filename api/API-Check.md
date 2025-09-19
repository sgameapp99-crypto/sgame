## 後端 API 測試清單（勾選用）

基底 URL（本機）：`http://localhost:8080/api`

### 核心/健康檢查
- [V] `GET /health`（非 /api 前綴）

### 認證（auth）
- [V] `POST /auth/login` — 登入（Set-Cookie: sgame_session）（2025-09-18，test@example.com/password 測試通過）
- [V] `GET /auth/session` — 查詢目前登入狀態（loggedIn、userId 等）（2025-09-18，Cookie 驗證通過）
- [V] `POST /auth/logout` — 登出（清除 Cookie，204）（2025-09-18，Cookie 清除測試通過）
- [ ] `POST /auth/register` — 註冊（email/password/name；201 或 Set-Cookie）
- [ ] `GET /auth/oauth/{provider}/start?redirectUrl=...` — 第三方登入起始（google/facebook/line）
- [ ] `GET /auth/oauth/{provider}/callback` — 第三方登入回調（Set-Cookie + 302）

### 會員（members）
- [V] `GET /members/{id}/profile` — 會員基本資料
- [V] `GET /members/{id}/relationships` — 與目前使用者關係（isSelf/isFollowing/isMutual）
- [V] `POST /members/{id}/follow` — 追蹤（204）
- [V] `DELETE /members/{id}/follow` — 取消追蹤（204）
- [ ] `GET /members/{id}/stats` — 會員統計（總預測、勝率、連勝、排名）
- [ ] `GET /members/{id}/honors` — 會員榮譽列表
- [ ] `GET /members/{id}/posts` — 會員發文清單（page、size）

### 預測（predictions）
- [ ] `GET /members/{id}/predictions?league=...&dateRange=today|week|month&page=&size=` — 預測清單

### 字典/篩選（filters）
- [ ] `GET /filters/leagues` — 聯盟字典（id/code/name）
- [ ] `GET /filters/dates?range=7` — 近 N 天日期鍵與標籤

### 備註
－ 本系統採「一帳僅能綁定一種供應商」策略：`users.oauthProvider + oauth_provider_user_id` 唯一。
－ 第一次第三方登入若找不到帳號會自動建立（第三方註冊），其後即為登入。

### 個人設定（me）
- [V] `POST /me/avatar` — 上傳大頭貼（<5MB、jpeg/png/webp；200 回 `{ url, updatedAt }`；401/413/415/500）
- 勾選完成後可於旁加上測試日期/說明，例如：`[x] GET /auth/session（2025-09-18，前端同源代理通過）`


