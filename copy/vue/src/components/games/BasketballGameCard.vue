<template>
  <div class="basketball-game-card" @click="$emit('click')">
    <!-- 比賽結果區域 (僅在比賽結束時顯示) -->
    <div v-if="game.status === 'finished'" class="game_result">
      <span class="teamname_highlight t_win">{{ getWinnerTeam(game) }}</span><br>
      <span v-if="game.bettingInfo" class="betting-info">{{ game.bettingInfo }}</span>
    </div>

    <!-- 比分區域 -->
    <div class="big-score-box">
      <!-- 客隊 (左側) -->
      <div class="big_score big-score-s02 big-score-guest" :class="{ 'winner': game.status === 'finished' && game.awayScore && game.homeScore && game.awayScore > game.homeScore }">
        <h6 class="team-name">{{ game.awayTeam }}</h6>
        <strong class="score" v-if="game.status !== 'scheduled'">{{ game.awayScore || 0 }}</strong>
        <div v-else class="vs-text">VS</div>
      </div>

      <!-- 比賽狀態信息 -->
      <ul class="game_state game-state-s02">
        <li class="state-live" v-if="game.status === 'live'">
          <span class="live-indicator">
            <div class="live-dot"></div>
            <span>LIVE</span>
          </span>
        </li>
        <li class="state-period">
          <span class="match-period">
            {{ getMatchPeriodText(game) }}
          </span>
        </li>
        <li class="state-time" v-if="game.status === 'live' && game.timeRemaining">
          <span class="time-remaining">{{ game.timeRemaining }}</span>
        </li>
        <li v-else-if="game.status === 'scheduled'" class="state-scheduled">
          <span class="game-time">{{ formatTime(game.time) }}</span>
        </li>
      </ul>

      <!-- 主隊 (右側) -->
      <div class="big_score big-score-s02 big-score-host" :class="{ 'winner': game.status === 'finished' && game.homeScore && game.awayScore && game.homeScore > game.awayScore }">
        <h6 class="team-name">{{ game.homeTeam }}</h6>
        <strong class="score" v-if="game.status !== 'scheduled'">{{ game.homeScore || 0 }}</strong>
        <div v-else class="vs-text">VS</div>
      </div>
    </div>

    <!-- 比賽前數據展示 -->
    <div v-if="game.status === 'scheduled'" class="pre-match-info">
      <div class="match-stats-grid">
        <div class="stat-item">
          <span class="stat-label">主場勝率</span>
          <span class="stat-value">{{ game.homeStats?.winRate || '68%' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">客場勝率</span>
          <span class="stat-value">{{ game.awayStats?.winRate || '62%' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">近5場</span>
          <span class="stat-value">{{ game.recentForm || '4勝1負' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">對戰勝率</span>
          <span class="stat-value">{{ game.headToHead || '55%' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">場均得分</span>
          <span class="stat-value">{{ game.avgPoints || '112.5' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">場均失分</span>
          <span class="stat-value">{{ game.avgPointsAllowed || '108.2' }}</span>
        </div>
      </div>
    </div>

    <!-- 詳細得分表 (僅在比賽結束或進行中顯示) -->
    <div v-if="game.status !== 'scheduled' && game.scoreBreakdown" class="score-breakdown">
      <table class="scorebox">
        <thead>
          <tr>
            <th class="team-header"></th>
            <th>總分</th>
            <th v-for="quarter in game.scoreBreakdown.quarters" :key="quarter.label">{{ quarter.label }}</th>
            <th v-if="game.scoreBreakdown.ot">OT</th>
            <th>加總</th>
            <th>分差</th>
          </tr>
        </thead>
        <tbody>
          <!-- 客隊得分 -->
          <tr class="away-team-row">
            <th class="team-name">{{ game.awayTeam }}</th>
            <td class="score-total">{{ game.awayScore || 0 }}</td>
            <td v-for="score in game.scoreBreakdown.awayScores" :key="score.quarter">{{ score.points }}</td>
            <td v-if="game.scoreBreakdown.ot" class="ot-score">{{ game.scoreBreakdown.awayOtScore || 0 }}</td>
            <td class="combined-total" :rowspan="game.scoreBreakdown.ot ? 2 : 2">{{ (game.awayScore || 0) + (game.homeScore || 0) }}</td>
            <td class="score-diff" :rowspan="game.scoreBreakdown.ot ? 2 : 2">
              <span v-if="game.awayScore && game.homeScore" :class="{ 'home-win': (game.homeScore > game.awayScore), 'away-win': (game.awayScore > game.homeScore) }">
                {{ game.homeScore > game.awayScore ? `主贏${game.homeScore - game.awayScore}` : `客贏${game.awayScore - game.homeScore}` }}
              </span>
            </td>
          </tr>
          <!-- 主隊得分 -->
          <tr class="home-team-row">
            <th class="team-name">{{ game.homeTeam }}</th>
            <td class="score-total">{{ game.homeScore || 0 }}</td>
            <td v-for="score in game.scoreBreakdown.homeScores" :key="score.quarter">{{ score.points }}</td>
            <td v-if="game.scoreBreakdown.ot" class="ot-score">{{ game.scoreBreakdown.homeOtScore || 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 數據統計 (僅在比賽結束時顯示) -->
    <div v-if="game.status === 'finished' && game.teamStats" class="livescore_data">
      <div class="data-toggle" @click="toggleStats = !toggleStats">
        <span class="data-title">數據</span>
        <strong :class="{ 'expanded': toggleStats }">▼</strong>
        <span :class="{ 'expanded': toggleStats }">▲</span>
      </div>

      <div v-show="toggleStats" class="stats-content">
        <table class="livescore_tb">
          <tbody>
            <tr class="header-row">
              <td class="date_r">{{ game.awayTeam }}</td>
              <td class="date_middle"></td>
              <td class="date_l">{{ game.homeTeam }}</td>
            </tr>

            <!-- 兩分球 -->
            <tr>
              <td class="date_r">
                <div class="stat-bar" :style="{ width: getStatPercentage(game.teamStats.away?.fieldGoalPct || 0) }">
                  <span class="stat-text">{{ game.teamStats.away?.fieldGoalPct || 0 }}%</span>
                  <span class="stat-detail">{{ game.teamStats.away?.fieldGoalsMade || 0 }}/{{ game.teamStats.away?.fieldGoalsAttempted || 0 }}</span>
                </div>
              </td>
              <td class="date_m">兩分球</td>
              <td class="date_l">
                <div class="stat-bar" :style="{ width: getStatPercentage(game.teamStats.home?.fieldGoalPct || 0) }">
                  <span class="stat-text">{{ game.teamStats.home?.fieldGoalPct || 0 }}%</span>
                  <span class="stat-detail">{{ game.teamStats.home?.fieldGoalsMade || 0 }}/{{ game.teamStats.home?.fieldGoalsAttempted || 0 }}</span>
                </div>
              </td>
            </tr>

            <!-- 三分球 -->
            <tr>
              <td class="date_r">
                <div class="stat-bar" :style="{ width: getStatPercentage(game.teamStats.away?.threePointPct || 0) }">
                  <span class="stat-text">{{ game.teamStats.away?.threePointPct || 0 }}%</span>
                  <span class="stat-detail">{{ game.teamStats.away?.threePointsMade || 0 }}/{{ game.teamStats.away?.threePointsAttempted || 0 }}</span>
                </div>
              </td>
              <td class="date_m">三分球</td>
              <td class="date_l">
                <div class="stat-bar" :style="{ width: getStatPercentage(game.teamStats.home?.threePointPct || 0) }">
                  <span class="stat-text">{{ game.teamStats.home?.threePointPct || 0 }}%</span>
                  <span class="stat-detail">{{ game.teamStats.home?.threePointsMade || 0 }}/{{ game.teamStats.home?.threePointsAttempted || 0 }}</span>
                </div>
              </td>
            </tr>

            <!-- 罰球 -->
            <tr>
              <td class="date_r">
                <div class="stat-bar" :style="{ width: getStatPercentage(game.teamStats.away?.freeThrowPct || 0) }">
                  <span class="stat-text">{{ game.teamStats.away?.freeThrowPct || 0 }}%</span>
                  <span class="stat-detail">{{ game.teamStats.away?.freeThrowsMade || 0 }}/{{ game.teamStats.away?.freeThrowsAttempted || 0 }}</span>
                </div>
              </td>
              <td class="date_m">罰球</td>
              <td class="date_l">
                <div class="stat-bar" :style="{ width: getStatPercentage(game.teamStats.home?.freeThrowPct || 0) }">
                  <span class="stat-text">{{ game.teamStats.home?.freeThrowPct || 0 }}%</span>
                  <span class="stat-detail">{{ game.teamStats.home?.freeThrowsMade || 0 }}/{{ game.teamStats.home?.freeThrowsAttempted || 0 }}</span>
                </div>
              </td>
            </tr>

            <!-- 籃板 -->
            <tr>
              <td class="date_r stat-number">{{ game.teamStats.away?.totalRebounds || 0 }}</td>
              <td class="date_m">籃板</td>
              <td class="date_l stat-number">{{ game.teamStats.home?.totalRebounds || 0 }}</td>
            </tr>

            <!-- 進攻籃板 -->
            <tr>
              <td class="date_r stat-number">{{ game.teamStats.away?.offensiveRebounds || 0 }}</td>
              <td class="date_m">進攻籃板</td>
              <td class="date_l stat-number">{{ game.teamStats.home?.offensiveRebounds || 0 }}</td>
            </tr>

            <!-- 失誤 -->
            <tr>
              <td class="date_r stat-number">{{ game.teamStats.away?.turnovers || 0 }}</td>
              <td class="date_m">失誤</td>
              <td class="date_l stat-number">{{ game.teamStats.home?.turnovers || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 球場信息 -->
    <div v-if="game.venue" class="venue-info">
      <span class="venue-icon">🏀</span>
      <span>{{ game.venue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ref } from 'vue';

// 籃球數據接口
interface TeamStats {
  winRate: string;
  recentForm?: string;
}

interface QuarterScore {
  quarter: number;
  points: number;
}

interface ScoreBreakdown {
  quarters: { label: string; quarter: number }[];
  awayScores: QuarterScore[];
  homeScores: QuarterScore[];
  ot?: boolean;
  awayOtScore?: number;
  homeOtScore?: number;
}

interface TeamGameStats {
  fieldGoalsMade?: number;
  fieldGoalsAttempted?: number;
  fieldGoalPct?: number;
  threePointsMade?: number;
  threePointsAttempted?: number;
  threePointPct?: number;
  freeThrowsMade?: number;
  freeThrowsAttempted?: number;
  freeThrowPct?: number;
  totalRebounds?: number;
  offensiveRebounds?: number;
  turnovers?: number;
}

interface BasketballTeamStats {
  away?: TeamGameStats;
  home?: TeamGameStats;
}

interface BasketballGame {
  id: number | string;
  league: string;
  status: 'scheduled' | 'live' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  time: string;
  timeRemaining?: string | null;
  currentQuarter?: number | null;
  venue?: string;
  bettingInfo?: string;
  winner?: string;

  // 比賽前數據
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  recentForm?: string;
  headToHead?: string;
  avgPoints?: string;
  avgPointsAllowed?: string;

  // 比賽中數據
  scoreBreakdown?: ScoreBreakdown | null;

  // 比賽結束數據
  teamStats?: BasketballTeamStats;
}

interface Props {
  game: BasketballGame;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  click: [];
}>();

// 響應式數據
const toggleStats = ref(false);

function formatTime(timeString: string) {
  if (!timeString) return '';
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getStatusText(status: string) {
  switch (status) {
    case 'scheduled': return '未開始';
    case 'live': return '進行中';
    case 'finished': return '已結束';
    default: return status;
  }
}

function getTeamInitials(teamName: string) {
  return teamName.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
}

function getWinnerTeam(game: BasketballGame) {
  if (game.status !== 'finished' || !game.awayScore || !game.homeScore) {
    return '';
  }
  return game.awayScore > game.homeScore ? game.awayTeam : game.homeTeam;
}

function getMatchPeriodText(game: BasketballGame) {
  if (game.status === 'finished') {
    return '比賽結束';
  }

  if (game.status === 'live') {
    if (game.currentQuarter) {
      const quarterLabels = ['第1節', '第2節', '第3節', '第4節'];
      if (game.currentQuarter <= 4) {
        return quarterLabels[game.currentQuarter - 1];
      } else {
        return `延長賽${game.currentQuarter - 4}`;
      }
    }
    return '進行中';
  }

  if (game.status === 'scheduled') {
    return '未開始';
  }

  return '';
}

function getStatPercentage(percentage: number) {
  // 將百分比轉換為寬度 (最大寬度為100%)
  return Math.min(percentage, 100) + '%';
}
</script>

<style scoped>
.basketball-game-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 390px;
  margin: 0 auto 12px auto;
}

.basketball-game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  border-color: #FF9800;
}

/* 比賽結果區域 */
.game_result {
  text-align: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.teamname_highlight {
  font-weight: bold;
  color: #2c3e50;
  font-size: 14px;
}

.t_win {
  color: #e74c3c !important;
}

.betting-info {
  display: block;
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

/* 比賽狀態和比分區域 */
.big-score-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  position: relative;
  gap: 12px;
}

.big_score {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  position: relative;
}

.big-score-guest {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05));
  border: 1px solid rgba(244, 67, 54, 0.2);
  border-radius: 8px 0 0 8px;
}

.big-score-host {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 0 8px 8px 0;
}

.big_score.winner {
  border-color: #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}

.team-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.score {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  display: block;
  line-height: 1;
}

.vs-text {
  font-size: 18px;
  font-weight: bold;
  color: #666;
  opacity: 0.7;
}

/* 比賽狀態信息 */
.game_state {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 120px;
}

.game_state li {
  text-align: center;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #ff5722;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: pulse 2s infinite;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: blink 1.5s infinite;
}

.match-period {
  font-weight: bold;
  color: #2c3e50;
  font-size: 14px;
}

.time-remaining {
  background: #fff3e0;
  color: #f57c00;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.game-time {
  color: #666;
  font-size: 12px;
  font-weight: 500;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 比賽前數據展示 */
.pre-match-info {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
  margin-top: 12px;
}

.match-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
}

/* 詳細得分表 */
.score-breakdown {
  margin-top: 12px;
}

.scorebox {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  margin-top: 8px;
}

.scorebox th,
.scorebox td {
  padding: 6px 4px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.scorebox th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.scorebox .team-name {
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
}

.scorebox .score-total {
  font-weight: bold;
  color: #2c3e50;
}

.scorebox .ot-score {
  background: #fff3e0;
  color: #f57c00;
}

.scorebox .combined-total {
  background: #e3f2fd;
  font-weight: bold;
}

.scorebox .score-diff {
  background: #f3e5f5;
  font-weight: bold;
}

.score-diff .home-win {
  color: #4CAF50;
}

.score-diff .away-win {
  color: #f44336;
}

/* 數據統計 */
.livescore_data {
  border-top: 1px solid #e0e0e0;
  margin-top: 12px;
  padding-top: 8px;
}

.data-toggle {
  text-align: center;
  cursor: pointer;
  padding: 6px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.data-toggle:hover {
  background: #e9ecef;
}

.data-title {
  font-size: 12px;
  color: #666;
  margin-right: 4px;
}

.data-toggle strong {
  font-size: 12px;
  color: #666;
  transition: all 0.2s ease;
}

.data-toggle span {
  font-size: 12px;
  color: #666;
  display: none;
  transition: all 0.2s ease;
}

.data-toggle .expanded {
  display: inline;
}

.stats-content {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.livescore_tb {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.livescore_tb tr {
  border-bottom: 1px solid #f0f0f0;
}

.livescore_tb td {
  padding: 8px 6px;
  vertical-align: middle;
}

.header-row td {
  background: #f8f9fa;
  font-weight: 600;
  text-align: center;
  color: #2c3e50;
}

.date_r,
.date_l {
  width: 35%;
  position: relative;
}

.date_m {
  width: 30%;
  text-align: center;
  font-weight: 600;
  color: #666;
  background: #f8f9fa;
}

.stat-bar {
  height: 20px;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 30px;
}

.stat-text {
  z-index: 2;
  position: relative;
}

.stat-detail {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 9px;
  opacity: 0.8;
}

.stat-number {
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
  font-size: 12px;
}

/* 調整客隊統計條的顏色 */
.date_r .stat-bar {
  background: linear-gradient(90deg, #f44336, #d32f2f);
}

/* 主隊統計條的顏色 */
.date_l .stat-bar {
  background: linear-gradient(90deg, #2196F3, #1976d2);
}

/* 球場信息 */
.venue-info {
  text-align: center;
  color: #666;
  font-size: 11px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .basketball-game-card {
    width: 100%;
    max-width: 390px;
    padding: 12px;
  }

  .big-score-box {
    flex-direction: column;
    gap: 8px;
  }

  .big_score {
    border-radius: 6px !important;
  }

  .game_state {
    min-width: auto;
    order: -1;
  }

  .big-score-guest {
    border-radius: 6px 6px 0 0 !important;
  }

  .big-score-host {
    border-radius: 0 0 6px 6px !important;
  }

  .scorebox {
    font-size: 10px;
  }

  .scorebox th,
  .scorebox td {
    padding: 4px 2px;
  }

  .livescore_tb {
    font-size: 10px;
  }

  .livescore_tb td {
    padding: 6px 4px;
  }

  .match-stats-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .stat-bar {
    height: 16px;
    font-size: 9px;
  }

  .stat-detail {
    font-size: 8px;
  }
}
</style>
