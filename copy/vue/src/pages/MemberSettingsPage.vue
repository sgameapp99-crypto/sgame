<template>
  <div class="member-page">
    <div class="settings-container">
      <div class="settings-card">
        <div class="settings-header">
          <h1>帳戶設定</h1>
          <button class="btn-link" @click="goBack" aria-label="back">返回</button>
        </div>

        <section class="section">
          <h2 class="section-title">大頭貼</h2>
          <div class="avatar-box">
            <img :src="avatarPreview || defaultBlackAvatar" alt="avatar" class="avatar" />
            <div class="avatar-actions">
              <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" />
              <button class="btn" :disabled="uploading || !selectedFile" @click="uploadAvatar">{{ uploading ? '上傳中…' : '上傳大頭貼' }}</button>
            </div>
            <p v-if="avatarMessage" :class="{ 'ok': avatarOk, 'err': !avatarOk }">{{ avatarMessage }}</p>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">安全性</h2>
          <div class="security-actions">
            <button class="btn secondary" @click="openRecover">重設密碼（透過郵件）</button>
          </div>
        </section>
      </div>
    </div>
  </div>

  <!-- 忘記密碼（內嵌彈窗） -->
  <div v-if="showRecover" class="modal-mask" @click.self="closeRecover">
    <div class="modal">
      <div class="modal-header">
        <h3>重設密碼</h3>
        <button class="close-btn" @click="closeRecover" aria-label="close">×</button>
      </div>
      <div class="modal-body">
        <p class="hint">請輸入您的 Email，我們會寄送重設密碼郵件。</p>
        <label class="field">
          <div>Email</div>
          <input v-model.trim="recoverEmail" class="inputtext" type="email" placeholder="name@example.com" />
        </label>
        <p v-if="recoverError" class="message-error">{{ recoverError }}</p>
        <p v-if="recoverSuccess" class="message-success">{{ recoverSuccess }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn" :disabled="recoverSubmitting" @click="submitRecover">{{ recoverSubmitting ? '送出中…' : '寄送重設郵件' }}</button>
        <button class="btn-link" @click="closeRecover">取消</button>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/client';
import { useSessionStore } from '../stores/session';

const router = useRouter();
const session = useSessionStore();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const avatarPreview = ref<string>('');
const defaultBlackAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23000"/></svg>';
const uploading = ref(false);
const avatarMessage = ref('');
const avatarOk = ref(false);
// 忘記密碼彈窗
const showRecover = ref(false);
const recoverEmail = ref('');
const recoverSubmitting = ref(false);
const recoverError = ref('');
const recoverSuccess = ref('');

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}

function openRecover() {
  recoverError.value = '';
  recoverSuccess.value = '';
  // 已登入則預填 email（若可得）
  recoverEmail.value = (session.user as any)?.email || recoverEmail.value || '';
  showRecover.value = true;
}
function closeRecover() {
  showRecover.value = false;
}
async function submitRecover() {
  recoverError.value = '';
  recoverSuccess.value = '';
  if (!recoverEmail.value) { recoverError.value = '請輸入 Email'; return; }
  try {
    recoverSubmitting.value = true;
    const res = await api.post('/auth/forgot-password', { email: recoverEmail.value });
    const data = res.data || {};
    recoverSuccess.value = data?.message || '密碼重設郵件已發送，請查收';
  } catch (e: any) {
    const code = e?.response?.data?.code;
    const msg = e?.response?.data?.message;
    if (code === 'RATE_LIMIT_EXCEEDED') recoverError.value = msg || '操作過於頻繁，請稍後再試';
    else if (code === 'OAUTH_USER') recoverError.value = msg || '此帳號為第三方登入，無需重設密碼';
    else recoverError.value = msg || '發送失敗，請稍後再試';
  } finally {
    recoverSubmitting.value = false;
  }
}

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  selectedFile.value = files && files[0] ? files[0] : null;
  avatarMessage.value = '';
  avatarOk.value = false;
  if (selectedFile.value) {
    const url = URL.createObjectURL(selectedFile.value);
    avatarPreview.value = url;
  }
}

