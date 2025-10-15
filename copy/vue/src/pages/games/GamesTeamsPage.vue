<template>
  <div class="container mx-auto px-lg py-xl">
      <div class="heading-2">球隊資訊</div>

      <!-- 聯盟選擇 -->
      <AllianceMenu
        :selected-alliance="selectedAlliance"
        :selected-soccer-league="null"
        :selected-status-type="'live'"
        :baseball-expanded="baseballExpanded"
        :basketball-expanded="basketballExpanded"
        :other-expanded="otherExpanded"
        :soccer-leagues-expanded="false"
        :show-time-selector="false"
        @select-alliance="selectAlliance"
        @toggle-baseball-expanded="toggleBaseballExpanded"
        @toggle-basketball-expanded="toggleBasketballExpanded"
        @toggle-other-expanded="toggleOtherExpanded"
      />

      <!-- 球隊列表 -->
      <div v-if="loading" class="text-center py-xl">載入中...</div>
      <div v-else-if="errorMessage" class="text-red-600 text-center py-xl">{{ errorMessage }}</div>
      <div v-else class="teams-grid">
        <div
          v-for="team in teams"
          :key="team.id"
          class="team-card"
          @click="viewTeamDetail(team.id)"
        >
          <div class="team-info">
            <h3 class="team-name">{{ team.name }}</h3>
            <div class="team-short">{{ team.short_name }}</div>
            <div class="team-stats">
              <div class="stat">
                <span class="label">勝率</span>
                <span class="value">{{ (team.stats.win_rate * 100).toFixed(1) }}%</span>
              </div>
              <div class="stat">
                <span class="label">勝敗</span>
                <span class="value">{{ team.stats.wins }}-{{ team.stats.losses }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 球隊詳細資訊 Modal -->
      <div v-if="selectedTeam" class="modal-overlay" @click="closeTeamDetail">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ selectedTeam.name }}</h2>
            <button class="close-btn" @click="closeTeamDetail">&times;</button>
          </div>
          <div class="modal-body">
            <div class="team-detail-grid">
              <div class="detail-section">
                <h3>基本資訊</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">全名</span>
                    <span class="value">{{ selectedTeam.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">簡稱</span>
                    <span class="value">{{ selectedTeam.short_name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">城市</span>
                    <span class="value">{{ selectedTeam.city }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">主場</span>
                    <span class="value">{{ selectedTeam.stadium }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">成立年份</span>
                    <span class="value">{{ selectedTeam.founded }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h3>賽季統計</h3>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value">{{ selectedTeam.stats.wins }}</div>
                    <div class="stat-label">勝場</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ selectedTeam.stats.losses }}</div>
                    <div class="stat-label">敗場</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ (selectedTeam.stats.win_rate * 100).toFixed(1) }}%</div>
                    <div class="stat-label">勝率</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ selectedTeam.stats.games_behind }}</div>
                    <div class="stat-label">勝差</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { gamesApi, type Team } from '../../services/gamesApi';
import AllianceMenu from '../../components/AllianceMenu.vue';

// 響應式數據
const selectedAlliance = ref(1);
const baseballExpanded = ref(false);
const basketballExpanded = ref(false);
const otherExpanded = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const teams = ref<Team[]>([]);
const selectedTeam = ref<Team | null>(null);

// 方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  loadTeams(allianceId);
}

function toggleBaseballExpanded() {
  baseballExpanded.value = !baseballExpanded.value;
}

function toggleBasketballExpanded() {
  basketballExpanded.value = !basketballExpanded.value;
}

function toggleOtherExpanded() {
  otherExpanded.value = !otherExpanded.value;
}

async function viewTeamDetail(teamId: number) {
  try {
    const team = await gamesApi.getTeamDetail(teamId);
    selectedTeam.value = team;
  } catch (error) {
    console.error('Failed to load team detail:', error);
  }
}

function closeTeamDetail() {
  selectedTeam.value = null;
}

async function loadTeams(allianceId: number) {
  loading.value = true;
  errorMessage.value = '';

  try {
    const teamList = await gamesApi.getTeams(allianceId);
    teams.value = teamList;
  } catch (error) {
    errorMessage.value = '載入球隊資料失敗';
    console.error('Failed to load teams:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadTeams(selectedAlliance.value);
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

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.team-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.team-logo {
  text-align: center;
  margin-bottom: 1rem;
}

.team-logo img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.team-info {
  text-align: center;
}

.team-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.team-short {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.team-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.stat {
  text-align: center;
}

.stat .label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat .value {
  display: block;
  font-size: 1.1rem;
  font-weight: bold;
  color: #3498db;
}

/* Modal 樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1.5rem;
}

.team-detail-grid {
  display: grid;
  gap: 2rem;
}

.detail-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.info-grid {
  display: grid;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item .label {
  font-weight: 500;
  color: #666;
}

.info-item .value {
  font-weight: 500;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .tag-league-boxall {
    flex-direction: column;
  }

  .teams-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .team-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .team-detail-grid {
    gap: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
