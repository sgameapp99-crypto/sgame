<template>
  <div class="soccer-game-card" @click="$emit('click')">
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
        <div class="team-name">{{ game.homeTeam }}</div>
        <div class="team-score" v-if="game.status !== 'scheduled'">{{ game.homeScore || 0 }}</div>
      </div>

      <div class="vs-section">
        <div class="vs-circle">VS</div>
        <div v-if="game.status === 'live'" class="live-indicator">
          <div class="live-dot"></div>
          <span>LIVE</span>
        </div>
      </div>

      <div class="team away-team">
        <div class="team-name">{{ game.awayTeam }}</div>
        <div class="team-score" v-if="game.status !== 'scheduled'">{{ game.awayScore || 0 }}</div>
      </div>
    </div>

    <!-- 足球特有的额外信息 -->
    <div v-if="game.status === 'live' && game.matchMinute" class="match-details">
      <div class="match-time">{{ game.matchMinute }}'</div>
    </div>

    <div v-if="game.venue" class="venue-info">
      <span class="venue-icon">📍</span>
      {{ game.venue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface SoccerGame {
  id: number;
  league: string;
  status: 'scheduled' | 'live' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time: string;
  matchMinute?: string;
  venue?: string;
}

interface Props {
  game: SoccerGame;
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
</script>

<style scoped>
.soccer-game-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.soccer-game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  border-color: #4CAF50;
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
  background: linear-gradient(135deg, #4CAF50, #45a049);
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
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.home-team {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.away-team {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05));
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.team-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.team-score {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 16px;
  position: relative;
}

.vs-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2196F3, #1976d2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
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

.match-details {
  text-align: center;
  margin-bottom: 8px;
}

.match-time {
  display: inline-block;
  background: #fff3e0;
  color: #f57c00;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
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
  .soccer-game-card {
    padding: 12px;
  }

  .teams-section {
    flex-direction: column;
    gap: 8px;
  }

  .vs-section {
    margin: 8px 0;
  }

  .team {
    width: 100%;
  }

  .team-name {
    font-size: 14px;
  }

  .team-score {
    font-size: 20px;
  }
}
</style>
