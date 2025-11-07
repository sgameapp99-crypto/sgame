# 🚀 後端 API 性能檢查與優化指南

## 📊 API 響應時間標準

### 正常速度參考標準

| API 類型 | 預期響應時間 | 可接受範圍 | 需優化 | 說明 |
|---------|-------------|-----------|--------|------|
| **健康檢查** | < 50ms | < 100ms | > 200ms | 簡單狀態查詢 |
| **認證登入** | 100-300ms | < 500ms | > 1s | 包含加密驗證 |
| **查詢列表** | 100-500ms | < 1s | > 2s | 分頁資料查詢 |
| **單筆資料** | 50-200ms | < 500ms | > 1s | 主鍵查詢 |
| **複雜查詢** | 300-800ms | < 1.5s | > 3s | 多表 JOIN |
| **圖片上傳** | 500ms-2s | < 5s | > 10s | 視檔案大小 |
| **資料寫入** | 100-300ms | < 800ms | > 2s | 單筆 INSERT/UPDATE |

### 📈 總體體驗標準

- **優秀**：95% 的 API 請求 < 500ms
- **良好**：90% 的 API 請求 < 1s
- **可接受**：80% 的 API 請求 < 2s
- **需優化**：超過 20% 的請求 > 2s

---

## 🔍 診斷方法

### 方法 1：使用 curl 測試（最推薦）

#### 基礎健康檢查
```bash
# 測試後端健康端點
time curl -w "\n時間分析:\n連接時間: %{time_connect}s\nSSL握手: %{time_appconnect}s\n首位元組: %{time_starttransfer}s\n總時間: %{time_total}s\n" \
  https://api.sportspro.tw:8080/health

# 預期結果
# - 連接時間: < 0.1s
# - SSL握手: < 0.2s
# - 總時間: < 0.3s
```

#### 測試認證 API
```bash
# 登入測試（替換成真實帳號密碼）
time curl -X POST https://api.sportspro.tw:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}' \
  -w "\n總響應時間: %{time_total}s\n" \
  -v

# 預期結果: < 0.5s
```

#### 測試列表查詢 API
```bash
# 需要先取得 token
TOKEN="your_token_here"

time curl -X GET https://api.sportspro.tw:8080/api/predictions?page=1&limit=20 \
  -H "Authorization: Bearer $TOKEN" \
  -w "\n總響應時間: %{time_total}s\n"

# 預期結果: < 1s
```

### 方法 2：瀏覽器開發者工具

1. **打開開發者工具**（F12）
2. **切換到 Network 面板**
3. **勾選 "Disable cache"**
4. **重新載入頁面**
5. **查看 API 請求時間**

重點關注：
- **Waiting (TTFB)**：後端處理時間（最重要）
- **Content Download**：網路傳輸時間
- **總時間**：完整請求週期

#### 如何判讀
```
範例：某個 API 請求
- Queueing: 2ms        ← 瀏覽器排隊（正常）
- Stalled: 15ms        ← 連接建立前的等待（正常）
- DNS Lookup: 0ms      ← 已緩存（正常）
- Initial connection: 45ms  ← SSL 握手（正常）
- SSL: 30ms            ← SSL 協商（正常）
- Request sent: 1ms    ← 請求發送（正常）
- Waiting (TTFB): 1500ms   ← ⚠️ 後端處理慢！
- Content Download: 50ms   ← 下載時間（正常）
```

**如果 Waiting (TTFB) > 1s，說明後端處理慢！**

### 方法 3：使用 PM2 日誌分析

```bash
# 查看前端代理日誌（可以看到代理時間）
cd /home/gogofire1774/sgame/copy/vue
pm2 logs app:dev --lines 100 | grep -E "(Proxying|Response)"

# 分析模式
# 正常: 🔄 Proxying 與 ✅ Response 之間間隔 < 1s
# 慢: 間隔 > 2s
```

### 方法 4：創建性能測試腳本

創建測試腳本 `test-api-performance.sh`：

