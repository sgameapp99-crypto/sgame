<template>
  <!-- 比賽前顯示 -->
  <div v-if="game.status === 'scheduled'" class="tennis-game-preview">
    <table class="no_start_team">
      <tbody>
        <tr>
          <td class="team_left team--underline">{{ game.awayTeam }}</td>
          <td class="team_cinter">{{ formatTime(game.time) }}</td>
          <td class="team_right team--underline">{{ game.homeTeam }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 詳細統計數據 -->
    <div class="no_start_datd" v-if="game.homeStats || game.awayStats">
      <table class="tennis-stats-table">
        <tbody>
          <!-- 盤口數據標題 -->
          <tr>
            <td class="border_bottom_no"><span class="title_name title_name_i">國際</span><span class="title_name title_name_s">運彩</span></td>
            <td class="datd_c border_bottom_no"></td>
            <td class="border_bottom_no"><span class="title_name title_name_i">國際</span><span class="title_name title_name_s">運彩</span></td>
          </tr>

          <!-- 讓分盤口數據 -->
          <tr>
            <td rowspan="5" class="border_top_no">
              <table class="no_start_datd_is">
                <tbody>
                  <tr><td class="datd_i">&nbsp;</td><td class="datd_s">&nbsp;</td></tr>
                  <tr><td class="datd_i">0%</td><td class="datd_s border_right_no">0%</td></tr>
                  <tr><td class="datd_i">0%</td><td class="datd_s border_right_no">0%</td></tr>
                  <tr><td class="datd_i">&nbsp;</td><td class="datd_s">&nbsp;</td></tr>
                  <tr><td class="datd_i border_bottom_no">0%</td><td class="datd_s border_bottom_no">0%</td></tr>
                </tbody>
              </table>
            </td>
            <td class="datd_c border_top_no">今日讓分盤口</td>
            <td rowspan="5" class="border_top_no">
              <table class="no_start_datd_is">
                <tbody>
                  <tr><td class="datd_i">&nbsp;</td><td class="datd_s">&nbsp;</td></tr>
                  <tr><td class="datd_i">0%</td><td class="datd_s border_right_no">0%</td></tr>
                  <tr><td class="datd_i">0%</td><td class="datd_s border_right_no">0%</td></tr>
                  <tr><td class="datd_i">&nbsp;</td><td class="datd_s">&nbsp;</td></tr>
                  <tr><td class="datd_i border_bottom_no">0%</td><td class="datd_s border_bottom_no">0%</td></tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- 統計數據標題和內容 -->
          <tr><td class="datd_c">讓分盤過盤率</td></tr>
          <tr><td class="datd_c">近十場讓分盤過盤率</td></tr>
          <tr><td class="datd_c">今日大小盤口</td></tr>
          <tr><td class="datd_c">大分過盤率</td></tr>

          <!-- 戰績數據 -->
          <tr>
            <td class="datd_l">
              <a href="#" class="games_data_link">詳細比分</a>
              {{ game.awayStats?.overallRecord || '0 - 0' }}
            </td>
            <td class="datd_c">戰績</td>
            <td class="datd_r">
              {{ game.homeStats?.overallRecord || '0 - 0' }}
              <a href="#" class="games_data_link">詳細比分</a>
            </td>
          </tr>

          <!-- 主客場戰績 -->
          <tr>
            <td class="datd_l">{{ game.awayStats?.awayRecord || '0 - 0' }}</td>
            <td class="datd_c">主 / 客戰績</td>
            <td class="datd_r">{{ game.homeStats?.homeRecord || '0 - 0' }}</td>
          </tr>

          <!-- 對戰記錄 -->
          <tr>
            <td class="datd_l">
              <a href="#" class="games_data_link">詳細比分</a> 0-0
            </td>
            <td class="datd_c">對戰紀錄</td>
            <td class="datd_r">
              0-0 <a href="#" class="games_data_link">詳細比分</a>
            </td>
          </tr>

          <!-- 近十場 -->
          <tr>
            <td class="datd_l">{{ game.awayStats?.recentForm || '0 - 0 , 0連' }}</td>
            <td class="datd_c">近十場</td>
            <td class="datd_r">{{ game.homeStats?.recentForm || '0 - 0 , 0連' }}</td>
          </tr>

          <!-- 平均得分 -->
          <tr>
            <td class="datd_l">{{ game.awayStats?.avgGames || '0 / 0' }}</td>
            <td class="datd_c">平均得 / 失分</td>
            <td class="datd_r">{{ game.homeStats?.avgGames || '0 / 0' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 比賽中/結束後顯示 -->
  <div v-else class="tennis-game-card" @click="$emit('click')">
    <!-- 比賽結果區域 -->
    <div class="game_result">
      <span class="teamname_highlight t_win" v-if="game.status === 'finished'">{{ getWinnerTeam(game) }}</span><br>
      <span class="betting-info" v-if="game.bettingInfo">{{ game.bettingInfo }}</span>
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
        <li class="state-time" v-if="game.status === 'live' && game.currentSet">
          <span class="current-set">第{{ game.currentSet }}盤</span>
        </li>
      </ul>

      <!-- 主隊 (右側) -->
      <div class="big_score big-score-s02 big-score-host" :class="{ 'winner': game.status === 'finished' && game.homeScore && game.awayScore && game.homeScore > game.awayScore }">
        <h6 class="team-name">{{ game.homeTeam }}</h6>
        <strong class="score" v-if="game.status !== 'scheduled'">{{ game.homeScore || 0 }}</strong>
        <div v-else class="vs-text">VS</div>
      </div>
    </div>

    <!-- 比賽信息 -->
    <div class="big_score__situation"></div>

    <!-- PBP區域 -->
    <div class="pbp" id="pbp"></div>

    <!-- 詳細得分表 -->
    <div class="st" v-if="game.scoreBreakdown">
      <table class="scorebox">
        <tbody>
          <tr>
            <td class="h" style="text-align:left;font-weight:normal;"></td>
            <td width="30" class="h">盤數</td>
            <td v-for="set in game.scoreBreakdown.sets" :key="set.setNumber" width="30" class="h">{{ set.setNumber }}</td>
            <td width="30" class="h"></td>
            <td width="30" class="h">局數</td>
          </tr>
          <tr>
            <th class="team-name">{{ game.awayTeam }}</th>
            <td class="s">{{ game.scoreBreakdown.awaySets }}</td>
            <td v-for="set in game.scoreBreakdown.sets" :key="set.setNumber" width="30">{{ set.awayGames }}</td>
            <td width="30"></td>
            <td class="s" width="30">{{ game.scoreBreakdown.awayTotalGames }}</td>
          </tr>
          <tr>
            <th class="team-name">{{ game.homeTeam }}</th>
            <td class="s">{{ game.scoreBreakdown.homeSets }}</td>
            <td v-for="set in game.scoreBreakdown.sets" :key="set.setNumber" width="30">{{ set.homeGames }}</td>
            <td width="30"></td>
            <td class="s" width="30">{{ game.scoreBreakdown.homeTotalGames }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr class="game_seperator">
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { TennisGame } from '../../data/types';

interface Props {
  game: TennisGame;
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

function getWinnerTeam(game: TennisGame) {
  if (game.status !== 'finished' || !game.awayScore || !game.homeScore) {
    return '';
  }
  return game.awayScore > game.homeScore ? game.awayTeam : game.homeTeam;
}

function getMatchPeriodText(game: TennisGame) {
  if (game.status === 'finished') {
    return '比賽結束';
  }

  if (game.status === 'live') {
    if (game.currentSet) {
      return `第${game.currentSet}盤`;
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
.tennis-game-card {
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

.tennis-game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  border-color: #4caf50;
}

/* 比賽前顯示樣式 */
.tennis-game-preview {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  width: 390px;
  margin: 0 auto 12px auto;
}

.no_start_team {
  width: 100%;
  border: 0;
  margin-bottom: 12px;
}

.no_start_team td {
  padding: 8px 12px;
  text-align: center;
  font-weight: bold;
  color: #2c3e50;
}

.team_left, .team_right {
  font-size: 14px;
}

.team_cinter {
  color: #666;
  font-size: 12px;
}

.team--underline {
  border-bottom: 1px solid #ddd;
}

/* 統計數據表格 */
.tennis-stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.tennis-stats-table td {
  padding: 6px 4px;
  border: 1px solid #ddd;
  text-align: center;
}

.tennis-stats-table .border_bottom_no {
  border-bottom: none !important;
}

.tennis-stats-table .border_top_no {
  border-top: none !important;
}

.tennis-stats-table .border_right_no {
  border-right: none !important;
}

.tennis-stats-table .datd_c {
  background: #f5f5f5;
  font-weight: bold;
}

.tennis-stats-table .datd_l {
  text-align: left;
}

.tennis-stats-table .datd_r {
  text-align: right;
}

.tennis-stats-table .title_name {
  font-size: 11px;
  color: #666;
}

.tennis-stats-table .title_name_i {
  color: #e74c3c;
}

.tennis-stats-table .title_name_s {
  color: #3498db;
}

.tennis-stats-table .no_start_datd_is {
  width: 100%;
  border: 0;
}

.tennis-stats-table .no_start_datd_is td {
  padding: 4px 2px;
  border: none;
  text-align: center;
}

.tennis-stats-table .datd_i, .tennis-stats-table .datd_s {
  font-size: 11px;
  color: #666;
}

.games_data_link {
  color: #3498db;
  text-decoration: none;
  font-size: 11px;
}

.games_data_link:hover {
  text-decoration: underline;
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
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.2;
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

.current-set {
  background: #fff3e0;
  color: #f57c00;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* PBP區域 */
.pbp {
  margin: 8px 0;
  min-height: 20px;
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
  font-size: 12px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 分隔線 */
.game_seperator {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 12px 0;
  clear: both;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .tennis-game-card, .tennis-game-preview {
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

  .big-score-guest {
    border-radius: 6px 6px 0 0 !important;
  }

  .big-score-host {
    border-radius: 0 0 6px 6px !important;
  }

  .game_state {
    min-width: auto;
    order: -1;
  }

  .tennis-stats-table {
    font-size: 11px;
  }

  .tennis-stats-table td {
    padding: 4px 2px;
  }

  .scorebox th,
  .scorebox td {
    padding: 4px 2px;
    font-size: 11px;
  }

  .team-name {
    font-size: 12px;
  }

  .score {
    font-size: 28px;
  }
}
</style>
