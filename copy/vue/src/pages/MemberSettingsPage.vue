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
          <h2 class="section-title">顯示名稱</h2>
          <div class="name-box">
            <!-- 顯示模式 -->
            <div v-if="!isEditingName" class="name-display-mode">
              <div class="name-display-group">
                <label class="input-label">
                  <span>目前名稱</span>
                </label>
                <div class="name-display-value">
                  {{ displayName || '載入中...' }}
                </div>
              </div>
              <div class="name-actions">
                <button class="btn" @click="startEditName">
                  ✎ 編輯名稱
                </button>
              </div>
            </div>

            <!-- 編輯模式 -->
            <div v-else class="name-edit-mode">
              <div class="name-input-group">
                <label for="displayName" class="input-label">
                  <span>新名稱</span>
                  <small class="hint-text">2-10 字元，僅允許中文和英文字母</small>
                </label>
                <input
                  id="displayName"
                  ref="nameInput"
                  v-model.trim="editingName"
                  type="text"
                  class="inputtext"
                  placeholder="請輸入 2-10 個中英文字元"
                  maxlength="10"
                  :disabled="nameUpdating"
                  @input="validateNameInput"
                  @keyup.enter="updateDisplayName"
                  @keyup.esc="cancelEditName"
                />
                <div class="char-count" :class="{ 'warning': editingName.length < 2 || editingName.length > 10 }">
                  {{ editingName.length }}/10
                </div>
              </div>
              <div v-if="nameErrors.length > 0" class="error-messages">
                <p v-for="(error, index) in nameErrors" :key="index" class="error-text">{{ error }}</p>
              </div>
              <div class="name-actions">
                <button class="btn" :disabled="nameUpdating || nameErrors.length > 0 || !editingName" @click="updateDisplayName">
                  {{ nameUpdating ? '更新中…' : '✓ 確認更新' }}
                </button>
                <button class="btn-link" :disabled="nameUpdating" @click="cancelEditName">
                  ✗ 取消
                </button>
              </div>
              <p v-if="nameMessage" :class="{ 'ok': nameOk, 'err': !nameOk }">{{ nameMessage }}</p>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">安全性</h2>
          <div class="security-actions">
            <button class="btn secondary" @click="openRecover">重設密碼（透過郵件）</button>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">預測設定</h2>
          <div class="prediction-settings">
            <div v-if="predictionSettingsLoading" class="loading-state">
              載入中...
            </div>
            <div v-else-if="predictionSettingsError" class="error-state">
              {{ predictionSettingsError }}
              <button @click="loadPredictionSettings" class="btn-retry">重試</button>
            </div>
            <div v-else class="settings-form">
              <div class="form-group">
                <label for="defaultPrice" class="form-label">
                  <span>預設預測價格</span>
                  <small class="hint-text">建立預測時的預設彩幣價格（0 表示免費）</small>
                </label>
                <div class="input-with-suffix">
                  <input
                    id="defaultPrice"
                    v-model.number="predictionSettings.defaultPrice"
                    type="number"
                    class="inputtext"
                    placeholder="請輸入價格"
                    min="0"
                    max="10000"
                    step="10"
                    :disabled="savingSettings"
                  />
                  <span class="input-suffix">彩幣</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label checkbox-label">
                  <input
                    v-model="predictionSettings.allowPurchase"
                    type="checkbox"
                    :disabled="savingSettings"
                  />
                  <span>允許他人購買我的預測</span>
                </label>
                <small class="hint-text">關閉後，您的預測將不會在市場上顯示</small>
              </div>

              <div class="form-group">
                <label class="form-label checkbox-label">
                  <input
                    v-model="predictionSettings.autoPublish"
                    type="checkbox"
                    :disabled="savingSettings"
                  />
                  <span>自動公開預測</span>
                </label>
                <small class="hint-text">開啟後，建立預測時會自動公開給其他會員</small>
              </div>

              <div v-if="settingsMessage" :class="{ 'ok': settingsOk, 'err': !settingsOk }">
                {{ settingsMessage }}
              </div>

              <div class="form-actions">
                <button
                  @click="savePredictionSettings"
                  class="btn"
                  :disabled="savingSettings"
                >
                  {{ savingSettings ? '儲存中...' : '儲存設定' }}
                </button>
              </div>
            </div>
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

  <!-- 大頭貼上傳規範說明彈窗 -->
  <div v-if="showAvatarGuidelines" class="modal-mask" @click.self="cancelAvatarGuidelines">
    <div class="modal">
      <div class="modal-header">
        <h3>大頭貼上傳規範</h3>
        <button class="close-btn" @click="cancelAvatarGuidelines" aria-label="close">×</button>
      </div>
      <div class="modal-body">
        <div class="guidelines-content">
          <h4>請遵守以下規範：</h4>
          <ul class="guidelines-list">
            <li>請勿上傳裸露、血腥、暴力等不適宜的內容</li>
            <li>請勿上傳侵犯他人版權或肖像權的圖片</li>
            <li>請勿上傳含有仇恨、歧視或冒犯性內容的圖片</li>
            <li>建議使用清晰、正面的個人照片或合適的圖像</li>
          </ul>
          <div class="warning-box">
            <strong>違規處理：</strong>
            <p>若違反規定，我們可能會移除您的大頭貼。重複違規者可能會被暫時停權。</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="acceptAvatarGuidelines">我已了解並同意</button>
        <button class="btn-link" @click="cancelAvatarGuidelines">取消</button>
      </div>
    </div>
  </div>

  <!-- 名稱修改規範說明彈窗 -->
  <div v-if="showNameGuidelines" class="modal-mask" @click.self="cancelNameGuidelines">
    <div class="modal">
      <div class="modal-header">
        <h3>顯示名稱修改規範</h3>
        <button class="close-btn" @click="cancelNameGuidelines" aria-label="close">×</button>
      </div>
      <div class="modal-body">
        <div class="guidelines-content">
          <h4>請遵守以下規範：</h4>
          <ul class="guidelines-list">
            <li>名稱長度需為 2-10 個字元</li>
            <li>僅允許使用中文和英文字母</li>
            <li>請勿使用不雅、冒犯性或歧視性的名稱</li>
            <li>請勿冒用他人身份或使用誤導性名稱</li>
            <li>請勿使用廣告、推廣性質的名稱</li>
          </ul>
          <div class="warning-box">
            <strong>違規處理：</strong>
            <p>若違反規定，我們可能會強制修改您的名稱。重複違規者可能會被暫時停權。</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="acceptNameGuidelines">我已了解並同意</button>
        <button class="btn-link" @click="cancelNameGuidelines">取消</button>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { api, authAPI, memberAPI, predictionsAPI } from '../api';
