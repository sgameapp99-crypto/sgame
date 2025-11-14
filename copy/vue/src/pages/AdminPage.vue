<template>
  <div class="admin-page">
    <div class="admin-container">
      <div class="admin-header">
        <h1>管理後台</h1>
        <div class="admin-user-info">
          <span>{{ session.user?.name || session.user?.email }}</span>
          <el-button type="danger" size="small" @click="handleLogout">登出</el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="admin-tabs">
        <!-- Tab 1: 賽事結果更新 -->
        <el-tab-pane label="賽事結果更新" name="results">
          <div class="tab-content">
            <el-card class="filter-card">
              <h3>篩選條件</h3>
              <el-form :inline="true" :model="gameFilters" class="filter-form">
                <el-form-item label="聯盟">
                  <el-select v-model="gameFilters.allianceId" placeholder="選擇聯盟" clearable>
                    <el-option
                      v-for="alliance in alliances"
                      :key="alliance.id"
                      :label="alliance.nameZh"
                      :value="alliance.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="狀態">
                  <el-select v-model="gameFilters.status" placeholder="選擇狀態" clearable>
                    <el-option label="已完成" value="finished" />
                    <el-option label="進行中" value="live" />
                    <el-option label="已排程" value="scheduled" />
                  </el-select>
                </el-form-item>
                <el-form-item label="開始日期">
                  <el-date-picker
                    v-model="gameFilters.startDate"
                    type="date"
                    placeholder="選擇日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                <el-form-item label="結束日期">
                  <el-date-picker
                    v-model="gameFilters.endDate"
                    type="date"
                    placeholder="選擇日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="loadGames">查詢</el-button>
                  <el-button @click="resetGameFilters">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>

            <el-card class="table-card">
              <h3>賽事列表</h3>
              <el-table
                :data="games"
                v-loading="gamesLoading"
                stripe
                style="width: 100%"
                @row-click="selectGame"
              >
                <el-table-column prop="id" label="賽事 ID" width="150" />
                <el-table-column prop="gameDate" label="日期" width="120" />
                <el-table-column prop="gameTime" label="時間" width="100" />
                <el-table-column label="對戰" min-width="200">
                  <template #default="{ row }">
                    {{ row.homeTeamName }} vs {{ row.awayTeamName }}
                  </template>
                </el-table-column>
                <el-table-column label="比分" width="120">
                  <template #default="{ row }">
                    <span v-if="row.finalScoreHome !== null && row.finalScoreAway !== null">
                      {{ row.finalScoreHome }} : {{ row.finalScoreAway }}
                    </span>
                    <span v-else class="text-muted">未更新</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="狀態" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">
                      {{ getStatusText(row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                v-if="gamesPagination.total > 0"
                class="pagination"
                :current-page="gamesPagination.page"
                :page-size="gamesPagination.size"
                :total="gamesPagination.total"
                layout="total, prev, pager, next"
                @current-change="handleGamesPageChange"
              />
            </el-card>

            <el-card class="form-card">
              <h3>更新賽事結果</h3>
              <el-form
                ref="resultFormRef"
                :model="resultForm"
                :rules="resultRules"
                label-width="120px"
              >
                <el-form-item label="賽事 ID" prop="gameId">
                  <el-input v-model="resultForm.gameId" placeholder="請輸入或從上方列表選擇" />
                </el-form-item>
                <el-form-item label="主隊得分" prop="finalScoreHome">
                  <el-input-number
                    v-model="resultForm.finalScoreHome"
                    :min="0"
                    :max="999"
                    placeholder="主隊得分"
                  />
                </el-form-item>
                <el-form-item label="客隊得分" prop="finalScoreAway">
                  <el-input-number
                    v-model="resultForm.finalScoreAway"
                    :min="0"
                    :max="999"
                    placeholder="客隊得分"
                  />
                </el-form-item>
                <el-form-item label="自動判定">
                  <el-switch v-model="resultForm.autoCalculate" />
                  <span class="form-tip">開啟後將自動判定預測結果並發放獎勵</span>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="resultSubmitting"
                    @click="submitGameResult"
                  >
                    提交結果
                  </el-button>
                  <el-button @click="resetResultForm">重置</el-button>
                </el-form-item>
              </el-form>

              <el-alert
                v-if="resultMessage"
                :title="resultMessage.title"
                :type="resultMessage.type"
                :description="resultMessage.description"
                show-icon
                closable
                @close="resultMessage = null"
              />
            </el-card>
          </div>
        </el-tab-pane>

        <!-- Tab 2: 預測結果管理 -->
        <el-tab-pane label="預測結果管理" name="predictions">
          <div class="tab-content">
            <el-card class="filter-card">
              <h3>篩選條件</h3>
              <el-form :inline="true" :model="predictionFilters" class="filter-form">
                <el-form-item label="用戶 ID">
                  <el-input
                    v-model.number="predictionFilters.userId"
                    placeholder="輸入用戶 ID"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="賽事 ID">
                  <el-input v-model="predictionFilters.gameId" placeholder="輸入賽事 ID" clearable />
                </el-form-item>
                <el-form-item label="狀態">
                  <el-select v-model="predictionFilters.status" placeholder="選擇狀態" clearable>
                    <el-option label="待判定" value="pending" />
                    <el-option label="預測正確" value="win" />
                    <el-option label="預測錯誤" value="lose" />
                    <el-option label="已取消" value="cancelled" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="loadPredictions">查詢</el-button>
                  <el-button @click="resetPredictionFilters">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>

            <el-card class="table-card">
              <h3>預測列表</h3>
              <el-table
                :data="predictions"
                v-loading="predictionsLoading"
                stripe
                style="width: 100%"
              >
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="userId" label="用戶 ID" width="100" />
                <el-table-column prop="userName" label="用戶名稱" width="120" />
                <el-table-column prop="gameId" label="賽事 ID" width="150" />
                <el-table-column prop="predictionType" label="預測類型" width="150" />
                <el-table-column prop="selection" label="選擇" width="100" />
                <el-table-column prop="odds" label="賠率" width="80" />
                <el-table-column prop="price" label="價格" width="80" />
                <el-table-column prop="purchaseCount" label="購買數" width="100" />
                <el-table-column prop="status" label="狀態" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getPredictionStatusType(row.status)">
                      {{ getPredictionStatusText(row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="建立時間" width="180">
                  <template #default="{ row }">
                    {{ formatDateTime(row.createdAt) }}
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                v-if="predictionsPagination.total > 0"
                class="pagination"
                :current-page="predictionsPagination.page"
                :page-size="predictionsPagination.size"
                :total="predictionsPagination.total"
                layout="total, prev, pager, next"
                @current-change="handlePredictionsPageChange"
              />
            </el-card>

            <el-card class="form-card">
              <h3>批量重新計算</h3>
              <el-form :inline="true" :model="calculateForm" class="calculate-form">
                <el-form-item label="賽事 ID">
                  <el-input
                    v-model="calculateForm.gameIds"
                    placeholder="多個 ID 用逗號分隔，留空處理全部"
                    style="width: 400px"
                  />
                </el-form-item>
                <el-form-item label="強制重算">
                  <el-switch v-model="calculateForm.force" />
                  <span class="form-tip">開啟後將重新計算已判定的預測</span>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="warning"
                    :loading="calculateSubmitting"
                    @click="submitCalculate"
                  >
                    執行計算
                  </el-button>
                </el-form-item>
              </el-form>

              <el-alert
                v-if="calculateResult"
                title="計算完成"
                type="success"
                :closable="false"
                show-icon
              >
                <template #default>
                  <div class="calculate-result">
                    <p>處理總數: {{ calculateResult.processed }}</p>
                    <p>預測正確: {{ calculateResult.wins }}</p>
                    <p>預測錯誤: {{ calculateResult.loses }}</p>
                    <p>已取消: {{ calculateResult.cancelled }}</p>
                    <p>錯誤數: {{ calculateResult.errors }}</p>
                  </div>
                </template>
              </el-alert>
            </el-card>
          </div>
        </el-tab-pane>

        <!-- Tab 3: 系統統計 -->
        <el-tab-pane label="系統統計" name="stats">
          <div class="tab-content">
            <el-card class="stats-card">
              <div class="stats-header">
                <h3>系統統計</h3>
                <el-button type="primary" size="small" @click="loadStats">刷新</el-button>
              </div>

              <div v-loading="statsLoading" class="stats-grid">
                <el-card class="stat-item">
                  <el-statistic title="用戶總數" :value="stats.users.total" />
                </el-card>

                <el-card class="stat-item">
                  <el-statistic title="賽事總數" :value="stats.games.total" />
                  <div class="stat-details">
                    <p>已排程: {{ stats.games.scheduled }}</p>
                    <p>進行中: {{ stats.games.live }}</p>
                    <p>已完成: {{ stats.games.finished }}</p>
                  </div>
                </el-card>

                <el-card class="stat-item">
                  <el-statistic title="預測總數" :value="stats.predictions.total" />
                  <div class="stat-details">
                    <p>待判定: {{ stats.predictions.pending }}</p>
                    <p>預測正確: {{ stats.predictions.win }}</p>
                    <p>預測錯誤: {{ stats.predictions.lose }}</p>
                  </div>
                </el-card>

                <el-card class="stat-item">
                  <el-statistic title="購買總數" :value="stats.purchases?.total || 0" />
                </el-card>

                <el-card class="stat-item">
                  <el-statistic title="榮譽點總餘額" :value="stats.coins.totalBalance" />
                </el-card>

                <el-card class="stat-item">
                  <el-statistic title="榮譽點總收入" :value="stats.coins.totalEarned" />
                </el-card>

                <el-card class="stat-item">
                  <el-statistic title="榮譽點總支出" :value="stats.coins.totalSpent" />
                </el-card>

                <el-card class="stat-item">
                  <el-statistic title="交易總數" :value="stats.coins.transactions" />
                </el-card>
              </div>
            </el-card>
          </div>
        </el-tab-pane>

        <!-- Tab 4: 賽事管理 -->
        <el-tab-pane label="賽事管理" name="manage">
          <div class="tab-content">
            <el-card class="form-card">
              <h3>建立賽事</h3>
              <p class="text-muted">此功能待實作，請使用後端 API 直接建立賽事</p>
            </el-card>
          </div>
        </el-tab-pane>

        <!-- Tab 5: 論壇管理 -->
        <el-tab-pane label="看板管理" name="forumBoards">
          <div class="tab-content">
            <ForumBoardManager @refresh="handleBoardsUpdated" />
          </div>
        </el-tab-pane>

        <!-- Tab 6: 論壇管理 -->
        <el-tab-pane label="論壇管理" name="forum">
          <div class="tab-content">
            <el-card class="stats-card">
              <div class="stats-header">
                <h3>論壇統計</h3>
                <el-button type="primary" size="small" @click="loadForumStats" :loading="forumStatsLoading">
                  刷新
                </el-button>
              </div>

              <div class="stats-grid" v-loading="forumStatsLoading">
                <el-card class="stat-item">
                  <el-statistic title="文章總數" :value="forumStats.totalPosts" />
                </el-card>
                <el-card class="stat-item">
                  <el-statistic title="回覆總數" :value="forumStats.totalComments" />
                </el-card>
                <el-card class="stat-item">
                  <el-statistic title="今日文章" :value="forumStats.todayPosts" />
                </el-card>
                <el-card class="stat-item">
                  <el-statistic title="今日回覆" :value="forumStats.todayComments" />
                </el-card>
                <el-card class="stat-item">
                  <el-statistic title="今日新會員" :value="forumStats.todayNewUsers" />
                </el-card>
              </div>

              <div class="stats-subgrid">
                <el-card class="stat-item">
                  <h4>熱門看板</h4>
                  <ul>
                    <li v-for="board in forumStats.topBoards" :key="board.boardId">
                      {{ board.boardName }}：文章 {{ board.postCount }}、回覆 {{ board.commentCount }}
                    </li>
                  </ul>
                </el-card>
                <el-card class="stat-item">
                  <h4>活躍作者</h4>
                  <ul>
                    <li v-for="author in forumStats.topAuthors" :key="author.userId">
                      {{ author.userName }}：文章 {{ author.postCount }}、讚 {{ author.totalLikes }}
                    </li>
                  </ul>
                </el-card>
              </div>
            </el-card>

            <el-card class="filter-card">
              <h3>論壇文章篩選</h3>
              <el-form :inline="true" :model="forumFilters" class="filter-form">
                <el-form-item label="看板">
                  <el-select v-model="forumFilters.boardId" placeholder="選擇看板" clearable filterable>
                    <el-option
                      v-for="board in flatBoards"
                      :key="board.id"
                      :label="board.name"
                      :value="board.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="狀態">
                  <el-select v-model="forumFilters.status" placeholder="文章狀態" clearable>
                    <el-option label="已發布" value="published" />
                    <el-option label="草稿" value="draft" />
                    <el-option label="已鎖定" value="locked" />
                    <el-option label="隱藏" value="hidden" />
                  </el-select>
                </el-form-item>
                <el-form-item label="刪除狀態">
                  <el-select v-model="forumFilters.isDeleted" placeholder="刪除狀態" clearable>
                    <el-option label="正常" :value="false" />
                    <el-option label="已刪除" :value="true" />
                  </el-select>
                </el-form-item>
                <el-form-item label="關鍵字">
                  <el-input v-model="forumFilters.keyword" placeholder="搜尋標題或作者" clearable />
                </el-form-item>
                <el-form-item label="時間範圍">
                  <el-date-picker
                    v-model="forumFilters.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="開始日期"
                    end-placeholder="結束日期"
                    value-format="YYYY-MM-DD"
                    unlink-panels
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="loadForumPosts">查詢</el-button>
                  <el-button @click="resetForumFilters">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>

            <el-card class="table-card">
              <div class="table-header">
                <h3>論壇文章列表</h3>
                <div class="actions">
                  <el-button type="danger" :disabled="!selectedForumPosts.length" @click="batchDeletePosts">
                    批量刪除
                  </el-button>
                  <el-button :disabled="!selectedForumPosts.length" @click="batchToggleSticky(true)">
                    批量置頂
                  </el-button>
                  <el-button :disabled="!selectedForumPosts.length" @click="batchToggleSticky(false)">
                    批量取消置頂
                  </el-button>
                </div>
              </div>

              <el-table
                :data="forumPosts"
                v-loading="forumPostsLoading"
                stripe
                style="width: 100%"
                @selection-change="handleForumSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="title" label="標題" min-width="220" />
                <el-table-column prop="author.name" label="作者" width="120" />
                <el-table-column prop="board.name" label="看板" width="120" />
                <el-table-column label="狀態" width="180">
                  <template #default="{ row }">
                    <el-tag size="small" type="warning" v-if="row.isSticky">置頂</el-tag>
                    <el-tag size="small" type="info" v-if="row.isLocked">鎖定</el-tag>
                    <el-tag size="small" type="danger" v-if="row.isDeleted">已刪除</el-tag>
                    <el-tag size="small" :type="getPostStatusType(row.status)">{{ getPostStatusText(row.status) }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="viewCount" label="瀏覽" width="90" />
                <el-table-column prop="commentCount" label="回覆" width="90" />
                <el-table-column prop="likeCount" label="推" width="90" />
                <el-table-column prop="createdAt" label="建立時間" width="180">
                  <template #default="{ row }">
                    {{ formatDateTime(row.createdAt) }}
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="240">
                  <template #default="{ row }">
                    <el-button size="small" @click="toggleSticky(row)">
                      {{ row.isSticky ? '取消置頂' : '置頂' }}
                    </el-button>
                    <el-button size="small" @click="toggleLock(row)">
                      {{ row.isLocked ? '解鎖' : '鎖定' }}
                    </el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="row.isDeleted ? restorePost(row) : deletePost(row)"
                    >
                      {{ row.isDeleted ? '恢復' : '刪除' }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                v-if="forumPagination.total > 0"
                class="pagination"
                :current-page="forumPagination.page"
                :page-size="forumPagination.size"
                :total="forumPagination.total"
                layout="total, prev, pager, next"
                @current-change="handleForumPageChange"
              />
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';
import { adminAPI } from '../api/admin';
import { forumAPI } from '../api/forum';
import { gamesAPI } from '../api/games';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import type {
  AdminGame,
  AdminPrediction,
  AdminStats,
  Alliance,
  ForumBoard,
  AdminForumPost,
  ForumStats,
} from '../api/types';
import type { Game, GamesResponse } from '../types/game';
import ForumBoardManager from '../components/admin/ForumBoardManager.vue';

const router = useRouter();
const session = useSessionStore();

const enableAdminGameList = import.meta.env.VITE_ENABLE_ADMIN_GAME_LIST === 'true';

// Tab 狀態
const activeTab = ref('results');

// 聯盟列表
const alliances = ref<Alliance[]>([]);
const forumBoards = ref<ForumBoard[]>([]);

const flatBoards = computed(() => {
  const list: ForumBoard[] = [];
  forumBoards.value.forEach((board) => {
    list.push(board);
    (board.children || []).forEach((child) => list.push(child));
  });
  return list;
});

// ==================== Tab 1: 賽事結果更新 ====================

const games = ref<AdminGame[]>([]);
const gamesLoading = ref(false);
const gamesPagination = reactive({
  page: 1,
  size: 20,
  total: 0,
});
const adminGamesEndpointAvailable = ref(enableAdminGameList);
const gamesFallbackNotified = ref(false);

const gameFilters = reactive({
  allianceId: undefined as number | undefined,
  status: 'finished' as string | undefined,
  startDate: undefined as string | undefined,
  endDate: undefined as string | undefined,
});

const resultFormRef = ref<FormInstance>();
const resultForm = reactive({
  gameId: '',
  finalScoreHome: 0,
  finalScoreAway: 0,
  autoCalculate: true,
});

const resultRules: FormRules = {
  gameId: [{ required: true, message: '請輸入賽事 ID', trigger: 'blur' }],
  finalScoreHome: [{ required: true, message: '請輸入主隊得分', trigger: 'blur' }],
  finalScoreAway: [{ required: true, message: '請輸入客隊得分', trigger: 'blur' }],
};

const resultSubmitting = ref(false);
const resultMessage = ref<{
  title: string;
  type: 'success' | 'error' | 'warning' | 'info';
  description?: string;
} | null>(null);

async function loadGames() {
  gamesLoading.value = true;
  try {
    if (!adminGamesEndpointAvailable.value) {
      await loadGamesFallback(!gamesFallbackNotified.value);
    } else {
      const response = await adminAPI.getGames({
        ...gameFilters,
        page: gamesPagination.page,
        size: gamesPagination.size,
      });
      games.value = response.data || [];
      if (response.pagination) {
        gamesPagination.page = response.pagination.page;
        gamesPagination.size = response.pagination.size;
        gamesPagination.total = response.pagination.total;
      }
    }
  } catch (error: any) {
    if (error?.response?.status === 404) {
      adminGamesEndpointAvailable.value = false;
      await loadGamesFallback(!gamesFallbackNotified.value);
    } else {
      ElMessage.error(error.response?.data?.message || '載入賽事列表失敗');
    }
  } finally {
    gamesLoading.value = false;
  }
}

async function loadGamesFallback(showNotice = false) {
  try {
    const params: Record<string, any> = {
      page: gamesPagination.page,
      size: gamesPagination.size,
    };
    if (gameFilters.allianceId) params.allianceId = gameFilters.allianceId;
    if (gameFilters.status) params.status = gameFilters.status;
    if (gameFilters.startDate && !gameFilters.endDate) params.date = gameFilters.startDate;

    const response: GamesResponse = await gamesAPI.getGames(params);
    games.value = (response.data || []).map(mapPublicGameToAdminGame);
    if (response.pagination) {
      gamesPagination.page = response.pagination.page;
      gamesPagination.size = response.pagination.size;
      gamesPagination.total = response.pagination.total;
    }
    if ((showNotice || !gamesFallbackNotified.value) && games.value.length) {
      ElMessage.info('管理端賽事列表尚未提供，已改用公開賽事資料');
      gamesFallbackNotified.value = true;
    }
  } catch (fallbackError: any) {
    ElMessage.error(fallbackError.response?.data?.message || '載入賽事列表失敗');
    games.value = [];
  }
}

function mapPublicGameToAdminGame(game: Game): AdminGame {
  return {
    id: game.gameId,
    allianceId: game.allianceId,
    gameDate: game.gameDate,
    gameTime: game.gameTime,
    homeTeamName: game.homeTeam.name,
    awayTeamName: game.awayTeam.name,
    status: game.status,
    gameMode: game.taiwanOdds ? 'taiwan' : 'international',
    finalScoreHome: game.finalScore?.home ?? undefined,
    finalScoreAway: game.finalScore?.away ?? undefined,
    internationalOdds: game.internationalOdds,
    taiwanOdds: game.taiwanOdds,
    createdAt: undefined,
    updatedAt: undefined,
  };
}

function resetGameFilters() {
  gameFilters.allianceId = undefined;
  gameFilters.status = 'finished';
  gameFilters.startDate = undefined;
  gameFilters.endDate = undefined;
  gamesPagination.page = 1;
  loadGames();
}

function handleGamesPageChange(page: number) {
  gamesPagination.page = page;
  loadGames();
}

function selectGame(row: AdminGame) {
  resultForm.gameId = row.id;
  if (row.finalScoreHome !== null && row.finalScoreHome !== undefined) {
    resultForm.finalScoreHome = row.finalScoreHome;
  }
  if (row.finalScoreAway !== null && row.finalScoreAway !== undefined) {
    resultForm.finalScoreAway = row.finalScoreAway;
  }
}

async function submitGameResult() {
  if (!resultFormRef.value) return;

  await resultFormRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      await ElMessageBox.confirm(
        `確定要更新賽事 ${resultForm.gameId} 的結果嗎？${
          resultForm.autoCalculate ? '將自動判定預測結果。' : ''
        }`,
        '確認操作',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );

      resultSubmitting.value = true;
      const response = await adminAPI.updateGameResult(resultForm.gameId, {
        finalScoreHome: resultForm.finalScoreHome,
        finalScoreAway: resultForm.finalScoreAway,
        autoCalculate: resultForm.autoCalculate,
      });

      resultMessage.value = {
        title: '更新成功',
        type: 'success',
        description: response.message || '賽事結果已更新',
      };

      ElMessage.success('賽事結果已更新');
      loadGames();
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage.error(error.response?.data?.message || '更新失敗');
      }
    } finally {
      resultSubmitting.value = false;
    }
  });
}

function resetResultForm() {
  resultFormRef.value?.resetFields();
  resultForm.gameId = '';
  resultForm.finalScoreHome = 0;
  resultForm.finalScoreAway = 0;
  resultForm.autoCalculate = true;
  resultMessage.value = null;
}

function getStatusType(status: string) {
  const types: Record<string, any> = {
    scheduled: '',
    live: 'warning',
    finished: 'success',
    cancelled: 'info',
  };
  return types[status] || '';
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    scheduled: '已排程',
    live: '進行中',
    finished: '已完成',
    cancelled: '已取消',
  };
  return texts[status] || status;
}

// ==================== Tab 2: 預測結果管理 ====================

const predictions = ref<AdminPrediction[]>([]);
const predictionsLoading = ref(false);
const predictionsPagination = reactive({
  page: 1,
  size: 20,
  total: 0,
});

const predictionFilters = reactive({
  userId: undefined as number | undefined,
  gameId: undefined as string | undefined,
  status: undefined as 'pending' | 'win' | 'lose' | 'cancelled' | undefined,
});

const calculateForm = reactive({
  gameIds: '',
  force: false,
});

const calculateSubmitting = ref(false);
const calculateResult = ref<{
  processed: number;
  wins: number;
  loses: number;
  cancelled: number;
  errors: number;
} | null>(null);

async function loadPredictions() {
  predictionsLoading.value = true;
  try {
    const response = await adminAPI.getPredictions({
      ...predictionFilters,
      page: predictionsPagination.page,
      size: predictionsPagination.size,
    });
    predictions.value = response.data || [];
    if (response.pagination) {
      predictionsPagination.page = response.pagination.page;
      predictionsPagination.size = response.pagination.size;
      predictionsPagination.total = response.pagination.total;
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '載入預測列表失敗');
  } finally {
    predictionsLoading.value = false;
  }
}

function resetPredictionFilters() {
  predictionFilters.userId = undefined;
  predictionFilters.gameId = undefined;
  predictionFilters.status = undefined;
  predictionsPagination.page = 1;
  loadPredictions();
}

function handlePredictionsPageChange(page: number) {
  predictionsPagination.page = page;
  loadPredictions();
}

async function submitCalculate() {
  try {
    await ElMessageBox.confirm(
      `確定要執行批量計算嗎？${calculateForm.force ? '將重新計算已判定的預測。' : ''}`,
      '確認操作',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    calculateSubmitting.value = true;
    const gameIds = calculateForm.gameIds
      ? calculateForm.gameIds.split(',').map((id) => id.trim()).filter(Boolean)
      : undefined;

    const response = await adminAPI.calculatePredictionResults({
      gameIds,
      force: calculateForm.force,
    });

    calculateResult.value = response.data.summary;
    ElMessage.success('計算完成');
    loadPredictions();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '計算失敗');
    }
  } finally {
    calculateSubmitting.value = false;
  }
}

function getPredictionStatusType(status: string) {
  const types: Record<string, any> = {
    pending: 'warning',
    win: 'success',
    lose: 'danger',
    cancelled: 'info',
  };
  return types[status] || '';
}

function getPredictionStatusText(status: string) {
  const texts: Record<string, string> = {
    pending: '待判定',
    win: '預測正確',
    lose: '預測錯誤',
    cancelled: '已取消',
  };
  return texts[status] || status;
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ==================== Tab 3: 系統統計 ====================

const stats = ref<AdminStats>({
  users: { total: 0 },
  games: { total: 0, scheduled: 0, live: 0, finished: 0 },
  predictions: { total: 0, pending: 0, win: 0, lose: 0 },
  purchases: { total: 0 },
  coins: { totalBalance: 0, totalEarned: 0, totalSpent: 0, transactions: 0 },
});
const statsLoading = ref(false);
const forumStats = ref<ForumStats>({
  totalPosts: 0,
  totalComments: 0,
  totalUsers: 0,
  todayPosts: 0,
  todayComments: 0,
  todayNewUsers: 0,
  topBoards: [],
  topAuthors: [],
  recentDeleted: [],
});
const forumStatsLoading = ref(false);

const forumFilters = reactive({
  boardId: undefined as number | undefined,
  status: undefined as 'draft' | 'published' | 'locked' | 'hidden' | undefined,
  isDeleted: undefined as boolean | undefined,
  keyword: '',
  dateRange: [] as string[] | [],
  page: 1,
  size: 20,
});

const forumPosts = ref<AdminForumPost[]>([]);
const forumPostsLoading = ref(false);
const forumPagination = reactive({
  page: 1,
  size: 20,
  total: 0,
});
const selectedForumPosts = ref<AdminForumPost[]>([]);

async function loadStats() {
  statsLoading.value = true;
  try {
    const response = await adminAPI.getStats();
    stats.value = response.stats;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '載入統計資料失敗');
  } finally {
    statsLoading.value = false;
  }
}

async function loadForumStats() {
  forumStatsLoading.value = true;
  try {
    const response = await adminAPI.getForumStats();
    forumStats.value = response.stats;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '載入論壇統計失敗');
  } finally {
    forumStatsLoading.value = false;
  }
}

async function loadForumBoards() {
  try {
    const response = await forumAPI.getBoards();
    forumBoards.value = response.data || [];
  } catch (error: any) {
    console.error('載入論壇看板失敗', error);
  }
}

function handleBoardsUpdated() {
  loadForumBoards();
}

async function loadForumPosts() {
  forumPostsLoading.value = true;
  try {
    const params: Record<string, any> = {
      page: forumPagination.page,
      size: forumPagination.size,
    };
    if (forumFilters.boardId) params.boardId = forumFilters.boardId;
    if (forumFilters.status) params.status = forumFilters.status;
    if (forumFilters.isDeleted !== undefined) params.isDeleted = forumFilters.isDeleted;
    if (forumFilters.keyword) params.keyword = forumFilters.keyword;
    if (forumFilters.dateRange?.length === 2) {
      params.startDate = forumFilters.dateRange[0];
      params.endDate = forumFilters.dateRange[1];
    }

    const response = await adminAPI.getForumPosts(params);
    forumPosts.value = response.data || [];
    if (response.pagination) {
      forumPagination.page = response.pagination.page;
      forumPagination.size = response.pagination.size;
      forumPagination.total = response.pagination.total;
    }
    selectedForumPosts.value = [];
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '載入論壇文章失敗');
  } finally {
    forumPostsLoading.value = false;
  }
}

