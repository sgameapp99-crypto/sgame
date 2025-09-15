<template>
  <div class="home-page">
    <!-- 頁面頭部 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            {{ config.public.appTitle }}
          </h1>
          <p class="hero-subtitle">
            專業的運動預測分享與販售平台，與高手一起贏得更多！
          </p>
          <div class="hero-actions">
            <el-button 
              type="primary" 
              size="large" 
              @click="handleGetStarted"
              class="get-started-btn"
            >
              立即開始
            </el-button>
            <el-button 
              size="large" 
              @click="handleLearnMore"
              class="learn-more-btn"
            >
              了解更多
            </el-button>
          </div>
        </div>
        <div class="hero-image">
          <img src="/images/hero-sports.png" alt="運動預測" />
        </div>
      </div>
    </section>

    <!-- 特色功能 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">平台特色</h2>
        <div class="features-grid">
          <div 
            v-for="feature in features" 
            :key="feature.id"
            class="feature-card"
          >
            <div class="feature-icon">
              <el-icon :size="48">
                <component :is="feature.icon" />
              </el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 熱門預測 -->
    <section class="hot-predictions">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">熱門預測</h2>
          <el-button 
            type="text" 
            @click="navigateTo('/predictions')"
            class="view-all-btn"
          >
            查看全部
            <el-icon class="ml-1"><ArrowRight /></el-icon>
          </el-button>
        </div>
        
        <div v-loading="predictionsLoading" class="predictions-grid">
          <div 
            v-for="prediction in hotPredictions" 
            :key="prediction.id"
            class="prediction-card"
            @click="viewPrediction(prediction.id)"
          >
            <div class="prediction-header">
              <div class="prediction-sport">
                <el-tag :type="getSportTagType(prediction.sport)">
                  {{ prediction.sport }}
                </el-tag>
              </div>
              <div class="prediction-price">
                <span class="price">NT$ {{ prediction.price }}</span>
              </div>
            </div>
            
            <h3 class="prediction-title">{{ prediction.title }}</h3>
            <p class="prediction-summary">{{ prediction.summary }}</p>
            
            <div class="prediction-meta">
              <div class="author">
                <el-avatar :size="24" :src="prediction.author.avatar" />
                <span class="author-name">{{ prediction.author.name }}</span>
                <el-tag size="small" :type="getLevelTagType(prediction.author.level)">
                  {{ prediction.author.level }}
                </el-tag>
              </div>
              <div class="stats">
                <span class="accuracy">
                  <el-icon><TrendCharts /></el-icon>
                  {{ prediction.author.accuracy }}%
                </span>
                <span class="views">
                  <el-icon><View /></el-icon>
                  {{ prediction.views }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 統計數據 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.key" class="stat-item">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 區域 -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">準備開始您的預測之旅嗎？</h2>
          <p class="cta-subtitle">立即加入我們，與專業預測師一起贏得更多收益！</p>
          <div class="cta-actions">
            <el-button 
              type="primary" 
              size="large"
              @click="handleRegister"
            >
              立即註冊
            </el-button>
            <el-button 
              size="large"
              @click="handleLogin"
            >
              會員登入
            </el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, TrendCharts, View, Trophy, DataAnalysis, ChatDotSquare, Monitor } from '@element-plus/icons-vue'

// 頁面 meta
definePageMeta({
  title: '首頁',
  description: '專業的運動預測分享平台'
})

// 設置頁面標題
useHead({
  title: '首頁 - 玩運彩預測平台'
})

// 應用配置
const config = useRuntimeConfig()

