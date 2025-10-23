<template>
  <div class="member-page">
    <div class="member-showroom">

      <!-- 主要內容區域 -->
      <div class="member-maincon">
        <!-- 頂部篩選區 - 使用完整的 AllianceMenu 組件 -->
        <div v-if="activeTab === 'predict'" class="member-alliance-menu">
          <AllianceMenu
            :selected-alliance="selectedAlliance"
            :selected-soccer-league="selectedSoccerLeague"
            :selected-status-type="selectedStatusType"
            :selected-date-range="selectedDateRange"
            :baseball-expanded="baseballExpanded"
            :basketball-expanded="basketballExpanded"
            :other-expanded="otherExpanded"
            :soccer-leagues-expanded="soccerLeaguesExpanded"
            :calendar-visible="calendarVisible"
            :current-month="currentMonth"
            :selected-date="selectedDate"
            :calendar-dates="calendarDates"
            :show-time-selector="true"
            :date-options-filter="['week', 'month', 'all']"
            @select-alliance="selectAlliance"
            @select-soccer-league="selectSoccerLeague"
            @select-date-option="selectDateOption"
            @toggle-baseball-expanded="toggleBaseballExpanded"
            @toggle-basketball-expanded="toggleBasketballExpanded"
            @toggle-other-expanded="toggleOtherExpanded"
            @toggle-calendar="toggleCalendar"
            @select-date="handleSelectDate"
            @prev-month="prevMonth"
            @next-month="nextMonth"
            @close-calendar="closeCalendar"
          />
        </div>
        <!-- 預測頁面 -->
        <div v-if="activeTab === 'predict'" class="tab-content">
          <div class="allpredictionbox">
            <!-- 國際盤預測表格 -->
            <div class="universe-tablebox">
              <form action="/predict/setGohomer" method="POST" name="igohomerform">
                <table border="0" cellspacing="0" cellpadding="0" class="universe-tablecon tablecon--height">
                  <input type="hidden" name="predictGameMode" value="2">
                  <tbody>
                    <tr>
                      <th colspan="2" class="gameevent">國際盤賽事</th>
                      <th class="managerpredictcon">預測</th>
                      <th class="predictresult">結果</th>
                    </tr>
                    <template v-if="filteredPredictions.filter((p: any) => p.predictionType?.startsWith('international_')).length > 0">
                      <tr v-for="(prediction, index) in filteredPredictions.filter((p: any) => p.predictionType?.startsWith('international_'))" :key="prediction.id" :class="{ 'evenrow': index % 2 === 1 }">
                        <td rowspan="1" class="gamenum">
                          <ul>
                            <li>{{ prediction.gameInfo?.allianceName || 'N/A' }}</li>
                            <li>{{ prediction.gameInfo?.gameTime || '--:--' }}</li>
                          </ul>
                        </td>
                        <td rowspan="1">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <th>{{ prediction.gameInfo?.homeTeam || '主隊' }}</th>
                              <td class="secondteam"></td>
                            </tr>
                            <tr>
                              <th class="secondteam">{{ prediction.gameInfo?.awayTeam || '客隊' }}(主)</th>
                              <td class="secondteam"></td>
                            </tr>
                          </table>
                        </td>
                        <td class="managerpredictcon">
                          {{ prediction.predictionTypeLabel || prediction.predictionType }} 
                          <span class="predict-bet-weight">{{ prediction.selectionLabel || prediction.selection }}</span>
                        </td>
                        <td class="predictresult" :class="{ 'incorrect': prediction.status === 'lose' }">
                          <span v-if="prediction.status === 'pending'">等待中</span>
                          <span v-else-if="prediction.status === 'win'">✓</span>
                          <span v-else-if="prediction.status === 'lose'">囧</span>
                          <span v-else>{{ prediction.status }}</span>
                        </td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td colspan="4" class="no-predict">無預測</td>
                    </tr>
                  </tbody>
                </table>
                <input type="hidden" name="gamedate" value="20250919">
                <input type="hidden" name="gameday" value="today">
                <input type="hidden" name="allianceid" value="1">
              </form>
            </div>

            <!-- 運彩盤預測表格 -->
            <div class="bank-tablebox">
              <form action="/predict/setGohomer" method="POST" name="gohomerform">
                <table border="0" cellspacing="0" cellpadding="0" class="bank-tablecon tablecon--height">
                  <input type="hidden" name="predictGameMode" value="1">
                  <tbody>
                    <tr>
                      <th colspan="2" class="gameevent">運彩盤賽事</th>
                      <th class="managerpredictcon">預測</th>
                      <th class="predictresult">結果</th>
                    </tr>
                    <template v-if="filteredPredictions.filter((p: any) => p.predictionType?.startsWith('taiwan_')).length > 0">
                      <tr v-for="(prediction, index) in filteredPredictions.filter((p: any) => p.predictionType?.startsWith('taiwan_'))" :key="prediction.id" :class="{ 'evenrow': index % 2 === 1 }">
                        <td rowspan="1" class="gamenum">
                          <ul>
                            <li>{{ prediction.gameInfo?.allianceName || 'N/A' }}</li>
                            <li>{{ prediction.gameInfo?.gameTime || '--:--' }}</li>
                          </ul>
                        </td>
                        <td rowspan="1">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <th>{{ prediction.gameInfo?.homeTeam || '主隊' }}</th>
                              <td class="secondteam"></td>
                            </tr>
                            <tr>
                              <th class="secondteam">{{ prediction.gameInfo?.awayTeam || '客隊' }}(主)</th>
                              <td class="secondteam"></td>
                            </tr>
                          </table>
                        </td>
                        <td class="managerpredictcon">
                          {{ prediction.predictionTypeLabel || prediction.predictionType }} 
                          <span class="predict-bet-weight">{{ prediction.selectionLabel || prediction.selection }}</span>
                        </td>
                        <td class="predictresult" :class="{ 'incorrect': prediction.status === 'lose' }">
                          <span v-if="prediction.status === 'pending'">等待中</span>
                          <span v-else-if="prediction.status === 'win'">✓</span>
                          <span v-else-if="prediction.status === 'lose'">囧</span>
                          <span v-else>{{ prediction.status }}</span>
                        </td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td colspan="4" class="no-predict">無預測</td>
                    </tr>
                  </tbody>
                </table>
                <input type="hidden" name="gamedate" value="20250919">
                <input type="hidden" name="gameday" value="today">
                <input type="hidden" name="allianceid" value="1">
              </form>
            </div>
          </div>
        </div>

        <!-- 遊戲紀錄頁面 -->
        <div v-if="activeTab === 'bet'" class="tab-content">
          <div class="tagsection bet-datebar">
            <span class="tagsection__date">賽事日期</span>
            <a v-for="d in betDateButtons" :key="d.key" :class="['js-member-page-gamedate', { selected: d.selected }]" href="#" @click.prevent="selectBetDate(d.key)">
              <span>{{ d.date }}</span>
              <span>({{ d.week }})</span>
            </a>
          </div>

          <div class="betmember_icon">
            <p class="betmember_icon__number">
              彩幣帳戶編號 <span id="textcopy">{{ betAccountId }}</span>
              <button name="textcopy" class="textcopy js-textcopy" @click="copyBetAccount">複製</button>
            </p>
            <div v-if="showCopyPrompt" id="js-textcopy_prompt" class="textcopy_prompt">
              已複製彩幣帳戶編號
              <button @click="showCopyPrompt = false"> x </button>
            </div>

            <a id="js-member-page-go-to-guess-account-button" href="#" class="betmember_icon__account">彩幣帳戶</a>
            <a id="js-member-page-go-to-guess-transfer-button" href="#" class="betmember_icon__transfer">轉贈彩幣</a>
          </div>

          <div id="js-bets-table">
            <div v-if="!hasBetLogs" class="bet_start"><p><a href="#">開始玩！</a></p></div>
            <div v-else>
              <!-- 下注紀錄清單：待接 API -->
            </div>
          </div>
        </div>

        <!-- 戰績頁面 -->
        <div v-if="activeTab === 'record'" class="tab-content">
          <!-- 戰績上方分類選單 -->
          <div class="tagsection">
            <ul id="tagselectid" class="tagselect">
              <li class="tagselect-dropdown">
                <ul class="tagselect-lv02">
                  <li class="positionbase">
                    <div class="tagselect-lv02-con">
                      <div class="tag-league-box tag-box">
                        <div class="tag-box-first">
                          <ol class="tag-league">
                            <li class="fold-head"></li>
                            <li>分類</li>
                            <li class="fold-footer"></li>
                          </ol>
                        </div>
                        <div class="tag-box-last">
                          <ol class="tag-con">
                            <li class="tag-chosen">總覽</li>
                            <li><a href="#">勝率</a></li>
                            <li><a href="#">莊家殺手資格</a></li>
                            <li><a href="#">單場殺手資格</a></li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- 戰績總覽表格 -->
          <div class="allpredictionbox records-index">
            <div class="universe-tablebox">
              <h1>國際盤</h1>
              <table border="0" cellspacing="0" cellpadding="0" class="universe-tablecon">
                <tbody>
                  <tr>
                    <th class="records-killer-mark">近期殺手</th>
                    <th class="records-league">聯盟</th>
                    <th class="records-wins">月勝率</th>
                    <th class="records-mainwins">主推月勝率</th>
                    <th class="records-bankerkiller">莊家殺手</th>
                    <th class="records-mainwinskiller">單場殺手</th>
                    <th class="records-level">等級</th>
                  </tr>
                  <tr>
                    <td colspan="7" class="records-mainwinskiller">無預測賽事</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="text-align:right;margin-top:10px;margin-bottom:20px;"><p>僅列出本月或上月有預測的聯盟</p></div>

            <div class="bank-tablebox">
              <h1>運彩盤</h1>
              <table border="0" cellspacing="0" cellpadding="0" class="bank-tablecon">
                <tbody>
                  <tr>
                    <th class="records-killer-mark">近期殺手</th>
                    <th class="records-league">聯盟</th>
                    <th class="records-wins">月勝率</th>
                    <th class="records-mainwins">主推月勝率</th>
                    <th class="records-bankerkiller">莊家殺手</th>
                    <th class="records-mainwinskiller">單場殺手</th>
                    <th class="records-level">等級</th>
                  </tr>
                  <tr>
                    <td colspan="7" class="records-mainwinskiller">無預測賽事</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="text-align:right;margin-top:10px;margin-bottom:20px;"><p>僅列出本月或上月有預測的聯盟</p></div>
          </div>
        </div>

        <!-- 討論頁面 -->
        <div v-if="activeTab === 'forum'" class="tab-content">
          <!-- 討論分頁：上方分類選單 -->
          <div class="tagsection">
            <div class="tag-league-box tag-box">
              <div class="tag-box-first">
                <ol class="tag-league">
                  <li class="fold-head"></li>
                  <li>討論區</li>
                  <li class="fold-footer"></li>
                </ol>
              </div>
              <div class="tag-box-last">
                <ol class="tag-con">
                  <li class="tag-chosen">總覽</li>
                  <li><a href="#">發文</a></li>
                  <li><a href="#">回文</a></li>
                  <li><a href="#">感謝文</a></li>
                </ol>
              </div>
            </div>
          </div>

          <!-- 討論總覽資訊 -->
          <div class="forums_overview">
            <div class="overview__peoples">有 <span>0</span> 人追蹤我的發文</div>

            <div class="overview-table">
              <!-- 左側區塊 -->
              <div class="ov-card">
                <div class="ov-header">
                  <div class="ov-title">總發文</div>
                  <div class="ov-value"><span class="number">0</span> 篇</div>
                </div>
                <ul class="ov-list">
                  <li><span>熱門文章數</span><em><span class="number">0</span> 篇</em></li>
                  <li><span>總回文數</span><em><span class="number">0</span> 次</em></li>
                  <li><span>單篇獲得最多回文數</span><em><span class="number">0</span> 次</em></li>
                  <li><span>被引用次數</span><em><span class="number">0</span> 次</em></li>
                  <li><span>總推文數</span><em><span class="number">0</span> 次</em></li>
                  <li><span>單篇獲得最多推數</span><em><span class="number">0</span> 次</em></li>
                  <li><span>累積獲得推數</span><em><span class="number">0</span> 次</em></li>
                </ul>
              </div>

              <!-- 右側區塊 -->
              <div class="ov-card">
                <div class="ov-header">
                  <div class="ov-title">總分析文</div>
                  <div class="ov-value"><span class="number">0</span> 篇</div>
                </div>
                <ul class="ov-list">
                  <li><span>感謝文</span><em><span class="number">0</span> 篇</em></li>
                  <li><span>百倍達人</span><em><span class="number">0</span> 次</em></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 榮譽頁面 -->
        <div v-if="activeTab === 'honor'" class="tab-content">
          <div class="tagsection"></div>

          <div class="allpredictionbox">
            <div class="bank-tablebox member-forum-tablebox">
              <!-- MEDAL START -->
              <div class="games_medal">
                <div class="medal medal--border" style="text-align: left;">
                  <span class="medal-title">預測/殺手<span class="medal-arrow"></span></span>
                  <ul class="medal-box">
                    <li class="medal-box-content">
                      <span class="medal-icon">🏅</span>
                      <span>莊家殺手</span>
                      <strong class="medal-count">0</strong>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">🎯</span>
                      <span>單場殺手</span>
                      <strong class="medal-count">0</strong>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">🏆</span>
                      <span>蟬聯莊家殺手</span>
                      <strong class="medal-count">0</strong>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">⭐</span>
                      <span>蟬聯單場殺手</span>
                      <strong class="medal-count">0</strong>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">📈</span>
                      <span>殺手販售預測<br>突破200人</span>
                      <strong class="medal-count">0</strong>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- MEDAL END -->

              <table border="0" cellspacing="0" cellpadding="0" class="bank-tablecon member-forum-tablecon">
                <tbody>
                  <tr>
                    <th class="member-honor-date">時間</th>
                    <th class="member-honor-subject">榮譽</th>
                  </tr>
                  <tr>
                    <td colspan="2" style="text-align:center;border-right:1px solid #d9d9d9;">
                      <span class="nodata">無榮譽</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="honor-divider"></div>
              <div class="pagination sabrosus" style="margin-top: 25px; font-size: 13px;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側：其他區塊（側邊欄／人氣／篩選） -->
      <div class="member-others">
        <!-- 會員側邊欄 -->
        <div id="member-sidebar" class="member-sidebar">
          <div class="photoframe">
            <img :src="getAvatarUrl(memberInfo.avatarUrl)" :alt="memberInfo.name" />
          </div>
          <p class="memberidname">{{ memberInfo.name }}</p>
          <div class="member-level-badge" :style="{ borderColor: levelColor }" aria-live="polite">
            <span class="level-icon" aria-hidden="true">{{ memberInfo.levelInfo?.icon || '⭐' }}</span>
            <span class="level-name" :style="{ color: levelColor }">{{ memberInfo.levelInfo?.name || memberInfo.level }}</span>
          </div>
          <div class="member-level-progress" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100" :aria-label="`等級進度 ${progressPercent}%`">
            <div class="bar" :style="{ width: progressPercent + '%', background: levelColor }"></div>
          </div>
          
          <!-- 彩幣餘額顯示 -->
          <div class="coin-balance-display">
            <div class="coin-balance-label">當前彩幣餘額</div>
            <div class="coin-balance-amount">{{ coinBalance.toLocaleString() }} 彩幣</div>
          </div>
          
          <ul class="member-showroom-nav">
            <li :class="{ 'chosen': activeTab === 'predict' }" @click="activeTab = 'predict'">
              <a href="#" class="sidebarEventBtn">
                <strong>預測</strong>
              </a>
            </li>
            <li :class="{ 'chosen': activeTab === 'record' }" @click="activeTab = 'record'">
              <a href="#" class="sidebarEventBtn">
                <strong>戰績</strong>
              </a>
            </li>
            <li :class="{ 'chosen': activeTab === 'bet' }" @click="activeTab = 'bet'">
              <a href="#" class="sidebarEventBtn">
                <strong>遊戲紀錄</strong>
              </a>
            </li>
            <li :class="{ 'chosen': activeTab === 'forum' }" @click="activeTab = 'forum'">
              <a href="#" class="sidebarEventBtn">
                <strong>討論</strong>
              </a>
            </li>
            <li :class="{ 'chosen': activeTab === 'honor' }" @click="activeTab = 'honor'">
              <a href="#" class="sidebarEventBtn">
                <strong>榮譽</strong>
              </a>
            </li>
          </ul>
          <div class="idstatusbox">
            <div class="addguide_other">
              <p>他是<strong> </strong><strong class="js-poster-friends-count-0">{{ memberInfo.followers }}</strong><strong> </strong>個人的一盞明燈</p>
            </div>
          </div>
          <div class="friend-actions" v-if="session.userId !== memberInfo.id">
            <button
              v-if="!isFollowing"
              class="follow-btn follow-btn--lamp"
              @click="followUser"
              :disabled="followLoading"
              aria-label="加為明燈"
            >
              <i class="fa fa-lightbulb-o"></i> 加為明燈
            </button>
            <button
              v-else
              class="unfollow-btn"
              @click="unfollowUser"
              :disabled="unfollowLoading"
              aria-label="取消明燈"
            >
              <i class="fa fa-times"></i> 取消明燈
            </button>
          </div>
        </div>

        <!-- 今日人氣 -->
        <div class="league-pvnum">
          <div class="league-pvnum__top">
            <p class="league-pvnum--border">
              今日人氣
              <strong>{{ memberStats.todayPopularity }}</strong>
            </p>
            <p>
              多發文可以增加人氣哦～
              <span></span>
            </p>
          </div>
        </div>

        
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';
import { memberAPI, levelAPI, predictionsAPI, coinsAPI } from '../api';
import { getAvatarUrl, DEFAULT_AVATAR, addTimestampToUrl } from '../utils/avatar';
import type { Prediction } from '../types/prediction';
import AllianceMenu from '../components/AllianceMenu.vue';

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

