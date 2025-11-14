## SGame API 規格說明（對應 `openapi.yaml`）

### 總覽
- 規格格式: OpenAPI 3.1（YAML）
- 檔案位置: `copy/vue/openapi.yaml`
- 傳輸格式: `application/json`
- 授權: 預設以 HttpOnly Cookie（`sgame_session`）維持會話；部分端點可接受 Bearer（依部署設定）
- 主要領域: 認證、會員資料、預測清單、會員發文、字典（聯盟/日期）

### 核心約定
- 分頁參數: `page`（預設 1）、`size`（預設 20，上限 50）
- 錯誤格式:
  ```json
  { "code": "USER_NOT_FOUND", "message": "user not found" }
  ```
- 分頁回傳結構:
  ```json
  { "items": [ ... ], "pageMeta": { "page": 1, "size": 20, "total": 233 } }
  ```

### 主要資料模型（節錄）
- MemberProfile: `id, name, avatar, level, joinedAt, followersCount, followingCount`
- MemberStats: `totalPredictions, winRate, winStreak, ranking`
- PredictionItem: `league, gameDateTime, homeTeam, awayTeam, market, selection, isMainPick, result(win/lose/pending), score?{home,away}`
- MemberPost: `board, title, url, createdAt, replies, views, push`
- League: `id, code(如 MLB), name`
- DateFilterItem: `key(YYYY-MM-DD), label(09/16(二))`

---

## 主要資料類型（完整定義＋範例）

> 下列型別與 `openapi.yaml` 的 `components.schemas` 一致，方便後端對照。

### ErrorResponse
- 定義
  - `code: string`
  - `message: string`
- 範例
```json
{ "code": "USER_NOT_FOUND", "message": "user not found" }
```

### PageMeta（分頁資訊）
- 定義
  - `page: integer` 目前頁碼（1 起算）
  - `size: integer` 每頁筆數
  - `total: integer` 總筆數
- 範例
```json
{ "page": 1, "size": 20, "total": 233 }
```

### League（聯盟字典）
- 定義
  - `id: integer`
  - `code: string` 例：`MLB/NPB/CPBL`
  - `name: string`
- 範例
```json
{ "id": 1, "code": "MLB", "name": "MLB" }
```

### DateFilterItem（日期字典）
- 定義
  - `key: string` `YYYY-MM-DD`
  - `label: string` 例：`09/16(二)`
- 範例
```json
{ "key": "2025-09-16", "label": "09/16(二)" }
```

### MemberProfile（會員基本資料）
- 定義
  - `id: string`
  - `name: string`
  - `avatar: string` 頭像 URL
  - `level: string` 例：`NEWBIE`、`BRONZE`、`SILVER`、`GOLD`、`DIAMOND`
  - `joinedAt: string(date-time)` 加入日期
  - `followersCount: integer`
  - `followingCount: integer`
- 範例
```json
{
  "id": "ydasam",
  "name": "阿達工友",
  "avatar": "/images/avatars/ydasam.jpg",
  "level": "NEWBIE",
  "joinedAt": "2020-01-15T00:00:00+08:00",
  "followersCount": 264,
  "followingCount": 120
}
```

### MemberStats（會員統計）
- 定義
  - `totalPredictions: integer`
  - `winRate: number(float)` 0~100（%）
  - `winStreak: integer`
  - `ranking: integer`
- 範例
```json
{ "totalPredictions": 1250, "winRate": 68.5, "winStreak": 12, "ranking": 15 }
```

### MemberHonor & 榮譽列表
- MemberHonor 定義
  - `id: integer`
  - `icon: string`
  - `title: string`
  - `description: string`
  - `date: string(date)`
- 範例
```json
{
  "id": 1,
  "icon": "🏆",
  "title": "單月高手",
  "description": "連續10場命中",
  "date": "2024-01-10"
}
```

### MemberPost（會員發文）
- 定義
  - `id: integer`
  - `board: string` 例：`MLB/NBA`
  - `title: string`
  - `url: string`
  - `createdAt: string(date-time)`
  - `replies: integer`
  - `views: integer`
  - `push: integer`
- 範例
```json
{
  "id": 250915120751,
  "board": "MLB",
  "title": "今日MLB分析 - 道奇主場優勢明顯",
  "url": "/forum/post/250915120751",
  "createdAt": "2025-09-16T12:34:00+08:00",
  "replies": 25,
  "views": 156,
  "push": 8
}
```

### PredictionItem（預測列表單筆）
- 定義
  - `id: integer`
  - `league: string` 聯盟代碼（建議與 `League.code` 對齊）
  - `gameDateTime: string(date-time)` 開賽時間
  - `homeTeam: string`
  - `awayTeam: string`
  - `market: string` 玩法（例：讓分/大小/勝負…）
  - `selection: string` 顯示內容（例：`主 -1.5`、`客 PK`、`大小 220.5 大`）
  - `isMainPick: boolean` 是否主推
  - `result: string` `win|lose|pending`
  - `score?: { home: integer, away: integer }` 可選，完賽後提供
