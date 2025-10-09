<template>
  <div class="game-card border border-neutral-200 rounded-lg p-lg hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click')">
    <div class="flex justify-between items-center mb-sm">
      <span class="badge bg-blue-100 text-blue-800 px-sm py-xs rounded">{{ game.alliance_name }}</span>
      <span class="game-time text-sm text-neutral-500">{{ formatFullTime(game.scheduled_time) }}</span>
    </div>
    <div class="text-center">
      <div class="flex items-center justify-center mb-sm game-teams-line">
        <div class="team-container away-team-container">
          <strong class="team-name away-team">{{ game.away_team.name }}</strong>
        </div>
        <div class="time-vs-container">
          <span class="game-time-display">{{ formatTime(game.scheduled_time) }}</span>
          <span class="vs-separator">{{ separator || 'VS' }}</span>
        </div>
        <div class="team-container home-team-container">
          <strong class="team-name home-team">{{ game.home_team.name }}</strong>
        </div>
      </div>
      <div v-if="showVenue && game.venue" class="text-sm text-neutral-600 venue-info">{{ game.venue }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Game } from '../services/gamesApi';

interface Props {
  game: Game;
  separator?: string;
  showVenue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  separator: 'VS',
  showVenue: true
});

const emit = defineEmits<{
  click: [];
}>();

function formatTime(timeString: string) {
  if (!timeString) return '';
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${ampm}${displayHours}:${minutes}`;
}

function formatFullTime(timeString: string) {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.game-card {
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: white;
  cursor: pointer;
}

.game-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #3498db;
}

.badge {
  font-size: 0.75rem;
  font-weight: 500;
  background: #3498db;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.game-time {
  color: #666;
  font-size: 0.875rem;
}

.game-teams-line {
  gap: 0.25rem;
  flex-wrap: wrap;
  position: relative;
}

.team-container {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.8);
  min-width: 80px;
  text-align: center;
  position: relative;
}

.away-team-container {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.05));
  border-color: rgba(231, 76, 60, 0.2);
}

.home-team-container {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(52, 152, 219, 0.05));
  border-color: rgba(52, 152, 219, 0.2);
}

.time-vs-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.5rem;
  position: relative;
  z-index: 1;
}

.game-time-display {
  color: #666;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  background: white;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  border: 1px solid #e0e0e0;
}

.vs-separator {
  color: #666;
  font-weight: bold;
  font-size: 0.875rem;
  background: white;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.venue-info {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.team-name {
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
  display: block;
}

/* 參考原站樣式 */
.away-team {
  color: #e74c3c; /* 客隊用紅色 */
}

.home-team {
  color: #3498db; /* 主隊用藍色 */
}

/* 響應式設計 */
@media (max-width: 768px) {
  .game-card {
    padding: 0.75rem;
  }

  .game-teams-line {
    flex-direction: column;
    gap: 0.5rem;
  }

  .team-container {
    min-width: 120px;
  }

  .time-vs-container {
    padding: 0.25rem 0;
  }

  .game-time-display {
    margin-bottom: 0.125rem;
  }
}
</style>
