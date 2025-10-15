<template>
  <div class="predictgamebox">
    <div class="menugroupbox">
      <div class="menugroupbox-top"></div>
      <div class="menugroupbox-con">
        <form id="predict_form" method="post" action="" class="jqtransformdone">
          <table border="0" cellspacing="0" cellpadding="0" class="predictgame-table">
            <tbody>
              <tr>
                <th rowspan="2" scope="col" class="th-gameinfo">賽事資訊</th>
                <th rowspan="2" scope="col" class="th-teaminfo">球隊資訊</th>
                <th colspan="2" scope="col" class="th-universal">國際盤</th>
                <th colspan="3" scope="col" class="th-bank">運彩盤</th>
              </tr>
              <tr>
                <th class="th-universal-bet01">
                  <a href="/views/predictgame/rules_gametype_11.php" class="universal_rules_box cboxElement">
                    讓分
                  </a>
                </th>
                <th class="th-universal-bet02">
                  <a href="/views/predictgame/rules_gametype_12.php" class="universal_rules_box cboxElement">
                    大小
                  </a>
                </th>
                <th class="th-bank-bet01">讓分</th>
                <th class="th-bank-bet03">不讓分</th>
                <th class="th-bank-bet02">大小</th>
              </tr>

              <!-- 賽事列表 -->
              <template v-for="(game, gameIndex) in games" :key="game.gameId">
                <!-- 客隊行 -->
                <tr :gameid="game.gameId" class="">
                  <td rowspan="2" class="td-gameinfo">
                    <div>
                      <h3>{{ gameIndex + 1 }}</h3>
                      <h4>PM {{ game.gameTime }}</h4>
                      <p>
                        <a :href="`/gamesData/battle?gameid=${game.gameId}&allianceid=${selectedAlliance}&gameday=${formatDate(selectedDate)}&from=predict_games`" target="new">
                          對戰資訊
                        </a>
                      </p>
                    </div>
                  </td>

                  <td class="td-teaminfo js-closed-hint" :style="{}">
                    <div>
                      <h3>
                        <a :href="`/gamesData/teams?allianceid=${selectedAlliance}&teamid=${game.awayTeam.id}&from=predict_games#historyGame`" target="_blank">{{ game.awayTeam.name }}</a>
                      </h3>
                      <p>{{ game.awayTeam.pitcher }}</p>
                    </div>
                  </td>

                  <!-- 國際盤 - 讓分 -->
                  <td class="td-universal-bet01" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`iap${gameIndex}`" value="2" :id="`iap${gameIndex}_${gameIndex}_away`" @change="handlePredictionChange(game.gameId, 'international_spread', 'away', '2')" class="prediction-radio">
                      <label :for="`iap${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">客</strong>
                      </label>
                    </div>
                  </td>

                  <!-- 國際盤 - 大小 -->
                  <td class="td-universal-bet02" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`ibp${gameIndex}`" value="1" :id="`ibp${gameIndex}_${gameIndex}_away`" @change="handlePredictionChange(game.gameId, 'international_total', 'over', '1')" class="prediction-radio">
                      <label :for="`ibp${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">大</strong>
                        <span class="data-wrap">
                          <strong>{{ game.internationalOdds.total.over.line }}輸</strong>
                          <span>50%</span>
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 讓分 -->
                  <td class="td-bank-bet01" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`ap${gameIndex}`" value="2" :id="`ap${gameIndex}_${gameIndex}_away`" @change="handlePredictionChange(game.gameId, 'taiwan_spread', 'away', '2')" class="prediction-radio">
                      <label :for="`ap${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">客</strong>
                        <span class="data-wrap">
                          <strong>{{ game.taiwanOdds.spread.away.line }}</strong>
                          <span>, {{ game.taiwanOdds.spread.away.odds }}</span>
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 不讓分 -->
                  <td class="td-bank-bet03" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`pkp${gameIndex}`" value="2" :id="`pkp${gameIndex}_${gameIndex}_away`" @change="handlePredictionChange(game.gameId, 'taiwan_moneyline', 'away', '2')" class="prediction-radio">
                      <label :for="`pkp${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">客</strong>
                        <span class="data-wrap">
                          <strong></strong>
                          <span>{{ game.taiwanOdds.moneyline.away.odds }}</span>
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 大小 -->
                  <td class="td-bank-bet02" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`bp${gameIndex}`" value="1" :id="`bp${gameIndex}_${gameIndex}_away`" @change="handlePredictionChange(game.gameId, 'taiwan_total', 'over', '1')" class="prediction-radio">
                      <label :for="`bp${gameIndex}_${gameIndex}_away`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">大</strong>
                        <span class="data-wrap">
                          <strong>{{ game.taiwanOdds.total.over.line }}</strong>
                          <span>, {{ game.taiwanOdds.total.over.odds }}</span>
                        </span>
                      </label>
                    </div>
                  </td>
                </tr>

                <!-- 主隊行 -->
                <tr :gameid="game.gameId" class="">
                  <td class="td-teaminfo js-closed-hint" :style="{}">
                    <div>
                      <h3>
                        <a :href="`/gamesData/teams?allianceid=${selectedAlliance}&teamid=${game.homeTeam.id}&from=predict_games#historyGame`" target="_blank">{{ game.homeTeam.name }}</a>
                      </h3>
                      <p>{{ game.homeTeam.pitcher }}</p>
                    </div>
                  </td>

                  <!-- 國際盤 - 讓分 -->
                  <td class="td-universal-bet01" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`iap${gameIndex}`" value="1" :id="`iap${gameIndex}_${gameIndex}_home`" @change="handlePredictionChange(game.gameId, 'international_spread', 'home', '1')" class="prediction-radio">
                      <label :for="`iap${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">主</strong>
                        <span class="data-wrap">
                          <strong>{{ game.internationalOdds.spread.home.line }}分贏</strong>
                          <span>50%</span>
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 國際盤 - 大小 -->
                  <td class="td-universal-bet02" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`ibp${gameIndex}`" value="2" :id="`ibp${gameIndex}_${gameIndex}_home`" @change="handlePredictionChange(game.gameId, 'international_total', 'under', '2')" class="prediction-radio">
                      <label :for="`ibp${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">小</strong>
                        <strong></strong>
                        <span></span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 讓分 -->
                  <td class="td-bank-bet01" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`ap${gameIndex}`" value="1" :id="`ap${gameIndex}_${gameIndex}_home`" @change="handlePredictionChange(game.gameId, 'taiwan_spread', 'home', '1')" class="prediction-radio">
                      <label :for="`ap${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">主</strong>
                        <span class="data-wrap">
                          <strong>{{ game.taiwanOdds.spread.home.line }}</strong>
                          <span>, {{ game.taiwanOdds.spread.home.odds }}</span>
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 不讓分 -->
                  <td class="td-bank-bet03" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`pkp${gameIndex}`" value="1" :id="`pkp${gameIndex}_${gameIndex}_home`" @change="handlePredictionChange(game.gameId, 'taiwan_moneyline', 'home', '1')" class="prediction-radio">
                      <label :for="`pkp${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">主</strong>
                        <span class="data-wrap">
                          <strong></strong>
                          <span>{{ game.taiwanOdds.moneyline.home.odds }}</span>
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- 運彩盤 - 大小 -->
                  <td class="td-bank-bet02" style="cursor: pointer;">
                    <div>
                      <input type="radio" :name="`bp${gameIndex}`" value="2" :id="`bp${gameIndex}_${gameIndex}_home`" @change="handlePredictionChange(game.gameId, 'taiwan_total', 'under', '2')" class="prediction-radio">
                      <label :for="`bp${gameIndex}_${gameIndex}_home`" class="prediction-label">
                        <strong class="team-side DATA_MID_CLASS">小</strong>
                        <span class="data-wrap">
                          <strong>{{ game.taiwanOdds.total.under.line }}</strong>
                          <span>, {{ game.taiwanOdds.total.under.odds }}</span>
                        </span>
                      </label>
                    </div>
                  </td>
                </tr>

                <!-- 分隔行 -->
                <tr class="gaprow">
                  <td colspan="7" scope="row">&nbsp;</td>
                </tr>

                <!-- 隱藏輸入 -->
                <input type="hidden" :name="`row${gameIndex}`" :value="game.gameId">
              </template>

              <!-- 提交區域 -->
              <tr>
                <td colspan="7">
                  <div class="div-submitpredict" id="div-submit" style="z-index: 0; position: static; bottom: 0px; top: auto;">
                    <a href="/member/login?height=260&amp;width=580&amp;modal=true" class="headerLoginButton">
                      <h3>預測賽事請先登入</h3>
                    </a>
                  </div>
                  <div style="display: none; width: 958px; height: 38px; float: none;"></div>
                </td>
              </tr>
            </tbody>
          </table>
          <input type="hidden" name="allianceid" :value="selectedAlliance">
          <input type="hidden" name="gamerow" :value="games.length">
          <input type="hidden" name="categorytype" value="1">
        </form>
      </div>
      <div class="menugroupbox-bottom"></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="PredictGamesTable">