import { useSessionStore } from '../stores/session';
import { validateName } from '../utils/nameValidation';

const router = useRouter();
const session = useSessionStore();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const avatarPreview = ref<string>('');
const defaultBlackAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23000"/></svg>';
const uploading = ref(false);
const avatarMessage = ref('');
const avatarOk = ref(false);
// 大頭貼規範說明彈窗
const showAvatarGuidelines = ref(false);
const pendingFile = ref<File | null>(null);
// 名稱修改相關
const displayName = ref('');
const editingName = ref('');
const isEditingName = ref(false);
const nameInput = ref<HTMLInputElement | null>(null);
const nameUpdating = ref(false);
const nameMessage = ref('');
const nameOk = ref(false);
const nameErrors = ref<string[]>([]);
// 名稱規範說明彈窗
const showNameGuidelines = ref(false);
// 忘記密碼彈窗
const showRecover = ref(false);
const recoverEmail = ref('');
const recoverSubmitting = ref(false);
const recoverError = ref('');
const recoverSuccess = ref('');
// 預測設定相關
const predictionSettingsLoading = ref(false);
const predictionSettingsError = ref('');
const predictionSettings = ref({
  defaultPrice: 100,
  allowPurchase: true,
  autoPublish: true,
});
const savingSettings = ref(false);
const settingsMessage = ref('');
const settingsOk = ref(false);

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
    const data = await authAPI.forgotPassword({ email: recoverEmail.value });
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
  const file = files && files[0] ? files[0] : null;
  
  if (file) {
    // 暫存檔案，等待用戶同意規範後再處理
    pendingFile.value = file;
    avatarMessage.value = '';
    avatarOk.value = false;
    // 彈出規範說明視窗
    showAvatarGuidelines.value = true;
  }
}

