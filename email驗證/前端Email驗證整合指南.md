# 📧 前端 Email 驗證系統整合指南

## 🎯 概述

後端已實作完整的 Email 驗證系統，並已更新 API 規格文件。前端需要配合實作以下功能：
- Email 驗證狀態檢查
- 驗證碼輸入界面
- 重新發送驗證碼功能
- 驗證成功/失敗處理

## 📚 API 規格文件

完整的 API 規格已更新到：
- **OpenAPI 規格**：`/api/openapi.yaml`
- **API 說明文件**：`/api/API-SPEC.md`
- **API 測試清單**：`/api/API-Check.md`

所有 Email 驗證相關的端點、回應格式、錯誤碼都已標準化。

---

## 🔧 完整的認證 API 端點

### 📋 已存在的 API 端點（無修改）

#### 1. 用戶註冊（**已更新回應格式**）
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "用戶名稱",
  "phone": "0912345678",  // 可選
  "redirectUrl": "/member"  // 可選
}
```

**成功回應（201）：**
```json
{
  "redirectUrl": "/member",
  "message": "註冊成功！請檢查您的郵箱並完成驗證",
  "needsVerification": true  // 新增：需要驗證標記
}
```

**錯誤回應：**
- `409`：Email 已被使用
- `422`：參數驗證錯誤

#### 2. 用戶登入
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功回應（200）：**
```json
{
  "redirectUrl": "/member"
}
```

#### 3. 用戶登出
```javascript
POST /api/auth/logout
```

**成功回應（204）：** 無內容

#### 4. 檢查登入狀態
```javascript
GET /api/auth/session
```

**成功回應（200）：**
```json
{
  "loggedIn": true,
  "userId": "user123",
  "email": "user@example.com",
  "expiresAt": "2025-01-20T10:00:00Z"
}
```

#### 5. Google OAuth 登入
```javascript
GET /api/auth/oauth/google/start?redirectUrl=/member
```

**回應：** 302 重定向到 Google 授權頁面

#### 6. Google OAuth 回調
```javascript
GET /api/auth/oauth/google/callback?code=...&state=...
```

**回應：** 302 重定向到 `redirectUrl` 或錯誤頁面

#### 7. Facebook OAuth 登入
```javascript
GET /api/auth/oauth/facebook/start?redirectUrl=/member
```

**回應：** 302 重定向到 Facebook 授權頁面

#### 8. Facebook OAuth 回調
```javascript
GET /api/auth/oauth/facebook/callback?code=...&state=...
```

**回應：** 302 重定向到 `redirectUrl` 或錯誤頁面

---

## 🔧 新增的 Email 驗證 API 端點

### 1. 檢查驗證狀態
```javascript
GET /api/auth/verification-status
Authorization: Bearer <token>
```

**成功回應（200）：**
```json
{
  "success": true,
  "isVerified": false,
  "email": "user@example.com"
}
```

**錯誤回應：**
- `401`：未授權（需要登入）

### 2. 發送驗證碼
```javascript
POST /api/auth/send-verification
Authorization: Bearer <token>
```

**成功回應（200）：**
```json
{
  "success": true,
  "message": "驗證碼已發送至您的郵箱",
  "expiresIn": 300
}
```

**錯誤回應：**
- `400`：發送失敗
- `401`：未授權

### 3. 驗證郵箱
```javascript
POST /api/auth/verify-email
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123456"
}
```

**成功回應（200）：**
```json
{
  "success": true,
  "message": "郵箱驗證成功！"
}
```

**錯誤回應（400）：**
```json
{
  "success": false,
  "message": "驗證碼已過期",
  "code": "VERIFICATION_CODE_EXPIRED"
}
```

**可能的錯誤碼：**
- `VERIFICATION_CODE_EXPIRED`：驗證碼已過期
- `VERIFICATION_CODE_INVALID`：驗證碼錯誤
- `EMAIL_ALREADY_VERIFIED`：郵箱已驗證

### 4. 重新發送驗證碼
```javascript
POST /api/auth/resend-verification
Authorization: Bearer <token>
```

**成功回應（200）：**
```json
{
  "success": true,
  "message": "驗證碼已重新發送",
  "expiresIn": 300
}
```

**錯誤回應（400）：**
```json
{
  "success": false,
  "message": "請等待 1 分鐘後再重新發送",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

**可能的錯誤碼：**
- `RATE_LIMIT_EXCEEDED`：發送過於頻繁（60秒冷卻）
- `EMAIL_ALREADY_VERIFIED`：郵箱已驗證

---

## 📱 前端實作建議

### 1. 註冊流程修改

#### 原註冊流程：
```
用戶填寫表單 → 提交註冊 → 登入成功 → 跳轉到會員頁面
```

#### 新註冊流程：
```
用戶填寫表單 → 提交註冊 → 登入成功 → 檢查驗證狀態 → 
如果未驗證：顯示驗證頁面 → 用戶輸入驗證碼 → 驗證成功 → 跳轉到會員頁面
```

#### 註冊 API 回應變化：
```json
// 註冊成功回應（新增）
{
  "redirectUrl": "/",
  "message": "註冊成功！請檢查您的郵箱並完成驗證",
  "needsVerification": true  // 新增：需要驗證標記
}
```

### 2. 登入後檢查驗證狀態

```javascript
// 登入成功後的處理
const handleLoginSuccess = async (response) => {
  if (response.needsVerification) {
    // 顯示 Email 驗證頁面
    router.push('/verify-email');
  } else {
    // 正常跳轉
    router.push(response.redirectUrl || '/member');
  }
};
```

### 3. Email 驗證頁面組件

#### Vue.js 實作範例：

```vue
<template>
  <div class="email-verification">
    <div class="verification-container">
      <h2>📧 郵箱驗證</h2>
      
      <!-- 驗證狀態顯示 -->
      <div class="status-info">
        <p>我們已向 <strong>{{ userEmail }}</strong> 發送驗證碼</p>
        <p class="text-sm text-gray-600">請檢查您的郵箱並輸入 6 位數驗證碼</p>
      </div>

      <!-- 驗證碼輸入 -->
      <form @submit.prevent="submitVerificationCode" class="verification-form">
        <div class="input-group">
          <label for="verification-code">驗證碼</label>
          <input
            id="verification-code"
            v-model="verificationCode"
            type="text"
            maxlength="6"
            placeholder="請輸入 6 位數驗證碼"
            class="verification-input"
            :disabled="loading"
            @input="formatCode"
          />
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- 成功訊息 -->
        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <!-- 提交按鈕 -->
        <button 
          type="submit" 
          :disabled="loading || verificationCode.length !== 6"
          class="verify-btn"
        >
          <span v-if="loading">驗證中...</span>
          <span v-else>驗證郵箱</span>
        </button>
      </form>

      <!-- 重新發送 -->
      <div class="resend-section">
        <p class="resend-text">
          沒收到驗證碼？
          <button 
            @click="resendCode" 
            :disabled="resendLoading || cooldown > 0"
            class="resend-btn"
          >
            <span v-if="resendLoading">發送中...</span>
            <span v-else-if="cooldown > 0">重新發送 ({{ cooldown }}s)</span>
            <span v-else>重新發送</span>
          </button>
        </p>
      </div>

      <!-- 倒數計時 -->
      <div v-if="expiresIn > 0" class="countdown">
        <p>驗證碼將在 {{ formatTime(expiresIn) }} 後過期</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// 響應式數據
const verificationCode = ref('');
const loading = ref(false);
const resendLoading = ref(false);
const error = ref('');
const success = ref('');
const userEmail = ref('');
const expiresIn = ref(0);
const cooldown = ref(0);

// 定時器
let expiresTimer = null;
let cooldownTimer = null;

// 格式化驗證碼輸入（只允許數字）
const formatCode = (event) => {
  const value = event.target.value.replace(/\D/g, '');
  verificationCode.value = value;
};

// 提交驗證碼
const submitVerificationCode = async () => {
  if (verificationCode.value.length !== 6) {
    error.value = '請輸入 6 位數驗證碼';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      credentials: 'include',
      body: JSON.stringify({
        code: verificationCode.value
      })
    });

    const data = await response.json();

    if (data.success) {
      success.value = data.message;
      // 驗證成功，跳轉到會員頁面
      setTimeout(() => {
        router.push('/member');
      }, 2000);
    } else {
      // 根據錯誤碼顯示不同的錯誤訊息
      switch (data.code) {
        case 'VERIFICATION_CODE_EXPIRED':
          error.value = '驗證碼已過期，請重新發送';
          break;
        case 'VERIFICATION_CODE_INVALID':
          error.value = '驗證碼錯誤，請重新輸入';
          break;
        case 'EMAIL_ALREADY_VERIFIED':
          error.value = '郵箱已驗證，無需重複驗證';
          setTimeout(() => router.push('/member'), 1000);
          break;
        default:
          error.value = data.message || '驗證失敗，請重試';
      }
    }
  } catch (err) {
    error.value = '網路錯誤，請重試';
  } finally {
    loading.value = false;
  }
};

// 重新發送驗證碼
const resendCode = async () => {
  resendLoading.value = true;
  error.value = '';

  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (data.success) {
      success.value = '驗證碼已重新發送';
      expiresIn.value = data.expiresIn;
      cooldown.value = 60; // 1分鐘冷卻
      startCooldownTimer();
    } else {
      // 根據錯誤碼顯示不同的錯誤訊息
      switch (data.code) {
        case 'RATE_LIMIT_EXCEEDED':
          error.value = '請等待 1 分鐘後再重新發送';
          cooldown.value = 60;
          startCooldownTimer();
          break;
        case 'EMAIL_ALREADY_VERIFIED':
          error.value = '郵箱已驗證，無需重新發送';
          setTimeout(() => router.push('/member'), 1000);
          break;
        default:
          error.value = data.message || '發送失敗，請重試';
      }
    }
  } catch (err) {
    error.value = '網路錯誤，請重試';
  } finally {
    resendLoading.value = false;
  }
};

// 檢查驗證狀態
const checkVerificationStatus = async () => {
  try {
    const response = await fetch('/api/auth/verification-status', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (data.success) {
      userEmail.value = data.email;
      
      // 如果已經驗證，直接跳轉
      if (data.isVerified) {
        router.push('/member');
      }
    }
  } catch (err) {
    console.error('檢查驗證狀態失敗:', err);
  }
};

// 格式化時間
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// 開始倒數計時
const startExpiresTimer = () => {
  expiresTimer = setInterval(() => {
    if (expiresIn.value > 0) {
      expiresIn.value--;
    } else {
      clearInterval(expiresTimer);
    }
  }, 1000);
};

// 開始冷卻計時
const startCooldownTimer = () => {
  cooldownTimer = setInterval(() => {
    if (cooldown.value > 0) {
      cooldown.value--;
    } else {
      clearInterval(cooldownTimer);
    }
  }, 1000);
};

// 組件掛載
onMounted(async () => {
  await checkVerificationStatus();
  
  // 發送初始驗證碼
  try {
    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      credentials: 'include'
    });

    const data = await response.json();
    if (data.success) {
      expiresIn.value = data.expiresIn;
      startExpiresTimer();
    }
  } catch (err) {
    console.error('發送驗證碼失敗:', err);
  }
});

// 組件卸載時清理定時器
onUnmounted(() => {
  if (expiresTimer) clearInterval(expiresTimer);
  if (cooldownTimer) clearInterval(cooldownTimer);
});
</script>

<style scoped>
.email-verification {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.verification-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.verification-container h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

.status-info {
  margin-bottom: 30px;
  color: #666;
}

.verification-form {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.verification-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
  letter-spacing: 2px;
  transition: border-color 0.3s;
}

.verification-input:focus {
  outline: none;
  border-color: #667eea;
}

.verify-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.verify-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.verify-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.resend-section {
  margin-bottom: 20px;
}

.resend-text {
  color: #666;
  font-size: 14px;
}

.resend-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.resend-btn:hover:not(:disabled) {
  color: #5a6fd8;
}

.resend-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
  text-decoration: none;
}

.countdown {
  color: #666;
  font-size: 14px;
}

.error-message {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.success-message {
  color: #27ae60;
  background: #f2fdf2;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}
</style>
```

---

## 🔄 路由設定

### 新增驗證頁面路由

```javascript
// router/index.js
const routes = [
  // ... 其他路由
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('@/views/VerifyEmail.vue'),
    meta: { requiresAuth: true }
  }
];
```

### 路由守衛修改

```javascript
// router/index.js
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = await checkAuthStatus();
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
    return;
  }
  
  // 如果已登入，檢查驗證狀態
  if (isLoggedIn && to.name !== 'VerifyEmail') {
    const verificationStatus = await checkVerificationStatus();
    
    // 如果未驗證且不在驗證頁面，重定向到驗證頁面
    if (!verificationStatus.isVerified) {
      next('/verify-email');
      return;
    }
  }
  
  next();
});
```

---

## 📋 前端整合檢查清單

### ✅ 需要實作的功能

- [ ] **註冊流程修改**：處理 `needsVerification` 回應
- [ ] **驗證狀態檢查**：登入後檢查是否已驗證
- [ ] **驗證頁面**：創建 Email 驗證界面
- [ ] **驗證碼輸入**：6 位數驗證碼輸入框
- [ ] **重新發送功能**：重新發送驗證碼按鈕
- [ ] **倒數計時**：驗證碼過期倒數計時
- [ ] **冷卻機制**：重新發送冷卻計時
- [ ] **錯誤處理**：驗證失敗錯誤顯示
- [ ] **成功處理**：驗證成功跳轉
- [ ] **路由守衛**：未驗證用戶重定向

### ✅ API 整合測試清單

#### 🔐 認證相關 API
- [ ] **POST /api/auth/register**：註冊（**需測試新回應格式**）
- [ ] **POST /api/auth/login**：登入
- [ ] **POST /api/auth/logout**：登出
- [ ] **GET /api/auth/session**：檢查登入狀態

#### 🔗 OAuth 相關 API
- [ ] **GET /api/auth/oauth/google/start**：Google 登入起始
- [ ] **GET /api/auth/oauth/google/callback**：Google 登入回調
- [ ] **GET /api/auth/oauth/facebook/start**：Facebook 登入起始
- [ ] **GET /api/auth/oauth/facebook/callback**：Facebook 登入回調

#### 📧 Email 驗證相關 API（**新增**）
- [ ] **GET /api/auth/verification-status**：檢查驗證狀態
- [ ] **POST /api/auth/send-verification**：發送驗證碼
- [ ] **POST /api/auth/verify-email**：驗證郵箱
- [ ] **POST /api/auth/resend-verification**：重新發送

### ✅ 用戶體驗測試

- [ ] **自動發送**：註冊後自動發送驗證碼
- [ ] **狀態提示**：清楚的驗證狀態提示
- [ ] **倒數計時**：驗證碼過期時間顯示
- [ ] **重新發送**：冷卻時間限制
- [ ] **錯誤提示**：友善的錯誤訊息
- [ ] **成功反饋**：驗證成功的確認

---

## 🧪 詳細測試指南

### 1. 註冊流程測試

#### 測試步驟：
1. 填寫註冊表單（email、password、name）
2. 提交註冊請求
3. 檢查回應是否包含 `needsVerification: true`
4. 確認是否自動跳轉到驗證頁面

#### 預期結果：
```json
{
  "redirectUrl": "/",
  "message": "註冊成功！請檢查您的郵箱並完成驗證",
  "needsVerification": true
}
```

### 2. Email 驗證流程測試

#### 測試步驟：
1. 註冊後進入驗證頁面
2. 檢查是否自動發送驗證碼
3. 輸入正確的 6 位數驗證碼
4. 測試錯誤驗證碼處理
5. 測試重新發送功能
6. 測試冷卻機制

#### 測試案例：

**案例 1：正確驗證碼**
```javascript
POST /api/auth/verify-email
{
  "code": "123456"  // 正確的驗證碼
}
// 預期：200 OK, 驗證成功
```

**案例 2：錯誤驗證碼**
```javascript
POST /api/auth/verify-email
{
  "code": "000000"  // 錯誤的驗證碼
}
// 預期：400 Bad Request, VERIFICATION_CODE_INVALID
```

**案例 3：過期驗證碼**
```javascript
POST /api/auth/verify-email
{
  "code": "123456"  // 已過期的驗證碼
}
// 預期：400 Bad Request, VERIFICATION_CODE_EXPIRED
```

**案例 4：重新發送（正常）**
```javascript
POST /api/auth/resend-verification
// 預期：200 OK, 重新發送成功
```

**案例 5：重新發送（冷卻中）**
```javascript
POST /api/auth/resend-verification  // 60秒內重複發送
// 預期：400 Bad Request, RATE_LIMIT_EXCEEDED
```

### 3. 驗證狀態檢查測試

#### 測試步驟：
1. 登入後檢查驗證狀態
2. 驗證前後狀態變化
3. 未登入狀態測試

#### 測試案例：

**案例 1：未驗證狀態**
```javascript
GET /api/auth/verification-status
// 預期：200 OK
{
  "success": true,
  "isVerified": false,
  "email": "user@example.com"
}
```

**案例 2：已驗證狀態**
```javascript
GET /api/auth/verification-status
// 預期：200 OK
{
  "success": true,
  "isVerified": true,
  "email": "user@example.com"
}
```

### 4. 錯誤處理測試

#### 測試各種錯誤情況：
- [ ] 網路錯誤處理
- [ ] 驗證碼格式錯誤
- [ ] 認證失敗處理
- [ ] 伺服器錯誤處理

#### 錯誤回應格式驗證：
```json
{
  "success": false,
  "message": "錯誤描述",
  "code": "ERROR_CODE"
}
```

### 5. 整合測試

#### 完整流程測試：
1. **註冊 → 驗證 → 登入** 完整流程
2. **OAuth 登入** 流程
3. **登出 → 重新登入** 流程
4. **路由守衛** 功能測試

#### 瀏覽器測試：
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### 裝置測試：
- [ ] 桌面版
- [ ] 手機版
- [ ] 平板版

---

## 🎨 UI/UX 建議

### 1. 驗證頁面設計
- 使用清晰的步驟指示
- 突出顯示用戶郵箱地址
- 提供重新發送選項
- 顯示驗證碼過期時間

### 2. 驗證碼輸入
- 6 位數數字輸入框
- 自動格式化（只允許數字）
- 清晰的視覺反饋
- 支援鍵盤輸入

### 3. 狀態反饋
- 載入狀態指示
- 錯誤訊息顯示
- 成功訊息確認
- 倒數計時顯示

---

## 🧪 測試建議

### 1. 功能測試
- 註冊後是否自動發送驗證碼
- 驗證碼輸入是否正確驗證
- 重新發送功能是否正常
- 過期處理是否正確

### 2. 錯誤處理測試
- 錯誤驗證碼處理
- 網路錯誤處理
- 過期驗證碼處理
- 冷卻時間限制

### 3. 用戶體驗測試
- 頁面載入速度
- 操作流程順暢度
- 錯誤訊息清晰度
- 成功反饋及時性

---

## 📞 技術支援

如果在實作過程中遇到問題，可以：

1. **檢查 API 回應**：使用瀏覽器開發者工具查看 API 請求/回應
2. **查看後端日誌**：`docker compose logs -f api`
3. **測試 API 端點**：使用 curl 或 Postman 測試
4. **檢查認證狀態**：確認 JWT Token 是否正確傳遞

---

**📧 Email 驗證系統已準備就緒，等待前端整合！**
