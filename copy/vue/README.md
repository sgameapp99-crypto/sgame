# 運彩王 Vue 3 前端項目

這是一個基於 Vue 3 + TypeScript + Vite 的現代化前端項目，使用 Pinia 進行狀態管理，Element Plus 作為 UI 組件庫。

## 🧪 API 測試頁面

**完整的後端 API 測試工具已經就緒!**

### 快速訪問
啟動開發服務器後,訪問:
```
http://localhost:5175/test-login.html
```

### 功能特色
- ✅ 測試所有 21 個 API 端點
- 📊 即時統計資訊 (總數/已測試/成功/失敗)
- 🎨 現代化卡片式布局
- 🚦 視覺化狀態指示器
- 📋 完整的測試流程指南

### 相關文檔
- **測試頁面**: `public/test-login.html`
- **測試指南**: `public/API測試指南.md`
- **交付報告**: `public/階段一交付報告.md`

### 測試範圍
- 認證系統 (登入/註冊/登出/OAuth)
- 郵箱驗證 (發送驗證碼/驗證/狀態查詢)
- 密碼管理 (修改/重設/過期狀態)
- 會員功能 (資料查詢/追蹤/頭像上傳)
- 等級系統 (列表/統計)

---

## 技術棧

- **核心框架**: Vue 3.x + TypeScript
- **構建工具**: Vite
- **狀態管理**: Pinia
- **UI 組件庫**: Element Plus
- **路由**: Vue Router 4 (Nuxt3 內建)
- **HTTP 客戶端**: Axios
- **表單處理**: VeeValidate 4
- **圖表庫**: Chart.js / ECharts
- **CSS 框架**: Tailwind CSS

## 項目結構

```
src/
├── components/          # 可重用組件
│   ├── AllianceMenu.vue # 聯盟選單組件
│   ├── legal/          # 法律條款相關組件
│   │   ├── TermsOfService.vue      # 服務條款組件
│   │   ├── PrivacyPolicy.vue       # 隱私權政策組件
│   │   └── SalesPredictionRules.vue # 販售預測規範組件
│   ├── AppHeader.vue   # 頂部導航組件
│   └── AppFooter.vue   # 底部組件
├── pages/              # 頁面組件
│   ├── LegalPage.vue   # 法律條款頁面
│   ├── HomePage.vue    # 首頁
│   ├── LivescorePage.vue # 即時比分頁面
│   ├── LoginPage.vue   # 登入頁面
│   └── ...
├── stores/             # Pinia 狀態管理
├── router/             # 路由配置
└── utils/              # 工具函數
```

## 聯盟選單組件

### AllianceMenu.vue - 聯盟選單組件

一個可重用的聯盟選單組件，包含運動聯盟選擇、展開/收起功能、足球聯賽選擇和時間篩選器。

#### 功能特色

- **多運動種類支援**: 支援棒球、籃球、足球、冰球、美式足球、網球等多種運動
- **展開/收起功能**: 每個運動種類都可以展開顯示更多聯盟選項
- **足球聯賽選擇**: 當選擇足球時自動顯示聯賽選單
- **時間篩選器**: 支援昨天、今天、明天等時間篩選（預測頁面專用：今天、明天、後天）
- **日曆功能**: 提供完整的日曆選擇器
- **響應式設計**: 適配桌面、平板、手機等多種螢幕尺寸

## 預測功能組件

### PredictPage.vue - 預測頁面

重構後的預測頁面，使用 AllianceMenu 組件進行聯盟和時間選擇，整合 PredictGamesTable 組件顯示賽事列表。

#### 功能特色

- **組件化設計**: 使用 AllianceMenu 組件統一聯盟選擇體驗
- **預測專用時間篩選**: 僅顯示今天、明天、後天，避免舊日期預測
- **模擬數據支持**: 內建 Mock 賽事數據，便於開發和測試
- **即時篩選**: 根據選擇的聯盟和日期動態篩選賽事

### PredictGamesTable.vue - 賽事預測表格組件

專門用於渲染賽事預測表格的組件，包含投注選項和賽事資訊顯示。

#### 功能特色

- **完整的投注界面**: 支援國際盤和運彩盤的各種投注選項
- **賽事資訊展示**: 顯示比賽時間、隊伍資訊、投手資料
- **互動式選項**: 支援讓分、大小、不讓分等多種投注類型
- **響應式設計**: 適配各種螢幕尺寸
- **登入提示**: 未登入時顯示登入提示

#### Props 接口

```typescript
interface Game {
  gameId: string;
  allianceId: number;
  gameDate: Date;
  gameTime: string;
  homeTeam: {
    id: number;
    name: string;
    pitcher: string;
  };
  awayTeam: {
    id: number;
    name: string;
    pitcher: string;
  };
  internationalOdds: {
    spread: {
      home: { line: string; odds: string };
      away: { line: string; odds: string };
    };
    total: {
      over: { line: string; odds: string };
      under: { line: string; odds: string };
    };
  };
  taiwanOdds: {
    spread: {
      home: { line: string; odds: string };
      away: { line: string; odds: string };
    };
    moneyline: {
      home: { odds: string };
      away: { odds: string };
    };
    total: {
      over: { line: string; odds: string };
      under: { line: string; odds: string };
    };
  };
}

interface Props {
  games: Game[];                                    // 賽事數據數組
  selectedAlliance: number;                         // 當前選中的聯盟ID
  selectedDate: Date;                              // 選中的日期
  selectedStatusType: 'finished' | 'live' | 'scheduled'; // 狀態類型
}
```

