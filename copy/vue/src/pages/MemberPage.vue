<template>
  <div class="member-page">
    <div class="member-showroom">

      <!-- 主要內容區域 -->
      <div class="member-maincon">
        <!-- 頂部篩選區（參考原站 tagsection） 僅預測分頁顯示 -->
        <div class="tagsection" v-if="activeTab === 'predict'">
          <div class="tag-league-boxall">
            <div class="tag-league-box tag-box tag-box_memberMenu">
              <div class="tag-box-first">
                <ol class="tag-league">
                  <li class="fold-head"></li>
                  <li>棒球</li>
                  <li class="fold-footer"></li>
                </ol>
              </div>
              <div class="tag-box-last">
                <ol class="tag-con">
                  <li :class="{ 'tag-chosen': selectedLeague === 'MLB' }" @click="selectedLeague = 'MLB'">MLB</li>
                  <li :class="{ 'nonepredict': false }" @click="selectedLeague = 'NPB'">
                    <a href="#">日棒</a>
                  </li>
                  <li :class="{ 'nonepredict': false }" @click="selectedLeague = 'CPBL'">
                    <a href="#">中職</a>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div class="tag-date-box tag-box tag-box_memberDate">
            <div class="tag-box-first">
              <ol class="tag-date">
                <li class="fold-head"></li>
                <li>日期</li>
                <li class="fold-footer"></li>
              </ol>
            </div>
            <div class="tag-box-last">
              <ol class="tag-con tag-con-big">
                <li @click="selectedDate = ''"><p>全部</p><strong>(All)</strong></li>
                <li @click="selectedDate = 'today'" :class="{ 'tag-chosenbig': selectedDate==='today' }"><p>今天</p><strong>(Today)</strong></li>
                <li @click="selectedDate = 'week'" :class="{ 'tag-chosenbig': selectedDate==='week' }"><p>本週</p><strong>(Week)</strong></li>
                <li @click="selectedDate = 'month'" :class="{ 'tag-chosenbig': selectedDate==='month' }"><p>本月</p><strong>(Month)</strong></li>
              </ol>
            </div>
          </div>
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
                    <template v-if="filteredPredictions.filter(p => p.gameMode === 'international').length > 0">
                      <tr v-for="(prediction, index) in filteredPredictions.filter(p => p.gameMode === 'international')" :key="prediction.id" :class="{ 'evenrow': index % 2 === 1 }">
                        <td rowspan="1" class="gamenum">
                          <ul>
                            <li></li>
                            <li>{{ new Date(prediction.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) }}</li>
                          </ul>
                        </td>
                        <td rowspan="1">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <th>{{ prediction.homeTeam }}</th>
                              <td class="secondteam"></td>
                            </tr>
                            <tr>
                              <th class="secondteam">{{ prediction.awayTeam }}(主)</th>
                              <td class="secondteam"></td>
                            </tr>
                          </table>
                        </td>
                        <td class="managerpredictcon">
                          {{ prediction.title }} <span class="predict-bet-weight">{{ prediction.type }}</span>
                        </td>
                        <td class="predictresult" :class="{ 'incorrect': prediction.result === '囧' }">
                          <span>{{ prediction.result }}</span>
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
                    <template v-if="filteredPredictions.filter(p => p.gameMode === 'bank').length > 0">
                      <tr v-for="(prediction, index) in filteredPredictions.filter(p => p.gameMode === 'bank')" :key="prediction.id" :class="{ 'evenrow': index % 2 === 1 }">
                        <td rowspan="1" class="gamenum">
                          <ul>
                            <li></li>
                            <li>{{ new Date(prediction.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) }}</li>
                          </ul>
                        </td>
                        <td rowspan="1">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <th>{{ prediction.homeTeam }}</th>
                              <td class="secondteam"></td>
                            </tr>
                            <tr>
                              <th class="secondteam">{{ prediction.awayTeam }}(主)</th>
                              <td class="secondteam"></td>
                            </tr>
                          </table>
                        </td>
                        <td class="managerpredictcon">
                          {{ prediction.title }} <span class="predict-bet-weight">{{ prediction.type }}</span>
                        </td>
                        <td class="predictresult" :class="{ 'incorrect': prediction.result === '囧' }">
                          <span>{{ prediction.result }}</span>
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
                      <big>0</big>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">🎯</span>
                      <span>單場殺手</span>
                      <big>0</big>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">🏆</span>
                      <span>蟬聯莊家殺手</span>
                      <big>0</big>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">⭐</span>
                      <span>蟬聯單場殺手</span>
                      <big>0</big>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">📈</span>
                      <span>殺手販售預測<br>突破200人</span>
                      <big>0</big>
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
            <img :src="memberInfo.avatarUrl || '/images/default-avatar.jpg'" :alt="memberInfo.name" />
          </div>
          <p class="memberidname">{{ memberInfo.name }}</p>
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
            <button class="follow-btn follow-btn--lamp" @click="followUser" aria-label="加為明燈">
              <i class="fa fa-lightbulb-o"></i> 加為明燈
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

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

