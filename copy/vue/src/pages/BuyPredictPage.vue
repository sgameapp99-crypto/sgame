<template>
  <div class="container mx-auto px-lg py-xl">
    <!-- 頁面標題 -->
    <div class="heading-2">{{ pageTitle }}</div>

    <!-- 莊家殺手橫幅 -->
    <div class="banner-section mb-lg">
      <div class="banner-placeholder">
        <h3>莊家殺手</h3>
        <p>尋找最準確的預測高手</p>
      </div>
    </div>

    <!-- 聯盟選單 -->
    <div class="alliance-menu mb-lg">
      <div class="tagsection">
        <div class="tag-league-boxall">
          <!-- 棒球聯盟 -->
          <div class="tag-league-box tag-box">
            <div class="tag-box-first">
              <ol class="tag-league">
                <li class="fold-head"></li>
                <li>棒球</li>
                <li class="fold-footer"></li>
              </ol>
            </div>
            <div class="tag-box-last">
              <ol class="tag-con">
                <li :class="{ 'tag-chosen': selectedAlliance === 1 }">
                  MLB
                </li>
                <li>
                  <a href="#" @click.prevent="selectAlliance(2)">日棒</a>
                </li>
                <li>
                  <a href="#" @click.prevent="selectAlliance(6)">中職</a>
                </li>
                <li>
                  <a href="#" @click.prevent="selectAlliance(9)">韓棒</a>
                </li>
              </ol>
            </div>
          </div>

          <!-- 籃球聯盟 -->
          <div class="tag-league-box tag-box">
            <div class="tag-box-first">
              <ol class="tag-league">
                <li class="fold-head"></li>
                <li>籃球</li>
                <li class="fold-footer"></li>
              </ol>
            </div>
            <div class="tag-box-last">
              <ol class="tag-con">
                <li>
                  <a href="#" @click.prevent="selectAlliance(3)">NBA</a>
                </li>
                <li>
                  <a href="#" @click.prevent="selectAlliance(97)">日籃</a>
                </li>
              </ol>
            </div>
          </div>

          <!-- 其他聯盟 -->
          <div class="tag-league-box tag-box">
            <div class="tag-box-first">
              <ol class="tag-league">
                <li class="fold-head"></li>
                <li>其他</li>
                <li class="fold-footer"></li>
              </ol>
            </div>
            <div class="tag-box-last">
              <ol class="tag-con">
                <li>
                  <a href="#" @click.prevent="selectAlliance(4)">足球</a>
                </li>
                <li>
                  <a href="#" @click.prevent="selectAlliance(91)">NHL</a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 高手排行榜 -->
    <div class="expert-rankings">
      <div v-if="loading" class="text-center py-xl">載入中...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center py-xl">{{ errorMessage }}</div>
      <div v-else>
        <!-- 國際盤高手 -->
        <div class="ranking-section mb-lg">
          <h3 class="ranking-title">國際盤{{ expertType }}</h3>
          <div v-if="internationalExperts.length === 0" class="no-data">
            目前沒有{{ expertType }}資料
          </div>
          <div v-else class="experts-grid">
            <div
              v-for="expert in internationalExperts"
              :key="expert.id"
              class="expert-card"
              :class="{ 'top-expert': expert.rank <= 3 }"
            >
              <div class="expert-rank">{{ expert.rank }}</div>
              <div class="expert-avatar">
                <img :src="expert.avatar || defaultAvatar" :alt="expert.name">
              </div>
              <div class="expert-info">
                <h4 class="expert-name">{{ expert.name }}</h4>
                <div class="expert-stats">
                  <div class="stat">
                    <span class="label">勝率</span>
                    <span class="value">{{ expert.winRate }}%</span>
                  </div>
                  <div class="stat">
                    <span class="label">總預測</span>
                    <span class="value">{{ expert.totalPredictions }}</span>
                  </div>
                  <div class="stat">
                    <span class="label">連勝</span>
                    <span class="value">{{ expert.winStreak }}</span>
                  </div>
                </div>
              </div>
              <div class="expert-actions">
                <button class="btn btn-primary btn-sm" @click="followExpert(expert.id)">
                  關注
                </button>
                <button class="btn btn-outline btn-sm" @click="viewExpert(expert.id)">
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 運彩盤高手 -->
        <div class="ranking-section">
          <h3 class="ranking-title">運彩盤{{ expertType }}</h3>
          <div v-if="bankExperts.length === 0" class="no-data">
            目前沒有{{ expertType }}資料
          </div>
          <div v-else class="experts-grid">
            <div
              v-for="expert in bankExperts"
              :key="expert.id"
              class="expert-card"
              :class="{ 'top-expert': expert.rank <= 3 }"
            >
              <div class="expert-rank">{{ expert.rank }}</div>
              <div class="expert-avatar">
                <img :src="expert.avatar || defaultAvatar" :alt="expert.name">
              </div>
              <div class="expert-info">
                <h4 class="expert-name">{{ expert.name }}</h4>
                <div class="expert-stats">
                  <div class="stat">
                    <span class="label">勝率</span>
                    <span class="value">{{ expert.winRate }}%</span>
                  </div>
                  <div class="stat">
                    <span class="label">總預測</span>
                    <span class="value">{{ expert.totalPredictions }}</span>
                  </div>
                  <div class="stat">
                    <span class="label">連勝</span>
                    <span class="value">{{ expert.winStreak }}</span>
                  </div>
                </div>
              </div>
              <div class="expert-actions">
                <button class="btn btn-primary btn-sm" @click="followExpert(expert.id)">
                  關注
                </button>
                <button class="btn btn-outline btn-sm" @click="viewExpert(expert.id)">
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 響應式數據
const selectedAlliance = ref(1);
const loading = ref(false);
const errorMessage = ref('');
const expertType = ref('莊家殺手');

