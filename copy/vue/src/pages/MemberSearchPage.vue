<template>
  <div class="container mx-auto px-lg py-xl">
      <div class="heading-2">玩家搜尋</div>

      <!-- 搜尋區域 -->
      <div class="search-section mb-lg">
        <div class="search-form">
          <form @submit.prevent="performSearch">
            <div class="search-input-group">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="請輸入玩家暱稱"
                class="search-input"
                @focus="onInputFocus"
                @blur="onInputBlur"
              >
              <button type="submit" class="search-btn btn btn-primary">
                搜尋
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 搜尋結果 -->
      <div v-if="searchResults.length > 0" class="search-results mb-lg">
        <h3 class="section-title">搜尋結果</h3>
        <div class="users-grid">
          <div
            v-for="user in searchResults"
            :key="user.id"
            class="user-card"
            @click="viewUserProfile(user.id)"
          >
            <div class="user-avatar">
              <img :src="user.avatar || defaultAvatar" :alt="user.name">
            </div>
            <div class="user-info">
              <h4 class="user-name">{{ user.name }}</h4>
              <div class="user-stats">
                <div class="stat">
                  <span class="label">等級</span>
                  <span class="value">{{ user.level }}</span>
                </div>
                <div class="stat">
                  <span class="label">粉絲</span>
                  <span class="value">{{ user.followers }}</span>
                </div>
                <div class="stat">
                  <span class="label">勝率</span>
                  <span class="value">{{ user.winRate }}%</span>
                </div>
              </div>
              <div class="user-bio" v-if="user.bio">
                {{ user.bio }}
              </div>
            </div>
            <div class="user-actions">
              <button
                class="btn btn-outline btn-sm"
                @click.stop="followUser(user.id)"
                :disabled="user.isFollowing"
              >
                {{ user.isFollowing ? '已關注' : '關注' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近搜尋 -->
      <div v-if="recentSearches.length > 0" class="recent-searches mb-lg">
        <h3 class="section-title">最近搜尋</h3>
        <div class="recent-list">
          <div
            v-for="user in recentSearches"
            :key="user.id"
            class="recent-item"
            @click="viewUserProfile(user.id)"
          >
            <img :src="user.avatar || defaultAvatar" :alt="user.name" class="recent-avatar">
            <span class="recent-name">{{ user.name }}</span>
            <button class="remove-btn" @click.stop="removeFromRecent(user.id)">
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- 熱門玩家 -->
      <div class="popular-users">
        <h3 class="section-title">熱門玩家 (近三十日)</h3>
        <div class="users-grid">
          <div
            v-for="user in popularUsers"
            :key="user.id"
            class="user-card popular-user-card"
            @click="viewUserProfile(user.id)"
          >
            <div class="user-rank">{{ user.rank }}</div>
            <div class="user-avatar">
              <img :src="user.avatar || defaultAvatar" :alt="user.name">
            </div>
            <div class="user-info">
              <h4 class="user-name">{{ user.name }}</h4>
              <div class="user-stats">
                <div class="stat">
                  <span class="label">活躍度</span>
                  <span class="value">{{ user.activity }}</span>
                </div>
                <div class="stat">
                  <span class="label">粉絲</span>
                  <span class="value">{{ user.followers }}</span>
                </div>
                <div class="stat">
                  <span class="label">勝率</span>
                  <span class="value">{{ user.winRate }}%</span>
                </div>
              </div>
            </div>
            <div class="user-actions">
              <button
                class="btn btn-outline btn-sm"
                @click.stop="followUser(user.id)"
                :disabled="user.isFollowing"
              >
                {{ user.isFollowing ? '已關注' : '關注' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';

const router = useRouter();
const session = useSessionStore();

// 響應式數據
const searchQuery = ref('');
const searchResults = ref([]);
const recentSearches = ref([]);
const popularUsers = ref([]);

// 模擬預設頭像
const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="100%" height="100%" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="%23999">?</text></svg>';

// 模擬熱門玩家數據
popularUsers.value = [
  {
    id: 1,
    rank: 1,
    name: '棒球大師',
    avatar: '',
    activity: '很高',
    followers: 1250,
    winRate: 78.5,
    isFollowing: false
  },
  {
    id: 2,
    rank: 2,
    name: '運彩高手',
    avatar: '',
    activity: '高',
    followers: 980,
    winRate: 76.3,
    isFollowing: true
  },
  {
    id: 3,
    rank: 3,
    name: '預測達人',
    avatar: '',
    activity: '高',
    followers: 842,
    winRate: 74.1,
    isFollowing: false
  },
  {
    id: 4,
    rank: 4,
    name: '籃球分析師',
    avatar: '',
    activity: '中',
    followers: 756,
    winRate: 71.8,
    isFollowing: false
  },
  {
    id: 5,
    rank: 5,
    name: '足球專家',
    avatar: '',
    activity: '中',
    followers: 623,
    winRate: 69.2,
    isFollowing: false
  }
];

// 模擬最近搜尋數據
recentSearches.value = [
  {
    id: 6,
    name: '新手玩家',
    avatar: ''
  },
  {
    id: 7,
    name: '老鳥分析師',
    avatar: ''
  }
];

// 方法
function onInputFocus() {
  // 輸入框聚焦效果
}

function onInputBlur() {
  // 輸入框失焦效果
}

async function performSearch() {
  if (!searchQuery.value.trim()) {
    alert('請輸入玩家暱稱');
    return;
  }

  // 模擬搜尋API調用
  try {
    // 這裡應該調用真實的搜尋API
    searchResults.value = [
      {
        id: 8,
        name: searchQuery.value,
        avatar: '',
        level: '新手',
        followers: 45,
        winRate: 52.3,
        bio: '喜歡研究棒球賽事',
        isFollowing: false
      }
    ];

    // 將搜尋結果加入最近搜尋
    const existingIndex = recentSearches.value.findIndex(user => user.name === searchQuery.value);
    if (existingIndex === -1) {
      recentSearches.value.unshift({
        id: Date.now(),
        name: searchQuery.value,
        avatar: ''
      });
      // 限制最近搜尋最多5個
      if (recentSearches.value.length > 5) {
        recentSearches.value = recentSearches.value.slice(0, 5);
      }
    }

  } catch (error) {
    alert('搜尋失敗，請稍後再試');
  }
}

function viewUserProfile(userId: number) {
  router.push({ name: 'member-view', params: { id: userId } });
}

function followUser(userId: number) {
  const user = searchResults.value.find(u => u.id === userId) ||
               popularUsers.value.find(u => u.id === userId);
  if (user) {
    user.isFollowing = !user.isFollowing;
    alert(`${user.isFollowing ? '關注' : '取消關注'} ${user.name}`);
  }
}

function removeFromRecent(userId: number) {
  const index = recentSearches.value.findIndex(user => user.id === userId);
  if (index !== -1) {
    recentSearches.value.splice(index, 1);
  }
}

onMounted(() => {
  // 初始化頁面
});
</script>

<style scoped>
.search-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-form {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-group {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-btn {
  padding: 0.75rem 2rem;
  white-space: nowrap;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.user-card, .popular-user-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
}

.user-card:hover, .popular-user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.user-rank {
  position: absolute;
  top: -10px;
  left: 20px;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #f39c12, #e74c3c);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.user-avatar {
  text-align: center;
  margin-bottom: 1rem;
}

.user-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #e0e0e0;
}

.user-info {
  margin-bottom: 1rem;
}

.user-name {
  margin: 0 0 0.5rem 0;
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.stat {
  text-align: center;
  padding: 0.25rem;
}

.stat .label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat .value {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #3498db;
}

.user-bio {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 0.5rem;
}

.user-actions {
  text-align: center;
}

.recent-searches {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.recent-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.recent-item:hover {
  background: #e9ecef;
}

.recent-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #dee2e6;
}

.recent-name {
  font-weight: 500;
  color: #495057;
}

.remove-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #dee2e6;
}

.popular-users {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .users-grid {
    grid-template-columns: 1fr;
  }

  .search-input-group {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }

  .user-stats {
    grid-template-columns: 1fr;
  }

  .recent-list {
    flex-direction: column;
  }
}
</style>
