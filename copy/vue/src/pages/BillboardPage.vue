<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">{{ pageTitle }}</div>

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
                <li :class="{ 'tag-chosen': selectedAlliance === 2 }">
                  <a href="#" @click.prevent="selectAlliance(2)">日棒</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 6 }">
                  <a href="#" @click.prevent="selectAlliance(6)">中職</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 9 }">
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
                <li :class="{ 'tag-chosen': selectedAlliance === 3 }">
                  <a href="#" @click.prevent="selectAlliance(3)">NBA</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 97 }">
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
                <li :class="{ 'tag-chosen': selectedAlliance === 4 }">
                  <a href="#" @click.prevent="selectAlliance(4)">足球</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 91 }">
                  <a href="#" @click.prevent="selectAlliance(91)">NHL</a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 排行榜內容 -->
    <div class="billboard-content">
      <div v-if="loading" class="text-center py-xl">載入中...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center py-xl">{{ errorMessage }}</div>
      <div v-else>
        <!-- 勝率榜 -->
        <div v-if="boardType === 'winRate'" class="rankings-section">
          <div class="ranking-header">
            <h3 class="ranking-title">{{ allianceName }} 勝率榜</h3>
            <div class="ranking-period">統計期間：最近30天</div>
          </div>

          <div class="rankings-table">
            <div class="table-header">
              <div class="rank-col">排名</div>
              <div class="user-col">玩家</div>
              <div class="stats-col">勝率</div>
              <div class="stats-col">總預測</div>
              <div class="stats-col">勝場</div>
              <div class="stats-col">連勝</div>
              <div class="action-col">操作</div>
            </div>

            <div
              v-for="user in winRateRankings"
              :key="user.id"
              class="table-row"
              :class="{ 'top-three': user.rank <= 3 }"
            >
              <div class="rank-col">
                <div class="rank-number" :class="getRankClass(user.rank)">
                  {{ user.rank }}
                </div>
              </div>
              <div class="user-col">
                <div class="user-info">
                  <img :src="user.avatar || defaultAvatar" :alt="user.name" class="user-avatar">
                  <div class="user-details">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-level">Lv.{{ user.level }}</div>
                  </div>
                </div>
              </div>
              <div class="stats-col">
                <span class="win-rate">{{ user.winRate }}%</span>
              </div>
              <div class="stats-col">{{ user.totalPredictions }}</div>
              <div class="stats-col">{{ user.wins }}</div>
              <div class="stats-col">
                <span class="streak" :class="{ 'hot-streak': user.winStreak >= 5 }">
                  {{ user.winStreak }}
                </span>
              </div>
              <div class="action-col">
                <button class="btn btn-outline btn-sm" @click="viewUser(user.id)">
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 主推榜 -->
        <div v-if="boardType === 'mainPrediction'" class="rankings-section">
          <div class="ranking-header">
            <h3 class="ranking-title">{{ allianceName }} 主推榜</h3>
            <div class="ranking-period">統計期間：最近30天</div>
          </div>

          <div class="rankings-table">
            <div class="table-header">
              <div class="rank-col">排名</div>
              <div class="user-col">玩家</div>
              <div class="stats-col">主推勝率</div>
              <div class="stats-col">主推場次</div>
              <div class="stats-col">準確度</div>
              <div class="stats-col">推薦指數</div>
              <div class="action-col">操作</div>
            </div>

            <div
              v-for="user in mainPredictionRankings"
              :key="user.id"
              class="table-row"
              :class="{ 'top-three': user.rank <= 3 }"
            >
              <div class="rank-col">
                <div class="rank-number" :class="getRankClass(user.rank)">
                  {{ user.rank }}
                </div>
              </div>
              <div class="user-col">
                <div class="user-info">
                  <img :src="user.avatar || defaultAvatar" :alt="user.name" class="user-avatar">
                  <div class="user-details">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-level">Lv.{{ user.level }}</div>
                  </div>
                </div>
              </div>
              <div class="stats-col">
                <span class="win-rate">{{ user.mainWinRate }}%</span>
              </div>
              <div class="stats-col">{{ user.mainPredictions }}</div>
              <div class="stats-col">
                <span class="accuracy">{{ user.accuracy }}%</span>
              </div>
              <div class="stats-col">
                <div class="recommendation-score">
                  <div class="score-bar" :style="{ width: user.recommendationScore + '%' }"></div>
                  <span class="score-text">{{ user.recommendationScore }}</span>
                </div>
              </div>
              <div class="action-col">
                <button class="btn btn-outline btn-sm" @click="viewUser(user.id)">
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 響應式數據
const selectedAlliance = ref(1);
const loading = ref(false);
const errorMessage = ref('');

// 模擬預設頭像
const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%23999">?</text></svg>';

