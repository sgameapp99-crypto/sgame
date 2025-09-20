<template>
  <div class="test-navigation">
    <div class="header">
      <h1>🧪 Vue 論壇項目測試導覽</h1>
      <p>點擊下方按鈕快速進入各個測試頁面</p>
      
      <!-- 顏色說明 -->
      <div class="color-legend">
        <h3>🎨 顏色說明</h3>
        <div class="legend-items">
          <div class="legend-item primary">
            <div class="legend-color"></div>
            <span>主要功能 - 核心測試頁面</span>
          </div>
          <div class="legend-item normal">
            <div class="legend-color"></div>
            <span>一般功能 - 標準測試頁面</span>
          </div>
          <div class="legend-item error">
            <div class="legend-color"></div>
            <span>錯誤測試 - 404頁面測試</span>
          </div>
        </div>
      </div>
    </div>

    <div class="navigation-grid">
      <!-- 主要功能測試 -->
      <div class="section">
        <h2>🎯 主要功能測試 <span class="color-badge primary">核心頁面</span></h2>
        <div class="button-group">
          <RouterLink to="/" class="nav-button primary">
            <div class="icon">🏠</div>
            <div class="content">
              <h3>首頁</h3>
              <p>原始論壇UI完整複製</p>
              <span class="url">/</span>
            </div>
          </RouterLink>

          <RouterLink to="/forum-test" class="nav-button primary">
            <div class="icon">🧪</div>
            <div class="content">
              <h3>論壇測試頁</h3>
              <p>專門的測試頁面</p>
              <span class="url">/forum-test</span>
            </div>
          </RouterLink>

          <RouterLink to="/forum" class="nav-button">
            <div class="icon">💬</div>
            <div class="content">
              <h3>論壇頁面</h3>
              <p>論壇主頁面</p>
              <span class="url">/forum</span>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- 用戶相關測試 -->
      <div class="section">
        <h2>👤 用戶相關測試 <span class="color-badge normal">標準頁面</span></h2>
        <div class="button-group">
          <RouterLink to="/login" class="nav-button">
            <div class="icon">🔐</div>
            <div class="content">
              <h3>登入頁面</h3>
              <p>用戶登入功能</p>
              <span class="url">/login</span>
            </div>
          </RouterLink>

          <RouterLink to="/register" class="nav-button">
            <div class="icon">📝</div>
            <div class="content">
              <h3>註冊頁面</h3>
              <p>用戶註冊功能</p>
              <span class="url">/register</span>
            </div>
          </RouterLink>

          <RouterLink to="/member" class="nav-button">
            <div class="icon">👨‍💼</div>
            <div class="content">
              <h3>會員頁面</h3>
              <p>會員資訊頁面</p>
              <span class="url">/member</span>
            </div>
          </RouterLink>

          <RouterLink :to="{ path: '/member', state: { memberId: 'test123' } }" class="nav-button">
            <div class="icon">🔎</div>
            <div class="content">
              <h3>查看他人會員頁</h3>
              <p>隱藏 ID（history.state）導覽</p>
              <span class="url">/member (with state)</span>
            </div>
          </RouterLink>

          <!-- 可輸入目標 ID 的隱藏式導覽 -->
          <div class="nav-button" style="display:flex; align-items:center; gap:12px;">
            <div class="icon">🆔</div>
            <div class="content" style="flex:1;">
              <h3>輸入目標 ID（隱藏 ID 導覽）</h3>
              <p>在網址不顯示 ID 的情況下，前往他人會員頁</p>
              <div style="display:flex; gap:8px; align-items:center;">
                <input v-model="member.memberId" placeholder="例如：test123" style="flex:1; border: 2px solid #e9ecef; border-radius: 8px; padding: 8px 10px; font-size: 0.95rem;" />
                <button class="action-btn" @click="navigateToMemberHidden" :disabled="!member.memberId">
                  <span class="icon">➡️</span>
                  前往
                </button>
              </div>
              <span class="url">/member (with state)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章相關測試 -->
      <div class="section">
        <h2>📄 文章相關測試 <span class="color-badge normal">動態路由</span></h2>
        <div class="button-group">
          <RouterLink to="/post/123" class="nav-button">
            <div class="icon">📰</div>
            <div class="content">
              <h3>文章詳情</h3>
              <p>動態路由測試 (ID: 123)</p>
              <span class="url">/post/123</span>
            </div>
          </RouterLink>

          <RouterLink to="/post/456" class="nav-button">
            <div class="icon">📰</div>
            <div class="content">
              <h3>文章詳情</h3>
              <p>動態路由測試 (ID: 456)</p>
              <span class="url">/post/456</span>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- 預測相關測試 -->
      <div class="section">
        <h2>🎲 預測相關測試 <span class="color-badge normal">功能頁面</span></h2>
        <div class="button-group">
          <RouterLink to="/predict" class="nav-button">
            <div class="icon">🔮</div>
            <div class="content">
              <h3>預測頁面</h3>
              <p>賽事預測主頁</p>
              <span class="url">/predict</span>
            </div>
          </RouterLink>

          <RouterLink to="/predict/buy" class="nav-button">
            <div class="icon">💳</div>
            <div class="content">
              <h3>預測購買</h3>
              <p>預測購買頁面</p>
              <span class="url">/predict/buy</span>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- 遊戲相關測試 -->
      <div class="section">
        <h2>🎮 遊戲相關測試 <span class="color-badge normal">功能頁面</span></h2>
        <div class="button-group">
          <RouterLink to="/games" class="nav-button">
            <div class="icon">🎯</div>
            <div class="content">
              <h3>遊戲頁面</h3>
              <p>遊戲主頁面</p>
              <span class="url">/games</span>
            </div>
          </RouterLink>

          <RouterLink to="/games/list" class="nav-button">
            <div class="icon">📋</div>
            <div class="content">
              <h3>遊戲列表</h3>
              <p>遊戲列表頁面</p>
              <span class="url">/games/list</span>
            </div>
          </RouterLink>

          <RouterLink to="/games/detail/789" class="nav-button">
            <div class="icon">🎲</div>
            <div class="content">
              <h3>遊戲詳情</h3>
              <p>動態路由測試 (ID: 789)</p>
              <span class="url">/games/detail/789</span>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- 錯誤處理測試 -->
      <div class="section">
        <h2>❌ 錯誤處理測試 <span class="color-badge error">錯誤測試</span></h2>
        <div class="button-group">
          <RouterLink to="/nonexistent" class="nav-button error">
            <div class="icon">🚫</div>
            <div class="content">
              <h3>404頁面</h3>
              <p>測試不存在的路由</p>
              <span class="url">/nonexistent</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 快速操作區域 -->
    <div class="quick-actions">
      <h2>⚡ 快速操作</h2>
      <div class="action-buttons">
        <button @click="openInNewTab('/')" class="action-btn">
          <span class="icon">🆕</span>
          新分頁開啟首頁
        </button>
        <button @click="openInNewTab('/forum-test')" class="action-btn">
          <span class="icon">🧪</span>
          新分頁開啟測試頁
        </button>
        <button @click="refreshPage" class="action-btn">
          <span class="icon">🔄</span>
          重新整理頁面
        </button>
        <button @click="goBack" class="action-btn">
          <span class="icon">⬅️</span>
          返回上一頁
        </button>
      </div>
    </div>

    <!-- 當前狀態顯示 -->
    <div class="status-info">
      <h3>📊 當前狀態</h3>
      <div class="status-grid">
        <div class="status-item">
          <span class="label">當前路由:</span>
          <span class="value">{{ $route.path }}</span>
        </div>
        <div class="status-item">
          <span class="label">路由名稱:</span>
          <span class="value">{{ $route.name }}</span>
        </div>
        <div class="status-item">
          <span class="label">查詢參數:</span>
          <span class="value">{{ JSON.stringify($route.query) }}</span>
        </div>
        <div class="status-item">
          <span class="label">路由參數:</span>
          <span class="value">{{ JSON.stringify($route.params) }}</span>
        </div>
      </div>
    </div>

    <!-- API 測試區域 -->
    <div class="api-test">
      <h2>🧰 API 測試（Health/Auth）</h2>
      <!-- 使用專案既有代理與 /api 前綴，無需額外 Base 設定 -->
      <div class="api-grid">
        <div class="api-card">
          <h3>GET /health</h3>
          <button class="action-btn" @click="callHealth" :disabled="loading.health">
            <span class="icon">🩺</span>
            呼叫 Health
          </button>
          <pre class="result" v-text="results.health"></pre>
        </div>

        <div class="api-card">
          <h3>POST /auth/register</h3>
          <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="user+demo@example.com" />
          </div>
          <div class="field">
            <label>Password</label>
            <input v-model="form.password" type="password" placeholder="password123" />
          </div>
          <div class="field">
            <label>Name</label>
            <input v-model="form.name" type="text" placeholder="Demo" />
          </div>
          <button class="action-btn" @click="callRegister" :disabled="loading.register">
            <span class="icon">🆕</span>
            註冊（並設定 Cookie）
          </button>
          <pre class="result" v-text="results.register"></pre>
        </div>

        <div class="api-card">
          <h3>POST /auth/login</h3>
          <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="test@example.com" />
          </div>
          <div class="field">
            <label>Password</label>
            <input v-model="form.password" type="password" placeholder="password" />
          </div>
          <button class="action-btn" @click="callLogin" :disabled="loading.login">
            <span class="icon">🔐</span>
            登入（設定 Cookie）
          </button>
          <pre class="result" v-text="results.login"></pre>
        </div>

        <div class="api-card">
          <h3>GET /auth/session</h3>
          <button class="action-btn" @click="callSession" :disabled="loading.session">
            <span class="icon">🧾</span>
            取得 Session
          </button>
          <pre class="result" v-text="results.session"></pre>
        </div>

        <div class="api-card">
          <h3>POST /auth/logout</h3>
          <button class="action-btn" @click="callLogout" :disabled="loading.logout">
            <span class="icon">🚪</span>
            登出（清除 Cookie）
          </button>
          <pre class="result" v-text="results.logout"></pre>
        </div>
      </div>

      <!-- 會員 API 測試（profile / relationships / follow / unfollow） -->
      <h2 style="margin-top:24px;">👤 會員 API 測試</h2>
      <div class="api-grid">
        <div class="api-card">
          <h3>目標會員</h3>
          <div class="field">
            <label>Member ID</label>
            <input v-model="member.memberId" placeholder="例如：test123 或 test2" />
          </div>
          <div class="field">
            <label>備註</label>
            <div>未登入可測 relationships（會回 isFollowing=false）</div>
          </div>
        </div>

        <div class="api-card">
          <h3>GET /members/{id}/profile</h3>
          <button class="action-btn" @click="callProfile" :disabled="loading.profile">
            <span class="icon">🧑</span>
            取得 Profile
          </button>
          <pre class="result" v-text="results.profile"></pre>
        </div>

        <div class="api-card">
          <h3>GET /members/{id}/relationships</h3>
          <button class="action-btn" @click="callRelationships" :disabled="loading.relationships">
            <span class="icon">🤝</span>
            取得關係
          </button>
          <pre class="result" v-text="results.relationships"></pre>
        </div>

        <div class="api-card">
          <h3>POST/DELETE /members/{id}/follow</h3>
          <div style="display:flex; gap:8px;">
            <button class="action-btn" @click="callFollow" :disabled="loading.follow">
              <span class="icon">➕</span>
              追蹤（需登入）
            </button>
            <button class="action-btn" @click="callUnfollow" :disabled="loading.unfollow">
              <span class="icon">➖</span>
              取消追蹤（需登入）
            </button>
          </div>
          <pre class="result" v-text="results.follow"></pre>
          <pre class="result" v-text="results.unfollow"></pre>
        </div>
      </div>

      <!-- 大頭貼上傳測試 -->
      <h2 style="margin-top:24px;">📸 大頭貼上傳測試</h2>
      <div class="api-grid">
        <div class="api-card">
          <h3>POST /me/avatar</h3>
          <div class="field">
            <label>選擇圖片檔案</label>
            <input 
              type="file" 
              ref="avatarFileInput"
              @change="onFileSelect"
              accept="image/jpeg,image/png,image/webp"
              style="padding: 8px; border: 2px solid #e9ecef; border-radius: 8px; width: 100%;"
            />
          </div>
          <div class="field" v-if="selectedFile">
            <label>檔案資訊</label>
            <div style="font-size: 0.85rem; color: #666;">
              檔名: {{ selectedFile.name }}<br>
              大小: {{ formatFileSize(selectedFile.size) }}<br>
              類型: {{ selectedFile.type }}
            </div>
          </div>
          <button class="action-btn" @click="callUploadAvatar" :disabled="loading.avatar || !selectedFile">
            <span class="icon">📤</span>
            上傳大頭貼（需登入）
          </button>
          <pre class="result" v-text="results.avatar"></pre>
        </div>

        <div class="api-card" v-if="avatarPreview">
          <h3>預覽上傳結果</h3>
          <div style="text-align: center;">
            <img 
              :src="avatarPreview" 
              alt="大頭貼預覽" 
              style="max-width: 150px; max-height: 150px; border-radius: 50%; border: 3px solid #667eea;"
            />
            <div style="margin-top: 10px; font-size: 0.85rem; color: #666;">
              {{ avatarUrl }}
            </div>
          </div>
        </div>
      </div>

      <div class="cookie-panel">
        <div class="cookie-header">
          <h3>🍪 瀏覽器 Cookie</h3>
          <button class="action-btn" @click="refreshCookies">
            <span class="icon">🔄</span>
            刷新 Cookie 顯示
          </button>
        </div>
        <pre class="result" v-text="cookies"></pre>
        <p class="cookie-hint">登出成功時，應看不到 <code>sgame_session</code> 或其值為空/過期。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { reactive, ref, onMounted } from 'vue';
