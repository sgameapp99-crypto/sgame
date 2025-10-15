<template>
  <div class="container mx-auto px-lg py-xl">
      <div class="heading-2">賽事結果查詢</div>

      <!-- 選單區域 -->
      <div class="predictgamebox">
        <div class="menugroupbox">
          <div class="menugroupbox-top"></div>
          <div class="menugroupbox-con">
            <div class="tagsection">
              <AllianceMenu
                :selected-alliance="selectedAlliance"
                :selected-soccer-league="null"
                :selected-status-type="'finished'"
                :baseball-expanded="baseballExpanded"
                :basketball-expanded="basketballExpanded"
                :other-expanded="otherExpanded"
                :soccer-leagues-expanded="false"
                :show-time-selector="true"
                :date-options-filter="['finished']"
                :calendar-visible="calendarVisible"
                :current-month="currentMonth"
                :selected-date="new Date(selectedDate)"
                :calendar-dates="calendarDates"
                @select-alliance="selectAlliance"
                @toggle-baseball-expanded="toggleBaseballExpanded"
                @toggle-basketball-expanded="toggleBasketballExpanded"
                @toggle-other-expanded="toggleOtherExpanded"
                @select-date-option="onSelectDateOption"
                @toggle-calendar="onToggleCalendar"
                @select-date="onSelectDate"
                @prev-month="onPrevMonth"
                @next-month="onNextMonth"
                @close-calendar="onCloseCalendar"
              />
            </div>
          </div>
          <div class="menugroupbox-bottom"></div>
        </div>
      </div>

      <!-- 數據顯示區域 -->
      <div class="results-container">
        <!-- 沒有數據時的提示 -->
        <div v-if="mockResults.length === 0" class="no-data-message">
          <div class="no-data-icon">⚾</div>
          <h3>該日期沒有比賽</h3>
          <p>請選擇其他日期或聯盟查看賽事結果</p>
        </div>

        <!-- 有數據時顯示表格 -->
        <table v-else class="predictgame-table gamedata-results">
          <thead>
            <tr>
              <th rowspan="2" class="th-gameinfo">賽事資訊</th>
              <th rowspan="2" class="th-teaminfo">球隊資訊</th>
              <th colspan="2" class="th-universal">國際盤</th>
              <th colspan="4" class="th-bank">運彩盤</th>
            </tr>
            <tr>
              <th class="th-universal-bet01">讓分</th>
              <th class="th-universal-bet02">大小</th>
              <th class="th-bank-bet01">讓分</th>
              <th class="th-bank-bet03">不讓分</th>
              <th class="th-bank-bet02">大小</th>
              <th class="th-bank-bet04">勝分差</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="result in mockResults" :key="result.id">
              <tr :data-gameid="result.id">
                <td rowspan="2" class="td-gameinfo">
                  <div>
                    <h3>{{ result.gameNumber }}</h3>
                    <h4>{{ formatTime(result.time) }}</h4>
                    <p><a href="#" @click="viewBattle(result.id)">對戰資訊</a></p>
                  </div>
                </td>
                <td rowspan="2" class="td-teaminfo">
                  <table>
                    <tbody>
                      <tr>
                        <td rowspan="3" class="scores">
                          <ul>
                            <li :class="{ winnerscores: result.winner === 'away' }">
                              {{ result.awayScore }}
                            </li>
                            <li class="vsicon">V.S.</li>
                            <li :class="{ winnerscores: result.winner === 'home' }">
                              {{ result.homeScore }}
                            </li>
                          </ul>
                        </td>
                        <td :class="{ winnerteam: result.winner === 'away' }">
                          <a href="#" @click="viewTeam(result.awayTeam.id)">{{ result.awayTeam.name }}</a>
                          <p v-if="result.winner === 'away'">
                            {{ result.awayTeam.pitcher }}
                          </p>
                          <p v-else class="loseteam">
                            {{ result.awayTeam.pitcher }}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td class="teamgap">&nbsp;</td>
                      </tr>
                      <tr>
                        <td :class="{ secondteam: true, winnerteam: result.winner === 'home' }">
                          <a href="#" @click="viewTeam(result.homeTeam.id)">{{ result.homeTeam.name }}</a>
                          <p v-if="result.winner === 'home'">
                            {{ result.homeTeam.pitcher }}
                          </p>
                          <p v-else class="loseteam">
                            {{ result.homeTeam.pitcher }}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <!-- 國際盤讓分 -->
                <td class="td-universal-bet01">
                  <div :class="{ 'result-w': result.winner === 'away' }">
                    <strong class="team-side">客</strong>
                    <span class="data-wrap">
                      <strong>{{ result.universalSpread.away }}</strong>
                      <span>{{ result.universalSpread.awayPercent }}%</span>
                    </span>
                  </div>
                </td>
                <!-- 國際盤大小 -->
                <td class="td-universal-bet02">
                  <div :class="{ 'result-w': result.universalTotal.winner === 'over' }">
                    <strong class="team-side">{{ result.universalTotal.type }}</strong>
                    <span class="data-wrap">
                      <strong>{{ result.universalTotal.line }}</strong>
                      <span>{{ result.universalTotal.percent }}%</span>
                    </span>
                  </div>
                </td>
                <!-- 運彩讓分 -->
                <td class="td-bank-bet01">
                  <div :class="{ 'result-w': result.winner === 'away' }">
                    <strong class="team-side">客</strong>
                    <span class="data-wrap">
                      <strong>{{ result.bankSpread.away }}</strong>
                      <span>, {{ result.bankSpread.awayOdds }}</span>
                    </span>
                  </div>
                </td>
                <!-- 運彩不讓分 -->
                <td class="td-bank-bet03">
                  <div :class="{ 'result-w': result.winner === 'away' }">
                    <strong class="team-side">客</strong>
                    <span class="data-wrap">
                      <strong></strong>
                      <span>{{ result.bankNoSpread.awayOdds }}</span>
                    </span>
                  </div>
                </td>
                <!-- 運彩大小 -->
                <td class="td-bank-bet02">
                  <div :class="{ 'result-w': result.bankTotal.winner === 'over' }">
                    <strong class="team-side">{{ result.bankTotal.type }}</strong>
                    <span class="data-wrap">
                      <strong>{{ result.bankTotal.line }}</strong>
                      <span>, {{ result.bankTotal.odds }}</span>
                    </span>
                  </div>
                </td>
                <!-- 勝分差 -->
                <td class="td-bank-bet04">
                  <div :class="{ 'result-w': result.winner === 'away' }">
                    <strong class="team-side">客</strong>
                    <span class="data-wrap">
                      <strong>{{ result.scoreDiff }}</strong>
                      <span></span>
                    </span>
                  </div>
                </td>
              </tr>
              <tr :data-gameid="result.id">
                <!-- 國際盤讓分 - 主隊行 -->
                <td class="td-universal-bet01">
                  <div :class="{ 'result-w': result.winner === 'home' }">
                    <strong class="team-side">主</strong>
                  </div>
                </td>
                <!-- 國際盤大小 - 主隊行 -->
                <td class="td-universal-bet02">
                  <div :class="{ 'result-w': result.universalTotal.winner === 'under' }">
                    <strong class="team-side">{{ result.universalTotal.oppositeType }}</strong>
                  </div>
                </td>
                <!-- 運彩讓分 - 主隊行 -->
                <td class="td-bank-bet01">
                  <div :class="{ 'result-w': result.winner === 'home' }">
                    <strong class="team-side">主</strong>
                    <span class="data-wrap">
                      <strong>{{ result.bankSpread.home }}</strong>
                      <span>, {{ result.bankSpread.homeOdds }}</span>
                    </span>
                  </div>
                </td>
                <!-- 運彩不讓分 - 主隊行 -->
                <td class="td-bank-bet03">
                  <div :class="{ 'result-w': result.winner === 'home' }">
                    <strong class="team-side">主</strong>
                    <span class="data-wrap">
                      <strong></strong>
                      <span>{{ result.bankNoSpread.homeOdds }}</span>
                    </span>
                  </div>
                </td>
                <!-- 運彩大小 - 主隊行 -->
                <td class="td-bank-bet02">
                  <div :class="{ 'result-w': result.bankTotal.winner === 'under' }">
                    <strong class="team-side">{{ result.bankTotal.oppositeType }}</strong>
                    <span class="data-wrap">
                      <strong>{{ result.bankTotal.line }}</strong>
                      <span>, {{ result.bankTotal.oppositeOdds }}</span>
                    </span>
                  </div>
                </td>
                <!-- 勝分差 - 主隊行 -->
                <td class="td-bank-bet04">
                  <div></div>
                </td>
              </tr>
              <tr class="gaprow">
                <td colspan="8">&nbsp;</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- 查詢條件 -->
      <div class="search-filters mb-lg">
        <div class="filters-grid">
          <!-- 聯盟選擇 -->
          <div class="filter-group">
            <label class="filter-label">聯盟</label>
            <select v-model="filters.alliance_id" class="filter-select">
              <option value="">全部聯盟</option>
              <option value="1">MLB</option>
              <option value="2">日棒</option>
              <option value="3">NBA</option>
              <option value="6">中職</option>
              <option value="9">韓棒</option>
              <option value="97">日籃</option>
            </select>
          </div>

          <!-- 球隊選擇 -->
          <div class="filter-group">
            <label class="filter-label">球隊</label>
            <select v-model="filters.team_id" class="filter-select">
              <option value="">全部球隊</option>
              <option v-for="team in availableTeams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>

          <!-- 日期範圍 -->
          <div class="filter-group">
            <label class="filter-label">開始日期</label>
            <input v-model="filters.date_from" type="date" class="filter-input">
          </div>

          <div class="filter-group">
            <label class="filter-label">結束日期</label>
            <input v-model="filters.date_to" type="date" class="filter-input">
          </div>

          <!-- 賽季 -->
          <div class="filter-group">
            <label class="filter-label">賽季</label>
            <select v-model="filters.season" class="filter-select">
              <option value="">全部賽季</option>
              <option value="2025">2025賽季</option>
              <option value="2024">2024賽季</option>
              <option value="2023">2023賽季</option>
            </select>
          </div>

          <!-- 查詢按鈕 -->
          <div class="filter-group filter-actions">
            <button class="btn btn-primary" @click="searchResults" :disabled="searching">
              {{ searching ? '搜尋中...' : '查詢' }}
            </button>
            <button class="btn btn-outline" @click="resetFilters">重置</button>
          </div>
        </div>
      </div>

      <!-- 查詢結果 -->
      <div v-if="searching" class="text-center py-xl">搜尋中...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center py-xl">{{ errorMessage }}</div>
      <div v-else-if="results.length === 0 && hasSearched" class="text-center py-xl text-neutral-600">
        沒有找到符合條件的賽事結果
      </div>
      <div v-else-if="results.length > 0" class="results-section">
        <!-- 結果統計 -->
        <div class="results-header mb-md">
          <div class="results-count">
            共找到 {{ totalResults }} 場比賽
          </div>
          <div class="results-export">
            <button class="btn btn-outline btn-sm" @click="exportResults">匯出結果</button>
          </div>
        </div>

        <!-- 結果列表 -->
        <div class="results-list">
          <div
            v-for="result in results"
            :key="result.id"
            class="result-card"
          >
            <div class="result-header">
              <div class="game-date">{{ formatDate(result.date) }}</div>
              <div class="game-alliance">{{ getAllianceName(result.alliance_id) }}</div>
            </div>

            <div class="result-teams">
              <div class="team home-team" :class="{ winner: result.winner === 'home' }">
                <div class="team-name">{{ result.home_team.name }}</div>
                <div class="team-score">{{ result.home_score }}</div>
              </div>
              <div class="vs-indicator">vs</div>
              <div class="team away-team" :class="{ winner: result.winner === 'away' }">
                <div class="team-name">{{ result.away_team.name }}</div>
                <div class="team-score">{{ result.away_score }}</div>
              </div>
            </div>

            <div class="result-details">
              <div class="detail-item">
                <span class="label">比賽狀態</span>
                <span class="value">{{ getStatusText(result.status) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">比賽場地</span>
                <span class="value">{{ result.venue }}</span>
              </div>
              <div v-if="result.inning" class="detail-item">
                <span class="label">局數</span>
                <span class="value">{{ result.inning }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分頁 -->
        <div v-if="totalResults > pageSize" class="pagination mt-lg">
          <button
            class="btn btn-outline btn-sm"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
          >
            上一頁
          </button>

          <span class="page-info">
            第 {{ currentPage }} 頁，共 {{ totalPages }} 頁
          </span>

          <button
            class="btn btn-outline btn-sm"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
          >
            下一頁
          </button>
        </div>
      </div>

      <!-- 沒有查詢時的提示 -->
      <div v-if="!hasSearched" class="search-prompt text-center py-xl">
        <div class="prompt-icon">🔍</div>
        <h3>賽事結果查詢</h3>
        <p>請選擇查詢條件來搜尋歷史賽事結果</p>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { gamesApi, type GameResult } from '../../services/gamesApi';
import AllianceMenu from '../../components/AllianceMenu.vue';

// 聯盟選擇相關
const selectedAlliance = ref(1);
const baseballExpanded = ref(false);
const basketballExpanded = ref(false);
const otherExpanded = ref(false);

// 時間選擇器相關
const calendarVisible = ref(false);
const selectedDate = ref('2025-10-15');
const currentMonth = ref('十月 2025');
const calendarDates = ref([] as { date: Date; day: number; isToday: boolean; isSelected: boolean; isCurrentMonth: boolean }[]);

// 生成日曆數據的函數
function generateCalendarDates(year: number, month: number) {
  const dates = [];
  const today = new Date();
  const currentDate = new Date(year, month, 1);
  const selectedDateObj = new Date(selectedDate.value);

  // 獲取當月的第一天是星期幾 (0=日, 1=一, 2=二, ..., 6=六)
  let firstDayOfMonth = new Date(year, month, 1).getDay();
  // 將星期日(0)轉換為7，以便計算星期一開始的偏移
  if (firstDayOfMonth === 0) firstDayOfMonth = 7;

  // 獲取當月的天數
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 添加上個月的日期（如果需要的話）
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

  // 填充上個月的日期 (從星期一開始計算)
  const prevDaysToShow = firstDayOfMonth - 1; // 星期一開始，所以減1
  for (let i = prevDaysToShow - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevMonthYear, prevMonth, day);
    dates.push({
      date,
      day,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: date.toDateString() === selectedDateObj.toDateString(),
      isCurrentMonth: false
    });
  }

  // 添加當月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    dates.push({
      date,
      day,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: date.toDateString() === selectedDateObj.toDateString(),
      isCurrentMonth: true
    });
  }

  // 填充下個月的日期（補齊42個格子）
  const remainingCells = 42 - dates.length;
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const date = new Date(nextMonthYear, nextMonth, day);
    dates.push({
      date,
      day,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: date.toDateString() === selectedDateObj.toDateString(),
      isCurrentMonth: false
    });
  }

  calendarDates.value = dates;
}

