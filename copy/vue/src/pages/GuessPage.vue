<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">玩競猜</div>

    <!-- 彩幣餘額顯示 -->
    <div v-if="isLoggedIn" class="bet-info mb-md">
      <div class="bet-balance">
        <img src="/images/cash.png" alt="彩幣" class="cash-icon">
        彩幣餘額：{{ cashBalance }}
      </div>
      <div v-if="showDailyLimit" class="bet-daily-limit">
        今日剩餘遊戲額度：{{ dailyLimit }}
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
                  <span class="game__tag" v-if="isAllianceInPlay(1)">走</span>
                  MLB
                </li>
                <li :class="{ 'nonepredict': !allianceHasGames(2) }">
                  <span class="game__tag" v-if="isAllianceInPlay(2)">走</span>
                  <a href="#" @click.prevent="selectAlliance(2)">日棒</a>
                </li>
                <li :class="{ 'nonepredict': !allianceHasGames(6) }">
                  <span class="game__tag" v-if="isAllianceInPlay(6)">走</span>
                  <a href="#" @click.prevent="selectAlliance(6)">中職</a>
                </li>
                <li :class="{ 'nonepredict': !allianceHasGames(9) }">
                  <span class="game__tag" v-if="isAllianceInPlay(9)">走</span>
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
                <li :class="{ 'nonepredict': !allianceHasGames(7) }">
                  <span class="game__tag" v-if="isAllianceInPlay(7)">走</span>
                  <a href="#" @click.prevent="selectAlliance(7)">WNBA</a>
                </li>
                <li :class="{ 'nonepredict': !allianceHasGames(97) }">
                  <span class="game__tag" v-if="isAllianceInPlay(97)">走</span>
                  <a href="#" @click.prevent="selectAlliance(97)">日籃</a>
                </li>
                <li :class="{ 'nonepredict': !allianceHasGames(110) }">
                  <span class="game__tag" v-if="isAllianceInPlay(110)">走</span>
                  <a href="#" @click.prevent="selectAlliance(110)">國際籃賽</a>
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
                <li :class="{ 'nonepredict': !allianceHasGames(4) }">
                  <span class="game__tag" v-if="isAllianceInPlay(4)">走</span>
                  <a href="#" @click.prevent="selectAlliance(4)">足球</a>
                </li>
                <li :class="{ 'nonepredict': !allianceHasGames(91) }">
                  <span class="game__tag" v-if="isAllianceInPlay(91)">走</span>
                  <a href="#" @click.prevent="selectAlliance(91)">NHL冰球</a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 競猜遊戲區域 -->
    <div class="guess-games">
      <div v-if="loading" class="text-center py-xl">載入中...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center py-xl">{{ errorMessage }}</div>
      <div v-else>
        <div v-if="games.length === 0" class="text-center py-xl text-neutral-600">
          目前沒有進行中的競猜遊戲
        </div>
        <div v-else class="games-grid">
          <div v-for="game in games" :key="game.id" class="game-card">
            <div class="game-header">
              <h3 class="game-title">{{ game.homeTeam }} vs {{ game.awayTeam }}</h3>
              <div class="game-time">{{ game.time }}</div>
            </div>
            <div class="game-options">
              <button
                v-for="option in game.options"
                :key="option.id"
                class="option-btn"
                :class="{ selected: selectedOptions[game.id] === option.id }"
                @click="selectOption(game.id, option.id)"
              >
                {{ option.text }}
                <span class="odds">{{ option.odds }}</span>
              </button>
            </div>
            <div class="game-actions">
              <button class="btn btn-primary" @click="placeBet(game.id)">下注</button>
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
import { useSessionStore } from '../stores/session';

const route = useRoute();
const session = useSessionStore();

// 響應式數據
const selectedAlliance = ref(1);
const loading = ref(false);
const errorMessage = ref('');
const cashBalance = ref(1000);
const dailyLimit = ref(500);
const selectedOptions = ref<Record<number, number>>({});

// 模擬遊戲數據
const games = ref([
  {
    id: 1,
    homeTeam: '道奇',
    awayTeam: '巨人',
    time: '2025-01-15 19:00',
    options: [
      { id: 1, text: '道奇勝', odds: '1.85' },
      { id: 2, text: '巨人勝', odds: '2.10' },
      { id: 3, text: '和局', odds: '8.50' }
    ]
  },
  {
    id: 2,
    homeTeam: '湖人',
    awayTeam: '勇士',
    time: '2025-01-15 22:00',
    options: [
      { id: 4, text: '湖人勝', odds: '1.75' },
      { id: 5, text: '勇士勝', odds: '2.20' }
    ]
  }
]);

// 計算屬性
const isLoggedIn = computed(() => session.loggedIn);
const showDailyLimit = computed(() => true); // 模擬顯示每日限額

// 方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  loadGames(allianceId);
}

function isAllianceInPlay(allianceId: number): boolean {
  // 模擬檢查聯盟是否有進行中的比賽
  return Math.random() > 0.5;
}

function allianceHasGames(allianceId: number): boolean {
  // 模擬檢查聯盟是否有遊戲
  return true;
}

function selectOption(gameId: number, optionId: number) {
  selectedOptions.value[gameId] = optionId;
}

function placeBet(gameId: number) {
  const selectedOption = selectedOptions.value[gameId];
  if (!selectedOption) {
    alert('請先選擇投注選項');
    return;
  }

  alert(`投注成功！遊戲ID: ${gameId}, 選項ID: ${selectedOption}`);
}

async function loadGames(allianceId: number) {
  loading.value = true;
  errorMessage.value = '';

  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500));

    // 根據聯盟ID加載不同的遊戲
    // 這裡使用模擬數據，實際應該調用API

  } catch (error) {
    errorMessage.value = '載入遊戲失敗，請稍後再試';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // 從路由參數獲取聯盟ID
  const allianceId = parseInt(route.params.allianceId as string) || 1;
  selectAlliance(allianceId);
});
</script>

<style scoped>
.bet-info {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.bet-balance, .bet-daily-limit {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.cash-icon {
  width: 20px;
  height: 20px;
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

.nonepredict {
  opacity: 0.6;
}

.game__tag {
  background: red;
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 4px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.game-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.game-header {
  margin-bottom: 16px;
}

.game-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: bold;
}

.game-time {
  color: #666;
  font-size: 14px;
}

.game-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.option-btn {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.option-btn:hover {
  border-color: #667eea;
}

.option-btn.selected {
  border-color: #667eea;
  background: #f0f2ff;
}

.odds {
  color: #667eea;
  font-weight: bold;
}

.game-actions {
  text-align: center;
}

@media (max-width: 768px) {
  .tag-league-boxall {
    flex-direction: column;
  }

  .games-grid {
    grid-template-columns: 1fr;
  }
}
</style>