import { useSessionStore } from '../stores/session';

const router = useRouter();

// 在新分頁開啟頁面
function openInNewTab(path: string) {
  window.open(path, '_blank');
}

// 重新整理頁面
function refreshPage() {
  window.location.reload();
}

// 返回上一頁
function goBack() {
  router.go(-1);
}

// ===== API 測試 =====
const form = reactive({
  email: 'test@example.com',
  password: 'password',
  name: 'Demo'
});

const loading = reactive({ health: false, register: false, login: false, session: false, logout: false, profile: false, relationships: false, follow: false, unfollow: false, avatar: false });
const results = reactive<{ [k: string]: string }>({ health: '', register: '', login: '', session: '', logout: '', profile: '', relationships: '', follow: '', unfollow: '', avatar: '' });
const cookies = ref('');
const member = reactive({ memberId: 'test123' });

// 大頭貼上傳相關
const avatarFileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const avatarPreview = ref<string>('');
const avatarUrl = ref<string>('');

function refreshCookies() {
  try {
    cookies.value = document.cookie || '(無 Cookie)';
  } catch {
    cookies.value = '(無法讀取 Cookie)';
  }
}

function buildUrl(path: string) { return path; }

async function request(path: string, init?: RequestInit) {
  try {
    const url = buildUrl(path);
    const res = await fetch(url, { credentials: 'include', headers: { Accept: 'application/json, text/plain;q=0.8, */*;q=0.5', ...(init?.headers || {}) }, ...init });
    const text = await res.text();
    const ct = res.headers.get('content-type') || '';
    if (/text\/html/i.test(ct)) {
      return { ok: res.ok, status: res.status, data: { warning: '收到 HTML，可能是 SPA index.html，請確認 API Base/代理設定。', snippet: text.slice(0, 300) + (text.length > 300 ? '…' : '') }, raw: text };
    }
    try {
      const json = JSON.parse(text);
      return { ok: res.ok, status: res.status, data: json, raw: text };
    } catch {
      return { ok: res.ok, status: res.status, data: text, raw: text };
    }
  } catch (e: any) {
    return { ok: false, status: 0, data: { error: String(e) }, raw: String(e) };
  }
}