// 使用統一的預設頭像
const defaultBlackAvatar = DEFAULT_AVATAR;

// 響應式數據
const activeTab = ref('predict');
const selectedLeague = ref('');
const selectedDateRange = ref('all'); // 預設為"全部"，顯示今天到未來所有預測
const isFollowing = ref(false);
const followLoading = ref(false);
const unfollowLoading = ref(false);

// AllianceMenu 相關的響應式數據
const selectedAlliance = ref(1); // 預設選擇 MLB
const selectedSoccerLeague = ref<number | null>(null);
const selectedStatusType = ref<'finished' | 'live' | 'scheduled'>('all' as any); // 會員頁使用 'all' 顯示全部
const baseballExpanded = ref(false);
const basketballExpanded = ref(false);
const otherExpanded = ref(false);
const soccerLeaguesExpanded = ref(false);
const calendarVisible = ref(false);
const currentMonth = ref('');
const selectedDate = ref(new Date());
const calendarDates = ref<{ date: Date; day: number; isToday: boolean; isSelected: boolean; isCurrentMonth: boolean }[]>([]);
  // 遊戲紀錄狀態
  const showCopyPrompt = ref(false);
  const betAccountId = ref('23333762');
  const betDateButtons = ref([
    { key: 'd5', date: '09/15', week: '一', selected: false },
    { key: 'd4', date: '09/16', week: '二', selected: false },
    { key: 'd3', date: '09/17', week: '三', selected: false },
    { key: 'd2', date: '09/18', week: '四', selected: false },
    { key: 'd1', date: '09/19', week: '五', selected: true },
  ]);
  const hasBetLogs = ref(false);

