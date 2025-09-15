<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- 登入表單標題 -->
        <div class="login-header">
          <h1 class="login-title">會員登入</h1>
          <p class="login-subtitle">歡迎回到玩運彩預測平台</p>
        </div>

        <!-- 登入表單 -->
        <VeeForm 
          ref="loginForm"
          :validation-schema="loginSchema"
          @submit="handleLogin"
          class="login-form"
        >
          <!-- 用戶名/郵箱 -->
          <div class="form-group">
            <label class="form-label">用戶名或郵箱</label>
            <VeeField
              name="username"
              v-slot="{ field, errorMessage }"
            >
              <el-input
                v-bind="field"
                placeholder="請輸入用戶名或郵箱"
                size="large"
                :class="{ 'is-error': errorMessage }"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
              <VeeErrorMessage name="username" class="error-message" />
            </VeeField>
          </div>

          <!-- 密碼 -->
          <div class="form-group">
            <label class="form-label">密碼</label>
            <VeeField
              name="password"
              v-slot="{ field, errorMessage }"
            >
              <el-input
                v-bind="field"
                type="password"
                placeholder="請輸入密碼"
                size="large"
                show-password
                :class="{ 'is-error': errorMessage }"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
              <VeeErrorMessage name="password" class="error-message" />
            </VeeField>
          </div>

          <!-- 記住我和忘記密碼 -->
          <div class="form-options">
            <VeeField name="rememberMe" v-slot="{ field }">
              <el-checkbox v-bind="field" :true-label="true" :false-label="false">
                記住我
              </el-checkbox>
            </VeeField>
            <NuxtLink to="/forgot-password" class="forgot-link">
              忘記密碼？
            </NuxtLink>
          </div>

          <!-- 登入按鈕 -->
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            native-type="submit"
            class="login-button"
          >
            {{ loading ? '登入中...' : '登入' }}
          </el-button>
        </VeeForm>

        <!-- 第三方登入 -->
        <div class="social-login">
          <div class="divider">
            <span>或使用以下方式登入</span>
          </div>
          <div class="social-buttons">
            <el-button 
              @click="handleSocialLogin('google')"
              class="social-btn google-btn"
            >
              <el-icon><Platform /></el-icon>
              Google
            </el-button>
            <el-button 
              @click="handleSocialLogin('facebook')"
              class="social-btn facebook-btn"
            >
              <el-icon><Platform /></el-icon>
              Facebook
            </el-button>
          </div>
        </div>

        <!-- 註冊鏈接 -->
        <div class="register-link">
          <span>還沒有帳號？</span>
          <NuxtLink to="/register" class="register-btn">立即註冊</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock, Platform } from '@element-plus/icons-vue'
import { object, string, boolean } from 'yup'

// 頁面 meta
definePageMeta({
  title: '會員登入',
  layout: 'auth'
})

// 設置頁面標題
useHead({
  title: '會員登入 - 玩運彩預測平台'
})

// 表單驗證 schema
const loginSchema = object({
  username: string()
    .required('請輸入用戶名或郵箱')
    .min(3, '用戶名至少需要3個字符'),
  password: string()
    .required('請輸入密碼')
    .min(6, '密碼至少需要6個字符'),
  rememberMe: boolean().default(false)
})

// 響應式數據
const loading = ref(false)
const loginForm = ref()

// 方法
const handleLogin = async (values: any) => {
  loading.value = true
  
  try {
    console.log('登入數據:', values)
    
    // TODO: 實現真實的登入邏輯
    // const response = await authApi.login(values)
    
    // 模擬 API 請求
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('登入成功！')
    
    // 重定向到首頁或原來的頁面
    const redirect = useRoute().query.redirect as string
    await navigateTo(redirect || '/')
    
  } catch (error) {
    console.error('登入失敗:', error)
    ElMessage.error('登入失敗，請檢查用戶名和密碼')
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = async (provider: string) => {
  try {
    console.log(`使用 ${provider} 登入`)
    
    // TODO: 實現第三方登入邏輯
    ElMessage.info(`${provider} 登入功能開發中...`)
    
  } catch (error) {
    console.error(`${provider} 登入失敗:`, error)
    ElMessage.error(`${provider} 登入失敗`)
  }
}

// 頁面進入動畫
onMounted(() => {
  // 可以添加頁面進入動畫
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表單標題 */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: var(--el-text-color-regular);
  margin: 0;
}

/* 表單樣式 */
.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.error-message {
  color: var(--el-color-danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.forgot-link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-size: 0.875rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  font-weight: 500;
}

/* 第三方登入 */
.social-login {
  margin-bottom: 2rem;
}

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--el-border-color-light);
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: var(--el-text-color-regular);
  font-size: 0.875rem;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-btn {
  height: 44px;
  border: 1px solid var(--el-border-color);
  background: white;
  color: var(--el-text-color-primary);
}

.social-btn:hover {
  background: var(--el-bg-color-light);
}

.google-btn:hover {
  border-color: #4285f4;
  color: #4285f4;
}

.facebook-btn:hover {
  border-color: #1877f2;
  color: #1877f2;
}

/* 註冊鏈接 */
.register-link {
  text-align: center;
  color: var(--el-text-color-regular);
}

.register-btn {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.5rem;
}

.register-btn:hover {
  text-decoration: underline;
}

/* 響應式設計 */
@media (max-width: 480px) {
  .login-page {
    padding: 1rem 0.5rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  .login-title {
    font-size: 1.75rem;
  }
  
  .social-buttons {
    grid-template-columns: 1fr;
  }
}
</style>