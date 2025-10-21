# 🏀 玩運彩預測平台 - Vue3 前端應用

## 📖 項目簡介

玩運彩預測平台是一個專業的運動預測分享與販售平台，提供籃球、足球、棒球等各類運動的預測分析服務。本項目使用 **Vue3 + Vite + TypeScript** 技術棧構建現代化的前端應用。

### 🌟 主要功能

- **🏆 運動預測**: 提供多種運動項目的專業預測分析
- **💬 社群討論**: 活躍的用戶社群討論區
- **📊 數據分析**: 基於大數據的賽事分析和統計
- **👥 專家系統**: 認證專家預測師等級制度
- **💰 預測交易**: 預測內容的購買和販售功能
- **📱 響應式設計**: 支持桌面端和移動端訪問

## 🛠 技術架構

### 核心技術棧

- **框架**: [Vue.js 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **路由**: [Vue Router 4](https://router.vuejs.org/)
- **狀態管理**: [Pinia](https://pinia.vuejs.org/)
- **UI 組件庫**: [Element Plus](https://element-plus.org/)
- **CSS 框架**: [Tailwind CSS](https://tailwindcss.com/)

### 開發工具

- **HTTP 客戶端**: [Axios](https://axios-http.com/)
- **表單驗證**: [VeeValidate 4](https://vee-validate.logaretm.com/)
- **圖表庫**: [Chart.js](https://www.chartjs.org/) + [ECharts](https://echarts.apache.org/)
- **代碼規範**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- **測試框架**: [Vitest](https://vitest.dev/)

## 🚀 快速開始

### 環境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **操作系統**: Linux/macOS/Windows

### 項目位置

完整的 Vue3 項目位於 `copy/vue/` 目錄下。

### 一鍵安裝

```bash
# 進入項目目錄
cd sgame/copy/vue

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

### 手動安裝

1. **進入項目目錄**
   ```bash
   cd sgame/copy/vue
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發服務器**
   ```bash
   npm run dev
   ```

4. **訪問應用**
   - 本地訪問: http://localhost:5175
   - 網絡訪問: http://[您的IP]:5175

## 📁 項目結構

```
sgame/
├── copy/
│   └── vue/                    # 完整的 Vue3 項目
│       ├── src/
│       │   ├── components/     # Vue 組件
│       │   │   ├── AppHeader.vue
│       │   │   ├── AppFooter.vue
│       │   │   ├── BaseCard.vue
│       │   │   ├── BaseTable.vue
│       │   │   ├── Breadcrumb.vue
│       │   │   ├── LoadingState.vue
│       │   │   └── LegacyPageContainer.vue
│       │   ├── pages/          # 頁面組件
│       │   │   ├── HomePage.vue
│       │   │   ├── MemberPage.vue
│       │   │   ├── PredictPage.vue
│       │   │   ├── PredictPurchasePage.vue
│       │   │   ├── GamesPage.vue
│       │   │   ├── GamesListPage.vue
│       │   │   └── GameDetailPage.vue
│       │   ├── router/         # 路由配置
│       │   ├── utils/          # 工具函數
│       │   └── assets/         # 資源文件
│       ├── public/             # 靜態資源
│       ├── package.json        # 項目配置
│       ├── vite.config.ts      # Vite 配置
│       ├── tailwind.config.ts  # Tailwind 配置
│       └── tsconfig.json       # TypeScript 配置
├── README.md                   # 項目說明
└── quick-start.sh             # 快速啟動腳本
```

## 🔧 開發指令

```bash
# 進入項目目錄
cd copy/vue

# 開發
npm run dev                # 啟動開發服務器
npm run dev:host          # 啟動開發服務器（允許外部訪問）

# 構建
npm run build             # 構建生產版本
npm run preview           # 預覽生產版本

# 代碼質量
npm run lint              # ESLint 代碼檢查
npm run lint:fix          # 自動修復 ESLint 問題
npm run format            # Prettier 代碼格式化

# 測試
npm run test              # 運行測試
npm run test:ui           # 運行測試 UI
npm run test:coverage     # 運行測試並生成覆蓋率報告

# PM2 進程管理
npm run pm2:dev           # 使用 PM2 啟動開發服務器
npm run pm2:preview       # 使用 PM2 啟動預覽服務器
npm run pm2:stop          # 停止 PM2 進程
npm run pm2:restart       # 重啟 PM2 進程
```

## 🔄 重構完成功能

### 頁面重構

已完成以下頁面的重構和遷移：

- **會員區** (`/member`) - 用戶個人資料和統計信息
- **會員設定** (`/member/settings`) - 帳戶設定頁面，支持大頭貼上傳、名稱修改、密碼重設
- **預測/買牌** (`/predict`) - 預測內容展示
- **預測購買** (`/predict/buy`) - 預測購買頁面，支持表格展示
- **賽事資料** (`/games`) - 賽事統計和資料展示
- **賽事清單** (`/games/list`) - 賽事列表，支持表格操作
- **賽事詳情** (`/games/detail/[id]`) - 動態路由的賽事詳情頁面

### 組件化重構

創建了可重用的通用組件：

- **BaseCard**: 統一的卡片容器，支持載入、錯誤、空狀態
- **BaseTable**: 通用表格組件，支持自定義操作按鈕
- **Breadcrumb**: 面包屑導航組件
- **LoadingState**: 載入狀態組件，支持多種尺寸
- **LegacyPageContainer**: Legacy 內容載入容器

### 用戶功能

- **大頭貼上傳**: 支持上傳和更新用戶大頭貼（最大 5MB，支持 JPEG/PNG/WebP）
- **名稱修改**: 允許用戶修改顯示名稱
  - 長度限制：2-10 字元
  - 內容限制：僅允許中文和英文字母
  - 即時驗證：輸入時即時顯示驗證結果
  - 字元計數：顯示當前字元數/上限
- **密碼管理**: 透過郵件重設密碼功能
- **即時更新**: 所有變更即時同步到會員頁面

### Legacy 系統整合

- **Legacy 內容載入**: 支持從舊版系統載入 HTML 內容
- **URL 重寫**: 自動重寫 Legacy 系統的 URL 路徑
- **緩存管理**: 實現了智能緩存機制，提升載入性能
- **表格解析**: 自動解析 Legacy HTML 中的表格數據

## 🎨 UI 組件

### Element Plus 組件

項目使用 Element Plus 作為主要 UI 組件庫，提供：

- 表單組件（Input、Select、DatePicker 等）
- 數據展示組件（Table、Pagination 等）
- 導航組件（Menu、Breadcrumb 等）
- 反饋組件（Message、Dialog 等）

### 自定義組件

- **AppHeader**: 頂部導航欄
- **AppFooter**: 底部信息欄
- **BaseCard**: 通用卡片組件（支持載入、錯誤、空狀態）
- **BaseTable**: 通用表格組件（支持自定義操作按鈕）
- **Breadcrumb**: 面包屑導航組件
- **LoadingState**: 載入狀態組件（多種尺寸）
- **LegacyPageContainer**: Legacy 頁面容器（統一處理舊版內容載入）

## 📊 狀態管理

使用 Pinia 進行狀態管理，主要包括：

### 用戶狀態 (useUserStore)

- 用戶認證狀態
- 用戶信息管理
- 登入/登出邏輯
- 權限控制

### 應用狀態 (useAppStore)

- 主題切換
- 語言設置
- 全局加載狀態
- 通知管理

## 🚀 部署指南

### 構建應用

```bash
cd copy/vue
npm run build
```

### PM2 部署

```bash
# 使用 PM2 啟動生產版本
npm run pm2:preview

# 查看 PM2 狀態
pm2 status

# 查看日誌
pm2 logs
```

## 🧪 測試

### 單元測試

使用 Vitest 進行單元測試：

```bash
npm run test
```

### E2E 測試

使用 Playwright 進行端到端測試：

```bash
npm run test:e2e
```

## 📈 性能優化

### 代碼分割

- 路由級別的代碼分割
- 組件懶加載
- 第三方庫按需引入

### 緩存策略

- 靜態資源緩存
- API 響應緩存
- 頁面級別緩存

## 🐛 問題排查

### 常見問題

1. **開發服務器啟動失敗**
   - 檢查 Node.js 版本
   - 清除 node_modules 重新安裝
   - 檢查端口占用

2. **TypeScript 錯誤**
   - 運行 `npm run lint`
   - 檢查 tsconfig.json 配置

3. **樣式問題**
   - 檢查 Tailwind CSS 配置
   - 確認 Element Plus 樣式引入

### 調試技巧

- 使用 Vue DevTools
- 檢查瀏覽器控制台
- 查看 Vite 開發服務器日誌

## 🤝 貢獻指南

### 開發流程

1. Fork 項目
2. 創建功能分支
3. 提交更改
4. 創建 Pull Request

### 代碼規範

- 遵循 ESLint 規則
- 使用 Prettier 格式化
- 編寫單元測試
- 更新文檔

## 📄 許可證

本項目採用 MIT 許可證 - 詳見 [LICENSE](LICENSE) 文件

## 👥 團隊

- **項目負責人**: AI輔助工程師團隊
- **前端開發**: Vue3 + Vite 專家
- **UI/UX 設計**: 用戶體驗設計師
- **後端開發**: Node.js + Python 工程師

## 📞 聯絡我們

- **技術支持**: tech-support@sgame.com
- **商務合作**: business@sgame.com
- **問題反饋**: [GitHub Issues](https://github.com/your-org/sgame/issues)

---

## 📋 後續工作提醒

### SEO 優化計劃
項目完成後，建議進行 SEO 優化以提升搜索引擎可見度：

- **詳細計劃**：請查看 [SEO_OPTIMIZATION_PLAN.md](./SEO_OPTIMIZATION_PLAN.md)
- **檢查清單**：請查看 [SEO_CHECKLIST.md](./SEO_CHECKLIST.md)
- **預估時間**：1-2 週
- **技術方案**：Nuxt3 首頁 + Vue+Vite 應用混合架構

### 為什麼需要 SEO？
- 提升搜索引擎排名
- 增加自然流量
- 提高品牌曝光度
- 改善用戶獲取成本

---

**🎯 讓我們一起打造最專業的運動預測平台！**