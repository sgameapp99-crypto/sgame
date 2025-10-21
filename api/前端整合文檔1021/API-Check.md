## 後端 API 測試清單（勾選用）

基底 URL（本機）：`https://10.2.0.2:8080/api`

### 核心/健康檢查
- [V] `GET /health`（非 /api 前綴）

### 認證（auth）

#### 基本認證
- [V] `POST /auth/login` — 登入（Set-Cookie: sgame_session）（2025-10-20，已測試通過）
- [V] `GET /auth/session` — 查詢目前登入狀態（loggedIn、userId 等）（2025-10-20，已測試通過）
- [V] `POST /auth/logout` — 登出（清除 Cookie，204）（2025-10-20，已測試通過）
- [V] `POST /auth/register` — 註冊（email/password/name；201，支援郵箱驗證）（2025-10-20，已測試通過）

#### 郵箱驗證
- [V] `POST /auth/send-verification` — 發送郵箱驗證碼（需登入，2025-10-21，已測試通過）
- [V] `POST /auth/verify-email` — 驗證郵箱驗證碼（需登入，2025-10-21，已測試通過）
- [V] `GET /auth/verification-status` — 檢查郵箱驗證狀態（需登入，2025-10-21，已測試通過）

**注意**: `/auth/resend-verification` 端點已移除，請使用 `/auth/send-verification` 進行初次發送和重新發送，服務會自動處理冷卻時間（60秒）

#### 密碼重設
- [V] `POST /auth/forgot-password` — 忘記密碼 - 發送重設郵件（2025-10-21，已測試通過）
- [V] `POST /auth/verify-reset-token` — 驗證密碼重設令牌（2025-10-21，已測試通過）
- [V] `POST /auth/reset-password` — 重設密碼（2025-10-21，已測試通過）
- [V] `POST /auth/change-password` — 更新密碼（需登入）（2025-10-21，已測試通過）
- [V] `GET /auth/password-expiry-status` — 檢查密碼過期狀態（需登入）（2025-10-21，已測試通過）

#### 第三方登入（OAuth）
- [⏸️] `GET /auth/oauth/google/start?redirectUrl=...` — Google OAuth 登入起始（後端已實作，需公網環境測試）
- [⏸️] `GET /auth/oauth/google/callback` — Google OAuth 回調（Set-Cookie + 302）（後端已實作，需公網環境測試）
- **Google OAuth 限制**：不支援私有 IP (10.x.x.x) 作為 callback URL
- **部署說明**：生產環境只需更新 `GOOGLE_CALLBACK_URL` 環境變數即可使用（詳見 `/api文檔/Google-OAuth-配置說明.md`）
- [ ] `GET /auth/oauth/facebook/start?redirectUrl=...` — Facebook OAuth 登入起始（未實作）
- [ ] `GET /auth/oauth/facebook/callback` — Facebook OAuth 回調（未實作）
- [ ] `GET /auth/oauth/line/start?redirectUrl=...` — LINE OAuth 登入起始（未實作）
- [ ] `GET /auth/oauth/line/callback` — LINE OAuth 回調（未實作）

### 會員（members）
- [V] `GET /members/{id}/profile` — 會員基本資料（2025-10-21，已測試通過）
- [V] `GET /members/{id}/relationships` — 與目前使用者關係（isSelf/isFollowing/isMutual）（2025-10-21，已測試通過）
- [V] `POST /members/{id}/follow` — 追蹤（204）（2025-10-21，已測試通過）
- [V] `DELETE /members/{id}/follow` — 取消追蹤（204）（2025-10-21，已測試通過）
- [ ] `GET /members/{id}/stats` — 會員統計（總預測、勝率、連勝、排名）
- [ ] `GET /members/{id}/honors` — 會員榮譽列表
- [ ] `GET /members/{id}/posts` — 會員發文清單（page、size）

### 會員等級（levels）
- [V] `GET /levels` — 獲取所有等級資訊（2025-10-20，已測試通過）
- [V] `GET /levels/stats` — 獲取等級統計資訊（2025-10-20，已測試通過）

### 個人設定（me）
- [V] `POST /me/avatar` — 上傳大頭貼（<5MB、jpeg/png/webp；200 回 `{ url, updatedAt }`；401/413/415/500）（2025-10-21，已實作並測試通過）
  - **前端使用**: 返回的 `url` 為相對路徑（如 `/uploads/avatars/2-xxx.jpg`），前端需組合為完整 URL: `API_BASE + url`
  - **會員資料**: `GET /members/{id}/profile` 返回的 `avatarUrl` 使用相同格式
  - **詳細說明**: 參見 `/api文檔/前端整合文檔/頭像功能說明.md`

### 預測（predictions）
- [ ] `GET /members/{id}/predictions?league=...&dateRange=today|week|month&page=&size=` — 預測清單

### 字典/篩選（filters）
- [ ] `GET /filters/leagues` — 聯盟字典（id/code/name）
- [ ] `GET /filters/dates?range=7` — 近 N 天日期鍵與標籤

