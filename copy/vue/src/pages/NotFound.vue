<template>
  <div style="min-height: 100vh; display: flex; flex-direction: column">
    <AppHeader />
    <div style="padding: 24px">
      <h2>頁面不存在（404）</h2>
      <p>
        <RouterLink to="/">回首頁</RouterLink>
        <span style="margin: 0 8px">或</span>
        <a href="/legacy/www.playsport.cc/forume4cf.html">前往舊站首頁</a>
      </p>
    </div>
    <AppFooter />
  </div>
</template>
<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
</script>


