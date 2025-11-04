<template>
  <div class="login-page">
    <div class="login-dialog">
      <div class="dialog-titlebar">
        <button class="close-btn" @click="goBack" aria-label="close">×</button>
      </div>

      <div class="oauth-row">
        <button class="oauth-btn google" @click="oauth('google')"><i class="icon">G</i> Google 登入</button>
        <button class="oauth-btn facebook" disabled title="Facebook 登入尚未完成"><i class="icon">f</i> Facebook 登入（開發中）</button>
        <button class="oauth-btn line" disabled title="Line 登入尚未完成"><i class="icon">L</i> Line 登入（開發中）</button>
      </div>

      <div class="sep">
        <span>或</span>
        <hr />
      </div>

      <form class="login-form" @submit.prevent="onSubmit">
        <p v-if="errorMessage" class="message-error">{{ errorMessage }}</p>

        <label class="field">
          <div>帳號</div>
          <input v-model.trim="username" class="inputtext" name="username" type="text" autocomplete="username" />
        </label>

        <label class="field">
          <div>
            密碼
            <RouterLink class="recover" to="/recover">( 查帳號/密碼？)</RouterLink>
          </div>
          <input v-model="password" class="inputtext" name="password" type="password" autocomplete="current-password" />
          <p v-show="showPwdLenErr" class="message-error">請輸入密碼至少 6 位數</p>
          <label class="remember-row">
            <input type="checkbox" v-model="rememberMe" />
            <span>記住我</span>
          </label>
        </label>

        <div class="action-row">
          <button class="submit" type="submit" :disabled="submitting || cooldown>0">{{ submitting ? '登入中…' : (cooldown>0 ? `稍後再試 (${cooldown}s)` : '登入') }}</button>
          <RouterLink class="signup" to="/register">免費加入會員</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { authAPI } from '../api';
import { useSessionStore } from '../stores/session';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const username = ref('');
const password = ref('');
const rememberMe = ref(true);
const errorMessage = ref('');
const submitting = ref(false);
const cooldown = ref(0);
let cooldownTimer: any = null;

const showPwdLenErr = ref(false);

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}

function oauth(provider: 'google' | 'facebook' | 'line') {
  if (provider === 'google') {
    const redirectUrl = typeof route.query.redirect === 'string' && route.query.redirect
      ? String(route.query.redirect)
      : '/member';
    // 與測試頁一致的後端起點
    const url = `/api/auth/oauth/google/start?redirectUrl=${encodeURIComponent(redirectUrl)}`;
    window.location.href = url;
    return;
  }
  if (provider === 'facebook') {
    const redirectUrl = typeof route.query.redirect === 'string' && route.query.redirect
      ? String(route.query.redirect)
      : '/member';
    const url = `/api/auth/oauth/facebook/start?redirectUrl=${encodeURIComponent(redirectUrl)}`;
    window.location.href = url;
    return;
  }
  // 其他供應商可後續接上實際端點
}

async function onSubmit() {
  errorMessage.value = '';
  showPwdLenErr.value = false;

  if (!username.value) {
    errorMessage.value = '請輸入帳號';
    return;
  }
  if (!password.value) {
    errorMessage.value = '請輸入密碼';
    return;
  }
  if (password.value.length < 6) {
    showPwdLenErr.value = true;
    return;
  }

  try {
    if (cooldown.value > 0) return;
    submitting.value = true;
    const session = useSessionStore();
    const res = await session.login({ email: username.value, password: password.value, rememberme: rememberMe.value ? 'yes' : 'no' });
    // 確保使用者資料就緒
    await session.ensureProfile();
    // 登入後立即檢查 Email 驗證狀態，未驗證則直接導向驗證頁
    try {
      const vs = await authAPI.getVerificationStatus().catch(() => undefined as any);
      if (vs && vs.isVerified === false) {
        router.replace({ name: 'verify-email', query: { auto: '0' } });
        return;
      }
    } catch {}
    if ((res as any).status !== 200 && (res as any).status !== 204) {
      const err = (res as any).data || {};
      if ((res as any).status === 429) {
        errorMessage.value = err?.message || '嘗試過於頻繁，請稍後再試';
        // 啟動前端冷卻，避免持續觸發後端限流
        startCooldown(30);
      } else {
        errorMessage.value = err?.message || '登入失敗，請稍後再試';
      }
      return;
    }
    // 200 { redirectUrl? } 或 204
    if ((res as any).status === 204) {
      const qRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : undefined;
      await session.fetchSession(true);
      try {
        const vs = await authAPI.getVerificationStatus().catch(() => undefined as any);
        if (vs && vs.isVerified === false) {
          router.replace({ name: 'verify-email', query: { auto: '0' } });
          return;
        }
      } catch {}
      router.replace(qRedirect || '/member');
      // 瀏覽器導航保險
      setTimeout(() => { if (window.location.pathname === '/login') window.location.assign(qRedirect || '/member'); }, 150);
      return;
    }
    const data = (res as any).data || {};
    const qRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : undefined;
    // 若後端提供 redirectUrl，優先導向；否則使用 query.redirect 或 /member
    // 若後端提供 redirectUrl，僅當其非 '/' 時才優先導向；
    // 否則依 query.redirect 或預設 /member（避免被導到首頁）
    if (data?.redirectUrl && data.redirectUrl !== '/') {
      window.location.href = data.redirectUrl;
    } else {
      await session.fetchSession(true);
      try {
        const vs2 = await authAPI.getVerificationStatus().catch(() => undefined as any);
        if (vs2 && vs2.isVerified === false) {
          router.replace({ name: 'verify-email', query: { auto: '0' } });
          return;
        }
      } catch {}
      router.replace(qRedirect || '/member');
      setTimeout(() => { if (window.location.pathname === '/login') window.location.assign(qRedirect || '/member'); }, 150);
    }
  } catch (e: any) {
    const status = e?.response?.status;
    const msg = e?.response?.data?.message;
    if (status === 429) {
      errorMessage.value = msg || '嘗試過於頻繁，請稍後再試';
      startCooldown(30);
    } else if (status === 401 || status === 422) {
      errorMessage.value = msg || '帳號或密碼錯誤';
    } else {
      errorMessage.value = msg || '網路或伺服器錯誤';
    }
  } finally {
    submitting.value = false;
  }
}

