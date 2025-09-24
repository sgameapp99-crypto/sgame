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

      <!-- 法律條款測試 -->
      <div class="section">
        <h2>⚖️ 法律條款測試 <span class="color-badge normal">功能頁面</span></h2>
        <div class="button-group">
          <RouterLink to="/legal" class="nav-button">
            <div class="icon">📜</div>
            <div class="content">
              <h3>法律條款頁面</h3>
              <p>服務條款、隱私權政策、販售預測規範</p>
              <span class="url">/legal</span>
            </div>
          </RouterLink>

          <RouterLink to="/legal#privacy" class="nav-button">
            <div class="icon">🔒</div>
            <div class="content">
              <h3>隱私權政策</h3>
              <p>直接跳轉到隱私權政策標籤</p>
              <span class="url">/legal#privacy</span>
            </div>
          </RouterLink>

          <RouterLink to="/legal#sales" class="nav-button">
            <div class="icon">💰</div>
            <div class="content">
              <h3>販售預測規範</h3>
              <p>直接跳轉到販售預測規範標籤</p>
              <span class="url">/legal#sales</span>
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
        <button @click="openInNewTab('/legal')" class="action-btn">
          <span class="icon">📜</span>
          新分頁開啟法律條款
        </button>
        <button @click="refreshPage" class="action-btn">
          <span class="icon">🔄</span>
          重新整理頁面
        </button>
        <button @click="goBack" class="action-btn">
          <span class="icon">⬅️</span>
          返回上一頁
        </button>
        <button @click="runOneClickVerify" class="action-btn">
          <span class="icon">✅</span>
          一鍵驗證（Auth/Verify/Member）
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
            <div class="pwd-rules">
              <div class="rule" :class="{ ok: vLen, bad: form.password && !vLen }">8–12 碼</div>
              <div class="rule" :class="{ ok: vUpper, bad: form.password && !vUpper }">至少 1 個大寫字母</div>
              <div class="rule" :class="{ ok: vLower, bad: form.password && !vLower }">至少 1 個小寫字母</div>
              <div class="rule" :class="{ ok: vNumber, bad: form.password && !vNumber }">至少 1 個數字</div>
              <div class="rule" :class="{ ok: vSpecial, bad: form.password && !vSpecial }">至少 1 個特殊符號（!@#$%^&* 等）</div>
              <div class="rule" :class="{ ok: vNoWs, bad: form.password && !vNoWs }">不可含空白</div>
              <div class="rule" :class="{ ok: vNotEmailLike, bad: form.password && !vNotEmailLike }">不可與 Email 相同或包含 Email 主要片段</div>
            </div>
          </div>
          <div class="field">
            <label>Name</label>
            <input v-model="form.name" type="text" placeholder="Demo" />
          </div>
          <button class="action-btn" @click="callRegister" :disabled="loading.register || !strongOk">
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
          <h4 style="margin-top:8px;">一鍵驗證日誌</h4>
          <pre class="result oneclick" v-text="verifyLog"></pre>
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

      <!-- Google OAuth 測試 -->
      <h2 style="margin-top:24px;">🔐 Google OAuth 測試</h2>
      <div class="api-grid">
        <div class="api-card">
          <h3>GET /auth/oauth/google/start</h3>
          <div class="field">
            <label>重定向 URL</label>
            <input v-model="oauth.redirectUrl" type="text" placeholder="/member" />
          </div>
          <button class="action-btn" @click="callOAuthStart" :disabled="loading.oauthStart">
            <span class="icon">🚀</span>
            啟動 Google OAuth（重定向）
          </button>
          <pre class="result" v-text="results.oauthStart"></pre>
        </div>

        <div class="api-card">
          <h3>GET /auth/oauth/google/callback</h3>
          <div class="field">
            <label>模擬錯誤參數</label>
            <select v-model="oauth.errorType">
              <option value="">正常流程</option>
              <option value="access_denied">access_denied</option>
              <option value="invalid_request">invalid_request</option>
            </select>
          </div>
          <button class="action-btn" @click="callOAuthCallback" :disabled="loading.oauthCallback">
            <span class="icon">🔄</span>
            測試回調端點
          </button>
          <pre class="result" v-text="results.oauthCallback"></pre>
        </div>

        <div class="api-card">
          <h3>錯誤處理檢查</h3>
          <button class="action-btn" @click="checkOAuthErrors">
            <span class="icon">🔍</span>
            檢查 URL 錯誤參數
          </button>
          <pre class="result" v-text="results.oauthErrors"></pre>
        </div>

        <div class="api-card">
          <h3>完整 OAuth 流程</h3>
          <div class="oauth-flow">
            <div class="flow-step">
              <span class="step-number">1</span>
              <span class="step-text">點擊「啟動 Google OAuth」</span>
            </div>
            <div class="flow-step">
              <span class="step-number">2</span>
              <span class="step-text">在 Google 頁面完成授權</span>
            </div>
            <div class="flow-step">
              <span class="step-number">3</span>
              <span class="step-text">自動重定向回應用程式</span>
            </div>
            <div class="flow-step">
              <span class="step-number">4</span>
              <span class="step-text">檢查 Session 與 Cookie</span>
            </div>
          </div>
          <button class="action-btn" @click="validateOAuthFlow">
            <span class="icon">✅</span>
            驗證 OAuth 流程狀態
          </button>
          <pre class="result" v-text="results.oauthValidation"></pre>
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

      <!-- 大頭貼讀取檢測 -->
      <h2 style="margin-top:24px;">🕵️ 大頭貼讀取檢測</h2>
      <div class="api-grid">
        <div class="api-card">
          <h3>檢測使用者大頭貼 URL</h3>
          <div class="field">
            <label>使用者 ID</label>
            <input v-model="avatarCheck.userId" placeholder="例如：test123" />
          </div>
          <div class="field">
            <label>圖片完整 URL（選填，預設使用 /static/avatars/{id}.webp）</label>
            <input v-model="avatarCheck.customUrl" placeholder="http://host:port/static/avatars/test123.webp" />
          </div>
          <div style="display:flex; gap:8px; flex-wrap: wrap;">
            <button class="action-btn" @click="checkAvatar('HEAD')" :disabled="loading.avatarCheck">
              <span class="icon">🧪</span>
              HEAD 檢測
            </button>
            <button class="action-btn" @click="checkAvatar('GET')" :disabled="loading.avatarCheck">
              <span class="icon">🔍</span>
              GET 讀取（含快取破壞）
            </button>
            <button class="action-btn" @click="refreshAvatarPreview" :disabled="!avatarCheck.lastUrl">
              <span class="icon">🖼️</span>
              更新預覽
            </button>
          </div>
          <pre class="result" v-text="results.avatarCheck"></pre>
        </div>

        <div class="api-card" v-if="avatarCheck.previewUrl">
          <h3>讀取預覽</h3>
          <div style="text-align:center;">
            <img :src="avatarCheck.previewUrl" alt="讀取預覽" style="max-width: 150px; max-height: 150px; border-radius: 50%; border: 3px solid #28a745;" />
            <div style="margin-top: 10px; font-size: 0.85rem; color: #666;">{{ avatarCheck.lastUrl }}</div>
            <div style="margin-top: 6px;">
              <a :href="avatarCheck.lastUrl" target="_blank" rel="noreferrer noopener" style="font-size:12px;">在新分頁開啟原始圖片 URL</a>
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
import { reactive, ref, onMounted, computed } from 'vue';
import api from '../api/client';
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

