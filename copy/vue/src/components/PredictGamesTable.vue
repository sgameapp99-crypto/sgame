<template>
  <div class="predictgamebox" :aria-busy="existingPredictionsLoading">
    <div class="menugroupbox">
      <div class="menugroupbox-top"></div>
      <div class="menugroupbox-con">
        <form id="predict_form" method="post" action="" class="jqtransformdone">
          <div class="predict-table-scroll" aria-live="polite">
            <table border="0" cellspacing="0" cellpadding="0" class="predictgame-table">
              <tbody>
              <tr>
                <th rowspan="2" scope="col" class="th-gameinfo">賽事資訊</th>
                <th rowspan="2" scope="col" class="th-teaminfo">球隊資訊</th>
                <th colspan="2" scope="col" class="th-universal">國際盤</th>
                <th colspan="3" scope="col" class="th-bank">運彩盤</th>
              </tr>
              <tr>
                <th class="th-universal-bet01">
                  <a href="/views/predictgame/rules_gametype_11.php" class="universal_rules_box cboxElement">
                    讓分
                  </a>
                </th>
                <th class="th-universal-bet02">
                  <a href="/views/predictgame/rules_gametype_12.php" class="universal_rules_box cboxElement">
                    大小
                  </a>
                </th>
                <th class="th-bank-bet01">讓分</th>
                <th class="th-bank-bet03">不讓分</th>
                <th class="th-bank-bet02">大小</th>
              </tr>

              <!-- 賽事列表 -->
              <template v-for="(game, gameIndex) in games" :key="game.gameId">
                <!-- 客隊行 -->
                <tr :gameid="game.gameId" class="">
                  <td rowspan="2" class="td-gameinfo">
                    <div class="gameinfo-header">
                      <div class="gameinfo-meta">
                        <h3>{{ gameIndex + 1 }}</h3>
                        <h4>PM {{ game.gameTime }}</h4>
                        <p>
                          <a :href="`/gamesData/battle?gameid=${game.gameId}&allianceid=${selectedAlliance}&gameday=${formatDate(selectedDate)}&from=predict_games`" target="new">
                            對戰資訊
                          </a>
                        </p>
                      </div>
                      <PredictionStatsBadge
                        :game-id="game.gameId"
                        :home-team="game.homeTeam.name"
                        :away-team="game.awayTeam.name"
                        trigger-class="stats-badge-link"
                        unstyled
                      />
                    </div>
                  </td>

                  <td class="td-teaminfo js-closed-hint" :style="{}">
                    <div>
                      <h3>
                        <a :href="`/gamesData/teams?allianceid=${selectedAlliance}&teamid=${game.awayTeam.id}&from=predict_games#historyGame`" target="_blank">{{ game.awayTeam.name }}</a>
                      </h3>
                      <p>{{ game.awayTeam.pitcher }}</p>
                    </div>
                  </td>

                  <!-- 國際盤 - 讓分 -->
                  <td class="td-universal-bet01" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`iap${gameIndex}`"
                        value="2"
                        :id="`iap${gameIndex}_${gameIndex}_away`"
                        @change="handlePredictionChange(game.gameId, 'international_spread', 'away', '2')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'international_spread')"
                      >
                      <label :for="`iap${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">客</strong>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'international_spread')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 國際盤 - 大小 -->
                  <td class="td-universal-bet02" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`ibp${gameIndex}`"
                        value="1"
                        :id="`ibp${gameIndex}_${gameIndex}_away`"
                        @change="handlePredictionChange(game.gameId, 'international_total', 'over', '1')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'international_total')"
                      >
                      <label :for="`ibp${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">大</strong>
                        <span class="data-wrap">
                          <strong>{{ game.internationalOdds.total.over.line }}輸</strong>
                          <span>50%</span>
                        </span>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'international_total')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 讓分 -->
                  <td class="td-bank-bet01" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`ap${gameIndex}`"
                        value="2"
                        :id="`ap${gameIndex}_${gameIndex}_away`"
                        @change="handlePredictionChange(game.gameId, 'taiwan_spread', 'away', '2')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'taiwan_spread')"
                      >
                      <label :for="`ap${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">客</strong>
                        <span class="data-wrap">
                          <strong>{{ game.taiwanOdds.spread.away.line }}</strong>
                          <span>, {{ game.taiwanOdds.spread.away.odds }}</span>
                        </span>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'taiwan_spread')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 不讓分 -->
                  <td class="td-bank-bet03" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`pkp${gameIndex}`"
                        value="2"
                        :id="`pkp${gameIndex}_${gameIndex}_away`"
                        @change="handlePredictionChange(game.gameId, 'taiwan_moneyline', 'away', '2')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'taiwan_moneyline')"
                      >
                      <label :for="`pkp${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">客</strong>
                        <span class="data-wrap">
                          <strong></strong>
                          <span>{{ game.taiwanOdds.moneyline.away.odds }}</span>
                        </span>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'taiwan_moneyline')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 大小 -->
                  <td class="td-bank-bet02" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`bp${gameIndex}`"
                        value="1"
                        :id="`bp${gameIndex}_${gameIndex}_away`"
                        @change="handlePredictionChange(game.gameId, 'taiwan_total', 'over', '1')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'taiwan_total')"
                      >
                      <label :for="`bp${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">大</strong>
                        <span class="data-wrap">
                          <strong>{{ game.taiwanOdds.total.over.line }}</strong>
                          <span>, {{ game.taiwanOdds.total.over.odds }}</span>
                        </span>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'taiwan_total')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>
                </tr>

                <!-- 主隊行 -->
                <tr :gameid="game.gameId" class="">
                  <td class="td-teaminfo js-closed-hint" :style="{}">
                    <div>
                      <h3>
                        <a :href="`/gamesData/teams?allianceid=${selectedAlliance}&teamid=${game.homeTeam.id}&from=predict_games#historyGame`" target="_blank">{{ game.homeTeam.name }}</a>
                      </h3>
                      <p>{{ game.homeTeam.pitcher }}</p>
                    </div>
                  </td>

                  <!-- 國際盤 - 讓分 -->
                  <td class="td-universal-bet01" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`iap${gameIndex}`"
                        value="1"
                        :id="`iap${gameIndex}_${gameIndex}_home`"
                        @change="handlePredictionChange(game.gameId, 'international_spread', 'home', '1')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'international_spread')"
                      >
                      <label :for="`iap${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">主</strong>
                        <span class="data-wrap">
                          <strong>{{ game.internationalOdds.spread.home.line }}分贏</strong>
                          <span>50%</span>
                        </span>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'international_spread')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 國際盤 - 大小 -->
                  <td class="td-universal-bet02" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`ibp${gameIndex}`"
                        value="2"
                        :id="`ibp${gameIndex}_${gameIndex}_home`"
                        @change="handlePredictionChange(game.gameId, 'international_total', 'under', '2')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'international_total')"
                      >
                      <label :for="`ibp${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">小</strong>
                        <strong></strong>
                        <span></span>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'international_total')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 讓分 -->
                  <td class="td-bank-bet01" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`ap${gameIndex}`"
                        value="1"
                        :id="`ap${gameIndex}_${gameIndex}_home`"
                        @change="handlePredictionChange(game.gameId, 'taiwan_spread', 'home', '1')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'taiwan_spread')"
                      >
                      <label :for="`ap${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">主</strong>
                        <span class="data-wrap">
                          <strong>{{ game.taiwanOdds.spread.home.line }}</strong>
                          <span>, {{ game.taiwanOdds.spread.home.odds }}</span>
                        </span>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'taiwan_spread')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 不讓分 -->
                  <td class="td-bank-bet03" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`pkp${gameIndex}`"
                        value="1"
                        :id="`pkp${gameIndex}_${gameIndex}_home`"
                        @change="handlePredictionChange(game.gameId, 'taiwan_moneyline', 'home', '1')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'taiwan_moneyline')"
                      >
                      <label :for="`pkp${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">主</strong>
                        <span class="data-wrap">
                          <strong></strong>
                          <span>{{ game.taiwanOdds.moneyline.home.odds }}</span>
                        </span>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'taiwan_moneyline')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 大小 -->
                  <td class="td-bank-bet02" style="cursor: pointer;">
                    <div>
                      <input
                        type="radio"
                        :name="`bp${gameIndex}`"
                        value="2"
                        :id="`bp${gameIndex}_${gameIndex}_home`"
                        @change="handlePredictionChange(game.gameId, 'taiwan_total', 'under', '2')"
                        class="prediction-radio"
                        :disabled="isPredictionDisabled(game.gameId, 'taiwan_total')"
                      >
                      <label :for="`bp${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">小</strong>
                        <span class="data-wrap">
                          <strong>{{ game.taiwanOdds.total.under.line }}</strong>
                          <span>, {{ game.taiwanOdds.total.under.odds }}</span>
                        </span>
                        <span
                          v-if="isPredictionLocked(game.gameId, 'taiwan_total')"
                          class="existing-badge"
                        >
                          已提交
                        </span>
                        <span
                          v-else-if="isGameStarted(game.gameId)"
                          class="game-started-badge"
                        >
                          比賽已開始
                        </span>
                      </label>
                    </div>
                  </td>
                </tr>

                <!-- 分隔行 -->
                <tr class="gaprow">
                  <td colspan="7" scope="row">&nbsp;</td>
                </tr>

                <!-- 隱藏輸入 -->
                <input type="hidden" :name="`row${gameIndex}`" :value="game.gameId">
              </template>

              <!-- 提交區域 -->
              <tr>
                <td colspan="7">
                  <!-- 未登入狀態 -->
                  <div v-if="!session.loggedIn" class="div-submitpredict" id="div-submit" style="z-index: 0; position: static; bottom: 0px; top: auto;">
                    <a @click="$router.push('/login')" class="headerLoginButton" style="cursor: pointer;">
                      <h3>預測賽事請先登入</h3>
                    </a>
                  </div>
                  <!-- 已登入狀態 -->
                  <div v-else class="div-submitpredict" id="div-submit" style="z-index: 0; position: static; bottom: 0px; top: auto;">
                    <div class="submit-prediction-bar">
                      <div class="selected-count">
                        已選擇 <strong>{{ selectedCount }}</strong> 場賽事預測
                      </div>
                      <button 
                        type="button" 
                        class="btn-submit-prediction" 
                        :disabled="selectedCount === 0 || submitting"
                        @click="handleSubmitPredictions"
                      >
                        <span v-if="!submitting">
                          <i class="fas fa-paper-plane"></i> 提交預測
                        </span>
                        <span v-else>
                          <i class="fas fa-spinner fa-spin"></i> 提交中...
                        </span>
                      </button>
                    </div>

                    <div v-if="pendingFeaturedOptions.length > 0" class="featured-toggle-row">
                      <button
                        type="button"
                        class="btn-featured-toggle"
                        :disabled="submitting"
                        @click="toggleFeaturedSelector"
                      >
                        <i class="fas" :class="showFeaturedSelector ? 'fa-chevron-up' : 'fa-star'"></i>
                        {{ showFeaturedSelector ? '收合主推設定' : '指定主推' }}
                      </button>
                    </div>

                    <transition name="featured-collapse">
                      <div
                        v-if="showFeaturedSelector && pendingFeaturedOptions.length > 0"
                        class="featured-selector"
                      >
                        <div class="featured-selector__header">
                          <div>
                            <span class="featured-selector__label">同時指定主推</span>
                            <p class="featured-selector__hint">
                              同時間僅能有一筆主推，選定後會自動替換現有主推。
                            </p>
                          </div>
                          <span class="featured-selector__limit">最多 200 字備註</span>
                        </div>
                        <select v-model="featuredPendingKey" class="featured-selector__dropdown">
                          <option value="">不設定主推</option>
                          <option
                            v-for="option in pendingFeaturedOptions"
                            :key="option.key"
                            :value="option.key"
                          >
                            {{ option.description }}
                          </option>
                        </select>
                        <textarea
                          v-model="featuredNote"
                          class="featured-selector__note"
                          :maxlength="200"
                          :disabled="!featuredPendingKey"
                          placeholder="主推備註（可選）"
                        />
                      </div>
                    </transition>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          <input type="hidden" name="allianceid" :value="selectedAlliance">
          <input type="hidden" name="gamerow" :value="games.length">
          <input type="hidden" name="categorytype" value="1">
        </form>
      </div>
      <div class="menugroupbox-bottom"></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="PredictGamesTable">
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';
import { predictionsAPI } from '../api';
import type { Game } from '../types/game';
import type { Prediction as PredictionRecord } from '../types/prediction';
import { PREDICTION_TYPE_LABELS, PREDICTION_SELECTION_LABELS } from '../types/prediction';
import PredictionStatsBadge from './games/PredictionStatsBadge.vue';