// 更新月份顯示和日曆數據
function updateCalendar(year: number, month: number) {
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  currentMonth.value = `${monthNames[month]} ${year}`;
  generateCalendarDates(year, month);
}

// 初始化日曆
function initializeCalendar() {
  const today = new Date();
  updateCalendar(today.getFullYear(), today.getMonth());
}

// 不同聯盟的模擬數據
const allianceData = {
  1: [ // MLB
    {
      id: '2025101511001',
      gameNumber: '105',
      time: '08:08',
      winner: 'away',
      awayScore: 5,
      homeScore: 1,
      scoreDiff: 4,
      awayTeam: {
        id: 14,
        name: '道奇',
        pitcher: '山本由伸'
      },
      homeTeam: {
        id: 8,
        name: '釀酒人',
        pitcher: 'Freddy Peralta'
      },
      universalSpread: {
        away: '1分贏',
        awayPercent: 50
      },
      universalTotal: {
        type: '大',
        oppositeType: '小',
        line: '7輸',
        percent: 50,
        winner: 'under'
      },
      bankSpread: {
        away: '-1.5',
        awayOdds: '2.1',
        home: '+1.5',
        homeOdds: '1.45'
      },
      bankNoSpread: {
        awayOdds: '1.68',
        homeOdds: '1.82'
      },
      bankTotal: {
        type: '大',
        oppositeType: '小',
        line: '7.5',
        odds: '1.74',
        oppositeOdds: '1.76',
        winner: 'under'
      }
    }
  ],
  2: [ // 日棒
    {
      id: '2025101512001',
      gameNumber: '206',
      time: '14:00',
      winner: 'home',
      awayScore: 2,
      homeScore: 4,
      scoreDiff: 2,
      awayTeam: {
        id: 20,
        name: '讀賣巨人',
        pitcher: '菅野智之'
      },
      homeTeam: {
        id: 21,
        name: '阪神虎',
        pitcher: '青柳晃洋'
      },
      universalSpread: {
        away: '受讓1.5',
        awayPercent: 45
      },
      universalTotal: {
        type: '小',
        oppositeType: '大',
        line: '6.5',
        percent: 52,
        winner: 'over'
      },
      bankSpread: {
        away: '+1.5',
        awayOdds: '1.85',
        home: '-1.5',
        homeOdds: '1.95'
      },
      bankNoSpread: {
        awayOdds: '1.72',
        homeOdds: '2.08'
      },
      bankTotal: {
        type: '小',
        oppositeType: '大',
        line: '6.5',
        odds: '1.78',
        oppositeOdds: '1.92',
        winner: 'over'
      }
    }
  ],
  3: [ // NBA
    {
      id: '2025101513001',
      gameNumber: '307',
      time: '19:30',
      winner: 'away',
      awayScore: 112,
      homeScore: 108,
      scoreDiff: 4,
      awayTeam: {
        id: 30,
        name: '湖人',
        pitcher: null // NBA沒有投手
      },
      homeTeam: {
        id: 31,
        name: '快艇',
        pitcher: null
      },
      universalSpread: {
        away: '讓4.5',
        awayPercent: 48
      },
      universalTotal: {
        type: '大',
        oppositeType: '小',
        line: '220.5',
        percent: 51,
        winner: 'over'
      },
      bankSpread: {
        away: '-4.5',
        awayOdds: '1.92',
        home: '+4.5',
        homeOdds: '1.88'
      },
      bankNoSpread: {
        awayOdds: '1.75',
        homeOdds: '2.05'
      },
      bankTotal: {
        type: '大',
        oppositeType: '小',
        line: '220.5',
        odds: '1.82',
        oppositeOdds: '1.98',
        winner: 'over'
      }
    }
  ]
};

