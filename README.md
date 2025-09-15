# 🏀 玩運彩預測平台 - Nuxt3 前端應用

## 📖 項目簡介

玩運彩預測平台是一個專業的運動預測分享與販售平台，提供籃球、足球、棒球等各類運動的預測分析服務。本項目使用 **Nuxt3 + Vue3 + TypeScript** 技術棧構建現代化的前端應用。

### 🌟 主要功能

- **🏆 運動預測**: 提供多種運動項目的專業預測分析
- **💬 社群討論**: 活躍的用戶社群討論區
- **📊 數據分析**: 基於大數據的賽事分析和統計
- **👥 專家系統**: 認證專家預測師等級制度
- **💰 預測交易**: 預測內容的購買和販售功能
- **📱 響應式設計**: 支持桌面端和移動端訪問

## 🛠 技術架構

### 核心技術棧

- **框架**: [Nuxt 3](https://nuxt.com/) + [Vue.js 3](https://vuejs.org/)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **構建工具**: [Vite](https://vitejs.dev/)
- **狀態管理**: [Pinia](https://pinia.vuejs.org/)
- **UI 組件庫**: [Element Plus](https://element-plus.org/)
- **CSS 框架**: [Tailwind CSS](https://tailwindcss.com/)

### 開發工具

- **HTTP 客戶端**: [Axios](https://axios-http.com/)
- **表單驗證**: [VeeValidate 4](https://vee-validate.logaretm.com/)
- **圖表庫**: [Chart.js](https://www.chartjs.org/) + [ECharts](https://echarts.apache.org/)
- **代碼規範**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- **測試框架**: [Vitest](https://vitest.dev/)

### 部署環境

- **雲端平台**: Google Cloud Platform (GCP)
- **容器化**: Docker
- **Web 服務器**: Nginx
- **進程管理**: PM2

## 🚀 快速開始

### 環境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **操作系統**: Linux/macOS/Windows

### 一鍵安裝

使用提供的快速啟動腳本：

\`\`\`bash
# 克隆項目（如果適用）
git clone <repository-url>
cd sgame

# 運行快速啟動腳本
./quick-start.sh
\`\`\`

### 手動安裝

1. **安裝依賴**
   \`\`\`bash
   npm install
   \`\`\`

2. **配置環境變數**
   \`\`\`bash
   cp env.example .env
   # 編輯 .env 文件設置您的配置
   \`\`\`

3. **啟動開發服務器**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **訪問應用**
   - 本地訪問: http://localhost:5173
   - 網絡訪問: http://[您的IP]:5173

## 📁 項目結構

\`\`\`
sgame/
├── assets/                 # 資源文件
│   ├── css/               # 樣式文件
│   ├── scss/              # SCSS 變數
│   └── images/            # 圖片資源
├── components/            # Vue 組件
│   ├── AppHeader.vue      # 頭部導航組件
│   ├── AppFooter.vue      # 底部組件
│   └── ...               # 其他組件
├── layouts/              # 佈局組件
│   ├── default.vue       # 默認佈局
│   └── auth.vue         # 認證佈局
├── middleware/           # 路由中間件
│   ├── auth.ts          # 認證中間件
│   └── guest.ts         # 訪客中間件
├── pages/               # 頁面組件（自動路由）
│   ├── index.vue        # 首頁
│   ├── login.vue        # 登入頁
│   └── ...             # 其他頁面
├── plugins/             # Nuxt 插件
│   └── init.client.ts   # 客戶端初始化
├── stores/              # Pinia 狀態管理
│   ├── app.ts          # 應用狀態
│   ├── user.ts         # 用戶狀態
│   └── ...            # 其他狀態
├── nuxt.config.ts      # Nuxt 配置文件
├── tailwind.config.js  # Tailwind 配置
├── tsconfig.json       # TypeScript 配置
└── package.json        # 項目配置
\`\`\`

## 🔧 開發指令

\`\`\`bash
# 開發
npm run dev                # 啟動開發服務器
npm run dev:host          # 啟動開發服務器（允許外部訪問）

# 構建
npm run build             # 構建生產版本
npm run generate          # 生成靜態網站
npm run preview           # 預覽生產版本

# 代碼質量
npm run type-check        # TypeScript 類型檢查
npm run lint              # ESLint 代碼檢查
npm run lint:fix          # 自動修復 ESLint 問題
npm run format            # Prettier 代碼格式化

# 測試
npm run test              # 運行測試
npm run test:coverage     # 運行測試並生成覆蓋率報告

# 部署
npm run deploy:dev        # 部署到開發環境
npm run deploy:prod       # 部署到生產環境
\`\`\`

## 🌐 環境配置

### 環境變數說明

\`\`\`bash
# 應用基本配置
NUXT_PUBLIC_APP_TITLE=玩運彩預測平台
NUXT_PUBLIC_APP_ENV=development
NUXT_PUBLIC_APP_VERSION=1.0.0

# API 配置
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NUXT_PUBLIC_API_TIMEOUT=10000

# GCP 配置
NUXT_PUBLIC_GCP_PROJECT_ID=your-project-id
NUXT_PUBLIC_GCP_REGION=asia-east1

# 第三方服務
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NUXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id

# 功能開關
NUXT_PUBLIC_ENABLE_MOCK_API=false
NUXT_PUBLIC_ENABLE_DEBUG_MODE=false
\`\`\`

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
- **PredictionCard**: 預測卡片組件
- **UserAvatar**: 用戶頭像組件
- **SportIcon**: 運動圖標組件

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

## 🔐 認證與授權

### 認證流程

1. 用戶登入獲取 JWT Token
2. Token 存儲在 localStorage
3. API 請求自動攜帶 Token
4. Token 過期自動刷新

### 路由守衛

- **auth**: 需要登入才能訪問
- **guest**: 僅未登入用戶可訪問
- **admin**: 僅管理員可訪問

## 🚀 部署指南

### GCP 部署

1. **準備 GCP 環境**
   \`\`\`bash
   # 安裝 gcloud CLI
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   \`\`\`

2. **構建應用**
   \`\`\`bash
   npm run build
   \`\`\`

3. **部署到 GCP**
   \`\`\`bash
   npm run deploy:prod
   \`\`\`

### Docker 部署

\`\`\`dockerfile
# Dockerfile 示例
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
\`\`\`

## 🧪 測試

### 單元測試

使用 Vitest 進行單元測試：

\`\`\`bash
npm run test
\`\`\`

### E2E 測試

使用 Playwright 進行端到端測試：

\`\`\`bash
npm run test:e2e
\`\`\`

## 📈 性能優化

### 代碼分割

- 路由級別的代碼分割
- 組件懶加載
- 第三方庫按需引入

### 緩存策略

- 靜態資源緩存
- API 響應緩存
- 頁面級別緩存

### 圖片優化

- WebP 格式支持
- 響應式圖片
- 懶加載

## 🐛 問題排查

### 常見問題

1. **開發服務器啟動失敗**
   - 檢查 Node.js 版本
   - 清除 node_modules 重新安裝
   - 檢查端口占用

2. **TypeScript 錯誤**
   - 運行 `npm run type-check`
   - 檢查 tsconfig.json 配置

3. **樣式問題**
   - 檢查 Tailwind CSS 配置
   - 確認 Element Plus 樣式引入

### 調試技巧

- 使用 Vue DevTools
- 開啟 Nuxt DevTools
- 檢查瀏覽器控制台

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
- **前端開發**: Vue3 + Nuxt3 專家
- **UI/UX 設計**: 用戶體驗設計師
- **後端開發**: Node.js + Python 工程師

## 📞 聯絡我們

- **技術支持**: tech-support@sgame.com
- **商務合作**: business@sgame.com
- **問題反饋**: [GitHub Issues](https://github.com/your-org/sgame/issues)

---

**🎯 讓我們一起打造最專業的運動預測平台！**