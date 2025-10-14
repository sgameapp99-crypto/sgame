<template>
  <div class="livescore-container mx-auto px-2 sm:px-4 lg:px-6 py-xl">
    <div class="heading-2">即時比分</div>

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
                <li :class="{ 'tag-chosen': selectedAlliance === 1 }" @click="selectAlliance(1, $event)">
                  MLB
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 3, 'nonepredict': !allianceHasGames(3) }" @click="selectAlliance(3, $event)">
                  <a href="javascript:void(0)">日本職棒</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 4, 'nonepredict': !allianceHasGames(4) }" @click="selectAlliance(4, $event)">
                  <a href="javascript:void(0)">中華職棒</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 6, 'nonepredict': !allianceHasGames(6) }" @click="selectAlliance(6, $event)">
                  <a href="javascript:void(0)">韓國職棒</a>
                </li>

                <!-- 可展開/收起的分類 -->
                <div :class="['games-close', { 'expanded': baseballExpanded }]">
                  <li :class="{ 'tag-chosen': selectedAlliance === 83, 'nonepredict': !allianceHasGames(83) }" @click="selectAlliance(83, $event)">
                    <a href="javascript:void(0)">澳洲職棒</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 114, 'nonepredict': !allianceHasGames(114) }" @click="selectAlliance(114, $event)">
                    <a href="javascript:void(0)">國際棒賽</a>
                  </li>
                </div>

                <!-- 展開/收起按鈕 -->
                <a href="#" :class="['more_play_btn', 'hide', { 'reportActive': baseballExpanded }]" @click.prevent="toggleBaseballExpanded">
                  <strong>▼</strong>
                  <span>▲</span>
                </a>
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
                <!-- 預設顯示的分類 -->
                <li :class="{ 'tag-chosen': selectedAlliance === 7, 'nonepredict': !allianceHasGames(7) }" @click="selectAlliance(7, $event)">
                  <a href="javascript:void(0)">WNBA</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 97, 'nonepredict': !allianceHasGames(97) }" @click="selectAlliance(97, $event)">
                  <a href="javascript:void(0)">日本職籃</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 12, 'nonepredict': !allianceHasGames(12) }" @click="selectAlliance(12, $event)">
                  <a href="javascript:void(0)">澳洲職籃</a>
                </li>

                <!-- 可展開/收起的分類 -->
                <div :class="['games-close', { 'expanded': basketballExpanded }]">
                  <li :class="{ 'tag-chosen': selectedAlliance === 2, 'nonepredict': !allianceHasGames(2) }" @click="selectAlliance(2, $event)">
                    <a href="javascript:void(0)">NBA</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 8, 'nonepredict': !allianceHasGames(8) }" @click="selectAlliance(8, $event)">
                    <a href="javascript:void(0)">歐洲職籃</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 89, 'nonepredict': !allianceHasGames(89) }" @click="selectAlliance(89, $event)">
                    <a href="javascript:void(0)">SBL</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 92, 'nonepredict': !allianceHasGames(92) }" @click="selectAlliance(92, $event)">
                    <a href="javascript:void(0)">韓國職籃</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 94, 'nonepredict': !allianceHasGames(94) }" @click="selectAlliance(94, $event)">
                    <a href="javascript:void(0)">中國職籃</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 110, 'nonepredict': !allianceHasGames(110) }" @click="selectAlliance(110, $event)">
                    <a href="javascript:void(0)">國際籃賽</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 121, 'nonepredict': !allianceHasGames(121) }" @click="selectAlliance(121, $event)">
                    <a href="javascript:void(0)">綜合籃賽</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 16, 'nonepredict': !allianceHasGames(16) }" @click="selectAlliance(16, $event)">
                    <a href="javascript:void(0)">P+</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 18, 'nonepredict': !allianceHasGames(18) }" @click="selectAlliance(18, $event)">
                    <a href="javascript:void(0)">TPBL</a>
                  </li>
                </div>

                <!-- 展開/收起按鈕 -->
                <a href="#" :class="['more_play_btn', 'hide', { 'reportActive': basketballExpanded }]" @click.prevent="toggleBasketballExpanded">
                  <strong>▼</strong>
                  <span>▲</span>
                </a>
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
                <!-- 預設顯示的分類 -->
                <li :class="{ 'tag-chosen': selectedAlliance === 5, 'nonepredict': !allianceHasGames(5) }" @click="selectAlliance(5, $event)">
                  <a href="javascript:void(0)">足球</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 87, 'nonepredict': !allianceHasGames(87) }" @click="selectAlliance(87, $event)">
                  <a href="javascript:void(0)">俄羅斯冰球</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 93, 'nonepredict': !allianceHasGames(93) }" @click="selectAlliance(93, $event)">
                  <a href="javascript:void(0)">美式足球</a>
                </li>

                <!-- 可展開/收起的分類 -->
                <div :class="['games-close', { 'expanded': otherExpanded }]">
                  <li :class="{ 'tag-chosen': selectedAlliance === 91, 'nonepredict': !allianceHasGames(91) }" @click="selectAlliance(91, $event)">
                    <a href="javascript:void(0)">NHL冰球</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 21, 'nonepredict': !allianceHasGames(21) }" @click="selectAlliance(21, $event)">
                    <a href="javascript:void(0)">網球</a>
                  </li>
                </div>

                <!-- 展開/收起按鈕 -->
                <a href="#" :class="['more_play_btn', 'hide', { 'reportActive': otherExpanded }]" @click.prevent="toggleOtherExpanded">
                  <strong>▼</strong>
                  <span>▲</span>
                </a>
              </ol>
            </div>
          </div>

          <!-- 足球聯賽選單 (僅在選擇足球時顯示) -->
          <div v-if="selectedAlliance === 5 && soccerLeaguesExpanded" class="tag-league-box tag-box">
            <div class="tag-box-first">
              <ol class="tag-league">
                <li class="fold-head"></li>
                <li>聯賽</li>
                <li class="fold-footer"></li>
              </ol>
            </div>
            <div class="tag-box-last">
              <ol class="tag-con">
                <li
                  v-for="league in soccerLeagues"
                  :key="league.id"
                  :class="{ 'tag-chosen': selectedSoccerLeague === league.id }"
                  @click="selectSoccerLeague(league.id, $event)"
                >
                  <a href="javascript:void(0)">{{ league.displayName }}</a>
                </li>
              </ol>
            </div>
          </div>

          <!-- 時間選擇器 -->
          <div class="tag-league-box tag-box calendar-wrapper">
            <div class="tag-box-first">
              <ol class="tag-league">
                <li class="fold-head"></li>
                <li>時間</li>
                <li class="fold-footer"></li>
              </ol>
            </div>
            <div class="tag-box-last">
              <ol class="tag-con">
                <li
                  v-for="option in dateOptions"
                  :key="option.type"
                  :class="{ 'tag-chosen': option.isSelected }"
                  @click="selectDateOption(option, $event)"
                >
                  <a href="javascript:void(0)">
                    {{ option.display }}
                  </a>
                </li>
                <li>
                  <a href="javascript:;" id="more-day" v-on:click="toggleCalendar">
                    更多 ▼ ({{ calendarVisible ? '展開' : '收起' }})
                  </a>
                </li>
              </ol>
            </div>
          </div>

          <!-- 日曆選擇器 -->
          <div v-if="calendarVisible" class="calendar-container">
            <div class="calendar-header">
              <button @click="prevMonth">‹</button>
              <span>{{ currentMonth }}</span>
              <button @click="nextMonth">›</button>
              <button @click="closeCalendar" class="close-btn">×</button>
            </div>
            <div class="calendar-grid">
              <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">{{ day }}</div>
              <div
                v-for="(date, index) in calendarDates"
                :key="index"
                :class="['calendar-day', {
                  'calendar-day-today': date.isToday,
                  'calendar-day-selected': date.isSelected
                }]"
                @click="selectDate(date.date)"
              >
                {{ date.day }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 即時比賽列表 -->
    <div class="livescore-content">
      <div v-if="loading" class="text-center py-xl">載入中...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center py-xl">{{ errorMessage }}</div>
      <div v-else>
        <div v-if="filteredGames.length === 0" class="no-live-games">
          <div class="no-games-icon">🏆</div>
          <h3>目前沒有進行中的比賽</h3>
          <p>請稍後再查看或選擇其他聯盟和日期</p>
        </div>
        <div v-else class="games-list">
          <component
            v-for="game in filteredGames"
            :key="`${selectedAlliance}-${game.id}`"
            :is="getGameComponent(selectedAlliance)"
            :game="game"
            @click="viewGameDetails(game.id)"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import BaseballGameCard from '../components/games/BaseballGameCard.vue';
import BasketballGameCard from '../components/games/BasketballGameCard.vue';
import SoccerGameCard from '../components/games/SoccerGameCard.vue';
import IceHockeyGameCard from '../components/games/IceHockeyGameCard.vue';
import AmericanFootballGameCard from '../components/games/AmericanFootballGameCard.vue';
import TennisGameCard from '../components/games/TennisGameCard.vue';
import GameCard from '../components/games/GameCard.vue';
import { getGames, getActiveAlliances } from '../data/mockApi';
import type { UnifiedGame, BasketballGame, IceHockeyGame, AmericanFootballGame, TennisGame } from '../data/types';

// 使用从types.ts导入的类型

// 註冊動態組件
const componentMap = {
  BaseballGameCard,
  BasketballGameCard,
  SoccerGameCard,
  IceHockeyGameCard,
  AmericanFootballGameCard,
  TennisGameCard,
  GameCard
};

// 響應式數據
const route = useRoute();
const selectedAlliance = ref(1);
const loading = ref(false);
const errorMessage = ref('');
const basketballExpanded = ref(false);
const otherExpanded = ref(false);
const baseballExpanded = ref(false);
const soccerLeaguesExpanded = ref(false); // 足球聯賽選單展開狀態
const calendarVisible = ref(false);
const currentMonth = ref('九月 2025');
const selectedDate = ref(new Date()); // 保持與日曆功能兼容
const selectedStatusType = ref<'finished' | 'live' | 'scheduled'>('live'); // 狀態類型篩選
const selectedSoccerLeague = ref<number | null>(null); // 選中的足球聯賽
const daysOfWeek = ['一', '二', '三', '四', '五', '六', '日'];
const calendarDates = ref<{ date: Date; day: number; isToday: boolean; isSelected: boolean; isCurrentMonth: boolean }[]>([]);

// 足球聯賽數據
const soccerLeagues = ref([
  { id: 0, name: 'all', displayName: '全部', allianceId: 5 },
  { id: 1, name: 'premier-league', displayName: '英超', allianceId: 5 },
  { id: 2, name: 'la-liga', displayName: '西甲', allianceId: 5 },
  { id: 3, name: 'serie-a', displayName: '義甲', allianceId: 5 },
  { id: 4, name: 'bundesliga', displayName: '德甲', allianceId: 5 },
  { id: 5, name: 'ligue-1', displayName: '法甲', allianceId: 5 },
  { id: 6, name: 'champions-league', displayName: '歐冠', allianceId: 5 },
  { id: 7, name: 'europa-league', displayName: '歐霸', allianceId: 5 },
  { id: 8, name: 'europa-conference', displayName: '歐洲盃', allianceId: 5 },
  { id: 9, name: 'j1-league', displayName: '日本J1', allianceId: 5 },
  { id: 10, name: 'a-league', displayName: '澳A', allianceId: 5 }
]);

// 計算屬性：生成狀態篩選選項
const dateOptions = computed(() => {
  const options = [];

  // 昨天(已完成)、今天(進行中)、明天(未進行)
  const dateLabels = ['昨天', '今天', '明天'];
  const statusTypes = ['finished', 'live', 'scheduled'];

  for (let i = 0; i < 3; i++) {
    const isSelected = selectedStatusType.value === statusTypes[i];

    options.push({
      display: dateLabels[i],
      type: statusTypes[i], // finished, live, scheduled
      isSelected
    });
  }

  return options;
});

function getDayOfWeek(date: Date): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return days[date.getDay()];
}

