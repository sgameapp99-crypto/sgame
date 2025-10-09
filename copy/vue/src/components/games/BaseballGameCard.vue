<template>
  <div class="outer-gamebox" :id="`outer-gamebox-${game.id}`" :data-oid="game.officialId">
    <!-- 比赛预览 (开打前) -->
    <div
      v-if="game.status === 'scheduled'"
      class="js-gamePreviewBox gamebox gamebox_no gamebox-notend"
      :id="`gamebox-preview-${game.id}`"
      style="display:block;"
    >
      <table border="0" class="no_start_team">
        <tbody>
        <tr>
          <td class="team_left team--underline">
            <a :href="getTeamLink(game.awayTeamId)" target="_blank">
              {{ game.awayTeam }}
            </a>
          </td>
          <td class="team_cinter">{{ formatTime(game.time) }}</td>
          <td class="team_right team--underline">
            <a :href="getTeamLink(game.homeTeamId)" target="_blank">
              {{ game.homeTeam }}
            </a>
          </td>
        </tr>
      </tbody>
      </table>

      <div class="no_start_datd">
        <table border="0" cellpadding="0" cellspacing="0" class="game-info-table">
          <tbody>
          <tr>
            <td class="datd_l start_pitcher">
              {{ game.awayPitcher?.name || '' }} {{ game.awayPitcher?.hand || '' }}
            </td>
            <td class="datd_c border_bottom_brown">先發投手</td>
            <td class="datd_r start_pitcher">
              {{ game.homePitcher?.name || '' }}
            </td>
          </tr>

          <!-- 投手数据 -->
          <tr>
            <td rowspan="4" class="pitcherRecord-td--rowspan">
              <table class="pitcherRecord-table">
                <tbody>
                <tr>
                  <th>勝-敗</th>
                  <th>防禦率</th>
                  <th class="border_right_no">被打擊率</th>
                </tr>
                <!--整体数据(本季)-->
                <tr>
                  <td>{{ game.awayPitcher?.record || '0-0' }}</td>
                  <td>{{ game.awayPitcher?.era || '0.00' }}</td>
                  <td class="border_right_no">{{ game.awayPitcher?.whip || '.000' }}</td>
                </tr>
                <!--整体数据(季后赛)-->
                <!--月战绩 / 近7场-->
                <tr class="pitcherRecord">
                  <td>{{ game.awayPitcher?.seasonRecord || '0-0' }}</td>
                  <td>{{ game.awayPitcher?.seasonEra || '0.00' }}</td>
                  <td class="border_right_no">{{ game.awayPitcher?.seasonWhip || '.000' }}</td>
                </tr>
                <!--主客场成绩-->
                <tr class="pitcherRecord">
                  <td>{{ game.awayPitcher?.homeRecord || '0-0' }}</td>
                  <td>{{ game.awayPitcher?.homeEra || '0.00' }}</td>
                  <td class="border_right_no">{{ game.awayPitcher?.homeWhip || '.000' }}</td>
                </tr>
              </tbody></table>
            </td>
            <td class="datd_c">&nbsp;</td>
            <td rowspan="4" class="pitcherRecord-td--rowspan">
              <table class="pitcherRecord-table">
                <tbody>
                <tr>
                  <th>勝-敗</th>
                  <th>防禦率</th>
                  <th class="border_right_no">被打擊率</th>
                </tr>
                <!--整体数据(本季)-->
                <tr>
                  <td>{{ game.homePitcher?.record || '0-0' }}</td>
                  <td>{{ game.homePitcher?.era || '0.00' }}</td>
                  <td class="border_right_no">{{ game.homePitcher?.whip || '.000' }}</td>
                </tr>
                <!--整体数据(季后赛)-->
                <!--月战绩 / 近7场-->
                <tr class="pitcherRecord">
                  <td>{{ game.homePitcher?.seasonRecord || '0-0' }}</td>
                  <td>{{ game.homePitcher?.seasonEra || '0.00' }}</td>
                  <td class="border_right_no">{{ game.homePitcher?.seasonWhip || '.000' }}</td>
                </tr>
                <!--主客场成绩-->
                <tr class="pitcherRecord">
                  <td>{{ game.homePitcher?.homeRecord || '0-0' }}</td>
                  <td>{{ game.homePitcher?.homeEra || '0.00' }}</td>
                  <td class="border_right_no">{{ game.homePitcher?.homeWhip || '.000' }}</td>
                </tr>
              </tbody></table>
            </td>
          </tr>

          <tr><td class="datd_c">本季</td></tr>
          <tr class="pitcherRecord"><td class="datd_c">季後賽</td></tr>
          <tr class="pitcherRecord"><td class="datd_c">客場</td></tr>
        </tbody>
        </table>
      </div>

      <div class="no_start_link">
        <a :href="getPredictLink(game.date)" target="_blank">預測比例</a>
      </div>
    </div>

    <!-- 比赛进行中 -->
    <div
      v-else-if="game.status === 'live'"
      class="js-gameOnbox gamebox gamebox_on gamebox-notend gamebox-today"
      :id="`gamebox-${game.id}`"
      style="display:block;"
      :data-aheadprice="game.liveStats?.inning || ''"
      :data-aheadodds="'50'"
      :data-predict="'0'"
      :data-nameh="game.homeTeam"
      :data-namea="game.awayTeam"
    >
      <div :id="`${game.id}_result_i`" class="game_result">
        <span :id="`${game.id}_showTeam`" class="teamname_highlight t_win winner-highlight">{{ getLeadingTeam(game) }}</span>
      </div>

      <table border="0" width="390" style="margin:0 auto;">
        <tbody>
        <tr>
          <td width="30%" align="center" :id="`${game.id}_aname`" class="aname">
            <span>{{ game.awayTeam }}</span>
          </td>
          <td width="40%">&nbsp;</td>
          <td width="30%" align="center" :id="`${game.id}_hname`" class="hname">
            <span class="inning_highlight">{{ game.homeTeam }}</span>
          </td>
        </tr>

        <tr>
          <td class="big_score" :id="`${game.id}_as_b`">{{ game.awayScore || 0 }}</td>
          <td align="center" style="text-align:center;" :id="`${game.id}_addinfo`">
            <div :id="`${game.id}_gamestate`" class="game_state">
              <div class="sb sb0">
                <span :id="`${game.id}_inning`">{{ game.liveStats?.inning || game.inning || '1局上' }}</span>
              </div>
              <div class="str_sbo">
                S:
                <span v-for="i in 3" :key="`strike-${i}`" :class="i <= (game.liveStats?.strikes || 0) ? 'yliteon' : 'liteoff'">&nbsp;</span>
                <br>B:
                <span v-for="i in 4" :key="`ball-${i}`" :class="i <= (game.liveStats?.balls || 0) ? 'gliteon' : 'liteoff'">&nbsp;</span>
                <br>O:
                <span v-for="i in 3" :key="`out-${i}`" :class="i <= (game.liveStats?.outs || 0) ? 'liteoff' : 'liteoff'">&nbsp;</span>
              </div>
            </div>
          </td>
          <td class="big_score" :id="`${game.id}_hs_b`">{{ game.homeScore || 0 }}</td>
        </tr>
        <tr class="inplay-tr">
          <td align="center" :id="`${game.id}_aai`">
            投 {{ game.liveStats?.currentPitcher || 'Matt Strahm' }}
          </td>
          <td :id="`${game.id}_pbp`" class="pbp-big" width="40%" align="center"></td>
          <td align="center" :id="`${game.id}_hai`">
            打 {{ game.liveStats?.currentBatter || 'Freddie Freeman' }}
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 比分统计表 -->
      <div v-if="game.scoreboard" class="st">
        <table class="scorebox">
          <tbody>
          <tr>
            <td width="60" class="h">&nbsp;</td>
            <td v-for="inning in game.scoreboard.innings" :key="inning" width="14" class="h">{{ inning }}</td>
            <td class="h">&nbsp;</td>
            <td width="14" class="h">R</td>
            <td width="14" class="h">H</td>
            <td width="14" class="h">E</td>
          </tr>
          <tr>
            <th>{{ game.awayTeam }}</th>
            <td v-for="score in game.scoreboard.awayScores" :key="score.inning" :id="`${game.id}_as${score.inning}`">
              {{ score.runs }}
            </td>
            <td>&nbsp;</td>
            <td :id="`${game.id}_asr`" class="s">{{ game.scoreboard.awayTotal?.runs || 0 }}</td>
            <td :id="`${game.id}_ash`" class="s">{{ game.scoreboard.awayTotal?.hits || 0 }}</td>
            <td :id="`${game.id}_ase`" class="s">{{ game.scoreboard.awayTotal?.errors || 0 }}</td>
          </tr>
          <tr>
            <th>{{ game.homeTeam }}</th>
            <td v-for="score in game.scoreboard.homeScores" :key="score.inning" :id="`${game.id}_hs${score.inning}`">
              {{ score.runs }}
            </td>
            <td>&nbsp;</td>
            <td :id="`${game.id}_hsr`" class="s">{{ game.scoreboard.homeTotal?.runs || 0 }}</td>
            <td :id="`${game.id}_hsh`" class="s">{{ game.scoreboard.homeTotal?.hits || 0 }}</td>
            <td :id="`${game.id}_hse`" class="s">{{ game.scoreboard.homeTotal?.errors || 0 }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!--數據-->
      <!-- 暂时隐藏投打数据功能 -->
      <!-- <div v-if="false && game.status === 'live'" class="livescore_data" :id="`${game.id}_livescore_data`">
        <a class="team-data-a qa_title" :class="{ dataActive: liveStatsExpanded }" @click="toggleLiveStats" href="javascript:;" :id="`${game.id}_livescore_data_link`">投打數據<strong>▼</strong><span>▲</span></a>
        <div class="qa_content mlb_qa_content" :id="`${game.id}_tmst_div`" :style="{ display: liveStatsExpanded ? 'block' : 'none' }">
          <table class="livescore_tb">
            <tbody>
              <tr>
                <td class="mlb-statistics-td mlb-statistics-td-l" :id="`${game.id}_away_stat`">
                  <div :id="`${game.id}_pitcher_stat`" class="div-pitcher-stat">
                    <strong class="pitcher-name">投 <span :id="`${game.id}_tmst_pitching_name`">{{ game.liveStats?.pitcherStats?.name || '' }}</span></strong>
                    <div :id="`${game.id}_tmst_pitching_stat`" class="performance-num">{{ game.liveStats?.pitcherStats?.ip || '0.0' }} 局 {{ game.liveStats?.pitcherStats?.er || 0 }} 失分</div>
                    <span class="statistics-title">今日</span><br>
                    <strong>主投 <span :id="`${game.id}_tmst_pitching_ip`" class="pitcher-statistics-num">{{ game.liveStats?.pitcherStats?.ip || '0.0' }}</span> 局</strong><br>
                    <strong>失分 <span :id="`${game.id}_tmst_pitching_er`" class="pitcher-statistics-num">{{ game.liveStats?.pitcherStats?.er || 0 }}</span></strong><br>
                    用球 <span :id="`${game.id}_tmst_pitching_pitches`" class="pitcher-statistics-num">{{ game.liveStats?.pitcherStats?.pitches || 0 }}</span><br>
                    好球 <span :id="`${game.id}_tmst_pitching_strikes`" class="pitcher-statistics-num">{{ game.liveStats?.pitcherStats?.strikes || 0 }}</span><br>
                    壞球 <span :id="`${game.id}_tmst_pitching_balls`" class="pitcher-statistics-num">{{ game.liveStats?.pitcherStats?.balls || 0 }}</span><br>
                    <span v-if="game.liveStats?.pitcherStats?.hits !== undefined">安打 <span :id="`${game.id}_tmst_pitching_hits`" class="pitcher-statistics-num">{{ game.liveStats?.pitcherStats?.hits || 0 }}</span><br></span>
                    <span v-if="game.liveStats?.pitcherStats?.bb !== undefined">四壞 <span :id="`${game.id}_tmst_pitching_bb`" class="pitcher-statistics-num">{{ game.liveStats?.pitcherStats?.bb || 0 }}</span><br></span>
                    <span v-if="game.liveStats?.pitcherStats?.so !== undefined">三振 <span :id="`${game.id}_tmst_pitching_so`" class="pitcher-statistics-num">{{ game.liveStats?.pitcherStats?.so || 0 }}</span><br></span>
                  </div>
                </td>
                <td class="mlb-statistics-td mlb-statistics-td-r" :id="`${game.id}_home_stat`">
                  <div :id="`${game.id}_batter_stat`" class="div-batter-stat">
                    <div class="batter-box">
                      <div class="batter-no-mark"></div>
                      <strong>
                        <span :id="`${game.id}_tmst_batting_order`" class="batter-no">{{ game.liveStats?.batterStats?.battingOrder || 1 }}</span><span :id="`${game.id}_tmst_batting_name`" class="batter-name">{{ game.liveStats?.batterStats?.name || '' }}</span>
                      </strong>
                      <p class="statistics-title">本季</p>
                      <div :id="`${game.id}_tmst_batting_stat`" class="performance-num">{{ game.liveStats?.batterStats?.season?.avg || '.000' }} 打擊率 / {{ game.liveStats?.batterStats?.season?.hr || 0 }} 全壘打 / {{ game.liveStats?.batterStats?.season?.rbi || 0 }} 打點</div>
                      <p class="statistics-title">近3年 VS 對戰投手</p>
                      <div :id="`${game.id}_tmst_batting_vs_last_three`" class="performance-num">{{ game.liveStats?.batterStats?.vsPitcher?.last3Years || '.000' }}</div>
                      <p class="statistics-title">今日</p>
                      <div :id="`${game.id}_tmst_batting_today`" class="batter-performance-num">{{ game.liveStats?.batterStats?.today || '0-0' }}</div>
                    </div>
                    <hr>
                    <div class="batter-box">
                      <div class="batter-no-mark"></div>
                      <strong>
                        <span :id="`${game.id}_tmst_ondeck_order`" class="batter-no">{{ game.liveStats?.onDeckStats?.battingOrder || 2 }}</span> <span :id="`${game.id}_tmst_ondeck_name`" class="batter-name batter-ondeck-name">{{ game.liveStats?.onDeckStats?.name || '' }}</span>
                      </strong>
                      <div :id="`${game.id}_tmst_ondeck_stat`" class="batter-performance-num">{{ game.liveStats?.onDeckStats?.season?.avg || '.000' }}</div>
                    </div>
                    <hr>
                    <div class="batter-box">
                      <div class="batter-no-mark"></div>
                      <strong>
                        <span :id="`${game.id}_tmst_inhole_order`" class="batter-no">{{ game.liveStats?.inHoleStats?.battingOrder || 3 }}</span> <span :id="`${game.id}_tmst_inhole_name`" class="batter-name batter-inhole-name">{{ game.liveStats?.inHoleStats?.name || '' }}</span>
                      </strong>
                      <div :id="`${game.id}_tmst_inhole_stat`" class="batter-performance-num">{{ game.liveStats?.inHoleStats?.season?.avg || '.000' }}</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->
      <!--數據-->

      <hr class="game_seperator">
    </div>

    <!-- 比赛结束 -->
    <div
      v-else-if="game.status === 'finished'"
      class="js-gameOnbox gamebox gamebox_on"
      :id="`gamebox-${game.id}`"
      :data-aheadprice="-1"
      :data-aheadodds="50"
      :data-predict="0"
      :data-nameh="game.homeTeam"
      :data-namea="game.awayTeam"
      style="display:block;"
    >
      <div :id="`${game.id}_result_i`" class="game_result">
        <span :id="`${game.id}_showTeam`" class="teamname_highlight t_win winner-highlight">{{ game.winner || game.homeTeam }}</span>
      </div>

      <table border="0" width="390" style="margin:0 auto;">
        <tbody>
        <tr>
          <td width="30%" align="center" :id="`${game.id}_aname`" class="aname">
            <span>{{ game.awayTeam }}</span>
          </td>
          <td width="40%">&nbsp;</td>
          <td width="30%" align="center" :id="`${game.id}_hname`" class="hname">
            <span>{{ game.homeTeam }}</span>
          </td>
        </tr>

        <tr>
          <td class="big_score" :id="`${game.id}_as_b`">{{ game.awayScore || 0 }}</td>
          <td align="center" style="text-align:center;" :id="`${game.id}_addinfo`">
            <div class="big_score__situation">
              比賽結束
            </div>
          </td>
          <td class="big_score" :id="`${game.id}_hs_b`">{{ game.homeScore || 0 }}</td>
        </tr>
        <tr class="inplay-tr">
          <td align="center" :id="`${game.id}_aai`">
          </td>
          <td :id="`${game.id}_pbp`" class="pbp-big" width="40%" align="center"></td>
          <td align="center" :id="`${game.id}_hai`">
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 比分统计表 -->
      <div v-if="game.scoreboard" class="st">
        <table class="scorebox">
          <tbody>
          <tr>
            <td width="60" class="h">&nbsp;</td>
            <td v-for="inning in game.scoreboard.innings" :key="inning" width="14" class="h" :id="`${game.id}_in${inning}`">{{ inning }}</td>
            <td class="h">&nbsp;</td>
            <td width="14" class="h">R</td>
            <td width="14" class="h">H</td>
            <td width="14" class="h">E</td>
          </tr>
          <tr>
            <th>{{ game.awayTeam }}</th>
            <td v-for="score in game.scoreboard.awayScores" :key="score.inning" :id="`${game.id}_as${score.inning}`">
              {{ score.runs }}
            </td>
            <td>&nbsp;</td>
            <td :id="`${game.id}_asr`" class="s">{{ game.scoreboard.awayTotal?.runs || 0 }}</td>
            <td :id="`${game.id}_ash`" class="s">{{ game.scoreboard.awayTotal?.hits || 0 }}</td>
            <td :id="`${game.id}_ase`" class="s">{{ game.scoreboard.awayTotal?.errors || 0 }}</td>
          </tr>
          <tr>
            <th>{{ game.homeTeam }}</th>
            <td v-for="(score, index) in game.scoreboard.homeScores" :key="score.inning" :id="`${game.id}_hs${score.inning}`" :class="{ 'game-ended-marker': isLastInningAndGameEnded(index) }">
              {{ isLastInningAndGameEnded(index) ? 'X' : score.runs }}
            </td>
            <td>&nbsp;</td>
            <td :id="`${game.id}_hsr`" class="s">{{ game.scoreboard.homeTotal?.runs || 0 }}</td>
            <td :id="`${game.id}_hsh`" class="s">{{ game.scoreboard.homeTotal?.hits || 0 }}</td>
            <td :id="`${game.id}_hse`" class="s">{{ game.scoreboard.homeTotal?.errors || 0 }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <hr class="game_seperator">
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';

interface Pitcher {
  record: string;
  era: string;
  whip: string;
  seasonRecord: string;
  seasonEra: string;
  seasonWhip: string;
  homeRecord: string;
  homeEra: string;
  homeWhip: string;
}

interface ScoreData {
  inning: number;
  runs: number;
}

interface Scoreboard {
  innings: number[];
  awayScores: ScoreData[];
  homeScores: ScoreData[];
  awayTotal: { runs: number; hits: number; errors: number };
  homeTotal: { runs: number; hits: number; errors: number };
}

interface BaseballGame {
  id: number;
  officialId: string;
  status: 'scheduled' | 'live' | 'finished';
  awayTeam: string;
  homeTeam: string;
  awayTeamId: number;
  homeTeamId: number;
  time: string;
  date: string;
  awayScore?: number;
  homeScore?: number;
  winner?: string;
  betInfo?: string;
  awayPitcher?: Pitcher;
  homePitcher?: Pitcher;
  awayTeamStats?: any;
  homeTeamStats?: any;
  scoreboard?: Scoreboard;
  liveStats?: any;
}

interface Props {
  game: BaseballGame;
}

const props = defineProps<Props>();

// 投打數據展開狀態
const liveStatsExpanded = ref(true);

function toggleLiveStats() {
  liveStatsExpanded.value = !liveStatsExpanded.value;
}

function formatTime(timeString: string) {
  if (!timeString) return '';
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getTeamLink(teamId: number) {
  return `https://www.playsport.cc/gamesData/teams?allianceid=1&teamid=${teamId}&from=livescore_title#historyGame`;
}

function getGameStatusText(status: string) {
  switch (status) {
    case 'live': return '比賽進行中';
    case 'finished': return '比賽結束';
    default: return '未開始';
  }
}

function getPitcherLink(teamId: number, side: string) {
  return `https://www.playsport.cc/gamesData/battle?gameid=${props.game.id}&allianceid=1&officialId=${props.game.officialId}&from=livescore_pitcher#pitcher_${side}`;
}

function getTeamHittingLink(teamId: number, side: string) {
  return `https://www.playsport.cc/gamesData/battle?gameid=${props.game.id}&allianceid=1&officialId=${props.game.officialId}&from=teamHitting#teamHitting_${side}`;
}

function getTeamStatsLink(teamId: number) {
  return `https://www.playsport.cc/gamesData/teams?allianceid=1&teamid=${teamId}&from=livescore_table#historyGame`;
}

function getBattleLink(gameId: number) {
  return `https://www.playsport.cc/gamesData/battle?gameid=${gameId}&allianceid=1&from=livescore#anchorLast10Records`;
}

function getPredictLink(date: string) {
  return `https://www.playsport.cc/predict/scale?allianceid=1&gametime=${date}&from=livescore`;
}

function isLastInningAndGameEnded(index: number): boolean {
  if (!props.game.scoreboard) return false;
  // 在標準棒球規則中，X表示比賽提前結束
  // 只有當比賽因大比分領先而在第9局前結束時才顯示X
  // 對於完整進行的9局比賽，不顯示X
  const totalInnings = props.game.scoreboard.homeScores.length;
  const isLastInning = index === totalInnings - 1;
  // 只有當總局數少於9時（提前結束），才在最後一局顯示X
  return isLastInning && props.game.status === 'finished' && totalInnings < 9;
}

function getLeadingTeam(game: BaseballGame): string {
  if (game.status === 'finished' && game.winner) {
    return game.winner;
  }

  if (game.status === 'live') {
    const homeScore = game.homeScore || 0;
    const awayScore = game.awayScore || 0;

    if (homeScore > awayScore) {
      return game.homeTeam;
    } else if (awayScore > homeScore) {
      return game.awayTeam;
    } else {
      // 分數相等時顯示主隊
      return game.homeTeam;
    }
  }

  // 預定比賽或沒有分數時顯示主隊
  return game.homeTeam;
}
</script>

<style scoped>
/* 灯号显示样式 */
.str_sbo {
  font-family: monospace;
  font-weight: bold;
  margin: 5px 0;
}

.yliteon {
  color: #ff6b35;
  background-color: #ff6b35;
  padding: 0 2px;
  margin: 0 1px;
}

.gliteon {
  color: #4ade80;
  background-color: #4ade80;
  padding: 0 2px;
  margin: 0 1px;
}

.liteoff {
  color: #6b7280;
  background-color: #6b7280;
  padding: 0 2px;
  margin: 0 1px;
}

/* 比赛预览样式 */
.no_start_team {
  background: white;
  margin: 0 auto;
  width: 100%;
  max-width: 390px;
}

/* 響應式表格寬度 */
@media (min-width: 768px) {
  .no_start_team {
    max-width: 600px;
  }
}

@media (min-width: 1024px) {
  .no_start_team {
    max-width: 700px;
  }
}

@media (min-width: 1280px) {
  .no_start_team {
    max-width: 800px;
  }
}

@media (min-width: 1536px) {
  .no_start_team {
    max-width: 900px;
  }
}

.team_left, .team_right {
  padding: 8px 12px;
  font-weight: bold;
}

.team_left {
  text-align: right;
  border-right: 1px solid #ddd;
}

.team_right {
  text-align: left;
  border-left: 1px solid #ddd;
}

.team_cinter {
  text-align: center;
  font-weight: bold;
  padding: 8px 12px;
}

/* 投打数据样式 */
.livescore_data {
  margin-top: 10px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.team-data-a {
  display: block;
  background: #f5f5f5;
  padding: 8px 12px;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.team-data-a:hover {
  background: #e5e5e5;
}

.dataActive {
  background: #007bff !important;
  color: white !important;
}

.qa_content {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-top: 5px;
}

.livescore_tb {
  width: 100%;
  border-collapse: collapse;
}

.mlb-statistics-td {
  vertical-align: top;
  padding: 10px;
}

.mlb-statistics-td-l {
  border-right: 1px solid #ddd;
}

.mlb-statistics-td-r {
  border-left: 1px solid #ddd;
}

.div-pitcher-stat, .div-batter-stat {
  line-height: 1.6;
}

.pitcher-name {
  font-weight: bold;
  color: #d32f2f;
  margin-bottom: 8px;
}

.performance-num {
  background: #fff3cd;
  padding: 4px 8px;
  border-radius: 3px;
  margin: 2px 0;
  font-weight: bold;
}

.batter-box {
  margin-bottom: 15px;
}

.batter-no {
  background: #007bff;
  color: white;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 8px;
}

.batter-no-mark {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #007bff;
  border-radius: 50%;
  margin-right: 8px;
}

.batter-name {
  font-weight: bold;
}

.batter-ondeck-name {
  color: #ff9800;
}

.batter-inhole-name {
  color: #9c27b0;
}

.statistics-title {
  color: #666;
  font-size: 12px;
  margin: 5px 0 2px 0;
}

.pitcher-statistics-num, .batter-performance-num {
  color: #007bff;
  font-weight: bold;
}

/* 比賽結束標記樣式 */
.game-ended-marker {
  font-weight: bold;
  color: #e74c3c;
  font-size: 1.1em;
}

/* 勝利者突出顯示樣式 */
.winner-highlight {
  font-size: 1.2em !important;
  font-weight: bold !important;
  text-align: center !important;
  display: block !important;
  padding: 8px 0 !important;
  background: linear-gradient(135deg, #28a745, #20c997) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  color: #28a745 !important; /* 備用顏色 */
  text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
}

/* 比分統計表格樣式優化 */
.scorebox {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

.scorebox th {
  background: #f8f9fa;
  padding: 8px 4px;
  text-align: left;
  font-weight: bold;
  border: 1px solid #ddd;
}

.scorebox td {
  padding: 6px 4px;
  text-align: center;
  border: 1px solid #ddd;
}

.scorebox .s {
  font-weight: bold;
  background: #fff3cd;
  color: #856404;
}

.scorebox .h {
  background: #e9ecef;
  font-weight: bold;
}

/* 日曆樣式 */
.calendar-wrapper {
  position: relative;
}

.calendar-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10000;
  width: 280px;
  padding: 10px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
}

.calendar-header button:hover {
  background: #f0f0f0;
}

.close-btn {
  margin-left: auto;
  font-size: 20px;
  color: #666;
}

.close-btn:hover {
  background: #ffeeee;
  color: #d00;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day-header {
  text-align: center;
  font-weight: bold;
  padding: 8px 0;
  font-size: 12px;
  color: #666;
}

.calendar-day {
  text-align: center;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 3px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.calendar-day:hover {
  background: #f0f0f0;
}

.calendar-day-today {
  background: #e3f2fd;
  font-weight: bold;
}

.calendar-day-selected {
  background: #2196f3;
  color: white;
  font-weight: bold;
}

.calendar-day-selected:hover {
  background: #1976d2;
}

/* 比賽進行中狀態樣式優化 - 添加邊框和背景色增加對比度 */
.js-gameOnbox.gamebox.gamebox_on.gamebox-notend.gamebox-today {
  border: 2px solid #007bff !important;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.15) !important;
  border-radius: 8px !important;
  margin: 10px 0 !important;
  padding: 15px !important;
}

/* 比賽結束狀態樣式優化 */
.js-gameOnbox.gamebox.gamebox_on:not(.gamebox-notend) {
  border: 2px solid #28a745 !important;
  background: linear-gradient(135deg, #f8fff8 0%, #ffffff 100%) !important;
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.15) !important;
  border-radius: 8px !important;
  margin: 10px 0 !important;
  padding: 15px !important;
}

/* 比賽預覽狀態樣式優化 */
.js-gamePreviewBox.gamebox.gamebox_no.gamebox-notend {
  border: 2px solid #6c757d !important;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
  box-shadow: 0 4px 8px rgba(108, 117, 125, 0.15) !important;
  border-radius: 8px !important;
  margin: 10px 0 !important;
  padding: 15px !important;
}

/* 投手數據表格樣式優化 */
.pitcherRecord-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.pitcherRecord-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  padding: 8px 6px;
  text-align: center;
  font-size: 11px;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.pitcherRecord-table th.border_right_no {
  border-right: none;
}

.pitcherRecord-table td {
  padding: 6px 4px;
  text-align: center;
  font-size: 12px;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
}

.pitcherRecord-table td.border_right_no {
  border-right: none;
}

.pitcherRecord-table tr:nth-child(even) {
  background: #f8f9fa;
}

.pitcherRecord-table tr:nth-child(odd) {
  background: #ffffff;
}

.pitcherRecord-table tr:hover {
  background: #e3f2fd;
  transition: background-color 0.2s ease;
}

/* 第一行數據（本季）特殊樣式 */
.pitcherRecord-table tr:first-child td {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  font-weight: bold;
}

/* 投手數據標籤樣式 */
.datd_c {
  text-align: center;
  font-weight: bold;
  color: #495057;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 3px;
  margin: 2px 0;
}

.pitcherRecord .datd_c {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 投手數據容器樣式 */
.pitcherRecord-td--rowspan {
  padding: 8px;
  vertical-align: top;
}

/* 其他现有样式保持不变 */
</style>