- 範例
```json
{
  "id": 101,
  "league": "MLB",
  "gameDateTime": "2025-09-16T07:35:00+08:00",
  "homeTeam": "道奇",
  "awayTeam": "巨人",
  "market": "讓分",
  "selection": "主 -1.5",
  "isMainPick": true,
  "result": "win",
  "score": { "home": 2, "away": 1 }
}
```

### PredictionsResponse（預測列表回應）
- 定義
  - `items: PredictionItem[]`
  - `pageMeta: PageMeta`
- 範例
```json
{
  "items": [ { "id": 101, "league": "MLB", "gameDateTime": "2025-09-16T07:35:00+08:00", "homeTeam": "道奇", "awayTeam": "巨人", "market": "讓分", "selection": "主 -1.5", "isMainPick": true, "result": "win" } ],
  "pageMeta": { "page": 1, "size": 20, "total": 233 }
}
```

### PostsResponse（發文列表回應）
- 定義
  - `items: MemberPost[]`
  - `pageMeta: PageMeta`
- 範例
```json
{
  "items": [ { "id": 250915120751, "board": "MLB", "title": "今日MLB分析 - 道奇主場優勢明顯", "url": "/forum/post/250915120751", "createdAt": "2025-09-16T12:34:00+08:00", "replies": 25, "views": 156, "push": 8 } ],
  "pageMeta": { "page": 1, "size": 10, "total": 312 }
}
```


---

## API 一覽表

### 認證（auth）
- `POST /auth/login` 登入（正式以 Set-Cookie HttpOnly 下發會話；開發期可回 token）
- `POST /auth/register` 註冊（email/password/name；201 或同時 Set-Cookie，支援郵箱驗證）
- `POST /auth/logout` 登出（204）
- `GET /auth/session` 取得目前 session 狀態（userId、expiresAt）
- `POST /auth/send-verification` 發送郵箱驗證碼（需登入）
- `POST /auth/verify-email` 驗證郵箱驗證碼（需登入）
- `POST /auth/resend-verification` 重新發送驗證碼（需登入，有冷卻限制）
- `GET /auth/verification-status` 檢查郵箱驗證狀態（需登入）
- `GET /auth/oauth/{provider}/start?redirectUrl=/member` 起始第三方登入（302 轉向至供應商；provider=google|facebook|line）
- `GET /auth/oauth/{provider}/callback` 第三方登入回調（交換授權碼、Set-Cookie、302 導回 redirectUrl 或 /login?error=...）

### 註冊（register）詳述
- `POST /auth/register`
  - Request（application/json）
    - `email: string(email)`
    - `password: string(>=8)`
    - `name: string`
  - Response
    - 201 Created（可選同時 Set-Cookie: sgame_session）
      ```json
      {
        "redirectUrl": "/",
        "message": "註冊成功！請檢查您的郵箱並完成驗證",
        "needsVerification": true
      }
      ```
    - 409 `{ code: "EMAIL_TAKEN" }`
    - 422 `{ code: "VALIDATION_FAILED" }`

### Email 驗證功能詳述
- `POST /auth/send-verification`
  - 發送 6 位數驗證碼到用戶郵箱
  - 需要登入狀態（Bearer Token 或 Cookie）
  - Response（200）：
    ```json
    {
      "success": true,
      "message": "驗證碼已發送至您的郵箱",
      "expiresIn": 300
    }
    ```

- `POST /auth/verify-email`
  - 驗證用戶輸入的 6 位數驗證碼
  - Request：`{ "code": "123456" }`
  - Response（200）：
    ```json
    {
      "success": true,
      "message": "郵箱驗證成功！"
    }
    ```
  - 錯誤碼：
    - `VERIFICATION_CODE_EXPIRED` 驗證碼已過期
    - `VERIFICATION_CODE_INVALID` 驗證碼錯誤

- `POST /auth/resend-verification`
  - 重新發送驗證碼（有 60 秒冷卻時間）
  - Response（200）：
    ```json
    {
      "success": true,
      "message": "驗證碼已重新發送",
      "expiresIn": 300
    }
    ```
  - 錯誤碼：
    - `RATE_LIMIT_EXCEEDED` 發送過於頻繁
    - `EMAIL_ALREADY_VERIFIED` 郵箱已驗證

- `GET /auth/verification-status`
  - 檢查用戶郵箱驗證狀態
  - Response（200）：
    ```json
    {
      "success": true,
      "isVerified": false,
      "email": "user@example.com"
    }
    ```

