<template>
  <div class="ice-hockey-game-card" @click="$emit('click')">
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
          <span class="live-indicator" v-if="game.isPaused">
            <div class="live-dot"></div>
            <span>暫停</span>
          </span>
          <span class="live-indicator" v-else>
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
          <span class="stat-value">{{ game.homeStats?.winRate || '65%' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">客場勝率</span>
          <span class="stat-value">{{ game.awayStats?.winRate || '58%' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">近5場</span>
          <span class="stat-value">{{ game.recentForm || '3勝2負' }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">對戰</span>
          <span class="stat-value">{{ game.headToHead || '55%' }}</span>
        </div>
      </div>
    </div>

    <!-- 詳細得分表 -->
    <div v-if="game.scoreBreakdown" class="st">
      <table class="scorebox">
        <tbody>
          <tr>
            <td class="h" style="text-align:left;font-weight:normal;"></td>
            <td width="30" class="h">總分</td>
            <td v-for="period in game.scoreBreakdown.periods" :key="period.period" width="30" class="h">{{ period.label }}</td>
          </tr>
          <tr>
            <th class="team-name">{{ game.awayTeam }}</th>
            <td class="s">{{ game.scoreBreakdown.awayTotal }}</td>
            <td v-for="score in game.scoreBreakdown.awayScores" :key="score.period" width="30">
              {{ score.awayScore }}
            </td>
          </tr>
          <tr>
            <th class="team-name">{{ game.homeTeam }}</th>
            <td class="s">{{ game.scoreBreakdown.homeTotal }}</td>
            <td v-for="score in game.scoreBreakdown.homeScores" :key="score.period" width="30">
              {{ score.homeScore }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 比賽信息 -->
    <div v-if="game.venue" class="venue-info">
      <span class="venue-icon">🏒</span>
      <span>{{ game.venue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { IceHockeyGame } from '../../data/types';

interface Props {
  game: IceHockeyGame;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [];
}>();

function formatTime(timeString: string) {
  if (!timeString) return '';
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getWinnerTeam(game: IceHockeyGame) {
  if (game.status !== 'finished' || !game.awayScore || !game.homeScore) {
    return '';
  }
  return game.awayScore > game.homeScore ? game.awayTeam : game.homeTeam;
}

function getMatchPeriodText(game: IceHockeyGame) {
  if (game.status === 'finished') {
    return '比賽結束';
  }

  if (game.status === 'live') {
    if (game.currentPeriod) {
      const periodLabels = ['第1節', '第2節', '第3節'];
      if (game.currentPeriod <= 3) {
        return periodLabels[game.currentPeriod - 1];
      } else if (game.currentPeriod === 4) {
        return '延長賽';
      } else {
        return '點球大戰';
      }
    }
    return '進行中';
  }

  if (game.status === 'scheduled') {
    return '未開始';
  }

  return '';
}
</script>

<style scoped>
.ice-hockey-game-card {
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

.ice-hockey-game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  border-color: #2196f3;
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
  border-radius: 6px;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

/* 得分表 */
.st {
  margin-top: 12px;
}

.scorebox {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin: 0 auto;
}

.scorebox th,
.scorebox td {
  padding: 6px 4px;
  text-align: center;
  border: 1px solid #ddd;
}

.scorebox .h {
  background: #f5f5f5;
  font-weight: bold;
  font-size: 11px;
}

.scorebox .s {
  font-weight: bold;
  font-size: 14px;
  color: #2c3e50;
}

.scorebox th.team-name {
  text-align: left;
  font-weight: normal;
  padding-left: 8px;
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

.venue-icon {
  margin-right: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ice-hockey-game-card {
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

  .match-stats-grid {
    grid-template-columns: 1fr;
  }

  .scorebox th,
  .scorebox td {
    padding: 4px 2px;
    font-size: 11px;
  }
}
</style>