function pretty(label: string, r: { ok: boolean; status: number; data: any }) {
  return `${label} → status: ${r.status}, ok: ${r.ok}\n${typeof r.data === 'string' ? r.data : JSON.stringify(r.data, null, 2)}`;
}

async function callHealth() {
  loading.health = true; results.health = '請求中...';
  const r = await request('/health');
  results.health = pretty('GET /health', r);
  refreshCookies();
  loading.health = false;
}

async function callLogin() {
  loading.login = true; results.login = '請求中...';
  try {
    const session = useSessionStore();
    const res = await session.login({ email: form.email, password: form.password, rememberme: 'yes' });
    results.login = `POST /api/auth/login → status: ${res.status}, ok: ${res.ok}`;
    await session.fetchSession(true);
    results.session = `Session 快照 → ${JSON.stringify({ loggedIn: session.loggedIn, user: session.user }, null, 2)}`;
  } catch (e: any) {
    results.login = `POST /api/auth/login 失敗: ${String(e)}`;
  }
  refreshCookies();
  loading.login = false;
}

async function callRegister() {
  loading.register = true; results.register = '請求中...';
  try {
    const r = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password, name: form.name })
    });
    results.register = pretty('POST /auth/register', r);
    try {
      const session = useSessionStore();
      await session.fetchSession(true);
      results.session = `Session 快照 → ${JSON.stringify({ loggedIn: session.loggedIn, user: session.user }, null, 2)}`;
    } catch {}
  } catch (e: any) {
    results.register = `POST /api/auth/register 失敗: ${String(e)}`;
  }
  refreshCookies();
  loading.register = false;
}

