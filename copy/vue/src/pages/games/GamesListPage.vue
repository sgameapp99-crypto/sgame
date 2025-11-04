<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">賽事清單</div>

    <div class="card mt-md">
      <div class="filters">
        <div class="filters__group">
          <label class="filters__label" for="alliance-select">聯盟</label>
          <select
            id="alliance-select"
            class="filters__select"
            :value="selectedAllianceValue"
            @change="handleAllianceChange"
          >
            <option value="all">全部聯盟</option>
            <option v-for="option in allianceOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="filters__group">
          <label class="filters__label" for="status-select">狀態</label>
          <select
            id="status-select"
            class="filters__select"
            :value="selectedStatus"
            @change="handleStatusChange"
          >
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <div class="filters__group">
          <label class="filters__label" for="date-input">日期</label>
          <input
            id="date-input"
            class="filters__select"
            type="date"
            :value="selectedDate"
            @change="handleDateChange"
          />
        </div>

        <button
          class="filters__reset"
          type="button"
          :disabled="isDefaultFilter"
          @click="resetFilters"
        >
          重置篩選
        </button>
      </div>
    </div>

    <div v-if="loading" class="mt-lg text-neutral-500">資料載入中…</div>
    <div v-else>
      <div v-if="errorMessage" class="alert alert--error mt-lg">{{ errorMessage }}</div>
      <div v-else>
        <div v-if="games.length === 0" class="empty-state mt-xl">
          <h3 class="empty-state__title">查無對應的賽事</h3>
          <p class="empty-state__description">請嘗試調整日期或聯盟篩選。</p>
        </div>
        <div v-else class="card mt-lg">
          <div class="summary">
            <span>共 {{ pagination.total }} 場賽事</span>
            <span>｜第 {{ pagination.page }} / {{ totalPages }} 頁</span>
          </div>

          <div class="table-wrapper">
            <table class="games-table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>時間</th>
                  <th>聯盟</th>
                  <th>客隊</th>
                  <th>主隊</th>
                  <th>比分</th>
                  <th>狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="game in games" :key="game.gameId">
                  <td>{{ formatDateDisplay(game.gameDate) }}</td>
                  <td>{{ game.gameTime }}</td>
                  <td>{{ game.allianceName }}</td>
                  <td>
                    <div class="team-cell">
                      <span class="team-name">{{ game.awayTeam.name }}</span>
                      <span v-if="game.awayTeam.pitcher" class="team-sub">{{
                        game.awayTeam.pitcher
                      }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="team-cell">
                      <span class="team-name">{{ game.homeTeam.name }}</span>
                      <span v-if="game.homeTeam.pitcher" class="team-sub">{{
                        game.homeTeam.pitcher
                      }}</span>
                    </div>
                  </td>
                  <td>
                    <span v-if="game.finalScore" class="score">
                      {{ game.finalScore.away }} - {{ game.finalScore.home }}
                    </span>
                    <span v-else class="score score--pending">-</span>
                  </td>
                  <td>
                    <span :class="['status', `status--${game.status}`]">{{
                      statusLabel(game.status)
                    }}</span>
                  </td>
                  <td>
                    <RouterLink
                      class="btn btn-outline btn-sm"
                      :to="{ name: 'game-detail', params: { id: game.gameId } }"
                    >
                      查看詳情
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <button
              class="pagination__btn"
              type="button"
              :disabled="pagination.page <= 1"
              @click="changePage(pagination.page - 1)"
            >
              上一頁
            </button>
            <span class="pagination__info">第 {{ pagination.page }} / {{ totalPages }} 頁</span>
            <button
              class="pagination__btn"
              type="button"
              :disabled="pagination.page >= totalPages"
              @click="changePage(pagination.page + 1)"
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gamesAPI } from '../../api';
import type { Game, GamesQueryParams, GameStatus } from '../../types/game';

type SelectChangeEvent = {
  target: {
    value: string;
  };
};