// 會員資訊
const memberInfo = ref({
  id: 'ydasam',
  name: '阿達工友',
  avatar: defaultBlackAvatar,
  avatarUrl: defaultBlackAvatar, // 用於顯示，包含時間戳
  followers: 264,
  joinDate: '2020-01-15',
  level: 'NEWBIE',
  levelInfo: {
    code: 'NEWBIE',
    name: '新手',
    nameEn: 'NEWBIE',
    color: '#667eea',
    icon: '⭐',
    minScore: 0,
    maxScore: 100,
    description: '' ,
    benefits: [] as string[],
  },
  levelProgress: {
    percentage: 0,
    currentScore: 0,
    levelMinScore: 0,
    levelMaxScore: 100,
    pointsToNext: 100,
  },
  bio: '運動彩券分析師，專精MLB和NBA預測'
});

// 會員統計
const memberStats = ref({
  totalPredictions: 1250,
  winRate: 68.5,
  winStreak: 12,
  ranking: 15,
  todayPopularity: 3,
  totalPosts: 312,
  totalThanksPosts: 0,
  internationalWinRate: 60,
  internationalMainWinRate: 36,
  internationalBookmakerKiller: 0,
  internationalSingleKiller: 0,
  bankWinRate: 75,
  bankMainWinRate: 86,
  bankBookmakerKiller: 0,
  bankSingleKiller: 0
});