async function callSession() {
  loading.session = true; results.session = '請求中...';
  const r = await request('/api/auth/session');
  results.session = pretty('GET /auth/session', r);
  try {
    const session = useSessionStore();
    await session.fetchSession(true);
    results.session += `\nSession 快照 → ${JSON.stringify({ loggedIn: session.loggedIn, user: session.user }, null, 2)}`;
  } catch {}
  refreshCookies();
  loading.session = false;
}

async function callLogout() {
  loading.logout = true; results.logout = '請求中...';
  try {
    const session = useSessionStore();
    await session.logout();
    results.logout = 'POST /api/auth/logout → ok';
    await session.fetchSession(true);
    results.session = `Session 快照 → ${JSON.stringify({ loggedIn: session.loggedIn, user: session.user }, null, 2)}`;
  } catch (e: any) {
    results.logout = `POST /api/auth/logout 失敗: ${String(e)}`;
  }
  refreshCookies();
  loading.logout = false;
}

onMounted(() => { refreshCookies(); });

// 同步顯示目前登入狀態（示意）
const session = useSessionStore();
session.fetchSession().then(() => {
  results.session = `Session 快照 → ${JSON.stringify({ loggedIn: session.loggedIn, user: session.user }, null, 2)}`;
});

// ===== 會員 API =====
async function callProfile() {
  loading.profile = true; results.profile = '請求中...';
  const id = encodeURIComponent(member.memberId || '');
  const r = await request(`/api/members/${id}/profile`);
  results.profile = pretty('GET /members/{id}/profile', r);
  loading.profile = false;
}

