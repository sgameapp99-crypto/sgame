<template>
  <div class="legal-page">
    <div class="mainconbox">
      <div class="mainconboxin mainconboxinwide">
        <div class="common-box utos-box">
          <div class="common-tabs utos-tabs">
            <!-- Tab 標籤 -->
            <ul class="tabs">
              <li 
                :class="{ active: activeTab === 'terms' }"
                @click="setActiveTab('terms')"
              >
                <a href="#terms">服務條款</a>
                <span></span>
              </li>
              <li 
                :class="{ active: activeTab === 'privacy' }"
                @click="setActiveTab('privacy')"
              >
                <a href="#privacy">隱私權政策</a>
                <span></span>
              </li>
              <li 
                :class="{ active: activeTab === 'sales' }"
                @click="setActiveTab('sales')"
              >
                <a href="#sales">販售預測規範</a>
                <span></span>
              </li>
            </ul>

            <!-- Tab 內容區域 -->
            <div class="tab_container">
              <!-- 服務條款 -->
              <div 
                id="terms" 
                class="tab_content"
                :style="{ display: activeTab === 'terms' ? 'block' : 'none' }"
              >
                <TermsOfService />
              </div>

              <!-- 隱私權政策 -->
              <div 
                id="privacy" 
                class="tab_content"
                :style="{ display: activeTab === 'privacy' ? 'block' : 'none' }"
              >
                <PrivacyPolicy />
              </div>

              <!-- 販售預測規範 -->
              <div 
                id="sales" 
                class="tab_content"
                :style="{ display: activeTab === 'sales' ? 'block' : 'none' }"
              >
                <SalesPredictionRules />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TermsOfService from '@/components/legal/TermsOfService.vue'
import PrivacyPolicy from '@/components/legal/PrivacyPolicy.vue'
import SalesPredictionRules from '@/components/legal/SalesPredictionRules.vue'

// 響應式狀態
const activeTab = ref<'terms' | 'privacy' | 'sales'>('terms')

// 設置活動標籤
const setActiveTab = (tab: 'terms' | 'privacy' | 'sales') => {
  activeTab.value = tab
}

// 組件掛載時處理 URL 參數
onMounted(() => {
  const hash = window.location.hash
  if (hash === '#privacy') {
    activeTab.value = 'privacy'
  } else if (hash === '#sales') {
    activeTab.value = 'sales'
  } else {
    activeTab.value = 'terms'
  }
})
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.mainconbox {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.mainconboxin {
  width: 100%;
}

.mainconboxinwide {
  max-width: 100%;
}

.common-box {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.utos-box {
  margin: 0;
}

.common-tabs {
  border-bottom: 1px solid #e0e0e0;
}

.utos-tabs {
  background: #f8f9fa;
}

.tabs {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.tabs li {
  flex: 1;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tabs li a {
  display: block;
  padding: 20px 24px;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.tabs li span {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #3498db;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tabs li.active {
  background: #fff;
}

.tabs li.active a {
  color: #2c3e50;
  font-weight: 600;
}

.tabs li.active span {
  transform: scaleX(1);
}

.tabs li:hover:not(.active) {
  background: rgba(52, 152, 219, 0.1);
}

.tabs li:hover:not(.active) a {
  color: #3498db;
}

.tab_container {
  position: relative;
}

.tab_content {
  padding: 0;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .mainconbox {
    padding: 10px;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .tabs li {
    flex: none;
  }
  
  .tabs li a {
    padding: 15px 20px;
    font-size: 14px;
  }
  
  .tabs li span {
    height: 2px;
  }
}

@media (max-width: 480px) {
  .tabs li a {
    padding: 12px 16px;
    font-size: 13px;
  }
}
</style>
