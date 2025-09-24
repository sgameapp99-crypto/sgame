<template>
  <div class="login-page">
    <div class="login-dialog">
      <div class="dialog-titlebar">
        <button class="close-btn" @click="goBack" aria-label="close">×</button>
      </div>

      <div class="sep">
        <span>變更密碼</span>
        <hr />
      </div>

      <form class="login-form" @submit.prevent="onSubmit">
        <p v-if="errorMessage" class="message-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="message-success">{{ successMessage }}</p>

        <label class="field">
          <div>目前密碼</div>
          <input v-model="oldPassword" class="inputtext" type="password" autocomplete="current-password" />
        </label>

        <label class="field">
          <div>新密碼</div>
          <input v-model="newPassword" class="inputtext" type="password" autocomplete="new-password" />
          <div class="pwd-rules">
            <div class="rule" :class="{ ok: vLen, bad: newPassword.length>0 && !vLen }">8–12 碼</div>
            <div class="rule" :class="{ ok: vUpper, bad: newPassword.length>0 && !vUpper }">至少 1 個大寫字母</div>
            <div class="rule" :class="{ ok: vLower, bad: newPassword.length>0 && !vLower }">至少 1 個小寫字母</div>
            <div class="rule" :class="{ ok: vNumber, bad: newPassword.length>0 && !vNumber }">至少 1 個數字</div>
            <div class="rule" :class="{ ok: vSpecial, bad: newPassword.length>0 && !vSpecial }">至少 1 個特殊符號（!@#$%^&* 等）</div>
            <div class="rule" :class="{ ok: vNoWs, bad: newPassword.length>0 && !vNoWs }">不可含空白</div>
            <div class="rule" :class="{ ok: vNotEmailLike, bad: newPassword.length>0 && !vNotEmailLike }">不可與 Email 相同或包含 Email 主要片段</div>
          </div>
        </label>

        <label class="field">
          <div>確認新密碼</div>
          <input v-model="newPassword2" class="inputtext" type="password" autocomplete="new-password" />
          <p v-show="showPwdNotMatchErr" class="message-error">兩次密碼不一致</p>
        </label>

        <div class="action-row">
          <button class="submit" type="submit" :disabled="submitting">{{ submitting ? '送出中…' : '更新密碼' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';
import api from '../api/client';

const router = useRouter();
const session = useSessionStore();

const oldPassword = ref('');
const newPassword = ref('');
const newPassword2 = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const submitting = ref(false);
const showPwdNotMatchErr = ref(false);

// 取 email 供密碼規則檢查
const email = computed(() => session.user?.email || '');

// 強密碼規則（與註冊一致）
const vLen = computed(() => newPassword.value.length >= 8 && newPassword.value.length <= 12);
const vUpper = computed(() => /[A-Z]/.test(newPassword.value));
const vLower = computed(() => /[a-z]/.test(newPassword.value));
const vNumber = computed(() => /\d/.test(newPassword.value));
const vSpecial = computed(() => /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?`~|\\]/.test(newPassword.value));
const vNoWs = computed(() => !/\s/.test(newPassword.value));
const vNotEmailLike = computed(() => {
  const pwd = (newPassword.value || '').toLowerCase();
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

async function onSubmit() {
  errorMessage.value = '';
  successMessage.value = '';
  showPwdNotMatchErr.value = false;

  if (!oldPassword.value) { errorMessage.value = '請輸入目前密碼'; return; }
  if (!newPassword.value) { errorMessage.value = '請輸入新密碼'; return; }
  if (!strongOk.value) { errorMessage.value = '新密碼未符合強度要求'; return; }
  if (newPassword.value !== newPassword2.value) { showPwdNotMatchErr.value = true; return; }

  try {
    submitting.value = true;
    const res = await api.post('/auth/change-password', { currentPassword: oldPassword.value, newPassword: newPassword.value });
    const data = res.data || {};
    successMessage.value = data?.message || '密碼更新成功';
    oldPassword.value = '';
    newPassword.value = '';
    newPassword2.value = '';
  } catch {
    errorMessage.value = '網路或伺服器錯誤';
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  await session.fetchSession(true);
  if (!session.loggedIn) {
    router.replace({ name: 'login', query: { redirect: '/password/change' } });
  }
});
</script>

<style scoped>
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.35); padding: 24px; }
.login-dialog { width: 386px; min-height: 420px; background: #fff; border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.2); padding: 16px 16px 24px; }
.dialog-titlebar { display: flex; justify-content: flex-end; }
.close-btn { background: transparent; border: none; font-size: 20px; cursor: pointer; }
.sep { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 8px; margin: 12px 0; color: #999; }
.sep hr { border: 0; border-top: 1px solid #e0e0e0; }
.login-form { display: flex; flex-direction: column; gap: 12px; }
.field { display: block; }
.inputtext { width: 100%; height: 36px; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; }
.action-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.submit { padding: 8px 14px; background: #095a8b; color: #fff; border: 0; border-radius: 4px; cursor: pointer; }
.message-error { color: #dc3545; font-size: 13px; margin: 0; }
.message-success { color: #28a745; font-size: 13px; margin: 0; }
.pwd-rules { display: grid; grid-template-columns: 1fr; gap: 4px; margin-top: 6px; font-size: 12px; }
.pwd-rules .rule { color: #666; }
.pwd-rules .rule.ok { color: #28a745; }
.pwd-rules .rule.bad { color: #dc3545; }
</style>


