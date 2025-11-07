<template>
  <div class="livescore-container mx-auto px-2 sm:px-4 lg:px-6 py-xl">
    <div class="heading-2">即時比分</div>

    <!-- 聯盟選單組件 -->
    <AllianceMenu
      :selected-alliance="selectedAlliance"
      :selected-soccer-league="selectedSoccerLeague"
      :selected-status-type="selectedStatusType"
      :baseball-expanded="baseballExpanded"
      :basketball-expanded="basketballExpanded"
      :other-expanded="otherExpanded"
      :soccer-leagues-expanded="soccerLeaguesExpanded"
      :calendar-visible="calendarVisible"
      :current-month="currentMonth"
      :selected-date="selectedDate"
      :calendar-dates="calendarDates"
      :show-time-selector="true"
      :date-options-filter="['today', 'yesterday', 'tomorrow']"
      @select-alliance="selectAlliance"
      @select-soccer-league="selectSoccerLeague"
      @select-date-option="selectDateOption"
      @toggle-baseball-expanded="toggleBaseballExpanded"
      @toggle-basketball-expanded="toggleBasketballExpanded"
      @toggle-other-expanded="toggleOtherExpanded"
      @toggle-calendar="toggleCalendar"
      @select-date="selectDate"
      @prev-month="prevMonth"
      @next-month="nextMonth"
      @close-calendar="closeCalendar"
    />

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
import AllianceMenu from '../components/AllianceMenu.vue';
import BaseballGameCard from '../components/games/BaseballGameCard.vue';
import BasketballGameCard from '../components/games/BasketballGameCard.vue';
import SoccerGameCard from '../components/games/SoccerGameCard.vue';
import IceHockeyGameCard from '../components/games/IceHockeyGameCard.vue';
import AmericanFootballGameCard from '../components/games/AmericanFootballGameCard.vue';
import TennisGameCard from '../components/games/TennisGameCard.vue';
import GameCard from '../components/games/GameCard.vue';
import livescoreAPI from '../api/livescore';
import type { LivescoreItem, LivescoreQueryParams, LivescoreStatus, LivescoreOdds, LivescoreScoreboardDetail } from '../api/types';

interface BaseballScoreboardEntry {
  inning: number;
  runs: number;
}

interface BaseballScoreboardTotals {
  runs: number;
  hits?: number;
  errors?: number;
}

interface BaseballScoreboard {
  innings: number[];
  awayScores: BaseballScoreboardEntry[];
  homeScores: BaseballScoreboardEntry[];
  awayTotal: BaseballScoreboardTotals;
  homeTotal: BaseballScoreboardTotals;
}

interface BasketballQuarterScore {
  quarter: number;
  points: number;
}

interface BasketballScoreBreakdown {
  quarters: { label: string; quarter: number }[];
  awayScores: BasketballQuarterScore[];
  homeScores: BasketballQuarterScore[];
  ot?: boolean;
  awayOtScore?: number;
  homeOtScore?: number;
}

interface LivescoreCardGame {
  id: string;
  allianceId: number;
  league: string;
  leagueCode: string;
  sportType: string;
  status: LivescoreStatus;
  time: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamId?: number;
  awayTeamId?: number;
  homeScore: number | null;
  awayScore: number | null;
  winner?: string;
  inning?: string | null;
  livePhase?: string | null;
  matchMinute?: string | null;
  matchPeriod?: string | null;
  currentPeriod?: number | null;
  currentQuarter?: number | null;
  timeRemaining?: string | null;
  scoreBreakdown?: BasketballScoreBreakdown | null;
  scoreboard?: BaseballScoreboard | null;
  liveStats?: Record<string, unknown> | null;
  oddsInfo?: LivescoreOdds | null;
  soccerLeagueId?: number | null;
  soccerLeagueName?: string | null;
  soccerLeague?: string | null;
  allianceName?: string | null;
  officialId?: string | null;
  betInfo?: string | null;
  homeStats?: Record<string, unknown> | null;
  awayStats?: Record<string, unknown> | null;
  teamStats?: Record<string, unknown> | null;
  recentForm?: string | null;
  headToHead?: string | null;
  lastUpdated: string;
  raw: LivescoreItem;
}

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
const selectedDate = ref(new Date()); // 使用者選取的查詢日期
const selectedStatusType = ref<'finished' | 'live' | 'scheduled'>('live'); // 根據日期自動推斷，也可手動切換
const selectedSoccerLeague = ref<number | null>(null); // 選中的足球聯賽
const calendarDates = ref<{ date: Date; day: number; isToday: boolean; isSelected: boolean; isCurrentMonth: boolean }[]>([]);