---

## 📝 測試說明

### Email 驗證測試說明
- **註冊流程**：`POST /auth/register` 回應包含 `needsVerification: true`，**並自動發送驗證郵件**（2025-10-21 已實作）
- **發送驗證碼**：`POST /auth/send-verification` 需要登入狀態（用於重新發送）
- **驗證碼格式**：6 位數數字，過期時間 5 分鐘
- **重新發送**：使用相同的 `/auth/send-verification` 端點，有 60 秒冷卻時間限制
- **錯誤處理**：支援多種錯誤碼（過期、無效、已驗證等）

### 密碼重設測試說明
- **忘記密碼流程**：`POST /auth/forgot-password` 發送重設郵件
- **令牌驗證**：`POST /auth/verify-reset-token` 驗證重設令牌
- **密碼重設**：`POST /auth/reset-password` 使用令牌重設密碼
- **密碼更新**：`POST /auth/change-password` 已登入用戶更新密碼
- **過期檢查**：`GET /auth/password-expiry-status` 查詢密碼過期狀態
- **安全機制**：24 小時令牌過期、5 分鐘重發冷卻、OAuth 用戶排除
- **密碼過期**：180 天過期、7 天警告期、登入時自動檢查

### Google OAuth 測試說明
- **配置要求**：需要在 `docker-compose.yml` 中設定 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`
- **回調 URL**：`https://10.2.0.2:8080/api/auth/oauth/google/callback`
- **登入流程**：
  1. 前端導向 `/auth/oauth/google/start?redirectUrl=/dashboard`
  2. 用戶在 Google 授權頁面登入
  3. Google 回調至 `/auth/oauth/google/callback`
  4. 後端設定 session cookie 並導回前端指定的 `redirectUrl`
- **帳號連結**：如果 email 已存在，會自動連結 Google 帳號
- **新用戶**：自動建立帳號並設定初始等級（青銅）

### Email 配置說明（Gmail 應用程式密碼）
- **SMTP 設定**：
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=your-email@gmail.com`
  - `SMTP_PASS=your-16-char-app-password`（Google 應用程式密碼）
- **取得應用程式密碼**：
  1. 登入 Google 帳號
  2. 前往「安全性」→「兩步驟驗證」
  3. 在「應用程式密碼」中生成新密碼
  4. 將 16 位密碼填入 `SMTP_PASS`

### 速率限制配置
- **開發環境**：設定 `DISABLE_RATE_LIMIT=true` 可完全停用速率限制
- **生產環境**：設定 `DISABLE_RATE_LIMIT=false` 或移除該環境變數以啟用速率限制
- **預設限制**：
  - 全域：15 分鐘內 100 次請求
  - 登入：15 分鐘內 5 次嘗試
  - 註冊：1 小時內 3 次註冊
  - 驗證碼：1 分鐘內 1 次發送
  - 密碼重設：1 小時內 3 次請求

---

## 🔧 環境變數配置

### 必要配置（docker-compose.yml）

```yaml
environment:
  # Email 配置（Gmail 應用程式密碼）
  - SMTP_HOST=smtp.gmail.com
  - SMTP_PORT=587
  - SMTP_USER=your-email@gmail.com
  - SMTP_PASS=your-16-char-app-password
  - EMAIL_FROM=noreply@sgame.com
  - FRONTEND_URL=http://localhost:3000
  
  # Google OAuth 配置
  - GOOGLE_CLIENT_ID=your-google-client-id
  - GOOGLE_CLIENT_SECRET=your-google-client-secret
  - GOOGLE_CALLBACK_URL=https://10.2.0.2:8080/api/auth/oauth/google/callback
  
  # 速率限制配置
  - DISABLE_RATE_LIMIT=true  # 開發環境設為 true
```

---

## 備註

### OAuth 策略
- 本系統採「一帳僅能綁定一種供應商」策略：`users.oauthProvider + oauthProviderUserId` 唯一
- 第一次第三方登入若找不到帳號會自動建立（第三方註冊），其後即為登入
- 如果 email 已存在（透過 email/password 註冊），會自動連結 OAuth 帳號

### 密碼政策
- **長度**：8-12 字元
- **複雜度**：必須包含大寫、小寫、數字、特殊符號
- **限制**：不可包含空白、不可與 email 相關
- **過期**：180 天後過期，7 天前開始警告
- **OAuth 用戶**：使用第三方登入的用戶無密碼，無法使用密碼重設功能

### 測試建議
- 勾選完成後可於旁加上測試日期/說明，例如：`[V] GET /auth/session（2025-10-21，前端同源代理通過）`
- 建議先在開發環境測試所有功能後再部署到生產環境
- 生產環境部署前請務必更換所有密鑰（JWT_SECRET、SESSION_SECRET 等）

---

*最後更新: 2025-10-21*
*API 版本: v1.0.0*
