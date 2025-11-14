<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">預測購買</div>

    <div class="card mt-md">
      <div class="filters">
        <div class="filters__group">
          <label class="filters__label" for="alliance-select">聯盟篩選</label>
          <select
            id="alliance-select"
            class="filters__select"
            :value="selectedAllianceValue"
            @change="handleAllianceChange"
          >
            <option value="all">全部聯盟</option>
            <option v-for="option in allianceOptions" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </div>

        <div class="filters__group">
          <label class="filters__label" for="game-select">賽事篩選</label>
          <select
            id="game-select"
            class="filters__select"
            :value="selectedGameIdValue"
            :disabled="gameOptions.length === 0"
            @change="handleGameChange"
          >
            <option value="all">全部賽事</option>
            <option v-for="option in gameOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
        </div>

        <button
          class="filters__reset"
          type="button"
          :disabled="isDefaultFilter"
          @click="resetFilters"
        >
          重置篩選
        </button>

        <div v-if="session.loggedIn" class="filters__balance" aria-live="polite">
          目前榮譽點：<strong>{{ coinBalance }}</strong>
        </div>
      </div>
    </div>

    <div v-if="loading" class="mt-lg text-neutral-500">資料載入中…</div>
    <div v-else>
      <div v-if="errorMessage" class="alert alert--error mt-lg">{{ errorMessage }}</div>
      <div v-else>
        <div
          v-if="feedback"
          class="alert mt-lg"
          :class="feedback.type === 'success' ? 'alert--success' : 'alert--error'"
        >
          {{ feedback.text }}
        </div>

        <div v-if="filteredPredictions.length === 0" class="empty-state mt-xl">
          <h3 class="empty-state__title">目前沒有可購買的預測</h3>
          <p class="empty-state__description">可嘗試調整篩選條件或稍後再查看。</p>
          <button
            class="btn btn-outline mt-md"
            type="button"
            :disabled="isDefaultFilter"
            @click="resetFilters"
          >
            查看全部預測
          </button>
        </div>

        <div v-else>
          <div class="summary mt-lg">
            <span>共 {{ filteredPredictions.length }} 筆預測</span>
            <span v-if="pagination.total">｜資料總筆數 {{ pagination.total }}</span>
          </div>

          <div class="prediction-grid mt-md">
            <PredictionCard
              v-for="prediction in filteredPredictions"
              :key="prediction.id"
              :prediction="prediction"
              @purchase="handlePurchaseClick"
              @edit="handleEditAttempt"
            />
          </div>
        </div>
      </div>
    </div>

    <PurchaseDialog
      :visible="purchaseDialogVisible"
      :prediction="selectedPrediction"
      :current-balance="coinBalance"
      @close="purchaseDialogVisible = false"
      @success="handlePurchaseSuccess"
      @go-purchase="goToCoinPurchase"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PredictionCard from '../components/PredictionCard.vue';
import PurchaseDialog from '../components/PurchaseDialog.vue';
import { predictionsAPI, coinsAPI } from '../api';
import type { Prediction, PredictionsQueryParams } from '../types/prediction';
import type { CoinInfo } from '../types/coin';
import { useSessionStore } from '../stores/session';

type SelectChangeEvent = {
  target: {
    value: string;
  };
};

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

const loading = ref(true);
const errorMessage = ref('');
const predictions = ref<Prediction[]>([]);
const pagination = ref({ page: 1, size: 0, total: 0 });
const feedback = ref<{ type: 'success' | 'error'; text: string } | null>(null);

const selectedAlliance = ref<'all' | number>('all');
const selectedGameId = ref<'all' | string>('all');
const lastQueryKey = ref('');

const purchaseDialogVisible = ref(false);
const selectedPrediction = ref<Prediction | null>(null);
const coinBalance = ref(0);

const selectedAllianceValue = computed(() =>
  selectedAlliance.value === 'all' ? 'all' : String(selectedAlliance.value),
);
const selectedGameIdValue = computed(() =>
  selectedGameId.value === 'all' ? 'all' : selectedGameId.value,
);

const allianceOptions = computed(() => {
  const map = new Map<number, string>();
  predictions.value.forEach((prediction) => {
    const { allianceId, allianceName } = prediction.gameInfo;
    if (!map.has(allianceId)) {
      map.set(allianceId, allianceName);
    }
  });
  return Array.from(map.entries()).map(([id, name]) => ({ id: String(id), name }));
});

const gameOptions = computed(() => {
  const source =
    selectedAlliance.value === 'all'
      ? predictions.value
      : predictions.value.filter(
          (prediction) => prediction.gameInfo.allianceId === selectedAlliance.value,
        );

  const map = new Map<string, string>();
  source.forEach((prediction) => {
    const label = `${prediction.gameInfo.homeTeam} vs ${prediction.gameInfo.awayTeam}`;
    if (!map.has(prediction.gameId)) {
      map.set(prediction.gameId, label);
    }
  });
  return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
});

const filteredPredictions = computed(() => {
  return predictions.value.filter((prediction) => {
    if (
      selectedAlliance.value !== 'all' &&
      prediction.gameInfo.allianceId !== selectedAlliance.value
    ) {
      return false;
    }
    if (selectedGameId.value !== 'all' && prediction.gameId !== selectedGameId.value) {
      return false;
    }
    return true;
  });
});