// 計算屬性：根據狀態類型過濾比賽（因為API已經根據聯盟過濾了）
const filteredGames = computed(() => {
  // 確保數據存在且為數組
  if (!liveGames.value || !Array.isArray(liveGames.value)) {
    return [];
  }

  return liveGames.value.filter(game => {
    // 確保 game 對象存在且有必要屬性
    if (!game || typeof game !== 'object' || !game.id) {
      return false;
    }

    // 只根據狀態類型進行篩選（聯盟過濾已經在API中完成）
    const statusMatch = selectedStatusType.value === game.status;

    // 足球聯賽的額外過濾
    let soccerMatch = true;
    if (selectedAlliance.value === 5 && selectedSoccerLeague.value && selectedSoccerLeague.value !== 0) {
      soccerMatch = (game as any).soccerLeagueId === selectedSoccerLeague.value;
    }

    return statusMatch && soccerMatch;
  });
});

const liveGames = ref<(UnifiedGame | BasketballGame | IceHockeyGame | AmericanFootballGame | TennisGame)[]>([]);

// 加载游戏数据的函数
async function loadGamesData(allianceId?: number, date?: string, soccerLeagueId?: number) {
  try {
    loading.value = true;

    // 統一調用 getGames 函數，根據參數決定數據源
    const response = await getGames({
      alliance: allianceId,
      date: date,
      status: selectedStatusType.value, // 使用選中的狀態類型進行篩選
      soccerLeagueId: soccerLeagueId
    });

    if (response.success) {
      liveGames.value = response.data || [];
    } else {
      errorMessage.value = '載入比賽數據失敗';
      liveGames.value = [];
    }
  } catch (error) {
    errorMessage.value = '網路錯誤，請稍後再試';
    liveGames.value = [];
    console.error('載入比賽數據時發生錯誤:', error);
  } finally {
    loading.value = false;
  }
}