const props = defineProps<{
  games: Game[];
  selectedAlliance: number;
  selectedDate: Date;
  selectedStatusType: 'finished' | 'live' | 'scheduled';
  existingPredictions: Record<string, PredictionRecord>;
  existingPredictionsLoading: boolean;
}>();

// 定義 Emits
const emit = defineEmits<{
  'select-prediction': [prediction: any];
  'submit-success': [message: string];
  'submit-error': [message: string];
}>();

// Store & Router
const session = useSessionStore();
const router = useRouter();

// 響應式數據：追蹤每個游戲的預測選擇
interface PendingPrediction {
  gameId: string;
  type: 'international_spread' | 'international_total' | 'taiwan_spread' | 'taiwan_moneyline' | 'taiwan_total';
  selection: 'home' | 'away' | 'over' | 'under';
  value: string;
}

const predictions = ref<Record<string, PendingPrediction>>({});
const submitting = ref(false);
const featuredPendingKey = ref<string>('');
const featuredNote = ref('');
const showFeaturedSelector = ref(false);

interface PendingFeaturedOption {
  key: string;
  description: string;
}

const pendingFeaturedOptions = computed<PendingFeaturedOption[]>(() => {
  return Object.entries(predictions.value)
    .filter(([key, pred]) => !isPredictionLocked(pred.gameId, pred.type))
    .map(([key, pred]) => {
      const game = props.games.find((g) => g.gameId === pred.gameId);
      const teams = game ? `${game.awayTeam.name} @ ${game.homeTeam.name}` : pred.gameId;
      const typeLabel = PREDICTION_TYPE_LABELS[pred.type] ?? pred.type;
      const selectionLabel = PREDICTION_SELECTION_LABELS[pred.selection] ?? pred.selection;
      return {
        key,
        description: `${teams}｜${typeLabel}｜${selectionLabel}`,
      };
    });
});

