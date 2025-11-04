<template>
  <div class="login-page">
    <div class="login-dialog">
      <div class="dialog-titlebar">
        <button class="close-btn" @click="goBack" aria-label="close">×</button>
      </div>

      <div class="sep">
        <span>會員註冊</span>
        <hr />
      </div>

      <!-- 第三方登入 -->
      <div class="oauth-row">
        <button class="oauth-btn google" @click="oauth('google')"><i class="icon">G</i> 使用 Google 登入</button>
        <button class="oauth-btn facebook" disabled title="Facebook 登入尚未完成"><i class="icon">f</i> Facebook 登入（開發中）</button>
        <button class="oauth-btn line" disabled title="Line 登入尚未完成"><i class="icon">L</i> Line 登入（開發中）</button>
      </div>

      <div class="sep">
        <span>或</span>
        <hr />
      </div>

      <form class="login-form" @submit.prevent="onSubmit">
        <p v-if="errorMessage" class="message-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="message-success">{{ successMessage }}</p>

        <label class="field">
          <div>暱稱/名稱</div>
          <input v-model.trim="name" class="inputtext" name="name" type="text" autocomplete="nickname" />
        </label>

        <label class="field">
          <div>Email</div>
          <input v-model.trim="email" class="inputtext" name="email" type="email" autocomplete="email" />
        </label>

        <label class="field">
          <div>密碼</div>
          <input v-model="password" class="inputtext" name="password" type="password" autocomplete="new-password" />
          <div class="pwd-rules">
            <div class="rule" :class="{ ok: vLen, bad: password.length>0 && !vLen }">8–12 碼</div>
            <div class="rule" :class="{ ok: vUpper, bad: password.length>0 && !vUpper }">至少 1 個大寫字母</div>
            <div class="rule" :class="{ ok: vLower, bad: password.length>0 && !vLower }">至少 1 個小寫字母</div>
            <div class="rule" :class="{ ok: vNumber, bad: password.length>0 && !vNumber }">至少 1 個數字</div>
            <div class="rule" :class="{ ok: vSpecial, bad: password.length>0 && !vSpecial }">至少 1 個特殊符號（!@#$%^&* 等）</div>
            <div class="rule" :class="{ ok: vNoWs, bad: password.length>0 && !vNoWs }">不可含空白</div>
            <div class="rule" :class="{ ok: vNotEmailLike, bad: password.length>0 && !vNotEmailLike }">不可與 Email 相同或包含 Email 主要片段</div>
          </div>
        </label>

        <label class="field">
          <div>確認密碼</div>
          <input v-model="passwordConfirm" class="inputtext" name="password_confirm" type="password" autocomplete="new-password" />
          <p v-show="showPwdNotMatchErr" class="message-error">兩次密碼不一致</p>
        </label>

        <div class="action-row">
          <button class="submit" type="submit" :disabled="submitting">{{ submitting ? '註冊中…' : '註冊' }}</button>
          <RouterLink class="signup" to="/login">已有帳號？去登入</RouterLink>
        </div>
      </form>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authAPI } from '../api';

const router = useRouter();
const route = useRoute();

const name = ref('Name');
const email = ref('email@example.com');
const password = ref('');
const passwordConfirm = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const submitting = ref(false);

const showPwdLenErr = ref(false);
const showPwdNotMatchErr = ref(false);

