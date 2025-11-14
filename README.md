# sgame 部署與代理說明

## 目前狀態
- 系統安裝有 Nginx，主要組態 `nginx.conf` 會載入 `sites-enabled` 內的站台設定。
- `sites-available/sgame-443.conf` 已定義從 `443` 轉發到本機 `5175` 的反向代理，但尚未在 `sites-enabled` 建立連結，因此目前設定未生效。

## 啟用 443 → 5175 反向代理流程
1. 確認 Cloudflare 提供的憑證已放在 `ssl_certificate` 與 `ssl_certificate_key` 指定的位置，或依實際路徑調整 `sgame-443.conf`。
2. 建立啟用連結：
   ```bash
   sudo ln -s /etc/nginx/sites-available/sgame-443.conf /etc/nginx/sites-enabled/sgame-443.conf
   ```
3. 視需要更新 `server_name`（目前為 `34.80.46.175`）。
4. 驗證設定：`sudo nginx -t`
5. 套用設定：`sudo systemctl reload nginx`

## Cloudflare Origin 憑證匯入與系統設定
- 將 Cloudflare 提供的 **站點憑證** 複製到 `copy/vue/ssl/cert.pem`、`key.pem`，並確認權限為 `600`。
- 下載 Cloudflare Origin Root CA（RSA）後放入 `/usr/local/share/ca-certificates/cloudflare-origin-ca.crt`，執行：
  ```bash
  sudo update-ca-certificates
  ```
- 將 `api.sportspro.tw` 指向後端私有 IP：
  ```bash
  echo '10.2.0.2 api.sportspro.tw' | sudo tee -a /etc/hosts
  ```
- Nginx 連線後端及 Vite 皆需驗證憑證，`sgame-443.conf` 已設定 `proxy_ssl_*` 與 SNI (`proxy_ssl_name`)；更新後記得 `sudo nginx -t && sudo systemctl reload nginx`。
- PM2 啟動 Vite 的 `ecosystem.config.cjs` 已加入：
  - `NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/cloudflare-origin-ca.crt`
  - `VITE_PROXY_TARGET=https://api.sportspro.tw:8080`
  - `VITE_PROXY_SECURE=true`
  重新啟動：`cd copy/vue && pm2 restart ecosystem.config.cjs --only app:dev,app:preview --update-env`
- 若未使用 PM2，需手動匯出 `NODE_EXTRA_CA_CERTS` 後再執行 `npm run dev` / `npm run preview`。

## 驗證與除錯
- `curl https://api.sportspro.tw:8080/health`（依照 `/etc/hosts` 解析）應回傳 `status: healthy`。
- `curl -vk https://127.0.0.1:5175/` 驗證 Vite Dev 站台（HTTPS）；正式測試可使用 `--resolve app.sportspro.tw:5175:127.0.0.1`。
- `curl -vk https://app.sportspro.tw --resolve app.sportspro.tw:443:127.0.0.1` 應回傳前端 HTML；`/api/health` 則回 401 代表代理正常。
- 若代理有問題，可查閱 `sudo journalctl -u nginx -n 200`、`/var/log/nginx/error.log`、`pm2 logs app:dev`。

## 🚀 API 性能測試（新增於 2025-11-05）

### 快速性能測試
```bash
# 運行自動化性能測試腳本
cd /home/gogofire1774/sgame
./test-api-performance.sh
```

### 測試內容
- ✅ 網路連通性測試（Ping）
- ✅ 健康檢查端點響應時間
- ✅ 等級資料端點響應時間
- ✅ 詳細時間分析（連接、SSL、TTFB）
- ✅ 並發性能測試

### 最新測試結果（2025-11-05）
- **健康檢查平均響應**: ~10ms ⭐⭐⭐⭐⭐ 優秀
- **等級資料平均響應**: ~11ms ⭐⭐⭐⭐⭐ 優秀
- **網路延遲**: 0.32ms（內網極佳）
- **TTFB（後端處理）**: ~10ms（極快）
- **總體評級**: 卓越級別（9.5/10）

