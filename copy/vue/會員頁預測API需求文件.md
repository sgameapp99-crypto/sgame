# 會員頁預測功能 - 後端 API 需求文件

## 文件版本
- 版本：v1.0
- 日期：2025-10-22
- 負責人：前端團隊

---

## 一、需求概述

會員頁面的預測功能需要支援日期範圍篩選，允許用戶查看：
- **一週內**：今天到未來 7 天的預測
- **一個月內**：今天到未來 30 天的預測
- **全部**：今天到未來所有的預測（不限結束日期）

預設情況下（未選擇任何日期範圍），應顯示今天到未來所有的預測。

---

## 二、API 端點資訊

### 端點
```
GET /api/predictions
```

### 用途
獲取用戶的預測列表，支援多種篩選條件，包括日期範圍。

---

## 三、新增參數說明

### 請求參數（Query Parameters）

| 參數名 | 類型 | 必填 | 說明 | 範例值 |
|--------|------|------|------|--------|
| `userId` | string | 是 | 用戶 ID | `"user123"` |
| `page` | number | 否 | 頁碼，預設 1 | `1` |
| `size` | number | 否 | 每頁筆數，預設 20 | `20` |
| `allianceId` | number | 否 | 聯盟 ID（例如：1=MLB, 2=NBA） | `1` |
| **`startDate`** | **string** | **否** | **開始日期（YYYY-MM-DD 格式）** | **`"2025-10-22"`** |
| **`endDate`** | **string** | **否** | **結束日期（YYYY-MM-DD 格式）** | **`"2025-10-29"`** |

### 新增參數詳細說明

#### `startDate`（開始日期）
- **格式**：`YYYY-MM-DD`（例如：`2025-10-22`）
- **說明**：篩選賽事日期 >= startDate 的預測
- **預設行為**：
  - 如果未提供，則不進行日期篩選
  - 前端預設會傳入今天的日期（`2025-10-22`）

#### `endDate`（結束日期）
- **格式**：`YYYY-MM-DD`（例如：`2025-10-29`）
- **說明**：篩選賽事日期 <= endDate 的預測
- **預設行為**：
  - 如果未提供或為 `undefined`，則**不限制結束日期**（顯示所有未來的預測）
  - 這是關鍵：當用戶選擇「全部」時，前端不會傳 `endDate`，後端應返回從 `startDate` 開始的所有未來預測

---

## 四、日期篩選邏輯

### 後端需要實現的邏輯

```sql
-- 偽代碼，展示篩選邏輯
SELECT * FROM predictions
WHERE user_id = :userId
  AND game_date >= :startDate  -- 必須 >= 開始日期
  AND (:endDate IS NULL OR game_date <= :endDate)  -- 如果 endDate 存在，則 <= 結束日期
ORDER BY game_date ASC, created_at DESC
```

### 三種使用場景

#### 場景 1：一週內
```
前端傳入：
  startDate = "2025-10-22" (今天)
  endDate = "2025-10-29" (今天 + 7 天)

後端應返回：
  賽事日期在 2025-10-22 到 2025-10-29 之間的預測
```

#### 場景 2：一個月內
```
前端傳入：
  startDate = "2025-10-22" (今天)
  endDate = "2025-11-21" (今天 + 30 天)

後端應返回：
  賽事日期在 2025-10-22 到 2025-11-21 之間的預測
```

#### 場景 3：全部（最重要）
```
前端傳入：
  startDate = "2025-10-22" (今天)
  endDate = undefined (不傳此參數)

後端應返回：
  賽事日期 >= 2025-10-22 的所有預測（不限結束日期）
```

---

## 五、請求範例

### 範例 1：查詢一週內的預測
```http
GET /api/predictions?userId=user123&startDate=2025-10-22&endDate=2025-10-29&page=1&size=20
```

### 範例 2：查詢一個月內的預測
```http
GET /api/predictions?userId=user123&startDate=2025-10-22&endDate=2025-11-21&page=1&size=20
```

### 範例 3：查詢全部未來預測（不傳 endDate）
```http
GET /api/predictions?userId=user123&startDate=2025-10-22&page=1&size=20
```

### 範例 4：結合聯盟篩選
```http
GET /api/predictions?userId=user123&allianceId=1&startDate=2025-10-22&endDate=2025-10-29&page=1&size=20
```

---

## 六、回應格式