function resetForumFilters() {
  forumFilters.boardId = undefined;
  forumFilters.status = undefined;
  forumFilters.isDeleted = undefined;
  forumFilters.keyword = '';
  forumFilters.dateRange = [];
  forumPagination.page = 1;
  loadForumPosts();
}

function handleForumPageChange(page: number) {
  forumPagination.page = page;
  loadForumPosts();
}

function handleForumSelectionChange(rows: AdminForumPost[]) {
  selectedForumPosts.value = rows;
}

async function toggleSticky(post: AdminForumPost) {
  try {
    await adminAPI.updateForumPostSticky(post.id, !post.isSticky);
    ElMessage.success(post.isSticky ? '已取消置頂' : '已置頂文章');
    loadForumPosts();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '更新置頂狀態失敗');
  }
}

async function toggleLock(post: AdminForumPost) {
  try {
    await adminAPI.updateForumPostLock(post.id, !post.isLocked);
    ElMessage.success(post.isLocked ? '已解鎖文章' : '已鎖定文章');
    loadForumPosts();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '更新鎖定狀態失敗');
  }
}

async function deletePost(post: AdminForumPost) {
  try {
    await ElMessageBox.confirm('確定要刪除此文章嗎？', '確認刪除', {
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await adminAPI.batchDeleteForumPosts([post.id]);
    ElMessage.success('文章已刪除');
    loadForumPosts();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '刪除文章失敗');
    }
  }
}