// 預測記錄 - 使用真實 API
const predictions = ref<Prediction[]>([]);
const predictionsLoading = ref(false);
const predictionsError = ref('');
const totalPredictions = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// 購買預測功能
const purchaseLoading = ref(false);
const purchaseMessage = ref('');
const purchaseSuccess = ref(false);
const selectedPredictionId = ref<string | null>(null);

// 彩幣餘額
const coinBalance = ref(0);

// 舊的 mock 數據，暫時保留註解供參考
/*
const oldPredictions = ref([
  {
    id: 1,
    league: 'MLB',
    gameMode: 'international',
    date: '2024-01-15',
    title: '道奇 vs 巨人 主場優勢明顯',
    homeTeam: '道奇',
    awayTeam: '巨人',
    type: '讓分',
    odds: '-1.5',
    result: 'win'
  },
  {
    id: 2,
    league: 'NBA',
    gameMode: 'bank',
    date: '2024-01-14',
    title: '湖人 vs 勇士 大小分預測',
    homeTeam: '湖人',
    awayTeam: '勇士',
    type: '大小分',
    odds: '220.5 大',
    result: 'lose'
  },
  {
    id: 3,
    league: 'CPBL',
    gameMode: 'international',
    date: '2024-01-13',
    title: '統一 vs 樂天 投注建議',
    homeTeam: '統一',
    awayTeam: '樂天',
    type: '勝負',
    odds: '統一勝',
    result: 'pending'
  }
]);
*/

// 論壇文章
const memberPosts = ref([
  {
    id: 1,
    board: 'MLB',
    title: '今日MLB分析 - 道奇主場優勢明顯',
    date: '2024-01-15',
    replies: 25,
    views: 156,
    push: 8,
    url: '/post/1'
  },
  {
    id: 2,
    board: 'NBA',
    title: '湖人vs勇士 大小分預測分析',
    date: '2024-01-14',
    replies: 18,
    views: 89,
    push: 5,
    url: '/post/2'
  }
]);

// 榮譽記錄
const memberHonors = ref([
  {
    id: 1,
    icon: '🏆',
    title: '單場殺手',
    description: '連續10場預測命中',
    date: '2024-01-10'
  },
  {
    id: 2,
    icon: '⭐',
    title: '明燈達人',
    description: '被264人追蹤',
    date: '2024-01-05'
  },
  {
    id: 3,
    icon: '🎯',
    title: '精準預測',
    description: '月度命中率達70%',
    date: '2023-12-31'
  }
]);

// API 函數

/**
 * 載入會員預測
 */
async function loadPredictions() {
  console.log('🚀 loadPredictions 函數開始執行');
  predictionsLoading.value = true;
  predictionsError.value = '';

  try {
    // 使用與 getViewingMemberId 相同的邏輯獲取會員 ID
    const userId = route.params.id as string || session.userId || session.user?.id;
    console.log('🔑 獲取到的 userId:', userId);
    console.log('🔑 route.params.id:', route.params.id);
    console.log('🔑 session.userId:', session.userId);
    console.log('🔑 session.user?.id:', session.user?.id);
    console.log('🔑 session.loggedIn:', session.loggedIn);
    
    if (!userId) {
      predictionsError.value = '無法載入預測：未指定會員';
      console.error('❌ userId 為空，提前返回');
      console.error('❌ 請檢查登入狀態');
      return;
    }

    // 計算日期範圍：今天開始
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // 結束日期根據選擇的篩選器決定
    let endDate: string | undefined;
    if (selectedDateRange.value === 'week') {
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 7);
      endDate = futureDate.toISOString().split('T')[0];
    } else if (selectedDateRange.value === 'month') {
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 30);
      endDate = futureDate.toISOString().split('T')[0];
    }
    // 'all' 或未選擇時，不設置 endDate，顯示所有未來預測

    const requestParams = {
      memberId: userId, // 後端要求使用 memberId 參數
      page: currentPage.value,
      size: pageSize.value,
      startDate: startDate,
      endDate: endDate,  // 可能為 undefined
    };

    // 調試信息：顯示請求參數
    console.log('🔍 載入會員預測 - 請求參數:', requestParams);
    console.log('🔍 當前日期範圍選擇:', selectedDateRange.value);
    console.log('🔍 路由參數 ID:', route.params.id);
 

    // 統一使用 getPredictions API，傳入日期範圍參數
    const result = await predictionsAPI.getPredictions(requestParams);

    console.log('✅ 預測 API 回應:', {
      success: result.success,
      dataCount: result.data?.length || 0,
      total: result.pagination?.total || 0,
      firstPrediction: result.data?.[0]
    });

    if (result.success) {
      predictions.value = result.data || [];
      totalPredictions.value = result.pagination?.total || 0;
      
      console.log('📦 設置的 predictions 數據:', predictions.value);
      console.log('📦 predictions 數量:', predictions.value.length);
      
      if (predictions.value.length > 0) {
        console.log('📦 第一筆預測的完整結構:', JSON.stringify(predictions.value[0], null, 2));
        console.log('📦 第一筆預測的關鍵字段:');
        const first = predictions.value[0];
        console.log('   - id:', first.id);
        console.log('   - gameId:', first.gameId);
        console.log('   - gameInfo:', first.gameInfo);
        console.log('   - predictionType:', first.predictionType);
        console.log('   - status:', first.status);
      }
      
      if (predictions.value.length === 0) {
        console.log('⚠️ 沒有預測數據，可能原因：');
        console.log('   - 該會員確實沒有預測');
        console.log('   - 日期範圍內沒有預測');
        console.log('   - memberId 參數不正確');
      }
    } else {
      predictionsError.value = '載入預測失敗';
      console.error('❌ API 返回失敗:', result);
    }
  } catch (e: any) {
    predictionsError.value = e?.response?.data?.message || '載入預測失敗，請稍後再試';
    console.error('❌ 載入預測錯誤:', {
      message: e?.message,
      status: e?.response?.status,
      data: e?.response?.data,
      fullError: e
    });
  } finally {
    predictionsLoading.value = false;
  }
}

/**
 * 載入彩幣餘額
 */
async function loadCoinBalance() {
  if (!session.loggedIn) return;

  try {
    const result = await coinsAPI.getCoinInfo();
    // 後端返回格式：{ accountId, balance, earned, spent }
    if (result.balance !== undefined) {
      coinBalance.value = result.balance;
    }
  } catch (e) {
    console.warn('載入彩幣餘額失敗:', e);
  }
}

/**
 * 購買預測
 */
