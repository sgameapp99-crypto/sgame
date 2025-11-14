<template>
  <div class="login-page">
    <div class="login-dialog">
      <div class="dialog-titlebar">
        <button class="close-btn" @click="goBack" aria-label="close">×</button>
      </div>

      <div class="sep">
        <span>忘記密碼</span>
        <hr />
      </div>

      <form class="login-form" @submit.prevent="onSubmit">
        <p v-if="errorMessage" class="message-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="message-success">{{ successMessage }}</p>

        <label class="field" for="forgotEmail">
          <div id="forgotEmailLabel">Email</div>
          <input
            id="forgotEmail"
            v-model.trim="email"
            class="inputtext"
            name="email"
            type="email"
            autocomplete="email"
            aria-labelledby="forgotEmailLabel"
          />
        </label>

        <div class="action-row">
          <button class="submit" type="submit" :disabled="submitting">{{ submitting ? '送出中…' : '寄送重設密碼信' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/client';

const router = useRouter();
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const submitting = ref(false);

function goBack() { if (window.history.length > 1) router.back(); else router.push('/'); }

async function onSubmit() {
  errorMessage.value = '';
  successMessage.value = '';
  if (!email.value) { errorMessage.value = '請輸入 Email'; return; }
  try {
    submitting.value = true;
    const res = await api.post('/auth/forgot-password', { email: email.value });
    const data = res.data || {};
    successMessage.value = data?.message || '已寄出重設密碼信，請查收郵箱';
  } catch (e: any) { errorMessage.value = e?.response?.data?.message || '網路或伺服器錯誤'; }
  finally { submitting.value = false; }
}
</script>

<style scoped>
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.35); padding: 24px; }
.login-dialog { width: 386px; min-height: 360px; background: #fff; border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.2); padding: 16px 16px 24px; }
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
</style>


