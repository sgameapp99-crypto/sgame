# 玩運彩 Vue 3 前端項目

這是一個基於 Vue 3 + TypeScript + Vite 的現代化前端項目，使用 Pinia 進行狀態管理，Element Plus 作為 UI 組件庫。

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
│   ├── legal/          # 法律條款相關組件
│   │   ├── TermsOfService.vue      # 服務條款組件
│   │   ├── PrivacyPolicy.vue       # 隱私權政策組件
│   │   └── SalesPredictionRules.vue # 販售預測規範組件
│   ├── AppHeader.vue   # 頂部導航組件
│   └── AppFooter.vue   # 底部組件
├── pages/              # 頁面組件
│   ├── LegalPage.vue   # 法律條款頁面
│   ├── HomePage.vue    # 首頁
│   ├── LoginPage.vue   # 登入頁面
│   └── ...
├── stores/             # Pinia 狀態管理
├── router/             # 路由配置
└── utils/              # 工具函數
```

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

### v1.0.0 (2024-01-XX)
- 初始版本發布
- 完成法律條款三個組件開發
- 實現 LegalPage 查看頁面
- 添加頂部導航法律條款連結
- 支援響應式設計和無障礙訪問

## 聯繫方式

如有問題或建議，請聯繫開發團隊。
