<template>
  <div class="container mx-auto px-lg py-xl">
      <div class="heading-2">戰績排名</div>

      <!-- 聯盟選擇 -->
      <div class="alliance-menu mb-lg">
        <div class="tagsection">
          <div class="tag-league-boxall">
            <!-- 棒球聯盟 -->
            <div class="tag-league-box tag-box">
              <div class="tag-box-first">
                <ol class="tag-league">
                  <li class="fold-head"></li>
                  <li>棒球</li>
                  <li class="fold-footer"></li>
                </ol>
              </div>
              <div class="tag-box-last">
                <ol class="tag-con">
                  <li :class="{ 'tag-chosen': selectedAlliance === 1 }">
                    <a href="#" @click.prevent="selectAlliance(1)">MLB</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 2 }">
                    <a href="#" @click.prevent="selectAlliance(2)">日棒</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 6 }">
                    <a href="#" @click.prevent="selectAlliance(6)">中職</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 9 }">
                    <a href="#" @click.prevent="selectAlliance(9)">韓棒</a>
                  </li>
                </ol>
              </div>
            </div>

            <!-- 籃球聯盟 -->
            <div class="tag-league-box tag-box">
              <div class="tag-box-first">
                <ol class="tag-league">
                  <li class="fold-head"></li>
                  <li>籃球</li>
                  <li class="fold-footer"></li>
                </ol>
              </div>
              <div class="tag-box-last">
                <ol class="tag-con">
                  <li :class="{ 'tag-chosen': selectedAlliance === 3 }">
                    <a href="#" @click.prevent="selectAlliance(3)">NBA</a>
                  </li>
                  <li :class="{ 'tag-chosen': selectedAlliance === 97 }">
                    <a href="#" @click.prevent="selectAlliance(97)">日籃</a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 排名表格 -->
      <div v-if="loading" class="text-center py-xl">載入中...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center py-xl">{{ errorMessage }}</div>
      <div v-else>
        <div v-for="division in standings" :key="division.name" class="division-section mb-xl">
          <h3 class="division-title">{{ division.name }}</h3>
          <div class="standings-table">
            <div class="table-header">
              <div class="rank-col">排名</div>
              <div class="team-col">球隊</div>
              <div class="wins-col">勝</div>
              <div class="losses-col">敗</div>
              <div class="pct-col">勝率</div>
              <div class="gb-col">勝差</div>
              <div class="streak-col">連勝</div>
            </div>
            <div
              v-for="team in division.teams"
              :key="team.team.id"
              class="table-row"
              :class="{ 'leading-team': team.rank === 1 }"
            >
              <div class="rank-col">{{ team.rank }}</div>
              <div class="team-col">
                <div class="team-info">
                  <img :src="team.team.logo || '/images/default-team.png'" :alt="team.team.name" class="team-logo-small">
                  <div>
                    <div class="team-name">{{ team.team.name }}</div>
                    <div class="team-short">{{ team.team.short_name }}</div>
                  </div>
                </div>
              </div>
              <div class="wins-col">{{ team.wins }}</div>
              <div class="losses-col">{{ team.losses }}</div>
              <div class="pct-col">{{ (team.win_rate * 100).toFixed(3) }}</div>
              <div class="gb-col">{{ team.games_behind === 0 ? '-' : team.games_behind }}</div>
              <div class="streak-col" :class="getStreakClass(team.streak)">
                {{ formatStreak(team.streak) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 外卡排名 -->
        <div v-if="wildcards && wildcards.length > 0" class="division-section mb-xl">
          <h3 class="division-title">外卡排名</h3>
          <div class="standings-table">
            <div class="table-header">
              <div class="rank-col">排名</div>
              <div class="team-col">球隊</div>
              <div class="wins-col">勝</div>
              <div class="losses-col">敗</div>
              <div class="pct-col">勝率</div>
              <div class="gb-col">勝差</div>
              <div class="streak-col">連勝</div>
            </div>
            <div
              v-for="team in wildcards"
              :key="team.team.id"
              class="table-row"
            >
              <div class="rank-col">{{ team.rank }}</div>
              <div class="team-col">
                <div class="team-info">
                  <img :src="team.team.logo || '/images/default-team.png'" :alt="team.team.name" class="team-logo-small">
                  <div>
                    <div class="team-name">{{ team.team.name }}</div>
                    <div class="team-short">{{ team.team.short_name }}</div>
                  </div>
                </div>
              </div>
              <div class="wins-col">{{ team.wins }}</div>
              <div class="losses-col">{{ team.losses }}</div>
              <div class="pct-col">{{ (team.win_rate * 100).toFixed(3) }}</div>
              <div class="gb-col">{{ team.games_behind === 0 ? '-' : team.games_behind }}</div>
              <div class="streak-col" :class="getStreakClass(team.streak)">
                {{ formatStreak(team.streak) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 更新時間 -->
        <div class="update-info text-center text-neutral-600">
          <p>最後更新時間：{{ formatUpdateTime(updatedAt) }}</p>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { gamesApi, type StandingDivision, type StandingTeam } from '../services/gamesApi';

// 響應式數據
const selectedAlliance = ref(1);
const loading = ref(false);
const errorMessage = ref('');
const standings = ref<StandingDivision[]>([]);
const wildcards = ref<StandingTeam[]>([]);
const updatedAt = ref('');

// 方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  loadStandings(allianceId);
}

function getStreakClass(streak: string): string {
  if (streak.startsWith('W')) return 'winning';
  if (streak.startsWith('L')) return 'losing';
  return '';
}

function formatStreak(streak: string): string {
  if (streak.startsWith('W')) return `連勝 ${streak.substring(1)}`;
  if (streak.startsWith('L')) return `連敗 ${streak.substring(1)}`;
  return streak;
}

function formatUpdateTime(timeString: string): string {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function loadStandings(allianceId: number) {
  loading.value = true;
  errorMessage.value = '';

  try {
    const data = await gamesApi.getStandings(allianceId);
    standings.value = data.divisions;
    wildcards.value = data.wildcards;
    updatedAt.value = data.updated_at;
  } catch (error) {
    errorMessage.value = '載入排名資料失敗';
    console.error('Failed to load standings:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadStandings(selectedAlliance.value);
});
</script>

<style scoped>
.alliance-menu {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.tagsection {
  background: #f8f9fa;
}

.tag-league-boxall {
  display: flex;
  gap: 20px;
  padding: 20px;
  flex-wrap: wrap;
}

.tag-league-box {
  min-width: 200px;
}

.tag-box {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.tag-box-first {
  background: #1e3c72;
  color: white;
  text-align: center;
  padding: 8px 0;
}

.tag-league {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tag-league li {
  display: inline-block;
  vertical-align: middle;
}

.fold-head, .fold-footer {
  width: 10px;
  height: 10px;
  border: 1px solid white;
  margin: 0 5px;
}

.tag-box-last {
  padding: 12px;
}

.tag-con {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-con li {
  padding: 6px 12px;
  border-radius: 4px;
  background: white;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-con li:hover {
  background: #f0f0f0;
}

.tag-con li a {
  color: inherit;
  text-decoration: none;
}

.tag-chosen {
  background: #ffde00 !important;
  border-color: #ffc400 !important;
}

.division-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.division-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.standings-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 2fr repeat(5, 1fr);
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: bold;
  color: #495057;
}

.table-header > div {
  padding: 1rem 0.5rem;
  text-align: center;
  border-right: 1px solid #dee2e6;
}

.table-header > div:last-child {
  border-right: none;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 2fr repeat(5, 1fr);
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row.leading-team {
  background: linear-gradient(135deg, #fff8e1 0%, #fff 100%);
}

.table-row > div {
  padding: 1rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e0e0e0;
}

.table-row > div:last-child {
  border-right: none;
}

.rank-col {
  font-weight: bold;
  color: #495057;
}

.team-col {
  justify-content: flex-start;
  padding-left: 1rem;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.team-logo-small {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.team-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.125rem;
}

.team-short {
  font-size: 0.75rem;
  color: #666;
}

.wins-col, .losses-col, .pct-col, .gb-col {
  font-weight: 500;
}

.streak-col {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.streak-col.winning {
  background: #d4edda;
  color: #155724;
}

.streak-col.losing {
  background: #f8d7da;
  color: #721c24;
}

.update-info {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

@media (max-width: 1024px) {
  .table-header,
  .table-row {
    grid-template-columns: 50px 2fr repeat(4, 1fr) 80px;
  }

  .table-header > div:nth-child(5),
  .table-row > div:nth-child(5) {
    display: none;
  }
}

@media (max-width: 768px) {
  .tag-league-boxall {
    flex-direction: column;
  }

  .standings-table {
    font-size: 0.9rem;
  }

  .table-header,
  .table-row {
    grid-template-columns: 40px 2fr repeat(2, 1fr) 80px;
  }

  .table-header > div:nth-child(3),
  .table-header > div:nth-child(4),
  .table-header > div:nth-child(6),
  .table-row > div:nth-child(3),
  .table-row > div:nth-child(4),
  .table-row > div:nth-child(6) {
    display: none;
  }

  .team-info {
    flex-direction: column;
    text-align: center;
    gap: 0.25rem;
  }

  .team-logo-small {
    width: 24px;
    height: 24px;
  }
}
</style>