async function callRelationships() {
  loading.relationships = true; results.relationships = '請求中...';
  const id = encodeURIComponent(member.memberId || '');
  const r = await request(`/api/members/${id}/relationships`);
  results.relationships = pretty('GET /members/{id}/relationships', r);
  loading.relationships = false;
}

async function callFollow() {
  loading.follow = true; results.follow = '請求中...';
  const id = encodeURIComponent(member.memberId || '');
  const r = await request(`/api/members/${id}/follow`, { method: 'POST' });
  results.follow = pretty('POST /members/{id}/follow', r);
  // 更新 session 關係快照
  try { const s = useSessionStore(); await s.fetchSession(true); } catch {}
  loading.follow = false;
}

async function callUnfollow() {
  loading.unfollow = true; results.unfollow = '請求中...';
  const id = encodeURIComponent(member.memberId || '');
  const r = await request(`/api/members/${id}/follow`, { method: 'DELETE' });
  results.unfollow = pretty('DELETE /members/{id}/follow', r);
  try { const s = useSessionStore(); await s.fetchSession(true); } catch {}
  loading.unfollow = false;
}

// 大頭貼上傳相關函數
function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // 檢查檔案類型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('請選擇 JPEG、PNG 或 WebP 格式的圖片');
      target.value = '';
      return;
    }
    
    // 檢查檔案大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('檔案大小不能超過 5MB');
      target.value = '';
      return;
    }
    
    selectedFile.value = file;
    
    // 建立預覽
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    selectedFile.value = null;
    avatarPreview.value = '';
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function callUploadAvatar() {
  if (!selectedFile.value) {
    alert('請先選擇圖片檔案');
    return;
  }
  
  loading.avatar = true;
  results.avatar = '上傳中...';
  
  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    
    const res = await request('/api/me/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        // 不設定 Content-Type，讓瀏覽器自動設定 multipart/form-data
      }
    });
    
    results.avatar = pretty('POST /me/avatar', res);
    
    // 如果上傳成功，解析回應並更新預覽
    if (res.ok) {
      try {
        const data = JSON.parse(res.raw);
        if (data.url) {
          avatarUrl.value = data.url;
          // 加上時間戳避免快取
          const timestamp = new Date(data.updatedAt || Date.now()).getTime();
          avatarPreview.value = `${data.url}?v=${timestamp}`;
          
          // 觸發大頭貼更新事件，通知其他頁面重新載入
          window.dispatchEvent(new CustomEvent('avatar-updated', { 
            detail: { url: data.url, updatedAt: data.updatedAt } 
          }));
        }
      } catch (e) {
        console.warn('解析上傳回應失敗:', e);
      }
    }
  } catch (e) {
    results.avatar = `錯誤: ${e}`;
  } finally {
    loading.avatar = false;
  }
}

