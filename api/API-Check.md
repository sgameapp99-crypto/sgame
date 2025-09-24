## 後端 API 測試清單（勾選用）

基底 URL（本機）：`http://localhost:8080/api`

### 核心/健康檢查
- [V] `GET /health`（非 /api 前綴）

### 認證（auth）
- [V] `POST /auth/login` — 登入（Set-Cookie: sgame_session）（2025-09-18，test@example.com/password 測試通過）
- [V] `GET /auth/session` — 查詢目前登入狀態（loggedIn、userId 等）（2025-09-18，Cookie 驗證通過）
- [V] `POST /auth/logout` — 登出（清除 Cookie，204）（2025-09-18，Cookie 清除測試通過）
- [V] `POST /auth/register` — 註冊（email/password/name；201 或 Set-Cookie，支援郵箱驗證）（2025-01-XX，已實作）
- [V] `POST /auth/forgot-password` — 忘記密碼 - 發送重設郵件（2025-09-23，密碼重設功能完成）
- [V] `POST /auth/verify-reset-token` — 驗證密碼重設令牌（2025-09-23，令牌驗證功能完成）
- [V] `POST /auth/reset-password` — 重設密碼（2025-09-23，密碼重設功能完成）
- [V] `POST /auth/change-password` — 更新密碼（需登入）（2025-09-23，密碼更新功能完成）
- [V] `GET /auth/password-expiry-status` — 檢查密碼過期狀態（需登入）（2025-09-23，密碼過期檢查完成）
- [ ] `POST /auth/send-verification` — 發送郵箱驗證碼（需登入）
- [ ] `POST /auth/verify-email` — 驗證郵箱驗證碼（需登入）
- [ ] `POST /auth/resend-verification` — 重新發送驗證碼（需登入，冷卻限制）
- [ ] `GET /auth/verification-status` — 檢查郵箱驗證狀態（需登入）
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

### Email 驗證測試說明
- **註冊流程**：`POST /auth/register` 回應包含 `needsVerification: true`
- **發送驗證碼**：`POST /auth/send-verification` 需要登入狀態
- **驗證碼格式**：6 位數數字，過期時間 5 分鐘
- **重新發送**：有 60 秒冷卻時間限制
- **錯誤處理**：支援多種錯誤碼（過期、無效、已驗證等）

### 密碼重設測試說明
- **忘記密碼流程**：`POST /auth/forgot-password` 發送重設郵件
- **令牌驗證**：`POST /auth/verify-reset-token` 驗證重設令牌
- **密碼重設**：`POST /auth/reset-password` 使用令牌重設密碼
- **密碼更新**：`POST /auth/change-password` 已登入用戶更新密碼
- **過期檢查**：`GET /auth/password-expiry-status` 查詢密碼過期狀態
- **安全機制**：24 小時令牌過期、5 分鐘重發冷卻、OAuth 用戶排除
- **密碼過期**：180 天過期、7 天警告期、登入時自動檢查

### 備註
－ 本系統採「一帳僅能綁定一種供應商」策略：`users.oauthProvider + oauth_provider_user_id` 唯一。
－ 第一次第三方登入若找不到帳號會自動建立（第三方註冊），其後即為登入。

### 會員等級（levels）
- [V] `GET /levels` — 獲取所有等級資訊（2025-09-23，等級系統整合完成）
- [V] `GET /levels/stats` — 獲取等級統計資訊（2025-09-23，等級統計功能完成）

### 會員資料整合
- [V] `GET /members/{id}/profile` — 會員基本資料（已整合等級資訊，2025-09-23）

### 個人設定（me）
- [V] `POST /me/avatar` — 上傳大頭貼（<5MB、jpeg/png/webp；200 回 `{ url, updatedAt }`；401/413/415/500）
- 勾選完成後可於旁加上測試日期/說明，例如：`[x] GET /auth/session（2025-09-18，前端同源代理通過）`