// 強密碼規則（與 RegisterPage 一致）
const vLen = computed(() => form.password.length >= 8 && form.password.length <= 12);
const vUpper = computed(() => /[A-Z]/.test(form.password));
const vLower = computed(() => /[a-z]/.test(form.password));
const vNumber = computed(() => /\d/.test(form.password));
const vSpecial = computed(() => /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?`~|\\]/.test(form.password));
const vNoWs = computed(() => !/\s/.test(form.password));
const vNotEmailLike = computed(() => {
  const pwd = (form.password || '').toLowerCase();
  const em = (form.email || '').toLowerCase();
  if (!em) return true;
  if (pwd === em) return false;
  const [local, domainAll] = em.split('@');
  const domain = (domainAll || '').split('.')[0] || '';
  const localOk = !local || local.length < 3 || !pwd.includes(local);
  const domainOk = !domain || domain.length < 3 || !pwd.includes(domain);
  return localOk && domainOk && !pwd.includes(em);
});
const strongOk = computed(() => vLen.value && vUpper.value && vLower.value && vNumber.value && vSpecial.value && vNoWs.value && vNotEmailLike.value);

const loading = reactive({ health: false, register: false, login: false, session: false, logout: false, profile: false, relationships: false, follow: false, unfollow: false, avatar: false, oauthStart: false, oauthCallback: false, avatarCheck: false });
const results = reactive<{ [k: string]: string }>({ health: '', register: '', login: '', session: '', logout: '', profile: '', relationships: '', follow: '', unfollow: '', avatar: '', oauthStart: '', oauthCallback: '', oauthErrors: '', oauthValidation: '', avatarCheck: '' });
const cookies = ref('');
const member = reactive({ memberId: 'test123' });
const oauth = reactive({ redirectUrl: '/member', errorType: '' });

// 大頭貼上傳相關
const avatarFileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const avatarPreview = ref<string>('');
const avatarUrl = ref<string>('');
// 新增：大頭貼讀取檢測狀態
const avatarCheck = reactive<{ userId: string; customUrl: string; lastUrl: string; previewUrl: string }>({ userId: 'test123', customUrl: '', lastUrl: '', previewUrl: '' });

function refreshCookies() {
  try {
    cookies.value = document.cookie || '(無 Cookie)';
  } catch {
    cookies.value = '(無法讀取 Cookie)';
  }
}

function buildUrl(path: string) { return path; }

function buildAvatarUrl(): string {
  const base = avatarCheck.customUrl?.trim();
  if (base) return base;
  const id = (avatarCheck.userId || '').trim();
  if (!id) return '';
  return `/static/avatars/${encodeURIComponent(id)}.webp`;
}

async function headRequest(url: string) {
  try {
    const res = await fetch(url, { method: 'HEAD', credentials: 'include' });
    return { ok: res.ok, status: res.status, headers: res.headers };
  } catch (e: any) {
    return { ok: false, status: 0, headers: new Headers(), error: String(e) };
  }
}

async function getRequest(url: string) {
  try {
    const res = await fetch(url, { method: 'GET', credentials: 'include' });
    const buf = await res.arrayBuffer();
    return { ok: res.ok, status: res.status, headers: res.headers, size: buf.byteLength };
  } catch (e: any) {
    return { ok: false, status: 0, headers: new Headers(), size: 0, error: String(e) };
  }
}

function headerPick(h: Headers, k: string) {
  return h.get(k) || '';
}

function sameOrigin(url: string): boolean {
  try {
    const u = new URL(url, window.location.origin);
    return u.origin === window.location.origin;
  } catch {
    return true;
  }
}

function buildPreviewSrc(rawUrl: string): string {
  try {
    const u = new URL(rawUrl, window.location.origin);
    if (u.origin === window.location.origin) return `${u.pathname}${u.search}${u.search ? '&' : '?'}v=${Date.now()}`;
    // 若為跨來源，但路徑在 /static 下，使用同來源代理路徑避免 CORP 阻擋
    if (u.pathname.startsWith('/static/')) {
      return `${u.pathname}?v=${Date.now()}`;
    }
    return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
  } catch {
    return `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
  }
}

