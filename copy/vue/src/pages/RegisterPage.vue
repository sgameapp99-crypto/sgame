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

      <form class="login-form" @submit.prevent="onSubmit">
        <p v-if="errorMessage" class="message-error">{{ errorMessage }}</p>

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

const router = useRouter();
const route = useRoute();

const name = ref('Demo');
const email = ref('user+demo@example.com');
const password = ref('password123');
const passwordConfirm = ref('password123');
const errorMessage = ref('');
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
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'include',
      body: JSON.stringify({ email: email.value, password: password.value, name: name.value })
    });

    if (res.status === 201 || res.status === 200) {
      let redirectUrl: string | undefined;
      let needsVerification = false;
      try {
        const data = await res.json();
        redirectUrl = data?.redirectUrl;
        needsVerification = !!data?.needsVerification;
      } catch {}
      if (needsVerification) {
        // 確認是否已建立登入會話，若尚未登入則導至登入頁再回到驗證頁，避免驗證頁 401 造成重導循環
        try {
          const sres = await fetch('/api/auth/session', { credentials: 'include' });
          const sdata = await sres.json().catch(() => ({}));
          if (sdata?.loggedIn) {
            router.push('/verify-email');
          } else {
            router.push({ name: 'login', query: { redirect: '/verify-email' } });
          }
        } catch {
          router.push({ name: 'login', query: { redirect: '/verify-email' } });
        }
        return;
      }
      const qRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : undefined;
      if (redirectUrl) window.location.href = redirectUrl;
      else if (qRedirect) router.push(qRedirect);
      else router.push('/member');
      return;
    }

    const err = await res.json().catch(() => ({}));
    if (res.status === 409 && err?.code === 'EMAIL_TAKEN') {
      errorMessage.value = 'Email 已被使用，請改用其他 Email 或前往登入';
      return;
    }
    if (res.status === 422) {
      errorMessage.value = err?.message || '輸入資料驗證失敗';
      return;
    }
    errorMessage.value = err?.message || '註冊失敗，請稍後再試';
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