### 相關文檔
- 📊 [API性能測試報告.md](./API性能測試報告.md) - 完整測試結果與分析
- 📘 [copy/vue/API性能檢查與優化指南.md](./copy/vue/API性能檢查與優化指南.md) - 詳細檢查方法與優化建議
- 🔧 [test-api-performance.sh](./test-api-performance.sh) - 自動化測試腳本

### 性能標準參考
| API 類型 | 預期時間 | 當前表現 | 狀態 |
|---------|---------|---------|------|
| 健康檢查 | < 200ms | ~10ms | ✅ 超越 20x |
| 資料查詢 | < 300ms | ~11ms | ✅ 超越 27x |
| 複雜查詢 | < 1000ms | 待測試 | - |

## Cloudflare 與 SSL 建議
- 若 Cloudflare 已啟用「Full」或「Full (Strict)」模式，建議維持本機 Nginx 也使用 TLS（即目前 `sgame-443.conf` 的做法），可確保 Cloudflare 與來源站之間的連線加密。
- 若僅在 Cloudflare 端加密（Flexible 模式），來源站可改用 HTTP，但連線會有被攔截風險，不建議在正式環境採用。
- 使用 Cloudflare 產出的起源憑證時，請確保憑證與私鑰檔案權限為 600，並只允許 `root` 存取。
# 🏀 運彩王預測平台 - Vue3 前端應用

## 📖 項目簡介

運彩王預測平台是一個專業的運動預測分享與販售平台，提供籃球、足球、棒球等各類運動的預測分析服務。本項目使用 **Vue3 + Vite + TypeScript** 技術棧構建現代化的前端應用。

### 🌟 主要功能

- **🏆 運動預測**: 提供多種運動項目的專業預測分析
- **💬 社群討論**: 活躍的用戶社群討論區
- **📊 數據分析**: 基於大數據的賽事分析和統計
- **👥 專家系統**: 認證專家預測師等級制度
- **💰 預測交易**: 預測內容的購買和販售功能
- **📱 響應式設計**: 支持桌面端和移動端訪問
- **🔧 管理後台**: 管理員專用的賽事管理和預測結果判定系統

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

### 靜態資源與網站圖示

- 預設網站小圖示 `copy/vue/public/favicon.ico` 已內建於專案，Vite 伺服器會直接提供 `/favicon.ico`，避免瀏覽器載入 404。
- 若需自訂品牌圖示，可以 16×16 或 32×32 的 ICO 檔覆蓋同一路徑；建議同步更新其他靜態資源手冊以便團隊維護。

#### 法律與客服服務頁面（2025-11-13 新增）

- `copy/vue/src/pages/TermsPage.vue`：提供全新排版的「服務條款」頁面，路徑 `/terms`，整合既有 `TermsOfService` 內容並加入平台使用說明。
- `copy/vue/src/pages/ContactPage.vue`：集中客服電話、服務時間、Email 及聯繫指引於 `/contact`，並提供暫行留言流程，後續可擴充正式表單。
- `AppFooter` 僅保留「服務條款」「聯絡我們」連結；「關於我們」「常見問題」暫時隱藏，避免導向未完成頁面。
- 所有政策文件中的聯絡連結已統一指向 `/contact`，確保用戶能快速找到客服資訊。

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

## 📊 項目最新進展

### ✅ 預測系統前端整合（2025年10月22日完成）

完成了預測系統的前端整合，包括：

#### 建立的檔案
- **類型定義**：`copy/vue/src/types/` 目錄下的 `game.ts`、`prediction.ts`、`coin.ts`、`alliance.ts`
- **API 服務層**：`copy/vue/src/api/` 目錄下的 `games.ts`、`predictions.ts`、`coins.ts`
- **可重用組件**：
  - `CoinBalance.vue` - 榮譽點餘額顯示
  - `CoinPurchaseDialog.vue` - 榮譽點購買對話框
  - `PurchaseDialog.vue` - 預測購買確認
  - `PredictionCard.vue` - 預測卡片顯示

