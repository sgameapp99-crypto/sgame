<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">預測/買牌</div>
    <div v-if="loading" class="mt-md">載入中…</div>
    <div v-else-if="errorMessage" class="mt-md text-red-600">{{ errorMessage }}</div>
    <div v-else>
      <!-- 聯盟選單 -->
      <AllianceMenu
        :selected-alliance="selectedAlliance"
        :selected-soccer-league="selectedSoccerLeague"
        :selected-status-type="selectedStatusType"
        :baseball-expanded="baseballExpanded"
        :basketball-expanded="basketballExpanded"
        :other-expanded="otherExpanded"
        :soccer-leagues-expanded="soccerLeaguesExpanded"
        :show-time-selector="true"
        :date-options-filter="['today', 'tomorrow']"
        :calendar-visible="calendarVisible"
        :current-month="currentMonth"
        :selected-date="selectedDate"
        :calendar-dates="calendarDates"
        @select-alliance="handleAllianceSelect"
        @select-soccer-league="handleSoccerLeagueSelect"
        @select-date-option="handleDateOptionSelect"
        @toggle-baseball-expanded="handleToggleBaseballExpanded"
        @toggle-basketball-expanded="handleToggleBasketballExpanded"
        @toggle-other-expanded="handleToggleOtherExpanded"
        @toggle-calendar="calendarVisible = !calendarVisible"
        @select-date="handleDateSelect"
        @prev-month="handlePrevMonth"
        @next-month="handleNextMonth"
        @close-calendar="calendarVisible = false"
      />

      <!-- 提交訊息提示 -->
      <div v-if="submitMessage" class="submit-message" :class="{ success: submitSuccess, error: !submitSuccess }">
        <div class="message-icon">{{ submitSuccess ? '✓' : '✗' }}</div>
        <div class="message-text">{{ submitMessage }}</div>
      </div>

      <!-- 賽事列表 -->
      <div v-if="filteredGames.length === 0" class="no-games-message">
        <div class="text-center py-xl">
          <h3 class="text-gray-600 text-xl font-medium">今日無賽事</h3>
          <p class="text-gray-500 mt-md">請選擇其他聯盟或日期查看賽事</p>
        </div>
      </div>
      <PredictGamesTable
        v-else
        :games="filteredGames"
        :selected-alliance="selectedAlliance"
        :selected-date="selectedDate"
        :selected-status-type="selectedStatusType"
        :existing-predictions="existingPredictions"
        :existing-predictions-loading="existingPredictionsLoading"
        @select-prediction="handlePredictionSelect"
        @submit-success="handleSubmitSuccess"
        @submit-error="handleSubmitError"
      />
    </div>
  </div>
</template>

<style scoped>
.submit-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 15px;
  animation: slideIn 0.3s ease-out;
}

.submit-message.success {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.submit-message.error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
}

.message-icon {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
}

.message-text {
  flex: 1;
  font-weight: 500;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-games-message {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-top: 20px;
}
</style>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gamesAPI, predictionsAPI } from '../api';
import { useSessionStore } from '../stores/session';
import AllianceMenu from '../components/AllianceMenu.vue';
import PredictGamesTable from '../components/PredictGamesTable.vue';
import type { Game } from '../types/game';
import type { PredictionType, PredictionSelection, Prediction as PredictionRecord } from '../types/prediction';

// 組件狀態
const route = useRoute();
const router = useRouter();
const session = useSessionStore();
const loading = ref(true);
const errorMessage = ref('');
const submitLoading = ref(false);
const submitMessage = ref('');
const submitSuccess = ref(false);

// 聯盟選單狀態
const selectedAlliance = ref(2); // 預設日本職棒
const selectedSoccerLeague = ref<number | null>(null);
const selectedStatusType = ref<'finished' | 'live' | 'scheduled'>('scheduled');
const baseballExpanded = ref(false);
const basketballExpanded = ref(false);
const otherExpanded = ref(false);
const soccerLeaguesExpanded = ref(false);

// 日曆狀態
const calendarVisible = ref(false);
const currentMonth = ref('十月 2025');
const selectedDate = ref(new Date());
const calendarDates = ref<{ date: Date; day: number; isToday: boolean; isSelected: boolean; isCurrentMonth: boolean }[]>([]);