async function restorePost(post: AdminForumPost) {
  try {
    await adminAPI.restoreForumPost(post.id);
    ElMessage.success('文章已恢復');
    loadForumPosts();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '恢復文章失敗');
  }
}

async function batchDeletePosts() {
  if (!selectedForumPosts.value.length) return;
  try {
    await ElMessageBox.confirm(`確認刪除選取的 ${selectedForumPosts.value.length} 篇文章？`, '批量刪除', {
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await adminAPI.batchDeleteForumPosts(selectedForumPosts.value.map((p) => p.id));
    ElMessage.success('已批量刪除文章');
    selectedForumPosts.value = [];
    loadForumPosts();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '批量刪除失敗');
    }
  }
}

async function batchToggleSticky(sticky: boolean) {
  if (!selectedForumPosts.value.length) return;
  try {
    await Promise.all(
      selectedForumPosts.value.map((post) => adminAPI.updateForumPostSticky(post.id, sticky))
    );
    ElMessage.success(sticky ? '已批量置頂文章' : '已批量取消置頂文章');
    selectedForumPosts.value = [];
    loadForumPosts();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '更新置頂狀態失敗');
  }
}

function getPostStatusType(status: string) {
  const types: Record<string, any> = {
    draft: 'info',
    published: 'success',
    locked: 'warning',
    hidden: 'info',
  };
  return types[status] || '';
}