// 當前顯示的數據
const mockResults = ref([] as typeof allianceData[1]); // 默認顯示空數據

// 聯盟選擇方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  // 取得聯盟資料
  const data = allianceData[allianceId as keyof typeof allianceData];
  // 確保所有 team.pitcher 欄位是 string，若為 null 則給空字串
  mockResults.value = Array.isArray(data)
    ? data.map(item => ({
        ...item,
        awayTeam: {
          ...item.awayTeam,
          pitcher: item.awayTeam && item.awayTeam.pitcher === null ? '' : item.awayTeam.pitcher
        },
        homeTeam: {
          ...item.homeTeam,
          pitcher: item.homeTeam && item.homeTeam.pitcher === null ? '' : item.homeTeam.pitcher
        }
      }))
    : [];
}

// 初始化時檢查默認聯盟是否有數據
function initializeData() {
  const data = allianceData[selectedAlliance.value as keyof typeof allianceData];
  mockResults.value = Array.isArray(data)
    ? data.map(item => ({
        ...item,
        awayTeam: {
          ...item.awayTeam,
          pitcher: item.awayTeam && item.awayTeam.pitcher === null ? '' : item.awayTeam.pitcher
        },
        homeTeam: {
          ...item.homeTeam,
          pitcher: item.homeTeam && item.homeTeam.pitcher === null ? '' : item.homeTeam.pitcher
        }
      }))
    : [];
}

