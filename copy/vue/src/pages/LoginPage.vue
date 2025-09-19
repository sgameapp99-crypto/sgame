<template>
  <div class="login-page">
    <div class="login-dialog">
      <div class="dialog-titlebar">
        <button class="close-btn" @click="goBack" aria-label="close">×</button>
      </div>

      <div class="oauth-row">
        <button class="oauth-btn google" @click="oauth('google')"><i class="icon">G</i> Google 登入</button>
        <button class="oauth-btn facebook" @click="oauth('facebook')"><i class="icon">f</i> Facebook 登入</button>
        <button class="oauth-btn line" @click="oauth('line')"><i class="icon">L</i> Line 登入</button>
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
          <button class="submit" type="submit" :disabled="submitting">{{ submitting ? '登入中…' : '登入' }}</button>
          <RouterLink class="signup" to="/register">免費加入會員</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const rememberMe = ref(true);
const errorMessage = ref('');
const submitting = ref(false);

const showPwdLenErr = ref(false);

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}

function oauth(provider: 'google' | 'facebook' | 'line') {
  // 先簡化為導向；之後可由後端提供實際 OAuth 起點。
  const map: Record<string, string> = {
    google: '/member/google/auth',
    facebook: '/member/facebook/auth',
    line: '/member/line/auth',
  };
  window.location.href = map[provider];
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
    submitting.value = true;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'include',
      body: JSON.stringify({ email: username.value, password: password.value, rememberme: rememberMe.value ? 'yes' : 'no', redirectUrl: '/member' })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      errorMessage.value = err?.message || '登入失敗，請稍後再試';
      return;
    }
    // 200 { redirectUrl? } 或 204
    if (res.status === 204) {
      router.push('/');
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (data?.redirectUrl) window.location.href = data.redirectUrl;
    else router.push('/');
  } catch (e) {
    errorMessage.value = '網路或伺服器錯誤';
  } finally {
    submitting.value = false;
  }
}
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
.recover { margin-left: 6px; font-size: 12px; color: #0277bd; }
.remember-row { display: inline-flex; gap: 6px; align-items: center; margin-top: 6px; }
.action-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.submit { padding: 8px 14px; background: #095a8b; color: #fff; border: 0; border-radius: 4px; cursor: pointer; }
.signup { color: #0277bd; font-size: 14px; }
.message-error { color: #dc3545; font-size: 13px; margin: 0; }
</style>

 