// ===== 導覽：隱藏 ID 版本 =====
function navigateToMemberHidden() {
  const id = (member.memberId || '').trim();
  if (!id) return;
  router.push({ path: '/member', state: { memberId: id } });
}
</script>

<style scoped>
.test-navigation {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.header p {
  font-size: 1.2rem;
  margin: 0 0 20px 0;
  opacity: 0.9;
}

.color-legend {
  background: rgba(255,255,255,0.15);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  backdrop-filter: blur(10px);
}

.color-legend h3 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: white;
  text-align: center;
}

.legend-items {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid rgba(255,255,255,0.3);
}

.legend-item.primary .legend-color {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.legend-item.normal .legend-color {
  background: white;
}

.legend-item.error .legend-color {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.navigation-grid {
  display: grid;
  gap: 30px;
  margin-bottom: 40px;
}

.section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.section h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5rem;
  border-bottom: 3px solid #667eea;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-badge {
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-badge.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.color-badge.normal {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.color-badge.error {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.button-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.nav-button {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: #667eea;
  text-decoration: none;
  color: #333;
}

.nav-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.nav-button.primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  color: white;
}

.nav-button.error {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border-color: #ff6b6b;
}

.nav-button.error:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e5501a 100%);
  color: white;
}

.nav-button .icon {
  font-size: 2rem;
  margin-right: 15px;
  min-width: 50px;
  text-align: center;
}

.nav-button .content h3 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-button .content p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.9rem;
}

.nav-button .content .url {
  font-family: 'Courier New', monospace;
  background: rgba(0,0,0,0.1);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #555;
}

.nav-button.primary .content .url,
.nav-button.error .content .url {
  background: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.9);
}

.quick-actions {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.quick-actions h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.action-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-1px);
}

.action-btn .icon {
  margin-right: 8px;
  font-size: 1.1rem;
}

.status-info {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.status-info h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.status-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.status-item .label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.status-item .value {
  font-family: 'Courier New', monospace;
  color: #333;
  font-size: 0.9rem;
  word-break: break-all;
}

/* API 測試 */
.api-test {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  margin-top: 30px;
}

.api-test h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5rem;
}

.api-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.api-base {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
}

.api-base input {
  flex: 1;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.95rem;
}

.api-card {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 16px;
  background: #f8f9fa;
}

.api-card h3 {
  margin: 0 0 10px 0;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.field label {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 4px;
}

.field input {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.95rem;
}

.result {
  background: #fff;
  border: 1px dashed #ced4da;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  max-height: 220px;
  overflow: auto;
  white-space: pre-wrap;
}

.cookie-panel {
  margin-top: 20px;
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
}

.cookie-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.cookie-hint {
  margin-top: 6px;
  color: #666;
  font-size: 0.85rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .test-navigation {
    padding: 15px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .legend-items {
    flex-direction: column;
    gap: 15px;
  }
  
  .section h2 {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .button-group {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style>
