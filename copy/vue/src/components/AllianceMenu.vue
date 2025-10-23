<template>
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
              <li :class="{ 'tag-chosen': selectedAlliance === 1 }" @click="handleAllianceClick(1, $event)">
                MLB
              </li>
              <li :class="{ 'tag-chosen': selectedAlliance === 3, 'nonepredict': !allianceHasGames(3) }" @click="handleAllianceClick(3, $event)">
                <a href="javascript:void(0)">日本職棒</a>
              </li>
              <li :class="{ 'tag-chosen': selectedAlliance === 4, 'nonepredict': !allianceHasGames(4) }" @click="handleAllianceClick(4, $event)">
                <a href="javascript:void(0)">中華職棒</a>
              </li>
              <li :class="{ 'tag-chosen': selectedAlliance === 6, 'nonepredict': !allianceHasGames(6) }" @click="handleAllianceClick(6, $event)">
                <a href="javascript:void(0)">韓國職棒</a>
              </li>

              <!-- 可展開/收起的分類 -->
              <div :class="['games-close', { 'expanded': baseballExpanded }]">
                <li :class="{ 'tag-chosen': selectedAlliance === 83, 'nonepredict': !allianceHasGames(83) }" @click="handleAllianceClick(83, $event)">
                  <a href="javascript:void(0)">澳洲職棒</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 114, 'nonepredict': !allianceHasGames(114) }" @click="handleAllianceClick(114, $event)">
                  <a href="javascript:void(0)">國際棒賽</a>
                </li>
              </div>

              <!-- 展開/收起按鈕 -->
              <a href="#" :class="['more_play_btn', 'hide', { 'reportActive': baseballExpanded }]" @click.prevent="emit('toggle-baseball-expanded')">
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
              <li :class="{ 'tag-chosen': selectedAlliance === 7, 'nonepredict': !allianceHasGames(7) }" @click="handleAllianceClick(7, $event)">
                <a href="javascript:void(0)">WNBA</a>
              </li>
              <li :class="{ 'tag-chosen': selectedAlliance === 97, 'nonepredict': !allianceHasGames(97) }" @click="handleAllianceClick(97, $event)">
                <a href="javascript:void(0)">日本職籃</a>
              </li>
              <li :class="{ 'tag-chosen': selectedAlliance === 12, 'nonepredict': !allianceHasGames(12) }" @click="handleAllianceClick(12, $event)">
                <a href="javascript:void(0)">澳洲職籃</a>
              </li>

              <!-- 可展開/收起的分類 -->
              <div :class="['games-close', { 'expanded': basketballExpanded }]">
                <li :class="{ 'tag-chosen': selectedAlliance === 2, 'nonepredict': !allianceHasGames(2) }" @click="handleAllianceClick(2, $event)">
                  <a href="javascript:void(0)">NBA</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 8, 'nonepredict': !allianceHasGames(8) }" @click="handleAllianceClick(8, $event)">
                  <a href="javascript:void(0)">歐洲職籃</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 89, 'nonepredict': !allianceHasGames(89) }" @click="handleAllianceClick(89, $event)">
                  <a href="javascript:void(0)">SBL</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 92, 'nonepredict': !allianceHasGames(92) }" @click="handleAllianceClick(92, $event)">
                  <a href="javascript:void(0)">韓國職籃</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 94, 'nonepredict': !allianceHasGames(94) }" @click="handleAllianceClick(94, $event)">
                  <a href="javascript:void(0)">中國職籃</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 110, 'nonepredict': !allianceHasGames(110) }" @click="handleAllianceClick(110, $event)">
                  <a href="javascript:void(0)">國際籃賽</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 121, 'nonepredict': !allianceHasGames(121) }" @click="handleAllianceClick(121, $event)">
                  <a href="javascript:void(0)">綜合籃賽</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 16, 'nonepredict': !allianceHasGames(16) }" @click="handleAllianceClick(16, $event)">
                  <a href="javascript:void(0)">P+</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 18, 'nonepredict': !allianceHasGames(18) }" @click="handleAllianceClick(18, $event)">
                  <a href="javascript:void(0)">TPBL</a>
                </li>
              </div>

              <!-- 展開/收起按鈕 -->
              <a href="#" :class="['more_play_btn', 'hide', { 'reportActive': basketballExpanded }]" @click.prevent="emit('toggle-basketball-expanded')">
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
              <li :class="{ 'tag-chosen': selectedAlliance === 5, 'nonepredict': !allianceHasGames(5) }" @click="handleAllianceClick(5, $event)">
                <a href="javascript:void(0)">足球</a>
              </li>
              <li :class="{ 'tag-chosen': selectedAlliance === 87, 'nonepredict': !allianceHasGames(87) }" @click="handleAllianceClick(87, $event)">
                <a href="javascript:void(0)">俄羅斯冰球</a>
              </li>
              <li :class="{ 'tag-chosen': selectedAlliance === 93, 'nonepredict': !allianceHasGames(93) }" @click="handleAllianceClick(93, $event)">
                <a href="javascript:void(0)">美式足球</a>
              </li>

              <!-- 可展開/收起的分類 -->
              <div :class="['games-close', { 'expanded': otherExpanded }]">
                <li :class="{ 'tag-chosen': selectedAlliance === 91, 'nonepredict': !allianceHasGames(91) }" @click="handleAllianceClick(91, $event)">
                  <a href="javascript:void(0)">NHL冰球</a>
                </li>
                <li :class="{ 'tag-chosen': selectedAlliance === 21, 'nonepredict': !allianceHasGames(21) }" @click="handleAllianceClick(21, $event)">
                  <a href="javascript:void(0)">網球</a>
                </li>
              </div>

              <!-- 展開/收起按鈕 -->
              <a href="#" :class="['more_play_btn', 'hide', { 'reportActive': otherExpanded }]" @click.prevent="emit('toggle-other-expanded')">
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
                @click="handleSoccerLeagueClick(league.id, $event)"
              >
                <a href="javascript:void(0)">{{ league.displayName }}</a>
              </li>
            </ol>
          </div>
        </div>

        <!-- 時間選擇器 -->
        <div v-if="showTimeSelector" class="tag-league-box tag-box calendar-wrapper">
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
                @click="handleDateOptionClick(option, $event)"
              >
                <a href="javascript:void(0)">
                  {{ option.display }}
                </a>
              </li>
              <li>
                <a href="javascript:;" id="more-day" v-on:click="emit('toggle-calendar')">
                  更多 ▼ ({{ calendarVisible ? '展開' : '收起' }})
                </a>
              </li>
            </ol>
          </div>
        </div>

        <!-- 日曆選擇器 -->
        <div v-if="calendarVisible" class="calendar-container">
          <div class="calendar-header">
            <button @click="emit('prev-month')">‹</button>
            <span>{{ currentMonth }}</span>
            <button @click="emit('next-month')">›</button>
            <button @click="emit('close-calendar')" class="close-btn">×</button>
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
              @click="emit('select-date', date.date)"
            >
              {{ date.day }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props 定義
interface Props {
  selectedAlliance: number;
  selectedSoccerLeague: number | null;
  selectedStatusType: 'finished' | 'live' | 'scheduled';
  selectedDateRange?: string; // 當前選擇的日期範圍（會員頁面使用）
  baseballExpanded: boolean;
  basketballExpanded: boolean;
  otherExpanded: boolean;
  soccerLeaguesExpanded: boolean;
  showTimeSelector: boolean;
  dateOptionsFilter: ('finished' | 'live' | 'scheduled' | 'week' | 'month' | 'all')[];
  calendarVisible: boolean;
  currentMonth: string;
  selectedDate: Date;
  calendarDates: { date: Date; day: number; isToday: boolean; isSelected: boolean; isCurrentMonth: boolean }[];
}

const props = withDefaults(defineProps<Props>(), {
  selectedAlliance: 1,
  selectedSoccerLeague: null,
  selectedStatusType: 'live',
  baseballExpanded: false,
  basketballExpanded: false,
  otherExpanded: false,
  soccerLeaguesExpanded: false,
  showTimeSelector: true,
  dateOptionsFilter: () => ['finished', 'live', 'scheduled'],
  calendarVisible: false,
  currentMonth: '九月 2025',
  selectedDate: () => new Date(),
  calendarDates: () => []
});

// Emits 定義
const emit = defineEmits<{
  'select-alliance': [allianceId: number];
  'select-soccer-league': [leagueId: number];
  'select-date-option': [option: any];
  'toggle-baseball-expanded': [];
  'toggle-basketball-expanded': [];
  'toggle-other-expanded': [];
  'toggle-calendar': [];
  'select-date': [date: Date];
  'prev-month': [];
  'next-month': [];
  'close-calendar': [];
}>();

// 響應式數據
const daysOfWeek = ['一', '二', '三', '四', '五', '六', '日'];

// 足球聯賽數據
const soccerLeagues = [
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
];

// 計算屬性：生成狀態篩選選項
const dateOptions = computed(() => {
  const options = [];

  // 取得今天的日期（只比較年月日，忽略時分秒）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 檢查是否包含日期範圍選項（week, month, all）
  const hasRangeOptions = props.dateOptionsFilter.some(opt => ['week', 'month', 'all'].includes(opt));

  console.log('📊 dateOptions 計算屬性執行');
  console.log('📊 props.dateOptionsFilter:', props.dateOptionsFilter);
  console.log('📊 hasRangeOptions:', hasRangeOptions);

  if (hasRangeOptions) {
    // 會員頁面模式：一週內、一個月內、全部
    const rangeOptions = [
      { type: 'week', display: '一週內' },
      { type: 'month', display: '一個月內' },
      { type: 'all', display: '全部' }
    ];

    rangeOptions.forEach(opt => {
      if (props.dateOptionsFilter.includes(opt.type as any)) {
        options.push({
          display: opt.display,
          type: opt.type,
          isSelected: props.selectedDateRange === opt.type // 根據當前選擇設置高亮
        });
      }
    });
    
    console.log('📊 生成的日期範圍選項:', options);
    console.log('📊 當前選擇的日期範圍:', props.selectedDateRange);
  } else {
    // 預測頁面模式：今天(未進行)、明天(未進行)、後天(未進行)
    const dateLabels = ['今天', '明天', '後天'];
    const statusTypes: ('finished' | 'live' | 'scheduled')[] = ['scheduled', 'scheduled', 'scheduled'];

    for (let i = 0; i < 3; i++) {
      const statusType = statusTypes[i];

      // 根據 dateOptionsFilter 過濾顯示的選項
      if (props.dateOptionsFilter.includes(statusType)) {
        // 計算對應的日期
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i); // i=0:今天, i=1:明天, i=2:後天
        
        // 比較 selectedDate 和目標日期（只比較年月日）
        const selectedDateOnly = new Date(props.selectedDate);
        selectedDateOnly.setHours(0, 0, 0, 0);
        
        const isSelected = selectedDateOnly.getTime() === targetDate.getTime();

        options.push({
          display: dateLabels[i],
          type: statusType,
          isSelected
        });
      }
    }
    
    console.log('📊 生成的狀態選項:', options);
  }

  return options;
});

// 方法
function handleAllianceClick(allianceId: number, event?: Event) {
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
  emit('select-alliance', allianceId);
}

function handleSoccerLeagueClick(leagueId: number, event?: Event) {
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

  emit('select-soccer-league', leagueId);
}

function handleDateOptionClick(option: any, event?: Event) {
  console.log('🎯 AllianceMenu - handleDateOptionClick 被調用');
  console.log('🎯 接收到的 option:', option);
  console.log('🎯 option.type:', option?.type);
  console.log('🎯 option.display:', option?.display);
  
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
  
  console.log('🎯 準備 emit select-date-option 事件，參數:', option);
  emit('select-date-option', option);
  console.log('🎯 emit 完成');
}

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
</script>

<style scoped>
/* 聯盟選單樣式 */
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

@media (max-width: 768px) {
  .tag-league-boxall {
    flex-direction: column;
  }
}
</style>

export default {
  name: 'AllianceMenu'
}

