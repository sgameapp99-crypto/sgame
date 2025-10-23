# 🚀 預測系統快速參考指南

## 📁 檔案結構

```
sgame/
├── copy/vue/src/
│   ├── types/              # TypeScript 類型定義
│   │   ├── game.ts         # 賽事相關類型
│   │   ├── prediction.ts   # 預測相關類型
│   │   ├── coin.ts         # 彩幣相關類型
│   │   └── alliance.ts     # 聯盟相關類型
│   │
│   ├── api/                # API 服務層
│   │   ├── games.ts        # 賽事 API
│   │   ├── predictions.ts  # 預測 API
│   │   ├── coins.ts        # 彩幣 API
│   │   └── index.ts        # 統一匯出
│   │
│   ├── components/         # Vue 組件
│   │   ├── CoinBalance.vue
│   │   ├── CoinPurchaseDialog.vue
│   │   ├── PurchaseDialog.vue
│   │   ├── PredictionCard.vue
│   │   └── PredictGamesTable.vue
│   │
│   └── pages/              # 頁面組件
│       ├── PredictPage.vue         # 預測頁面
│       ├── MemberPage.vue          # 會員頁面
│       └── MemberSettingsPage.vue  # 設定頁面
│
├── api/前端整合文檔1022/
│   └── 預測系統API規劃書.md        # 後端 API 規劃
│
├── 預測系統前端整合完成報告.md      # 完整實作報告
└── 預測系統實作進度報告.md          # 進度追蹤
```

---

## 🔑 核心功能

### 1. 預測提交（PredictPage.vue）
```typescript
// 使用方式
import { predictionsAPI } from '@/api';

await predictionsAPI.createPrediction({
  gameId: '2025101510001',
  predictionType: 'taiwan_spread',
  selection: 'home',
  odds: '1.85',
  price: 100,
  isMainPick: false,
  note: '主場優勢明顯',
});
```

### 2. 查看預測（MemberPage.vue）
```typescript
// 查看自己的預測
const result = await predictionsAPI.getMyPredictions({
  page: 1,
  size: 20,
});

// 查看其他會員的預測
const result = await predictionsAPI.getMemberPredictions('memberId', {
  page: 1,
  size: 20,
});
```

### 3. 購買預測（MemberPage.vue）
```typescript
// 購買預測
const result = await predictionsAPI.purchasePrediction('predictionId');

// 檢查是否已購買
function isPredictionPurchased(prediction: UserPrediction): boolean {
  if (prediction.userId === session.profile?.id) return true;
  if (prediction.purchasedBy?.includes(session.profile?.id)) return true;
  return false;
}
```

### 4. 預測設定（MemberSettingsPage.vue）
```typescript
// 取得設定
const settings = await predictionsAPI.getPredictionSettings();

// 更新設定
await predictionsAPI.updatePredictionSettings({
  defaultPrice: 100,
  allowPurchase: true,
  autoPublish: true,
});
```

### 5. 彩幣操作
```typescript
// 查詢餘額
const balance = await coinsAPI.getBalance();

// 儲值
await coinsAPI.deposit(1000);

// 查詢交易紀錄
const transactions = await coinsAPI.getTransactions({ page: 1, size: 20 });
```

---

## 🎯 類型定義速查

### UserPrediction
```typescript
interface UserPrediction {
  predictionId: string;
  gameId: string;
  userId: string;
  allianceId: number;
  gameDate: Date;
  gameTime: string;
  homeTeamName: string;
  awayTeamName: string;
  predictionType: PredictionType;
  selection: PredictionSelection;
  value: string;
  odds: string;
  price: number;
  isMainPick: boolean;
  status: PredictionStatus;
  createdAt: Date;
  purchasedBy?: string[];
}
```

### PredictionType
```typescript
type PredictionType = 
  | 'international_spread'   // 國際盤讓分
  | 'international_total'    // 國際盤大小分
  | 'taiwan_spread'          // 台灣盤讓分
  | 'taiwan_moneyline'       // 台灣盤獨贏
  | 'taiwan_total';          // 台灣盤大小分
```

### PredictionStatus
```typescript
type PredictionStatus = 
  | 'pending'  // 等待結果
  | 'win'      // 勝
  | 'lose'     // 輸
  | 'push';    // 和局/取消
```

---

## 🌐 API 端點一覽