#### 整合的頁面
- ✅ `PredictPage.vue` - 完成預測提交功能
- ✅ `MemberPage.vue` - 完成預測顯示與購買功能
- ✅ `MemberSettingsPage.vue` - 新增預測設定區塊

#### 詳細文檔
- 📋 [預測系統API規劃書](./api/前端整合文檔1022/預測系統API規劃書.md) - 供後端開發參考
- 📝 [前端整合完成報告](./預測系統前端整合完成報告.md) - 完整的實作說明
- 📊 [實作進度報告](./預測系統實作進度報告.md) - 詳細的進度追蹤

#### 當前狀態與下一步
1. ✅ **後端確認完成** - 後端已完成所有功能並通過測試（25/26，96.2%）
   - 📋 [最終測試報告](./api/前端整合文檔1022/最終測試報告.md) - 完整的測試結果
   - 📝 [預測系統開發完成](./api/前端整合文檔1022/預測系統開發完成-可提交前端.md) - 後端交付文檔
2. ✅ **前端調整完成** - 已調整 API 端點和類型定義
   - 調整查詢參數：`memberId` → `userId`
   - 加入欄位：`purchaseCount` 購買人數
   - 完善類型：`selection` 和 `note` 可為 `null`
3. 🔄 **準備開始聯調測試** - 預計 3-5 天
   - 📋 [整合測試計劃](./前後端整合測試計劃.md) - 詳細的測試步驟
   - 階段一：基礎功能（認證、榮譽點、設定）
   - 階段二：賽事與預測建立
   - 階段三：預測查看與購買
   - 階段四：完整流程測試
   - 階段五：邊界條件測試
4. ⏳ 修正整合中發現的問題
5. ⏳ 部署上線

### ✅ 管理員後台系統（2025年10月23日完成）

完成了管理員後台系統的實作和後端整合，包括：

#### 核心功能
1. **賽事結果更新** - 賽事列表查詢、更新比分、自動判定預測
2. **預測結果管理** - 預測列表查詢、批量重新計算
3. **系統統計** - 用戶、賽事、預測、榮譽點統計
4. **賽事管理** - 建立、編輯、刪除賽事（部分待實作）
5. **論壇維運** - 看板階層管理、文章查詢、置頂/鎖定/刪除、統計監控

#### 技術實作
- **檔案**: `src/pages/AdminPage.vue`, `src/api/admin.ts`
- **論壇後台組件**: `src/components/admin/ForumBoardManager.vue`（看板 CRUD 與排序）
- **Store**: 新增 role 欄位和 isAdmin getter
- **路由**: 新增管理員路由守衛（靜默重定向）
- **後端整合**: Session API 和 Login API 都返回 `user.role`

#### 安全特性
- 隱蔽設計：不在前台顯示任何入口
- 權限檢查：非管理員訪問時靜默重定向
- 安全的角色管理：不使用 localStorage，完全從後端獲取
- 操作確認：所有重要操作都有確認對話框

#### 測試文檔
- `copy/vue/管理員後台測試指南.md` - 測試步驟
- `copy/vue/管理員後台實作摘要.md` - 技術文檔
- `copy/vue/管理員後台整合完成報告.md` - 整合報告

#### 最新增補
- 2025-10-30：完成論壇看板管理介面，支援建立/編輯/停用/啟用與同層排序，成功操作後會同步更新文章篩選清單。
- 2025-10-31：新增 `VITE_ENABLE_ADMIN_BOARD_LIST`／`VITE_ENABLE_ADMIN_GAME_LIST` 環境旗標，預設關閉以避免後端尚未釋出的列表 API 造成 404；若後端完成，可將旗標設為 `true` 以啟用完整管理員端資料來源。

---

### 🧩 最新修復紀錄（2025年11月03日）

- 更新登入與註冊頁面：移除 Google OAuth 「開發環境不可用」警示並啟用按鈕狀態，確保整合完成後的流程一致。
- 建議後續測試：請在實際可存取 Google OAuth 的環境中進行一次手動登入驗證，確認 redirect 與 Email 驗證流程皆無異常。