import { defineProps, defineEmits, ref } from 'vue';

// 定義 Props
interface Game {
  gameId: string;
  allianceId: number;
  gameDate: Date;
  gameTime: string;
  homeTeam: {
    id: number;
    name: string;
    pitcher: string;
  };
  awayTeam: {
    id: number;
    name: string;
    pitcher: string;
  };
  internationalOdds: {
    spread: {
      home: { line: string; odds: string };
      away: { line: string; odds: string };
    };
    total: {
      over: { line: string; odds: string };
      under: { line: string; odds: string };
    };
  };
  taiwanOdds: {
    spread: {
      home: { line: string; odds: string };
      away: { line: string; odds: string };
    };
    moneyline: {
      home: { odds: string };
      away: { odds: string };
    };
    total: {
      over: { line: string; odds: string };
      under: { line: string; odds: string };
    };
  };
}

const props = defineProps<{
  games: Game[];
  selectedAlliance: number;
  selectedDate: Date;
  selectedStatusType: 'finished' | 'live' | 'scheduled';
}>();

// 定義 Emits
const emit = defineEmits<{
  'select-prediction': [prediction: any];
}>();

// 響應式數據：追蹤每個游戲的預測選擇
interface Prediction {
  gameId: string;
  type: 'international_spread' | 'international_total' | 'taiwan_spread' | 'taiwan_moneyline' | 'taiwan_total';
  selection: 'home' | 'away' | 'over' | 'under';
  value: string;
}