// 方法
function selectAlliance(allianceId: number, event?: Event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();

    // 添加点击反馈
    const target = event.target as HTMLElement;
    if (target) {
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
    }
  }
  selectedAlliance.value = allianceId;

  // 當選擇足球時，自動展開聯賽選單並選擇"全部"
  if (allianceId === 5) {
    soccerLeaguesExpanded.value = true;
    selectedSoccerLeague.value = 0; // 默認選擇"全部"
  } else {
    soccerLeaguesExpanded.value = false;
    selectedSoccerLeague.value = null;
  }

  loadGamesData(allianceId);
}

// 组件挂载时加载数据
onMounted(async () => {
  const allianceId = parseInt(route.params.allianceId as string) || 1;
  selectAlliance(allianceId);
  // selectAlliance 已經調用了 loadGamesData，所以不需要重複調用
});

function allianceHasGames(allianceId: number): boolean {
  // 定義哪些聯盟有比賽（固定映射，避免隨機變化）
  const activeAlliances = [
    1,   // MLB
    2,   // NBA
    3,   // 日棒
    4,   // 中職
    5,   // 足球
    6,   // 韓棒
    7,   // WNBA
    9,   // 韓國職棒
    12,  // 澳洲職籃
    21,  // 網球
    83,  // 澳洲職棒
    87,  // 俄羅斯冰球
    91,  // NHL冰球
    93,  // 美式足球
    97,  // 日本職籃
    114, // 國際棒賽
  ];

  return activeAlliances.includes(allianceId);
}