### 🧩 最新修復紀錄（2025年11月05日）

- 新增預設 `favicon.ico`（位於 `copy/vue/public/`），避免 Vite 開發環境與正式環境在載入頁面時出現 `/favicon.ico` 404 訊息。
- 建議：若品牌識別有更新，請同步提供新的 32×32 ICO 檔並更新 `README.md` 對應說明，以確保開發與部署環境一致。

### 🧩 最新修復紀錄（2025年11月11日）

- 全站品牌統一為「運彩王」，同步更新頁面標題、說明文件與 UI 文案。
- 「榮譽點」正式取代原彩幣稱呼，調整購買、餘額與提示訊息字詞。
- 專家稱號更新：莊家殺手→殺莊高手、單場殺手→單月高手、明燈達人→天命師，維持原查詢參數設定。
- 建議與後端及資料庫協同確認術語同步，避免品牌識別不一致。

### 🧩 最新修復紀錄（2025年11月12日）

- 新增預測重複提交防呆：`PredictPage.vue` 於載入賽事時同步取得使用者當日已建立的預測快照，`PredictGamesTable.vue` 依照賽事＋玩法停用對應選項並顯示「已提交」標記，避免再次呼叫後端 API 造成 409。
- 預測提交成功後立即刷新前端快照，確保 UI 與後端狀態一致，並保留後端 409 作為第二層保護。
- 修正會員頁載入狀態：`MemberPage.vue` 新增載入與錯誤視圖並重構 `loadMemberData` 錯誤處理，避免初始閃現預設帳號，無會員時顯示「查無此用戶」。反思：需持續與後端確認 404 與錯誤訊息格式，避免非預期回應造成前端判斷失準。
- 調整遊戲紀錄分頁：`MemberPage.vue` 將原本的日期按鈕與 placeholder 下注區移除，改為載入最近十筆榮譽點交易並顯示金額、餘額與時間，若 API 回應錯誤或無紀錄時提供對應提示。後續需確認後端交易原因與格式是否足夠辨識不同來源，必要時再補充圖示或分類。
- 完善榮譽點紀錄權限：`MemberPage.vue` 新增 `isSelf` 計算屬性判斷是否為本人頁面，側邊欄「榮譽點紀錄」分頁與內容區僅在本人時顯示，帳戶編號改從 API 動態取得，並移除未實作的「榮譽點帳戶」與「轉贈榮譽點」按鈕，避免誤導使用者。
- 重新整理討論分頁：`MemberPage.vue` 移除發文/回文/感謝文等靜態統計，改為單一「討論區」總覽與預設統計區塊，等待後端確認正式 API 後再進行整合。
- 串接論壇統計 API：`memberAPI.getForumStats` 取得 `hotPosts`、`totalPosts`、`commentsReceived`、`commentsWritten`、`totalLikes`，討論區區塊顯示即時統計並具備載入/錯誤狀態提示。
- 榮譽點資訊權限化：透過 `permissions.canViewCoinInfo` 判斷是否顯示榮譽點餘額與帳戶資訊，預設僅本人可見，避免在拜訪他人頁面時洩漏資料。
- 新增「明燈表」分頁：會員頁左側新增僅本人可見的明燈表籤，串接 `GET /me/followings` 顯示追蹤清單並提供載入更多功能，空狀態/錯誤提示亦已涵蓋。
- 串接戰績統計 API：`memberAPI.getPredictionStats` 顯示會員預測總場次、勝敗、命中率、連勝狀態等資料，並在戰績分頁提供載入/錯誤提示；今日人氣暫時隱藏，待後端提供動態資料再啟用。

### 🧩 最新修復紀錄（2025年11月14日）