```bash
#!/bin/bash

echo "=== API 性能測試 ==="
echo ""

# 設定後端地址
BACKEND="https://api.sportspro.tw:8080"

# 測試 1: 健康檢查
echo "測試 1: 健康檢查 (/health)"
for i in {1..5}; do
  curl -w "  第 $i 次: %{time_total}s\n" -o /dev/null -s $BACKEND/health
done
echo ""

# 測試 2: 等級資料
echo "測試 2: 等級資料 (/levels)"
for i in {1..5}; do
  curl -w "  第 $i 次: %{time_total}s\n" -o /dev/null -s $BACKEND/levels
done
echo ""

# 測試 3: 登入 API（需要替換真實帳密）
echo "測試 3: 登入 API (/api/auth/login)"
for i in {1..3}; do
  curl -X POST -w "  第 $i 次: %{time_total}s\n" -o /dev/null -s \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}' \
    $BACKEND/api/auth/login
done
echo ""

echo "=== 測試完成 ==="
echo "參考標準："
echo "  健康檢查: < 0.2s"
echo "  等級資料: < 0.5s"
echo "  登入 API: < 1.0s"
```

使用方法：
```bash
chmod +x test-api-performance.sh
./test-api-performance.sh
```

### 方法 5：網路延遲測試

```bash
# 測試到後端的網路延遲
ping -c 10 10.2.0.2

# 預期結果
# - 內網: < 1ms
# - 跨地區: < 50ms
# - 如果 > 100ms，可能網路有問題

# 測試 DNS 解析
nslookup api.sportspro.tw

# 檢查路由
traceroute 10.2.0.2
```

---

## 🛠 常見問題診斷

### 問題 1：所有 API 都慢（整體慢）

**可能原因**：
1. **網路問題** - 內網帶寬不足或路由問題
2. **後端伺服器資源不足** - CPU、記憶體、磁碟 I/O
3. **資料庫連接池耗盡** - 連接數不足

**檢查方法**：
```bash
# 1. 檢查網路延遲
ping -c 100 10.2.0.2 | tail -5

# 2. 檢查後端伺服器資源（需要 SSH 到後端）
# CPU 使用率
top -bn1 | head -20

# 記憶體使用
free -h

# 磁碟 I/O
iostat -x 1 5

# 3. 檢查後端日誌是否有錯誤
# （視後端技術棧而定，例如 Node.js、Python、Java）
```

### 問題 2：特定 API 慢（個別慢）

**可能原因**：
1. **資料庫查詢未優化** - 缺少索引或複雜 JOIN
2. **N+1 查詢問題** - 循環查詢資料庫
3. **外部 API 調用** - 依賴第三方服務
4. **大量資料處理** - 未分頁或過濾

**檢查方法**：
```bash
# 找出特定慢的 API
pm2 logs app:dev --lines 1000 | grep "Response" | sort -k6 -n

# 重複測試該 API
for i in {1..10}; do
  curl -w "時間: %{time_total}s\n" -o /dev/null -s \
    -H "Authorization: Bearer YOUR_TOKEN" \
    https://api.sportspro.tw:8080/api/slow-endpoint
done
```

### 問題 3：首次請求慢，後續快

**可能原因**：
1. **冷啟動** - 後端服務剛啟動，需要初始化
2. **資料庫連接池未預熱** - 首次建立連接慢
3. **JIT 編譯** - Java、.NET 等運行時優化

**解決方案**：
- 實施預熱機制
- 使用連接池預連接
- 配置 Keep-Alive

### 問題 4：間歇性慢

**可能原因**：
1. **垃圾回收（GC）暫停** - Java、.NET
2. **資料庫鎖競爭** - 寫入衝突
3. **網路抖動** - 不穩定的網路連接
4. **定時任務干擾** - 備份、統計等