// 模擬勝率榜數據
const winRateRankings = ref([
  {
    id: 1,
    rank: 1,
    name: '棒球大師',
    avatar: '',
    level: 25,
    winRate: 78.5,
    totalPredictions: 245,
    wins: 192,
    winStreak: 12
  },
  {
    id: 2,
    rank: 2,
    name: 'MLB分析師',
    avatar: '',
    level: 22,
    winRate: 76.3,
    totalPredictions: 198,
    wins: 151,
    winStreak: 8
  },
  {
    id: 3,
    rank: 3,
    name: '職棒預測王',
    avatar: '',
    level: 20,
    winRate: 74.1,
    totalPredictions: 167,
    wins: 124,
    winStreak: 5
  },
  {
    id: 4,
    rank: 4,
    name: '數據高手',
    avatar: '',
    level: 18,
    winRate: 71.8,
    totalPredictions: 134,
    wins: 96,
    winStreak: 3
  },
  {
    id: 5,
    rank: 5,
    name: '運彩達人',
    avatar: '',
    level: 16,
    winRate: 69.2,
    totalPredictions: 156,
    wins: 108,
    winStreak: 2
  }
]);

// 模擬主推榜數據
const mainPredictionRankings = ref([
  {
    id: 6,
    rank: 1,
    name: '主推專家',
    avatar: '',
    level: 28,
    mainWinRate: 82.1,
    mainPredictions: 89,
    accuracy: 94.3,
    recommendationScore: 95
  },
  {
    id: 7,
    rank: 2,
    name: '精準預測師',
    avatar: '',
    level: 26,
    mainWinRate: 79.8,
    mainPredictions: 76,
    accuracy: 91.7,
    recommendationScore: 88
  },
  {
    id: 8,
    rank: 3,
    name: '金牌分析師',
    avatar: '',
    level: 24,
    mainWinRate: 77.4,
    mainPredictions: 68,
    accuracy: 89.2,
    recommendationScore: 82
  }
]);

// 計算屬性
const boardType = computed(() => {
  const type = route.query.type;
  return type === 'mainPrediction' ? 'mainPrediction' : 'winRate';
});

const pageTitle = computed(() => {
  return boardType.value === 'mainPrediction' ? '主推榜' : '勝率榜';
});

const allianceName = computed(() => {
  const alliances = {
    1: 'MLB',
    2: '日本職棒',
    3: 'NBA',
    4: '足球',
    6: '中華職棒',
    9: '韓國職棒',
    91: 'NHL',
    97: '日本職籃'
  };
  return alliances[selectedAlliance.value] || 'MLB';
});

// 方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  loadRankings(allianceId);
}

function getRankClass(rank: number): string {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return '';
}

function viewUser(userId: number) {
  router.push({ name: 'member-view', params: { id: userId } });
}

async function loadRankings(allianceId: number) {
  loading.value = true;
  errorMessage.value = '';

  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500));

    // 根據聯盟ID和榜單類型加載不同的排行數據
    // 這裡使用模擬數據，實際應該調用API

  } catch (error) {
    errorMessage.value = '載入排行榜失敗，請稍後再試';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRankings(selectedAlliance.value);
});
</script>

<style scoped>
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

.rankings-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ranking-header {
  margin-bottom: 2rem;
  text-align: center;
}

.ranking-title {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.ranking-period {
  color: #666;
  font-size: 14px;
}

.rankings-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 2fr repeat(4, 1fr) 100px;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: bold;
  color: #495057;
}

.table-header > div {
  padding: 1rem;
  text-align: center;
  border-right: 1px solid #dee2e6;
}

.table-header > div:last-child {
  border-right: none;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 2fr repeat(4, 1fr) 100px;
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row.top-three {
  background: linear-gradient(135deg, #fff8e1 0%, #fff 100%);
}

.table-row > div {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e0e0e0;
}

.table-row > div:last-child {
  border-right: none;
}

.rank-col {
  justify-content: center;
}

.rank-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

.rank-number.gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #2c3e50;
}

.rank-number.silver {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #2c3e50;
}

.rank-number.bronze {
  background: linear-gradient(135deg, #cd7f32, #d2b48c);
  color: white;
}

.user-col {
  justify-content: flex-start;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
}

.user-details {
  text-align: left;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.user-level {
  font-size: 12px;
  color: #666;
}

.stats-col {
  font-weight: 500;
}

.win-rate {
  color: #27ae60;
  font-weight: bold;
}

.streak.hot-streak {
  color: #e74c3c;
  font-weight: bold;
}

.accuracy {
  color: #3498db;
  font-weight: bold;
}

.recommendation-score {
  width: 100%;
  max-width: 80px;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  position: relative;
  margin: 0 auto;
}

.score-bar {
  height: 100%;
  background: linear-gradient(90deg, #f39c12, #e74c3c);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.score-text {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #2c3e50;
}

.action-col {
  justify-content: center;
}

@media (max-width: 1024px) {
  .table-header,
  .table-row {
    grid-template-columns: 60px 2fr repeat(3, 1fr) 80px;
  }

  .table-header > div:nth-child(4),
  .table-row > div:nth-child(4) {
    display: none;
  }
}

@media (max-width: 768px) {
  .tag-league-boxall {
    flex-direction: column;
  }

  .rankings-section {
    padding: 1rem;
  }

  .ranking-title {
    font-size: 24px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 50px 2fr 1fr 1fr 80px;
  }

  .table-header > div:nth-child(4),
  .table-header > div:nth-child(5),
  .table-row > div:nth-child(4),
  .table-row > div:nth-child(5) {
    display: none;
  }

  .user-details {
    display: none;
  }

  .user-info {
    justify-content: center;
  }
}
</style>