// 賽事數據（使用真實 API）
const games = ref<Game[]>([]);

// 已存在的預測快照
const existingPredictions = ref<Record<string, PredictionRecord>>({});
const existingPredictionsLoading = ref(false);

function buildPredictionKey(gameId: string, type: PredictionType): string {
  return `${gameId}__${type}`;
}

// 篩選後的賽事（明確類型標註以避免 Vue 類型推斷問題）
const filteredGames = computed<Game[]>(() => {
  return games.value; // API 已經做好篩選，直接返回
});

// 日期格式化函數（使用本地時間，避免時區問題）
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 日期標準化函數
function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

// 根據日期判斷應該查詢的狀態模式
function determineStatusMode(date: Date): 'all' | 'finished' | 'scheduled' {
  const normalized = normalizeDate(date);
  const today = normalizeDate(new Date());
  if (normalized.getTime() === today.getTime()) {
    return 'all'; // 今日查詢所有狀態
  }
  return normalized.getTime() < today.getTime() ? 'finished' : 'scheduled';
}

// 載入賽事數據
async function loadGames() {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const normalizedDate = normalizeDate(selectedDate.value);
    const dateStr = formatDate(normalizedDate); // 使用本地時間格式化
    const statusMode = determineStatusMode(normalizedDate);
    
    const params: any = {
      allianceId: selectedAlliance.value,
      date: dateStr,
      soccerLeagueId: selectedSoccerLeague.value || undefined,
    };
    
    // 根據日期動態調整狀態查詢
    if (statusMode === 'all') {
      // 今日查詢所有狀態，不限制 status 參數
      selectedStatusType.value = 'scheduled'; // 顯示用
    } else {
      // 過去或未來，指定狀態
      params.status = statusMode;
      selectedStatusType.value = statusMode;
    }
    
    const result = await gamesAPI.getGames(params);
    
    if (result.success) {
      games.value = result.data;
    } else {
      errorMessage.value = '載入賽事失敗';
    }
  } catch (e: any) {
    errorMessage.value = e?.response?.data?.message || '載入賽事失敗，請稍後再試';
    console.error('載入賽事錯誤:', e);
  } finally {
    loading.value = false;
    loadExistingPredictions();
  }
}

// 載入既有預測
async function loadExistingPredictions() {
  if (!session.loggedIn || !session.userId) {
    existingPredictions.value = {};
    existingPredictionsLoading.value = false;
    return;
  }

  existingPredictionsLoading.value = true;

  try {
    const normalizedDate = normalizeDate(selectedDate.value);
    const dateStr = formatDate(normalizedDate); // 使用本地時間格式化
    const params = {
      memberId: session.userId,
      allianceId: selectedAlliance.value,
      startDate: dateStr,
      endDate: dateStr,
      status: 'all' as const,
      size: 200,
    };

    const result = await predictionsAPI.getPredictions(params);

    if (result.success) {
      const map: Record<string, PredictionRecord> = {};
      (result.data || []).forEach((prediction) => {
        if (prediction.gameId && prediction.predictionType) {
          map[buildPredictionKey(prediction.gameId, prediction.predictionType)] = prediction;
        }
      });
      existingPredictions.value = map;
    } else {
      existingPredictions.value = {};
    }
  } catch (e: any) {
    existingPredictions.value = {};
    console.error('載入既有預測錯誤:', e);
  } finally {
    existingPredictionsLoading.value = false;
  }
}