### 成功回應（HTTP 200）

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": "user123",
      "userName": "張三",
      "userAvatarUrl": "https://example.com/avatar.jpg",
      "gameId": "20251022MLB001",
      "gameInfo": {
        "allianceId": 1,
        "allianceName": "MLB",
        "sportType": "baseball",
        "gameDate": "2025-10-22",
        "gameTime": "19:30:00",
        "homeTeam": "洋基",
        "awayTeam": "道奇",
        "finalScore": null
      },
      "predictionType": "international_spread",
      "predictionTypeLabel": "國際讓分",
      "selection": "home",
      "selectionLabel": "洋基",
      "odds": "1.90",
      "price": 100,
      "isMainPick": true,
      "note": "主場優勢明顯",
      "status": "pending",
      "isPurchased": false,
      "isOwn": true,
      "purchaseCount": 5,
      "createdAt": "2025-10-22T10:30:00Z",
      "updatedAt": "2025-10-22T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 45
  }
}
```

### 錯誤回應範例

#### 缺少必填參數（HTTP 400）
```json
{
  "success": false,
  "message": "缺少必填參數：userId",
  "code": "MISSING_REQUIRED_PARAM"
}
```

#### 日期格式錯誤（HTTP 400）
```json
{
  "success": false,
  "message": "日期格式錯誤，請使用 YYYY-MM-DD 格式",
  "code": "INVALID_DATE_FORMAT"
}
```

#### 用戶不存在（HTTP 404）
```json
{
  "success": false,
  "message": "用戶不存在",
  "code": "USER_NOT_FOUND"
}
```

---

## 七、測試案例

### 測試案例 1：基本日期範圍篩選
```
輸入：
  userId = "test_user"
  startDate = "2025-10-22"
  endDate = "2025-10-29"

預期：
  只返回 gameDate 在 2025-10-22 到 2025-10-29 之間的預測
```

### 測試案例 2：不傳 endDate
```
輸入：
  userId = "test_user"
  startDate = "2025-10-22"
  endDate = undefined (不傳)

預期：
  返回 gameDate >= 2025-10-22 的所有預測，無論日期多遠
```

### 測試案例 3：startDate > endDate（邊界情況）
```
輸入：
  userId = "test_user"
  startDate = "2025-10-29"
  endDate = "2025-10-22"

預期：
  返回錯誤："開始日期不能大於結束日期"
```

### 測試案例 4：結合聯盟篩選
```
輸入：
  userId = "test_user"
  allianceId = 1
  startDate = "2025-10-22"
  endDate = "2025-10-29"

預期：
  只返回 MLB (allianceId=1) 且日期在範圍內的預測
```

### 測試案例 5：無數據情況
```
輸入：
  userId = "test_user"
  startDate = "2025-12-01"
  endDate = "2025-12-31"

預期（假設該用戶在這段時間無預測）：
  {
    "success": true,
    "data": [],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 0
    }
  }