const isDefaultFilter = computed(
  () => selectedAlliance.value === 'all' && selectedGameId.value === 'all',
);

function buildQueryObject(): Record<string, string> {
  const query: Record<string, string> = {};
  if (selectedAlliance.value !== 'all') {
    query.alliance = String(selectedAlliance.value);
  }
  if (selectedGameId.value !== 'all') {
    query.gameId = selectedGameId.value;
  }
  return query;
}

function getRouteKey(rawQuery = route.query): string {
  const normalized: Record<string, string> = {};
  const alliance = typeof rawQuery.alliance === 'string' ? rawQuery.alliance : undefined;
  const gameId = typeof rawQuery.gameId === 'string' ? rawQuery.gameId : undefined;
  if (alliance) normalized.alliance = alliance;
  if (gameId) normalized.gameId = gameId;
  return JSON.stringify(normalized);
}

function syncFiltersFromRoute(): void {
  const alliance =
    typeof route.query.alliance === 'string' ? Number(route.query.alliance) : undefined;
  selectedAlliance.value = alliance && !Number.isNaN(alliance) ? alliance : 'all';

  const gameId =
    typeof route.query.gameId === 'string' && route.query.gameId.trim()
      ? route.query.gameId
      : undefined;
  selectedGameId.value = gameId ?? 'all';
}

async function loadPredictions(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';

  const params: PredictionsQueryParams = {
    status: 'pending',
    page: 1,
    size: 50,
  };

  if (selectedAlliance.value !== 'all') {
    params.allianceId = selectedAlliance.value;
  }
  if (selectedGameId.value !== 'all') {
    params.gameId = selectedGameId.value;
  }

  try {
    const result = await predictionsAPI.getPredictions(params);
    if (result.success) {
      predictions.value = result.data || [];
      pagination.value = result.pagination || {
        page: 1,
        size: predictions.value.length,
        total: predictions.value.length,
      };
    } else {
      predictions.value = [];
      pagination.value = { page: 1, size: 0, total: 0 };
      errorMessage.value = '載入預測購買資料失敗';
    }
  } catch (error: unknown) {
    console.error('載入預測購買資料失敗', error);
    predictions.value = [];
    pagination.value = { page: 1, size: 0, total: 0 };
    errorMessage.value = '載入預測購買資料失敗，請稍後再試';
  } finally {
    loading.value = false;
  }
}

async function loadCoinBalance(): Promise<void> {
  if (!session.loggedIn) {
    coinBalance.value = 0;
    return;
  }

  try {
    const info: CoinInfo = await coinsAPI.getCoinInfo();
    if (typeof info.balance === 'number') {
      coinBalance.value = info.balance;
    }
  } catch (error) {
    // 靜默失敗
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
  selectedGameId.value = 'all';
  updateRouteQuery();
}

function handleGameChange(event: SelectChangeEvent): void {
  const value = event.target.value;
  selectedGameId.value = value === 'all' ? 'all' : value;
  updateRouteQuery();
}

function resetFilters(): void {
  selectedAlliance.value = 'all';
  selectedGameId.value = 'all';
  updateRouteQuery();
}

function handlePurchaseClick(prediction: Prediction): void {
  if (!session.loggedIn) {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }
  selectedPrediction.value = prediction;
  purchaseDialogVisible.value = true;
}

function handleEditAttempt(): void {
  showFeedback('error', '此功能僅供購買使用，無法在此編輯預測。');
}

function goToCoinPurchase(): void {
  router.push({ name: 'coins-purchase' });
}

function showFeedback(type: 'success' | 'error', text: string): void {
  feedback.value = { type, text };
  window.setTimeout(() => {
    if (feedback.value?.text === text) {
      feedback.value = null;
    }
  }, 3000);
}

function handlePurchaseSuccess(updatedPrediction: Prediction, remainingCoins: number): void {
  coinBalance.value = remainingCoins;
  purchaseDialogVisible.value = false;

  const index = predictions.value.findIndex((prediction) => prediction.id === updatedPrediction.id);
  if (index !== -1) {
    predictions.value[index] = {
      ...predictions.value[index],
      ...updatedPrediction,
      isPurchased: true,
    };
  }

  showFeedback('success', '購買成功！預測內容已解鎖。');
}

onMounted(async () => {
  syncFiltersFromRoute();
  lastQueryKey.value = getRouteKey();
  await loadPredictions();
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
    await loadPredictions();
  },
);

watch(
  () => session.loggedIn,
  (loggedIn) => {
    if (loggedIn) {
      loadCoinBalance();
    } else {
      coinBalance.value = 0;
    }
  },
  { immediate: true },
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
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  color: #1f2937;
}

.filters__select:disabled {
  background: #f3f4f6;
  color: #9ca3af;
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

.filters__balance {
  margin-left: auto;
  font-size: 14px;
  color: #111827;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.alert--success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #6ee7b7;
}

.alert--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.empty-state {
  text-align: center;
  padding: 40px;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
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
  display: flex;
  gap: 8px;
}

.prediction-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.btn-outline {
  background: #fff;
  color: #1f2937;
}

.btn-outline:hover {
  background: #1f2937;
  color: #fff;
}

@media (max-width: 640px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filters__group {
    width: 100%;
  }

  .filters__select {
    width: 100%;
  }

  .filters__balance {
    margin-left: 0;
  }
}
</style>
