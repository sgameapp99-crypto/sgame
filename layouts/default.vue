<template>
  <div class="layout-default">
    <!-- 頂部導航 -->
    <AppHeader />
    
    <!-- 主要內容區域 -->
    <main class="main-content">
      <slot />
    </main>
    
    <!-- 底部 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// 佈局相關邏輯
const route = useRoute()

// 監聽路由變化
watch(() => route.path, (newPath) => {
  // 頁面切換時的處理邏輯
  console.log('頁面切換到:', newPath)
})
</script>

<style scoped>
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 60px; /* 為固定頂部導航留出空間 */
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 56px; /* 移動端導航高度 */
  }
}
</style>