- 會員頁 `AllianceMenu` 新增「過去 7 天 / 過去 30 天」日期範圍，並讓 `/api/predictions` 查詢參數支援過去區間，方便檢視歷史預測。
- 戰績分頁串接 `/api/members/{id}/predictions`，呈現逐筆歷史戰績、分頁與結果篩選，並依 `isOwn / isPurchased` 控制 selection/note 欄位顯示。
- 補齊 `MemberPrediction` 型別（含 `settledAt`、排序參數），並建立 `memberAPI.getMemberPredictions` 供其他頁面重用。
- `PredictGamesTable.vue` 新增「指定主推」選項與備註欄，提交時會自動呼叫 `/predictions/{id}/feature` 並提示主推狀態。
- `MemberPage.vue` 增設「主推管理」卡片，串接 `/predictions/feature-candidates`、`/predictions/{id}/feature`、`/predictions/{id}/unfeature`，可檢視現行主推、候選清單並即時更換。
- `BuyPredictPage.vue` 主推榜改為使用 `predictionsAPI.getPredictions`（`isFeatured=true`）真實資料，卡片顯示賽事、玩法、售價、更新時間，並可直接導向會員頁或 `/predict/buy`。

### 🔍 外部連結盤點（2025年11月12日）

- 前台仍載入外部資源：Google Material Icons（`copy/vue/src/App.vue`）、Facebook SDK（`copy/vue/src/pages/LoginPage.vue`）、Google reCAPTCHA 政策連結（`copy/vue/src/components/AppFooter.vue`）、財政部法規頁（`copy/vue/src/components/legal/TermsOfService.vue`）。
- 棒球賽事卡片 (`copy/vue/src/components/games/BaseballGameCard.vue`) 原連向 `playsport.cc` 的外部連結已移除，現以純文字顯示隊名與「預測比例」；待內站對應頁完成後可改為本站路由。
- Vue Router 已移除測試用路由（`/test-nav`、`/forum-test`），未定義路徑一律導向 404 頁（`NotFound.vue`）；對應的測試靜態頁 `copy/vue/public/test-login.html` 亦已下線。

### 🛡️ Edge 安全與相容性警告分析（2025年11月07日）

- 重點提醒：`x-content-type-options` 未設置、缺少 `Cache-Control`、僅使用 `X-Frame-Options`、`Content-Type` 字元集非 `utf-8`、表單欄位缺 `name/id`，均被列為高嚴重度，需後端與前端共同調整。
- 修復建議：依警告等級排定工作，先處理 HTTP 標頭設定與表單語意，再調整列表結構、動畫屬性與 CSS 前綴；詳細步驟、風險與待辦請參見 `/.doc/edge報告.md`。
- 後續流程：完成調整後需重新以 Edge/Chrome/Safari 驗證，並將標頭與快取策略納入部署自動化檢查。

### 🧭 頁面標題動態更新（2025年11月04日）

- `copy/vue/src/router/index.ts` 新增 `ROUTE_TITLES` 對應表與 `router.afterEach`，導覽後會自動更新 `document.title`，確保各頁面顯示對應中文名稱。
- 預設站名常數 `DEFAULT_TITLE` 設為「運彩王預測平台」，若找不到對應路由標題或在 SSR/快速切換時仍保持一致品牌識別。
- 保留 `meta.title` 擴充彈性：未來在路由上設定 `meta.title` 會優先於對應表覆寫頁面標題。
- `copy/vue/index.html` 的 `<title>` 同步改為「運彩王預測平台」，避免初次載入時顯示舊的「Legacy to Vue」。

### 📺 即時比分 API 串接（2025年11月05日）

- `copy/vue/src/pages/LivescorePage.vue` 改寫為串接後端 `/api/livescore` 端點，UI 篩選同步支援聯盟、狀態與足球子聯賽。
- 新增 `copy/vue/src/api/livescore.ts` 以及對應 `LivescoreQueryParams`、`LivescoreItem` 擴充，統一透過 axios 客戶端呼叫。
- 更新各運動卡片型別與 `src/data/types.ts`，允許字串型 ID 與空值，避免真實資料格式造成渲染錯誤。
- 現階段僅渲染後端提供的分數與階段資訊；若需顯示更完整投打或盤口細節，可再擴充 `live_stats` 與 scoreboard 映射。

