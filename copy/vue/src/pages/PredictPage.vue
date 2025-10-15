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
        :date-options-filter="['scheduled']"
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
        @select-prediction="handlePredictionSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.no-games-message {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-top: 20px;
}
</style>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { loadLegacyHtml, parseBasicContent } from '../utils/simpleLegacyParser';
import { rewriteLegacyUrls } from '../utils/rewriteLegacy';
import { useRoute } from 'vue-router';
import AllianceMenu from '../components/AllianceMenu.vue';
import PredictGamesTable from '../components/PredictGamesTable.vue';

// 組件狀態
const route = useRoute();
const loading = ref(true);
const errorMessage = ref('');

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

// Mock 賽事數據
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

// 篩選賽事
const filteredGames = computed(() => {
  return mockGames.value.filter(game => {
    const allianceMatch = game.allianceId === selectedAlliance.value;
    const dateMatch = game.gameDate.toDateString() === selectedDate.value.toDateString();
    return allianceMatch && dateMatch;
  });
});

// 事件處理
function handleAllianceSelect(allianceId: number) {
  selectedAlliance.value = allianceId;
  selectedSoccerLeague.value = null;
}

function handleSoccerLeagueSelect(leagueId: number) {
  selectedSoccerLeague.value = leagueId;
}

function handleDateOptionSelect(option: any) {
  // 處理日期選項選擇
  const today = new Date();
  switch (option.type) {
    case 'scheduled':
      if (option.display === '今天') {
        selectedDate.value = new Date(today);
      } else if (option.display === '明天') {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        selectedDate.value = tomorrow;
      } else if (option.display === '後天') {
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);
        selectedDate.value = dayAfterTomorrow;
      }
      break;
  }
}

function handleDateSelect(date: Date) {
  selectedDate.value = date;
  calendarVisible.value = false;
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

function handlePredictionSelect(prediction: Prediction) {
  // 這裡可以處理預測選擇邏輯，比如：
  // - 存儲用戶的選擇
  // - 發送給後端 API
  // - 更新 UI 狀態
  // - 計算預測結果等

  // TODO: 實現具體的預測處理邏輯
  // console.log('預測選擇:', prediction);
}

onMounted(async () => {
  try {
    // 初始化日曆
    updateCalendarDates();

    // 如果有舊的邏輯可以保留，但主要功能改為組件化
    const path = (route.query.path as string) || '/legacy/www.playsport.cc/predict/';
    const CACHE_KEY = `predict_cache_${path}`;
    const TTL_MS = 5 * 60 * 1000;
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached) as { ts: number; title: string; html: string };
      if (data && Date.now() - data.ts < TTL_MS) {
        loading.value = false;
        return;
      }
    }
  } catch (e) {
    errorMessage.value = '載入預測相關內容失敗';
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