async function checkAvatar(method: 'HEAD'|'GET') {
  const rawUrl = buildAvatarUrl();
  if (!rawUrl) {
    results.avatarCheck = '請輸入使用者 ID 或完整圖片 URL';
    return;
  }

  loading.avatarCheck = true;
  try {
    const url = method === 'GET' ? `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}v=${Date.now()}` : rawUrl;
    avatarCheck.lastUrl = rawUrl;

    if (method === 'HEAD') {
      const r = await headRequest(url);
      const ct = headerPick(r.headers, 'content-type');
      const cl = headerPick(r.headers, 'content-length');
      const etag = headerPick(r.headers, 'etag');
      const lm = headerPick(r.headers, 'last-modified');
      const corp = headerPick(r.headers, 'cross-origin-resource-policy');
      let note = '';
      if (!sameOrigin(rawUrl) && /same-origin/i.test(corp)) {
        note = '\n(提示) 伺服器 CORP=same-origin，跨來源 <img> 可能被阻擋，將改用同來源預覽路徑';
      }
      results.avatarCheck = `HEAD ${rawUrl} → status: ${r.status}, ok: ${r.ok}\ncontent-type: ${ct}\ncontent-length: ${cl}\netag: ${etag}\nlast-modified: ${lm}${note}`;
      if (r.ok && /image\//i.test(ct)) {
        await refreshAvatarPreview();
      }
    } else {
      const r = await getRequest(url);
      const ct = headerPick(r.headers, 'content-type');
      const cl = headerPick(r.headers, 'content-length');
      const corp = headerPick(r.headers, 'cross-origin-resource-policy');
      let note = '';
      if (!sameOrigin(rawUrl) && /same-origin/i.test(corp)) {
        note = '\n(提示) 伺服器 CORP=same-origin，跨來源 <img> 可能被阻擋，將改用同來源預覽路徑';
      }
      results.avatarCheck = `GET ${rawUrl} → status: ${r.status}, ok: ${r.ok}\ncontent-type: ${ct}\ncontent-length: ${cl}\narrayBuffer.size: ${r.size}${note}`;
      if (r.ok && /image\//i.test(ct)) {
        await refreshAvatarPreview();
      }
    }
  } catch (e: any) {
    results.avatarCheck = `檢測失敗: ${String(e)}`;
  } finally {
    loading.avatarCheck = false;
  }
}

