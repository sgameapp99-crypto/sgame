## 檢查清單

1. ✅ 盤點前端 `LivescorePage.vue` 所需欄位並確認資料來源。
2. ✅ 檢視前端 mock (`mockApi.ts`、`mock-data.json`、`types.ts`) 與現行資料庫 schema。
3. ✅ 更新 `openapi.yaml`，新增 `/livescore` 查詢端點並定義所有欄位結構。
4. ✅ 更新 README 與 API 文件說明，即時比分欄位與使用方式。
5. ✅ 建立整合測試驗證篩選邏輯、錯誤處理與資料結構。

## 欄位與 API 對應

| 欄位名稱 | 資料型別 | 必填/選填 | 對應 API 端點 | 備註 |
|----------|----------|-----------|---------------|------|
| game_id | string | 必填 | `GET /api/livescore` | 賽事唯一識別碼，沿用 `games.id` |
| alliance_id | number | 必填 | `GET /api/livescore` | 聯盟識別碼，支援 `?allianceId=` 篩選 |
| league_code | string | 必填 | `GET /api/livescore` | 聯盟代碼 `alliances.code`，支援 `?leagueCode=` |
| status | string (`scheduled`\|`live`\|`finished`) | 必填 | `GET /api/livescore` | 以 Prisma `games.status` 回傳 |
| start_time | string (ISO 8601 without timezone) | 必填 | `GET /api/livescore` | 由 `gameDate` + `gameTime` 組成 `YYYY-MM-DDTHH:mm:ss` |
| home_team | object | 必填 | `GET /api/livescore` | 含 `id`、`name`、`pitcher` (可為 null) |
| away_team | object | 必填 | `GET /api/livescore` | 含 `id`、`name`、`pitcher` (可為 null) |
| home_score | number\|null | 必填 | `GET /api/livescore` | 優先取 `game_live_details.currentScoreHome`，否則 `games.finalScoreHome` |
| away_score | number\|null | 必填 | `GET /api/livescore` | 同上 |
| live_phase | string\|null | 選填 | `GET /api/livescore` | `game_live_details.livePhase` |
| scoreboard_detail | object\|null | 選填 | `GET /api/livescore` | `game_live_details.scoreboardDetail`，結構依運動類型 |
| live_stats | object\|null | 選填 | `GET /api/livescore` | `game_live_details.liveStats` |
| soccer_league | object\|null | 選填 | `GET /api/livescore` | { id, name }，由 `soccerLeagueId` / `soccerLeagueName` 組成 |
| odds_info | object | 選填 | `GET /api/livescore` | `{ international, taiwan, live }`；`live` 取自 `game_live_details.oddsInfo` |
| last_updated | string (date-time) | 必填 | `GET /api/livescore` | 取自 `game_live_details.lastUpdated`，若無則 `games.updatedAt` |

> 補充：若未填入即時資訊，對應欄位會回傳 `null`，方便前端分岔處理。

## API 規格摘要

- **Method / Path**：`GET /api/livescore`
- **授權**：公開端點，可在未登入狀態下存取。
- **查詢參數**：
  - `status` (`scheduled`/`live`/`finished`)，預設全選。
  - `allianceId`、`leagueCode`、`soccerLeagueId`，對應聯盟/聯賽篩選。
  - `date` (`YYYY-MM-DD`)，指定比賽日期。
  - `page`、`size` 用於分頁，`size` 介於 1~100，預設 20。
- **回應結構**：
  - `success`：布林值。
  - `data`：`LivescoreItem[]`，欄位詳解如上表。
- `pagination`：`{ page, size, total, totalPages, hasNext }`。
- 400 錯誤時回傳 `{ success:false, code:'INVALID_STATUS', message:'...' }`，其他錯誤則為 `{ success:false, code:'LIVESCORE_QUERY_FAILED', message:'...' }`。

## 實作重點

- 新增 Prisma 模型 `GameLiveDetail` 保存 live 資訊，外鍵關聯 `games.id`。
- Service 層：整合 `games` 與 `game_live_details`，自動補足分數與統計欄位。
- Controller：支援數值字串轉換、參數預設值與錯誤訊息。
- OpenAPI / README：同步更新端點描述與欄位定義。
- 整合測試：建立測試聯盟與賽事資料，驗證篩選、分頁與錯誤處理。

## 待檢查項目

- [ ] 線上環境資料同步：需於部署流程中執行 `prisma/migrations/20251104_add_game_live_detail.sql`。
- [ ] 前端串接：確認 `LivescorePage.vue` 解析新欄位並處理 `null` 狀態。
- [ ] 後續擴充：若導入即時賠率來源，填入 `game_live_details.oddsInfo` 即可回傳。