#### Events 接口

```typescript
// 預測選擇事件
emit('select-prediction', prediction: any)
```

#### 使用範例

```vue
<template>
  <PredictGamesTable
    :games="filteredGames"
    :selected-alliance="selectedAlliance"
    :selected-date="selectedDate"
    :selected-status-type="selectedStatusType"
    @select-prediction="handlePredictionSelect"
  />
</template>
```

#### 適用場景

- **預測頁面**: 主要的賽事預測功能頁面
- **投注頁面**: 任何需要顯示賽事投注選項的頁面
- **賽事詳情頁面**: 顯示特定賽事的詳細投注資訊

## 法律條款功能

### 組件說明

1. **TermsOfService.vue** - 服務條款組件
   - 包含完整的服務條款內容
   - 涵蓋註冊義務、會員服務、帳號保管等章節
   - 響應式設計，支援各種螢幕尺寸

2. **PrivacyPolicy.vue** - 隱私權政策組件
   - 個人資料蒐集與使用說明
   - Cookie 使用政策
   - 資訊安全保護措施

3. **SalesPredictionRules.vue** - 販售預測規範組件
   - 預測販售相關規定
   - 違規處理辦法
   - 權利歸屬說明

### 頁面功能

**LegalPage.vue** - 法律條款查看頁面
- 使用 Tab 標籤頁設計
- 支援三個法律文件的切換查看
- 響應式設計，適配各種設備
- 支援 URL 錨點導航

### 使用方法

1. **直接訪問頁面**
   ```
   http://localhost:3000/legal
   ```

2. **通過導航訪問**
   - 在頂部導航欄點擊「法律條款」按鈕
   - 支援登入和未登入狀態

3. **URL 錨點導航**
   ```
   http://localhost:3000/legal#privacy  # 直接跳轉到隱私權政策
   http://localhost:3000/legal#sales    # 直接跳轉到販售預測規範
   ```

### 特色功能

- **現代化設計**: 使用 Vue 3 Composition API 和 TypeScript
- **響應式佈局**: 支援桌面、平板、手機等各種設備
- **無障礙設計**: 支援鍵盤導航和螢幕閱讀器
- **動畫效果**: 平滑的標籤切換動畫
- **SEO 友好**: 支援 URL 錨點和 meta 標籤

## 開發指南

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 構建生產版本
```bash
npm run build
```

### 代碼檢查
```bash
npm run lint
```

## 組件開發規範

1. **使用 TypeScript**: 所有組件都使用 TypeScript 編寫
2. **Composition API**: 優先使用 Vue 3 Composition API
3. **響應式設計**: 確保組件在不同螢幕尺寸下正常顯示
4. **無障礙設計**: 遵循 WCAG 2.1 標準
5. **代碼註釋**: 重要功能需要添加中文註釋

## 更新日誌

### v1.3.0 (2025-10-21)
- ✅ **頭像顯示功能修正**: 修正 Vite proxy 配置，添加 `/uploads` 路徑代理，解決頭像 404 問題
- ✅ **認證流程優化**: 完善註冊→登入→驗證的完整流程
- ✅ **頭像工具函數**: 新增 `src/utils/avatar.ts` 統一處理頭像 URL
- ✅ **靜態資源代理**: 配置 Vite 代理轉發所有 `/uploads/*` 請求到後端服務器
- 📝 詳細說明請參考：`AVATAR_FIX_REPORT.md`

### v1.2.0 (2025-10-15)
- 重構預測頁面：PredictPage.vue 整合 AllianceMenu 組件，實現統一的聯盟選擇體驗
- 新增 PredictGamesTable 組件：專門處理賽事預測表格的渲染，支援完整的投注選項顯示
- 預測專用時間篩選：修改 AllianceMenu 組件在預測頁面的時間選項為今天、明天、後天，避免舊日期預測
- Mock 數據支持：內建模擬賽事數據，便於開發和測試賽事篩選功能
- 組件化架構優化：提升代碼可維護性和重用性，實現組件間的清晰分離

### v1.1.0 (2025-10-14)
- 重構聯盟選單組件：將 LivescorePage.vue 中的聯盟選單邏輯抽離為獨立的 AllianceMenu.vue 組件
- 組件化設計：AllianceMenu 組件支援多種運動聯盟選擇、展開/收起功能、足球聯賽選擇和時間篩選
- 代碼優化：提升代碼可維護性和重用性，減少重複代碼
- 完善文檔：更新 README.md，詳細說明 AllianceMenu 組件的使用方法和接口

### v1.0.0 (2024-01-XX)
- 初始版本發布
- 完成法律條款三個組件開發
- 實現 LegalPage 查看頁面
- 添加頂部導航法律條款連結
- 支援響應式設計和無障礙訪問

## 聯繫方式

如有問題或建議，請聯繫開發團隊。
