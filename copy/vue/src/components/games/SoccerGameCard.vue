<template>
  <div class="soccer-game-card" @click="$emit('click')">
    <!-- 聯賽名稱 -->
    <div class="league_matche">{{ game.soccerLeague || game.league }}</div>

    <!-- 比賽狀態和比分區域 -->
    <div class="big-score-box">
      <!-- 客隊 (左側) -->
      <div class="big_score big-score-soccer big-score-guest" :class="{ 'winner': game.status === 'finished' && game.awayScore && game.homeScore && game.awayScore > game.homeScore }">
        <h6 class="team-name">{{ game.awayTeam }}</h6>
        <strong class="score" v-if="game.status !== 'scheduled'">{{ game.awayScore || 0 }}</strong>
        <div v-else class="vs-text">VS</div>
      </div>

      <!-- 比賽狀態信息 -->
      <ul class="game_state game-state-soccer">
        <li class="state-status" v-if="game.status === 'live'">
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
        <li class="state-time" v-if="game.status === 'live' && game.matchMinute">
          <span class="match-time">{{ game.matchMinute }}'</span>
        </li>
        <li v-else-if="game.status === 'scheduled'" class="state-scheduled">
          <span class="game-time">{{ formatTime(game.time) }}</span>
        </li>
      </ul>

      <!-- 主隊 (右側) -->
      <div class="big_score big-score-soccer big-score-host" :class="{ 'winner': game.status === 'finished' && game.homeScore && game.awayScore && game.homeScore > game.awayScore }">
        <h6 class="team-name">{{ game.homeTeam }}</h6>
        <strong class="score" v-if="game.status !== 'scheduled'">{{ game.homeScore || 0 }}</strong>
        <div v-else class="vs-text">VS</div>
      </div>
    </div>

    <!-- 比賽前數據展示 -->
    <div v-if="game.status === 'scheduled'" class="pre-match-info">
      <div class="match-stats">
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
      </div>

      <!-- 明星球員 -->
      <div class="star-players" v-if="game.starPlayers && game.starPlayers.length > 0">
        <h4>明星球員</h4>
        <div class="players-list">
          <div v-for="player in game.starPlayers.slice(0, 3)" :key="player.name" class="player-item">
            <span class="player-name">{{ player.name }}</span>
            <span class="player-position">{{ player.position }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 比賽中/結束後的附加信息 -->
    <div v-if="game.status !== 'scheduled'" class="match-additional-info">
      <div class="match-situation" v-if="game.matchEvents && game.matchEvents.length > 0">
        <div class="event-item" v-for="event in game.matchEvents.slice(-2)" :key="event.id">
          <span class="event-time">{{ event.minute }}'</span>
          <span class="event-type">{{ event.type }}</span>
          <span class="event-player">{{ event.player }}</span>
        </div>
      </div>
    </div>

    <!-- 球場信息 -->
    <div v-if="game.venue" class="venue-info">
      <span class="venue-icon">📍</span>
      <span>{{ game.venue }}</span>
    </div>

    <!-- PBP區域 (留空以供將來擴展) -->
    <div class="pbp pbp-soccer" v-if="game.status === 'live' && game.playByPlay && game.playByPlay.length > 0">
      <div class="pbp-item" v-for="play in game.playByPlay.slice(-3)" :key="play.id">
        <span class="pbp-time">{{ play.minute }}'</span>
        <span class="pbp-description">{{ play.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// 足球比賽數據接口
interface SoccerPlayer {
  name: string;
  position: string;
}

interface MatchEvent {
  id: number;
  minute: number;
  type: string; // 'goal', 'yellow_card', 'red_card', 'substitution' 等
  player: string;
  team: 'home' | 'away';
}

interface PlayByPlay {
  id: number;
  minute: number;
  description: string;
  type: string;
}

interface TeamStats {
  winRate: string;
  recentForm?: string;
}

interface SoccerGame {
  id: number | string;
  league: string;
  soccerLeague?: string | null;
  status: 'scheduled' | 'live' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  time: string;
  matchMinute?: string | null;
  matchPeriod?: 'first_half' | 'second_half' | 'extra_time' | 'penalty_shootout' | null;
  venue?: string;
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  recentForm?: string;
  starPlayers?: SoccerPlayer[];
  matchEvents?: MatchEvent[];
  playByPlay?: PlayByPlay[];
  winner?: string;
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

function getMatchPeriodText(game: SoccerGame) {
  if (game.status === 'finished') {
    return '比賽結束';
  }

  if (game.status === 'live') {
    switch (game.matchPeriod) {
      case 'first_half': return '上半場';
      case 'second_half': return '下半場';
      case 'extra_time': return '延長賽';
      case 'penalty_shootout': return '點球大戰';
      default: return '進行中';
    }
  }

  if (game.status === 'scheduled') {
    return '未開始';
  }

  return '';
}
</script>

<style scoped>
.soccer-game-card {
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

.soccer-game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  border-color: #4CAF50;
}

/* 聯賽名稱 */
.league_matche {
  background: #1e3c72;
  color: white;
  text-align: center;
  padding: 6px 0;
  font-weight: bold;
  font-size: 14px;
  border-radius: 4px 4px 0 0;
  margin: -16px -16px 16px -16px;
}

/* 比賽狀態和比分區域 */
.big-score-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  position: relative;
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

.match-time {
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

.match-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
}

.stat-item {
  text-align: center;
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

/* 明星球員 */
.star-players {
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}

.star-players h4 {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
  text-align: center;
}

.players-list {
  display: flex;
  justify-content: space-around;
  gap: 8px;
}

.player-item {
  flex: 1;
  text-align: center;
  padding: 4px;
  background: #f8f9fa;
  border-radius: 4px;
}

.player-name {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2px;
}

.player-position {
  display: block;
  font-size: 10px;
  color: #666;
}

/* 比賽事件 */
.match-additional-info {
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
  margin-top: 8px;
}

.match-situation {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #666;
}

.event-time {
  font-weight: 600;
  color: #2c3e50;
  min-width: 24px;
}

.event-type {
  background: #e3f2fd;
  color: #1976d2;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 10px;
}

.event-player {
  flex: 1;
  font-weight: 500;
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

/* PBP區域 */
.pbp {
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
  margin-top: 8px;
}

.pbp-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.pbp-time {
  font-weight: 600;
  color: #2c3e50;
  min-width: 24px;
}

.pbp-description {
  flex: 1;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .soccer-game-card {
    width: 100%;
    max-width: 390px;
    padding: 12px;
  }

  .league_matche {
    font-size: 12px;
    padding: 4px 0;
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

  .match-stats {
    flex-direction: column;
    gap: 8px;
  }

  .players-list {
    flex-direction: column;
    gap: 4px;
  }

  .score {
    font-size: 28px;
  }

  .team-name {
    font-size: 14px;
  }
}
</style>