function startCooldown(sec: number) {
  cooldown.value = sec;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    if (cooldown.value > 0) cooldown.value--; else clearInterval(cooldownTimer);
  }, 1000);
}

// 若已登入且帶有 redirect 參數，直接導向
onMounted(async () => {
  try {
    const s = await authAPI.getSession().catch(() => ({}));
    if (s?.loggedIn) {
      // 已登入時先檢查驗證狀態
      try {
        const vs = await authAPI.getVerificationStatus().catch(() => undefined as any);
        if (vs && vs.isVerified === false) {
          router.replace({ name: 'verify-email', query: { auto: '0' } });
          return;
        }
      } catch {}
      const qRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : undefined;
      if (qRedirect) router.replace(qRedirect);
      else router.replace('/member');
    }
  } catch {}
  // 顯示來自 OAuth 的錯誤碼（若有）
  const err = typeof route.query.error === 'string' ? route.query.error : '';
  if (err) {
    switch (err) {
      case 'OAUTH_PROVIDER_DENIED':
        errorMessage.value = '您已取消 Google 登入';
        break;
      case 'OAUTH_INVALID_STATE':
        errorMessage.value = '登入請求無效，請重試';
        break;
      case 'OAUTH_EXCHANGE_FAILED':
        errorMessage.value = 'Google 登入失敗，請稍後再試';
        break;
      default:
        errorMessage.value = '登入過程中發生錯誤';
    }
  }

  // 動態載入 Facebook SDK（若需要在前端頁面用 FB JS）
  try {
    const appId = (import.meta as any).env?.VITE_FB_APP_ID || '';
    const apiVersion = (import.meta as any).env?.VITE_FB_API_VERSION || 'v19.0';
    if (appId && !(window as any).FB) {
      (window as any).fbAsyncInit = function () {
        try {
          (window as any).FB.init({ appId, cookie: true, xfbml: true, version: apiVersion });
          if ((window as any).FB?.AppEvents?.logPageView) (window as any).FB.AppEvents.logPageView();
        } catch {}
      };
      const id = 'facebook-jssdk';
      if (!document.getElementById(id)) {
        const js = document.createElement('script');
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        const fjs = document.getElementsByTagName('script')[0];
        fjs?.parentNode?.insertBefore(js, fjs);
      }
    }
  } catch {}
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.35);
  padding: 24px;
}
.login-dialog {
  width: 386px;
  min-height: 594px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.2);
  padding: 16px 16px 24px;
}
.dialog-titlebar { display: flex; justify-content: flex-end; }
.close-btn { background: transparent; border: none; font-size: 20px; cursor: pointer; }

.oauth-row { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.oauth-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 12px; border-radius: 6px; border: 1px solid #e0e0e0; cursor: pointer; background: #fafafa; }
.oauth-btn.google .icon { font-weight: 700; color: #4285F4; }
.oauth-btn.facebook .icon { font-weight: 700; color: #1877F2; }
.oauth-btn.line .icon { font-weight: 700; color: #06c755; }

.sep { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 8px; margin: 12px 0; color: #999; }
.sep hr { border: 0; border-top: 1px solid #e0e0e0; }

.login-form { display: flex; flex-direction: column; gap: 12px; }
.field { display: block; }
.inputtext { width: 100%; height: 36px; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; }
.oauth-row { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.oauth-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 12px; border-radius: 6px; border: 1px solid #e0e0e0; cursor: pointer; background: #fafafa; }
.oauth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.oauth-btn.google .icon { font-weight: 700; color: #4285F4; }
.oauth-btn.facebook .icon { font-weight: 700; color: #1877F2; }
.oauth-btn.line .icon { font-weight: 700; color: #06c755; }
.recover { margin-left: 6px; font-size: 12px; color: #0277bd; }
.remember-row { display: inline-flex; gap: 6px; align-items: center; margin-top: 6px; }
.action-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.submit { padding: 8px 14px; background: #095a8b; color: #fff; border: 0; border-radius: 4px; cursor: pointer; }
.signup { color: #0277bd; font-size: 14px; }
.message-error { color: #dc3545; font-size: 13px; margin: 0; }
</style>

 