// 注意：soccerLeagues 和 dateOptions 現在在 AllianceMenu 組件中處理

const liveGames = ref<LivescoreCardGame[]>([]);
const activeStatusFilter = ref<'all' | LivescoreStatus>('all');

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

    const allianceMatch = !selectedAlliance.value || game.allianceId === selectedAlliance.value;

    // 僅在需要時根據狀態類型進行篩選（聯盟過濾已經在 API 中完成）
    const statusFilter = activeStatusFilter.value;
    const statusMatch = statusFilter === 'all' || statusFilter === game.status;

    // 足球聯賽的額外過濾
    let soccerMatch = true;
    if (selectedAlliance.value === 5 && selectedSoccerLeague.value && selectedSoccerLeague.value !== 0) {
      soccerMatch = (game as any).soccerLeagueId === selectedSoccerLeague.value;
    }

    return allianceMatch && statusMatch && soccerMatch;
  });
});

// 加载游戏数据的函数
async function loadGamesData(options: { allianceId?: number; date?: Date; soccerLeagueId?: number | null } = {}) {
  try {
    loading.value = true;
    errorMessage.value = '';

    const params: LivescoreQueryParams = {
      size: 100,
      page: 1,
    };

    const allianceId = options.allianceId ?? selectedAlliance.value;
    if (allianceId) {
      params.allianceId = allianceId;
    }

    const targetSoccerLeague = options.soccerLeagueId ?? selectedSoccerLeague.value ?? null;
    if ((params.allianceId === 5 || allianceId === 5) && targetSoccerLeague && targetSoccerLeague !== 0) {
      params.soccerLeagueId = targetSoccerLeague;
    }

    const targetDateInput = options.date ?? selectedDate.value;
    const normalizedDate = normalizeDate(targetDateInput);
    selectedDate.value = new Date(normalizedDate);

    const statusMode = determineStatusMode(normalizedDate);
    if (statusMode === 'all') {
      activeStatusFilter.value = 'all';
      selectedStatusType.value = 'live';
    } else {
      activeStatusFilter.value = statusMode;
      selectedStatusType.value = statusMode;
      params.status = statusMode;
    }

    params.date = formatDate(normalizedDate);

    const response = await livescoreAPI.getLivescore(params);
    liveGames.value = (response.data || []).map(mapLivescoreItemToGame);
  } catch (error) {
    console.error('載入比賽數據時發生錯誤:', error);
    errorMessage.value = '載入比賽數據失敗，請稍後再試';
    liveGames.value = [];
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

  loadGamesData({ allianceId });
}

// 组件挂载时加载数据
onMounted(async () => {
  const allianceId = parseInt(route.params.allianceId as string) || 1;
  selectedDate.value = normalizeDate(new Date());
  updateMonthDisplay();
  selectAlliance(allianceId);
  // selectAlliance 已經調用了 loadGamesData，所以不需要重複調用
});

// 注意：allianceHasGames 函數現在在 AllianceMenu 組件中處理

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

    const target = event.target as HTMLElement;
    if (target) {
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
    }
  }

  const offsets: Record<string, number> = {
    today: 0,
    yesterday: -1,
    tomorrow: 1,
  };
  const offset = offsets[option.type as string] ?? 0;
  const base = new Date();
  base.setDate(base.getDate() + offset);
  selectDate(base);
}

function selectDate(date: Date) {
  const normalized = normalizeDate(date);
  selectedDate.value = new Date(normalized);
  calendarVisible.value = false;
  updateMonthDisplay();
  loadGamesData({ allianceId: selectedAlliance.value, date: normalized });
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
  loadGamesData({ allianceId: selectedAlliance.value, soccerLeagueId: leagueId });
}