// ===== 強密碼規則檢查 =====
const vLen = computed(() => password.value.length >= 8 && password.value.length <= 12);
const vUpper = computed(() => /[A-Z]/.test(password.value));
const vLower = computed(() => /[a-z]/.test(password.value));
const vNumber = computed(() => /\d/.test(password.value));
const vSpecial = computed(() => /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?`~|\\]/.test(password.value));
const vNoWs = computed(() => !/\s/.test(password.value));
const vNotEmailLike = computed(() => {
  const pwd = (password.value || '').toLowerCase();
  const em = (email.value || '').toLowerCase();
  if (!em) return true;
  if (pwd === em) return false;
  const [local, domainAll] = em.split('@');
  const domain = (domainAll || '').split('.')[0] || '';
  const localOk = !local || local.length < 3 || !pwd.includes(local);
  const domainOk = !domain || domain.length < 3 || !pwd.includes(domain);
  return localOk && domainOk && !pwd.includes(em);
});
const strongOk = computed(() => vLen.value && vUpper.value && vLower.value && vNumber.value && vSpecial.value && vNoWs.value && vNotEmailLike.value);

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}

function oauth(provider: 'google' | 'facebook' | 'line') {
  if (provider === 'google') {
    const redirectUrl = typeof route.query.redirect === 'string' && route.query.redirect
      ? String(route.query.redirect)
      : '/member';
    const url = `/api/auth/oauth/google/start?redirectUrl=${encodeURIComponent(redirectUrl)}`;
    window.location.href = url;
    return;
  }
  // Facebook 與 Line 尚未完成，避免觸發
  errorMessage.value = provider === 'facebook'
    ? 'Facebook 登入尚未完成'
    : (provider === 'line' ? 'Line 登入尚未完成' : '不支援的登入方式');
}

async function onSubmit() {
  errorMessage.value = '';
  showPwdLenErr.value = false;
  showPwdNotMatchErr.value = false;

  if (!name.value) {
    errorMessage.value = '請輸入名稱';
    return;
  }
  if (!email.value) {
    errorMessage.value = '請輸入 Email';
    return;
  }
  if (!password.value) {
    errorMessage.value = '請輸入密碼';
    return;
  }
  // 強密碼提交攔截
  if (!strongOk.value) {
    errorMessage.value = '密碼未符合強度要求：8–12 碼，含大小寫、數字、特殊符號，不可含空白，且不可與 Email 相關。';
    return;
  }
  if (password.value !== passwordConfirm.value) {
    showPwdNotMatchErr.value = true;
    return;
  }

  try {
    submitting.value = true;
    const data = await authAPI.register({ 
      email: email.value, 
      password: password.value, 
      name: name.value 
    });

    if (data.success) {
      if (data.needsVerification) {
        // 顯示成功訊息並導向登入頁，登入後自動跳轉到驗證頁面
        successMessage.value = '註冊成功！請先登入以完成郵箱驗證。';
        setTimeout(() => {
          router.push({ 
            name: 'login', 
            query: { redirect: '/verify-email?auto=1' } 
          });
        }, 1500); // 1.5秒後跳轉
        return;
      }
      // 處理其他情況（如後端提供 redirectUrl）
      const qRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : undefined;
      if (data.redirectUrl) window.location.href = data.redirectUrl;
      else if (qRedirect) router.push(qRedirect);
      else router.push('/member');
      return;
    }

    errorMessage.value = data.message || '註冊失敗，請稍後再試';
  } catch (e: any) {
    const status = e?.response?.status;
    const err = e?.response?.data || {};
    if (status === 409 && err?.code === 'EMAIL_TAKEN') {
      errorMessage.value = 'Email 已被使用，請改用其他 Email 或前往登入';
    } else if (status === 422) {
      errorMessage.value = err?.message || '輸入資料驗證失敗';
    } else {
      errorMessage.value = err?.message || '網路或伺服器錯誤';
    }
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
  width: min(420px, 100%);
  max-width: 420px;
  min-height: 594px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.2);
  padding: 16px 16px 24px;
}
.dialog-titlebar { display: flex; justify-content: flex-end; }
.close-btn { background: transparent; border: none; font-size: 20px; cursor: pointer; }

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
.message-success { color: #28a745; font-size: 13px; margin: 0; }

@media (max-width: 600px) {
  .login-page {
    padding: 16px;
  }

  .login-dialog {
    min-height: auto;
    padding: 16px 16px 20px;
  }

  .action-row {
    flex-direction: column;
    align-items: stretch;
  }

  .submit {
    width: 100%;
  }

  .signup {
    text-align: center;
  }
}
</style>