function toggleBaseballExpanded() {
  baseballExpanded.value = !baseballExpanded.value;
}

function toggleBasketballExpanded() {
  basketballExpanded.value = !basketballExpanded.value;
}

function toggleOtherExpanded() {
  otherExpanded.value = !otherExpanded.value;
}

// 時間選擇器事件處理
function onSelectDateOption(option: any) {
  console.log('Selected date option:', option);

  // 只處理"昨天"的選項，因為今天和明天的比賽結果還沒有出來
  if (option.type === 'finished') {
    // 處理昨天的比賽數據
    console.log('Loading yesterday\'s game results');
    // 這裡可以根據實際需求加載昨天的數據
    // 例如：根據昨天的日期過濾數據
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    selectedDate.value = yesterdayStr;

    // 模擬根據日期加載數據的邏輯
    // 在實際應用中，這裡會調用 API
    console.log('Filtering results for yesterday:', yesterdayStr);
  }
  // 對於'live'和'scheduled'選項，不做任何處理，因為結果還沒有出來
}

function onToggleCalendar() {
  calendarVisible.value = !calendarVisible.value;
  console.log('Calendar toggled:', calendarVisible.value);
  // 當打開日曆時，確保日曆數據已生成並且是最新的
  if (calendarVisible.value) {
    const currentDate = new Date();
    generateCalendarDates(currentDate.getFullYear(), currentDate.getMonth());
    console.log('Calendar dates generated:', calendarDates.value.length);
  }
}

