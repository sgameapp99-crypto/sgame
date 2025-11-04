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
      <div v-if="errorMessage || loading" class="status-panel mb-lg">
        <div v-if="errorMessage" class="feedback error-message">{{ errorMessage }}</div>
        <div v-if="loading" class="feedback loading-state">搜尋中...</div>
      </div>

      <div v-if="hasSearchResults" class="search-results mb-lg">
        <h3 class="section-title">搜尋結果</h3>
        <div class="users-grid">
          <div
            v-for="user in searchResults"
            :key="user.id"
            class="user-card"
            @click="viewUserProfile(user.id)"
          >
            <div class="user-avatar">
              <img :src="user.avatarUrl || defaultAvatar" :alt="user.name">
            </div>
            <div class="user-info">
              <h4 class="user-name">{{ user.name }}</h4>
              <div class="user-stats">
                <div class="stat">
                  <span class="label">等級</span>
                  <span class="value">{{ getLevelLabel(user) }}</span>
                </div>
                <div class="stat">
                  <span class="label">粉絲</span>
                  <span class="value">{{ user.followersCount }}</span>
                </div>
                <div class="stat">
                  <span class="label">追蹤中</span>
                  <span class="value">{{ user.followingCount }}</span>
                </div>
              </div>
              <div class="user-bio" v-if="user.bio">
                {{ user.bio }}
              </div>
            </div>
            <div class="user-actions">
              <button
                class="btn btn-outline btn-sm"
                @click.stop="toggleFollow(user.id)"
                :disabled="followLoadingMap[user.id] || user.relationships?.isSelf"
              >
                <span v-if="followLoadingMap[user.id]">處理中...</span>
                <span v-else-if="user.relationships?.isSelf">本人</span>
                <span v-else>{{ user.relationships?.isFollowing ? '取消關注' : '關注' }}</span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="pagination" class="pagination">
          <button
            type="button"
            class="btn btn-outline btn-sm"
            @click="goToPrevPage"
            :disabled="!hasPrevPage"
          >
            上一頁
          </button>
          <span class="page-info">
            第 {{ currentPage }} / {{ totalPages || 1 }} 頁
          </span>
          <button
            type="button"
            class="btn btn-outline btn-sm"
            @click="goToNextPage"
            :disabled="!hasNextPage"
          >
            下一頁
          </button>
        </div>
      </div>

      <div
        v-else-if="hasSearched && !loading && !errorMessage"
        class="empty-state mb-lg"
      >
        找不到符合關鍵字的玩家，請試試其他暱稱。
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
            <img :src="user.avatarUrl || defaultAvatar" :alt="user.name" class="recent-avatar">
            <span class="recent-name">{{ user.name }}</span>
            <button class="remove-btn" @click.stop="removeFromRecent(user.id)">
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- 推薦玩家 -->
      <div class="recommendation-section">
        <h3 class="section-title">推薦玩家</h3>
        <div v-if="recommendationsLoading" class="feedback loading-state">載入推薦中...</div>
        <div v-else-if="recommendations.length === 0" class="empty-state">暫無推薦玩家，請稍後再試。</div>
        <div v-else class="users-grid">
          <div
            v-for="(user, index) in recommendations"
            :key="user.id"
            class="user-card recommendation-card"
            @click="viewUserProfile(user.id)"
          >
            <div class="user-rank" v-if="index < 5">{{ index + 1 }}</div>
            <div class="user-avatar">
              <img :src="user.avatarUrl || defaultAvatar" :alt="user.name">
            </div>
            <div class="user-info">
              <h4 class="user-name">{{ user.name }}</h4>
              <div class="user-stats">
                <div class="stat">
                  <span class="label">等級</span>
                  <span class="value">{{ getLevelLabel(user) }}</span>
                </div>
                <div class="stat">
                  <span class="label">粉絲</span>
                  <span class="value">{{ user.followersCount }}</span>
                </div>
                <div class="stat">
                  <span class="label">追蹤中</span>
                  <span class="value">{{ user.followingCount }}</span>
                </div>
              </div>
              <div class="recommend-meta" v-if="user.recommendation">
                <div class="recommend-label">
                  {{ user.recommendation.type === 'accuracy' ? '高勝率推薦' : '高等級推薦' }}
                </div>
                <div
                  class="recommend-stats"
                  v-if="user.recommendation.type === 'accuracy'"
                >
                  勝率 {{ formatAccuracy(user.recommendation.accuracy) }} ·
                  {{ user.recommendation.winCount ?? 0 }} 勝 / {{ user.recommendation.totalPredictions ?? 0 }} 場
                </div>
                <div class="recommend-reason" v-if="user.recommendation.reason">
                  {{ user.recommendation.reason }}
                </div>
              </div>
            </div>
            <div class="user-actions">
              <button
                class="btn btn-outline btn-sm"
                @click.stop="toggleFollow(user.id)"
                :disabled="followLoadingMap[user.id] || user.relationships?.isSelf"
              >
                <span v-if="followLoadingMap[user.id]">處理中...</span>
                <span v-else-if="user.relationships?.isSelf">本人</span>
                <span v-else>{{ user.relationships?.isFollowing ? '取消關注' : '關注' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSessionStore } from '../stores/session';
import memberAPI from '../api/member';
import type { MemberSearchResult, MemberRecommendation, PageMeta } from '../api/types';

const router = useRouter();
const route = useRoute();
const session = useSessionStore();

const searchQuery = ref('');
const searchResults = ref<MemberSearchResult[]>([]);
const recommendations = ref<MemberRecommendation[]>([]);
const recentSearches = ref<Array<{ id: number; name: string; avatarUrl?: string | null }>>([]);
const pagination = ref<PageMeta | null>(null);
const loading = ref(false);
const recommendationsLoading = ref(false);
const errorMessage = ref('');
const hasSearched = ref(false);
const followLoadingMap = ref<Record<number, boolean>>({});

const pageSize = 20;

const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="100%" height="100%" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="%23999">?</text></svg>';

const currentPage = computed(() => pagination.value?.page ?? 1);
const totalPages = computed(() => pagination.value?.totalPages ?? 0);
const hasNextPage = computed(() => pagination.value?.hasNext ?? false);
const hasPrevPage = computed(() => (pagination.value?.page ?? 1) > 1);
const hasSearchResults = computed(() => searchResults.value.length > 0);

function onInputFocus() {
  // 可以在此處加入輸入框聚焦效果
}

function onInputBlur() {
  // 可以在此處加入輸入框失焦效果
}

function setFollowLoading(userId: number, value: boolean) {
  followLoadingMap.value = {
    ...followLoadingMap.value,
    [userId]: value,
  };
}

function updateFollowState(userId: number, isFollowing: boolean) {
  const delta = isFollowing ? 1 : -1;
  const updateList = (list: Array<MemberSearchResult | MemberRecommendation>) => {
    const target = list.find(item => item.id === userId);
    if (!target) return;
    if (!target.relationships) {
      target.relationships = { isSelf: false, isFollowing, canFollow: !isFollowing };
    } else {
      target.relationships.isFollowing = isFollowing;
      if (typeof target.relationships.canFollow !== 'undefined') {
        target.relationships.canFollow = !isFollowing;
      }
    }
    if (typeof target.followersCount === 'number') {
      const next = target.followersCount + delta;
      target.followersCount = next < 0 ? 0 : next;
    }
  };

  updateList(searchResults.value);
  updateList(recommendations.value);
}

function addRecentFromResults(results: MemberSearchResult[]) {
  if (!results.length) return;
  const primary = results[0];
  const existingIndex = recentSearches.value.findIndex(item => item.id === primary.id);
  if (existingIndex !== -1) {
    recentSearches.value.splice(existingIndex, 1);
  }
  recentSearches.value.unshift({
    id: primary.id,
    name: primary.name,
    avatarUrl: primary.avatarUrl,
  });
  if (recentSearches.value.length > 5) {
    recentSearches.value.splice(5);
  }
}

function formatAccuracy(accuracy?: number) {
  if (typeof accuracy !== 'number') return '--';
  const value = accuracy > 1 ? accuracy : accuracy * 100;
  return `${value.toFixed(1)}%`;
}

function getLevelLabel(user: MemberSearchResult | MemberRecommendation) {
  return user.levelInfo?.name ?? user.level;
}

async function performSearch(page = 1) {
  if (!searchQuery.value.trim()) {
    errorMessage.value = '請輸入玩家暱稱';
    return;
  }

  if (loading.value) return;

  loading.value = true;
  errorMessage.value = '';
  hasSearched.value = true;

  try {
    const response = await memberAPI.search({
      nickname: searchQuery.value.trim(),
      page,
      pageSize,
    });

    searchResults.value = response.results || [];
    pagination.value = response.pagination ?? null;

    if (response.results?.length) {
      addRecentFromResults(response.results);
    }
  } catch (error: any) {
    const message = error?.response?.data?.message || '搜尋失敗，請稍後再試';
    errorMessage.value = message;
    searchResults.value = [];
    pagination.value = null;
  } finally {
    loading.value = false;
  }
}

function goToPage(page: number) {
  if (page < 1) return;
  if (totalPages.value && page > totalPages.value) return;
  performSearch(page);
}

function goToPrevPage() {
  if (!hasPrevPage.value) return;
  goToPage(currentPage.value - 1);
}

function goToNextPage() {
  if (!hasNextPage.value) return;
  goToPage(currentPage.value + 1);
}

async function toggleFollow(userId: number) {
  if (followLoadingMap.value[userId]) return;

  const target = searchResults.value.find(user => user.id === userId) ||
    recommendations.value.find(user => user.id === userId);

  if (!target) return;
  if (target.relationships?.isSelf) return;

  if (!session.loggedIn) {
    await session.fetchSession(true);
    if (!session.loggedIn) {
      const redirect = encodeURIComponent(route.fullPath);
      router.push({ name: 'login', query: { redirect } });
      return;
    }
  }

  const isFollowing = !!target.relationships?.isFollowing;

  setFollowLoading(userId, true);
  try {
    if (isFollowing) {
      await memberAPI.unfollow(userId);
    } else {
      await memberAPI.follow(userId);
    }
    updateFollowState(userId, !isFollowing);
  } catch (error: any) {
    const message = error?.response?.data?.message || '操作失敗，請稍後再試';
    window.alert(message);
  } finally {
    setFollowLoading(userId, false);
  }
}

function viewUserProfile(userId: number) {
  router.push({ name: 'member-view', params: { id: userId } });
}

function removeFromRecent(userId: number) {
  const index = recentSearches.value.findIndex(user => user.id === userId);
  if (index !== -1) {
    recentSearches.value.splice(index, 1);
  }
}

async function fetchRecommendations() {
  if (recommendationsLoading.value) return;
  recommendationsLoading.value = true;
  try {
    const response = await memberAPI.getRecommendations();
    recommendations.value = response.recommendations || [];
  } catch (error) {
    console.error('取得推薦玩家失敗', error);
  } finally {
    recommendationsLoading.value = false;
  }
}

onMounted(() => {
  fetchRecommendations();
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

.status-panel {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.feedback {
  font-size: 14px;
  line-height: 1.6;
}

.error-message {
  color: #e74c3c;
}

.loading-state {
  color: #2c3e50;
}

.empty-state {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.user-card, .recommendation-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
}

.user-card:hover, .recommendation-card:hover {
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

.pagination {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.pagination .page-info {
  font-size: 14px;
  color: #495057;
}

.recommendation-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.recommend-meta {
  margin-top: 1rem;
  text-align: center;
}

.recommend-label {
  font-weight: 600;
  color: #1e88e5;
  margin-bottom: 0.5rem;
}

.recommend-stats {
  font-size: 14px;
  color: #546e7a;
  margin-bottom: 0.5rem;
}

.recommend-reason {
  font-size: 14px;
  color: #6c757d;
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