```

---

## 八、資料庫欄位對應

請確認以下欄位存在於資料庫中：

| 前端欄位名 | 後端資料庫欄位名 | 說明 |
|-----------|----------------|------|
| `gameInfo.gameDate` | `game_date` 或 `games.game_date` | 賽事日期（YYYY-MM-DD） |
| `userId` | `user_id` | 用戶 ID |
| `allianceId` | `alliance_id` 或 `games.alliance_id` | 聯盟 ID |

---

## 九、實作建議

### Node.js/Express 範例

```javascript
// GET /api/predictions
async function getPredictions(req, res) {
  const { userId, startDate, endDate, allianceId, page = 1, size = 20 } = req.query;

  // 驗證必填參數
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: '缺少必填參數：userId',
      code: 'MISSING_REQUIRED_PARAM'
    });
  }

  // 驗證日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (startDate && !dateRegex.test(startDate)) {
    return res.status(400).json({
      success: false,
      message: '開始日期格式錯誤，請使用 YYYY-MM-DD 格式',
      code: 'INVALID_DATE_FORMAT'
    });
  }
  if (endDate && !dateRegex.test(endDate)) {
    return res.status(400).json({
      success: false,
      message: '結束日期格式錯誤，請使用 YYYY-MM-DD 格式',
      code: 'INVALID_DATE_FORMAT'
    });
  }

  // 驗證 startDate <= endDate
  if (startDate && endDate && startDate > endDate) {
    return res.status(400).json({
      success: false,
      message: '開始日期不能大於結束日期',
      code: 'INVALID_DATE_RANGE'
    });
  }

  try {
    // 構建查詢條件
    const where = { userId };
    
    if (allianceId) {
      where.allianceId = allianceId;
    }
    
    // 日期範圍篩選
    if (startDate) {
      where.gameDate = { $gte: startDate };
    }
    if (endDate) {
      where.gameDate = { ...where.gameDate, $lte: endDate };
    }

    // 查詢資料庫
    const predictions = await Prediction.find(where)
      .skip((page - 1) * size)
      .limit(size)
      .sort({ gameDate: 1, createdAt: -1 });

    const total = await Prediction.countDocuments(where);

    res.json({
      success: true,
      data: predictions,
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        total
      }
    });
  } catch (error) {
    console.error('獲取預測失敗:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
```

### Python/FastAPI 範例

```python
from datetime import date
from typing import Optional
from fastapi import APIRouter, Query, HTTPException

router = APIRouter()

@router.get("/api/predictions")
async def get_predictions(
    userId: str = Query(..., description="用戶 ID"),
    startDate: Optional[str] = Query(None, regex="^\d{4}-\d{2}-\d{2}$", description="開始日期 (YYYY-MM-DD)"),
    endDate: Optional[str] = Query(None, regex="^\d{4}-\d{2}-\d{2}$", description="結束日期 (YYYY-MM-DD)"),
    allianceId: Optional[int] = Query(None, description="聯盟 ID"),
    page: int = Query(1, ge=1, description="頁碼"),
    size: int = Query(20, ge=1, le=100, description="每頁筆數")
):
    # 驗證日期範圍
    if startDate and endDate and startDate > endDate:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": "開始日期不能大於結束日期",
                "code": "INVALID_DATE_RANGE"
            }
        )
    
    # 構建查詢條件
    filters = {"user_id": userId}
    
    if allianceId:
        filters["alliance_id"] = allianceId
    
    if startDate:
        filters["game_date__gte"] = startDate
    
    if endDate:
        filters["game_date__lte"] = endDate
    
    # 查詢資料庫
    try:
        predictions = await Prediction.filter(**filters)\
            .order_by("game_date", "-created_at")\
            .offset((page - 1) * size)\
            .limit(size)
        
        total = await Prediction.filter(**filters).count()
        
        return {
            "success": True,
            "data": [p.to_dict() for p in predictions],
            "pagination": {
                "page": page,
                "size": size,
                "total": total
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "伺服器錯誤",
                "code": "INTERNAL_SERVER_ERROR"
            }
        )
```

---

## 十、前端呼叫方式

前端已按以下方式實作：

```typescript
// copy/vue/src/pages/MemberPage.vue - loadPredictions 函數

async function loadPredictions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = today.toISOString().split('T')[0]; // "2025-10-22"
  
  // 根據選擇計算 endDate
  let endDate: string | undefined;
  if (selectedDateRange.value === 'week') {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 7);
    endDate = futureDate.toISOString().split('T')[0]; // "2025-10-29"
  } else if (selectedDateRange.value === 'month') {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 30);
    endDate = futureDate.toISOString().split('T')[0]; // "2025-11-21"
  }
  // 'all' 時不設置 endDate

  // 呼叫 API
  const result = await predictionsAPI.getPredictions({
    userId: userId,
    page: currentPage.value,
    size: pageSize.value,
    startDate: startDate,      // 一定會傳
    endDate: endDate,          // 可能為 undefined
  });
}
```

---

## 十一、重要提醒

### ⚠️ 關鍵點 1：endDate 為 undefined 的處理
**當 `endDate` 參數未提供（undefined）時，後端必須返回從 `startDate` 開始的所有未來預測，不限結束日期。**

這是「全部」選項的核心邏輯，請務必正確實作。

### ⚠️ 關鍵點 2：日期比較使用 gameDate
篩選條件應該基於**賽事日期（gameDate）**，而不是預測創建時間（createdAt）。

### ⚠️ 關鍵點 3：時區處理
- 前端傳入的日期格式為 `YYYY-MM-DD`（不含時區）
- 後端在比較時應使用 `>=` 和 `<=`，並以賽事當地時區為準
- 建議後端統一將日期轉換為 UTC+0 或賽事所在時區進行比較

---

## 十二、聯絡資訊

如有任何疑問或需要澄清的地方，請聯繫：

- **前端負責人**：[您的名字]
- **Email**：[您的信箱]
- **Slack/Teams**：[聯絡方式]

---

## 十三、驗收標準

後端實作完成後，請提供以下資訊以便前端驗收：

- [ ] 1. API 端點是否已部署到測試環境
- [ ] 2. 測試環境 URL
- [ ] 3. 測試用的 userId（含有多筆預測資料）
- [ ] 4. 確認三種場景（一週內、一個月內、全部）都能正確返回資料
- [ ] 5. 確認分頁功能正常
- [ ] 6. 確認錯誤處理（參數驗證、錯誤碼）符合文件規範

---

**文件結束**