function onSelectDate(date: Date) {
  selectedDate.value = date.toISOString().split('T')[0];
  calendarVisible.value = false;
  // 重新生成日曆數據以更新選擇狀態
  const currentDate = new Date();
  generateCalendarDates(currentDate.getFullYear(), currentDate.getMonth());
  console.log('Selected date:', selectedDate.value);
  // 這裡可以根據選擇的日期加載數據
}

function onPrevMonth() {
  // 切換到上一月
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  let newYear = currentYear;
  let newMonth = currentMonthIndex - 1;

  if (newMonth < 0) {
    newYear--;
    newMonth = 11;
  }

  updateCalendar(newYear, newMonth);
}

function onNextMonth() {
  // 切換到下一月
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  let newYear = currentYear;
  let newMonth = currentMonthIndex + 1;

  if (newMonth > 11) {
    newYear++;
    newMonth = 0;
  }

  updateCalendar(newYear, newMonth);
}

function onCloseCalendar() {
  calendarVisible.value = false;
}


function formatTime(time: string): string {
  return `AM ${time}`;
}

function viewBattle(gameId: string) {
  // 跳轉到對戰資訊頁面
  alert(`查看比賽 ${gameId} 的對戰資訊`);
  // 在實際應用中，這裡會跳轉到對戰頁面
  // router.push(`/games/battle/${gameId}`);
}

