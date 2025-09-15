<template>
  <div id="app">
    <!-- 頭部導航 -->
    <header class="header">
      <nav class="navbar">
        <div class="nav-brand">
          <h1>🏀 玩運彩預測平台</h1>
        </div>
        <div class="nav-menu">
          <a href="#" class="nav-link">首頁</a>
          <a href="#" class="nav-link">預測中心</a>
          <a href="#" class="nav-link">討論區</a>
          <a href="#" class="nav-link">登入</a>
        </div>
      </nav>
    </header>

    <!-- 主要內容 -->
    <main class="main">
      <section class="hero">
        <div class="hero-content">
          <h2 class="hero-title">專業運動預測分享平台</h2>
          <p class="hero-subtitle">
            與高手一起分析賽事，提升預測準確率，贏得更多收益！
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary">立即開始</button>
            <button class="btn btn-secondary">了解更多</button>
          </div>
        </div>
      </section>

      <!-- 功能特色 -->
      <section class="features">
        <div class="container">
          <h3 class="section-title">平台特色</h3>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🏆</div>
              <h4>專業預測師</h4>
              <p>平台聚集眾多專業預測師，提供高質量預測分析</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h4>數據分析</h4>
              <p>基於大數據分析，提供準確的賽事預測和統計</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💬</div>
              <h4>社群討論</h4>
              <p>活躍的社群討論，與其他玩家分享心得和策略</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h4>即時監控</h4>
              <p>即時賽事數據更新，掌握最新比賽動態</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 統計數據 -->
      <section class="stats">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">50,000+</div>
              <div class="stat-label">註冊用戶</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100,000+</div>
              <div class="stat-label">預測總數</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">85%</div>
              <div class="stat-label">平均準確率</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">NT$ 10M+</div>
              <div class="stat-label">總收益</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 玩運彩預測平台. 版權所有.</p>
        <p class="disclaimer">
          本平台僅提供運動預測分析服務，請理性分析，謹慎投資。
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 響應式數據
const appTitle = ref('玩運彩預測平台')

// 方法
const handleGetStarted = () => {
  alert('歡迎加入玩運彩預測平台！')
}

const handleLearnMore = () => {
  alert('更多功能正在開發中...')
}
</script>

<style scoped>
/* 組件樣式將在 style.css 中定義 */
</style>
