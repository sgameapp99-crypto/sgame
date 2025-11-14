<template>
  <div class="page-wrapper">
    <header class="hero">
      <h1>聯絡我們</h1>
      <p>遇到任何問題或需要協助？歡迎透過以下方式與運彩王客服團隊聯繫，我們將盡快回覆您。</p>
    </header>

    <main class="content-grid">
      <section class="card contact-info">
        <h2>客服資訊</h2>
        <ul>
          <li>
            <span class="label">服務時間</span>
            <span>每日 09:30 - 24:00</span>
          </li>
          <li>
            <span class="label">客服電話</span>
            <a href="tel:+886900000000">09 XXXX XXX</a>
          </li>
          <li>
            <span class="label">客服信箱</span>
            <a href="mailto:support@sportsking.tw">support@sportsking.tw</a>
          </li>
          <li>
            <span class="label">Line 官方帳號</span>
            <span>@sportsking</span>
          </li>
        </ul>
        <p class="hint">若遇到緊急帳務或安全問題，建議使用電話聯繫以加速處理。</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// 聯絡我們頁面
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f5f6f8;
  padding: 40px 16px 80px;
}

.hero {
  max-width: 960px;
  margin: 0 auto 32px;
  text-align: center;
  color: #1f2937;
}

.hero h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero p {
  font-size: 1rem;
  line-height: 1.7;
  color: #4b5563;
  max-width: 720px;
  margin: 0 auto;
}

.content-grid {
  max-width: 640px;
  margin: 0 auto;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

.card h2 {
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: #1f2937;
}

.contact-info ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.contact-info li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: #374151;
}

.contact-info a {
  color: #2563eb;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

.label {
  display: inline-block;
  min-width: 96px;
  font-weight: 600;
  color: #1f2937;
}

.hint {
  margin-top: 16px;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 32px 12px 64px;
  }

  .hero h1 {
    font-size: 1.75rem;
  }

  .hero p {
    font-size: 0.95rem;
  }

  .card {
    padding: 20px;
    border-radius: 12px;
  }
}
</style>