async function refreshAvatarPreview() {
  if (!avatarCheck.lastUrl) return;
  const previewCandidate = buildPreviewSrc(avatarCheck.lastUrl);
  // 驗證同來源 URL 是否回傳 image，避免被前端 dev server 回 index.html
  try {
    const h = await fetch(previewCandidate, { method: 'HEAD', credentials: 'include' });
    const ct = h.headers.get('content-type') || '';
    if (!/^image\//i.test(ct)) {
      results.avatarCheck += `\n(提示) 同來源預覽路徑回傳非圖片 content-type: ${ct}，請確認開發代理是否包含 '/static' 並已重啟。`;
      // 退回使用原始完整 URL 嘗試直接顯示（若伺服器 CORP=same-origin，可能仍不顯示，但提供下方新分頁開啟連結）
      avatarCheck.previewUrl = `${avatarCheck.lastUrl}${avatarCheck.lastUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
      return;
    }
    avatarCheck.previewUrl = previewCandidate;
  } catch {
    avatarCheck.previewUrl = previewCandidate; // 退而求其次仍嘗試顯示
  }
}

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
  if (!strongOk.value) {
    results.register = '密碼未符合強度要求：8–12 碼，含大小寫、數字、特殊符號，不可含空白，且不可與 Email 相關。';
    return;
  }
  loading.register = true; results.register = '請求中...';
  try {
    const r = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password, name: form.name })
    });
    results.register = pretty('POST /auth/register', r);
    try {
      if (r.ok && typeof r.data === 'object' && r.data) {
        const nv = (r.data as any).needsVerification;
        if (typeof nv === 'boolean') {
          results.register += `\nneedsVerification: ${nv}`;
        }
      }
    } catch {}
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

// ===== Google OAuth 測試 =====
async function callOAuthStart() {
  const redirectUrl = oauth.redirectUrl || '/member';
  const url = `/api/auth/oauth/google/start?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  // 直接導頁至後端 OAuth 起始端點
  window.location.href = url;
}

async function callOAuthCallback() {
  loading.oauthCallback = true;
  results.oauthCallback = '測試 OAuth 回調端點...';
  
  try {
    let url = '/api/auth/oauth/google/callback';
    if (oauth.errorType) {
      url += `?error=${oauth.errorType}`;
    } else {
      url += '?code=test_code&state=test_state';
    }
    
    const res = await request(url, { method: 'HEAD' });
    results.oauthCallback = pretty('HEAD /auth/oauth/google/callback', res);
    
    if (res.status === 302) {
      results.oauthCallback += '\n\n✅ 回調端點正常，會進行重定向';
      if (oauth.errorType) {
        results.oauthCallback += `\n📱 錯誤處理測試：${oauth.errorType}`;
      }
    }
  } catch (e: any) {
    results.oauthCallback = `OAuth 回調測試失敗: ${String(e)}`;
  }
  
  loading.oauthCallback = false;
}

function checkOAuthErrors() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  
  let errorInfo = 'URL 參數檢查結果：\n';
  errorInfo += `當前 URL: ${window.location.href}\n`;
  errorInfo += `查詢參數: ${window.location.search}\n\n`;
  
  if (error) {
    errorInfo += `🚨 發現錯誤參數: ${error}\n\n`;
    
    switch (error) {
      case 'OAUTH_PROVIDER_DENIED':
        errorInfo += '📝 錯誤說明: 用戶在 Google 頁面拒絕授權\n';
        errorInfo += '💡 建議: 檢查用戶是否點擊了「取消」或「拒絕」';
        break;
      case 'OAUTH_INVALID_STATE':
        errorInfo += '📝 錯誤說明: 狀態參數驗證失敗\n';
        errorInfo += '💡 建議: 可能是 CSRF 攻擊或會話過期';
        break;
      case 'OAUTH_EXCHANGE_FAILED':
        errorInfo += '📝 錯誤說明: 授權碼交換失敗\n';
        errorInfo += '💡 建議: 檢查 Google OAuth 憑證設定';
        break;
      case 'OAUTH_REDIRECT_INVALID':
        errorInfo += '📝 錯誤說明: 重定向 URL 不在白名單中\n';
        errorInfo += '💡 建議: 使用允許的重定向 URL';
        break;
      default:
        errorInfo += `📝 錯誤說明: 未知錯誤碼\n`;
        errorInfo += '💡 建議: 檢查後端日誌或聯繫開發團隊';
    }
  } else {
    errorInfo += '✅ 沒有發現錯誤參數\n';
    errorInfo += '📝 當前頁面沒有 OAuth 相關錯誤';
  }
  
  results.oauthErrors = errorInfo;
}

async function validateOAuthFlow() {
  results.oauthValidation = '驗證 OAuth 流程狀態...\n';
  
  try {
    // 檢查當前登入狀態
    const sessionRes = await request('/api/auth/session');
    results.oauthValidation += '🔍 檢查登入狀態:\n';
    results.oauthValidation += pretty('GET /auth/session', sessionRes);
    
    if (sessionRes.ok && sessionRes.data.loggedIn) {
      results.oauthValidation += '\n✅ OAuth 流程成功完成！\n';
      results.oauthValidation += `👤 用戶 ID: ${sessionRes.data.userId || 'N/A'}\n`;
      
      // 刷新 session store
      try {
        const session = useSessionStore();
        await session.fetchSession(true);
        results.oauthValidation += `📱 Session Store 狀態: ${JSON.stringify({ loggedIn: session.loggedIn, user: session.user }, null, 2)}`;
      } catch (e) {
        results.oauthValidation += `\n⚠️ Session Store 更新失敗: ${e}`;
      }
    } else {
      results.oauthValidation += '\n❌ 用戶未登入，OAuth 流程可能未完成或失敗\n';
      results.oauthValidation += '💡 建議: 重新執行 OAuth 流程測試';
    }
    
    // 檢查 Cookie
    refreshCookies();
    results.oauthValidation += `\n\n🍪 Cookie 狀態:\n${cookies.value}`;
    
  } catch (e: any) {
    results.oauthValidation += `\n❌ 驗證過程發生錯誤: ${String(e)}`;
  }
}

// ===== 導覽：隱藏 ID 版本 =====
function navigateToMemberHidden() {
  const id = (member.memberId || '').trim();
  if (!id) return;
  router.push({ path: '/member', state: { memberId: id } });
}

// 頁面載入時若有完整 URL，先做一次 HEAD 檢測
if (avatarCheck.customUrl) {
  checkAvatar('HEAD');
}

// ===== 一鍵驗證流程 =====
const verifyLog = ref<string>('');
async function runOneClickVerify() {
  verifyLog.value = '開始一鍵驗證...\n';
  const log = (m: string) => { verifyLog.value += m + '\n'; };
  try {
    // 1) 檢查 session
    log('1) 檢查 Session');
    const s = await api.get('/auth/session').then(r => r.data).catch(() => ({}));
    log(`   session.loggedIn=${!!s?.loggedIn}, userId=${s?.userId || s?.user?.id || 'N/A'}`);

    // 2) 若未驗證，嘗試發送驗證碼與查驗證狀態
    log('2) 檢查驗證狀態');
    const vs = await api.get('/auth/verification-status').then(r => r.data).catch(() => ({}));
    log(`   isVerified=${String(vs?.isVerified)} email=${vs?.email || 'N/A'}`);
    if (vs && vs.isVerified === false) {
      log('   嘗試發送驗證碼...');
      await api.post('/auth/send-verification').catch(e => log(`   發送驗證碼失敗: ${e?.response?.status || e}`));
    }

    // 3) 讀取會員頁（以輸入框 memberId 為準）
    const id = encodeURIComponent(member.memberId || 'test123');
    log(`3) 讀取會員資料 /members/${id}/profile`);
    const mp = await api.get(`/members/${id}/profile`).then(r => r.data).catch(() => ({}));
    log(`   會員名稱=${mp?.name || 'N/A'}`);

    // 4) 嘗試追蹤/取消追蹤（不影響結果）
    log('4) 嘗試追蹤/取消追蹤（可能需要登入）');
    try { await api.post(`/members/${id}/follow`); log('   追蹤：OK'); } catch (e: any) { log(`   追蹤失敗: ${e?.response?.status || e}`); }
    try { await api.delete(`/members/${id}/follow`); log('   取消追蹤：OK'); } catch (e: any) { log(`   取消追蹤失敗: ${e?.response?.status || e}`); }

    log('✅ 一鍵驗證完成');
  } catch (e: any) {
    log(`❌ 一鍵驗證失敗: ${e?.message || e}`);
  }
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
/* 強密碼提示樣式 */
.pwd-rules { display: grid; grid-template-columns: 1fr; gap: 4px; margin-top: 6px; }
.pwd-rules .rule { font-size: 12px; color: #666; }
.pwd-rules .rule.ok { color: #28a745; }
.pwd-rules .rule.bad { color: #dc3545; }

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

.api-test .result.oneclick { max-height: 360px; }

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

/* OAuth 流程樣式 */
.oauth-flow {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.step-text {
  font-size: 0.9rem;
  color: #333;
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
  
  .oauth-flow {
    gap: 6px;
  }
  
  .flow-step {
    padding: 6px 10px;
  }
  
  .step-number {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }
  
  .step-text {
    font-size: 0.85rem;
  }
}
</style>