### 🔁 即時比分預測比例內站化（2025年11月12日）

- `copy/vue/src/components/games/PredictionStatsBadge.vue` 新增 Element Plus 對話框，點擊「預測比例」即可查看 `/api/games/{id}/prediction-stats` 回傳的各盤口統計。
- `copy/vue/src/api/games.ts` 擴充 `getGamePredictionStats` 方法並補齊 `PredictionStats` 型別定義，使前端能一致性處理返回資料。
- `copy/vue/src/pages/LivescorePage.vue` 於每張賽事卡片右上角嵌入預測比例按鈕，與原卡片點擊事件互不干擾，手機版亦維持可用性。
- 元件端加入 30 秒的再請求間隔與手動「重新整理」按鈕，兼顧 Redis 快取與前端體驗，無資料時會呈現空狀態提示。

### 🔍 預測頁預測統計檢視（2025年11月12日）

- `copy/vue/src/components/PredictGamesTable.vue` 在賽事資訊欄旁加入 `PredictionStatsBadge`，教練可直接於預測表格檢視各盤口統計。
- 按鈕沿用原有「預測比例」樣式，不影響桌機與行動版排版，並共用同一統計對話框。
- 測試建議：登入後於 `/predict` 選任一賽事，點擊「預測比例」確認 `/api/games/{gameId}/prediction-stats` 正常回應，無預測時應顯示空狀態。

### 🧩 最新修復紀錄（2025年10月24日）

- 修正論壇編輯器 `TipTapEditor` 預設內容缺失造成的初始化錯誤，新增 `defaultContent` 並使用 TipTap 官方 `JSONContent` 型別保護，確保評論與文章編輯表單穩定載入。
- 確認 `PostPage` 中的評論與文章編輯表單能正常掛載並回寫內容，避免因空值導致的 Vue 組件更新錯誤。
- 更新論壇 API 串接，評論與文章內容全面採用 TipTap JSON (`TipTapDoc`)，新增型別定義與錯誤碼判斷（`MISSING_CONTENT`、`INVALID_CONTENT_FORMAT`、`POST_LOCKED` 等）。
- `ReplyList`、`TipTapViewer` 等顯示層改為使用 TipTap JSON 來源渲染，確保與後端資料一致。
- 符合新版附件 API 規範，`uploadAttachment` 僅送出 `file` 欄位並使用 `multipart/form-data`，同時強化錯誤訊息顯示。
- TipTap 編輯器支援圖片即時預覽：選擇檔案後立即顯示本機預覽，上傳成功後換成正式網址，失敗則自動移除，提升使用體驗。
- `PostContent` 現在會顯示作者名稱、身份與發佈時間，與後端回傳資料一致，方便辨識文章出處。
- `ReplyList` 將按讚按鈕改為所有使用者皆可操作，僅將編輯/刪除限制在本人或管理員，符合留言互動邏輯。
- 論壇「發文」按鈕會先檢查登入狀態，未登入者導向登入頁並帶入 redirect，登入者則帶到建立文章頁。
- TipTap 編輯器移除 Link 插件，目前僅保留基本排版與圖片能力。
- 論壇列表優先顯示置頂文章，且鎖定文章會標示提醒並隱藏「發表回覆」按鈕。

### 📱 行動端 RWD 優化（2025年11月1日）

