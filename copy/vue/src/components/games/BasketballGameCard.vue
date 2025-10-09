<template>
  <div class="basketball-game-card" @click="$emit('click')">
    <div class="game-header">
      <div class="league-info">
        <span class="league-badge">{{ game.league }}</span>
        <span class="game-time">{{ formatTime(game.time) }}</span>
      </div>
      <div class="game-status" :class="game.status">
        {{ getStatusText(game.status) }}
      </div>
    </div>

    <div class="teams-section">
      <div class="team home-team">
        <div class="team-logo">
          <span class="logo-placeholder">{{ getTeamInitials(game.homeTeam) }}</span>
        </div>
        <div class="team-info">
          <div class="team-name">{{ game.homeTeam }}</div>
          <div class="team-score" v-if="game.status !== 'scheduled'">{{ game.homeScore || 0 }}</div>
        </div>
      </div>

      <div class="center-section">
        <div class="vs-circle">VS</div>
        <div v-if="game.status === 'live'" class="live-indicator">
          <div class="live-dot"></div>
          <span>LIVE</span>
        </div>
        <div v-if="game.period" class="period-info">
          {{ game.period }}
        </div>
      </div>

      <div class="team away-team">
        <div class="team-logo">
          <span class="logo-placeholder">{{ getTeamInitials(game.awayTeam) }}</span>
        </div>
        <div class="team-info">
          <div class="team-name">{{ game.awayTeam }}</div>
          <div class="team-score" v-if="game.status !== 'scheduled'">{{ game.awayScore || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- 篮球特有的统计信息 -->
    <div v-if="game.status === 'live' && game.stats" class="game-stats">
      <div class="stat-item">
        <span class="stat-label">時間</span>
        <span class="stat-value">{{ game.stats.timeRemaining || '00:00' }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">節數</span>
        <span class="stat-value">{{ game.stats.quarter || 1 }}</span>
      </div>
    </div>

    <div v-if="game.venue" class="venue-info">
      <span class="venue-icon">🏀</span>
      {{ game.venue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface BasketballStats {
  timeRemaining: string;
  quarter: number;
}

interface BasketballGame {
  id: number;
  league: string;
  status: 'scheduled' | 'live' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time: string;
  period?: string;
  venue?: string;
  stats?: BasketballStats;
}

interface Props {
  game: BasketballGame;
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
</script>

<style scoped>
.basketball-game-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.basketball-game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  border-color: #FF9800;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.league-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.league-badge {
  background: linear-gradient(135deg, #FF9800, #F57C00);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.game-time {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.game-status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.game-status.scheduled {
  background: #e3f2fd;
  color: #1976d2;
}

.game-status.live {
  background: #fff3e0;
  color: #f57c00;
  animation: pulse 2s infinite;
}

.game-status.finished {
  background: #f3e5f5;
  color: #7b1fa2;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.teams-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.team {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex: 1;
}

.home-team {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05));
  border: 1px solid rgba(255, 152, 0, 0.2);
}

.away-team {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05));
  border: 1px solid rgba(156, 39, 176, 0.2);
}

.team-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.logo-placeholder {
  font-size: 12px;
  letter-spacing: 1px;
}

.team-info {
  text-align: left;
  flex: 1;
}

.team-name {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.team-score {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.center-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 16px;
  position: relative;
  min-width: 80px;
}

.vs-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9800, #F57C00);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  margin-bottom: 8px;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ff5722;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.period-info {
  background: #fff3e0;
  color: #f57c00;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 6px;
  min-width: 60px;
}

.stat-label {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
}

.venue-info {
  text-align: center;
  color: #666;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.venue-icon {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .basketball-game-card {
    padding: 12px;
  }

  .teams-section {
    flex-direction: column;
    gap: 8px;
  }

  .center-section {
    margin: 8px 0;
  }

  .team {
    width: 100%;
    justify-content: center;
  }

  .team-info {
    text-align: center;
  }

  .game-stats {
    flex-direction: column;
    gap: 8px;
  }

  .stat-item {
    width: 100%;
  }
}
</style>