/**
 * 同意大頭貼上傳規範
 */
function acceptAvatarGuidelines() {
  if (pendingFile.value) {
    // 將暫存檔案賦值給 selectedFile
    selectedFile.value = pendingFile.value;
    // 生成預覽圖
    const url = URL.createObjectURL(pendingFile.value);
    avatarPreview.value = url;
  }
  // 關閉彈窗並清空暫存
  showAvatarGuidelines.value = false;
  pendingFile.value = null;
}

/**
 * 取消大頭貼上傳
 */
function cancelAvatarGuidelines() {
  // 關閉彈窗
  showAvatarGuidelines.value = false;
  // 清空暫存檔案
  pendingFile.value = null;
  // 清空檔案輸入框
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  // 重置相關狀態
  avatarMessage.value = '';
  avatarOk.value = false;
}

async function uploadAvatar() {
  if (!selectedFile.value) return;
  try {
    uploading.value = true;
    avatarMessage.value = '';
    avatarOk.value = false;
    const data = await memberAPI.uploadAvatar(selectedFile.value);
    avatarMessage.value = '大頭貼已更新';
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

/**
 * 開始編輯名稱（彈出規範說明）
 */
function startEditName() {
  // 先彈出規範說明視窗
  showNameGuidelines.value = true;
}

/**
 * 同意名稱修改規範
 */
async function acceptNameGuidelines() {
  // 關閉規範彈窗
  showNameGuidelines.value = false;
  
  // 執行原本 startEditName 的邏輯
  isEditingName.value = true;
  editingName.value = displayName.value;
  nameErrors.value = [];
  nameMessage.value = '';
  nameOk.value = false;
  
  // 使用 nextTick 確保 input 已經渲染後再聚焦
  await nextTick();
  nameInput.value?.focus();
}

/**
 * 取消名稱修改
 */
function cancelNameGuidelines() {
  // 關閉彈窗，不進入編輯模式
  showNameGuidelines.value = false;
}

/**
 * 取消編輯名稱
 */
function cancelEditName() {
  isEditingName.value = false;
  editingName.value = '';
  nameErrors.value = [];
  nameMessage.value = '';
  nameOk.value = false;
}

/**
 * 即時驗證輸入的名稱
 */
function validateNameInput() {
  if (editingName.value) {
    nameErrors.value = validateName(editingName.value);
  } else {
    nameErrors.value = [];
  }
  // 清除舊訊息
  nameMessage.value = '';
  nameOk.value = false;
}

/**
 * 更新顯示名稱
 */
async function updateDisplayName() {
  // 前端驗證
  const validationErrors = validateName(editingName.value);
  if (validationErrors.length > 0) {
    nameErrors.value = validationErrors;
    return;
  }

  try {
    nameUpdating.value = true;
    nameMessage.value = '';
    nameOk.value = false;
    nameErrors.value = [];

    const data = await memberAPI.updateName(editingName.value);
    
    if (data.success) {
      // 更新顯示的名稱
      displayName.value = data.name;
      
      nameMessage.value = `名稱已更新為：${data.name}`;
      nameOk.value = true;
      
      // 廣播事件通知其他組件名稱已更新
      const evt = new CustomEvent('name-updated', { 
        detail: { name: data.name, updatedAt: data.updatedAt } 
      });
      window.dispatchEvent(evt);
      
      // 更新 session 中的用戶資料
      try { 
        await session.ensureProfile(); 
      } catch {}
      
      // 延遲關閉編輯模式，讓使用者看到成功訊息
      setTimeout(() => {
        isEditingName.value = false;
        editingName.value = '';
        nameMessage.value = '';
        nameOk.value = false;
      }, 1500);
    }
  } catch (e: any) {
    const status = e?.response?.status;
    const code = e?.response?.data?.code;
    const errors = e?.response?.data?.errors;
    const message = e?.response?.data?.message;
    
    if (errors && Array.isArray(errors)) {
      // 後端返回的驗證錯誤陣列
      nameErrors.value = errors;
    } else if (message) {
      nameMessage.value = message;
      nameOk.value = false;
    } else {
      // 根據狀態碼顯示相應錯誤
      if (status === 401) {
        nameMessage.value = '尚未登入，請重新登入後再試';
      } else if (status === 422 || code === 'NAME_INVALID') {
        nameMessage.value = '名稱格式不正確，請檢查輸入';
      } else {
        nameMessage.value = '更新失敗，請稍後再試';
      }
      nameOk.value = false;
    }
  } finally {
    nameUpdating.value = false;
  }
}

/**
 * 載入預測設定
 */
async function loadPredictionSettings() {
  predictionSettingsLoading.value = true;
  predictionSettingsError.value = '';
  
  try {
    const data = await predictionsAPI.getPredictionSettings();
    if (data.success && data.settings) {
      predictionSettings.value = data.settings;
    }
  } catch (e: any) {
    predictionSettingsError.value = e?.response?.data?.message || '載入預測設定失敗';
  } finally {
    predictionSettingsLoading.value = false;
  }
}

/**
 * 儲存預測設定
 */
async function savePredictionSettings() {
  savingSettings.value = true;
  settingsMessage.value = '';
  settingsOk.value = false;
  
  try {
    const data = await predictionsAPI.updatePredictionSettings(predictionSettings.value);
    
    if (data.success) {
      settingsMessage.value = '設定已儲存';
      settingsOk.value = true;
      
      // 1.5 秒後清除訊息
      setTimeout(() => {
        settingsMessage.value = '';
        settingsOk.value = false;
      }, 1500);
    }
  } catch (e: any) {
    settingsMessage.value = e?.response?.data?.message || '儲存失敗，請稍後再試';
    settingsOk.value = false;
  } finally {
    savingSettings.value = false;
  }
}

// 初次進入時強制刷新 Session/個資並破快取顯示最新頭像
onMounted(async () => {
  try {
    await session.fetchSession(true);
    await session.ensureProfile();
    // 以 members profile 取得頭像和名稱（session.user 未含 avatar）
    const uid = session.userId || (session.user?.id as any);
    if (uid) {
      try {
        const r = await api.get(`/members/${encodeURIComponent(String(uid))}/profile`);
        const p = r.data?.profile || r.data || {};
        const url = p?.avatar || p?.avatarUrl;
        if (url) avatarPreview.value = `${url}?v=${Date.now()}`;
        // 載入當前名稱
        if (p?.name) displayName.value = p.name;
      } catch {}
    }
  } catch {}

  // 載入預測設定
  loadPredictionSettings();

  // 監聽 avatar 更新事件（來自其他頁）
  const avatarHandler = (e: Event) => {
    const ce = e as CustomEvent;
    if (ce.detail?.url) {
      const ts = new Date(ce.detail?.updatedAt || Date.now()).getTime();
      avatarPreview.value = `${ce.detail.url}?v=${ts}`;
    }
  };
  window.addEventListener('avatar-updated', avatarHandler);
  
  // 監聽名稱更新事件（來自其他頁）
  const nameHandler = (e: Event) => {
    const ce = e as CustomEvent;
    if (ce.detail?.name) {
      displayName.value = ce.detail.name;
    }
  };
  window.addEventListener('name-updated', nameHandler);
  
  // 保存以便卸載
  (window as any)._ms_avatar_handler = avatarHandler;
  (window as any)._ms_name_handler = nameHandler;
});

onUnmounted(() => {
  const avatarHandler = (window as any)._ms_avatar_handler;
  if (avatarHandler) window.removeEventListener('avatar-updated', avatarHandler);
  
  const nameHandler = (window as any)._ms_name_handler;
  if (nameHandler) window.removeEventListener('name-updated', nameHandler);
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

/* 名稱修改區塊 */
.name-box { display: flex; flex-direction: column; gap: 10px; }

/* 顯示模式 */
.name-display-mode { display: flex; flex-direction: column; gap: 12px; }
.name-display-group { display: flex; flex-direction: column; gap: 6px; }
.name-display-value { 
  padding: 10px 12px; 
  background: #f8f9fa; 
  border: 1px solid #e0e0e0; 
  border-radius: 4px; 
  color: #333; 
  font-size: 14px;
  font-weight: 500;
  min-height: 38px;
  display: flex;
  align-items: center;
}

/* 編輯模式 */
.name-edit-mode { display: flex; flex-direction: column; gap: 10px; }
.name-input-group { display: flex; flex-direction: column; gap: 6px; position: relative; }
.input-label { display: flex; flex-direction: column; gap: 4px; font-weight: 500; color: #333; }
.input-label span { font-size: 14px; }
.hint-text { color: #666; font-size: 12px; font-weight: normal; }
.char-count { position: absolute; top: 34px; right: 10px; font-size: 12px; color: #999; pointer-events: none; }
.char-count.warning { color: #dc3545; font-weight: bold; }
.error-messages { display: flex; flex-direction: column; gap: 4px; }
.error-text { color: #dc3545; font-size: 13px; margin: 0; }
.name-actions { display: flex; gap: 10px; align-items: center; }

/* 預測設定區塊 */
.prediction-settings { display: flex; flex-direction: column; gap: 12px; }
.loading-state, .error-state { padding: 12px; background: #f8f9fa; border-radius: 4px; color: #666; font-size: 14px; }
.error-state { background: #fff3f3; color: #d32f2f; display: flex; align-items: center; gap: 8px; }
.btn-retry { padding: 4px 8px; background: #dc3545; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; }
.btn-retry:hover { background: #c62828; }
.settings-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { display: flex; flex-direction: column; gap: 4px; font-weight: 500; color: #333; font-size: 14px; }
.form-label.checkbox-label { flex-direction: row; align-items: center; gap: 8px; }
.form-label.checkbox-label input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
.input-with-suffix { position: relative; display: flex; align-items: center; }
.input-suffix { position: absolute; right: 12px; color: #999; font-size: 13px; pointer-events: none; }
.form-actions { display: flex; gap: 10px; align-items: center; padding-top: 8px; }

/* 規範說明彈窗專屬樣式 */
.guidelines-content { display: flex; flex-direction: column; gap: 16px; }
.guidelines-content h4 { margin: 0; font-size: 16px; color: #333; font-weight: 600; }
.guidelines-list { margin: 0; padding-left: 24px; display: flex; flex-direction: column; gap: 8px; }
.guidelines-list li { color: #555; font-size: 14px; line-height: 1.6; }
.warning-box { background: #fff9e6; border: 1px solid #ffe066; border-radius: 4px; padding: 12px; }
.warning-box strong { display: block; color: #d97706; font-size: 14px; margin-bottom: 6px; }
.warning-box p { margin: 0; color: #666; font-size: 13px; line-height: 1.5; }

@media (max-width: 768px) {
  .settings-container { padding: 10px; }
  .settings-card { padding: 16px; }
  .avatar-box { grid-template-columns: 64px 1fr; }
  .avatar { width: 64px; height: 64px; border-width: 2px; }
}
</style>