function viewTeam(teamId: number) {
  // 跳轉到球隊頁面
  const result = mockResults.value.find(r =>
    r.awayTeam.id === teamId || r.homeTeam.id === teamId
  );
  const team = result?.awayTeam.id === teamId ? result.awayTeam : result?.homeTeam;

  if (team) {
    alert(`查看球隊 ${team.name} 的詳細資訊`);
    // 在實際應用中，這裡會跳轉到球隊頁面
    // router.push(`/games/teams/${teamId}`);
  }
}

// 原有的查詢相關響應式數據
const searching = ref(false);
const errorMessage = ref('');
const hasSearched = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const totalResults = ref(0);

// 查詢條件
const filters = reactive({
  alliance_id: '',
  team_id: '',
  date_from: '',
  date_to: '',
  season: '2025'
});

// 可用球隊列表
const availableTeams = ref([
  { id: 1, name: '芝加哥小熊' },
  { id: 2, name: '匹茲堡海盜' },
  { id: 3, name: '洛杉磯道奇' },
  { id: 4, name: '舊金山巨人' }
]);

// 查詢結果
const results = ref<GameResult[]>([]);

// 計算屬性
const totalPages = computed(() => Math.ceil(totalResults.value / pageSize.value));

// 方法
async function searchResults() {
  searching.value = true;
  errorMessage.value = '';
  hasSearched.value = true;

  try {
    const params = {
      alliance_id: filters.alliance_id || undefined,
      team_id: filters.team_id || undefined,
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined,
      season: filters.season || undefined,
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value
    };

    const data = await gamesApi.getGameResults(params);
    results.value = data.results;
    totalResults.value = data.total;
  } catch (error) {
    errorMessage.value = '搜尋失敗，請稍後再試';
    console.error('Failed to search results:', error);
  } finally {
    searching.value = false;
  }
}