// 以下為舊的 mock 數據，暫時保留註解供參考
/*
const mockGames = ref([
  // MLB 赛事 (allianceId: 1)
  {
    gameId: '2025101510001',
    allianceId: 1,
    gameDate: new Date(),
    gameTime: '19:05',
    homeTeam: {
      id: 110,
      name: '洛杉磯道奇',
      pitcher: 'Walker Buehler'
    },
    awayTeam: {
      id: 111,
      name: '舊金山巨人',
      pitcher: 'Logan Webb'
    },
    internationalOdds: {
      spread: {
        home: { line: '-1.5', odds: '1.85' },
        away: { line: '+1.5', odds: '1.95' }
      },
      total: {
        over: { line: '7.5', odds: '1.85' },
        under: { line: '7.5', odds: '1.95' }
      }
    },
    taiwanOdds: {
      spread: {
        home: { line: '-1.5', odds: '1.85' },
        away: { line: '+1.5', odds: '1.95' }
      },
      moneyline: {
        home: { odds: '1.45' },
        away: { odds: '2.75' }
      },
      total: {
        over: { line: '7.5', odds: '1.85' },
        under: { line: '7.5', odds: '1.95' }
      }
    }
  },
  {
    gameId: '2025101510002',
    allianceId: 1,
    gameDate: new Date(),
    gameTime: '19:10',
    homeTeam: {
      id: 112,
      name: '紐約洋基',
      pitcher: 'Gerrit Cole'
    },
    awayTeam: {
      id: 113,
      name: '波士頓紅襪',
      pitcher: 'Chris Sale'
    },
    internationalOdds: {
      spread: {
        home: { line: '-1.5', odds: '1.75' },
        away: { line: '+1.5', odds: '2.05' }
      },
      total: {
        over: { line: '8.5', odds: '1.90' },
        under: { line: '8.5', odds: '1.90' }
      }
    },
    taiwanOdds: {
      spread: {
        home: { line: '-1.5', odds: '1.75' },
        away: { line: '+1.5', odds: '2.05' }
      },
      moneyline: {
        home: { odds: '1.35' },
        away: { odds: '3.25' }
      },
      total: {
        over: { line: '8.5', odds: '1.90' },
        under: { line: '8.5', odds: '1.90' }
      }
    }
  },
  {
    gameId: '2025101510003',
    allianceId: 1,
    gameDate: new Date(),
    gameTime: '20:40',
    homeTeam: {
      id: 114,
      name: '休士頓太空人',
      pitcher: 'Luis Garcia'
    },
    awayTeam: {
      id: 115,
      name: '洛杉磯天使',
      pitcher: 'Shohei Ohtani'
    },
    internationalOdds: {
      spread: {
        home: { line: '+1.5', odds: '1.85' },
        away: { line: '-1.5', odds: '1.95' }
      },
      total: {
        over: { line: '8.0', odds: '1.88' },
        under: { line: '8.0', odds: '1.92' }
      }
    },
    taiwanOdds: {
      spread: {
        home: { line: '+1.5', odds: '1.85' },
        away: { line: '-1.5', odds: '1.95' }
      },
      moneyline: {
        home: { odds: '2.15' },
        away: { odds: '1.70' }
      },
      total: {
        over: { line: '8.0', odds: '1.88' },
        under: { line: '8.0', odds: '1.92' }
      }
    }
  },

  // 日本职棒赛事 (allianceId: 2)
  {
    gameId: '2025101521001',
    allianceId: 2,
    gameDate: new Date(),
    gameTime: '17:00',
    homeTeam: {
      id: 95,
      name: '阪神',
      pitcher: '村上頌樹'
    },
    awayTeam: {
      id: 93,
      name: '橫濱',
      pitcher: '東克樹'
    },
    internationalOdds: {
      spread: {
        home: { line: '-1.5', odds: '2.3' },
        away: { line: '+1.5', odds: '1.35' }
      },
      total: {
        over: { line: '4.5', odds: '1.53' },
        under: { line: '4.5', odds: '1.93' }
      }
    },
    taiwanOdds: {
      spread: {
        home: { line: '-1.5', odds: '2.3' },
        away: { line: '+1.5', odds: '1.35' }
      },
      moneyline: {
        home: { odds: '1.52' },
        away: { odds: '1.94' }
      },
      total: {
        over: { line: '4.5', odds: '1.53' },
        under: { line: '4.5', odds: '1.93' }
      }
    }
  },
  {
    gameId: '2025101521002',
    allianceId: 2,
    gameDate: new Date(),
    gameTime: '17:00',
    homeTeam: {
      id: 102,
      name: '軟銀',
      pitcher: '莫伊聶羅'
    },
    awayTeam: {
      id: 97,
      name: '火腿',
      pitcher: '達孝太'
    },
    internationalOdds: {
      spread: {
        home: { line: '-1.5', odds: '1.93' },
        away: { line: '+1.5', odds: '1.53' }
      },
      total: {
        over: { line: '5.5', odds: '1.85' },
        under: { line: '5.5', odds: '1.6' }
      }
    },
    taiwanOdds: {
      spread: {
        home: { line: '-1.5', odds: '1.93' },
        away: { line: '+1.5', odds: '1.53' }
      },
      moneyline: {
        home: { odds: '1.36' },
        away: { odds: '2.28' }
      },
      total: {
        over: { line: '5.5', odds: '1.85' },
        under: { line: '5.5', odds: '1.6' }
      }
    }
  }
]);
*/