// 響應式數據
const predictionsLoading = ref(false)
const hotPredictions = ref([
  {
    id: '1',
    title: 'NBA 湖人 vs 勇士 主場優勢分析',
    summary: '基於近期戰績和主場優勢，湖人勝率較高...',
    sport: '籃球',
    price: 299,
    views: 1250,
    author: {
      name: '籃球專家',
      avatar: '/images/avatars/expert1.jpg',
      level: '金牌',
      accuracy: 87
    }
  },
  {
    id: '2',
    title: '英超 曼城 vs 利物浦 進球數預測',
    summary: '兩隊攻擊力強勁，預計總進球數超過2.5...',
    sport: '足球',
    price: 199,
    views: 980,
    author: {
      name: '足球達人',
      avatar: '/images/avatars/expert2.jpg',
      level: '鑽石',
      accuracy: 92
    }
  }
])

const features = ref([
  {
    id: 1,
    icon: Trophy,
    title: '專業預測師',
    description: '平台聚集眾多專業預測師，提供高質量預測分析'
  },
  {
    id: 2,
    icon: DataAnalysis,
    title: '數據分析',
    description: '基於大數據分析，提供準確的賽事預測和統計'
  },
  {
    id: 3,
    icon: ChatDotSquare,
    title: '社群討論',
    description: '活躍的社群討論，與其他玩家分享心得和策略'
  },
  {
    id: 4,
    icon: Monitor,
    title: '即時監控',
    description: '即時賽事數據更新，掌握最新比賽動態'
  }
])

const stats = ref([
  { key: 'users', value: '50,000+', label: '註冊用戶' },
  { key: 'predictions', value: '100,000+', label: '預測總數' },
  { key: 'accuracy', value: '85%', label: '平均準確率' },
  { key: 'earnings', value: 'NT$ 10M+', label: '總收益' }
])

// 方法
const handleGetStarted = () => {
  // TODO: 檢查用戶登入狀態
  navigateTo('/register')
}

const handleLearnMore = () => {
  // 滾動到特色功能區域
  const featuresSection = document.querySelector('.features-section')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleRegister = () => {
  navigateTo('/register')
}

const handleLogin = () => {
  navigateTo('/login')
}

const viewPrediction = (id: string) => {
  navigateTo(`/predictions/${id}`)
}

const getSportTagType = (sport: string) => {
  const sportTypes: Record<string, string> = {
    '籃球': 'warning',
    '足球': 'success',
    '棒球': 'info',
    '網球': 'danger'
  }
  return sportTypes[sport] || 'primary'
}

const getLevelTagType = (level: string) => {
  const levelTypes: Record<string, string> = {
    '鑽石': 'danger',
    '金牌': 'warning',
    '銀牌': 'info',
    '銅牌': 'success'
  }
  return levelTypes[level] || 'primary'
}

// 生命週期
onMounted(async () => {
  // 載入熱門預測數據
  predictionsLoading.value = true
  try {
    // TODO: 調用 API 獲取熱門預測
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('載入熱門預測失敗:', error)
  } finally {
    predictionsLoading.value = false
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* 英雄區域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 80vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 4rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.get-started-btn {
  background: #ff6b6b;
  border-color: #ff6b6b;
}

.hero-image {
  flex: 1;
  text-align: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 區段標題 */
.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--el-text-color-primary);
}

/* 特色功能 */
.features-section {
  padding: 5rem 0;
  background: var(--el-bg-color-page);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  margin-bottom: 1.5rem;
  color: var(--el-color-primary);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--el-text-color-primary);
}

.feature-description {
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

/* 熱門預測 */
.hot-predictions {
  padding: 5rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.view-all-btn {
  font-size: 1rem;
  color: var(--el-color-primary);
}

.predictions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.prediction-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.prediction-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--el-color-primary);
}

.prediction-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--el-text-color-primary);
}

.prediction-summary {
  color: var(--el-text-color-regular);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.prediction-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.stats {
  display: flex;
  gap: 1rem;
  color: var(--el-text-color-regular);
  font-size: 0.875rem;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 統計數據 */
.stats-section {
  padding: 3rem 0;
  background: var(--el-color-primary);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.125rem;
  opacity: 0.9;
}

/* CTA 區域 */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .predictions-grid {
    grid-template-columns: 1fr;
  }
  
  .prediction-meta {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cta-title {
    font-size: 2rem;
  }
}
</style>