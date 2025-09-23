### Nginx 反向代理設定與操作（推薦）

目的：
- 將 `/api/*` 與 `/static/*` 反向代理到後端 `127.0.0.1:8080`
- 其餘路徑交給前端（Vite preview/dev）`127.0.0.1:5175`
- 解決 preview 模式沒有代理導致的圖片顯示問題（避免 `text/html` 回傳）

#### 1) 建立站台設定檔

將以下內容寫入 `/etc/nginx/sites-available/sgame.conf`：

```nginx
server {
  listen 80;
  server_name 104.199.172.204.nip.io;

  # 後端 API
  location /api/ {
    proxy_pass http://127.0.0.1:8080$request_uri;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # 後端靜態（大頭貼等）
  location /static/ {
    proxy_pass http://127.0.0.1:8080$request_uri;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # 其餘交給前端（Vite preview/dev / SPA）
  location / {
    proxy_pass http://127.0.0.1:5175;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

> 若你對外是 8080，而非 80，將 `listen 80;` 改成 `listen 8080;`。

#### 2) 啟用並套用設定

```bash
sudo ln -sf /etc/nginx/sites-available/sgame.conf /etc/nginx/sites-enabled/sgame.conf
sudo nginx -t
sudo systemctl reload nginx
```

#### 3) 後端與前端服務假設
- 後端服務聆聽：`127.0.0.1:8080`
- 前端（Vite）聆聽：`127.0.0.1:5175`
  - PM2（preview 範例）：`pm2 start "npm run preview -- --host 0.0.0.0 --port 5175" --name app:preview --cwd "/home/gogofire1774/sgame/copy/vue"`
  - PM2（dev 範例）：`pm2 start "npm run dev -- --host" --name sgame-vue-dev --cwd "/home/gogofire1774/sgame/copy/vue"`

#### 4) 驗證步驟
- 瀏覽器開啟測試頁，操作「大頭貼讀取檢測」→ 按「更新預覽」
- 開發者工具 Network：
  - 請求 `/static/avatars/{id}.webp?v=...` 應為 200，`Content-Type: image/webp`
  - 不應是 `text/html`
- 直接開完整 URL 驗證：
  - `http://104.199.172.204.nip.io/static/avatars/test123.webp`

#### 5) 常見問題
- 預覽仍拿到 `text/html`：
  - 確認 Nginx 的 `/static/`、`/api/` 區塊是否在 `/` 前面（順序很重要）
  - 確認後端 8080 能正確回傳 `Content-Type: image/webp`
  - 重新載入 Nginx 後清理瀏覽器快取（Ctrl+F5）

---

### 方案 B（次選）：後端僅對 `/static` 放寬 CORP
若不便調整 Nginx，可在後端加入以下中介層（放在靜態路由之前）：

```js
app.use('/static', (req, res, next) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use('/static', express.static('/app/uploads', {
  maxAge: '1h',
  immutable: false,
  etag: true,
  lastModified: true,
  dotfiles: 'ignore',
  index: false
}));
```

- 優點：前端可直接用完整 URL 顯示圖片
- 注意：降低跨來源保護，僅建議針對公開圖片資源使用