**檢查方法**：
```bash
# 長時間監控
watch -n 1 'curl -w "%{time_total}" -o /dev/null -s https://api.sportspro.tw:8080/health'

# 記錄到文件分析
for i in {1..1000}; do
  TIME=$(curl -w "%{time_total}" -o /dev/null -s https://api.sportspro.tw:8080/health)
  echo "$(date +%H:%M:%S) - $TIME" >> api-performance.log
  sleep 1
done

# 分析結果
cat api-performance.log | awk '{print $3}' | sort -n | tail -20
```

---

## 🔧 優化方案

### 前端優化

#### 1. 增加 API 超時配置

修改 `src/api/client.ts`：

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
  timeout: 10000, // 10 秒超時
});

// 針對不同 API 設定不同超時
export const apiWithLongTimeout = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 30000, // 30 秒（用於上傳等長時間操作）
});
```

#### 2. 實施請求緩存

```typescript
// utils/apiCache.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 分鐘

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// 使用範例
async function fetchLevels() {
  const cacheKey = 'levels';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  const response = await api.get('/levels');
  setCachedData(cacheKey, response.data);
  return response.data;
}
```

#### 3. 實施請求去抖動（Debounce）

```typescript
// composables/useDebounce.ts
import { ref } from 'vue';

export function useDebounce(fn: Function, delay: number = 300) {
  let timeoutId: number;
  
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// 使用範例：搜尋輸入
const searchQuery = ref('');
const debouncedSearch = useDebounce(async (query: string) => {
  const results = await api.get(`/search?q=${query}`);
  // 處理結果
}, 500); // 使用者停止輸入 500ms 後才發送請求

watch(searchQuery, (newValue) => {
  debouncedSearch(newValue);
});
```

#### 4. 實施請求並發控制

```typescript
// utils/requestQueue.ts
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  private maxConcurrent = 5;
  
  async add<T>(fn: () => Promise<T>): Promise<T> {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => {
        this.queue.push(() => {
          resolve(null);
          return Promise.resolve();
        });
      });
    }
    
    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

export const requestQueue = new RequestQueue();

// 使用範例
const results = await Promise.all(
  items.map(item => 
    requestQueue.add(() => api.get(`/item/${item.id}`))
  )
);
```

#### 5. 顯示載入狀態

```vue
<template>
  <div>
    <div v-if="loading" class="loading">
      載入中... ({{ elapsedTime }}s)
    </div>
    <div v-else-if="error" class="error">
      請求超時或失敗，請重試
    </div>
    <div v-else>
      <!-- 內容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const loading = ref(true);
const error = ref(false);
const elapsedTime = ref(0);

let timer: number;

onMounted(async () => {
  // 顯示經過時間
  timer = setInterval(() => {
    elapsedTime.value = (elapsedTime.value + 0.1).toFixed(1);
  }, 100);
  
  try {
    const response = await api.get('/slow-endpoint');
    // 處理資料
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
    clearInterval(timer);
  }
});
</script>
```

### 後端優化（建議反饋給後端團隊）

#### 1. 資料庫查詢優化

```sql
-- 添加索引（範例）
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_game_id ON predictions(game_id);
CREATE INDEX idx_games_date ON games(game_date);

-- 檢查慢查詢
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1; -- 超過 1 秒的查詢記錄
```

#### 2. 使用連接池

```javascript
// Node.js 範例
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'sgame',
  connectionLimit: 10, // 最大連接數
  queueLimit: 0
});
```

#### 3. 實施資料快取

```javascript
// 使用 Redis 快取（Node.js 範例）
const redis = require('redis');
const client = redis.createClient();

async function getLevels() {
  // 先查快取
  const cached = await client.get('levels');
  if (cached) return JSON.parse(cached);
  
  // 快取未命中，查資料庫
  const levels = await db.query('SELECT * FROM levels');
  
  // 存入快取（5 分鐘過期）
  await client.setEx('levels', 300, JSON.stringify(levels));
  
  return levels;
}
```

#### 4. 使用分頁

```javascript
// 強制分頁，避免一次載入太多資料
router.get('/predictions', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // 最多 100 筆
  const offset = (page - 1) * limit;
  
  const predictions = await db.query(
    'SELECT * FROM predictions LIMIT ? OFFSET ?',
    [limit, offset]
  );
  
  res.json(predictions);
});
```

#### 5. 使用非同步處理

```javascript
// 耗時操作改為後台處理
router.post('/generate-report', async (req, res) => {
  const jobId = generateJobId();
  
  // 立即返回 jobId
  res.json({ jobId, status: 'processing' });
  
  // 後台處理
  processReport(jobId, req.body);
});