// 根據聯盟ID決定使用哪個組件
function getGameComponent(allianceId: number) {
  // 棒球聯盟 - 統一使用 BaseballGameCard 組件
  const baseballAlliances = [1, 3, 4, 6, 9, 83, 114]; // MLB, 日棒, 中職, 韓棒, 澳洲職棒, 國際棒賽

  // 籃球聯盟 - 統一使用 BasketballGameCard 組件
  const basketballAlliances = [2, 7, 8, 12, 89, 92, 94, 97, 110, 121, 16, 18]; // NBA, WNBA, 澳洲職籃, 日本職籃等

  // 足球聯盟 - 統一使用 SoccerGameCard 組件
  const soccerAlliances = [5]; // 足球

  // 冰球聯盟 - 統一使用 IceHockeyGameCard 組件
  const iceHockeyAlliances = [87, 91]; // 俄羅斯冰球, NHL冰球

  // 美式足球聯盟 - 統一使用 AmericanFootballGameCard 組件
  const americanFootballAlliances = [93]; // 美式足球

  // 網球聯盟 - 統一使用 TennisGameCard 組件
  const tennisAlliances = [21]; // 網球

  // 其他聯盟 - 使用通用 GameCard 組件
  const otherAlliances = [10, 11]; // 其他類型的比賽

  if (baseballAlliances.includes(allianceId)) {
    return componentMap.BaseballGameCard;
  } else if (basketballAlliances.includes(allianceId)) {
    return componentMap.BasketballGameCard;
  } else if (soccerAlliances.includes(allianceId)) {
    return componentMap.SoccerGameCard;
  } else if (iceHockeyAlliances.includes(allianceId)) {
    return componentMap.IceHockeyGameCard;
  } else if (americanFootballAlliances.includes(allianceId)) {
    return componentMap.AmericanFootballGameCard;
  } else if (tennisAlliances.includes(allianceId)) {
    return componentMap.TennisGameCard;
  } else {
    return componentMap.GameCard; // 默認組件用於其他類型
  }
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'scheduled': '未開始',
    'live': '進行中',
    'finished': '已結束'
  };
  return statusMap[status] || status;
}

