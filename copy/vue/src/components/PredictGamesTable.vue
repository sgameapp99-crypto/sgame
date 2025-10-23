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
                  <!-- 未登入狀態 -->
                  <div v-if="!session.loggedIn" class="div-submitpredict" id="div-submit" style="z-index: 0; position: static; bottom: 0px; top: auto;">
                    <a @click="$router.push('/login')" class="headerLoginButton" style="cursor: pointer;">
                      <h3>預測賽事請先登入</h3>
                    </a>
                  </div>
                  <!-- 已登入狀態 -->
                  <div v-else class="div-submitpredict" id="div-submit" style="z-index: 0; position: static; bottom: 0px; top: auto;">
                    <div class="submit-prediction-bar">
                      <div class="selected-count">
                        已選擇 <strong>{{ selectedCount }}</strong> 場賽事預測
                      </div>
                      <button 
                        type="button" 
                        class="btn-submit-prediction" 
                        :disabled="selectedCount === 0 || submitting"
                        @click="handleSubmitPredictions"
                      >
                        <span v-if="!submitting">
                          <i class="fas fa-paper-plane"></i> 提交預測
                        </span>
                        <span v-else>
                          <i class="fas fa-spinner fa-spin"></i> 提交中...
                        </span>
                      </button>
                    </div>
                  </div>
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
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';
import { predictionsAPI } from '../api';
import type { Game } from '../types/game';

const props = defineProps<{
  games: Game[];
  selectedAlliance: number;
  selectedDate: Date;
  selectedStatusType: 'finished' | 'live' | 'scheduled';
}>();

// 定義 Emits
const emit = defineEmits<{
  'select-prediction': [prediction: any];
  'submit-success': [message: string];
  'submit-error': [message: string];
}>();

// Store & Router
const session = useSessionStore();
const router = useRouter();

// 響應式數據：追蹤每個游戲的預測選擇
interface Prediction {
  gameId: string;
  type: 'international_spread' | 'international_total' | 'taiwan_spread' | 'taiwan_moneyline' | 'taiwan_total';
  selection: 'home' | 'away' | 'over' | 'under';
  value: string;
}

const predictions = ref<Record<string, Prediction>>({});
const submitting = ref(false);

// 計算選擇的預測數量
const selectedCount = computed(() => {
  // 計算有多少個不同的 gameId
  const gameIds = new Set<string>();
  Object.values(predictions.value).forEach(p => {
    gameIds.add(p.gameId);
  });
  return gameIds.size;
});

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

// 提交預測
async function handleSubmitPredictions() {
  if (selectedCount.value === 0) {
    return;
  }

  submitting.value = true;

  try {
    // 將預測按 gameId 分組
    const predictionsByGame: Record<string, Prediction[]> = {};
    Object.values(predictions.value).forEach(p => {
      if (!predictionsByGame[p.gameId]) {
        predictionsByGame[p.gameId] = [];
      }
      predictionsByGame[p.gameId].push(p);
    });

    // 逐個提交預測
    const results = [];
    for (const [gameId, gamePredictions] of Object.entries(predictionsByGame)) {
      for (const pred of gamePredictions) {
        try {
          // 找到對應的賽事以獲取賠率
          const game = props.games.find(g => g.gameId === gameId);
          let odds = '1.90'; // 預設賠率

          if (game) {
            // 根據預測類型和選擇獲取正確的賠率
            if (pred.type === 'international_spread') {
              odds = pred.selection === 'home' 
                ? game.internationalOdds.spread.home.odds 
                : game.internationalOdds.spread.away.odds;
            } else if (pred.type === 'international_total') {
              odds = pred.selection === 'over' 
                ? game.internationalOdds.total.over.odds 
                : game.internationalOdds.total.under.odds;
            } else if (pred.type === 'taiwan_spread') {
              odds = pred.selection === 'home' 
                ? game.taiwanOdds.spread.home.odds 
                : game.taiwanOdds.spread.away.odds;
            } else if (pred.type === 'taiwan_moneyline') {
              odds = pred.selection === 'home' 
                ? game.taiwanOdds.moneyline.home.odds 
                : game.taiwanOdds.moneyline.away.odds;
            } else if (pred.type === 'taiwan_total') {
              odds = pred.selection === 'over' 
                ? game.taiwanOdds.total.over.odds 
                : game.taiwanOdds.total.under.odds;
            }
          }

          const requestData = {
            gameId: pred.gameId,
            predictionType: pred.type,
            selection: pred.selection,
            odds: odds,
            price: 100, // 預設價格，可以從設定中獲取
            isMainPick: false
          };
          
          console.log('提交預測請求:', requestData);

          const result = await predictionsAPI.createPrediction(requestData);

          results.push(result);
        } catch (e: any) {
          console.error(`提交預測失敗 (${gameId}):`, e);
          console.error('錯誤詳情:', {
            status: e?.response?.status,
            code: e?.response?.data?.code,
            message: e?.response?.data?.message,
            data: e?.response?.data
          });
          throw e;
        }
      }
    }

    // 提交成功
    emit('submit-success', `成功提交 ${results.length} 筆預測！`);

    // 清空選擇
    predictions.value = {};
    
    // 清除所有 radio 選項
    const form = document.getElementById('predict_form') as HTMLFormElement;
    if (form) {
      const radios = form.querySelectorAll('input[type="radio"]');
      radios.forEach((radio: any) => {
        radio.checked = false;
      });
    }
  } catch (e: any) {
    const code = e?.response?.data?.code;
    const message = e?.response?.data?.message;
    const status = e?.response?.status;
    
    console.error('提交預測失敗:', {
      status,
      code,
      message,
      fullError: e
    });
    
    if (status === 500) {
      emit('submit-error', '伺服器錯誤，請稍後再試或聯絡管理員');
    } else if (code === 'GAME_STARTED') {
      emit('submit-error', '賽事已開始，無法建立預測');
    } else if (code === 'PREDICTION_EXISTS') {
      emit('submit-error', '已對部分賽事建立過相同類型的預測');
    } else if (code === 'GAME_NOT_FOUND') {
      emit('submit-error', '賽事不存在或已被移除');
    } else if (code === 'UNAUTHORIZED') {
      emit('submit-error', '登入已過期，請重新登入');
    } else {
      emit('submit-error', message || '提交預測失敗，請稍後再試');
    }
  } finally {
    submitting.value = false;
  }
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
/* 提交預測按鈕區域 */
.submit-prediction-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.selected-count {
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.selected-count strong {
  font-size: 24px;
  font-weight: bold;
  margin: 0 4px;
}

.btn-submit-prediction {
  padding: 12px 32px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-submit-prediction:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  background: #f8f9fa;
}

.btn-submit-prediction:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit-prediction:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #e0e0e0;
  color: #999;
}

.btn-submit-prediction i {
  margin-right: 8px;
}

.btn-submit-prediction .fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

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
  
  .submit-prediction-bar {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  
  .selected-count {
    font-size: 14px;
  }
  
  .btn-submit-prediction {
    width: 100%;
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
