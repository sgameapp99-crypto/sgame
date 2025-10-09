<template>
  <div class="container mx-auto px-lg py-xl">
      <!-- 頁面標題 -->
      <div class="heading-2">對戰資訊</div>

      <!-- 聯盟選擇 -->
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
                    <a href="#" @click.prevent="selectAlliance(1)">MLB</a>
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

      <!-- 賽事列表或詳細資訊 -->
      <div v-if="!selectedGame" class="games-list">
        <div v-if="loading" class="text-center py-xl">載入中...</div>
        <div v-else-if="errorMessage" class="text-red-600 text-center py-xl">{{ errorMessage }}</div>
        <div v-else>
          <div v-if="games.length === 0" class="text-center py-xl text-neutral-600">
            目前沒有進行中的賽事
          </div>
          <div v-else class="grid gap-md md:grid-cols-2 lg:grid-cols-3">
            <GameCard
              v-for="game in games"
              :key="game.id"
              :game="game"
              @click="selectGame(game.id)"
            />
          </div>
        </div>
      </div>

      <!-- 對戰詳細資訊 -->
      <div v-else class="battle-detail">
        <div class="mb-md">
          <button class="btn btn-outline" @click="backToList">← 返回賽事列表</button>
        </div>

        <!-- 賽事基本資訊 -->
        <div class="battle-header mb-lg">
          <div class="grid md:grid-cols-2 gap-lg">
            <div class="text-center">
              <div class="team-name text-xl font-bold mb-sm">{{ battleData?.game.away_team.name }}</div>
              <div class="team-short">{{ battleData?.game.away_team.short_name }}</div>
            </div>
            <div class="text-center">
              <div class="team-name text-xl font-bold mb-sm">{{ battleData?.game.home_team.name }}</div>
              <div class="team-short">{{ battleData?.game.home_team.short_name }}</div>
            </div>
          </div>
          <div class="text-center mt-md">
            <div class="text-lg">{{ formatTime(battleData?.game.scheduled_time) }}</div>
            <div class="text-neutral-600">{{ battleData?.game.venue }}</div>
          </div>
        </div>

        <!-- 先發投手 -->
        <div class="battle-section mb-lg">
          <h3 class="section-title">先發投手</h3>
          <div class="grid md:grid-cols-2 gap-lg">
            <div class="pitcher-card">
              <h4>{{ battleData?.starting_pitchers.away.name }}</h4>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="label">勝</span>
                  <span class="value">{{ battleData?.starting_pitchers.away.wins }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">敗</span>
                  <span class="value">{{ battleData?.starting_pitchers.away.losses }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">防禦率</span>
                  <span class="value">{{ battleData?.starting_pitchers.away.era }}</span>
                </div>
              </div>
            </div>
            <div class="pitcher-card">
              <h4>{{ battleData?.starting_pitchers.home.name }}</h4>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="label">勝</span>
                  <span class="value">{{ battleData?.starting_pitchers.home.wins }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">敗</span>
                  <span class="value">{{ battleData?.starting_pitchers.home.losses }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">防禦率</span>
                  <span class="value">{{ battleData?.starting_pitchers.home.era }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 團隊打擊數據 -->
        <div class="battle-section mb-lg">
          <h3 class="section-title">團隊打擊數據</h3>
          <div class="grid md:grid-cols-2 gap-lg">
            <div class="team-stats-card">
              <h4>{{ battleData?.game.away_team.name }}</h4>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="label">打擊率</span>
                  <span class="value">{{ battleData?.team_stats.away.batting_avg }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">上壘率</span>
                  <span class="value">{{ battleData?.team_stats.away.obp }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">長打率</span>
                  <span class="value">{{ battleData?.team_stats.away.slg }}</span>
                </div>
              </div>
            </div>
            <div class="team-stats-card">
              <h4>{{ battleData?.game.home_team.name }}</h4>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="label">打擊率</span>
                  <span class="value">{{ battleData?.team_stats.home.batting_avg }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">上壘率</span>
                  <span class="value">{{ battleData?.team_stats.home.obp }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">長打率</span>
                  <span class="value">{{ battleData?.team_stats.home.slg }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 近期戰績 -->
        <div class="battle-section mb-lg">
          <h3 class="section-title">近期戰績</h3>
          <div class="grid md:grid-cols-2 gap-lg">
            <div>
              <h4 class="text-center mb-md">{{ battleData?.game.away_team.name }} 近10場</h4>
              <div class="record-list">
                <div v-for="record in battleData?.recent_matches.away_team.slice(0, 10)" :key="record.id" class="record-item">
                  <span class="date">{{ record.date }}</span>
                  <span class="opponent">{{ record.opponent }}</span>
                  <span class="result" :class="record.result === 'W' ? 'win' : 'loss'">
                    {{ record.result }}
                  </span>
                  <span class="score">{{ record.score }}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-center mb-md">{{ battleData?.game.home_team.name }} 近10場</h4>
              <div class="record-list">
                <div v-for="record in battleData?.recent_matches.home_team.slice(0, 10)" :key="record.id" class="record-item">
                  <span class="date">{{ record.date }}</span>
                  <span class="opponent">{{ record.opponent }}</span>
                  <span class="result" :class="record.result === 'W' ? 'win' : 'loss'">
                    {{ record.result }}
                  </span>
                  <span class="score">{{ record.score }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import GameCard from '../components/GameCard.vue';
import { gamesApi, type Game, type BattleData } from '../services/gamesApi';

const route = useRoute();

// 響應式數據
const selectedAlliance = ref(1);
const selectedGame = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const games = ref<Game[]>([]);
const battleData = ref<BattleData | null>(null);

// 方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  selectedGame.value = null;
  loadGames(allianceId);
}

function selectGame(gameId: string) {
  selectedGame.value = gameId;
  loadBattleData(gameId);
}

function backToList() {
  selectedGame.value = null;
}

async function loadGames(allianceId: number) {
  loading.value = true;
  errorMessage.value = '';

  try {
    const gameList = await gamesApi.getGamesList(allianceId);
    games.value = gameList;
  } catch (error) {
    errorMessage.value = '載入賽事列表失敗';
    console.error('Failed to load games:', error);
  } finally {
    loading.value = false;
  }
}

async function loadBattleData(gameId: string) {
  loading.value = true;
  errorMessage.value = '';

  try {
    const data = await gamesApi.getBattleData(gameId);
    battleData.value = data;
  } catch (error) {
    errorMessage.value = '載入對戰資料失敗';
    console.error('Failed to load battle data:', error);
  } finally {
    loading.value = false;
  }
}

// 監聽路由參數
watch(() => route.params.gameId, (newGameId) => {
  if (newGameId) {
    selectedGame.value = newGameId as string;
    loadBattleData(newGameId as string);
  } else {
    selectedGame.value = null;
  }
});

onMounted(() => {
  // 從路由參數初始化
  const gameId = route.params.gameId as string;
  if (gameId) {
    selectedGame.value = gameId;
    loadBattleData(gameId);
  } else {
    loadGames(selectedAlliance.value);
  }
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

.battle-header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.team-name {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.team-short {
  opacity: 0.8;
  font-size: 0.9rem;
}

.battle-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.pitcher-card, .team-stats-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: #f8f9fa;
}

.pitcher-card h4, .team-stats-card h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-item .label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-item .value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #3498db;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
}

.record-item .date {
  width: 60px;
  color: #666;
}

.record-item .opponent {
  flex: 1;
  text-align: center;
}

.record-item .result {
  width: 30px;
  text-align: center;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 3px;
}

.record-item .result.win {
  background: #d4edda;
  color: #155724;
}

.record-item .result.loss {
  background: #f8d7da;
  color: #721c24;
}

.record-item .score {
  width: 50px;
  text-align: right;
  font-weight: bold;
}

@media (max-width: 768px) {
  .tag-league-boxall {
    flex-direction: column;
  }

  .battle-header .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