function resetFilters() {
  Object.assign(filters, {
    alliance_id: '',
    team_id: '',
    date_from: '',
    date_to: '',
    season: '2025'
  });
  results.value = [];
  hasSearched.value = false;
  totalResults.value = 0;
  currentPage.value = 1;
}

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    searchResults();
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  });
}

function getAllianceName(allianceId: number): string {
  const alliances: Record<number, string> = {
    1: 'MLB',
    2: '日棒',
    3: 'NBA',
    6: '中職',
    9: '韓棒',
    97: '日籃'
  };
  return alliances[allianceId] || '未知';
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'scheduled': '未開始',
    'live': '進行中',
    'final': '已結束',
    'postponed': '延期',
    'cancelled': '取消'
  };
  return statusMap[status] || status;
}

function exportResults() {
  // 模擬匯出功能
  alert('匯出功能開發中...');
}

onMounted(() => {
  // 初始化數據
  initializeData();
  // 初始化日曆
  initializeCalendar();

  // 設置預設日期範圍為最近一個月
  const today = new Date();
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  filters.date_to = today.toISOString().split('T')[0];
  filters.date_from = oneMonthAgo.toISOString().split('T')[0];
});
</script>

<style scoped>
.search-filters {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.filter-select, .filter-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.filter-select:focus, .filter-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.filter-actions {
  justify-content: flex-start;
  gap: 0.5rem;
}

.filter-actions .btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.results-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.results-count {
  font-weight: 500;
  color: #2c3e50;
}

.results-export .btn {
  font-size: 0.8rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.result-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-date {
  font-weight: 500;
  color: #2c3e50;
}

.game-alliance {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.result-teams {
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
  position: relative;
}

.team.winner {
  background: rgba(39, 174, 96, 0.1);
  border-radius: 4px;
  padding: 0.5rem;
}

.team-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.team-score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
}

.team.winner .team-score {
  color: #27ae60;
}

.vs-indicator {
  font-weight: bold;
  color: #666;
  margin: 0 1rem;
}

.result-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  font-size: 0.9rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item .label {
  color: #666;
  font-weight: 500;
}

.detail-item .value {
  color: #2c3e50;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
}

.search-prompt {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.prompt-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.search-prompt h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.search-prompt p {
  margin: 0;
  font-size: 1.1rem;
}

/* 選單區域樣式 */
.predictgamebox {
  margin-bottom: 2rem;
}

.menugroupbox {
  border: 1px solid #cbcbcb;
  border-radius: 8px;
  overflow: hidden;
}

.menugroupbox-top {
  height: 10px;
  background: linear-gradient(to right, #1e3c72, #2a5298);
}

.menugroupbox-con {
  background: white;
}

.menugroupbox-bottom {
  height: 10px;
  background: linear-gradient(to right, #2a5298, #1e3c72);
}

.tagsection {
  display: flex;
  gap: 20px;
  padding: 20px;
  flex-wrap: wrap;
}

.tag-league-boxall {
  border: 0px;
  padding: 0px;
  width: 660px;
}

.tag-date-box {
  border-left: 1px solid #cbcbcb;
  padding-left: 20px;
  width: 220px;
}


/* 數據顯示區域樣式 */
.results-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.predictgame-table {
  width: 100%;
  border-collapse: collapse;
}

.predictgame-table th,
.predictgame-table td {
  padding: 8px 12px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.predictgame-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.th-gameinfo {
  width: 120px;
}

.th-teaminfo {
  width: 200px;
}

.th-universal,
.th-bank {
  background: #3498db;
  color: white;
}

.th-universal-bet01,
.th-universal-bet02,
.th-bank-bet01,
.th-bank-bet02,
.th-bank-bet03,
.th-bank-bet04 {
  background: #2980b9;
  font-size: 0.8rem;
}

.td-gameinfo {
  vertical-align: top;
}

.td-gameinfo h3 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.td-gameinfo h4 {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: #666;
}

.td-gameinfo p {
  margin: 0;
}

.td-gameinfo a {
  color: #3498db;
  text-decoration: none;
  font-size: 0.8rem;
}

.td-teaminfo {
  padding: 0;
}

.td-teaminfo table {
  width: 100%;
  border-collapse: collapse;
}

.scores {
  width: 80px;
  vertical-align: top;
}

.scores ul {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: center;
}

.scores li {
  padding: 8px 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
}

.winnerscores {
  color: #27ae60 !important;
}

.vsicon {
  color: #666;
  font-weight: normal;
  font-size: 0.8rem;
}

.winnerteam {
  padding: 8px 12px;
  background: rgba(39, 174, 96, 0.1);
}

.winnerteam a {
  color: #27ae60;
  font-weight: bold;
  text-decoration: none;
}

.winnerteam p {
  margin: 4px 0 0 0;
  font-size: 0.8rem;
  color: #27ae60;
}

.secondteam {
  padding: 8px 12px;
}

.secondteam a {
  color: #2c3e50;
  text-decoration: none;
}

.secondteam p {
  margin: 4px 0 0 0;
  font-size: 0.8rem;
  color: #666;
}

.loseteam {
  color: #e74c3c !important;
}

.teamgap {
  height: 8px;
}

/* 投注數據樣式 */
.team-side {
  display: inline-block;
  width: 20px;
  margin-right: 4px;
  font-size: 0.8rem;
  color: white;
  background: #95a5a6;
  padding: 2px 4px;
  border-radius: 2px;
}

.result-w .team-side {
  background: #27ae60;
}

.data-wrap {
  display: block;
  margin-top: 2px;
}

.data-wrap strong {
  display: block;
  font-size: 0.9rem;
  color: #2c3e50;
}

.data-wrap span {
  font-size: 0.7rem;
  color: #666;
}

.result-w .data-wrap strong {
  color: #27ae60;
}

.gaprow {
  background: #f8f9fa;
}

.gaprow td {
  border: none;
  height: 8px;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .result-teams {
    flex-direction: column;
    gap: 1rem;
  }

  .vs-indicator {
    margin: 0.5rem 0;
  }

  .result-details {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }

  .tagsection {
    flex-direction: column;
    gap: 1rem;
  }

  .tag-league-boxall {
    width: 100%;
  }


  .predictgame-table {
    font-size: 0.8rem;
  }

  .predictgame-table th,
  .predictgame-table td {
    padding: 6px 8px;
  }

  .no-data-message {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
  }

  .no-data-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .no-data-message h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .no-data-message p {
    margin: 0;
    font-size: 1.1rem;
  }
}
</style>
