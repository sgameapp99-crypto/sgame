<template>
  <div class="legal-layout">
    <section class="legal-hero">
      <h1>服務條款</h1>
      <p>請仔細閱讀以下條款，了解在運彩王預測平台使用各項服務時需要遵守的規範與權利義務。</p>
    </section>

    <section class="legal-content">
      <TermsOfService />
    </section>
  </div>
</template>

<script setup lang="ts">
import TermsOfService from '@/components/legal/TermsOfService.vue';
</script>

<style scoped>
.legal-layout {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 40px 16px;
}

.legal-hero {
  max-width: 960px;
  margin: 0 auto 32px;
  text-align: center;
  color: #2c3e50;
}

.legal-hero h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.legal-hero p {
  max-width: 720px;
  margin: 0 auto;
  font-size: 1rem;
  line-height: 1.7;
  color: #4a4a4a;
}

.legal-content {
  max-width: 960px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .legal-layout {
    padding: 24px 12px;
  }

  .legal-hero h1 {
    font-size: 1.75rem;
  }

  .legal-hero p {
    font-size: 0.95rem;
  }
}
</style>