router.get('/report-status/:jobId', async (req, res) => {
  const status = await getJobStatus(req.params.jobId);
  res.json(status);
});
```

---

## 📈 監控與持續優化

### 設置監控告警

```bash
# 使用簡單的監控腳本
#!/bin/bash
# monitor-api.sh

THRESHOLD=2.0  # 2 秒閾值
BACKEND="https://api.sportspro.tw:8080"

while true; do
  RESPONSE_TIME=$(curl -w "%{time_total}" -o /dev/null -s $BACKEND/health)
  
  if (( $(echo "$RESPONSE_TIME > $THRESHOLD" | bc -l) )); then
    echo "[ALERT] $(date) - API 響應慢: ${RESPONSE_TIME}s"
    # 可以發送通知（例如 webhook、email）
  fi
  
  sleep 10
done
```

### 建立性能基準

```bash
# 使用 Apache Bench 進行壓力測試
ab -n 1000 -c 10 https://api.sportspro.tw:8080/health

# 參數說明
# -n 1000: 總請求數
# -c 10: 並發數

# 關注指標
# - Requests per second (RPS): 每秒處理請求數
# - Time per request: 平均響應時間
# - 95% / 99% percentile: 高百分位延遲
```

### 定期檢查清單

- [ ] 每週檢查 API 平均響應時間
- [ ] 每月檢查慢查詢日誌
- [ ] 每季度進行壓力測試
- [ ] 監控資料庫連接數
- [ ] 監控伺服器資源使用率
- [ ] 追蹤錯誤率和超時率

---

## 🎯 快速檢查清單

### 立即可做的檢查（5 分鐘）

```bash
# 1. 基礎延遲測試
ping -c 10 10.2.0.2

# 2. 健康檢查測試
time curl https://api.sportspro.tw:8080/health

# 3. 查看前端代理日誌
cd /home/gogofire1774/sgame/copy/vue
pm2 logs app:dev --lines 50 | grep -E "(Proxying|Response)"
```

### 深入檢查（30 分鐘）

```bash
# 1. 運行完整性能測試腳本
./test-api-performance.sh

# 2. 瀏覽器開發者工具檢查
# - 打開 Network 面板
# - 記錄 10 個常用 API 的 TTFB 時間
# - 找出最慢的 3 個 API

# 3. 檢查後端伺服器資源
# SSH 到後端伺服器
ssh backend-server
top
free -h
iostat -x 1 5
```

---

## 📞 需要後端團隊協助的情況

如果前端已經優化但仍然慢，請提供以下資訊給後端團隊：

1. **慢的 API 端點**：具體哪些 API 慢
2. **響應時間**：平均響應時間和 TTFB
3. **請求頻率**：每分鐘調用多少次
4. **資料量**：返回的資料大小
5. **測試方法**：如何重現問題
6. **環境資訊**：開發/測試/生產環境

範例問題報告：
```
問題：預測列表 API 響應慢
端點：GET /api/predictions?page=1&limit=20
平均響應時間：3.5 秒
TTFB：3.2 秒（後端處理佔大部分時間）
調用頻率：每次進入預測頁面
資料量：約 20 筆預測，返回 JSON 約 50KB
測試方法：curl -w "%{time_total}" https://api.sportspro.tw:8080/api/predictions
環境：開發環境（內網）
```

---

## 📚 相關資源

- [Web API Performance Best Practices](https://web.dev/api-performance/)
- [Database Query Optimization](https://use-the-index-luke.com/)
- [Redis Caching Strategies](https://redis.io/docs/manual/patterns/)

---

**最後更新**：2025-11-05  
**維護者**：前端開發團隊


