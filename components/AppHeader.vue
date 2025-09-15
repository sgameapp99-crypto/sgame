<template>
  <header class="app-header">
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo -->
        <div class="nav-brand">
          <NuxtLink to="/" class="brand-link">
            <img src="/images/logo.png" alt="玩運彩預測平台" class="brand-logo" />
            <span class="brand-text">玩運彩預測</span>
          </NuxtLink>
        </div>

        <!-- 導航選單 -->
        <div class="nav-menu" :class="{ 'nav-menu-active': mobileMenuOpen }">
          <NuxtLink 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path" 
            class="nav-link"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- 用戶區域 -->
        <div class="nav-user">
          <template v-if="isAuthenticated">
            <!-- 已登入用戶 -->
            <el-dropdown trigger="click" @command="handleUserCommand">
              <div class="user-info">
                <el-avatar :size="32" :src="user?.avatar" />
                <span class="user-name">{{ user?.username }}</span>
                <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="dashboard">
                    <el-icon><User /></el-icon>
                    用戶中心
                  </el-dropdown-item>
                  <el-dropdown-item command="profile">
                    <el-icon><Setting /></el-icon>
                    個人設置
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    登出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <!-- 未登入用戶 -->
            <div class="auth-buttons">
              <el-button @click="navigateTo('/login')">登入</el-button>
              <el-button type="primary" @click="navigateTo('/register')">註冊</el-button>
            </div>
          </template>
        </div>

        <!-- 移動端選單按鈕 -->
        <div class="mobile-menu-btn" @click="toggleMobileMenu">
          <el-icon :size="24">
            <Menu v-if="!mobileMenuOpen" />
            <Close v-else />
          </el-icon>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { 
  ArrowDown, 
  User, 
  Setting, 
  SwitchButton, 
  Menu, 
  Close 
} from '@element-plus/icons-vue'

// 響應式數據
const mobileMenuOpen = ref(false)

// 導航選單項目
const menuItems = ref([
  { name: '首頁', path: '/' },
  { name: '預測中心', path: '/predictions' },
  { name: '討論區', path: '/discussion' },
  { name: '排行榜', path: '/leaderboard' },
  { name: '關於我們', path: '/about' }
])

// 模擬用戶狀態（後續替換為真實的用戶狀態）
const isAuthenticated = ref(false)
const user = ref(null)

// 方法
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'dashboard':
      navigateTo('/dashboard')
      break
    case 'profile':
      navigateTo('/profile')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = () => {
  // TODO: 實現登出邏輯
  console.log('用戶登出')
  isAuthenticated.value = false
  user.value = null
  navigateTo('/')
}

// 監聽路由變化關閉移動端選單
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--el-border-color-light);
}

.navbar {
  height: 60px;
  display: flex;
  align-items: center;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo 區域 */
.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--el-text-color-primary);
}

.brand-logo {
  height: 32px;
  width: auto;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--el-color-primary);
}

/* 導航選單 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--el-text-color-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.nav-link.router-link-active {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-8);
}

/* 用戶區域 */
.nav-user {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.user-info:hover {
  background: var(--el-bg-color-light);
}

.user-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.dropdown-icon {
  color: var(--el-text-color-regular);
  transition: transform 0.3s ease;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 移動端選單按鈕 */
.mobile-menu-btn {
  display: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.mobile-menu-btn:hover {
  background: var(--el-bg-color-light);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .navbar {
    height: 56px;
  }
  
  .nav-container {
    padding: 0 1rem;
  }
  
  .brand-text {
    display: none;
  }
  
  .nav-menu {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    gap: 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-menu-active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-link {
    width: 100%;
    text-align: center;
    padding: 1rem;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
  
  .nav-link:last-child {
    border-bottom: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .auth-buttons {
    gap: 0.5rem;
  }
  
  .auth-buttons .el-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 0.5rem;
  }
  
  .user-name {
    display: none;
  }
  
  .auth-buttons .el-button span {
    display: none;
  }
  
  .auth-buttons .el-button {
    padding: 0.5rem;
    min-width: auto;
  }
}
</style>
