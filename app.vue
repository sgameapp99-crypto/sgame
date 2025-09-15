<template>
  <div>
    <h1>🏀 玩運彩預測平台</h1>
    <p>歡迎來到專業的運動預測分享平台！</p>
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
// 設置頁面標題
useHead({
  title: '玩運彩預測平台'
})
</script>

<style>
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 100vh;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

p {
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0.9;
}
</style>