function getPredictionKey(gameId: string, type: PendingPrediction['type']) {
  return `${gameId}__${type}`;
}

function isPredictionLocked(gameId: string, type: PendingPrediction['type']) {
  const key = getPredictionKey(gameId, type);
  return Boolean(props.existingPredictions?.[key]);
}

// 檢查比賽是否已開始或已結束（禁止預測）
function isGameStarted(gameId: string): boolean {
  const game = props.games.find(g => g.gameId === gameId);
  if (!game) return false;
  return game.status === 'live' || game.status === 'finished';
}

// 檢查預測是否應該被禁用（已提交或比賽已開始）
function isPredictionDisabled(gameId: string, type: PendingPrediction['type']): boolean {
  return isPredictionLocked(gameId, type) || isGameStarted(gameId);
}

// 計算選擇的預測數量
const selectedCount = computed(() => {
  // 計算有多少個不同的 gameId
  const gameIds = new Set<string>();
  Object.values(predictions.value).forEach(p => {
    if (!isPredictionLocked(p.gameId, p.type)) {
      gameIds.add(p.gameId);
    }
  });
  return gameIds.size;
});

watch(
  () => props.existingPredictions,
  (newMap) => {
    if (!newMap) return;
    let mutated = false;
    Object.keys(predictions.value).forEach((key) => {
      if (newMap[key]) {
        delete predictions.value[key];
        mutated = true;
      }
    });
    if (mutated) {
      // 移除已存在的預測，避免重複提交
    }
  },
  { deep: true }
);

