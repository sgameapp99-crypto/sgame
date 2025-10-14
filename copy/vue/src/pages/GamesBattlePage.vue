<template>
  <div class="games-battle-container">
    <div class="mainconbox">
      <div class="mainconboxin mainconboxinwide">
        <!-- 聯盟選擇和球隊選擇區域 -->
        <div id="gameData-container" class="predictgamebox">
          <div class="menugroupbox gamedata-menugroupbox">
            <div class="menugroupbox-top"></div>
            <div class="menugroupbox-con">
              <div class="tagsection">
                <!-- 聯盟選擇 -->
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
                        <li :class="{ 'tag-chosen': selectedAlliance === 1 }" @click="selectAlliance(1)">
                          MLB
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 3 }" @click="selectAlliance(3)">
                          日棒
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 4 }" @click="selectAlliance(4)">
                          中職
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 6 }" @click="selectAlliance(6)">
                          韓棒
                        </li>
                        <div :class="['games_close', { 'expanded': baseballExpanded }]">
                          <li :class="{ 'tag-chosen': selectedAlliance === 83 }" @click="selectAlliance(83)">
                            澳棒
                          </li>
                        </div>
                        <a href="#" :class="['more_play_btn', { 'reportActive': baseballExpanded }]" @click.prevent="toggleBaseballExpanded">
                          <strong>▼</strong>
                          <span>▲</span>
                        </a>
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
                        <li :class="{ 'tag-chosen': selectedAlliance === 2 }" @click="selectAlliance(2)">
                          NBA
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 7 }" @click="selectAlliance(7)">
                          WNBA
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 8 }" @click="selectAlliance(8)">
                          歐籃
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 12 }" @click="selectAlliance(12)">
                          澳籃
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 92 }" @click="selectAlliance(92)">
                          韓籃
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 97 }" @click="selectAlliance(97)">
                          日籃
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 18 }" @click="selectAlliance(18)">
                          TPBL
                        </li>
                        <div :class="['games_close', { 'expanded': basketballExpanded }]">
                          <li :class="{ 'tag-chosen': selectedAlliance === 16 }" @click="selectAlliance(16)">
                            P+
                          </li>
                          <li :class="{ 'tag-chosen': selectedAlliance === 89 }" @click="selectAlliance(89)">
                            SBL
                          </li>
                          <li :class="{ 'tag-chosen': selectedAlliance === 94 }" @click="selectAlliance(94)">
                            中籃
                          </li>
                        </div>
                        <a href="#" :class="['more_play_btn', { 'reportActive': basketballExpanded }]" @click.prevent="toggleBasketballExpanded">
                          <strong>▼</strong>
                          <span>▲</span>
                        </a>
                      </ol>
                    </div>
                  </div>

                  <!-- 其他聯盟 -->
                  <div class="tag-league-box tag-box">
                    <div class="tag-box-first">
                      <ol class="tag-league">
                        <li class="fold-head"></li>
                        <li>其他</li>
                        <li class="fold-footer"></li>
                      </ol>
                    </div>
                    <div class="tag-box-last">
                      <ol class="tag-con">
                        <li :class="{ 'tag-chosen': selectedAlliance === 87 }" @click="selectAlliance(87)">
                          俄冰
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 91 }" @click="selectAlliance(91)">
                          NHL冰球
                        </li>
                        <li :class="{ 'tag-chosen': selectedAlliance === 93 }" @click="selectAlliance(93)">
                          美足
                        </li>
                      </ol>
                    </div>
                  </div>

                  <!-- 對戰球隊選擇 -->
                  <div class="tag-league-box tag-box">
                    <div class="tag-box-first">
                      <ol class="tag-league">
                        <li class="fold-head"></li>
                        <li>對戰球隊</li>
                        <li class="fold-footer"></li>
                      </ol>
                    </div>
                    <div class="tag-box-last">
                      <ol class="tag-con tag-con-battle">
                        <li class="marker marker_m js-marker" @mouseenter="showBattlesList" @mouseleave="hideBattlesList">
                          <a href="javascript:void(0)" class="dropdown-title dropdown-title_m">
                            <span v-if="selectedGame">
                              {{ formatDate(selectedGame.time) }}
                              &nbsp;&nbsp;
                              {{ selectedGame.awayTeam }} v.s {{ selectedGame.homeTeam }}
                            </span>
                            <span v-else>選擇對戰</span>
                            <span></span>
                          </a>
                          <!-- 對戰列表 -->
                          <div id="battlesList" class="megadropdown megadropdown-battle js-battle" :style="{ display: battlesListVisible ? 'block' : 'none' }">
                            <div class="crop">
                              <div v-for="dateGroup in groupedGames" :key="dateGroup.date" class="megadropdown-battle-date">
                                <div class="title-date">
                                  <p class="battle-month">{{ formatMonth(dateGroup.date) }}</p>
                                  <p class="battle-date">{{ formatDay(dateGroup.date) }}</p>
                                  <p class="battle-week">{{ formatWeekday(dateGroup.date) }}</p>
                                </div>
                                <a v-for="game in dateGroup.games" :key="game.id"
                                   :class="{ 'battle-chosen': selectedGame && selectedGame.id === game.id }"
                                   @click="selectGame(game)">
                                  <span>{{ formatTime(game.time) }}</span>
                                  <strong>{{ game.awayTeam }}</strong> VS <strong>{{ game.homeTeam }}</strong>
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="menugroupbox-bottom"></div>
          </div>

          <!-- 數據內容區域 -->
          <div id="gamesDataBlock" v-if="selectedGame">
            <!-- 先發投手 -->
            <div id="js-startingPitcherTable" class="gamedata-battle-table01">
              <div class="gamedata-title">
                <h1 class="title__starting">先發投手</h1>
              </div>
              <div class="gamedata-table_pitcher">
                <table class="gamedata-table_pitcher">
                  <tbody><tr><td colspan="9" class="datatext_big gamedata-team--borderTopn">{{ selectedGame.awayTeam }} 山本由伸</td></tr></tbody>
                </table>
                <table class="gamedata-table gamedata-team--borderTopn">
                  <tbody>
                    <tr>
                      <th class="gamedata_team--widthPitcher"></th>
                      <th>勝</th><th>敗</th><th>防禦率</th><th>被打擊率</th><th>投球局數</th><th>三振</th><th>四壞</th><th>WHIP</th>
                    </tr>
                    <tr>
                      <td class="datatext_larger gamedata_pitcher">本季</td>
                      <td class="datatext_larger">12</td><td class="datatext_larger">8</td><td class="datatext_larger">2.49</td>
                      <td class="datatext_larger">.183</td><td class="datatext_larger">173.2</td><td class="datatext_larger">201</td>
                      <td class="datatext_larger">59</td><td class="datatext_larger">0.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 團隊打擊數據 -->
            <div id="js-teamHittingTable" class="gamedata-battle-table01">
              <div class="gamedata-title">
                <h1 class="title__starting">團隊打擊數據</h1>
              </div>
              <table class="gamedata-table_pitcher">
                <tbody><tr><td class="datatext_big gamedata-team gamedata-team--borderTopn">{{ selectedGame.awayTeam }}</td></tr></tbody>
              </table>
              <table class="gamedata-table gamedata-color_ranking gamedata-team--borderTopn">
                <tbody>
                  <tr>
                    <th scope="col" class="gamedata__teamfight">團隊打擊(排名)</th>
                    <th scope="col">打擊率</th><th scope="col">上壘率</th><th scope="col">長打率</th>
                    <th scope="col">平均得分</th><th scope="col">全壘打</th><th scope="col">保送</th><th scope="col">三振</th>
                  </tr>
                  <tr><td>主</td><td>.260<span>(6)</span></td><td>.338<span>(3)</span></td><td>.474<span>(1)</span></td>
                      <td>5.5<span>(1)</span></td><td>142<span>(1)</span></td><td>295<span>(2)</span></td><td>608<span>(6)</span></td></tr>
                  <tr><td>客</td><td>.245<span>(13)</span></td><td>.317<span>(8)</span></td><td>.409<span>(8)</span></td>
                      <td>4.7<span>(7)</span></td><td>102<span>(9)</span></td><td>285<span>(5)</span></td><td>745<span>(23)</span></td></tr>
                  <tr><td>對戰{{ selectedGame.homeTeam }}</td><td>.179</td><td>.245</td><td>.301</td>
                      <td>2.7</td><td>6</td><td>16</td><td>61</td></tr>
                  <tr><td>近七場</td><td>.230<span>(2)</span></td><td>.340<span>(1)</span></td><td>.335<span>(4)</span></td>
                      <td>3.8<span>(3)</span></td><td>3<span>(4)</span></td><td>23<span>(2)</span></td><td>48<span>(3)</span></td></tr>
                  <tr><td>本賽季</td><td>.253<span>(5)</span></td><td>.327<span>(5)</span></td><td>.441<span>(2)</span></td>
                      <td>5.1<span>(2)</span></td><td>244<span>(2)</span></td><td>580<span>(2)</span></td><td>1353<span>(15)</span></td></tr>
                </tbody>
              </table>
            </div>

            <!-- 對戰盤口 -->
            <div id="js-gameLinesTable" class="gamedata-battle-table01">
              <div class="gamedata-title">
                <h1 class="title__starting">對戰盤口</h1>
              </div>
              <table class="predictgame-table gamedata-battle-table01">
                <tbody>
                  <tr>
                    <th rowspan="2" class="th-gameinfo">賽事日期</th>
                    <th rowspan="2" class="th-teaminfo">對戰隊伍</th>
                    <th colspan="2" class="th-universal">國際盤</th>
                    <th colspan="3" class="th-bank">運彩盤</th>
                  </tr>
                  <tr>
                    <th class="th-universal-bet01">讓分</th><th class="th-universal-bet02">大小</th>
                    <th class="th-bank-bet01">讓分</th><th class="th-bank-bet03">不讓分</th><th class="th-bank-bet02">大小</th>
                  </tr>
                  <tr>
                    <td rowspan="2" class="td-gameinfo">
                      <div><h4>{{ formatTime(selectedGame.time) }}</h4></div>
                    </td>
                    <td class="td-teaminfo">
                      <div><a href="#">{{ selectedGame.awayTeam }}</a><p>山本由伸</p></div>
                    </td>
                    <td class="td-universal-bet01 bet_large">
                      <strong class="team-side">客</strong>
                      <strong>1分贏</strong>
                      <span class="linefeed">50%</span>
                    </td>
                    <td class="td-universal-bet02 bet_large">
                      <strong>大 7 輸</strong>
                      <span class="linefeed">50%</span>
                    </td>
                    <td class="td-bank-bet01 bet_large">
                      <strong>客</strong><strong>-1.5</strong><span class="linefeed">, 2.05</span>
                    </td>
                    <td class="td-bank-bet03 bet_large">
                      <strong>客</strong><span class="linefeed">1.63</span>
                    </td>
                    <td class="td-bank-bet02 bet_large">
                      <strong>大</strong><strong>7.5</strong><span class="linefeed">, 1.84</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="td-teaminfo">
                      <div><a href="#">{{ selectedGame.homeTeam }}</a><p>Freddy Peralta</p></div>
                    </td>
                    <td class="td-universal-bet01 bet_large">&nbsp;</td>
                    <td class="td-universal-bet02 bet_large">&nbsp;</td>
                    <td class="td-bank-bet01 bet_large">
                      <strong>主</strong><strong>+1.5</strong><span class="linefeed">, 1.48</span>
                    </td>
                    <td class="td-bank-bet03 bet_large">
                      <strong>主</strong><span class="linefeed">1.87</span>
                    </td>
                    <td class="td-bank-bet02 bet_large">
                      <strong>小</strong><strong>7.5</strong><span class="linefeed">, 1.66</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 近十場對戰記錄 -->
            <div id="js-gameRecords10Table" class="gamedata-battle-table02">
              <div class="gamedata-title">
                <h1 class="title__starting">近十場對戰記錄</h1>
              </div>
              <table class="predictgame-table gamedata-battle-table02">
                <tbody>
                  <tr>
                    <th rowspan="2" class="th-gameinfo">賽事日期</th>
                    <th rowspan="2" class="th-teaminfo">對戰隊伍</th>
                    <th colspan="2" class="th-universal">國際盤</th>
                    <th colspan="3" class="th-bank">運彩盤</th>
                    <th rowspan="2" class="th-scoresum">總分</th>
                  </tr>
                  <tr>
                    <th class="th-universal-bet01">讓分</th><th class="th-universal-bet02">大小</th>
                    <th class="th-bank-bet01">讓分</th><th class="th-bank-bet03">不讓分</th><th class="th-bank-bet02">大小</th>
                  </tr>
                  <!-- 示例記錄 -->
                  <tr>
                    <td class="td-gameinfo"><div><h3>10/14</h3><h4>AM 08:08</h4></div></td>
                    <td class="td-teaminfo">
                      <table><tbody><tr><td rowspan="3" class="scores scores-mlb">
                        <ul><li class="winnerscores">2</li><li class="vsicon">V.S.</li><li>1</li></ul>
                      </td><td class="winnerteam">{{ selectedGame.awayTeam }}<p>Blake Snell</p></td></tr>
                      <tr><td class="teamgap">&nbsp;</td></tr>
                      <tr><td>{{ selectedGame.homeTeam }}<p class="loseteam">Aaron Ashby</p></td></tr></tbody></table>
                    </td>
                    <td class="td-universal-bet01"><div>釀酒人<span>受讓</span> 1 分贏 50%</div></td>
                    <td class="td-universal-bet02"><div>小 7.5</div></td>
                    <td class="td-bank-bet01"><div>釀酒人 +1.5</div></td>
                    <td class="td-bank-bet03"><div>道奇</div></td>
                    <td class="td-bank-bet02"><div>小 7.5</div></td>
                    <td class="td-scoresum"><div>3</div></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 戰績統計 -->
            <div id="js-gameRecordsTable" class="gamedata-battle-table03">
              <div class="gamedata-title">
                <h1 class="title__starting">戰績</h1>
                <p>統計時間：2025/03/28-2025/11/30</p>
              </div>
              <table class="predictgame-table gamedata-battle-table03">
                <tbody>
                  <tr>
                    <th class="th-gameinfo">類別</th><th class="th-teaminfo">球隊</th>
                    <th>勝敗</th><th>主場勝率</th><th>客場勝率</th>
                    <th>得/失分</th><th>主場得/失分</th><th>客場得/失分</th>
                  </tr>
                  <tr>
                    <td rowspan="2" class="td-gameinfo"><div><h3>對戰</h3></div></td>
                    <td class="td-teaminfo"><div><a href="#">{{ selectedGame.awayTeam }}</a></div></td>
                    <td><strong>1-6</strong><span class="teaminfo_linefeed">14%</span></td>
                    <td><strong>0-3</strong><span class="teaminfo_linefeed">0%</span></td>
                    <td><strong>1-3</strong><span class="teaminfo_linefeed">25%</span></td>
                    <td><strong>2.6 / 4.6</strong></td>
                    <td><strong>4 / 5.3</strong></td>
                    <td><strong>1.5 / 4</strong></td>
                  </tr>
                  <tr>
                    <td class="td-teaminfo"><div><a href="#">{{ selectedGame.homeTeam }}</a></div></td>
                    <td><strong>6-1</strong><span class="teaminfo_linefeed">86%</span></td>
                    <td><strong>3-1</strong><span class="teaminfo_linefeed">75%</span></td>
                    <td><strong>3-0</strong><span class="teaminfo_linefeed">100%</span></td>
                    <td><strong>4.6 / 2.6</strong></td>
                    <td><strong>4 / 1.5</strong></td>
                    <td><strong>5.3 / 4</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 過盤率 -->
            <div id="js-winBetRatioTable" class="gamedata-battle-table04">
              <div class="gamedata-title">
                <h1 class="title__starting">過盤率</h1>
                <p>統計時間：2025/03/28-2025/11/30</p>
              </div>
              <table class="predictgame-table gamedata-battle-table04">
                <tbody>
                  <tr>
                    <th rowspan="2" scope="col" class="th-gameinfo">類別</th>
                    <th rowspan="2" scope="col" class="th-teaminfo">球隊</th>
                    <th colspan="3" scope="col" class="th-universal">國際盤</th>
                    <th colspan="4" scope="col" class="th-bank">運彩盤</th>
                  </tr>
                  <tr>
                    <th class="th-universal-bet01">讓分</th><th class="th-universal-bet02">受讓</th><th class="th-universal-bet03">大分</th>
                    <th class="th-bank-bet01">讓分</th><th class="th-bank-bet02">受讓</th><th class="th-bank-bet04">不讓分</th><th class="th-bank-bet03">大分</th>
                  </tr>
                  <tr>
                    <td rowspan="2" class="td-gameinfo"><div><h3>對戰</h3></div></td>
                    <td class="td-teaminfo"><div><a href="#">{{ selectedGame.awayTeam }}</a></div></td>
                    <td><strong>0-6</strong><span class="teaminfo_linefeed">0%</span></td>
                    <td><strong>0-1</strong><span class="teaminfo_linefeed">0%</span></td>
                    <td><strong>3-4</strong><span class="teaminfo_linefeed">43%</span></td>
                    <td><strong>0-7</strong><span class="teaminfo_linefeed">0%</span></td>
                    <td>-</td>
                    <td><strong>1-6</strong><span class="teaminfo_linefeed">14%</span></td>
                    <td><strong>3-4</strong><span class="teaminfo_linefeed">43%</span></td>
                  </tr>
                  <tr>
                    <td class="td-teaminfo"><div><a href="#">{{ selectedGame.homeTeam }}</a></div></td>
                    <td><strong>1-0</strong><span class="teaminfo_linefeed">100%</span></td>
                    <td><strong>6-0</strong><span class="teaminfo_linefeed">100%</span></td>
                    <td><strong>3-4</strong><span class="teaminfo_linefeed">43%</span></td>
                    <td>-</td>
                    <td><strong>7-0</strong><span class="teaminfo_linefeed">100%</span></td>
                    <td><strong>6-1</strong><span class="teaminfo_linefeed">86%</span></td>
                    <td><strong>3-4</strong><span class="teaminfo_linefeed">43%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getGames } from '../data/mockApi';
