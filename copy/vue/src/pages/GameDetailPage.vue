<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">賽事詳情</div>

    <div v-if="loading" class="mt-lg text-neutral-500">資料載入中…</div>
    <div v-else-if="errorMessage" class="alert alert--error mt-lg">{{ errorMessage }}</div>
    <div v-else-if="!game" class="alert alert--error mt-lg">找不到對應的賽事資料。</div>
    <div v-else class="card mt-lg">
      <div class="game-header">
        <div>
          <div class="game-date">{{ formatDateDisplay(game.gameDate) }} · {{ game.gameTime }}</div>
          <div class="game-alliance">{{ game.allianceName }}</div>
        </div>
        <span :class="['status', `status--${game.status}`]">{{ statusLabel(game.status) }}</span>
      </div>

      <div class="scoreboard">
        <div class="team">
          <span class="team-label">客隊</span>
          <span class="team-name">{{ game.awayTeam.name }}</span>
          <span v-if="game.awayTeam.pitcher" class="team-sub"
            >先發：{{ game.awayTeam.pitcher }}</span
          >
        </div>
        <div class="score">
          <span v-if="game.finalScore" class="score-value">
            {{ game.finalScore.away }}<span class="divider">-</span>{{ game.finalScore.home }}
          </span>
          <span v-else class="score-upcoming">尚未開賽</span>
        </div>
        <div class="team">
          <span class="team-label">主隊</span>
          <span class="team-name">{{ game.homeTeam.name }}</span>
          <span v-if="game.homeTeam.pitcher" class="team-sub"
            >先發：{{ game.homeTeam.pitcher }}</span
          >
        </div>
      </div>

      <div class="actions">
        <RouterLink class="btn btn-outline" :to="{ name: 'games-list', query: buildBackQuery() }">
          ← 返回賽事列表
        </RouterLink>
        <RouterLink
          class="btn btn-primary"
          :to="{ name: 'predict-buy', query: { gameId: game.gameId } }"
        >
          前往購買預測
        </RouterLink>
      </div>

      <div class="odds-grid">
        <section class="odds-card">
          <h3 class="odds-title">國際盤</h3>
          <table class="odds-table">
            <thead>
              <tr>
                <th>玩法</th>
                <th>主隊</th>
                <th>客隊</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>讓分</td>
                <td>
                  {{ internationalOdds?.spread?.home?.line ?? '-' }} /
                  {{ internationalOdds?.spread?.home?.odds ?? '-' }}
                </td>
                <td>
                  {{ internationalOdds?.spread?.away?.line ?? '-' }} /
                  {{ internationalOdds?.spread?.away?.odds ?? '-' }}
                </td>
              </tr>
              <tr>
                <td>大小</td>
                <td>
                  {{ internationalOdds?.total?.over?.line ?? '-' }} 大 /
                  {{ internationalOdds?.total?.over?.odds ?? '-' }}
                </td>
                <td>
                  {{ internationalOdds?.total?.under?.line ?? '-' }} 小 /
                  {{ internationalOdds?.total?.under?.odds ?? '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="odds-card">
          <h3 class="odds-title">運彩盤</h3>
          <table class="odds-table">
            <thead>
              <tr>
                <th>玩法</th>
                <th>主隊</th>
                <th>客隊</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>讓分</td>
                <td>
                  {{ taiwanOdds?.spread?.home?.line ?? '-' }} /
                  {{ taiwanOdds?.spread?.home?.odds ?? '-' }}
                </td>
                <td>
                  {{ taiwanOdds?.spread?.away?.line ?? '-' }} /
                  {{ taiwanOdds?.spread?.away?.odds ?? '-' }}
                </td>
              </tr>
              <tr>
                <td>不讓分</td>
                <td>{{ taiwanOdds?.moneyline?.home?.odds ?? '-' }}</td>
                <td>{{ taiwanOdds?.moneyline?.away?.odds ?? '-' }}</td>
              </tr>
              <tr>
                <td>大小</td>
                <td>
                  {{ taiwanOdds?.total?.over?.line ?? '-' }} 大 /
                  {{ taiwanOdds?.total?.over?.odds ?? '-' }}
                </td>
                <td>
                  {{ taiwanOdds?.total?.under?.line ?? '-' }} 小 /
                  {{ taiwanOdds?.total?.under?.odds ?? '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { gamesAPI } from '../api';
import type { Game, GameStatus } from '../types/game';

const route = useRoute();

const loading = ref(true);
const errorMessage = ref('');
const game = ref<Game | null>(null);

const currentGameId = computed(() =>
  typeof route.params.id === 'string' ? route.params.id : undefined,
);
const internationalOdds = computed(() => game.value?.internationalOdds);
const taiwanOdds = computed(() => game.value?.taiwanOdds);

function formatDateDisplay(date: string): string {
  try {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
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

function buildBackQuery(): Record<string, string> {
  const query: Record<string, string> = {};
  const alliance = typeof route.query.alliance === 'string' ? route.query.alliance : undefined;
  const status = typeof route.query.status === 'string' ? route.query.status : undefined;
  const date = typeof route.query.date === 'string' ? route.query.date : undefined;
  const page = typeof route.query.page === 'string' ? route.query.page : undefined;

  if (alliance) query.alliance = alliance;
  if (status) query.status = status;
  if (date) query.date = date;
  if (page) query.page = page;

  return query;
}

async function loadGame(): Promise<void> {
  const id = currentGameId.value;
  if (!id) {
    errorMessage.value = '缺少賽事編號';
    loading.value = false;
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await gamesAPI.getGame(id);
    if (response.success && response.data) {
      game.value = response.data;
    } else {
      game.value = null;
      errorMessage.value = '未找到賽事資料';
    }
  } catch (error: unknown) {
    console.error('載入賽事詳情失敗', error);
    game.value = null;
    const apiError = error as { response?: { data?: { message?: string } } };
    errorMessage.value = apiError.response?.data?.message || '載入賽事詳情失敗，請稍後再試';
  } finally {
    loading.value = false;
  }
}

onMounted(loadGame);

watch(
  () => route.params.id,
  () => {
    loadGame();
  },
);
</script>

<style scoped>
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

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.game-date {
  font-size: 14px;
  color: #6b7280;
}

.game-alliance {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
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

.scoreboard {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: center;
}

.team {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.team-label {
  font-size: 12px;
  text-transform: uppercase;
  color: #9ca3af;
}

.team-name {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
}

.team-sub {
  font-size: 13px;
  color: #6b7280;
}

.score {
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-value {
  font-size: 40px;
  font-weight: 700;
  color: #111827;
}

.divider {
  margin: 0 12px;
  font-size: 28px;
  color: #9ca3af;
}

.score-upcoming {
  font-size: 16px;
  color: #6b7280;
}

.actions {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.btn-outline {
  border-color: #d1d5db;
  background: #fff;
  color: #1f2937;
}

.btn-outline:hover {
  background: #1f2937;
  color: #fff;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.odds-grid {
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.odds-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
}

.odds-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}

.odds-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.odds-table th,
.odds-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
  text-align: left;
}

.odds-table tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .scoreboard {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .score {
    order: -1;
  }

  .team {
    align-items: center;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