watch(pendingFeaturedOptions, (options) => {
  if (!options.some((option) => option.key === featuredPendingKey.value)) {
    featuredPendingKey.value = '';
    featuredNote.value = '';
  }
  if (options.length === 0) {
    showFeaturedSelector.value = false;
  }
});
function toggleFeaturedSelector() {
  if (pendingFeaturedOptions.value.length === 0) {
    showFeaturedSelector.value = false;
    return;
  }
  showFeaturedSelector.value = !showFeaturedSelector.value;
}


// 工具函數
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 事件處理函數
function handlePredictionChange(gameId: string, type: PendingPrediction['type'], selection: PendingPrediction['selection'], value: string) {
  if (isGameStarted(gameId)) {
    emit('submit-error', '比賽已開始或已結束，無法進行預測');
    return;
  }
  
  if (isPredictionLocked(gameId, type)) {
    emit('submit-error', '已對該賽事建立過相同玩法的預測，無需重複提交');
    return;
  }

  const prediction: PendingPrediction = {
    gameId,
    type,
    selection,
    value
  };

  predictions.value[getPredictionKey(gameId, type)] = prediction;

  // 發送事件給父組件
  emit('select-prediction', prediction);
}

// 提交預測
async function handleSubmitPredictions() {
  const pendingPredictions = Object.values(predictions.value).filter(pred => !isPredictionLocked(pred.gameId, pred.type));

  if (pendingPredictions.length === 0) {
    emit('submit-error', '已對所選賽事建立過相同玩法的預測，無需重複提交');
    return;
  }

  submitting.value = true;
  const selectedFeaturedKey = featuredPendingKey.value;
  const featuredNotePayload = featuredNote.value.trim();
  const featureRequested = Boolean(selectedFeaturedKey);
  let featuredPredictionId: number | null = null;

  try {
    // 將預測按 gameId 分組
    const predictionsByGame: Record<string, PendingPrediction[]> = {};
    pendingPredictions.forEach(p => {
      if (!predictionsByGame[p.gameId]) {
        predictionsByGame[p.gameId] = [];
      }
      predictionsByGame[p.gameId].push(p);
    });

    // 逐個提交預測
    const results = [];
    for (const [gameId, gamePredictions] of Object.entries(predictionsByGame)) {
      for (const pred of gamePredictions) {
        try {
          // 找到對應的賽事以獲取賠率
          const game = props.games.find(g => g.gameId === gameId);
          let odds = '1.90'; // 預設賠率

          if (game) {
            // 根據預測類型和選擇獲取正確的賠率
            if (pred.type === 'international_spread') {
              odds = pred.selection === 'home' 
                ? game.internationalOdds.spread.home.odds 
                : game.internationalOdds.spread.away.odds;
            } else if (pred.type === 'international_total') {
              odds = pred.selection === 'over' 
                ? game.internationalOdds.total.over.odds 
                : game.internationalOdds.total.under.odds;
            } else if (pred.type === 'taiwan_spread') {
              odds = pred.selection === 'home' 
                ? game.taiwanOdds.spread.home.odds 
                : game.taiwanOdds.spread.away.odds;
            } else if (pred.type === 'taiwan_moneyline') {
              odds = pred.selection === 'home' 
                ? game.taiwanOdds.moneyline.home.odds 
                : game.taiwanOdds.moneyline.away.odds;
            } else if (pred.type === 'taiwan_total') {
              odds = pred.selection === 'over' 
                ? game.taiwanOdds.total.over.odds 
                : game.taiwanOdds.total.under.odds;
            }
          }

          const requestData = {
            gameId: pred.gameId,
            predictionType: pred.type,
            selection: pred.selection,
            odds: odds,
            price: 100, // 預設價格，可以從設定中獲取
            isMainPick: false
          };

          const result = await predictionsAPI.createPrediction(requestData);
          results.push(result);

          const predKey = getPredictionKey(pred.gameId, pred.type);
          if (selectedFeaturedKey && predKey === selectedFeaturedKey) {
            featuredPredictionId = result?.predictionId ?? null;
          }
        } catch (e: any) {
          console.error(`提交預測失敗 (${gameId}):`, e);
          throw e;
        }
      }
    }

    // 提交成功
    if (featuredPredictionId) {
      try {
        await predictionsAPI.featurePrediction(
          featuredPredictionId,
          featuredNotePayload ? { note: featuredNotePayload } : undefined
        );
      } catch (featureError) {
        console.error('設定主推失敗:', featureError);
        emit('submit-error', '預測建立成功，但主推設定失敗，請稍後在會員中心重新設定。');
        return;
      }
    }

    const successMessage = featureRequested && featuredPredictionId
      ? `成功提交 ${results.length} 筆預測，並更新主推！`
      : `成功提交 ${results.length} 筆預測！`;
    emit('submit-success', successMessage);

    // 清空選擇
    predictions.value = {};
    featuredPendingKey.value = '';
    featuredNote.value = '';
    showFeaturedSelector.value = false;
    
    // 清除所有 radio 選項
    const form = document.getElementById('predict_form') as HTMLFormElement;
    if (form) {
      const radios = form.querySelectorAll('input[type="radio"]');
      radios.forEach((radio: any) => {
        radio.checked = false;
      });
    }
  } catch (e: any) {
    const code = e?.response?.data?.code;
    const message = e?.response?.data?.message;
    const status = e?.response?.status;
    
    console.error('提交預測失敗:', e);
    
    if (status === 500) {
      emit('submit-error', '伺服器錯誤，請稍後再試或聯絡管理員');
    } else if (code === 'GAME_STARTED') {
      emit('submit-error', '賽事已開始，無法建立預測');
    } else if (code === 'PREDICTION_EXISTS') {
      emit('submit-error', '已對部分賽事建立過相同類型的預測');
    } else if (code === 'GAME_NOT_FOUND') {
      emit('submit-error', '賽事不存在或已被移除');
    } else if (code === 'UNAUTHORIZED') {
      emit('submit-error', '登入已過期，請重新登入');
    } else {
      emit('submit-error', message || '提交預測失敗，請稍後再試');
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
/* 預測遊戲表格樣式 */

:deep(.jqTransformHidden:checked + .jqTransformRadio::before) {
  background: #0066cc !important;
}
.predictgamebox {
  margin-top: 20px;
}

.menugroupbox {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.menugroupbox-top {
  height: 10px;
  background: linear-gradient(to right, #1e3c72, #2a5298);
}

.menugroupbox-con {
  padding: 20px;
}

.predict-table-scroll {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e4e9f2;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  background: #ffffff;
  margin-top: 8px;
  -webkit-overflow-scrolling: touch;
}

.predict-table-scroll::-webkit-scrollbar {
  height: 8px;
}

.predict-table-scroll::-webkit-scrollbar-thumb {
  background: rgba(9, 90, 139, 0.35);
  border-radius: 999px;
}

.predictgame-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  min-width: 960px;
}

@media (max-width: 1024px) {
  .predictgame-table {
    min-width: 840px;
  }
}

.predictgame-table th {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 12px 8px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}

.predictgame-table td {
  border: 1px solid #ddd;
  padding: 8px;
  vertical-align: middle;
}

.featured-toggle-row {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.btn-featured-toggle {
  border: 1px solid #cbd5f5;
  background: #f8f9ff;
  color: #1d4ed8;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease, color 0.2s ease;
}

.btn-featured-toggle:hover {
  background: #e0e7ff;
}

.btn-featured-toggle i {
  font-size: 12px;
}

.featured-selector {
  margin-top: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.featured-selector__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.featured-selector__label {
  font-weight: 600;
  color: #0f172a;
}

.featured-selector__hint {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
}

.featured-selector__limit {
  font-size: 12px;
  color: #94a3b8;
}

.featured-selector__dropdown {
  width: 100%;
  border: 1px solid #cbd5f5;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  background: #fff;
}

.featured-selector__note {
  width: 100%;
  min-height: 60px;
  border: 1px solid #cbd5f5;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  resize: vertical;
  background: #fff;
}

.featured-selector__note:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.featured-collapse-enter-active,
.featured-collapse-leave-active {
  transition: all 0.2s ease;
}

.featured-collapse-enter-from,
.featured-collapse-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.th-gameinfo {
  width: 80px;
  min-width: 80px;
}

.th-teaminfo {
  width: 150px;
  min-width: 150px;
}

.th-universal,
.th-bank {
  background: #e8f4f8;
}

.th-universal-bet01,
.th-universal-bet02,
.th-bank-bet01,
.th-bank-bet02,
.th-bank-bet03 {
  width: 120px;
  min-width: 120px;
}

.td-gameinfo {
  text-align: center;
  background: #f8f9fa;
}

.gameinfo-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.gameinfo-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stats-badge-link {
  color: #0f4af2;
  font-size: 12px;
  text-decoration: underline;
  padding: 0;
}

.stats-badge-link:hover {
  color: #163dd6;
}

.td-gameinfo h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #333;
}

.td-gameinfo h4 {
  font-size: 14px;
  color: #666;
  margin: 0 0 5px 0;
}

.td-gameinfo p {
  margin: 0;
}

.td-gameinfo a {
  color: #0066cc;
  text-decoration: none;
  font-size: 12px;
}

.td-gameinfo a:hover {
  text-decoration: underline;
}

.stats-badge-link {
  align-self: center;
}

@media (min-width: 768px) {
  .gameinfo-header {
    align-items: stretch;
  }

  .gameinfo-meta {
    align-items: flex-start;
  }

  .stats-badge-link {
    align-self: flex-start;
  }
}

.td-teaminfo {
  text-align: left;
}

.td-teaminfo h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.td-teaminfo h3 a {
  color: #333;
  text-decoration: none;
}

.td-teaminfo h3 a:hover {
  color: #0066cc;
}

.td-teaminfo p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.td-universal-bet01,
.td-universal-bet02,
.td-bank-bet01,
.td-bank-bet02,
.td-bank-bet03 {
  text-align: center;
  position: relative;
}

/* 預測選項樣式 */
.prediction-radio {
  margin-right: 5px;
  cursor: pointer;
}

.prediction-label {
  cursor: pointer;
  display: inline-block;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.prediction-label:hover {
  background-color: #f0f8ff;
}

.team-side {
  display: inline-block;
  min-width: 20px;
  font-weight: bold;
  color: #333;
}

.data-wrap {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  color: #666;
}

.data-wrap strong {
  color: #d00;
  font-weight: bold;
}

.data-wrap span {
  color: #666;
}

.existing-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  margin-left: 6px;
  background: #fef3c7;
  color: #b45309;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.game-started-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  margin-left: 6px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.gaprow {
  height: 10px;
}

.gaprow td {
  background: #f8f9fa;
  border: none;
}

.div-submitpredict {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
}

.headerLoginButton {
  display: inline-block;
  background: #ff6b35;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}

.headerLoginButton:hover {
  background: #e55a2b;
}

.headerLoginButton h3 {
  margin: 0;
  font-size: 16px;
}

/* 響應式設計 */
/* 提交預測按鈕區域 */
.submit-prediction-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.selected-count {
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.selected-count strong {
  font-size: 24px;
  font-weight: bold;
  margin: 0 4px;
}

.btn-submit-prediction {
  padding: 12px 32px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-submit-prediction:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  background: #f8f9fa;
}

.btn-submit-prediction:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit-prediction:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #e0e0e0;
  color: #999;
}

.btn-submit-prediction i {
  margin-right: 8px;
}

.btn-submit-prediction .fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .menugroupbox-con {
    padding: 10px;
  }

  .predictgame-table {
    font-size: 12px;
    min-width: 720px;
  }

  .predictgame-table th,
  .predictgame-table td {
    padding: 4px;
  }

  .th-gameinfo,
  .th-teaminfo {
    width: auto;
    min-width: auto;
  }

  .th-universal-bet01,
  .th-universal-bet02,
  .th-bank-bet01,
  .th-bank-bet02,
  .th-bank-bet03 {
    width: auto;
    min-width: auto;
  }
  
  .submit-prediction-bar {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  
  .selected-count {
    font-size: 14px;
  }
  
  .btn-submit-prediction {
    width: 100%;
    padding: 10px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .predictgame-table {
    min-width: 640px;
  }
}
</style>