// 響應式數據
const activeTab = ref('predict');
const selectedLeague = ref('');
const selectedDate = ref('');
const isFollowing = ref(false);
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
  avatar: '/images/default-avatar.jpg',
  avatarUrl: '/images/default-avatar.jpg', // 用於顯示，包含時間戳
  followers: 264,
  joinDate: '2020-01-15',
  level: 'VIP',
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

// 預測記錄
const predictions = ref([
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

// 計算屬性
const filteredPredictions = computed(() => {
  let filtered = predictions.value;
  
  if (selectedLeague.value) {
    filtered = filtered.filter(p => p.league === selectedLeague.value);
  }
  
  if (selectedDate.value) {
    const today = new Date();
    filtered = filtered.filter(p => {
      const predDate = new Date(p.date);
      switch (selectedDate.value) {
        case 'today':
          return predDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return predDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return predDate >= monthAgo;
        default:
          return true;
      }
    });
  }
  
  return filtered;
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
async function loadMemberData() {
  const targetId = (route.params.id as string) || session.userId || session.user?.id || '';
  if (!targetId) return;

  // 載入會員基本資料
  try {
    const res = await fetch(`/api/members/${encodeURIComponent(targetId)}/profile`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const p = await res.json();
      memberInfo.value = {
        id: p.id || targetId,
        name: p.name || memberInfo.value.name,
        avatar: p.avatar || memberInfo.value.avatar,
        avatarUrl: p.avatar ? `${p.avatar}?v=${Date.now()}` : memberInfo.value.avatarUrl,
        followers: p.followersCount ?? memberInfo.value.followers,
        joinDate: p.joinedAt || memberInfo.value.joinDate,
        level: p.level || memberInfo.value.level,
        bio: p.bio || memberInfo.value.bio,
      };
    }
  } catch {}

  // 載入與目前使用者的關係（決定追蹤按鈕）
  try {
    const r = await fetch(`/api/members/${encodeURIComponent(targetId)}/relationships`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (r.ok) {
      const rel = await r.json();
      isFollowing.value = !!rel?.isFollowing;
    }
  } catch {}
}

// 監聽大頭貼更新事件
function handleAvatarUpdate(event: Event) {
  // 如果是自己的會員頁面，重新載入資料
  const targetId = (route.params.id as string) || session.userId || session.user?.id || '';
  if (targetId === session.userId) {
    // 立即更新大頭貼 URL 避免快取
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.url) {
      const timestamp = new Date(customEvent.detail.updatedAt || Date.now()).getTime();
      memberInfo.value.avatarUrl = `${customEvent.detail.url}?v=${timestamp}`;
    }
    // 然後重新載入完整資料
    loadMemberData();
  }
}

// 生命週期
onMounted(async () => {
  // 路由層已有 requiresAuth 保護；此處加保險檢查與導轉
  await session.fetchSession();
  if (!session.loggedIn) {
    const redirect = encodeURIComponent(route.fullPath);
    router.replace({ name: 'login', query: { redirect } });
    return;
  }

  await loadMemberData();
  
  // 監聽大頭貼更新事件
  window.addEventListener('avatar-updated', handleAvatarUpdate);
});

onUnmounted(() => {
  // 移除事件監聽器
  window.removeEventListener('avatar-updated', handleAvatarUpdate);
});

// 追蹤/取消追蹤串接 API
async function followUser() {
  try {
    const id = memberInfo.value.id;
    const res = await fetch(`/api/members/${encodeURIComponent(String(id))}/follow`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      isFollowing.value = true;
      memberInfo.value.followers++;
    }
  } catch {}
}

async function unfollowUser() {
  try {
    const id = memberInfo.value.id;
    const res = await fetch(`/api/members/${encodeURIComponent(String(id))}/follow`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      isFollowing.value = false;
      if (memberInfo.value.followers > 0) memberInfo.value.followers--;
    }
  } catch {}
}
</script>

<style scoped>
.member-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: "微軟正黑體", "Microsoft JhengHei", "新細明體", PMingLiU, Arial, Helvetica, sans-serif;
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
}

.memberidname {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
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

/* 表格樣式（簡化版對齊原站） */
.universe-tablebox { margin-top: 10px; }
.universe-tablecon { width: 100%; border-collapse: collapse; border: 1px solid #DCDCDC; background: #fff; }
.universe-tablecon th, .universe-tablecon td { border-bottom: 1px solid #DCDCDC; padding: 8px; font-size: 13px; color: #404040; }
.universe-tablecon th.gameevent { background: #B8CDF3; color: #000; text-align: left; }
.universe-tablecon th.managerpredictcon, .universe-tablecon th.predictresult { text-align: center; }
.universe-tablecon tr.evenrow { background: #f8f9fb; }
.gamenum ul { list-style: none; margin: 0; padding: 0; }
.gamenum ul li { line-height: 18px; color: #666; }
.predict-bet-weight { color: #ff6c00; margin-left: 6px; }
.predictresult { text-align: center; }
.predictresult.incorrect { color: #dc3545; font-weight: bold; }

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
    background: url(/images/member_maincon_bg.jpg) center top repeat-y;
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
  .medal-box-content big { display: block; color: #ff6c00; font-weight: bold; margin-top: 4px; }

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