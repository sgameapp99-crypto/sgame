# 看數據功能 - 後端API需求文檔

## 概述

本功能需要重新設計"看數據"部分，參考原站的複雜數據展示功能。需要實現對戰資訊、球隊資訊、戰績排名和賽事結果查詢等功能。

## 核心功能模塊

### 1. 對戰資訊 (Battle Information)
**頁面**: `/games/battle/:gameId`
**原站對應**: `battle6005.html`

#### 1.1 賽事列表 API
**端點**: `GET /api/games/battle/list`
**參數**:
- `alliance_id` (number): 聯盟ID
- `date` (string, optional): 日期，格式: YYYY-MM-DD

**回應格式**:
```json
{
  "success": true,
  "data": {
    "games": [
      {
        "id": "2025091611001",
        "alliance_id": 1,
        "alliance_name": "MLB",
        "home_team": {
          "id": 1,
          "name": "小熊",
          "logo": "/images/teams/cubs.png"
        },
        "away_team": {
          "id": 2,
          "name": "海盜",
          "logo": "/images/teams/pirates.png"
        },
        "scheduled_time": "2025-09-16T06:40:00Z",
        "venue": "PNC Park",
        "status": "scheduled" // scheduled, live, finished
      }
    ]
  }
}
```

#### 1.2 對戰詳細資訊 API
**端點**: `GET /api/games/battle/{gameId}`
**參數**: 無

**回應格式**:
```json
{
  "success": true,
  "data": {
    "game": {
      "id": "2025091611001",
      "alliance_id": 1,
      "home_team": {...},
      "away_team": {...},
      "scheduled_time": "2025-09-16T06:40:00Z",
      "venue": "PNC Park"
    },
    "starting_pitchers": {
      "home": {
        "name": "Braxton Ashcraft",
        "wins": 32,
        "losses": 37,
        "era": 4.04,
        "whip": 1.23,
        "recent_games": [...]
      },
      "away": {
        "name": "Jameson Taillon",
        "wins": 26,
        "losses": 25,
        "era": 3.82,
        "whip": 1.18,
        "recent_games": [...]
      }
    },
    "recent_matches": {
      "home_team": [...], // 近10場比賽
      "away_team": [...], // 近10場比賽
      "head_to_head": [...] // 雙方對戰記錄
    },
    "lineups": {
      "home": [...], // 先發打線
      "away": [...]  // 先發打線
    },
    "team_stats": {
      "home": {
        "batting_avg": 0.241,
        "obp": 0.312,
        "slg": 0.398,
        "era": 3.82,
        "rankings": {...}
      },
      "away": {
        "batting_avg": 0.239,
        "obp": 0.308,
        "slg": 0.385,
        "era": 4.04,
        "rankings": {...}
      }
    },
    "odds_history": [
      {
        "date": "2025-09-15",
        "international": {"home": -150, "away": +130},
        "bank": {"home": "1.45", "away": "2.75", "over_under": "7.5"}
      }
    ],
    "season_stats": {
      "home": {"wins": 75, "losses": 65, "win_rate": 0.536},
      "away": {"wins": 68, "losses": 72, "win_rate": 0.486}
    }
  }
}
```

### 2. 球隊資訊 (Team Information)
**頁面**: `/games/teams`
**原站對應**: `teams6005.html`

#### 2.1 球隊列表 API
**端點**: `GET /api/games/teams`
**參數**:
- `alliance_id` (number): 聯盟ID

**回應格式**:
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": 1,
        "name": "芝加哥小熊",
        "short_name": "小熊",
        "logo": "/images/teams/cubs.png",
        "city": "芝加哥",
        "stadium": "Wrigley Field",
        "founded": 1876,
        "stats": {
          "wins": 75,
          "losses": 65,
          "win_rate": 0.536,
          "games_behind": 2.5
        }
      }
    ]
  }
}
```

#### 2.2 球隊詳細資訊 API
**端點**: `GET /api/games/teams/{teamId}`
**參數**:
- `season` (string, optional): 賽季年份

**回應格式**:
```json
{
  "success": true,
  "data": {
    "team": {...},
    "players": {
      "pitchers": [...],
      "batters": [...]
    },
    "season_stats": {...},
    "recent_games": [...]
  }
}
```

### 3. 戰績排名 (Standings)
**頁面**: `/games/standings`
**原站對應**: `standings/3aa3c.html`

#### 3.1 聯盟排名 API
**端點**: `GET /api/games/standings`
**參數**:
- `alliance_id` (number): 聯盟ID
- `season` (string, optional): 賽季年份

**回應格式**:
```json
{
  "success": true,
  "data": {
    "divisions": [
      {
        "name": "國聯中區",
        "teams": [
          {
            "rank": 1,
            "team": {...},
            "wins": 88,
            "losses": 52,
            "win_rate": 0.629,
            "games_behind": 0,
            "streak": "W5"
          }
        ]
      }
    ],
    "wildcards": [...],
    "updated_at": "2025-09-16T10:00:00Z"
  }
}
```

### 4. 賽事結果查詢 (Game Results)
**頁面**: `/games/results`
**原站對應**: `resulte177.html`

#### 4.1 賽事查詢 API
**端點**: `GET /api/games/results`
**參數**:
- `alliance_id` (number, optional): 聯盟ID
- `team_id` (number, optional): 球隊ID
- `date_from` (string, optional): 開始日期
- `date_to` (string, optional): 結束日期
- `season` (string, optional): 賽季年份
- `limit` (number, optional): 返回數量，預設20
- `offset` (number, optional): 分頁偏移

**回應格式**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "2025091611001",
        "date": "2025-09-16",
        "home_team": {...},
        "away_team": {...},
        "home_score": 5,
        "away_score": 3,
        "winner": "home",
        "status": "final",
        "inning": 9,
        "venue": "PNC Park"
      }
    ],
    "total": 2450,
    "has_more": true
  }
}
```

## 數據更新機制

### 即時比分更新
**端點**: `GET /api/games/live-scores`
**WebSocket**: `ws://api.playsport.cc/games/live`

### 數據快取策略
- 賽事列表：快取5分鐘
- 對戰詳細資訊：快取10分鐘
- 排名數據：快取30分鐘
- 歷史數據：快取24小時

## 錯誤處理

所有API都需要統一的錯誤響應格式：

```json
{
  "success": false,
  "error": {
    "code": "GAME_NOT_FOUND",
    "message": "比賽不存在",
    "details": {...}
  }
}
```

## 效能要求

- 賽事列表API響應時間 < 500ms
- 對戰詳細資訊API響應時間 < 1s
- 支持高併發請求
- 數據壓縮和CDN加速

## 數據來源

需要整合以下數據源：
- MLB Stats API
- NBA Stats API
- 中華職棒官網
- 運彩公司數據
- 即時比分服務

## 後續擴展

預留以下功能接口：
- 球員個人數據頁面
- 高級統計分析
- 預測數據整合
- 數據視覺化圖表