// 模擬預設頭像
const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="100%" height="100%" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="%23999">?</text></svg>';

// 模擬高手數據
const internationalExperts = ref([
  {
    id: 1,
    rank: 1,
    name: '棒球高手',
    avatar: '',
    winRate: 78.5,
    totalPredictions: 245,
    winStreak: 12
  },
  {
    id: 2,
    rank: 2,
    name: 'MLB達人',
    avatar: '',
    winRate: 76.3,
    totalPredictions: 198,
    winStreak: 8
  },
  {
    id: 3,
    rank: 3,
    name: '職棒分析師',
    avatar: '',
    winRate: 74.1,
    totalPredictions: 167,
    winStreak: 5
  }
]);

const bankExperts = ref([
  {
    id: 4,
    rank: 1,
    name: '運彩王',
    avatar: '',
    winRate: 82.1,
    totalPredictions: 134,
    winStreak: 15
  },
  {
    id: 5,
    rank: 2,
    name: '預測大師',
    avatar: '',
    winRate: 79.8,
    totalPredictions: 156,
    winStreak: 9
  }
]);

// 計算屬性
const pageTitle = computed(() => {
  const type = route.query.type;
  if (type === 'singleKiller') return '單場殺手';
  return '莊家殺手';
});

// 方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  loadExperts(allianceId);
}

function followExpert(expertId: number) {
  alert(`關注高手 ID: ${expertId}`);
}

function viewExpert(expertId: number) {
  alert(`查看高手詳情 ID: ${expertId}`);
}

async function loadExperts(allianceId: number) {
  loading.value = true;
  errorMessage.value = '';

  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500));

    // 根據聯盟ID和類型加載不同的高手數據
    // 這裡使用模擬數據，實際應該調用API

  } catch (error) {
    errorMessage.value = '載入高手數據失敗，請稍後再試';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // 從路由查詢參數確定高手類型
  const type = route.query.type;
  if (type === 'singleKiller') {
    expertType.value = '單場殺手';
  }

  loadExperts(selectedAlliance.value);
});
</script>

<style scoped>
.banner-section {
  text-align: center;
}

.banner-placeholder {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.banner-placeholder h3 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: bold;
}

.banner-placeholder p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.alliance-menu {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.tagsection {
  background: #f8f9fa;
}

.tag-league-boxall {
  display: flex;
  gap: 20px;
  padding: 20px;
  flex-wrap: wrap;
}

.tag-league-box {
  min-width: 200px;
}

.tag-box {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.tag-box-first {
  background: #1e3c72;
  color: white;
  text-align: center;
  padding: 8px 0;
}

.tag-league {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tag-league li {
  display: inline-block;
  vertical-align: middle;
}

.fold-head, .fold-footer {
  width: 10px;
  height: 10px;
  border: 1px solid white;
  margin: 0 5px;
}

.tag-box-last {
  padding: 12px;
}

.tag-con {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-con li {
  padding: 6px 12px;
  border-radius: 4px;
  background: white;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-con li:hover {
  background: #f0f0f0;
}

.tag-con li a {
  color: inherit;
  text-decoration: none;
}

.tag-chosen {
  background: #ffde00 !important;
  border-color: #ffc400 !important;
}

.ranking-section {
  margin-bottom: 2rem;
}

.ranking-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.experts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.expert-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.expert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.top-expert {
  border-color: #f39c12;
  box-shadow: 0 2px 12px rgba(243, 156, 18, 0.2);
}

.expert-rank {
  position: absolute;
  top: -10px;
  left: 20px;
  width: 30px;
  height: 30px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.top-expert .expert-rank {
  background: #f39c12;
}

.expert-avatar {
  text-align: center;
  margin-bottom: 1rem;
}

.expert-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #e0e0e0;
}

.expert-info {
  margin-bottom: 1rem;
}

.expert-name {
  margin: 0 0 0.5rem 0;
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
}

.expert-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  text-align: center;
}

.stat {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat .label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat .value {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #3498db;
}

.expert-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .tag-league-boxall {
    flex-direction: column;
  }

  .experts-grid {
    grid-template-columns: 1fr;
  }

  .expert-stats {
    grid-template-columns: 1fr;
  }

  .expert-actions {
    flex-direction: column;
  }
}
</style>