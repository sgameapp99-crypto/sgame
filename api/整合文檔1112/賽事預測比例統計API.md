# 賽事預測比例統計 API - 前端整合文檔

**日期**: 2025-11-12  
**版本**: 1.0.0  
**狀態**: ✅ 已測試通過

## 📋 概述

新增賽事預測比例統計 API，前端可查詢特定賽事的預測分布情況，包含各預測類型（讓分盤、大小分盤等）的選項比例。

### 核心功能

- ✅ 依預測類型分組統計
- ✅ 計算各選項的數量與百分比
- ✅ Redis 快取（60 秒 TTL）提升效能
- ✅ 支援無預測資料的賽事

---

## 🔌 API 端點

### GET /api/games/{gameId}/prediction-stats

查詢指定賽事的預測統計資料。

#### 請求參數

| 參數 | 類型 | 位置 | 必填 | 說明 |
|------|------|------|------|------|
| `gameId` | string | path | ✅ | 賽事 ID（例如：`MLB20251111007`） |

#### 請求範例

```bash
# 基本查詢
curl -k https://api.sportspro.tw/api/games/MLB20251111007/prediction-stats

# 使用 fetch
fetch('https://api.sportspro.tw/api/games/MLB20251111007/prediction-stats')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 📤 回應格式

### 成功回應 (200 OK)

#### 有預測資料的情況

```json
{
  "success": true,
  "data": {
    "totalPredictions": 150,
    "byType": {
      "international_spread": {
        "total": 80,
        "selections": {
          "home": {
            "count": 48,
            "percentage": 60
          },
          "away": {
            "count": 32,
            "percentage": 40
          }
        }
      },
      "international_total": {
        "total": 70,
        "selections": {
          "over": {
            "count": 49,
            "percentage": 70
          },
          "under": {
            "count": 21,
            "percentage": 30
          }
        }
      },
      "taiwan_spread": {
        "total": 50,
        "selections": {
          "home": {
            "count": 30,
            "percentage": 60
          },
          "away": {
            "count": 20,
            "percentage": 40
          }
        }
      },
      "taiwan_moneyline": {
        "total": 45,
        "selections": {
          "home": {
            "count": 25,
            "percentage": 56
          },
          "away": {
            "count": 20,
            "percentage": 44
          }
        }
      },
      "taiwan_total": {
        "total": 55,
        "selections": {
          "over": {
            "count": 35,
            "percentage": 64
          },
          "under": {
            "count": 20,
            "percentage": 36
          }
        }
      }
    }
  }
}
```

#### 無預測資料的情況

```json
{
  "success": true,
  "data": {
    "totalPredictions": 0,
    "byType": {}
  }
}
```

### 錯誤回應

#### 404 - 賽事不存在

```json
{
  "success": false,
  "message": "賽事不存在"
}
```

#### 500 - 伺服器錯誤

```json
{
  "success": false,
  "message": "取得賽事預測統計失敗"
}
```

---

## 📊 資料結構說明

### 回應欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `success` | boolean | 請求是否成功 |
| `data` | object | 統計資料 |
| `data.totalPredictions` | number | 該賽事的總預測數量 |
| `data.byType` | object | 依預測類型分組的統計（鍵為預測類型） |

### 預測類型 (byType 的鍵)

| 預測類型 | 說明 | 可能的選項 |
|----------|------|-----------|
| `international_spread` | 國際盤讓分 | `home`, `away` |
| `international_total` | 國際盤大小分 | `over`, `under` |
| `taiwan_spread` | 台灣盤讓分 | `home`, `away` |
| `taiwan_moneyline` | 台灣盤獨贏 | `home`, `away` |
| `taiwan_total` | 台灣盤大小分 | `over`, `under` |

### 選項統計結構

每個選項包含：

| 欄位 | 類型 | 說明 |
|------|------|------|
| `count` | number | 該選項的預測數量 |
| `percentage` | number | 該選項的百分比（四捨五入到整數） |

---

## 💡 前端使用範例

### Vue 3 + TypeScript

```typescript
// types.ts
export interface PredictionStats {
  totalPredictions: number;
  byType: {
    [predictionType: string]: {
      total: number;
      selections: {
        [selection: string]: {
          count: number;
          percentage: number;
        };
      };
    };
  };
}

