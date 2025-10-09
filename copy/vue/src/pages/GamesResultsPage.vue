<template>
  <div class="container mx-auto px-lg py-xl">
      <div class="heading-2">賽事結果查詢</div>

      <!-- 查詢條件 -->
      <div class="search-filters mb-lg">
        <div class="filters-grid">
          <!-- 聯盟選擇 -->
          <div class="filter-group">
            <label class="filter-label">聯盟</label>
            <select v-model="filters.alliance_id" class="filter-select">
              <option value="">全部聯盟</option>
              <option value="1">MLB</option>
              <option value="2">日棒</option>
              <option value="3">NBA</option>
              <option value="6">中職</option>
              <option value="9">韓棒</option>
              <option value="97">日籃</option>
            </select>
          </div>

          <!-- 球隊選擇 -->
          <div class="filter-group">
            <label class="filter-label">球隊</label>
            <select v-model="filters.team_id" class="filter-select">
              <option value="">全部球隊</option>
              <option v-for="team in availableTeams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>

          <!-- 日期範圍 -->
          <div class="filter-group">
            <label class="filter-label">開始日期</label>
            <input v-model="filters.date_from" type="date" class="filter-input">
          </div>

          <div class="filter-group">
            <label class="filter-label">結束日期</label>
            <input v-model="filters.date_to" type="date" class="filter-input">
          </div>

          <!-- 賽季 -->
          <div class="filter-group">
            <label class="filter-label">賽季</label>
            <select v-model="filters.season" class="filter-select">
              <option value="">全部賽季</option>
              <option value="2025">2025賽季</option>
              <option value="2024">2024賽季</option>
              <option value="2023">2023賽季</option>
            </select>
          </div>

          <!-- 查詢按鈕 -->
          <div class="filter-group filter-actions">
            <button class="btn btn-primary" @click="searchResults" :disabled="searching">
              {{ searching ? '搜尋中...' : '查詢' }}
            </button>
            <button class="btn btn-outline" @click="resetFilters">重置</button>
          </div>
        </div>
      </div>

      <!-- 查詢結果 -->
      <div v-if="searching" class="text-center py-xl">搜尋中...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center py-xl">{{ errorMessage }}</div>
      <div v-else-if="results.length === 0 && hasSearched" class="text-center py-xl text-neutral-600">
        沒有找到符合條件的賽事結果
      </div>
      <div v-else-if="results.length > 0" class="results-section">
        <!-- 結果統計 -->
        <div class="results-header mb-md">
          <div class="results-count">
            共找到 {{ totalResults }} 場比賽
          </div>
          <div class="results-export">
            <button class="btn btn-outline btn-sm" @click="exportResults">匯出結果</button>
          </div>
        </div>

        <!-- 結果列表 -->
        <div class="results-list">
          <div
            v-for="result in results"
            :key="result.id"
            class="result-card"
          >
            <div class="result-header">
              <div class="game-date">{{ formatDate(result.date) }}</div>
              <div class="game-alliance">{{ getAllianceName(result.alliance_id) }}</div>
            </div>

            <div class="result-teams">
              <div class="team home-team" :class="{ winner: result.winner === 'home' }">
                <div class="team-name">{{ result.home_team.name }}</div>
                <div class="team-score">{{ result.home_score }}</div>
              </div>
              <div class="vs-indicator">vs</div>
              <div class="team away-team" :class="{ winner: result.winner === 'away' }">
                <div class="team-name">{{ result.away_team.name }}</div>
                <div class="team-score">{{ result.away_score }}</div>
              </div>
            </div>

            <div class="result-details">
              <div class="detail-item">
                <span class="label">比賽狀態</span>
                <span class="value">{{ getStatusText(result.status) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">比賽場地</span>
                <span class="value">{{ result.venue }}</span>
              </div>
              <div v-if="result.inning" class="detail-item">
                <span class="label">局數</span>
                <span class="value">{{ result.inning }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分頁 -->
        <div v-if="totalResults > pageSize" class="pagination mt-lg">
          <button
            class="btn btn-outline btn-sm"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
          >
            上一頁
          </button>

          <span class="page-info">
            第 {{ currentPage }} 頁，共 {{ totalPages }} 頁
          </span>

          <button
            class="btn btn-outline btn-sm"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
          >
            下一頁
          </button>
        </div>
      </div>

      <!-- 沒有查詢時的提示 -->
      <div v-if="!hasSearched" class="search-prompt text-center py-xl">
        <div class="prompt-icon">🔍</div>
        <h3>賽事結果查詢</h3>
        <p>請選擇查詢條件來搜尋歷史賽事結果</p>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { gamesApi, type GameResult } from '../services/gamesApi';

// 響應式數據
const searching = ref(false);
const errorMessage = ref('');
const hasSearched = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const totalResults = ref(0);

// 查詢條件
const filters = reactive({
  alliance_id: '',
  team_id: '',
  date_from: '',
  date_to: '',
  season: '2025'
});

// 可用球隊列表
const availableTeams = ref([
  { id: 1, name: '芝加哥小熊' },
  { id: 2, name: '匹茲堡海盜' },
  { id: 3, name: '洛杉磯道奇' },
  { id: 4, name: '舊金山巨人' }
]);

// 查詢結果
const results = ref<GameResult[]>([]);

// 計算屬性
const totalPages = computed(() => Math.ceil(totalResults.value / pageSize.value));

// 方法
async function searchResults() {
  searching.value = true;
  errorMessage.value = '';
  hasSearched.value = true;

  try {
    const params = {
      alliance_id: filters.alliance_id || undefined,
      team_id: filters.team_id || undefined,
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
      season: filters.season || undefined,
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value
    };

    const data = await gamesApi.getGameResults(params);
    results.value = data.results;
    totalResults.value = data.total;
  } catch (error) {
    errorMessage.value = '搜尋失敗，請稍後再試';
    console.error('Failed to search results:', error);
  } finally {
    searching.value = false;
  }
}

function resetFilters() {
  Object.assign(filters, {
    alliance_id: '',
    team_id: '',
    date_from: '',
    date_to: '',
    season: '2025'
  });
  results.value = [];
  hasSearched.value = false;
  totalResults.value = 0;
  currentPage.value = 1;
}

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    searchResults();
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  });
}