async function purchasePrediction(predictionId: string) {
  if (!session.loggedIn) {
    purchaseMessage.value = '請先登入以購買預測';
    purchaseSuccess.value = false;
    // 導向登入頁面
    setTimeout(() => {
      router.push({ name: 'login', query: { redirect: route.fullPath } });
    }, 1500);
    return;
  }

  purchaseLoading.value = true;
  purchaseMessage.value = '';
  purchaseSuccess.value = false;
  selectedPredictionId.value = predictionId;

  try {
    const result = await predictionsAPI.purchasePrediction(Number(predictionId));

    if (result.success) {
      purchaseMessage.value = '購買成功！';
      purchaseSuccess.value = true;

      // 更新餘額
      if (result.remainingCoins !== undefined) {
        coinBalance.value = result.remainingCoins;
      }

      // 重新載入預測以顯示購買後的內容
      await loadPredictions();

      // 3 秒後清除訊息
      setTimeout(() => {
        purchaseMessage.value = '';
        selectedPredictionId.value = null;
      }, 3000);
    }
  } catch (e: any) {
    const message = e?.response?.data?.message;
    const code = e?.response?.data?.code;

    if (code === 'INSUFFICIENT_BALANCE') {
      purchaseMessage.value = '彩幣餘額不足';
    } else if (code === 'ALREADY_PURCHASED') {
      purchaseMessage.value = '您已購買過此預測';
    } else if (code === 'SELF_PURCHASE') {
      purchaseMessage.value = '無法購買自己的預測';
    } else {
      purchaseMessage.value = message || '購買失敗，請稍後再試';
    }
    purchaseSuccess.value = false;
  } finally {
    purchaseLoading.value = false;
  }
}

/**
 * 檢查是否已購買預測
 */
function isPredictionPurchased(prediction: Prediction): boolean {
  const currentUserId = session.userId || session.user?.id;
  
  // 如果是自己的預測，總是可見
  if (prediction.userId === currentUserId) {
    return true;
  }

  // 使用 isPurchased 欄位檢查是否已購買
  return prediction.isPurchased || false;
}

// 計算屬性：只保留聯盟篩選，日期篩選已在 API 層面處理
const filteredPredictions = computed(() => {
  let filtered = predictions.value;
  
  // 聯盟篩選（如果有選擇聯盟）
  if (selectedAlliance.value) {
    filtered = filtered.filter((p: any) => p.gameInfo?.allianceId === selectedAlliance.value);
  }
  
  return filtered;
});

// 等級主題色與進度百分比
const levelColor = computed(() => memberInfo.value.levelInfo?.color || '#667eea');
const progressPercent = computed(() => {
  const p = Number(memberInfo.value.levelProgress?.percentage ?? 0);
  if (Number.isNaN(p)) return 0;
  return Math.max(0, Math.min(100, p));
});

// 方法
function setActiveTab(tab: string) {
  activeTab.value = tab;
}

  function selectBetDate(key: string) {
    betDateButtons.value = betDateButtons.value.map(d => ({ ...d, selected: d.key === key }));
  }

  async function copyBetAccount() {
    try {
      await navigator.clipboard.writeText(betAccountId.value);
      showCopyPrompt.value = true;
      setTimeout(() => (showCopyPrompt.value = false), 1500);
    } catch {}
  }

// follow/unfollow 實作見上方：followUser / unfollowUser

// 載入會員資料的函數
function getViewingMemberId(): string {
  // 優先使用 history.state（不顯示於網址列的內部導航）
  const fromState = (history.state && (history.state as any).memberId) as string | undefined;
  const paramId = (route.params.id as string) || '';
  // 避免誤把 "profile" 等保留字當成會員ID
  const reserved = new Set(['profile']);
  const safeParamId = reserved.has(paramId?.toLowerCase?.()) ? '' : paramId;
  return fromState || safeParamId || session.userId || (session.user?.id as string) || '';
}

async function loadMemberData() {
  const targetId = getViewingMemberId();
  if (!targetId) return;

  // 載入會員基本資料
  try {
    const data = await memberAPI.getProfile(targetId);
    if (data.success && data.profile) {
      const p = data.profile;
      // 處理頭像 URL：優先使用 avatarUrl，回退到 avatar，並加上時間戳避免快取
      const rawAvatarUrl = p.avatarUrl || p.avatar;
      const finalAvatarUrl = rawAvatarUrl ? addTimestampToUrl(rawAvatarUrl) : undefined;
      
      memberInfo.value = {
        id: String(p.id || targetId),
        name: p.name || memberInfo.value.name,
        avatar: p.avatar || defaultBlackAvatar,
        avatarUrl: finalAvatarUrl || defaultBlackAvatar,
        followers: p.followersCount ?? memberInfo.value.followers,
        joinDate: p.joinedAt || memberInfo.value.joinDate,
        level: p.level || memberInfo.value.level,
        levelInfo: p.levelInfo as any || memberInfo.value.levelInfo,
        levelProgress: p.levelProgress || memberInfo.value.levelProgress,
        bio: p.bio || memberInfo.value.bio,
      };
      
      // 處理關係資訊
      if (data.relationships) {
        isFollowing.value = !!data.relationships.isFollowing;
      }
    }
  } catch {}

  // 如果還沒有關係資訊,單獨載入
  if (typeof isFollowing.value === 'undefined') {
    try {
      const rel = await memberAPI.getRelationships(targetId);
      isFollowing.value = !!rel?.isFollowing;
    } catch {}
  }
}

// 監聽大頭貼更新事件
function handleAvatarUpdate(event: Event) {
  // 如果是自己的會員頁面，重新載入資料
  const targetId = getViewingMemberId();
  if (targetId === session.userId) {
    // 立即更新大頭貼 URL 避免快取
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.url) {
      const timestamp = new Date(customEvent.detail.updatedAt || Date.now()).getTime();
      // url 已經是相對路徑 (如 /uploads/avatars/xxx.jpg)，使用工具函數加時間戳
      memberInfo.value.avatarUrl = addTimestampToUrl(customEvent.detail.url, timestamp);
    }
    // 然後重新載入完整資料
    loadMemberData();
  }
}

// 監聽名稱更新事件
function handleNameUpdate(event: Event) {
  // 如果是自己的會員頁面，立即更新顯示的名稱
  const targetId = getViewingMemberId();
  if (targetId === session.userId) {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.name) {
      memberInfo.value.name = customEvent.detail.name;
    }
    // 然後重新載入完整資料以確保同步
    loadMemberData();
  }
}