function viewGameDetails(gameId: number) {
  // TODO: 实现查看比赛详情功能
}

function followGame(gameId: number) {
  // TODO: 实现关注比赛功能
}

function toggleBasketballExpanded() {
  basketballExpanded.value = !basketballExpanded.value;
}

function toggleOtherExpanded() {
  otherExpanded.value = !otherExpanded.value;
}

function toggleBaseballExpanded() {
  baseballExpanded.value = !baseballExpanded.value;
}

function toggleCalendar() {
  calendarVisible.value = !calendarVisible.value;
  if (calendarVisible.value) {
    generateCalendar();
  }
}

function closeCalendar() {
  calendarVisible.value = false;
}

function generateCalendar() {
  const today = new Date();
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // 星期一開始

  const dates = [];
  let current = new Date(startDate);

  for (let i = 0; i < 42; i++) { // 6週 x 7天
    const isToday = current.toDateString() === today.toDateString();
    const isSelected = current.toDateString() === selectedDate.value.toDateString();
    const isCurrentMonth = current.getMonth() === month;

    dates.push({
      date: new Date(current),
      day: current.getDate(),
      isToday,
      isSelected,
      isCurrentMonth
    });

    current.setDate(current.getDate() + 1);
  }

  calendarDates.value = dates;
}

function prevMonth() {
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() - 1, 1);
  updateMonthDisplay();
  generateCalendar();
}

function nextMonth() {
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 1);
  updateMonthDisplay();
  generateCalendar();
}

function selectDateOption(option: any, event?: Event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();

    // 添加点击反馈
    const target = event.target as HTMLElement;
    if (target) {
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
    }
  }
  selectedStatusType.value = option.type;
  calendarVisible.value = false;
  // 根據狀態類型篩選比賽，保持當前聯盟
  loadGamesData(selectedAlliance.value);
}

function selectDate(date: Date) {
  selectedDate.value = date;
  calendarVisible.value = false;
  // 这里可以添加加载对应日期比赛的逻辑
}

function updateMonthDisplay() {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth();
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  currentMonth.value = `${monthNames[month]} ${year}`;
}

// 足球聯賽選擇函數
function selectSoccerLeague(leagueId: number, event?: Event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();

    // 添加點擊反饋
    const target = event.target as HTMLElement;
    if (target) {
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
    }
  }

  selectedSoccerLeague.value = leagueId;

  // 重新加載數據，使用聯賽過濾
  loadGamesData(selectedAlliance.value, undefined, leagueId);
}

// 原有的loadGames函数已被新的loadGamesData函数替代

// 暴露给模板使用的函数和数据
defineExpose({
  selectedAlliance,
  selectedStatusType,
  loading,
  errorMessage,
  basketballExpanded,
  otherExpanded,
  baseballExpanded,
  soccerLeaguesExpanded,
  calendarVisible,
  currentMonth,
  selectedDate,
  selectedSoccerLeague,
  soccerLeagues,
  calendarDates,
  liveGames,
  selectAlliance,
  selectSoccerLeague,
  allianceHasGames,
  toggleBasketballExpanded,
  toggleOtherExpanded,
  toggleBaseballExpanded,
  toggleCalendar,
  closeCalendar,
  generateCalendar,
  prevMonth,
  nextMonth,
  selectDateOption,
  selectDate,
  updateMonthDisplay,
  viewGameDetails,
  followGame,
  getGameComponent
});
</script>

