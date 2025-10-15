<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">看數據</div>

    <!-- 功能導航區域 -->
    <div class="games-overview mt-lg">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
        <!-- 對戰資訊 -->
        <div class="feature-card">
          <div class="card-icon">⚾</div>
          <h3 class="card-title">對戰資訊</h3>
          <p class="card-description">查看球隊對戰數據、先發投手資訊、近期戰績等詳細對戰資訊</p>
          <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'games-battle' }">
            查看對戰
          </RouterLink>
        </div>

        <!-- 球隊資訊 -->
        <div class="feature-card">
          <div class="card-icon">🏆</div>
          <h3 class="card-title">球隊資訊</h3>
          <p class="card-description">了解各球隊的基本資訊、賽季統計數據和表現情況</p>
          <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'games-teams' }">
            查看球隊
          </RouterLink>
        </div>


        <!-- 賽事結果查詢 -->
        <div class="feature-card">
          <div class="card-icon">🔍</div>
          <h3 class="card-title">賽事結果查詢</h3>
          <p class="card-description">查詢歷史賽事結果，支持按聯盟、球隊、日期等多條件篩選</p>
          <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'games-results' }">
            查詢結果
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 快速統計區域 -->
    <div class="stats-overview mt-xl">
      <h3 class="heading-3 mb-lg">數據概覽</h3>
      <div class="grid md:grid-cols-3 gap-lg">
        <div class="stat-card">
          <div class="stat-number">{{ totalGames }}</div>
          <div class="stat-label">今日賽事</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalTeams }}</div>
          <div class="stat-label">參賽球隊</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ activeLeagues }}</div>
          <div class="stat-label">活躍聯盟</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

// 統計數據
const totalGames = ref(12);
const totalTeams = ref(30);
const activeLeagues = ref(4);
</script>

<style scoped>
.games-overview {
  margin-top: 2rem;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.card-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.stats-overview {
  margin-top: 3rem;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .games-overview .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stats-overview .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .card-icon {
    font-size: 2.5rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}
</style>
