### Login（方案A，Set-Cookie HttpOnly）技術設計與後端協作說明

本文件定義在「獨立登入頁 `/login`」下，採用 Set-Cookie（HttpOnly Cookie）作為正式環境的認證會話策略之完整實作方式，包含前端流程、與後端 API 交握、Cookie 屬性、安全性、錯誤處理、測試清單與需對齊的後端決策點。完成後可直接作為前後端溝通依據。

## 目標
- 使用者在 `/login` 完成登入，後端以 Set-Cookie 交付會話（Session 或 JWT in Cookie）。
- 前端不保存 Token（避免 `localStorage`/JS 可讀），以瀏覽器自動帶 Cookie 完成後續授權。
- 支援「記住我」延長會話期限；支援導回 `redirectUrl`。

## 前端行為與流程
1. 使用者點擊「登入」→ 導向 `/login`。
2. 表單驗證：
   - 帳號 `username`：必填。
   - 密碼 `password`：必填，長度 ≥ 6。
   - 記住我 `rememberme`：`'yes' | 'no'`。
3. 送出請求至 `/auth/login`（JSON）。等待回應後：
   - 成功：不讀取任何 Token。若回應含 `redirectUrl` 則導向，否則回原頁或首頁。
   - 失敗：顯示錯誤訊息；必要時顯示驗證碼（依 `reload` 或錯誤碼觸發）。
4. 之後頁面請求 API（同網域）時，瀏覽器自動夾帶 HttpOnly Cookie，完成驗證。

### 前端送出（範例）
```http
POST /auth/login
Content-Type: application/json
X-Requested-With: XMLHttpRequest

{
  "username": "user001",
  "password": "P@ssw0rd!",
  "rememberme": "yes",
  "redirectUrl": "/member"
}
```

### 成功回應（關鍵：伺服器同時回 Set-Cookie）
```http
HTTP/1.1 200 OK
Set-Cookie: sgame_session=eyJhbGciOi...; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
Content-Type: application/json

{ "redirectUrl": "/member" }
```

### 失敗回應（範例）
```json
{
  "code": "AUTH_INVALID_CREDENTIALS",
  "message": "帳號或密碼錯誤",
  "reload": false
}
```

## 後端 API 契約（與 openapi.yaml 對齊）
- POST `/auth/login`
  - Request body：`{ username, password, rememberme, redirectUrl? }`
  - Response 200：`{ redirectUrl?: string }`（同時下發 HttpOnly Cookie）
  - Response 4xx：`{ code, message, reload? }`
- GET `/auth/session`
  - 用於頁面載入時檢查目前會話狀態與基本使用者資訊（可選）。回傳簡要 profile 與是否登入。
- POST `/auth/logout`
  - 使 Cookie 失效（清除/過期），回 `{ success: true }`

## Cookie 策略（關鍵）
- 名稱：`sgame_session`（可自訂）
- 安全屬性：
  - `HttpOnly`：避免 JS 存取。
  - `Secure`：僅允許 HTTPS。
  - `SameSite=Lax`（建議）。若跨站需求，改 `SameSite=None; Secure`（需處理 CORS/CSRF）。
- 範圍：
  - `Path=/`
  - `Domain`：建議明確綁定主域（如 `playsport.cc`）；多子域共享需後端評估。
- 壽命：
  - `rememberme='yes'` → 設定 `Max-Age`/`Expires`（例如 30 天）。
  - `rememberme='no'` → Session Cookie 或短時 TTL。

## 安全性與 CSRF
- 建議以 `SameSite=Lax` 降低 CSRF 風險。
- 若必須 `SameSite=None`（跨站），則需 CSRF Token：
  - 由 `/auth/session` 或 `<meta>` 提供，提交修改性請求帶 `X-CSRF-Token`。
- 一律使用 HTTPS；錯誤訊息避免透露帳號存在與否。

## 風險控管與防爆破
- 後端需節流策略（IP/帳號維度）。達閾值回 `reload: true` 或特定 `code`（如 `AUTH_NEEDS_RECAPTCHA`）。
- 可整合 reCAPTCHA v2/3 或 hCaptcha；回傳欄位使用 `recaptcha`。

## 導頁策略
- 優先使用後端回應 `redirectUrl`。
- 若無 → 使用前端提交的 `redirectUrl`（白名單過濾）或回首頁 `/`。
- 來源頁保存：受保護頁導向 `/login` 時，於 query 或 `sessionStorage` 暫存來源頁，成功後導回。

## 錯誤處理（前端）
- 400/401：顯示 `message`，密碼欄高亮/震動效果。
- `reload=true`：顯示驗證碼（或導向需驗證碼版本）。
- 5xx/網路錯誤：顯示通用錯誤「伺服器忙碌，請稍後再試」。

## 前端測試清單
- 成功：正確帳密 → Set-Cookie → 200 → 導頁正確。
- 記住我：`yes` 與 `no` 的 Cookie 存活期差異（需後端驗證）。
- 密碼過短/空值：阻止提交，顯示行內錯誤。
- 錯誤帳密：顯示通用錯誤訊息。
- 多次錯誤：觸發驗證碼流程（若後端開啟）。
- 不同瀏覽器/裝置：Cookie 設定與導頁是否一致。
- HTTPS 與同站／跨站（若有）行為一致性。

