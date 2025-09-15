<template>
  <div class="auth-layout">
    <!-- 簡化的頂部導航 -->
    <header class="auth-header">
      <div class="auth-nav">
        <NuxtLink to="/" class="brand-link">
          <img src="/images/logo.png" alt="玩運彩預測平台" class="brand-logo" />
          <span class="brand-text">玩運彩預測</span>
        </NuxtLink>
      </div>
    </header>

    <!-- 主要內容區域 -->
    <main class="auth-main">
      <slot />
    </main>

    <!-- 簡化的底部 -->
    <footer class="auth-footer">
      <div class="footer-content">
        <p>&copy; 2024 玩運彩預測平台. 版權所有.</p>
        <div class="footer-links">
          <NuxtLink to="/terms">使用條款</NuxtLink>
          <NuxtLink to="/privacy">隱私政策</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 認證佈局相關邏輯
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 頂部導航 */
.auth-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 1rem 0;
}

.auth-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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

/* 主要內容 */
.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 底部 */
.auth-footer {
  background: var(--el-bg-color-light);
  padding: 1rem 0;
  border-top: 1px solid var(--el-border-color-light);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--el-text-color-regular);
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  color: var(--el-text-color-regular);
  text-decoration: none;
}

.footer-links a:hover {
  color: var(--el-color-primary);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .auth-nav,
  .footer-content {
    padding: 0 1rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .brand-text {
    display: none;
  }
}
</style>