### 第三方登入策略（單一供應商綁定）
- 規則：一個帳號僅能綁定一種供應商（`users.oauthProvider + oauth_provider_user_id` 唯一）
- 首登：找不到 `(provider, providerUserId)` → 自動建立帳號並登入（Just-In-Time Provisioning）
- 回訪：找到即登入（簽發 HttpOnly Cookie）
- 錯誤碼建議：
  - `OAUTH_PROVIDER_DENIED` 使用者於供應商頁面拒絕
  - `OAUTH_INVALID_STATE` state/PKCE 驗證失敗
  - `OAUTH_EXCHANGE_FAILED` 授權碼交換失敗
  - `OAUTH_REDIRECT_INVALID` redirectUrl 不在白名單

### 會員（members）
- `GET /members/{id}/profile` 會員基本資料
- `GET /members/{id}/relationships` 與目前使用者關係（isSelf、isFollowing、isMutual）
- `POST /members/{id}/follow` 追蹤（204）
- `DELETE /members/{id}/follow` 取消追蹤（204）
- `GET /members/{id}/stats` 會員統計（總預測、勝率、連勝、排名）
- `GET /members/{id}/honors` 會員榮譽列表
- `GET /members/{id}/predictions` 預測清單（支援 `league`、`dateRange=today|week|month`、`page`、`size`）

### 文章（posts）
- `GET /members/{id}/posts` 會員發文清單（`page`、`size`）

### 字典/篩選（filters）
- `GET /filters/leagues` 聯盟字典列表（`id/code/name`）
- `GET /filters/dates?range=7` 近 N 天日期鍵與標籤（用於 UI 日期條）

---

## 個人設定（me）

### POST /me/avatar — 上傳並設定大頭貼（本機儲存）
- 說明：接收 `multipart/form-data` 的 `file`，驗檔（≤5MB，jpeg/png/webp）、轉為 webp、以固定檔名 `{userId}.webp` 寫入 `/static/avatars/`，更新 `users.avatar` 與 `avatarUpdatedAt`。
- 成功回應（200）
```json
{ "url": "/static/avatars/u123.webp", "updatedAt": "2025-09-18T09:10:00Z" }
```
- 可能錯誤
  - 401 未登入
  - 413 `AVATAR_FILE_TOO_LARGE`
  - 415 `AVATAR_FILE_INVALID`
  - 500 `AVATAR_UPLOAD_FAILED`

用法建議：成功後刷新 `GET /members/{id}/profile`，或在頭像 URL 後加 `?v=avatarUpdatedAt` 破快取；靜態資源目前快取 `max-age=3600`。

## 常見使用情境

### 1) Member 頁首屏資料抓取
並行請求：
- `GET /members/{id}/profile`
- `GET /members/{id}/stats`
- `GET /filters/leagues`
- `GET /filters/dates?range=7`

接著載入列表：
- `GET /members/{id}/predictions?league=MLB&dateRange=today&page=1&size=20`

### 2) 追蹤/取消追蹤
- 追蹤：`POST /members/{id}/follow`
- 取消：`DELETE /members/{id}/follow`
- 然後刷新 `GET /members/{id}/relationships` 與 `GET /members/{id}/profile`（followersCount 若在後端快取可即時更新）

### 3) 錯誤處理
- 401（Unauthorized）: token 失效或未登入
- 404（Not Found）: 會員或資源不存在
- 422（Validation）: 參數驗證錯誤
 - OAuth 相關：
   - `OAUTH_PROVIDER_DENIED` 使用者於供應商頁面拒絕
   - `OAUTH_INVALID_STATE` state/PKCE 驗證失敗
   - `OAUTH_EXCHANGE_FAILED` 授權碼交換失敗
   - `OAUTH_REDIRECT_INVALID` redirectUrl 不在白名單

---

## 結構對照 `openapi.yaml`
- `servers`: dev/staging/prod 伺服器位址
- `tags`: 領域分類（auth/members/filters/posts）
- `paths`: 端點與請求/回應定義
- `components`
  - `securitySchemes`: `bearerAuth`（JWT）
  - `parameters`: 共用參數（MemberId、league、dateRange、page、size）
  - `responses`: 共用錯誤回應（Unauthorized）
  - `schemas`: 所有資料模型（ErrorResponse/PageMeta/League/DateFilterItem/MemberProfile/MemberStats/MemberHonor/MemberPost/PredictionItem/PredictionsResponse/PostsResponse）

---

## 後續可擴充
- 新增 `date=YYYY-MM-DD` 參數（精確日期）與 `result=win|lose|pending` 過濾
- 加上 `sort`（時間/勝率/主推）
- Webhook 或事件流（如 Kafka）以 Protobuf 定義事件 schema（內部微服務）