const predictions = ref<Record<string, Prediction>>({});

// 工具函數
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 事件處理函數
function handlePredictionChange(gameId: string, type: Prediction['type'], selection: Prediction['selection'], value: string) {
  const prediction: Prediction = {
    gameId,
    type,
    selection,
    value
  };

  predictions.value[`${gameId}_${type}`] = prediction;

  // 發送事件給父組件
  emit('select-prediction', prediction);
}
</script>

<style scoped>
/* 預測遊戲表格樣式 */

:deep(.jqTransformHidden:checked + .jqTransformRadio::before) {
  background: #0066cc !important;
}
.predictgamebox {
  margin-top: 20px;
}

.menugroupbox {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.menugroupbox-top {
  height: 10px;
  background: linear-gradient(to right, #1e3c72, #2a5298);
}

.menugroupbox-con {
  padding: 20px;
}

.predictgame-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.predictgame-table th {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 12px 8px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}

.predictgame-table td {
  border: 1px solid #ddd;
  padding: 8px;
  vertical-align: middle;
}

.th-gameinfo {
  width: 80px;
  min-width: 80px;
}

.th-teaminfo {
  width: 150px;
  min-width: 150px;
}

.th-universal,
.th-bank {
  background: #e8f4f8;
}

.th-universal-bet01,
.th-universal-bet02,
.th-bank-bet01,
.th-bank-bet02,
.th-bank-bet03 {
  width: 120px;
  min-width: 120px;
}

.td-gameinfo {
  text-align: center;
  background: #f8f9fa;
}

.td-gameinfo h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #333;
}

.td-gameinfo h4 {
  font-size: 14px;
  color: #666;
  margin: 0 0 5px 0;
}

.td-gameinfo p {
  margin: 0;
}

.td-gameinfo a {
  color: #0066cc;
  text-decoration: none;
  font-size: 12px;
}

.td-gameinfo a:hover {
  text-decoration: underline;
}

.td-teaminfo {
  text-align: left;
}

.td-teaminfo h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.td-teaminfo h3 a {
  color: #333;
  text-decoration: none;
}

.td-teaminfo h3 a:hover {
  color: #0066cc;
}

.td-teaminfo p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.td-universal-bet01,
.td-universal-bet02,
.td-bank-bet01,
.td-bank-bet02,
.td-bank-bet03 {
  text-align: center;
  position: relative;
}

/* 預測選項樣式 */
.prediction-radio {
  margin-right: 5px;
  cursor: pointer;
}

.prediction-label {
  cursor: pointer;
  display: inline-block;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.prediction-label:hover {
  background-color: #f0f8ff;
}

.team-side {
  display: inline-block;
  min-width: 20px;
  font-weight: bold;
  color: #333;
}

.data-wrap {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  color: #666;
}

.data-wrap strong {
  color: #d00;
  font-weight: bold;
}

.data-wrap span {
  color: #666;
}

.gaprow {
  height: 10px;
}

.gaprow td {
  background: #f8f9fa;
  border: none;
}

.div-submitpredict {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
}

.headerLoginButton {
  display: inline-block;
  background: #ff6b35;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}

.headerLoginButton:hover {
  background: #e55a2b;
}

.headerLoginButton h3 {
  margin: 0;
  font-size: 16px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .menugroupbox-con {
    padding: 10px;
  }

  .predictgame-table {
    font-size: 12px;
  }

  .predictgame-table th,
  .predictgame-table td {
    padding: 4px;
  }

  .th-gameinfo,
  .th-teaminfo {
    width: auto;
    min-width: auto;
  }

  .th-universal-bet01,
  .th-universal-bet02,
  .th-bank-bet01,
  .th-bank-bet02,
  .th-bank-bet03 {
    width: auto;
    min-width: auto;
  }
}
</style>