async function uploadAvatar() {
  if (!selectedFile.value) return;
  try {
    uploading.value = true;
    avatarMessage.value = '';
    avatarOk.value = false;
    const form = new FormData();
    form.append('file', selectedFile.value);
    const res = await api.post('/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    const data = res.data || {};
    avatarMessage.value = data?.message || '大頭貼已更新';
    avatarOk.value = true;
    // 廣播事件給會員頁即時刷新頭像
    const evt = new CustomEvent('avatar-updated', { detail: { url: data?.url, updatedAt: data?.updatedAt } });
    window.dispatchEvent(evt);
    // 立即更新本頁預覽並刷新個人資料避免快取
    if (data?.url) {
      const ts = new Date(data?.updatedAt || Date.now()).getTime();
      avatarPreview.value = `${data.url}?v=${ts}`;
    }
    try { await session.ensureProfile(); } catch {}
  } catch (e: any) {
    const status = e?.response?.status;
    const code = e?.response?.data?.code;
    let msg = e?.response?.data?.message as string | undefined;
    if (!msg) {
      if (status === 413 || code === 'AVATAR_FILE_TOO_LARGE') {
        msg = '檔案過大（上限 5MB）';
      } else if (status === 415 || code === 'AVATAR_FILE_INVALID') {
        msg = '檔案格式不支援（僅限 jpeg/png/webp）';
      } else if (status === 401) {
        msg = '尚未登入，請重新登入後再試';
      } else if (status === 500 || code === 'AVATAR_UPLOAD_FAILED') {
        msg = '伺服器處理上傳失敗，請稍後再試';
      } else {
        msg = '上傳失敗，請稍後再試';
      }
    }
    avatarMessage.value = msg;
    avatarOk.value = false;
  } finally {
    uploading.value = false;
  }
}

// 初次進入時強制刷新 Session/個資並破快取顯示最新頭像
onMounted(async () => {
  try {
    await session.fetchSession(true);
    await session.ensureProfile();
    // 以 members profile 取得頭像（session.user 未含 avatar）
    const uid = session.userId || (session.user?.id as any);
    if (uid) {
      try {
        const r = await api.get(`/members/${encodeURIComponent(String(uid))}/profile`);
        const p = r.data || {};
        const url = p?.avatar;
        if (url) avatarPreview.value = `${url}?v=${Date.now()}`;
      } catch {}
    }
  } catch {}

  // 監聽 avatar 更新事件（來自其他頁）
  const handler = (e: Event) => {
    const ce = e as CustomEvent;
    if (ce.detail?.url) {
      const ts = new Date(ce.detail?.updatedAt || Date.now()).getTime();
      avatarPreview.value = `${ce.detail.url}?v=${ts}`;
    }
  };
  window.addEventListener('avatar-updated', handler);
  // 保存以便卸載
  (window as any)._ms_avatar_handler = handler;
});

onUnmounted(() => {
  const handler = (window as any)._ms_avatar_handler;
  if (handler) window.removeEventListener('avatar-updated', handler);
});
</script>

<style scoped>
.member-page { min-height: 100vh; background: #f5f5f5; font-family: "微軟正黑體", "Microsoft JhengHei", "新細明體", PMingLiU, Arial, Helvetica, sans-serif; }
.settings-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.settings-card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.settings-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 12px; margin-bottom: 16px; }
.settings-header h1 { margin: 0; color: #333; font-size: 24px; }
.btn-link { background: transparent; border: 0; color: #667eea; cursor: pointer; }

.section { margin-bottom: 18px; }
.section-title { margin: 0 0 8px 0; font-size: 18px; color: #2e6da4; }
.avatar-box { display: grid; grid-template-columns: 80px 1fr; gap: 12px; align-items: center; }
.avatar { width: 80px; height: 80px; border-radius: 50%; border: 3px solid #667eea; object-fit: cover; }
.avatar-actions { display: flex; align-items: center; gap: 10px; }
.security-actions { display: flex; gap: 10px; }

.btn { padding: 8px 12px; background: #667eea; color: #fff; border: 0; border-radius: 4px; cursor: pointer; transition: background .2s ease; }
.btn:hover { background: #5a6fd8; }
.btn.secondary { background: #095a8b; }
.btn.secondary:hover { background: #074564; }
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 50; }
.modal { width: 420px; background: #fff; border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e0e0e0; }
.modal-body { padding: 12px 16px; }
.modal-footer { display: flex; gap: 10px; padding: 12px 16px; border-top: 1px solid #e0e0e0; }
.hint { color: #666; font-size: 13px; margin: 0 0 8px 0; }
.field { display: block; margin-bottom: 10px; }
.inputtext { width: 100%; height: 36px; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; }
.message-error { color: #dc3545; font-size: 13px; margin: 0; }
.message-success { color: #28a745; font-size: 13px; margin: 0; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.ok { color: #28a745; font-size: 13px; margin: 6px 0 0; grid-column: 1 / -1; }
.err { color: #dc3545; font-size: 13px; margin: 6px 0 0; grid-column: 1 / -1; }

@media (max-width: 768px) {
  .settings-container { padding: 10px; }
  .settings-card { padding: 16px; }
  .avatar-box { grid-template-columns: 64px 1fr; }
  .avatar { width: 64px; height: 64px; border-width: 2px; }
}
</style>