<style scoped>
/* 響應式容器寬度 */
.livescore-container {
  max-width: 100%;
  width: 100%;
}

/* 小屏幕 (手機): 幾乎全寬，左右padding較小 */
@media (max-width: 640px) {
  .livescore-container {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}

/* 中等屏幕 (平板): 稍微縮小padding */
@media (min-width: 641px) and (max-width: 1023px) {
  .livescore-container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}

/* 大屏幕 (桌面): 更大的寬度利用 */
@media (min-width: 1024px) {
  .livescore-container {
    max-width: 95vw;
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
}

/* 超大屏幕: 進一步擴展 */
@media (min-width: 1280px) {
  .livescore-container {
    max-width: 90vw;
  }
}

/* 極大屏幕: 接近全寬 */
@media (min-width: 1536px) {
  .livescore-container {
    max-width: 85vw;
  }
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
  justify-content: flex-start;
}

/* 在大屏幕上增加間距 */
@media (min-width: 1024px) {
  .tag-league-boxall {
    gap: 30px;
    padding: 25px;
  }
}

/* 在超大屏幕上進一步調整 */
@media (min-width: 1280px) {
  .tag-league-boxall {
    gap: 40px;
    padding: 30px;
  }
}

.tag-league-box {
  min-width: 200px;
}

/* 比賽顯示區域響應式寬度 */
.games-display {
  width: 100%;
}

@media (min-width: 1024px) {
  .games-display {
    max-width: 100%;
  }
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

.tag-chosen a {
  color: #000 !important;
  font-weight: bold !important;
}

.nonepredict {
  opacity: 0.6;
}

.games-close {
  clear: left;
  display: none;
  transition: all 0.3s ease;
}

.games-close.expanded {
  display: block;
}

.more_play_btn {
  float: left;
  margin: 0 0 10px 0 !important;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}

.more_play_btn span {
  display: none;
}

.reportActive strong {
  display: none;
}

.reportActive span {
  display: inline;
  margin-left: 10px;
}

.games-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.game-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.live-game {
  border-left: 4px solid #e74c3c;
}

.finished-game {
  border-left: 4px solid #27ae60;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.league-badge {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
}

.game-time {
  color: #666;
  font-size: 0.875rem;
}

.game-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.game-status.live {
  background: #e74c3c;
  color: white;
}

.game-status.finished {
  background: #27ae60;
  color: white;
}

.game-status.scheduled {
  background: #f39c12;
  color: white;
}

.game-teams {
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
}

.team.home-team {
  color: #3498db;
}

.team.away-team {
  color: #e74c3c;
}

.team-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.team-score {
  font-size: 1.5rem;
  font-weight: bold;
}

.vs-indicator {
  font-weight: bold;
  color: #666;
  margin: 0 1rem;
}

.live-indicators {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.inning-indicator, .outs-indicator {
  background: #fff3cd;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #856404;
}

.game-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.no-live-games {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.no-games-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-live-games h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .tag-league-boxall {
    flex-direction: column;
  }

  .games-list {
    grid-template-columns: 1fr;
  }

  .game-teams {
    flex-direction: column;
    gap: 1rem;
  }

  .vs-indicator {
    margin: 0.5rem 0;
  }
}

/* 日曆樣式 */
.calendar-wrapper {
  position: relative;
}

.calendar-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10000;
  width: 280px;
  padding: 10px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
}

.calendar-header button:hover {
  background: #f0f0f0;
}

.close-btn {
  margin-left: auto;
  font-size: 20px;
  color: #666;
}

.close-btn:hover {
  background: #ffeeee;
  color: #d00;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day-header {
  text-align: center;
  font-weight: bold;
  padding: 8px 0;
  font-size: 12px;
  color: #666;
}

.calendar-day {
  text-align: center;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 3px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.calendar-day:hover {
  background: #f0f0f0;
}

.calendar-day-today {
  background: #e3f2fd;
  font-weight: bold;
}

.calendar-day-selected {
  background: #2196f3;
  color: white;
  font-weight: bold;
}

.calendar-day-selected:hover {
  background: #1976d2;
}
</style>