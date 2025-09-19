<template>
  <div class="forum-test-page">
    <h1>論壇UI測試頁面</h1>
    <p>這個頁面用於測試原始論壇UI的完整複製效果</p>
    
    <!-- 使用HomePage組件 -->
    <HomePage />
  </div>
</template>

<script setup lang="ts">
import HomePage from './HomePage.vue';
</script>

<style scoped>
.forum-test-page {
  padding: 20px;
  background: #f5f5f5;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}
</style>