function getPostStatusText(status: string) {
  const texts: Record<string, string> = {
    draft: '草稿',
    published: '已發布',
    locked: '已鎖定',
    hidden: '隱藏',
  };
  return texts[status] || status;
}

// ==================== 通用功能 ====================

async function loadAlliances() {
  try {
    const response = await adminAPI.getAlliances();
    alliances.value = response.data || [];
  } catch (error: any) {
    console.error('載入聯盟列表失敗:', error);
  }
}

async function handleLogout() {
  try {
    await session.logout();
    ElMessage.success('已登出');
    router.push('/');
  } catch (error) {
    ElMessage.error('登出失敗');
  }
}

watch(
  () => activeTab.value,
  (tab) => {
    if (tab === 'forum') {
      if (!forumBoards.value.length) loadForumBoards();
      loadForumStats();
      loadForumPosts();
    }
  }
);

// ==================== 初始化 ====================

onMounted(async () => {
  // 檢查管理員權限
  await session.fetchSession(true);
  if (!session.isAdmin) {
    ElMessage.error('無權限訪問');
    router.push('/');
    return;
  }

  // 載入初始資料
  await loadAlliances();
  loadGames();
  loadStats();
  loadForumBoards();
});
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.admin-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-tabs {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-content {
  padding: 20px 0;
}

.filter-card,
.table-card,
.form-card,
.stats-card {
  margin-bottom: 20px;
}

.filter-card h3,
.table-card h3,
.form-card h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #303133;
}

.filter-form {
  margin-top: 16px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.form-tip {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.text-muted {
  color: #909399;
}

.calculate-form {
  margin-bottom: 20px;
}

.calculate-result {
  margin-top: 8px;
}

.calculate-result p {
  margin: 4px 0;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-header h3 {
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.stat-item {
  padding: 16px;
}

.stat-details {
  margin-top: 12px;
  font-size: 14px;
  color: #606266;
}

.stat-details p {
  margin: 4px 0;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>


