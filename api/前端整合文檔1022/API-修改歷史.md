# SGame API 修改歷史

本文檔記錄 SGame API 的重要變更歷史，包括新增功能、修改項目、移除端點等。

---

## 版本 1.1.0 (2025-10-21)

### 🎉 新增功能

#### 1. 密碼重設功能
**實作日期**: 2025-10-21

新增完整的密碼重設流程，包含以下端點：

- `POST /auth/forgot-password` - 發送密碼重設郵件
- `POST /auth/verify-reset-token` - 驗證重設令牌有效性
- `POST /auth/reset-password` - 使用令牌重設密碼
- `POST /auth/change-password` - 已登入用戶更改密碼
- `GET /auth/password-expiry-status` - 查詢密碼過期狀態

**功能特點**：
- 使用 Redis 儲存重設令牌，24 小時自動過期
- 5 分鐘冷卻時間，防止重設郵件濫發
- 支援密碼強度驗證（8-12 字元，大小寫、數字、特殊符號）
- 密碼 180 天過期機制，7 天前開始警告
- OAuth 用戶自動排除（無法使用密碼重設功能）

**技術實作**：
- 新增服務：`src/services/passwordResetService.ts`
- 控制器：`src/controllers/authController.ts` 新增 5 個處理函數
- 路由：`src/routes/auth.ts` 新增 5 個端點
- 類型定義：`src/types/index.ts` 新增相關介面

---

#### 2. Google OAuth 第三方登入
**實作日期**: 2025-10-21

整合 Google OAuth 2.0 認證流程：

- `GET /auth/oauth/google/start` - 啟動 Google 登入流程
- `GET /auth/oauth/google/callback` - Google 回調處理

**功能特點**：
- 使用 Passport.js 實作標準 OAuth 2.0 流程
- 支援帳號自動連結（email 已存在時）
- 新用戶自動建立並設定初始等級
- Google 帳號預設為已驗證郵箱
- 支援自訂登入後導向 URL (`redirectUrl` 參數)

**技術實作**：
- Passport 配置：`src/config/passport.ts`
- OAuth 控制器：`src/controllers/oauthController.ts`
- OAuth 路由：`src/routes/oauth.ts`
- 整合至主應用：`src/app.ts` 初始化 Passport 中介軟體
- 依賴套件：新增 `passport` 和 `passport-google-oauth20`

**環境變數**：
```yaml
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://10.2.0.2:8080/api/auth/oauth/google/callback
```

---

#### 3. 可配置的速率限制
**實作日期**: 2025-10-21

新增開發環境速率限制開關，方便前端測試：

**功能特點**：
- 環境變數 `DISABLE_RATE_LIMIT=true` 可完全停用速率限制
- 開發環境預設停用，生產環境預設啟用
- 不影響現有速率限制配置
- 啟動時會記錄速率限制狀態

**技術實作**：
- 新增中介軟體：`src/middleware/rateLimit.ts`
- 條件式速率限制器：`createConditionalRateLimiter()`
- 向後相容：`createRateLimitSchema()` 支援 skip 功能
- 更新全域和路由級別的速率限制器

**環境變數**：
```yaml
DISABLE_RATE_LIMIT=true  # 開發環境
DISABLE_RATE_LIMIT=false # 生產環境（或移除此變數）
```

---

### 🔄 修改項目

#### 1. Email 配置支援 Gmail 應用程式密碼
**修改日期**: 2025-10-21

更新 Email 服務配置，明確支援 Gmail 應用程式密碼：

**環境變數**：
```yaml
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password  # Google 應用程式密碼
EMAIL_FROM=noreply@sgame.com
FRONTEND_URL=http://localhost:3000
```

**設定說明**：
1. 登入 Google 帳號
2. 前往「安全性」→「兩步驟驗證」
3. 在「應用程式密碼」中生成新密碼
4. 將 16 位密碼填入 `SMTP_PASS`

---

#### 2. 類型定義擴充
**修改日期**: 2025-10-21

擴充 TypeScript 類型定義以支援新功能：

**新增類型**：
- `ForgotPasswordRequest` - 忘記密碼請求
- `VerifyResetTokenRequest` - 驗證重設令牌請求
- `ResetPasswordRequest` - 重設密碼請求
- `ChangePasswordRequest` - 更改密碼請求
- `PasswordResetResponse` - 密碼重設回應
- `TokenVerificationResponse` - 令牌驗證回應
- `PasswordChangeResponse` - 密碼更改回應
- `PasswordExpiryStatusResponse` - 密碼過期狀態回應
- `RedisPasswordResetToken` - Redis 重設令牌資料
- `OAuthProfile` - OAuth 使用者資料
- `OAuthUser` - OAuth 用戶資料

