<template>
  <div class="member-page">
    <div class="member-showroom">
      <!-- 頂部篩選區（參考原站 tagsection） -->
      <div class="tagsection">
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
      <!-- 會員側邊欄 -->
      <div id="member-sidebar" class="member-sidebar">
        <div class="photoframe">
          <img :src="memberInfo.avatarUrl || '/images/default-avatar.jpg'" :alt="memberInfo.name" />
        </div>
        <p class="memberidname">{{ memberInfo.name }}</p>
        
        <!-- 導航選單 -->
        <ul class="member-showroom-nav">
          <li class="member-showroom-nav-predict" :class="{ chosen: activeTab === 'predict' }">
            <a href="#" @click.prevent="setActiveTab('predict')" class="sidebarEventBtn">
              <strong>預測</strong>
            </a>
            <span class="top"></span><span class="right"></span><span class="bottom"></span>
          </li>
          <li class="member-showroom-nav-record" :class="{ chosen: activeTab === 'record' }">
            <a href="#" @click.prevent="setActiveTab('record')" class="sidebarEventBtn">
              <strong>戰績</strong>
            </a>
          </li>
          <li class="member-showroom-nav-forum" :class="{ chosen: activeTab === 'forum' }">
            <a href="#" @click.prevent="setActiveTab('forum')" class="sidebarEventBtn">
              <strong>討論</strong>
            </a>
          </li>
          <li class="member-showroom-nav-honor" :class="{ chosen: activeTab === 'honor' }">
            <a href="#" @click.prevent="setActiveTab('honor')" class="sidebarEventBtn">
              <strong>榮譽</strong>
            </a>
          </li>
        </ul>

        <!-- 明燈狀態 -->
        <div class="idstatusbox">
          <div class="addguide_other">
            <p>他是<strong> </strong><strong class="js-poster-friends-count-0">{{ memberInfo.followers }}</strong><strong> </strong>個人的一盞明燈</p>
          </div>
        </div>

        <!-- 好友操作 -->
        <div class="friend-actions">
          <button v-if="!isFollowing" @click="followUser" class="follow-btn">
            <i class="fa fa-plus"></i> 加為好友
          </button>
          <button v-else @click="unfollowUser" class="unfollow-btn">
            <i class="fa fa-check"></i> 已加好友
          </button>
        </div>
      </div>

      <!-- 主要內容區域 -->
      <div class="member-maincon">
        <!-- 預測頁面 -->
        <div v-if="activeTab === 'predict'" class="tab-content">
          <div class="content-header">
            <h2>{{ memberInfo.name }} 的預測</h2>
          </div>

          <!-- 參考原站：表格樣式清單 -->
          <div class="universe-tablebox">
            <table border="0" cellspacing="0" cellpadding="0" class="universe-tablecon tablecon--height">
              <tr>
                <th colspan="2" class="gameevent">國際盤賽事</th>
                <th class="managerpredictcon">預測</th>
                <th class="predictresult">結果</th>
              </tr>
              <tr v-for="p in filteredPredictions" :key="p.id" :class="{ evenrow: p.id % 2 === 0 }">
                <!-- 時間/編號 -->
                <td rowspan="1" class="gamenum">
                  <ul>
                    <li></li>
                    <li>{{ new Date(p.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) }}</li>
                  </ul>
                </td>
                <!-- 隊伍/內容 -->
                <td rowspan="1">
                  <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <th>{{ p.homeTeam }}</th>
                      <td class="secondteam"></td>
                    </tr>
                    <tr>
                      <th class="secondteam">{{ p.awayTeam }}(主)</th>
                      <td class="secondteam"></td>
                    </tr>
                  </table>
                </td>
                <!-- 預測類型/賠率 -->
                <td class="managerpredictcon">
                  {{ p.homeTeam }} <span class="predict-bet-weight">{{ p.type }}</span>
                </td>
                <!-- 結果 -->
                <td class="predictresult" :class="{ incorrect: p.result==='lose' }">
                  <span v-if="p.result==='win'">準</span>
                  <span v-else-if="p.result==='lose'">囧</span>
                  <span v-else>待</span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- 戰績頁面 -->
        <div v-if="activeTab === 'record'" class="tab-content">
          <div class="content-header">
            <h2>{{ memberInfo.name }} 的戰績</h2>
          </div>
          
          <div class="record-stats">
            <div class="stat-card">
              <div class="stat-number">{{ memberStats.totalPredictions }}</div>
              <div class="stat-label">總預測數</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ memberStats.winRate }}%</div>
              <div class="stat-label">命中率</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ memberStats.winStreak }}</div>
              <div class="stat-label">連勝紀錄</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ memberStats.ranking }}</div>
              <div class="stat-label">排名</div>
            </div>
          </div>

          <div class="record-chart">
            <h3>近期表現</h3>
            <div class="chart-placeholder">
              <p>📊 戰績圖表區域</p>
              <p>這裡可以放置圖表組件</p>
            </div>
          </div>
        </div>

        <!-- 討論頁面 -->
        <div v-if="activeTab === 'forum'" class="tab-content">
          <div class="content-header">
            <h2>{{ memberInfo.name }} 的討論</h2>
          </div>
          
          <div class="forum-posts">
            <div v-for="post in memberPosts" :key="post.id" class="forum-post">
              <div class="post-header">
                <span class="board-tag">[{{ post.board }}]</span>
                <span class="post-date">{{ post.date }}</span>
              </div>
              <h3 class="post-title">
                <a :href="post.url">{{ post.title }}</a>
              </h3>
              <div class="post-stats">
                <span class="reply-count">回覆 {{ post.replies }}</span>
                <span class="view-count">閱讀 {{ post.views }}</span>
                <span class="push-count">推 {{ post.push }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 榮譽頁面 -->
        <div v-if="activeTab === 'honor'" class="tab-content">
          <div class="content-header">
            <h2>{{ memberInfo.name }} 的榮譽</h2>
          </div>
          
          <div class="honor-list">
            <div v-for="honor in memberHonors" :key="honor.id" class="honor-item">
              <div class="honor-icon">{{ honor.icon }}</div>
              <div class="honor-content">
                <h3>{{ honor.title }}</h3>
                <p>{{ honor.description }}</p>
                <span class="honor-date">{{ honor.date }}</span>
              </div>
            </div>
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
  ranking: 15
});

// 預測記錄
const predictions = ref([
  {
    id: 1,
    league: 'MLB',
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
function handleAvatarUpdate(event: CustomEvent) {
  // 如果是自己的會員頁面，重新載入資料
  const targetId = (route.params.id as string) || session.userId || session.user?.id || '';
  if (targetId === session.userId) {
    // 立即更新大頭貼 URL 避免快取
    if (event.detail?.url) {
      const timestamp = new Date(event.detail.updatedAt || Date.now()).getTime();
      memberInfo.value.avatarUrl = `${event.detail.url}?v=${timestamp}`;
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