## 與現況整合
- `/login` 已完成前端表單與驗證、提交 `POST /auth/login` 的流程。
- 採 Cookie 會話後：
  - 前端不保存 Token；以 Cookie 自動帶入授權。
  - 若跨子域/跨站，後端需設定 CORS、Cookie domain 與 `SameSite=None; Secure` 並導入 CSRF 機制。

## 第三方登入（Google/Facebook/LINE）— 後端主導（Set-Cookie）
- 為何後端主導：安全（不暴露 secret/減少 Token 出現在前端）、一致（與 Cookie 會話策略一致）、供應商差異由後端統一抽象。
- 端點流程：
  - `GET /auth/oauth/{provider}/start?redirectUrl=/member`
    - 產生 `state`（與可選 PKCE），302 導向供應商授權頁。
  - `GET /auth/oauth/{provider}/callback?code=...&state=...`
    - 後端驗證 `state`（與 PKCE），以 `code` 換取 access/id token，查/建使用者，Set-Cookie（HttpOnly; Secure; SameSite）並 302 導回 `redirectUrl`（白名單）。
- 前端行為：
  - `/login` 按鈕直接導向 `GET /auth/oauth/{provider}/start?redirectUrl=...`。
  - 成功：回到 `redirectUrl`；失敗：顯示錯誤（如 `/login?error=provider_error`）。
- 錯誤碼建議：`OAUTH_PROVIDER_DENIED`、`OAUTH_INVALID_STATE`、`OAUTH_EXCHANGE_FAILED`、`OAUTH_REDIRECT_INVALID`。

## 本次後端落地清單（請依此開發與驗收）
1) `/auth/login` 採 Set-Cookie(HttpOnly) 會話
   - 成功回應：
     - 200 + `{ redirectUrl?: string }`；或 204（無 body）
     - 皆需下發：`Set-Cookie: sgame_session=...; HttpOnly; Secure; SameSite=Lax|None; Path=/; Max-Age(取決 rememberme)`
   - 失敗回應：`{ code, message, reload? }`（如 `AUTH_INVALID_CREDENTIALS`、`AUTH_NEEDS_RECAPTCHA`）
   - 若跨站：提供 CSRF Token（`/auth/session` 或 meta），並允許 credentials CORS

2) OAuth 起始與回調端點
   - `GET /auth/oauth/{provider}/start?redirectUrl=`：產生 `state`（與可選 PKCE），302 至供應商
   - `GET /auth/oauth/{provider}/callback?code&state`：驗證 state/PKCE、交換 token、建立/綁定使用者、Set-Cookie、302 導回
   - 錯誤導回：`/login?error=CODE`；錯誤碼：`OAUTH_PROVIDER_DENIED`、`OAUTH_INVALID_STATE`、`OAUTH_EXCHANGE_FAILED`、`OAUTH_REDIRECT_INVALID`

3) `/auth/logout`
   - 讓 `sgame_session` 失效（清除/過期），回 `{ success: true }` 或 204

4) `/auth/session`
   - 回登入狀態與基礎 profile（最少 `userId`、`expiresAt`），若使用 CSRF 流程，一併回傳 `csrfToken`

5) 共同規範
   - Cookie domain/path/samesite/secure 設定拍板
   - redirectUrl 白名單規則拍板
   - OAuth scopes：Google(openid email profile) / LINE(openid profile email) / Facebook(public_profile email)
   - 風險控管：登入節流與 reCAPTCHA 觸發條件

## 與後端工程師討論清單（請確認）
- Cookie 設定
  - 名稱、domain、path、`HttpOnly`、`Secure`、`SameSite`。
  - `rememberme` 的 TTL（例：30 天）。
- 錯誤碼與 reCAPTCHA
  - 錯誤碼表（`AUTH_INVALID_CREDENTIALS`、`AUTH_NEEDS_RECAPTCHA`、`TOO_MANY_ATTEMPTS`…）。
  - 觸發 reCAPTCHA 條件與欄位名稱（`recaptcha`）。
- CSRF 與跨站
  - 若 `SameSite=None`：提供 CSRF Token 取得方式（`/auth/session` 或 meta），與驗證規則。
  - CORS 設定（允許來源、Credentials）。
- 導頁規則
  - 由後端回傳 `redirectUrl` 還是以請求值為準；是否需要白名單過濾。
- 登出行為
  - `/auth/logout` 是否清除 Cookie 或使其過期；是否同時使 refresh token 失效。
- Session 與刷新（若使用短會期）
  - 是否提供 `/auth/refresh`，或單純使用短期 Session + 滑動過期機制。

## 範例回應（完整）
### 成功（Set-Cookie + redirect）
```http
HTTP/1.1 200 OK
Set-Cookie: sgame_session=eyJ...; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
Content-Type: application/json

{ "redirectUrl": "/member" }
```

### 失敗（一般錯誤）
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "code": "AUTH_INVALID_CREDENTIALS",
  "message": "帳號或密碼錯誤",
  "reload": false
}
```

### 失敗（需驗證碼）
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "code": "AUTH_NEEDS_RECAPTCHA",
  "message": "請勾選我不是機器人",
  "reload": true
}
```