// api.ts
export async function getGamePredictionStats(gameId: string): Promise<PredictionStats> {
  const response = await fetch(`/api/games/${gameId}/prediction-stats`);
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || '取得預測統計失敗');
  }
  
  return result.data;
}

// Component.vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getGamePredictionStats } from '@/api';
import type { PredictionStats } from '@/types';

const props = defineProps<{
  gameId: string;
}>();

const stats = ref<PredictionStats | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    stats.value = await getGamePredictionStats(props.gameId);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '載入失敗';
  } finally {
    loading.value = false;
  }
});

// 取得預測類型的中文名稱
function getPredictionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'international_spread': '國際盤讓分',
    'international_total': '國際盤大小分',
    'taiwan_spread': '台灣盤讓分',
    'taiwan_moneyline': '台灣盤獨贏',
    'taiwan_total': '台灣盤大小分',
  };
  return labels[type] || type;
}

// 取得選項的中文名稱
function getSelectionLabel(selection: string): string {
  const labels: Record<string, string> = {
    'home': '主隊',
    'away': '客隊',
    'over': '大分',
    'under': '小分',
  };
  return labels[selection] || selection;
}
</script>

<template>
  <div class="prediction-stats">
    <div v-if="loading">載入中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="stats">
      <h3>預測統計（共 {{ stats.totalPredictions }} 筆）</h3>
      
      <div v-if="stats.totalPredictions === 0" class="empty">
        目前尚無預測資料
      </div>
      
      <div v-else class="stats-grid">
        <div 
          v-for="(typeData, type) in stats.byType" 
          :key="type"
          class="stat-card"
        >
          <h4>{{ getPredictionTypeLabel(type) }}</h4>
          <p class="total">共 {{ typeData.total }} 筆</p>
          
          <div class="selections">
            <div 
              v-for="(selData, selection) in typeData.selections"
              :key="selection"
              class="selection-item"
            >
              <div class="selection-label">
                {{ getSelectionLabel(selection) }}
              </div>
              <div class="selection-bar">
                <div 
                  class="bar-fill" 
                  :style="{ width: selData.percentage + '%' }"
                ></div>
              </div>
              <div class="selection-stats">
                <span class="count">{{ selData.count }} 筆</span>
                <span class="percentage">{{ selData.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prediction-stats {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: white;
}

.stat-card h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.total {
  color: #666;
  font-size: 14px;
  margin: 0 0 16px 0;
}

.selections {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selection-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.selection-label {
  font-weight: 500;
  color: #555;
}

.selection-bar {
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease;
}

.selection-stats {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.percentage {
  font-weight: 600;
  color: #4CAF50;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #999;
}

.error {
  color: #f44336;
  padding: 16px;
  background: #ffebee;
  border-radius: 4px;
}
</style>
```

### React + TypeScript

```typescript
// types.ts
export interface PredictionStats {
  totalPredictions: number;
  byType: {
    [predictionType: string]: {
      total: number;
      selections: {
        [selection: string]: {
          count: number;
          percentage: number;
        };
      };
    };
  };
}

// hooks/usePredictionStats.ts
import { useState, useEffect } from 'react';
import type { PredictionStats } from '../types';

export function usePredictionStats(gameId: string) {
  const [stats, setStats] = useState<PredictionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/games/${gameId}/prediction-stats`);
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || '取得預測統計失敗');
        }
        
        setStats(result.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '載入失敗');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [gameId]);

  return { stats, loading, error };
}

// PredictionStatsCard.tsx
import React from 'react';
import { usePredictionStats } from './hooks/usePredictionStats';

interface Props {
  gameId: string;
}

const PREDICTION_TYPE_LABELS: Record<string, string> = {
  'international_spread': '國際盤讓分',
  'international_total': '國際盤大小分',
  'taiwan_spread': '台灣盤讓分',
  'taiwan_moneyline': '台灣盤獨贏',
  'taiwan_total': '台灣盤大小分',
};

const SELECTION_LABELS: Record<string, string> = {
  'home': '主隊',
  'away': '客隊',
  'over': '大分',
  'under': '小分',
};

export function PredictionStatsCard({ gameId }: Props) {
  const { stats, loading, error } = usePredictionStats(gameId);

  if (loading) return <div>載入中...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return null;

  return (
    <div className="prediction-stats">
      <h3>預測統計（共 {stats.totalPredictions} 筆）</h3>
      
      {stats.totalPredictions === 0 ? (
        <div className="empty">目前尚無預測資料</div>
      ) : (
        <div className="stats-grid">
          {Object.entries(stats.byType).map(([type, typeData]) => (
            <div key={type} className="stat-card">
              <h4>{PREDICTION_TYPE_LABELS[type] || type}</h4>
              <p className="total">共 {typeData.total} 筆</p>
              
              <div className="selections">
                {Object.entries(typeData.selections).map(([selection, selData]) => (
                  <div key={selection} className="selection-item">
                    <div className="selection-label">
                      {SELECTION_LABELS[selection] || selection}
                    </div>
                    <div className="selection-bar">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${selData.percentage}%` }}
                      />
                    </div>
                    <div className="selection-stats">
                      <span className="count">{selData.count} 筆</span>
                      <span className="percentage">{selData.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## ⚡ 效能特性

### Redis 快取

- **快取時間**: 60 秒
- **快取鍵格式**: `game:stats:{gameId}`
- **快取策略**: 先讀快取，未命中則查詢資料庫並寫入快取
- **降級處理**: Redis 失敗時自動降級到資料庫查詢

### 資料庫優化

- 使用 Prisma `groupBy` 進行聚合查詢
- 避免載入完整預測物件，僅統計數量
- 適合大量預測資料的場景

---

## 🧪 測試範例

### 測試腳本

```bash
#!/bin/bash

# 測試有預測資料的賽事
echo "測試有預測資料的賽事："
curl -k -s https://api.sportspro.tw/api/games/MLB20251111007/prediction-stats | jq .

# 測試無預測資料的賽事
echo -e "\n測試無預測資料的賽事："
curl -k -s https://api.sportspro.tw/api/games/MLB20251101001/prediction-stats | jq .

# 測試不存在的賽事
echo -e "\n測試不存在的賽事："
curl -k -s https://api.sportspro.tw/api/games/INVALID_ID/prediction-stats | jq .

# 測試快取效能（第二次請求應該更快）
echo -e "\n測試快取效能："
time curl -k -s https://api.sportspro.tw/api/games/MLB20251111007/prediction-stats > /dev/null
time curl -k -s https://api.sportspro.tw/api/games/MLB20251111007/prediction-stats > /dev/null
```

### 預期結果

1. **有預測資料**: 回傳完整統計，包含各類型與選項
2. **無預測資料**: `totalPredictions: 0`, `byType: {}`
3. **賽事不存在**: 404 錯誤
4. **快取效能**: 第二次請求明顯更快

---

## 📝 注意事項

### 1. 快取時效

- 統計資料快取 60 秒
- 如需即時更新，請等待快取過期或清除快取

### 2. 百分比計算

- 百分比為四捨五入到整數
- 多個選項的百分比總和可能因四捨五入而不完全等於 100%

### 3. 預測類型

- 只統計已存在的預測類型
- 如果某個類型沒有任何預測，該類型不會出現在 `byType` 中

### 4. 效能建議

- 適合在賽事詳情頁或預測列表頁使用
- 避免在短時間內重複請求同一賽事
- 利用快取機制減少伺服器負載

---

## 🔄 版本歷史

### v1.0.0 (2025-11-12)

- ✅ 初始版本發布
- ✅ 支援五種預測類型統計
- ✅ Redis 快取整合
- ✅ 完整錯誤處理

---

## 📞 技術支援

如有問題或建議，請聯繫後端開發團隊。

**文檔版本**: 1.0.0  
**最後更新**: 2025-11-12

