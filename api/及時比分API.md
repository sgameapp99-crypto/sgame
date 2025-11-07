## 檢查清單

1. 盤點 `LivescorePage.vue` 與相關遊戲卡元件使用的欄位。
2. 檢視 `mockApi.ts`、`mock-data.json`、`types.ts` 中即時比分資料結構。
3. 搜尋 `openapi.yaml` 是否定義賽事或即時比分相關端點。
4. 比對 `API-Check.md` 測試清單確認端點覆蓋情形。
5. 彙整必要欄位並對應可用 API，無對應則標註 `N/A`。

## 欄位與 API 對應

| 欄位名稱 | 資料型別 | 必填/選填 | 對應API端點 | 備註 |
|----------|----------|-----------|-------------|------|
| game_id | number | 必填 | N/A | OpenAPI 未定義賽事查詢端點，需新增如 `/games` 或 `/livescore` |
| alliance_id | number | 必填 | N/A | 用於聯盟篩選；目前僅存在前端 mock，建議後端提供 `?alliance=` 參數 |
| league_code | string | 必填 | N/A | 顯示聯盟代碼/名稱；需與未來字典 API 對齊 |
| status | string (`scheduled`\|`live`\|`finished`) | 必填 | N/A | 決定頁面篩選與樣式；後端需提供一致狀態集合 |
| start_time | string (ISO 8601) | 必填 | N/A | 目前 mock 為 `YYYY-MM-DD HH:mm`；建議統一為 ISO 字串 |
| home_team_name | string | 必填 | N/A | 用於卡片展示與超連結文字 |
| home_team_id | number | 選填 | N/A | 供導向隊伍頁使用；無端點可查隊伍資料 |
| home_score | number | 必填 | N/A | 即時比分核心資料；需支援進行中即時更新 |
| away_team_name | string | 必填 | N/A | 用於卡片展示與超連結文字 |
| away_team_id | number | 選填 | N/A | 供導向隊伍頁使用；建議搭配隊伍資料 API |
| away_score | number | 必填 | N/A | 即時比分核心資料；需支援進行中即時更新 |
| live_phase | string | 選填 | N/A | 例：棒球局數、籃球節次、足球分鐘；目前僅前端資料 |
| scoreboard_detail | object | 選填 | N/A | 包含每局/每節得分陣列；需明確資料結構定義 |
| live_stats | object | 選填 | N/A | 包含投手/打擊資訊、SBO 計數等；後端未定義 |
| soccer_league_id | number | 選填 | N/A | 足球聯盟細分篩選；需配合 `/filters/leagues` 類型端點 |
| odds_info | object | 選填 | N/A | 目前 mock `odds` 僅前端資料；若需展示賠率需另建 API |

> 備註：現行 OpenAPI 未收錄任何賽事或即時比分端點，上表欄位皆需待後端補齊對應服務。

