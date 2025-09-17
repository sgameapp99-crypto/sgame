# TODO - Legacy 到 Vue 重構待辦清單

- [ ] 詳文頁功能補齊（/post）
	- [x] 解析並渲染回覆列表（樓層、作者、時間、內容）
	- [x] 解析分頁（上一頁/下一頁/指定頁）
	- [ ] 解析與顯示推文/讚數、標籤（公告、置頂）
	- [x] 內文圖片/連結全面路徑改寫與懶載入（已完成改寫，懶載入待做）

- [ ] 論壇列表強化（/forum）
	- [x] 以資料欄位而非字串比對做「看板」本地過濾（新增 boardTag）
	- [x] 解析並呈現回覆數、瀏覽數等欄位（如頁面有）
	- [x] 分頁邏輯補齊（首頁/末頁、更多頁碼、邊界處理）
	- [x] 排序持久化（URL query 或本地儲存）（使用 URL query）

- [ ] Header/Footer 完整抽離
	- [x] `LegacyHeader` 解析次選單/下拉與動態狀態（已解析並渲染子選單）
	- [x] `LegacyFooter` 解析所有版權/連結區塊（已擷取連結與版權並保留原 HTML 作回退）
	- [x] 移除 jQuery 依賴，改用純 Vue 事件與狀態

- [ ] 樣式與設計系統
	- [x] 導入 Tailwind（建立 config、postcss、main.css 並引用）
	- [x] 將行內樣式遷移為 class，建立可重用的元件樣式（Header/Footer/Forum/Post 已完成）
	- [x] 建立色彩/字體/間距設計 Token（Tailwind 擴充 theme.extend）

- [ ] 路由與導覽
	- [x] 將文章詳文路由改為語意化（如 `/post/:id`）並相容現有 query
	- [x] 建立 404 與回退策略（無本地檔時導向 legacy 或顯示提示）

- [x] 首頁重構（/）
	- [x] 以 Vue 呈現：分類清單、最新文章清單、快速連結
	- [x] 從 legacy 解析資料（parseForum），移除 iframe
	- [x] 後續優化：最新文章排序（依回覆/發文時間）、快取與錯誤處理

- [ ] 登入與跨域
	- [ ] 評估以本地代理（dev server proxy）繞過 CORS 寫表單
	- [ ] 統一錯誤提示、驗證與導向（成功/失敗 redirect）

- [ ] 其他頁面重構
	- [ ] `member/*`, `predict/*`, `buyPredict/*`, `gamesData/*` 依優先度搬遷
	- [ ] 把重複區塊抽成 Vue 組件（卡片、清單、面包屑）

- [ ] 工具與解析穩定性
	- [ ] `legacyParser` 強化：防呆、選擇器降級策略、單元測試
	- [ ] `rewriteLegacy` 強化：涵蓋 script/link/video 等更多邊界

- [ ] 開發品質
	- [x] 加入 ESLint/Prettier 統一規範與 Git hooks（pre-commit: lint-staged、pre-push: test）
	- [x] 加入 Vitest 單元測試（已建 rewriteLegacy 範例測試）
	- [ ] E2E（Playwright）針對核心流程（/forum → /post → /login）

- [ ] 產出與部署
	- [ ] 調整 Vite 生產設定與資源基底路徑
	- [ ] 建立 Dockerfile 与 CI（build/test/lint）
