<template>
  <div id="app">
    <!-- 固定頂部導航 -->
    <AppHeader />
    
    <!-- 主要內容區域 -->
    <main class="main-content">
      <div class="layout-container">
        <RouterView />
      </div>
    </main>
    
    <!-- 底部欄位 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import { onMounted } from 'vue';
import { useSessionStore } from './stores/session';

const session = useSessionStore();
onMounted(() => {
  session.fetchSession();
});
</script>
<style>
/* Material Icons 字體 */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

/* 基本樣式 - 按照原始CSS */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: '微軟正黑體', 'Microsoft JhengHei', Arial, sans-serif;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

button,
input,
select,
textarea {
  font-family: inherit;
  appearance: auto;
}

/* body背景 - 暫時使用純色背景 */
body {
  background: #f0f8ff; /* 淺藍色背景，類似原始設計 */
}

/* 主要內容區域 - 調整高度計算，預留底部空間 */
.main-content {
  min-height: calc(100vh - 60px - 120px); /* 減去頂部導航高度和底部欄位高度 */
  background: #f5f5f5;
  padding: 32px 0 40px; /* 水平留白改由 layout-container 控制 */
}

.layout-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

@media (max-width: 1024px) {
  .layout-container {
    max-width: 1000px;
    padding: 0 24px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 0 32px;
  }

  .layout-container {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 16px 0 24px;
  }

  .layout-container {
    padding: 0 12px;
  }
}

/* 全域樣式重置 */
* {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
