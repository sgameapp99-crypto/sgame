<template>
  <div class="login-page">
    <div class="login-dialog">
      <div class="dialog-titlebar">
        <button class="close-btn" @click="goBack" aria-label="close">×</button>
      </div>

      <div class="sep">
        <span>郵箱驗證</span>
        <hr />
      </div>

      <div class="login-form">
        <p v-if="errorMessage" class="message-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="message-success">{{ successMessage }}</p>

        <div class="field">
          <div>我們已向 <strong>{{ userEmail || '您的郵箱' }}</strong> 發送 6 位數驗證碼</div>
        </div>

        <form @submit.prevent="submitCode" style="display:flex; flex-direction:column; gap:12px;">
          <label class="field">
            <div>驗證碼</div>
            <input
              v-model="code"
              class="inputtext"
              name="verification_code"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="請輸入 6 位數驗證碼"
              @input="onCodeInput"
            />
          </label>

          <div class="action-row">
            <button class="submit" type="submit" :disabled="submitting || code.length !== 6">{{ submitting ? '驗證中…' : '驗證' }}</button>
            <button class="signup" type="button" @click="resend" :disabled="resendDisabled">
              {{ resendLabel }}
            </button>
          </div>
        </form>

        <div class="field" v-if="expiresIn > 0" style="color:#666; font-size: 13px;">
          驗證碼將在 {{ formatTime(expiresIn) }} 後過期
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSessionStore } from '../stores/session';
import api from '../api/client';

const router = useRouter();
const route = useRoute();
const session = useSessionStore();

const code = ref('');
const userEmail = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const submitting = ref(false);
const expiresIn = ref(0);
const cooldown = ref(0);
let expiresTimer: any = null;
let cooldownTimer: any = null;

function getLastSentTs(): number {
  try { return Number(localStorage.getItem('sg_last_verif_sent') || '0'); } catch { return 0; }
}
function setLastSentTs(ts: number) {
  try { localStorage.setItem('sg_last_verif_sent', String(ts)); } catch {}
}
function sentRecently(windowMs = 60_000): boolean {
  const last = getLastSentTs();
  return last > 0 && Date.now() - last < windowMs;
}

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}