| 功能 | 方法 | 端點 | 說明 |
|------|------|------|------|
| 取得賽事 | GET | `/api/v1/games` | 支援篩選條件 |
| 建立預測 | POST | `/api/v1/predictions` | 需登入 |
| 我的預測 | GET | `/api/v1/me/predictions` | 需登入 |
| 會員預測 | GET | `/api/v1/members/{id}/predictions` | 公開 |
| 購買預測 | POST | `/api/v1/predictions/{id}/purchase` | 需登入 |
| 取得設定 | GET | `/api/v1/me/prediction-settings` | 需登入 |
| 更新設定 | PATCH | `/api/v1/me/prediction-settings` | 需登入 |
| 取得餘額 | GET | `/api/v1/me/coins/balance` | 需登入 |
| 儲值彩幣 | POST | `/api/v1/me/coins/deposit` | 需登入 |
| 交易紀錄 | GET | `/api/v1/me/coins/transactions` | 需登入 |

---

## 🎨 組件使用範例

### CoinBalance.vue
```vue
<template>
  <CoinBalance />
</template>

<script setup>
import CoinBalance from '@/components/CoinBalance.vue';
</script>
```

### PredictionCard.vue
```vue
<template>
  <PredictionCard
    :prediction="prediction"
    :is-purchased="isPredictionPurchased(prediction)"
    @purchase="handlePurchase"
  />
</template>

<script setup>
import PredictionCard from '@/components/PredictionCard.vue';
</script>
```

---

## 🔧 常見錯誤碼

| 錯誤碼 | 說明 | 前端處理 |
|--------|------|---------|
| `GAME_STARTED` | 賽事已開始 | 提示無法建立預測 |
| `PREDICTION_EXISTS` | 預測已存在 | 提示已建立過預測 |
| `INSUFFICIENT_BALANCE` | 彩幣不足 | 提示儲值或餘額不足 |
| `ALREADY_PURCHASED` | 已購買過 | 提示已購買，直接顯示 |
| `SELF_PURCHASE` | 不能買自己的預測 | 提示錯誤 |
| `PREDICTION_NOT_FOUND` | 預測不存在 | 提示找不到預測 |
| `GAME_NOT_FOUND` | 賽事不存在 | 提示找不到賽事 |

---

## 📱 頁面路由

| 路由 | 組件 | 說明 |
|------|------|------|
| `/predict` | PredictPage.vue | 預測頁面 |
| `/member/:id` | MemberPage.vue | 會員個人頁 |
| `/member` | MemberPage.vue | 自己的個人頁 |
| `/member/settings` | MemberSettingsPage.vue | 設定頁面 |

---

## 🧪 測試檢查清單

### 預測提交
- [ ] 未登入時導向登入頁面
- [ ] 成功提交後顯示成功訊息
- [ ] 賽事已開始時顯示錯誤
- [ ] 重複提交時顯示錯誤

### 預測查看
- [ ] 自己的預測完全可見
- [ ] 其他會員未購買的預測隱藏詳情
- [ ] 已購買的預測顯示完整資訊
- [ ] 日期篩選正確

### 購買預測
- [ ] 餘額不足時顯示錯誤
- [ ] 購買成功後自動刷新
- [ ] 不能購買自己的預測
- [ ] 不能重複購買

### 預測設定
- [ ] 設定載入正確
- [ ] 設定儲存成功
- [ ] 價格驗證（0-10000）
- [ ] 新建預測使用新設定

---

## 💡 開發技巧

### 1. 錯誤處理模式
```typescript
try {
  const result = await someAPI.method();
  if (result.success) {
    // 成功處理
  }
} catch (e: any) {
  const code = e?.response?.data?.code;
  const message = e?.response?.data?.message;
  
  if (code === 'SPECIFIC_ERROR') {
    // 特定錯誤處理
  } else {
    // 通用錯誤處理
  }
}
```

### 2. 登入檢查模式
```typescript
if (!session.loggedIn) {
  message.value = '請先登入';
  setTimeout(() => {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
  }, 1500);
  return;
}
```

### 3. 資料重新載入模式
```typescript
async function refreshData() {
  await loadPredictions();
  await loadCoinBalance();
}
```

---

## 📚 參考文檔

1. **API 規劃**：`api/前端整合文檔1022/預測系統API規劃書.md`
2. **完成報告**：`預測系統前端整合完成報告.md`
3. **進度追蹤**：`預測系統實作進度報告.md`
4. **主文檔**：`README.md`

---

## 🆘 需要協助？

如果遇到問題，請按照以下順序排查：
1. 檢查瀏覽器控制台的錯誤訊息
2. 確認 API 端點是否正確
3. 檢查網路請求的回應內容
4. 查看相關類型定義是否匹配
5. 參考完成報告中的實作細節

---

**最後更新**: 2025年10月22日