// 生命週期
onMounted(async () => {
  // 路由層已有 requiresAuth 保護；此處加保險檢查與導轉
  await session.fetchSession(true);
  if (!session.loggedIn) {
    const redirect = encodeURIComponent(route.fullPath);
    router.replace({ name: 'login', query: { redirect } });
    return;
  }
  // 若網址為 /member/profile（誤用），導向自己的會員頁
  if ((route.params.id as string) === 'profile') {
    router.replace('/member');
    return;
  }

  // 確保先拿到自己的 userId，再載入資料
  await session.ensureProfile();
  await loadMemberData();
  
  // 初始化日曆月份顯示
  updateMonthDisplay();
  
  // 載入預測數據
  await loadPredictions();
  
  // 載入彩幣餘額（僅當已登入時）
  if (session.loggedIn) {
    await loadCoinBalance();
  }
  
  // 監聽大頭貼更新事件
  window.addEventListener('avatar-updated', handleAvatarUpdate);
  // 監聽名稱更新事件
  window.addEventListener('name-updated', handleNameUpdate);
});

onUnmounted(() => {
  // 移除事件監聽器
  window.removeEventListener('avatar-updated', handleAvatarUpdate);
  window.removeEventListener('name-updated', handleNameUpdate);
});

// 追蹤/取消追蹤串接 API
async function followUser() {
  if (isFollowing.value || followLoading.value) return;
  followLoading.value = true;
  try {
    const id = memberInfo.value.id;
    const res = await memberAPI.follow(id);
    if (res.status === 204) {
      if (!isFollowing.value) {
        isFollowing.value = true;
        memberInfo.value.followers++;
      }
    }
  } catch {}
  followLoading.value = false;
}

async function unfollowUser() {
  if (!isFollowing.value || unfollowLoading.value) return;
  unfollowLoading.value = true;
  try {
    const id = memberInfo.value.id;
    const res = await memberAPI.unfollow(id);
    if (res.status === 204) {
      if (isFollowing.value) {
        isFollowing.value = false;
        if (memberInfo.value.followers > 0) memberInfo.value.followers--;
      }
    }
  } catch {}
  unfollowLoading.value = false;
}

// AllianceMenu 相關方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  
  // 當選擇足球時，自動展開聯賽選單並選擇"全部"
  if (allianceId === 5) {
    soccerLeaguesExpanded.value = true;
    selectedSoccerLeague.value = 0;
  } else {
    soccerLeaguesExpanded.value = false;
    selectedSoccerLeague.value = null;
  }
  
  // 重新載入預測數據
  loadPredictions();
}

function selectSoccerLeague(leagueId: number) {
  selectedSoccerLeague.value = leagueId;
  loadPredictions();
}

async function selectDateOption(option: any) {
  console.log('📅 selectDateOption 被調用，接收到的參數:', option);
  console.log('📅 參數類型:', typeof option);
  console.log('📅 option.type:', option?.type);
  console.log('📅 option.value:', option?.value);
  
  // 提取日期範圍值
  const rangeValue = option?.type || option?.value || option;
  console.log('📅 最終的 rangeValue:', rangeValue);
  
  selectedDateRange.value = rangeValue;
  calendarVisible.value = false;
  
  console.log('📅 設置後的 selectedDateRange.value:', selectedDateRange.value);
  console.log('📅 準備調用 loadPredictions()...');
  
  // 重新載入預測，應用新的日期篩選
  try {
    await loadPredictions();
    console.log('📅 loadPredictions() 執行完成');
  } catch (error) {
    console.error('📅 loadPredictions() 執行失敗:', error);
  }
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

function toggleCalendar() {
  calendarVisible.value = !calendarVisible.value;
  if (calendarVisible.value) {
    generateCalendar();
  }
}

function closeCalendar() {
  calendarVisible.value = false;
}

function handleSelectDate(date: Date) {
  selectedDate.value = date;
  calendarVisible.value = false;
  // 可以添加根據特定日期載入預測的邏輯
  loadPredictions();
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
  updateMonthDisplay();
}

function prevMonth() {
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() - 1, 1);
  generateCalendar();
}

function nextMonth() {
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 1);
  generateCalendar();
}

function updateMonthDisplay() {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth();
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  currentMonth.value = `${monthNames[month]} ${year}`;
}
</script>

<style scoped>
.member-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: "微軟正黑體", "Microsoft JhengHei", "新細明體", PMingLiU, Arial, Helvetica, sans-serif;
}