function onCodeInput(e: Event) {
  const t = e.target as HTMLInputElement;
  t.value = t.value.replace(/\D/g, '').slice(0, 6);
  code.value = t.value;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

const resendDisabled = computed(() => cooldown.value > 0);
const resendLabel = computed(() => (cooldown.value > 0 ? `重新發送 (${cooldown.value}s)` : '重新發送'));

async function fetchStatus() {
  try {
    const res = await api.get('/auth/verification-status');
    const data = res.data || {};
    if (typeof data?.isVerified === 'boolean') {
      userEmail.value = data.email || '';
      if (data.isVerified) {
        router.replace('/member');
        return;
      }
    }
  } catch {}
}

async function sendCode() {
  try {
    errorMessage.value = '';
    successMessage.value = '';
    const res = await api.post('/auth/send-verification');
    const data = res.data || {};
    if (data?.success) {
      successMessage.value = '驗證碼已發送至您的郵箱';
      expiresIn.value = Number(data.expiresIn) || 300;
      startExpiresTimer();
      cooldown.value = 60;
      startCooldownTimer();
      setLastSentTs(Date.now());
    } else {
      errorMessage.value = data?.message || '發送失敗，請稍後再試';
    }
  } catch (e: any) {
    const status = e?.response?.status;
    const msg = e?.response?.data?.message;
    if (status === 401) {
      errorMessage.value = msg || '未登入或權杖無效，請先登入後再發送驗證碼';
      const redirect = route.fullPath;
      setTimeout(() => router.replace({ name: 'login', query: { redirect } }), 800);
    } else if (status === 429) {
      errorMessage.value = msg || '發送過於頻繁，請稍後再試';
      cooldown.value = Math.max(cooldown.value, 60);
      startCooldownTimer();
    } else {
      errorMessage.value = msg || '發送失敗，請稍後再試';
    }
  }
}

async function submitCode() {
  if (code.value.length !== 6) {
    errorMessage.value = '請輸入 6 位數驗證碼';
    return;
  }
  submitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const res = await api.post('/auth/verify-email', { code: code.value });
    const data = res.data || {};
    if (res.status === 200 && data?.success) {
      successMessage.value = data?.message || '郵箱驗證成功！';
      try {
        // 立即更新本地驗證狀態，避免路由守衛因 TTL 使用舊值而阻擋
        session.emailVerified = true as any;
        (session as any).verificationCheckedAt = Date.now();
      } catch {}
      router.replace('/member');
    } else {
      const c = data?.code;
      if (c === 'VERIFICATION_CODE_EXPIRED') errorMessage.value = '驗證碼已過期，請重新發送';
      else if (c === 'VERIFICATION_CODE_INVALID') errorMessage.value = '驗證碼錯誤，請重新輸入';
      else if (c === 'EMAIL_ALREADY_VERIFIED') {
        errorMessage.value = '郵箱已驗證，將前往會員頁';
        setTimeout(() => router.push('/member'), 800);
      } else errorMessage.value = data?.message || '驗證失敗，請稍後再試';
    }
  } catch (e: any) {
    const status = e?.response?.status;
    const msg = e?.response?.data?.message;
    if (status === 401) {
      errorMessage.value = msg || '未登入或權杖無效，請先登入後再驗證';
      const redirect = route.fullPath;
      setTimeout(() => router.replace({ name: 'login', query: { redirect } }), 800);
    } else {
      errorMessage.value = msg || '驗證失敗，請稍後再試';
    }
  } finally {
    submitting.value = false;
  }
}

async function resend() {
  if (cooldown.value > 0) return;
  // 重新發送前再次確認登入狀態，避免 401 觸發限速
  await session.fetchSession(true);
  if (!session.loggedIn) {
    const redirect = route.fullPath;
    router.replace({ name: 'login', query: { redirect } });
    return;
  }
  await sendCode();
}

function startExpiresTimer() {
  if (expiresTimer) clearInterval(expiresTimer);
  expiresTimer = setInterval(() => {
    if (expiresIn.value > 0) expiresIn.value--; else clearInterval(expiresTimer);
  }, 1000);
}

function startCooldownTimer() {
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    if (cooldown.value > 0) cooldown.value--; else clearInterval(cooldownTimer);
  }, 1000);
}

onMounted(async () => {
  // 僅在首次進入時強制刷新一次
  await session.fetchSession(true);
  if (!session.loggedIn) {
    // 若由註冊頁直接跳轉而尚未設置 Cookie，避免進入 401 循環；顯示提示並等待使用者點擊「重新發送」再導回登入
    errorMessage.value = '尚未登入，請先登入後完成驗證。';
    return;
  }
  await fetchStatus();
  // 僅在已登入且未驗證時自動發一次
  const v = await session.checkVerificationStatus(true).catch(() => undefined);
  const auto = typeof route.query.auto === 'string' ? route.query.auto : undefined;
  if (v === false && auto !== '0' && !sentRecently(60_000)) {
    await sendCode();
  }
});

onUnmounted(() => {
  if (expiresTimer) clearInterval(expiresTimer);
  if (cooldownTimer) clearInterval(cooldownTimer);
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
  min-height: 420px;
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
.action-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.submit { padding: 8px 14px; background: #095a8b; color: #fff; border: 0; border-radius: 4px; cursor: pointer; }
.signup { color: #0277bd; font-size: 14px; background: transparent; border: 0; cursor: pointer; }
.message-error { color: #dc3545; font-size: 13px; margin: 0; }
.message-success { color: #28a745; font-size: 13px; margin: 0; }
</style>