import type { UnifiedGame } from '../data/types';

// 響應式數據
const selectedAlliance = ref(1);
const baseballExpanded = ref(false);
const basketballExpanded = ref(false);
const battlesListVisible = ref(false);
const selectedGame = ref<UnifiedGame | null>(null);
const games = ref<UnifiedGame[]>([]);

// 計算屬性
const groupedGames = computed(() => {
  const groups: { [key: string]: UnifiedGame[] } = {};
  games.value.forEach(game => {
    const date = game.time.split(' ')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(game);
  });

  return Object.keys(groups).map(date => ({
    date,
    games: groups[date]
  }));
});

// 方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  battlesListVisible.value = false;
  loadGames();
}

function toggleBaseballExpanded() {
  baseballExpanded.value = !baseballExpanded.value;
}

function toggleBasketballExpanded() {
  basketballExpanded.value = !basketballExpanded.value;
}

function showBattlesList() {
  battlesListVisible.value = true;
}

function hideBattlesList() {
  battlesListVisible.value = false;
}

function selectGame(game: UnifiedGame) {
  selectedGame.value = game;
  battlesListVisible.value = false;
}

async function loadGames() {
  try {
    const response = await getGames({
      alliance: selectedAlliance.value,
      status: 'finished',
      pageSize: 50
    });

    if (response.success) {
      games.value = response.data as UnifiedGame[];
      // 默認選擇第一場比賽
      if (games.value.length > 0 && !selectedGame.value) {
        selectedGame.value = games.value[0];
      }
    }
  } catch (error) {
    console.error('載入比賽數據失敗:', error);
  }
}