function getAllianceName(allianceId: number): string {
  const alliances: Record<number, string> = {
    1: 'MLB',
    2: '日棒',
    3: 'NBA',
    6: '中職',
    9: '韓棒',
    97: '日籃'
  };
  return alliances[allianceId] || '未知';
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'scheduled': '未開始',
    'live': '進行中',
    'final': '已結束',
    'postponed': '延期',
    'cancelled': '取消'
  };
  return statusMap[status] || status;
}

function exportResults() {
  // 模擬匯出功能
  alert('匯出功能開發中...');
}

onMounted(() => {
  // 設置預設日期範圍為最近一個月
  const today = new Date();
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  filters.date_to = today.toISOString().split('T')[0];
  filters.date_from = oneMonthAgo.toISOString().split('T')[0];
});
</script>

<style scoped>
.search-filters {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.filter-select, .filter-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.filter-select:focus, .filter-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.filter-actions {
  justify-content: flex-start;
  gap: 0.5rem;
}

.filter-actions .btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.results-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.results-count {
  font-weight: 500;
  color: #2c3e50;
}

.results-export .btn {
  font-size: 0.8rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.result-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-date {
  font-weight: 500;
  color: #2c3e50;
}

.game-alliance {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.result-teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.team {
  flex: 1;
  text-align: center;
  position: relative;
}

.team.winner {
  background: rgba(39, 174, 96, 0.1);
  border-radius: 4px;
  padding: 0.5rem;
}

.team-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.team-score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
}

.team.winner .team-score {
  color: #27ae60;
}

.vs-indicator {
  font-weight: bold;
  color: #666;
  margin: 0 1rem;
}

.result-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  font-size: 0.9rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item .label {
  color: #666;
  font-weight: 500;
}

.detail-item .value {
  color: #2c3e50;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
}

.search-prompt {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.prompt-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.search-prompt h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.search-prompt p {
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .result-teams {
    flex-direction: column;
    gap: 1rem;
  }

  .vs-indicator {
    margin: 0.5rem 0;
  }

  .result-details {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