type InputChangeEvent = {
  target: {
    value: string;
  };
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const errorMessage = ref('');
const games = ref<Game[]>([]);
const pagination = ref({ page: 1, size: 20, total: 0 });
const lastQueryKey = ref('');

const DEFAULT_PAGE_SIZE = 20;
const today = new Date();
const defaultDate = today.toISOString().split('T')[0];

const selectedAlliance = ref<'all' | number>('all');
const selectedStatus = ref<'all' | GameStatus>('all');
const selectedDate = ref<string>(defaultDate);

const statusOptions = [
  { value: 'all', label: '全部狀態' },
  { value: 'scheduled', label: '未開賽' },
  { value: 'live', label: '進行中' },
  { value: 'finished', label: '已結束' },
];

const staticAllianceOptions = [
  { id: '1', label: 'MLB' },
  { id: '3', label: '日本職棒' },
  { id: '4', label: '中華職棒' },
  { id: '6', label: '韓國職棒' },
  { id: '2', label: 'NBA' },
  { id: '7', label: 'WNBA' },
  { id: '5', label: '足球' },
  { id: '93', label: '美式足球' },
  { id: '91', label: 'NHL' },
  { id: '21', label: '網球' },
];

const selectedAllianceValue = computed(() =>
  selectedAlliance.value === 'all' ? 'all' : String(selectedAlliance.value),
);

const allianceOptions = computed(() => {
  const map = new Map<string, string>();
  staticAllianceOptions.forEach(({ id, label }) => {
    map.set(id, label);
  });
  games.value.forEach((game) => {
    map.set(String(game.allianceId), game.allianceName);
  });
  return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
});

const totalPages = computed(() => {
  if (!pagination.value.size) return 1;
  return Math.max(1, Math.ceil(pagination.value.total / pagination.value.size));
});

const isDefaultFilter = computed(
  () =>
    selectedAlliance.value === 'all' &&
    selectedStatus.value === 'all' &&
    selectedDate.value === defaultDate &&
    pagination.value.page === 1,
);

function formatDateDisplay(date: string): string {
  try {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${parsed.getFullYear()}-${month}-${day}`;
  } catch {
    return date;
  }
}

function statusLabel(status: GameStatus): string {
  const labels: Record<GameStatus, string> = {
    scheduled: '未開賽',
    live: '進行中',
    finished: '已結束',
  };
  return labels[status] || status;
}

function buildQueryObject(): Record<string, string> {
  const query: Record<string, string> = { page: String(pagination.value.page) };
  if (selectedAlliance.value !== 'all') {
    query.alliance = String(selectedAlliance.value);
  }
  if (selectedStatus.value !== 'all') {
    query.status = selectedStatus.value;
  }
  if (selectedDate.value) {
    query.date = selectedDate.value;
  }
  if (pagination.value.size !== DEFAULT_PAGE_SIZE) {
    query.size = String(pagination.value.size);
  }
  return query;
}

function getRouteKey(rawQuery = route.query): string {
  const normalized: Record<string, string> = {};
  const alliance = typeof rawQuery.alliance === 'string' ? rawQuery.alliance : undefined;
  const status = typeof rawQuery.status === 'string' ? rawQuery.status : undefined;
  const date = typeof rawQuery.date === 'string' ? rawQuery.date : undefined;
  const page = typeof rawQuery.page === 'string' ? rawQuery.page : undefined;
  const size = typeof rawQuery.size === 'string' ? rawQuery.size : undefined;

  if (alliance) normalized.alliance = alliance;
  if (status) normalized.status = status;
  if (date) normalized.date = date;
  if (page) normalized.page = page;
  if (size) normalized.size = size;

  return JSON.stringify(normalized);
}

function syncFiltersFromRoute(): void {
  const alliance =
    typeof route.query.alliance === 'string' ? Number(route.query.alliance) : undefined;
  selectedAlliance.value = alliance && !Number.isNaN(alliance) ? alliance : 'all';

  const status = typeof route.query.status === 'string' ? route.query.status : undefined;
  selectedStatus.value =
    status === 'scheduled' || status === 'live' || status === 'finished' ? status : 'all';

  const date =
    typeof route.query.date === 'string' && route.query.date ? route.query.date : defaultDate;
  selectedDate.value = date;

  const page = typeof route.query.page === 'string' ? Number(route.query.page) : 1;
  const size = typeof route.query.size === 'string' ? Number(route.query.size) : DEFAULT_PAGE_SIZE;

  pagination.value = {
    page: !Number.isNaN(page) && page > 0 ? page : 1,
    size: !Number.isNaN(size) && size > 0 ? size : DEFAULT_PAGE_SIZE,
    total: pagination.value.total,
  };
}

async function loadGames(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';

  const params: GamesQueryParams = {
    page: pagination.value.page,
    size: pagination.value.size,
  };

  if (selectedAlliance.value !== 'all') {
    params.allianceId = selectedAlliance.value;
  }
  if (selectedStatus.value !== 'all') {
    params.status = selectedStatus.value;
  }
  if (selectedDate.value) {
    params.date = selectedDate.value;
  }

  try {
    const result = await gamesAPI.getGames(params);
    if (result.success) {
      games.value = result.data || [];
      pagination.value = result.pagination || {
        page: params.page || 1,
        size: params.size || DEFAULT_PAGE_SIZE,
        total: games.value.length,
      };
    } else {
      games.value = [];
      pagination.value = {
        page: params.page || 1,
        size: params.size || DEFAULT_PAGE_SIZE,
        total: 0,
      };
      errorMessage.value = '載入賽事資料失敗';
    }
  } catch (error: unknown) {
    console.error('載入賽事資料失敗', error);
    games.value = [];
    pagination.value = {
      page: params.page || 1,
      size: params.size || DEFAULT_PAGE_SIZE,
      total: 0,
    };
    const apiError = error as ApiError;
    errorMessage.value = apiError.response?.data?.message || '載入賽事資料失敗，請稍後再試';
  } finally {
    loading.value = false;
  }
}

function updateRouteQuery(): void {
  const target = buildQueryObject();
  const targetKey = JSON.stringify(target);
  if (targetKey === getRouteKey()) {
    return;
  }
  router.replace({ query: target });
}

function handleAllianceChange(event: SelectChangeEvent): void {
  const value = event.target.value;
  selectedAlliance.value = value === 'all' ? 'all' : Number(value);
  pagination.value.page = 1;
  updateRouteQuery();
}

function handleStatusChange(event: SelectChangeEvent): void {
  const value = event.target.value as 'all' | GameStatus;
  selectedStatus.value = value;
  pagination.value.page = 1;
  updateRouteQuery();
}

function handleDateChange(event: InputChangeEvent): void {
  const value = event.target.value;
  selectedDate.value = value || defaultDate;
  pagination.value.page = 1;
  updateRouteQuery();
}

function changePage(page: number): void {
  if (page < 1 || page > totalPages.value) return;
  pagination.value.page = page;
  updateRouteQuery();
}

function resetFilters(): void {
  selectedAlliance.value = 'all';
  selectedStatus.value = 'all';
  selectedDate.value = defaultDate;
  pagination.value = { page: 1, size: DEFAULT_PAGE_SIZE, total: pagination.value.total };
  updateRouteQuery();
}

onMounted(async () => {
  syncFiltersFromRoute();
  lastQueryKey.value = getRouteKey();
  await loadGames();
});

watch(
  () => route.query,
  async () => {
    const currentKey = getRouteKey();
    if (currentKey === lastQueryKey.value) {
      return;
    }

    lastQueryKey.value = currentKey;
    syncFiltersFromRoute();
    await loadGames();
  },
);
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filters__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filters__label {
  font-size: 14px;
  color: #4b5563;
}

.filters__select {
  min-width: 180px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  color: #1f2937;
}

.filters__reset {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.filters__reset:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filters__reset:not(:disabled):hover {
  background: #f3f4f6;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.alert--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.empty-state {
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  border: 1px dashed #d1d5db;
  background: #f9fafb;
}

.empty-state__title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.empty-state__description {
  margin-top: 12px;
  color: #6b7280;
  font-size: 14px;
}

.summary {
  color: #4b5563;
  font-size: 14px;
  margin-bottom: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

.games-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

.games-table thead {
  background: #f3f4f6;
}

.games-table th,
.games-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  font-size: 14px;
  color: #1f2937;
}

.team-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.team-name {
  font-weight: 600;
}

.team-sub {
  font-size: 12px;
  color: #6b7280;
}

.score {
  font-weight: 600;
}

.score--pending {
  color: #9ca3af;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.status--scheduled {
  background: #eff6ff;
  color: #1d4ed8;
}

.status--live {
  background: #fee2e2;
  color: #b91c1c;
}

.status--finished {
  background: #ecfdf5;
  color: #047857;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.btn-sm {
  font-size: 12px;
  padding: 4px 10px;
}

.btn-outline {
  background: #fff;
  color: #1f2937;
}

.btn-outline:hover {
  background: #1f2937;
  color: #fff;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.pagination__btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.pagination__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pagination__btn:not(:disabled):hover {
  background: #f3f4f6;
}

.pagination__info {
  font-size: 14px;
  color: #4b5563;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filters__group,
  .filters__select {
    width: 100%;
  }

  .pagination {
    justify-content: center;
  }
}
</style>