// 工具函數
function formatDate(timeString: string) {
  const date = new Date(timeString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  return `${month}/${day} (${weekday})`;
}

function formatTime(timeString: string) {
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `AM ${hours}:${minutes}`;
}

function formatMonth(dateString: string) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月`;
}

function formatDay(dateString: string) {
  const date = new Date(dateString);
  return date.getDate().toString();
}

function formatWeekday(dateString: string) {
  const date = new Date(dateString);
  return ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
}

// 生命週期
onMounted(() => {
  loadGames();
});
</script>

<style scoped>
.games-battle-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.mainconbox {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.mainconboxin {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 菜單組樣式 */
.menugroupbox {
  margin-bottom: 20px;
}

.menugroupbox-top, .menugroupbox-bottom {
  height: 10px;
  background: url('/images/menu_group_bg.png') repeat-x;
}

.menugroupbox-con {
  background: white;
  padding: 15px;
}

/* 標籤區域 */
.tagsection {
  margin: 0;
}

.tag-league-boxall {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.tag-league-box {
  min-width: 200px;
  flex: 1;
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
  display: flex;
  justify-content: center;
  align-items: center;
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
  gap: 6px;
}

.tag-con li {
  padding: 6px 12px;
  border-radius: 4px;
  background: white;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.tag-con li:hover {
  background: #f8f9fa;
}

.tag-con li a {
  color: inherit;
  text-decoration: none;
}

.tag-chosen {
  background: #ffde00 !important;
  border-color: #ffc400 !important;
  color: #000 !important;
  font-weight: bold !important;
}

.games_close {
  display: none;
}

.games_close.expanded {
  display: block;
}

.more_play_btn {
  float: left;
  margin: 0 0 10px 0;
  cursor: pointer;
  text-decoration: none;
  color: #333;
  font-size: 12px;
  padding: 4px 8px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.more_play_btn strong, .more_play_btn span {
  display: inline-block;
  width: 12px;
  text-align: center;
}

.more_play_btn span {
  display: none;
}

.more_play_btn.reportActive strong {
  display: none;
}

.more_play_btn.reportActive span {
  display: inline-block;
}

/* 對戰球隊選擇 */
.tag-con-battle {
  position: relative;
}

.marker {
  position: relative;
}

.dropdown-title {
  display: block;
  position: relative;
  cursor: pointer;
}

.dropdown-title span:last-child {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #666;
}

.megadropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.megadropdown-battle-date {
  border-bottom: 1px solid #eee;
  padding: 10px;
}

.megadropdown-battle-date:last-child {
  border-bottom: none;
}

.title-date {
  text-align: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.battle-month, .battle-date, .battle-week {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.battle-month, .battle-date {
  display: inline-block;
  margin-right: 8px;
}

.megadropdown a {
  display: block;
  padding: 8px 12px;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.megadropdown a:hover {
  background: #f8f9fa;
}

.battle-chosen {
  background: #e3f2fd !important;
  color: #1976d2 !important;
  font-weight: bold;
}

/* 數據表格樣式 */
.predictgamebox {
  padding: 20px;
}

.gamedata-title {
  background: #f8f9fa;
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
}

.title__starting {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.gamedata-battle-table01, .gamedata-battle-table02, .gamedata-battle-table03, .gamedata-battle-table04 {
  margin-bottom: 30px;
}

.gamedata-table, .predictgame-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 15px;
}

.gamedata-table th, .gamedata-table td,
.predictgame-table th, .predictgame-table td {
  padding: 8px 6px;
  border: 1px solid #ddd;
  text-align: center;
}

.gamedata-table th, .predictgame-table th {
  background: #f8f9fa;
  font-weight: bold;
  white-space: nowrap;
}

.datatext_big {
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
}

.datatext_larger {
  font-size: 14px;
  font-weight: bold;
}

.gamedata_team--widthPitcher {
  min-width: 80px;
}

.gamedata-color_ranking span {
  display: block;
  font-size: 11px;
  color: #666;
  margin-top: 2px;
}

/* 盤口樣式 */
.th-universal, .th-bank {
  background: #e8f5e8;
}

.th-universal-bet01, .th-universal-bet02, .th-universal-bet03 {
  background: #f1f8e9;
}

.th-bank-bet01, .th-bank-bet02, .th-bank-bet03, .th-bank-bet04 {
  background: #e3f2fd;
}

.bet_large {
  background: #fff3e0;
}

.team-side {
  color: #e74c3c;
  font-weight: bold;
}

.linefeed {
  display: block;
  font-size: 11px;
  color: #666;
  margin-top: 2px;
}

/* 戰績統計樣式 */
.teaminfo_linefeed {
  display: block;
  font-size: 11px;
  color: #666;
  margin-top: 2px;
}

.winnerscores {
  color: #e74c3c;
  font-weight: bold;
}

.loseteam {
  color: #666;
}

.vsicon {
  color: #666;
  font-weight: bold;
}

.scores-mlb ul {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0;
  padding: 0;
  list-style: none;
}

.scores-mlb li {
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .mainconbox {
    padding: 10px;
  }

  .tag-league-boxall {
    flex-direction: column;
  }

  .tag-league-box {
    min-width: auto;
  }

  .gamedata-table, .predictgame-table {
    font-size: 11px;
  }

  .gamedata-table th, .gamedata-table td,
  .predictgame-table th, .predictgame-table td {
    padding: 4px 2px;
  }

  .megadropdown {
    max-height: 300px;
  }
}
</style>