// 事件處理
function handleAllianceSelect(allianceId: number) {
  selectedAlliance.value = allianceId;
  selectedSoccerLeague.value = null;
  loadGames(); // 重新載入賽事
}

function handleSoccerLeagueSelect(leagueId: number) {
  selectedSoccerLeague.value = leagueId;
  loadGames(); // 重新載入賽事
}

function handleDateOptionSelect(option: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (option.type === 'today') {
    selectedDate.value = new Date(today);
  } else if (option.type === 'tomorrow') {
    const target = new Date(today);
    target.setDate(today.getDate() + 1);
    selectedDate.value = target;
  } else if (option.type === 'scheduled') {
    // 相容舊版：根據 display 判斷今天/明天/後天
    const target = new Date(today);
    if (option.display === '明天') {
      target.setDate(today.getDate() + 1);
    } else if (option.display === '後天') {
      target.setDate(today.getDate() + 2);
    }
    selectedDate.value = target;
  }

  updateCalendarDates();
  loadGames(); // 重新載入賽事
}

function handleDateSelect(date: Date) {
  selectedDate.value = date;
  calendarVisible.value = false;
  loadGames(); // 重新載入賽事
}

function handlePrevMonth() {
  // 處理上個月
  const current = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() - 1, 1);
  selectedDate.value = current;
  updateCalendarDates();
}

function handleNextMonth() {
  // 處理下個月
  const current = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 1);
  selectedDate.value = current;
  updateCalendarDates();
}

function updateCalendarDates() {
  // 更新日曆日期數據
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  const dates = [];
  const current = new Date(startDate);

  while (current <= lastDay || dates.length % 7 !== 0) {
    dates.push({
      date: new Date(current),
      day: current.getDate(),
      isToday: current.toDateString() === new Date().toDateString(),
      isSelected: current.toDateString() === selectedDate.value.toDateString(),
      isCurrentMonth: current.getMonth() === month
    });
    current.setDate(current.getDate() + 1);
  }

  calendarDates.value = dates;
  currentMonth.value = `${month + 1}月 ${year}`;
}

function handleToggleBaseballExpanded() {
  baseballExpanded.value = !baseballExpanded.value;
}

function handleToggleBasketballExpanded() {
  basketballExpanded.value = !basketballExpanded.value;
}

function handleToggleOtherExpanded() {
  otherExpanded.value = !otherExpanded.value;
}

// 預測選擇的類型定義
interface Prediction {
  gameId: string;
  type: 'international_spread' | 'international_total' | 'taiwan_spread' | 'taiwan_moneyline' | 'taiwan_total';
  selection: 'home' | 'away' | 'over' | 'under';
  value: string;
}

// 預測選擇處理（只記錄，不立即提交）
function handlePredictionSelect(prediction: Prediction) {
  // 這個函數現在只是記錄用戶的選擇
  // 實際提交由 PredictGamesTable 組件的提交按鈕處理
}

// 處理批次提交成功
function handleSubmitSuccess(message: string) {
  submitMessage.value = message;
  submitSuccess.value = true;
  loadExistingPredictions();
  
  // 3 秒後清除訊息並重新載入賽事（可能有狀態變化）
  setTimeout(() => {
    submitMessage.value = '';
    loadGames();
  }, 3000);
}

// 處理批次提交失敗
function handleSubmitError(message: string) {
  submitMessage.value = message;
  submitSuccess.value = false;
  
  // 5 秒後清除錯誤訊息
  setTimeout(() => {
    submitMessage.value = '';
  }, 5000);
}

onMounted(async () => {
  try {
    // 初始化日曆
    updateCalendarDates();

    // 檢查登入狀態
    await session.fetchSession();

    // 載入賽事數據
    await loadGames();
  } catch (e) {
    errorMessage.value = '載入預測相關內容失敗';
    console.error(e);
  }
});
</script>