/* AllianceMenu 在會員頁面中的樣式調整 */
.member-alliance-menu {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.member-showroom {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
}

/* 頂部篩選區（簡版對齊原站） */
.tagsection {
  width: 100%;
  max-width: 1200px;
  margin: 10px auto 0;
  order: 4;
}

.tag-league-boxall { margin-bottom: 6px; }

.tag-box { display: flex; align-items: center; }
.tag-box-first { margin-right: 8px; }
.tag-league, .tag-date { list-style: none; margin: 0; padding: 0; display: flex; gap: 6px; color: #333; }
.tag-con { list-style: none; margin: 0; padding: 0; display: flex; gap: 10px; }
.tag-con-big { gap: 16px; }
.tag-con li, .tag-con-big li { cursor: pointer; background: #f7f7f7; border: 1px solid #e0e0e0; padding: 6px 10px; border-radius: 4px; }
.tag-con li a { color: inherit; text-decoration: none; }
.tag-chosen, .tag-chosenbig { background: #ffde00; border-color: #ffc400; }
.nonepredict a { color: #888; }

/* 側邊欄樣式 */
.member-sidebar {
  width: 250px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: fit-content;
  order: 1;
}

.photoframe {
  text-align: center;
  margin-bottom: 15px;
}

.photoframe img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #667eea;
  display: block;
  margin: 0 auto;
}

.memberidname {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.member-level-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 2px solid #667eea;
  border-radius: 999px;
  padding: 4px 10px;
  background: #f8f9fa;
  margin: 0 auto 8px auto;
}
.member-level-badge .level-icon { font-size: 16px; line-height: 1; }
.member-level-badge .level-name { font-size: 13px; font-weight: bold; }

.member-level-progress { width: 100%; height: 8px; background: #eceff3; border-radius: 999px; overflow: hidden; margin: 6px 0 12px 0; }
.member-level-progress .bar { height: 100%; width: 0; transition: width .4s ease; }

/* 彩幣餘額顯示（側邊欄） */
.coin-balance-display { 
  margin: 0 0 16px 0; 
  padding: 12px; 
  background: linear-gradient(135deg, #f8f9fa 0%, #e3ffbf 100%); 
  border: 2px solid #28a745; 
  border-radius: 8px; 
  text-align: center; 
}
.coin-balance-label { 
  font-size: 12px; 
  color: #666; 
  margin-bottom: 6px; 
  font-weight: 500;
}
.coin-balance-amount { 
  font-size: 18px; 
  font-weight: bold; 
  color: #28a745; 
  letter-spacing: 0.5px;
}

.member-showroom-nav {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.member-showroom-nav li {
  margin-bottom: 5px;
  position: relative;
}

.member-showroom-nav li a {
  display: block;
  padding: 12px 15px;
  color: #666;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.member-showroom-nav li.chosen a {
  background: #667eea;
  color: white;
}

.member-showroom-nav li:hover a {
  background: #f0f0f0;
  color: #333;
}

.member-showroom-nav li.chosen:hover a {
  background: #5a6fd8;
}

.idstatusbox {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.addguide_other p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.friend-actions {
  text-align: center;
}

.follow-btn, .unfollow-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.follow-btn {
  background: #28a745;
  color: white;
}

.follow-btn--lamp {
  background: #ffb400;
  color: #333;
}
.follow-btn--lamp .fa-lightbulb-o { margin-right: 6px; }

.follow-btn:hover {
  background: #218838;
}

.unfollow-btn {
  background: #6c757d;
  color: white;
}

.unfollow-btn:hover {
  background: #5a6268;
}

/* 主要內容區域 */
.member-maincon {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  order: 2;
}

/* 今日人氣區域 */
.league-pvnum {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  margin: 10px 0 15px 0;
  order: 3;
}

.league-pvnum__top {
  display: flex;
  align-items: center;
  gap: 20px;
}

.league-pvnum--border {
  font-weight: bold;
  color: #333;
  margin: 0;
}

.league-pvnum--border strong {
  color: #28a745;
  font-size: 14px;
}

.league-pvnum__top p:last-child {
  color: #666;
  font-size: 12px;
  margin: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.content-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.filter-options {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
}

/* 預測列表 */
.predictions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 預測容器 */
.allpredictionbox {
  width: 100%;
  margin-top: 10px;
}

/* 表格樣式（簡化版對齊原站） */
/* 國際盤表格 */
.universe-tablebox { margin-top: 10px; }
.universe-tablecon { 
  width: 100%; 
  border-collapse: collapse; 
  border: 1px solid #DCDCDC; 
  background: #fff; 
}
.universe-tablecon th, .universe-tablecon td { 
  border-bottom: 1px solid #DCDCDC; 
  border-right: 1px solid #DCDCDC;
  padding: 8px; 
  font-size: 13px; 
  color: #404040; 
}
.universe-tablecon th.gameevent { 
  background: #B8CDF3; 
  color: #000; 
  text-align: left; 
  font-weight: bold;
}
.universe-tablecon th.managerpredictcon, 
.universe-tablecon th.predictresult { 
  text-align: center; 
}
.universe-tablecon tr.evenrow { background: #f8f9fb; }
.universe-tablecon td:last-child { border-right: none; }

/* 運彩盤表格 */
.bank-tablebox { margin-top: 20px; }
.bank-tablecon { 
  width: 100%; 
  border-collapse: collapse; 
  border: 1px solid #DCDCDC; 
  background: #fff; 
}
.bank-tablecon th, .bank-tablecon td { 
  border-bottom: 1px solid #DCDCDC; 
  border-right: 1px solid #DCDCDC;
  padding: 8px; 
  font-size: 13px; 
  color: #404040; 
}
.bank-tablecon th.gameevent { 
  background: #FFE4B5; 
  color: #000; 
  text-align: left; 
  font-weight: bold;
}
.bank-tablecon th.managerpredictcon, 
.bank-tablecon th.predictresult { 
  text-align: center; 
}
.bank-tablecon tr.evenrow { background: #fffef8; }
.bank-tablecon td:last-child { border-right: none; }

/* 共用表格樣式 */
.tablecon--height {
  min-height: 200px;
}
.gamenum { 
  width: 80px; 
  text-align: center;
  vertical-align: middle;
}
.gamenum ul { 
  list-style: none; 
  margin: 0; 
  padding: 0; 
}
.gamenum ul li { 
  line-height: 18px; 
  color: #666;
  font-size: 12px;
}
.gamenum ul li:first-child {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}
.managerpredictcon {
  text-align: left;
  padding-left: 12px;
}
.predict-bet-weight { 
  color: #ff6c00; 
  margin-left: 6px; 
  font-weight: bold;
}
.predictresult { 
  text-align: center; 
  font-weight: bold;
}
.predictresult span {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
}
.predictresult.incorrect,
.predictresult.incorrect span { 
  color: #fff;
  background: #dc3545;
}
.no-predict {
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 14px;
}

/* 球隊名稱嵌套表格 */
.universe-tablecon td table,
.bank-tablecon td table {
  width: 100%;
  border: none;
}
.universe-tablecon td table th,
.universe-tablecon td table td,
.bank-tablecon td table th,
.bank-tablecon td table td {
  border: none;
  padding: 4px 8px;
  text-align: left;
  font-size: 13px;
  font-weight: normal;
}
.universe-tablecon td table th,
.bank-tablecon td table th {
  font-weight: 600;
  color: #333;
}
.universe-tablecon td table .secondteam,
.bank-tablecon td table .secondteam {
  color: #666;
  font-size: 12px;
}

/* ================= 戰績頁面（records-index） ================ */
.records-index h1 {
  margin: 12px 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: #2e6da4;
}
.records-index .universe-tablebox h1 { color: #3a8c00; }
.records-index .bank-tablebox h1 { color: #0077c8; }

/* 國際盤/運彩盤表格樣式（戰績） */
.records-index .universe-tablecon,
.records-index .bank-tablecon {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #DCDCDC;
  background: #fff;
}
.records-index .universe-tablecon th,
.records-index .universe-tablecon td,
.records-index .bank-tablecon th,
.records-index .bank-tablecon td {
  border-bottom: 1px solid #DCDCDC;
  padding: 10px 12px;
  font-size: 13px;
  color: #404040;
  text-align: center;
}
.records-index .universe-tablecon th { background: #61b10b; color: #fff; }
.records-index .bank-tablecon th { background: #1fa3ff; color: #fff; }
.records-index .records-killer-mark { width: 12%; }
.records-index .records-league { width: 14%; }
.records-index .records-wins { width: 12%; }
.records-index .records-mainwins { width: 16%; }
.records-index .records-bankerkiller { width: 16%; }
.records-index .records-mainwinskiller { width: 16%; }
.records-index .records-level { width: 14%; }
.records-index .records-mainwinskiller { color: #666; text-align: left; padding-left: 16px; }

/* 戰績上方分類選單（膠囊） */
.tagselect { list-style: none; margin: 0 0 10px 0; padding: 0; display: flex; gap: 10px; }
.tagselect-lv02 { list-style: none; margin: 0; padding: 0; display: flex; }
.tagselect .tag-con, .tagselect .tag-league { margin: 0; padding: 0; }
.tagselect .tag-con li {
  display: inline-block;
  background: #f3f3f3;
  border: 1px solid #ddd;
  color: #333;
  border-radius: 14px;
  padding: 6px 12px;
  font-size: 13px;
}
.tagselect .tag-con li a { color: inherit; text-decoration: none; }
.tagselect .tag-con li.tag-chosen {
  background: #ffde00;
  border-color: #ffc400;
  color: #333;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,0.1);
}

  /* ================= 討論分頁（forums_overview） ================ */
  .forums_overview {
    color: #666;
    text-align: left;
    font-size: 16px;
    line-height: normal;
    padding: 0 10px 23px 10px;
    margin: 0;
    width: 100%;
    min-height: 300px;
    border-bottom: #e0e0e0 1px solid;
    border-radius: 10px;
    background: linear-gradient(135deg, #f5f5f5 0%, #e9ecef 100%);
    font-family: "微軟正黑體", "Microsoft JhengHei", "新細明體", PMingLiU, Arial, Helvetica, sans-serif;
    overflow: hidden;
  }
  .overview__peoples { margin: 10px 0; font-size: 14px; }
  .overview__peoples span { color: #ff6c00; font-weight: bold; }
  .overview { list-style: none; margin: 0 0 10px 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px 20px; }
  .overview li { background: #fff; border: 1px solid #e0e0e0; border-radius: 4px; padding: 8px 12px; font-size: 14px; color: #333; box-shadow: 0 1px 0 rgba(0,0,0,0.03); }
  .overview li em { font-style: normal; margin-left: 6px; color: #666; }
  .overview li span { color: #ff6c00; font-weight: bold; }
  .overview li.total_one { border-left: 4px solid #667eea; }
  .overview li.total_two { border-left: 4px solid #28a745; }

  /* 條列式兩欄表格化呈現 */
  .overview-table { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ov-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden; }
  .ov-header { display: flex; justify-content: space-between; align-items: center; background: #f5f6fa; padding: 10px 12px; border-bottom: 1px solid #e0e0e0; }
  .ov-title { font-weight: bold; color: #333; }
  .ov-value .number { color: #ff6c00; font-weight: bold; }
  .ov-list { list-style: none; margin: 0; padding: 6px 12px; }
  .ov-list li { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e6e6e6; }
  .ov-list li:last-child { border-bottom: 0; }
  .ov-list li span { color: #333; }
  .ov-list li em { color: #666; }

  /* 遊戲紀錄（bet） */
  .bet-datebar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .tagsection__date { color: #333; margin-right: 6px; }
  .js-member-page-gamedate { display: inline-flex; align-items: center; gap: 2px; padding: 6px 10px; border: 1px solid #ddd; border-radius: 14px; color: #333; text-decoration: none; background: #f7f7f7; }
  .js-member-page-gamedate.selected { background: #ffde00; border-color: #ffc400; }

  .betmember_icon { display: flex; align-items: center; gap: 10px; margin: 10px 0 14px 0; flex-wrap: wrap; }
  .betmember_icon__number { margin: 0; }
  .textcopy { margin-left: 6px; padding: 4px 8px; border: 1px solid #ddd; background: #fff; border-radius: 4px; cursor: pointer; }
  .textcopy_prompt { background: #333; color: #fff; padding: 4px 8px; border-radius: 4px; }
  .betmember_icon__account, .betmember_icon__transfer { display: inline-block; padding: 6px 10px; border-radius: 4px; background: #667eea; color: #fff; text-decoration: none; }
  .betmember_icon__transfer { background: #28a745; }
  .bet_start p { margin: 0; }

  @media (max-width: 768px) {
    .overview { gap: 8px 10px; }
    .overview li { font-size: 13px; padding: 6px 8px; }
    .overview-table { grid-template-columns: 1fr; }
  }

  /* ================= 榮譽分頁（medal / honor-table） ================ */
  th.member-honor-date { width: 100px; }
  th.member-honor-subject { width: 600px; }
  td.member-nodata, td.member-honor-subject { border-right:1px solid #d9d9d9; }

  .games_medal { margin: 10px 0 15px 0; }
  .medal { background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px; }
  .medal--border { border-left: 4px solid #667eea; }
  .medal-title { display: inline-flex; align-items: center; gap: 6px; font-weight: bold; color: #333; }
  .medal-title .medal-arrow { width: 10px; height: 10px; border-right: 2px solid #667eea; border-bottom: 2px solid #667eea; transform: rotate(-45deg); display: inline-block; margin-left: 4px; }
  .medal-box { list-style: none; margin: 10px 0 0 0; padding: 0; display: flex; gap: 12px; flex-wrap: wrap; }
  .medal-box-content { background: #f9f9f9; border: 1px solid #e6e6e6; border-radius: 6px; padding: 10px; width: 130px; text-align: center; }
  .medal-box-content .medal-icon { display: block; font-size: 24px; line-height: 1; margin: 0 auto 6px; }
  .medal-box-content span { display: block; color: #333; font-size: 12px; }
  .medal-box-content .medal-count { display: block; color: #ff6c00; font-weight: bold; margin-top: 4px; font-size: 18px; }

  .member-forum-tablecon { width: 100%; border-collapse: collapse; border: 1px solid #DCDCDC; background: #fff; }
  .member-forum-tablecon th, .member-forum-tablecon td { border-bottom: 1px solid #DCDCDC; padding: 10px 12px; font-size: 13px; color: #404040; }
  .member-forum-tablecon th { background: #1fa3ff; color: #fff; text-align: left; }

  /* 榮譽分頁分隔線（取代示意圖片） */
  .honor-divider { width: 100%; height: 12px; margin: 12px 0; background: linear-gradient(90deg, #f1f5ff 0%, #e9efff 50%, #f1f5ff 100%); border-radius: 6px; }

.prediction-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.prediction-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.league-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.league-tag.mlb { background: #1e3a8a; }
.league-tag.nba { background: #dc2626; }
.league-tag.cpbl { background: #059669; }
.league-tag.npb { background: #7c3aed; }

.prediction-date {
  color: #666;
  font-size: 14px;
}

.prediction-content h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.prediction-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.team {
  font-weight: bold;
  color: #333;
}

.vs {
  color: #666;
  font-size: 14px;
}

.prediction-type {
  text-align: right;
}

.type {
  background: #667eea;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 5px;
}

.odds {
  font-weight: bold;
  color: #333;
}

.prediction-result {
  text-align: right;
}

.result-text {
  font-weight: bold;
  font-size: 14px;
}

.prediction-result.win .result-text {
  color: #28a745;
}

.prediction-result.lose .result-text {
  color: #dc3545;
}

.prediction-result.pending .result-text {
  color: #ffc107;
}

/* 戰績統計 */
.record-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #e9ecef;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.record-chart {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.chart-placeholder {
  padding: 40px;
  color: #666;
}

/* 論壇文章 */
.forum-posts {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.forum-post {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background: #fafafa;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.board-tag {
  background: #667eea;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.post-date {
  color: #666;
  font-size: 14px;
}

.post-title {
  margin: 0 0 10px 0;
}

.post-title a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
}

.post-title a:hover {
  color: #667eea;
}

.post-stats {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 14px;
}

/* 榮譽列表 */
.honor-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.honor-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.honor-icon {
  font-size: 24px;
  margin-right: 15px;
}

.honor-content h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.honor-content p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
}

.honor-date {
  color: #999;
  font-size: 12px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .member-showroom {
    flex-direction: column;
    padding: 10px;
  }
  
  .member-sidebar {
    width: 100%;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .filter-options {
    width: 100%;
    justify-content: space-between;
  }
  
  .record-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .prediction-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .team-info {
    flex-wrap: wrap;
  }
}
</style>