<template>
  <div id="app">
    <!-- 固定頂部導航 -->
    <AppHeader />
    
    <!-- 主要內容區域 -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
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
}

/* body背景 - 暫時使用純色背景 */
body {
  background: #f0f8ff; /* 淺藍色背景，類似原始設計 */
}

/* 主要內容區域 */
.main-content {
  min-height: calc(100vh - 60px); /* 減去頂部導航高度 */
  background: #f5f5f5;
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