// 原有的loadGames函数已被新的loadGamesData函数替代

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function determineStatusMode(date: Date): 'all' | LivescoreStatus {
  const normalized = normalizeDate(date);
  const today = normalizeDate(new Date());
  if (normalized.getTime() === today.getTime()) {
    return 'all';
  }
  return normalized.getTime() < today.getTime() ? 'finished' : 'scheduled';
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapLivescoreItemToGame(item: LivescoreItem): LivescoreCardGame {
  const startTime = item.start_time;
  const parsedDate = new Date(startTime);
  let datePart: string;
  if (typeof startTime === 'string' && startTime.includes('T')) {
    datePart = startTime.split('T')[0];
  } else if (!Number.isNaN(parsedDate.getTime())) {
    datePart = formatDate(parsedDate);
  } else {
    datePart = formatDate(new Date());
  }

  const homeScore = item.home_score !== undefined && item.home_score !== null ? toNumber(item.home_score) : null;
  const awayScore = item.away_score !== undefined && item.away_score !== null ? toNumber(item.away_score) : null;

  let winner: string | undefined;
  if (item.status === 'finished' && homeScore !== null && awayScore !== null) {
    if (homeScore > awayScore) {
      winner = item.home_team.name;
    } else if (awayScore > homeScore) {
      winner = item.away_team.name;
    }
  }

  const { currentQuarter, timeRemaining } = item.sport_type === 'basketball'
    ? parseBasketballPhase(item.live_phase)
    : { currentQuarter: null, timeRemaining: null };

  const scoreboard = item.sport_type === 'baseball'
    ? mapBaseballScoreboard(item.scoreboard_detail)
    : null;

  const scoreBreakdown = item.sport_type === 'basketball'
    ? mapBasketballScoreboard(item.scoreboard_detail)
    : null;

  return {
    id: String(item.game_id),
    officialId: item.game_id,
    allianceId: item.alliance_id,
    league: item.alliance_name || item.league_code,
    leagueCode: item.league_code,
    sportType: item.sport_type,
    status: item.status,
    time: startTime,
    date: datePart,
    homeTeam: item.home_team.name,
    awayTeam: item.away_team.name,
    homeTeamId: item.home_team.id,
    awayTeamId: item.away_team.id,
    homeScore,
    awayScore,
    winner,
    inning: item.sport_type === 'baseball' ? item.live_phase ?? null : null,
    livePhase: item.live_phase ?? null,
    matchMinute: item.sport_type === 'soccer' ? item.live_phase ?? null : null,
    matchPeriod: item.sport_type === 'soccer' ? mapSoccerPeriod(item.live_phase) : null,
    currentPeriod: null,
    currentQuarter,
    timeRemaining,
    scoreBreakdown,
    scoreboard,
    liveStats: item.live_stats ?? null,
    oddsInfo: item.odds_info ?? null,
    soccerLeagueId: item.soccer_league?.id ?? null,
    soccerLeagueName: item.soccer_league?.name ?? null,
    soccerLeague: item.soccer_league?.name ?? null,
    allianceName: item.alliance_name ?? null,
    betInfo: null,
    homeStats: null,
    awayStats: null,
    teamStats: null,
    recentForm: null,
    headToHead: null,
    lastUpdated: item.last_updated,
    raw: item,
  };
}

function mapBaseballScoreboard(detail?: LivescoreScoreboardDetail | null): BaseballScoreboard | null {
  if (!detail) {
    return null;
  }

  const inningsData = Array.isArray((detail as any).innings) ? (detail as any).innings : null;
  if (!inningsData || inningsData.length === 0) {
    return null;
  }

  const innings: number[] = [];
  const awayScores: BaseballScoreboardEntry[] = [];
  const homeScores: BaseballScoreboardEntry[] = [];

  inningsData.forEach((entry: any, index: number) => {
    const inningNumber = entry?.inning !== undefined ? toNumber(entry.inning, index + 1) : index + 1;
    innings.push(inningNumber);
    awayScores.push({ inning: inningNumber, runs: toNumber(entry?.away ?? entry?.awayScore ?? entry?.awayRuns) });
    homeScores.push({ inning: inningNumber, runs: toNumber(entry?.home ?? entry?.homeScore ?? entry?.homeRuns) });
  });

  const totals = (detail as any).totals || {};
  const awayTotalRaw = totals.away ?? totals.awayTotal ?? (detail as any).awayTotal;
  const homeTotalRaw = totals.home ?? totals.homeTotal ?? (detail as any).homeTotal;

  const parseTotals = (source: any): BaseballScoreboardTotals => ({
    runs: toNumber(source?.runs, 0),
    hits: source?.hits !== undefined ? toNumber(source.hits, 0) : undefined,
    errors: source?.errors !== undefined ? toNumber(source.errors, 0) : undefined,
  });

  return {
    innings,
    awayScores,
    homeScores,
    awayTotal: parseTotals(awayTotalRaw),
    homeTotal: parseTotals(homeTotalRaw),
  };
}

function mapBasketballScoreboard(detail?: LivescoreScoreboardDetail | null): BasketballScoreBreakdown | null {
  const periods = Array.isArray((detail as any)?.periods) ? (detail as any).periods : null;
  if (!periods || periods.length === 0) {
    return null;
  }

  const regularPeriods = periods.slice(0, 4);
  const overtimePeriods = periods.slice(4);

  const quarters = regularPeriods.map((period: any, index: number) => ({
    label: typeof period?.label === 'string' ? period.label : `Q${index + 1}`,
    quarter: index + 1,
  }));

  const awayScores = regularPeriods.map((period: any, index: number) => ({
    quarter: index + 1,
    points: toNumber(period?.away ?? period?.awayScore ?? period?.away_points),
  }));

  const homeScores = regularPeriods.map((period: any, index: number) => ({
    quarter: index + 1,
    points: toNumber(period?.home ?? period?.homeScore ?? period?.home_points),
  }));

  const awayOtScore = overtimePeriods.reduce((sum: number, period: any) => sum + toNumber(period?.away ?? period?.awayScore ?? period?.away_points), 0);
  const homeOtScore = overtimePeriods.reduce((sum: number, period: any) => sum + toNumber(period?.home ?? period?.homeScore ?? period?.home_points), 0);

  const hasOvertime = overtimePeriods.length > 0;

  return {
    quarters,
    awayScores,
    homeScores,
    ot: hasOvertime || undefined,
    awayOtScore: hasOvertime ? awayOtScore : undefined,
    homeOtScore: hasOvertime ? homeOtScore : undefined,
  };
}

function parseBasketballPhase(livePhase?: string | null): { currentQuarter: number | null; timeRemaining: string | null } {
  if (!livePhase) {
    return { currentQuarter: null, timeRemaining: null };
  }

  const trimmed = livePhase.trim();
  const quarterMatch = trimmed.match(/^Q(\d+)(?:\s+(\d{1,2}:\d{2}))?$/i);
  if (quarterMatch) {
    const quarter = Number(quarterMatch[1]);
    const time = quarterMatch[2] ?? null;
    return {
      currentQuarter: Number.isFinite(quarter) ? quarter : null,
      timeRemaining: time,
    };
  }

  const overtimeMatch = trimmed.match(/^OT(?:\s+(\d{1,2}:\d{2}))?$/i);
  if (overtimeMatch) {
    return {
      currentQuarter: 5,
      timeRemaining: overtimeMatch[1] ?? null,
    };
  }

  return { currentQuarter: null, timeRemaining: trimmed || null };
}

function mapSoccerPeriod(livePhase?: string | null): string | null {
  if (!livePhase) {
    return null;
  }
  const normalized = livePhase.trim();
  if (!normalized) {
    return null;
  }
  if (normalized.includes('上半')) {
    return 'first_half';
  }
  if (normalized.includes('下半')) {
    return 'second_half';
  }
  if (normalized.includes('延長')) {
    return 'extra_time';
  }
  if (normalized.includes('點球')) {
    return 'penalty_shootout';
  }
  return null;
}

// 暴露给模板使用的函数和数据
defineExpose({
  selectedAlliance,
  selectedStatusType,
  loading,
  errorMessage,
  liveGames,
  selectAlliance,
  selectSoccerLeague,
  selectDateOption,
  selectDate,
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

/* 注意：聯盟選單相關樣式已移至 AllianceMenu.vue 組件 */

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

/* 注意：日曆相關樣式已移至 AllianceMenu.vue 組件 */
</style>