**Express 擴充**：
- 擴充 `Express.User` 介面
- 擴充 `Express.Request` 介面以支援 `user` 屬性

---

### ❌ 移除項目

#### 1. `/auth/resend-verification` 端點移除
**移除日期**: 2025-10-21  
**影響範圍**: 郵箱驗證功能

**移除原因**：
- 功能重複：`/auth/send-verification` 已包含重新發送功能
- 簡化 API：減少端點數量，降低維護成本
- 自動處理：服務層自動判斷是初次發送還是重新發送
- 冷卻機制：統一由 `verificationService` 處理 60 秒冷卻時間

**替代方案**：
使用 `POST /auth/send-verification` 進行初次發送和重新發送，服務會自動處理：
- 檢查冷卻時間
- 生成新的驗證碼
- 發送驗證郵件
- 設定冷卻時間

**遷移指南**：
```javascript
// 舊方式（已移除）
POST /auth/resend-verification

// 新方式（統一使用）
POST /auth/send-verification
```

**回應格式不變**：
```json
{
  "success": true,
  "message": "驗證碼已發送至您的郵箱",
  "expiresIn": 300
}
```

**錯誤處理**：
```json
{
  "success": false,
  "message": "請等待 45 秒後再重新發送"
}
```

---

### 📝 文檔更新

#### 1. OpenAPI 規格更新
**更新日期**: 2025-10-21

- 移除 `/auth/resend-verification` 端點定義
- 新增註解說明使用 `/auth/send-verification` 替代
- 新增密碼重設相關端點文檔（已存在於規格中）
- 新增 Google OAuth 端點文檔（已存在於規格中）

#### 2. API 測試清單重寫
**更新日期**: 2025-10-21

完全重寫 `API-Check.md`，包含：
- 更新所有端點測試狀態
- 新增密碼重設測試說明
- 新增 Google OAuth 測試說明
- 新增 Gmail 應用程式密碼配置說明
- 新增速率限制配置說明
- 移除已廢棄的端點
- 更新環境變數配置範例

---

## 版本 1.0.0 (2025-10-20)

### 初始版本功能

#### 基本認證
- 用戶註冊（email/password）
- 用戶登入
- 用戶登出
- Session 狀態查詢

#### 郵箱驗證
- 發送驗證碼
- 驗證郵箱
- 查詢驗證狀態

#### 會員系統
- 會員資料查詢
- 會員關係管理（追蹤/取消追蹤）
- 會員等級系統
- 頭像上傳

#### 安全機制
- JWT Token 認證
- Cookie-based Session
- 速率限制
- 密碼強度驗證
- 密碼過期機制（180天）

---

## 未來規劃

### 計劃中的功能

#### 第三方登入擴充
- [ ] Facebook OAuth 整合
- [ ] LINE OAuth 整合

#### 會員功能擴充
- [ ] 會員統計資訊
- [ ] 會員榮譽系統
- [ ] 會員發文功能

#### 預測系統
- [ ] 預測列表
- [ ] 預測詳情
- [ ] 預測統計

#### 字典/篩選
- [ ] 聯盟字典
- [ ] 日期篩選

---

## 技術債務與改進

### 已知問題
1. OAuth session 使用 express-session，可考慮改用 Redis 儲存
2. Passport 序列化/反序列化可優化效能
3. 密碼重設令牌清理需要定期執行（可加入排程任務）

### 效能優化建議
1. Redis 連接池優化
2. 資料庫查詢優化（增加索引）
3. 速率限制器使用 Redis 儲存（分散式環境）

---

## 相容性說明

### 向後相容
- 所有現有端點保持不變
- 現有 API 回應格式不變
- Cookie 名稱和格式不變

### 破壞性變更
- **移除** `/auth/resend-verification` 端點
  - 影響：使用此端點的前端需要更新
  - 遷移：改用 `/auth/send-verification`
  - 時間表：立即生效

---

## 部署注意事項

### 環境變數新增
部署新版本前，請確保以下環境變數已設定：

```yaml
# Gmail 配置（必要）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@sgame.com
FRONTEND_URL=http://localhost:3000

# Google OAuth（選用）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/oauth/google/callback

# 速率限制（選用）
DISABLE_RATE_LIMIT=false  # 生產環境建議設為 false 或移除
```

### 資料庫遷移
本版本不需要資料庫遷移，現有 schema 已支援所有新功能。

### 依賴套件更新
```bash
npm install passport@^0.7.0 passport-google-oauth20@^2.0.0
npm install --save-dev @types/passport@^1.0.16 @types/passport-google-oauth20@^2.0.14
```

---

## 聯絡資訊

如有任何問題或建議，請聯絡開發團隊。

**文檔維護**: 開發團隊  
**最後更新**: 2025-10-21  
**API 版本**: v1.1.0