- 建立全域 `layout-container` 版型（`App.vue`），讓所有頁面在桌機維持 1200px 內容寬度、行動裝置自動縮放並保留左右緩衝。
- 重構 `AppHeader.vue`：新增手機漢堡選單、移動專用導覽與帳號操作區，並在桌機 (>1024px) 保留原本寬幅漸層視覺與下拉互動。
- 論壇首頁 (`HomePage.vue`) 及舊制樣式 (`forum-original.css`) 新增水平捲軸容器，避免 1000px 固定寬度造成溢位，同時降低小螢幕字級與間距。
- `PredictGamesTable.vue` 以 `predict-table-scroll` 包覆表格，提供滾動檢視與陰影強調，同時調整斷點 `min-width`，確保賽事資訊在 360px 手機仍可水平方向瀏覽。
- 調整註冊頁 (`RegisterPage.vue`) 對話框寬度為 `min(420px, 100%)`，並在窄螢幕下改為縱向操作列，避免表單被左右擠壓。
- 驗證流程：使用 Chrome DevTools Responsive Mode 分別檢視 360px、768px、1280px；檢查頂部導覽、論壇列表、預測表格與註冊表單的滾動/操作，確認登入與未登入狀態皆無破版，桌機版視覺保持原設計。

---

## 📋 後續工作提醒

### 預測模組後續建議

- 若需支援多裝置同步或長時間停留頁面，建議加入手動刷新按鈕或週期性更新既有預測快照，避免用戶在其他裝置建立預測後前端顯示短暫不同步。

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

### 論壇看板管理後續思考
- 介面目前提供上下移動排序，後續可評估引入拖曳排序與批次調整，減少多次 API 呼叫。
- 新增權限設定預覽與校驗（例如阻止子層繼承限制時的提醒），避免錯誤設定造成文章不可發。
- 建議串接操作記錄或審計日誌，讓管理員能追蹤看板調整歷史並快速回溯。

### 玩家搜尋功能現況（2025年11月04日）
- `copy/vue/src/pages/MemberSearchPage.vue` 已串接 `memberAPI.search` 與 `memberAPI.getRecommendations`，即時顯示分頁搜尋結果與後端推薦名單，並以 `PageMeta` 參數驅動上一頁/下一頁控制。
- 追蹤按鈕現改為調用 `memberAPI.follow` / `memberAPI.unfollow`，自動更新追蹤狀態與粉絲數；未登入時會導向登入頁並保留 redirect 參數。
- 最近搜尋改為記錄最新 API 結果的玩家資訊；後續若需持久化可評估存放於 LocalStorage 或後端紀錄。

### API 化預測/賽事頁面（2025年11月04日）
- `PredictPurchasePage.vue` 改用 `predictionsAPI.getPredictions` 取得可購買清單，提供聯盟/賽事篩選、榮譽點餘額同步與 `PurchaseDialog` 整合，並支援 `?gameId=` 直接定位賽事。
- `GamesListPage.vue` 使用 `gamesAPI.getGames` 回傳的資料，建立聯盟、狀態與日期篩選，搭配分頁控制呈現最新賽事列表。
- `GameDetailPage.vue` 透過 `gamesAPI.getGame` 顯示比分與賠率細節，新增返回列表與「前往購買預測」操作。
- 移除 `simpleLegacyParser.ts`、舊版 `fetch('/legacy/...')` 依賴，上述頁面不再需要 `dist/legacy` 鏡像內容。
- 新增 `src/pages/__tests__/PredictPurchasePage.spec.ts`、`GamesListPage.spec.ts`、`GameDetailPage.spec.ts`，以 Vitest 模擬 API 成功/失敗情境，覆蓋核心流程。

### Legacy 靜態資源剩餘情況（2025年11月04日）
- 僅 `LegacyHeader.vue` 與 `LegacyFooter.vue` 在需要導入舊站導航或版權資訊時會存取 `/legacy/www.playsport.cc/forum/0623c.html`。
- 若後續計畫完全移除 Legacy 鏡像，請同步提供對應的導覽/頁尾替代方案，或調整上述元件避免發出 Legacy 請求。

### 🧠 本次更新反思
- 即時比分頁的預測比例介面為避免頻繁請求，目前僅在使用者開啟對話框時載入，後續可依實際流量評估是否於滑入視窗時預先快取熱門賽事。
- `PredictionStats` 採用字串鍵做對應，若後端新增盤口類型或不同選項，需同步更新 label 對照，或考慮由後端直接返回顯示名稱以降低維護成本。

---

**🎯 讓我們一起打造最專業的運動預測平台！**