<template>
  <div class="prediction-stats-badge">
    <button
      type="button"
      :class="triggerButtonClass"
      @click.stop="openDialog"
    >
      預測比例
    </button>

    <ElDialog
      v-model="visible"
      :title="dialogTitle"
      width="520px"
      append-to-body
      destroy-on-close
      class="prediction-stats-dialog"
    >
      <section class="dialog-content">
        <div v-if="loading" class="loading-state">
          <ElSkeleton :rows="4" animated />
        </div>

        <div v-else-if="errorMessage" class="error-state">
          <p>{{ errorMessage }}</p>
          <ElButton type="primary" size="small" @click="reload">
            重新載入
          </ElButton>
        </div>

        <template v-else-if="stats">
          <header class="stats-header">
            <span class="stats-total">共 {{ stats.totalPredictions }} 筆預測</span>
            <ElButton text size="small" :loading="refreshing" @click="reload">
              重新整理
            </ElButton>
          </header>

          <ElEmpty
            v-if="stats.totalPredictions === 0"
            description="目前還沒有預測資料"
            image-size="120"
          />

          <div v-else class="stats-type-grid">
            <article
              v-for="stat in typeEntries"
              :key="stat.type"
              class="type-card"
            >
              <header class="type-card__header">
                <h4>{{ stat.label }}</h4>
                <span class="type-card__total">共 {{ stat.total }} 筆</span>
              </header>

              <ul class="selection-list">
                <li
                  v-for="selection in stat.selections"
                  :key="selection.key"
                  class="selection-item"
                >
                  <div class="selection-item__label">
                    <span>{{ selection.label }}</span>
                    <span class="selection-item__percentage">{{ selection.percentage }}%</span>
                  </div>
                  <div class="selection-item__bar">
                    <div
                      class="selection-item__bar-fill"
                      :style="{ width: selection.percentage + '%' }"
                    />
                  </div>
                  <div class="selection-item__count">
                    {{ selection.count }} 筆
                  </div>
                </li>
              </ul>
            </article>
          </div>
        </template>
      </section>

      <template #footer>
        <ElButton @click="visible = false">關閉</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElButton, ElDialog, ElEmpty, ElSkeleton } from 'element-plus';
import { getGamePredictionStats } from '@/api/games';
import type { PredictionType, PredictionSelection, PredictionStats } from '@/types/prediction';
import {
  PREDICTION_SELECTION_LABELS,
  PREDICTION_TYPE_LABELS,
} from '@/types/prediction';

import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/dialog/style/css';
import 'element-plus/es/components/empty/style/css';
import 'element-plus/es/components/skeleton/style/css';

interface Props {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  unstyled?: boolean;
  triggerClass?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  unstyled: false,
  triggerClass: '',
});

const visible = ref(false);
const loading = ref(false);
const refreshing = ref(false);
const errorMessage = ref<string | null>(null);
const stats = ref<PredictionStats | null>(null);
const lastFetchedAt = ref<number | null>(null);

const dialogTitle = computed(() => `預測比例 - ${props.awayTeam} vs ${props.homeTeam}`);

interface SelectionViewModel {
  key: string;
  label: string;
  count: number;
  percentage: number;
}

interface TypeViewModel {
  type: string;
  label: string;
  total: number;
  selections: SelectionViewModel[];
}

const typeEntries = computed<TypeViewModel[]>(() => {
  if (!stats.value) {
    return [];
  }

  return Object.entries(stats.value.byType).map(([type, value]) => {
    const selections: SelectionViewModel[] = Object.entries(value.selections).map(
      ([selectionKey, selectionValue]) => ({
        key: selectionKey,
        label: resolveSelectionLabel(selectionKey),
        count: selectionValue.count,
        percentage: selectionValue.percentage,
      }),
    );

    return {
      type,
      label: resolveTypeLabel(type),
      total: value.total,
      selections: selections.sort((a, b) => b.percentage - a.percentage),
    };
  }).sort((a, b) => b.total - a.total);
});

const triggerButtonClass = computed(() => {
  const extras = Array.isArray(props.triggerClass)
    ? props.triggerClass
    : props.triggerClass
      ? [props.triggerClass]
      : [];
  return props.unstyled
    ? ['prediction-stats-trigger--unstyled', ...extras]
    : ['prediction-stats-trigger', ...extras];
});

function resolveTypeLabel(type: string): string {
  return PREDICTION_TYPE_LABELS[type as PredictionType] ?? type;
}

function resolveSelectionLabel(selection: string): string {
  return PREDICTION_SELECTION_LABELS[selection as PredictionSelection] ?? selection;
}

async function fetchStats(force = false) {
  if (loading.value || refreshing.value) {
    return;
  }

  const now = Date.now();
  if (!force && lastFetchedAt.value && now - lastFetchedAt.value < 30_000 && stats.value) {
    // 30 秒內避免重複請求
    return;
  }

  try {
    if (stats.value && !force) {
      refreshing.value = true;
    } else {
      loading.value = true;
    }
    errorMessage.value = null;

    stats.value = await getGamePredictionStats(props.gameId);
    lastFetchedAt.value = Date.now();
  } catch (error) {
    console.error('取得預測統計資料失敗', error);
    errorMessage.value = '無法取得預測統計，請稍候再試';
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}

function openDialog() {
  visible.value = true;
  fetchStats();
}

function reload() {
  fetchStats(true);
}
</script>

<style scoped>
.prediction-stats-badge {
  display: inline-block;
}

.prediction-stats-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #2563eb;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.prediction-stats-trigger:hover {
  background: #dbeafe;
  border-color: #1d4ed8;
}

.prediction-stats-trigger:active {
  transform: scale(0.98);
}

.prediction-stats-trigger--unstyled {
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.prediction-stats-trigger--unstyled:focus {
  outline: none;
}

.prediction-stats-dialog :deep(.el-dialog__body) {
  padding-top: 12px;
  padding-bottom: 12px;
}

.dialog-content {
  min-height: 160px;
}

.loading-state {
  padding: 12px 0;
}

.error-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  color: #dc2626;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.stats-total {
  font-weight: 600;
  color: #1f2937;
}

.stats-type-grid {
  display: grid;
  gap: 16px;
}

.type-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}

.type-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}

.type-card__header h4 {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.type-card__total {
  font-size: 13px;
  color: #6b7280;
}

.selection-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.selection-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selection-item__label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: #1f2937;
}

.selection-item__percentage {
  color: #2563eb;
}

.selection-item__bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.selection-item__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.3s ease;
}

.selection-item__count {
  font-size: 12px;
  color: #6b7280;
}

@media (min-width: 720px) {
  .stats-type-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>


