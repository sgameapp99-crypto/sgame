<template>
  <div class="member-page">
    <div class="member-showroom">
      <div v-if="memberLoading" class="member-state member-state--loading">
        <p class="member-state__title">會員資料載入中</p>
        <p class="member-state__desc">請稍候，我們正在同步最新資料。</p>
      </div>
      <div v-else-if="memberError" class="member-state member-state--error">
        <p class="member-state__title">{{ memberError }}</p>
        <p class="member-state__desc">請確認會員編號是否正確，或稍後再試。</p>
      </div>
      <template v-else>
        <!-- 主要內容區域 -->
        <div class="member-maincon">
          <!-- 頂部篩選區 - 使用完整的 AllianceMenu 組件 -->
          <div v-if="activeTab === 'predict'" class="member-alliance-menu">
            <AllianceMenu
              :selected-alliance="selectedAlliance"
              :selected-soccer-league="selectedSoccerLeague"
              :selected-status-type="selectedStatusType"
              :selected-date-range="selectedDateRange"
              :baseball-expanded="baseballExpanded"
              :basketball-expanded="basketballExpanded"
              :other-expanded="otherExpanded"
              :soccer-leagues-expanded="soccerLeaguesExpanded"
              :calendar-visible="calendarVisible"
              :current-month="currentMonth"
              :selected-date="selectedDate"
              :calendar-dates="calendarDates"
              :show-time-selector="true"
              :date-options-filter="['past7', 'past30', 'week', 'month', 'all']"
              @select-alliance="selectAlliance"
              @select-soccer-league="selectSoccerLeague"
              @select-date-option="selectDateOption"
              @toggle-baseball-expanded="toggleBaseballExpanded"
              @toggle-basketball-expanded="toggleBasketballExpanded"
              @toggle-other-expanded="toggleOtherExpanded"
              @toggle-calendar="toggleCalendar"
              @select-date="handleSelectDate"
              @prev-month="prevMonth"
              @next-month="nextMonth"
              @close-calendar="closeCalendar"
            />
          </div>
          <!-- 預測頁面 -->
          <div v-if="activeTab === 'predict'" class="tab-content">
            <div v-if="isSelf" class="member-featured-card">
              <div class="member-featured-card__header">
                <div>
                  <h3>主推管理</h3>
                  <p>同時間僅能有一筆主推，更新後會同步套用在主推榜與商城。</p>
                </div>
                <div class="member-featured-card__header-actions">
                  <button
                    type="button"
                    class="member-featured-card__action member-featured-card__action--outline"
                    :disabled="featureCandidatesLoading || (!showFeatureManager && featureCandidates.length === 0)"
                    @click="toggleFeatureManager"
                  >
                    <i class="fas" :class="showFeatureManager ? 'fa-chevron-up' : 'fa-star'"></i>
                    {{ showFeatureManager ? '收合候選' : '設定主推' }}
                  </button>
                  <button
                    v-if="currentFeaturedPrediction"
                    type="button"
                    class="member-featured-card__action member-featured-card__action--ghost"
                    :disabled="featureActionLoading"
                    @click="handleCancelFeatured(currentFeaturedPrediction.id)"
                  >
                    取消主推
                  </button>
                </div>
              </div>

              <div v-if="currentFeaturedPrediction" class="member-featured-card__current">
                <div class="member-featured-card__badge">現行主推</div>
                <div class="member-featured-card__current-game">
                  {{ currentFeaturedPrediction.gameInfo?.homeTeam || '主隊' }}
                  <span>vs</span>
                  {{ currentFeaturedPrediction.gameInfo?.awayTeam || '客隊' }}
                </div>
                <div class="member-featured-card__current-meta">
                  {{ currentFeaturedPrediction.predictionTypeLabel || currentFeaturedPrediction.predictionType }}
                  ·
                  {{ currentFeaturedPrediction.selectionLabel || currentFeaturedPrediction.selection || '—' }}
                  <span class="member-featured-card__current-time">
                    ｜ {{ formatGameSchedule(currentFeaturedPrediction.gameInfo) }}
                  </span>
                </div>
                <div
                  v-if="currentFeaturedPrediction.featuredNote"
                  class="member-featured-card__current-note"
                >
                  {{ currentFeaturedPrediction.featuredNote }}
                </div>
              </div>

              <p
                v-if="featureActionMessage"
                class="member-featured-card__feedback member-featured-card__feedback--success"
              >
                {{ featureActionMessage }}
              </p>
              <p
                v-else-if="featureActionError"
                class="member-featured-card__feedback member-featured-card__feedback--error"
              >
                {{ featureActionError }}
              </p>

              <div v-if="featureCandidatesLoading" class="member-featured-card__state">
                主推候選載入中…
              </div>
              <div
                v-else-if="featureCandidatesError"
                class="member-featured-card__state member-featured-card__state--error"
              >
                {{ featureCandidatesError }}
              </div>
              <div
                v-else-if="featureCandidates.length === 0"
                class="member-featured-card__state"
              >
                目前沒有未開賽的預測可設定為主推，請先在預測頁建立新預測。
              </div>
              <transition name="member-featured-collapse">
                <div
                  v-show="showFeatureManager && featureCandidates.length > 0"
                  class="member-featured-card__list-wrapper"
                >
                  <ul class="member-featured-card__list">
                    <li
                      v-for="candidate in featureCandidates"
                      :key="candidate.id"
                      class="member-featured-card__item"
                    >
                      <div class="member-featured-card__item-main">
                        <strong>
                          {{ candidate.gameInfo?.homeTeam || '主隊' }}
                          <span>vs</span>
                          {{ candidate.gameInfo?.awayTeam || '客隊' }}
                        </strong>
                        <span class="member-featured-card__item-meta">
                          {{ candidate.predictionTypeLabel || candidate.predictionType }}
                          ·
                          {{ candidate.selectionLabel || candidate.selection || '—' }}
                        </span>
                        <span class="member-featured-card__date">
                          {{ formatGameSchedule(candidate.gameInfo) }}
                        </span>
                      </div>
                      <button
                        type="button"
                        class="member-featured-card__action member-featured-card__action--primary"
                        :disabled="featureActionLoading"
                        @click="handleSetFeatured(candidate.id)"
                      >
                        設為主推
                      </button>
                    </li>
                  </ul>
                  <label class="member-featured-card__note-field">
                    <span>主推備註（可選）</span>
                    <input
                      type="text"
                      :disabled="featureActionLoading"
                      v-model="featureNote"
                      maxlength="200"
                      placeholder="例：今日主推場，建議提前購買"
                    >
                  </label>
                </div>
              </transition>
            </div>

            <div class="allpredictionbox">
              <!-- 國際盤預測表格 -->
              <div class="universe-tablebox">
                <form action="/predict/setGohomer" method="POST" name="igohomerform">
                  <table border="0" cellspacing="0" cellpadding="0" class="universe-tablecon tablecon--height">
                    <input type="hidden" name="predictGameMode" value="2">
                    <tbody>
                      <tr>
                        <th colspan="2" class="gameevent">國際盤賽事</th>
                        <th class="managerpredictcon">預測</th>
                        <th class="predictresult">結果</th>
                      </tr>
                      <template v-if="filteredPredictions.filter((p: any) => p.predictionType?.startsWith('international_')).length > 0">
                        <tr v-for="(prediction, index) in filteredPredictions.filter((p: any) => p.predictionType?.startsWith('international_'))" :key="prediction.id" :class="{ 'evenrow': index % 2 === 1 }">
                          <td rowspan="1" class="gamenum">
                            <ul>
                              <li>{{ prediction.gameInfo?.allianceName || 'N/A' }}</li>
                              <li>{{ prediction.gameInfo?.gameTime || '--:--' }}</li>
                            </ul>
                          </td>
                          <td rowspan="1">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <th>{{ prediction.gameInfo?.homeTeam || '主隊' }}</th>
                                <td class="secondteam"></td>
                              </tr>
                              <tr>
                                <th class="secondteam">{{ prediction.gameInfo?.awayTeam || '客隊' }}(主)</th>
                                <td class="secondteam"></td>
                              </tr>
                            </table>
                          </td>
                          <td class="managerpredictcon">
                            {{ prediction.predictionTypeLabel || prediction.predictionType }} 
                            <span class="predict-bet-weight">{{ prediction.selectionLabel || prediction.selection }}</span>
                          </td>
                          <td class="predictresult" :class="{ 'incorrect': prediction.status === 'lose' }">
                            <span v-if="prediction.status === 'pending'">等待中</span>
                            <span v-else-if="prediction.status === 'win'">✓</span>
                            <span v-else-if="prediction.status === 'lose'">囧</span>
                            <span v-else>{{ prediction.status }}</span>
                          </td>
                        </tr>
                      </template>
                      <tr v-else>
                        <td colspan="4" class="no-predict">無預測</td>
                      </tr>
                    </tbody>
                  </table>
                  <input type="hidden" name="gamedate" value="20250919">
                  <input type="hidden" name="gameday" value="today">
                  <input type="hidden" name="allianceid" value="1">
                </form>
              </div>

              <!-- 運彩盤預測表格 -->
              <div class="bank-tablebox">
                <form action="/predict/setGohomer" method="POST" name="gohomerform">
                  <table border="0" cellspacing="0" cellpadding="0" class="bank-tablecon tablecon--height">
                    <input type="hidden" name="predictGameMode" value="1">
                    <tbody>
                      <tr>
                        <th colspan="2" class="gameevent">運彩盤賽事</th>
                        <th class="managerpredictcon">預測</th>
                        <th class="predictresult">結果</th>
                      </tr>
                      <template v-if="filteredPredictions.filter((p: any) => p.predictionType?.startsWith('taiwan_')).length > 0">
                        <tr v-for="(prediction, index) in filteredPredictions.filter((p: any) => p.predictionType?.startsWith('taiwan_'))" :key="prediction.id" :class="{ 'evenrow': index % 2 === 1 }">
                          <td rowspan="1" class="gamenum">
                            <ul>
                              <li>{{ prediction.gameInfo?.allianceName || 'N/A' }}</li>
                              <li>{{ prediction.gameInfo?.gameTime || '--:--' }}</li>
                            </ul>
                          </td>
                          <td rowspan="1">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <th>{{ prediction.gameInfo?.homeTeam || '主隊' }}</th>
                                <td class="secondteam"></td>
                              </tr>
                              <tr>
                                <th class="secondteam">{{ prediction.gameInfo?.awayTeam || '客隊' }}(主)</th>
                                <td class="secondteam"></td>
                              </tr>
                            </table>
                          </td>
                          <td class="managerpredictcon">
                            {{ prediction.predictionTypeLabel || prediction.predictionType }} 
                            <span class="predict-bet-weight">{{ prediction.selectionLabel || prediction.selection }}</span>
                          </td>
                          <td class="predictresult" :class="{ 'incorrect': prediction.status === 'lose' }">
                            <span v-if="prediction.status === 'pending'">等待中</span>
                            <span v-else-if="prediction.status === 'win'">✓</span>
                            <span v-else-if="prediction.status === 'lose'">囧</span>
                            <span v-else>{{ prediction.status }}</span>
                          </td>
                        </tr>
                      </template>
                      <tr v-else>
                        <td colspan="4" class="no-predict">無預測</td>
                      </tr>
                    </tbody>
                  </table>
                  <input type="hidden" name="gamedate" value="20250919">
                  <input type="hidden" name="gameday" value="today">
                  <input type="hidden" name="allianceid" value="1">
                </form>
              </div>
            </div>
          </div>

        <!-- 榮譽點紀錄頁面 -->
        <div v-if="activeTab === 'bet' && isSelf" class="tab-content">
          <template v-if="canViewCoinInfo">
            <div class="betmember_icon">
              <p class="betmember_icon__number">
                榮譽點帳戶編號 <span id="textcopy">{{ betAccountId }}</span>
                <button name="textcopy" class="textcopy js-textcopy" @click="copyBetAccount">複製</button>
              </p>
              <div v-if="showCopyPrompt" id="js-textcopy_prompt" class="textcopy_prompt">
                已複製榮譽點帳戶編號
                <button @click="showCopyPrompt = false"> x </button>
              </div>
            </div>

            <div id="js-bets-table">
              <div v-if="coinTransactionsLoading" class="coin-transactions-loading">
                正在載入近期紀錄...
              </div>
              <div v-else-if="coinTransactionsError" class="coin-transactions-error">
                {{ coinTransactionsError }}
              </div>
              <div v-else-if="coinTransactions.length === 0" class="coin-transactions-empty">
                <p>目前尚無榮譽點獲得或使用紀錄。</p>
              </div>
              <ul v-else class="coin-transactions-list">
                <li
                  v-for="transaction in coinTransactions"
                  :key="transaction.id"
                  class="coin-transaction-item"
                >
                  <div class="coin-transaction-main">
                    <span class="coin-transaction-reason">{{ transaction.reason }}</span>
                    <span
                      class="coin-transaction-amount"
                      :class="transaction.type === 'earn' ? 'earn' : 'spend'"
                    >
                      {{ transaction.type === 'earn' ? '+' : '-' }}{{ transaction.amount.toLocaleString() }}
                    </span>
                  </div>
                  <div class="coin-transaction-meta">
                    <span class="coin-transaction-date">{{ formatDateTime(transaction.createdAt) }}</span>
                    <span class="coin-transaction-balance">餘額 {{ transaction.balance.toLocaleString() }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </template>
          <div v-else class="coin-transactions-locked">
            榮譽點帳戶資訊僅限本人查看。
          </div>
        </div>

        <!-- 戰績頁面 -->
        <div v-if="activeTab === 'record'" class="tab-content">
          <div class="record-summary">
            <h2>戰績總覽</h2>
            <p class="record-summary__desc">
              <span v-if="predictionStatsLoading">戰績統計載入中...</span>
              <span v-else-if="predictionStatsError">{{ predictionStatsError }}</span>
              <span v-else>以下數據來自最新的預測結果統計。</span>
            </p>

            <div v-if="predictionStatsLoading" class="record-placeholder">載入中...</div>
            <div v-else-if="predictionStatsError" class="record-placeholder record-placeholder--error">{{ predictionStatsError }}</div>
            <div v-else-if="!predictionStats" class="record-placeholder">尚無戰績資料</div>
            <div v-else class="record-grid">
              <div class="record-card">
                <div class="record-card__label">總場次 / 已結算</div>
                <div class="record-card__value">{{ predictionStats.totals.total }}</div>
                <div class="record-card__meta">已結算 {{ predictionStats.totals.settled }} 場，待結算 {{ predictionStats.totals.pending }} 場</div>
              </div>
              <div class="record-card">
                <div class="record-card__label">勝 / 敗 / 取消</div>
                <div class="record-card__value">{{ predictionStats.totals.win }} / {{ predictionStats.totals.lose }} / {{ predictionStats.totals.cancelled }}</div>
                <div class="record-card__meta">勝敗統計含所有已結算場次</div>
              </div>
              <div class="record-card">
                <div class="record-card__label">命中率</div>
                <div class="record-card__value">
                  {{ predictionStats.accuracy != null ? `${predictionStats.accuracy}%` : '--' }}
                </div>
                <div class="record-card__meta">以已結算場次為基礎計算</div>
              </div>
              <div class="record-card">
                <div class="record-card__label">連勝狀態</div>
                <div class="record-card__value">
                  <template v-if="predictionStats.currentStreak">
                    {{ predictionStats.currentStreak.type === 'win' ? '連勝' : '連敗' }} {{ predictionStats.currentStreak.count }}
                  </template>
                  <template v-else>--</template>
                </div>
                <div class="record-card__meta">
                  <span v-if="predictionStats.lastResultAt">最近紀錄：{{ formatDateTime(predictionStats.lastResultAt) }}</span>
                  <span v-else>近期尚無結算紀錄</span>
                </div>
              </div>
            </div>
          </div>

          <div class="record-history">
            <div class="record-history__header">
              <div>
                <h3>歷史戰績</h3>
                <p class="record-history__desc">查詢會員過往預測結果，支援結果與區間篩選。</p>
              </div>
              <div class="record-history__filters">
                <label class="record-history__filter">
                  <span>結果</span>
                  <select :value="historyFilters.status" @change="onHistoryStatusSelect">
                    <option v-for="option in historyStatusOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </label>
                <label class="record-history__filter">
                  <span>區間</span>
                  <select :value="historyFilters.dateRange" @change="onHistoryDateRangeSelect">
                    <option v-for="option in historyDateRangeOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </label>
              </div>
            </div>

            <div v-if="historyLoading" class="record-placeholder">歷史戰績載入中...</div>
            <div v-else-if="historyError" class="record-placeholder record-placeholder--error">{{ historyError }}</div>
            <div v-else-if="historyPredictions.length === 0" class="record-placeholder">尚無符合條件的戰績</div>
            <div v-else class="record-history__table-wrapper">
              <table class="record-history-table">
                <thead>
                  <tr>
                    <th>賽事</th>
                    <th>玩法 / 選擇</th>
                    <th>售價</th>
                    <th>結果</th>
                    <th>結算時間</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="prediction in historyPredictions" :key="`history-${prediction.id}`">
                    <td>
                      <div class="record-history__game">{{ prediction.gameInfo?.allianceName || '—' }}</div>
                      <div class="record-history__teams">
                        {{ prediction.gameInfo?.homeTeam || '主隊' }}
                        <span>vs</span>
                        {{ prediction.gameInfo?.awayTeam || '客隊' }}
                      </div>
                    </td>
                    <td>
                      <div class="record-history__type">{{ prediction.predictionTypeLabel || prediction.predictionType }}</div>
                      <div class="record-history__selection">
                        <span v-if="canRevealPrediction(prediction)">
                          {{ prediction.selectionLabel || prediction.selection || '—' }}
                        </span>
                        <span v-else class="record-history__locked">購買後揭露</span>
                      </div>
                      <div
                        v-if="canRevealPrediction(prediction) && prediction.note"
                        class="record-history__note"
                      >
                        {{ prediction.note }}
                      </div>
                    </td>
                    <td class="record-history__price">
                      {{ prediction.price > 0 ? `${prediction.price.toLocaleString()} 榮譽點` : '免費' }}
                    </td>
                    <td>
                      <span class="record-history__result-badge" :class="getPredictionStatusClass(prediction.status)">
                        {{ getPredictionStatusLabel(prediction.status) }}
                      </span>
                    </td>
                    <td>
                      {{ formatDateTime(prediction.settledAt || prediction.updatedAt || prediction.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="record-history__pagination">
                <button type="button" :disabled="!historyHasPrev" @click="goToHistoryPage(historyPagination.page - 1)">
                  上一頁
                </button>
                <span>第 {{ historyPagination.page }} / {{ historyTotalPages }} 頁</span>
                <button type="button" :disabled="!historyHasNext" @click="goToHistoryPage(historyPagination.page + 1)">
                  下一頁
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 討論頁面 -->
        <div v-if="activeTab === 'forum'" class="tab-content">
          <div class="discussion-summary">
            <h2 class="discussion-summary__title">討論區</h2>
            <p class="discussion-summary__desc">
              <span v-if="forumStatsLoading">討論統計載入中...</span>
              <span v-else-if="forumStatsError">{{ forumStatsError }}</span>
              <span v-else>熱門文章與發文統計來自論壇資料，會依據最新互動更新。</span>
            </p>
            <ul class="discussion-summary__list">
              <li>
                <span class="label">熱門文章數</span>
                <span class="value">{{ discussionStats.hotPosts }}</span>
              </li>
              <li>
                <span class="label">總發文數</span>
                <span class="value">{{ discussionStats.totalPosts }}</span>
              </li>
              <li>
                <span class="label">文章獲得回文</span>
                <span class="value">{{ discussionStats.commentsReceived }}</span>
              </li>
              <li>
                <span class="label">我寫的回文</span>
                <span class="value">{{ discussionStats.commentsWritten }}</span>
              </li>
              <li>
                <span class="label">累積讚數</span>
                <span class="value">{{ discussionStats.totalLikes }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 榮譽頁面 -->
        <div v-if="activeTab === 'honor'" class="tab-content">
          <div class="tagsection"></div>

          <div class="allpredictionbox">
            <div class="bank-tablebox member-forum-tablebox">
              <!-- MEDAL START -->
              <div class="games_medal">
                <div class="medal medal--border" style="text-align: left;">
                  <span class="medal-title">預測/殺手<span class="medal-arrow"></span></span>
                  <ul class="medal-box">
                    <li class="medal-box-content">
                      <span class="medal-icon">🏅</span>
                      <span>殺莊高手</span>
                      <strong class="medal-count">0</strong>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">🎯</span>
                      <span>單月高手</span>
                      <strong class="medal-count">0</strong>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">🏆</span>
                      <span>蟬聯殺莊高手</span>
                      <strong class="medal-count">0</strong>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">⭐</span>
                      <span>蟬聯單月高手</span>
                      <strong class="medal-count">0</strong>
                    </li>
                    <li class="medal-box-content">
                      <span class="medal-icon">📈</span>
                      <span>殺手販售預測<br>突破200人</span>
                      <strong class="medal-count">0</strong>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- MEDAL END -->

              <table border="0" cellspacing="0" cellpadding="0" class="bank-tablecon member-forum-tablecon">
                <tbody>
                  <tr>
                    <th class="member-honor-date">時間</th>
                    <th class="member-honor-subject">榮譽</th>
                  </tr>
                  <tr>
                    <td colspan="2" style="text-align:center;border-right:1px solid #d9d9d9;">
                      <span class="nodata">無榮譽</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="honor-divider"></div>
              <div class="pagination sabrosus" style="margin-top: 25px; font-size: 13px;"></div>
            </div>
          </div>
        </div>

        <!-- 明燈表頁面 -->
        <div v-if="activeTab === 'lamps' && isSelf" class="tab-content lamps-tab">
          <div class="lamps-header">
            <h2>明燈表</h2>
            <p>查看我追蹤的高手名單，掌握最新動態。</p>
          </div>

          <div v-if="lampLoading && !lampsLoaded" class="lamps-placeholder">明燈清單載入中...</div>
          <div v-else-if="lampError" class="lamps-placeholder lamps-placeholder--error">{{ lampError }}</div>
          <div v-else-if="lampFollowings.length === 0" class="lamps-placeholder">尚未追蹤任何明燈，前往會員頁為高手點亮吧！</div>

          <ul v-else class="lamp-list">
            <li v-for="lamp in lampFollowings" :key="lamp.id" class="lamp-item">
              <div class="lamp-avatar">
                <img :src="lamp.avatarUrl || defaultBlackAvatar" :alt="`${lamp.name} 的頭像`" />
              </div>
              <div class="lamp-info">
                <div class="lamp-name">{{ lamp.name }}</div>
                <div class="lamp-meta">
                  <span class="lamp-level" v-if="lamp.levelInfo">
                    <span class="lamp-level-icon">{{ lamp.levelInfo.icon || '⭐' }}</span>
                    {{ lamp.levelInfo.name }}
                  </span>
                  <span class="lamp-following-since" v-if="lamp.followingSince">
                    加入於 {{ formatDateTime(lamp.followingSince) }}
                  </span>
                </div>
              </div>
            </li>
          </ul>

          <div class="lamp-actions" v-if="lampHasNext">
            <button class="lamp-loadmore" @click="loadLampFollowings(true)" :disabled="lampLoading">
              {{ lampLoading ? '載入中...' : '載入更多' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 右側：其他區塊（側邊欄／人氣／篩選） -->
      <div class="member-others">
        <!-- 會員側邊欄 -->
        <div id="member-sidebar" class="member-sidebar">
          <div class="photoframe">
            <img :src="getAvatarUrl(memberInfo.avatarUrl)" :alt="memberInfo.name || '會員頭像'" />
          </div>
          <p class="memberidname">{{ memberInfo.name }}</p>
          <div class="member-level-badge" :style="{ borderColor: levelColor }" aria-live="polite">
            <span class="level-icon" aria-hidden="true">{{ memberInfo.levelInfo?.icon || '⭐' }}</span>
            <span class="level-name" :style="{ color: levelColor }">{{ memberInfo.levelInfo?.name || memberInfo.level }}</span>
          </div>
          <div class="member-level-progress" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100" :aria-label="`等級進度 ${progressPercent}%`">
            <div class="bar" :style="{ width: progressPercent + '%', background: levelColor }"></div>
          </div>
          
          <!-- 榮譽點餘額顯示 -->
          <div v-if="canViewCoinInfo" class="coin-balance-display">
            <div class="coin-balance-label">當前榮譽點餘額</div>
            <div class="coin-balance-amount">{{ coinBalance.toLocaleString() }} 榮譽點</div>
          </div>
          
          <ul class="member-showroom-nav">
            <li :class="{ 'chosen': activeTab === 'predict' }" @click="setActiveTab('predict')">
              <a href="#" class="sidebarEventBtn">
                <strong>預測</strong>
              </a>
            </li>
            <li :class="{ 'chosen': activeTab === 'record' }" @click="setActiveTab('record')">
              <a href="#" class="sidebarEventBtn">
                <strong>戰績</strong>
              </a>
            </li>
            <li v-if="isSelf" :class="{ 'chosen': activeTab === 'bet' }" @click="setActiveTab('bet')">
              <a href="#" class="sidebarEventBtn">
                <strong>榮譽點紀錄</strong>
              </a>
            </li>
            <li :class="{ 'chosen': activeTab === 'forum' }" @click="setActiveTab('forum')">
              <a href="#" class="sidebarEventBtn">
                <strong>討論</strong>
              </a>
            </li>
            <li :class="{ 'chosen': activeTab === 'honor' }" @click="setActiveTab('honor')">
              <a href="#" class="sidebarEventBtn">
                <strong>榮譽</strong>
              </a>
            </li>
            <li v-if="isSelf" :class="{ 'chosen': activeTab === 'lamps' }" @click="setActiveTab('lamps')">
              <a href="#" class="sidebarEventBtn">
                <strong>明燈表</strong>
              </a>
            </li>
          </ul>
          <div class="idstatusbox">
            <div class="addguide_other">
              <p>他是<strong> </strong><strong class="js-poster-friends-count-0">{{ memberInfo.followers }}</strong><strong> </strong>個人的一盞明燈</p>
            </div>
          </div>
          <div class="friend-actions" v-if="!isSelf">
            <button
              v-if="!isFollowing"
              class="follow-btn follow-btn--lamp"
              @click="followUser"
              :disabled="followLoading"
              aria-label="加為明燈"
            >
              <i class="fa fa-lightbulb-o"></i> 加為明燈
            </button>
            <button
              v-else
              class="unfollow-btn"
              @click="unfollowUser"
              :disabled="unfollowLoading"
              aria-label="取消明燈"
            >
              <i class="fa fa-times"></i> 取消明燈
            </button>
          </div>
        </div>

        <!-- 今日人氣 -->
        <!-- 今日人氣區塊暫時隱藏，等待 API 支援 -->
        <!--
        <div class="league-pvnum">
          <div class="league-pvnum__top">
            <p class="league-pvnum--border">
              今日人氣
              <strong>{{ memberStats.todayPopularity }}</strong>
            </p>
            <p>
              多發文可以增加人氣哦～
              <span></span>
            </p>
          </div>
        </div>
        -->

        
      </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';
import { memberAPI, levelAPI, predictionsAPI, coinsAPI } from '../api';
import { getAvatarUrl, DEFAULT_AVATAR, addTimestampToUrl } from '../utils/avatar';
import type { Prediction, DateRange, PredictionStatus } from '../types/prediction';
import type { MemberProfile, MemberFollowing } from '../api/types';
import type { CoinTransaction } from '../types/coin';
import AllianceMenu from '../components/AllianceMenu.vue';
import type { MemberPredictionStats } from '../api/types';

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

// 使用統一的預設頭像
const defaultBlackAvatar = DEFAULT_AVATAR;

// 響應式數據
const activeTab = ref('predict');
const selectedLeague = ref('');
const selectedDateRange = ref('all'); // 預設為"全部"，顯示今天到未來所有預測
const isFollowing = ref<boolean | null>(null);
const followLoading = ref(false);
const unfollowLoading = ref(false);
const memberLoading = ref(true);
const memberError = ref('');

// AllianceMenu 相關的響應式數據
const selectedAlliance = ref(1); // 預設選擇 MLB
const selectedSoccerLeague = ref<number | null>(null);
const selectedStatusType = ref<'finished' | 'live' | 'scheduled'>('all' as any); // 會員頁使用 'all' 顯示全部
const baseballExpanded = ref(false);
const basketballExpanded = ref(false);
const otherExpanded = ref(false);
const soccerLeaguesExpanded = ref(false);
const calendarVisible = ref(false);
const currentMonth = ref('');
const selectedDate = ref(new Date());
const calendarDates = ref<{ date: Date; day: number; isToday: boolean; isSelected: boolean; isCurrentMonth: boolean }[]>([]);
  // 遊戲紀錄狀態
  const showCopyPrompt = ref(false);
  const betAccountId = ref('');
const coinTransactions = ref<CoinTransaction[]>([]);
const coinTransactionsLoading = ref(false);
const coinTransactionsError = ref('');
const forumStatsLoading = ref(false);
const forumStatsError = ref('');
const discussionStats = ref({
  hotPosts: 0,
  totalPosts: 0,
  commentsReceived: 0,
  commentsWritten: 0,
  totalLikes: 0,
});
const predictionStats = ref<MemberPredictionStats | null>(null);
const predictionStatsLoading = ref(false);
const predictionStatsError = ref('');
const canViewCoinInfo = ref(false);
const lampFollowings = ref<MemberFollowing[]>([]);
const lampLoading = ref(false);
const lampError = ref('');
const lampsLoaded = ref(false);
const lampHasNext = ref(false);
const lampNextPage = ref(1);

// 會員資訊
type MemberLevelInfo = MemberProfile['levelInfo'];
type MemberLevelProgress = MemberProfile['levelProgress'];

interface MemberInfoState {
  id: string;
  name: string;
  avatar: string;
  avatarUrl: string;
  followers: number;
  joinDate: string;
  level: string;
  levelInfo?: MemberLevelInfo;
  levelProgress?: MemberLevelProgress;
  bio: string;
}

function createEmptyMemberInfo(): MemberInfoState {
  return {
    id: '',
    name: '',
    avatar: defaultBlackAvatar,
    avatarUrl: defaultBlackAvatar,
    followers: 0,
    joinDate: '',
    level: '',
    levelInfo: undefined,
    levelProgress: undefined,
    bio: '',
  };
}

const memberInfo = ref<MemberInfoState>(createEmptyMemberInfo());

// 會員統計
const memberStats = ref({
  totalPredictions: 1250,
  winRate: 68.5,
  winStreak: 12,
  ranking: 15,
  todayPopularity: 3,
  totalPosts: 312,
  totalThanksPosts: 0,
  internationalWinRate: 60,
  internationalMainWinRate: 36,
  internationalBookmakerKiller: 0,
  internationalSingleKiller: 0,
  bankWinRate: 75,
  bankMainWinRate: 86,
  bankBookmakerKiller: 0,
  bankSingleKiller: 0
});

// 預測記錄 - 使用真實 API
const predictions = ref<Prediction[]>([]);
const predictionsLoading = ref(false);
const predictionsError = ref('');
const totalPredictions = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const featureCandidates = ref<Prediction[]>([]);
const featureCandidatesLoading = ref(false);
const featureCandidatesError = ref('');
const featureNote = ref('');
const featureActionLoading = ref(false);
const featureActionMessage = ref('');
const featureActionError = ref('');
const showFeatureManager = ref(false);

// 歷史戰績列表
const historyPredictions = ref<Prediction[]>([]);
const historyLoading = ref(false);
const historyError = ref('');
const historyPagination = ref({
  page: 1,
  size: 10,
  total: 0,
});
const historyFilters = reactive({
  status: 'all' as PredictionStatus | 'all',
  dateRange: 'past30' as DateRange | 'all',
  sortBy: 'settledAt' as 'createdAt' | 'settledAt',
  order: 'desc' as 'asc' | 'desc',
});

const historyStatusOptions: { value: PredictionStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'win', label: '命中' },
  { value: 'lose', label: '未中' },
  { value: 'pending', label: '等待中' },
  { value: 'cancelled', label: '取消' },
];

const historyDateRangeOptions: { value: DateRange | 'all'; label: string }[] = [
  { value: 'past7', label: '過去7天' },
  { value: 'past30', label: '過去30天' },
  { value: 'all', label: '全部' },
];

// 購買預測功能
const purchaseLoading = ref(false);
const purchaseMessage = ref('');
const purchaseSuccess = ref(false);
const selectedPredictionId = ref<string | null>(null);

// 榮譽點餘額
const coinBalance = ref(0);

// 舊的 mock 數據，暫時保留註解供參考
/*
const oldPredictions = ref([
  {
    id: 1,
    league: 'MLB',
    gameMode: 'international',
    date: '2024-01-15',
    title: '道奇 vs 巨人 主場優勢明顯',
    homeTeam: '道奇',
    awayTeam: '巨人',
    type: '讓分',
    odds: '-1.5',
    result: 'win'
  },
  {
    id: 2,
    league: 'NBA',
    gameMode: 'bank',
    date: '2024-01-14',
    title: '湖人 vs 勇士 大小分預測',
    homeTeam: '湖人',
    awayTeam: '勇士',
    type: '大小分',
    odds: '220.5 大',
    result: 'lose'
  },
  {
    id: 3,
    league: 'CPBL',
    gameMode: 'international',
    date: '2024-01-13',
    title: '統一 vs 樂天 投注建議',
    homeTeam: '統一',
    awayTeam: '樂天',
    type: '勝負',
    odds: '統一勝',
    result: 'pending'
  }
]);
*/

// 榮譽記錄
const memberHonors = ref([
  {
    id: 1,
    icon: '🏆',
    title: '單月高手',
    description: '連續10場預測命中',
    date: '2024-01-10'
  },
  {
    id: 2,
    icon: '⭐',
    title: '天命師',
    description: '被264人追蹤',
    date: '2024-01-05'
  },
  {
    id: 3,
    icon: '🎯',
    title: '精準預測',
    description: '月度命中率達70%',
    date: '2023-12-31'
  }
]);

// API 函數

function formatDateForApi(date: Date) {
  return date.toISOString().split('T')[0];
}

function buildDateRangeParams(range: string | undefined) {
  if (!range || range === 'all') {
    return {};
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const shiftDate = (base: Date, days: number) => {
    const cloned = new Date(base);
    cloned.setDate(cloned.getDate() + days);
    return cloned;
  };

  if (range === 'week') {
    return {
      startDate: formatDateForApi(today),
      endDate: formatDateForApi(shiftDate(today, 7)),
    };
  }

  if (range === 'month') {
    return {
      startDate: formatDateForApi(today),
      endDate: formatDateForApi(shiftDate(today, 30)),
    };
  }

  if (range === 'past7') {
    return {
      startDate: formatDateForApi(shiftDate(today, -7)),
      endDate: formatDateForApi(today),
    };
  }

  if (range === 'past30') {
    return {
      startDate: formatDateForApi(shiftDate(today, -30)),
      endDate: formatDateForApi(today),
    };
  }

  return {};
}

/**
 * 載入會員預測
 */
async function loadPredictions() {
  if (memberError.value) {
    predictionsLoading.value = false;
    predictions.value = [];
    return;
  }
  predictionsLoading.value = true;
  predictionsError.value = '';

  try {
    // 使用與 getViewingMemberId 相同的邏輯獲取會員 ID
    const userId = route.params.id as string || session.userId || session.user?.id;
    
    if (!userId) {
      predictionsError.value = '無法載入預測：未指定會員';
      return;
    }

    const rangePayload = buildDateRangeParams(selectedDateRange.value);

    const requestParams = {
      memberId: userId, // 後端要求使用 memberId 參數
      page: currentPage.value,
      size: pageSize.value,
      ...rangePayload,
    };

    if (selectedDateRange.value && selectedDateRange.value !== 'custom') {
      (requestParams as any).dateRange = selectedDateRange.value;
    }

    // 統一使用 getPredictions API，傳入日期範圍參數
    const result = await predictionsAPI.getPredictions(requestParams);

    if (result.success) {
      predictions.value = result.data || [];
      totalPredictions.value = result.pagination?.total || 0;
      if (isSelf.value) {
        loadCurrentFeaturedPrediction();
      }
      if (isSelf.value) {
        loadFeatureCandidates();
      }
    } else {
      predictionsError.value = '載入預測失敗';
    }
  } catch (e: any) {
    predictionsError.value = e?.response?.data?.message || '載入預測失敗，請稍後再試';
    console.error('載入預測錯誤:', e);
  } finally {
    predictionsLoading.value = false;
  }
}

async function loadFeatureCandidates() {
  if (!isSelf.value) {
    featureCandidates.value = [];
    featureCandidatesError.value = '';
    return;
  }

  featureCandidatesLoading.value = true;
  featureCandidatesError.value = '';

  try {
    const response = await predictionsAPI.getFeatureCandidates();
    if (response.success) {
      featureCandidates.value = response.data || [];
    } else {
      featureCandidates.value = [];
      featureCandidatesError.value = '無法取得可設定主推的預測';
    }
  } catch (error: any) {
    featureCandidates.value = [];
    featureCandidatesError.value = error?.response?.data?.message || '無法取得可設定主推的預測';
  } finally {
    featureCandidatesLoading.value = false;
  }
}

async function handleSetFeatured(predictionId: number) {
  if (featureActionLoading.value) return;

  featureActionLoading.value = true;
  featureActionMessage.value = '';
  featureActionError.value = '';

  try {
    const notePayload = featureNote.value.trim();
    await predictionsAPI.featurePrediction(
      predictionId,
      notePayload ? { note: notePayload } : undefined
    );
    featureActionMessage.value = '主推已更新';
    featureNote.value = '';
    await Promise.all([loadPredictions(), loadFeatureCandidates(), loadCurrentFeaturedPrediction()]);
  } catch (error: any) {
    featureActionError.value = error?.response?.data?.message || '設定主推失敗，請稍後再試';
  } finally {
    featureActionLoading.value = false;
  }
}

async function handleCancelFeatured(predictionId: number) {
  if (featureActionLoading.value) return;

  featureActionLoading.value = true;
  featureActionMessage.value = '';
  featureActionError.value = '';

  try {
    await predictionsAPI.unfeaturePrediction(predictionId);
    featureActionMessage.value = '已取消主推';
    await Promise.all([loadPredictions(), loadFeatureCandidates(), loadCurrentFeaturedPrediction()]);
  } catch (error: any) {
    featureActionError.value = error?.response?.data?.message || '取消主推失敗，請稍後再試';
  } finally {
    featureActionLoading.value = false;
  }
}

async function toggleFeatureManager() {
  if (featureCandidatesLoading.value) return;
  if (!showFeatureManager.value) {
    await loadFeatureCandidates();
    showFeatureManager.value = true;
  } else {
    showFeatureManager.value = false;
  }
}

async function loadCurrentFeaturedPrediction() {
  if (!isSelf.value) {
    currentFeaturedPrediction.value = null;
    return;
  }

  try {
    const userId = route.params.id as string || session.userId || session.user?.id;
    if (!userId) {
      currentFeaturedPrediction.value = null;
      return;
    }

    const response = await predictionsAPI.getPredictions({
      memberId: userId,
      isFeatured: true,
      status: 'pending',
      size: 1,
      sortBy: 'featuredAt',
      order: 'desc',
    });

    if (response.success && response.data?.length) {
      currentFeaturedPrediction.value = response.data[0];
    } else {
      currentFeaturedPrediction.value = null;
    }
  } catch (error) {
    console.error('載入主推預測失敗:', error);
    currentFeaturedPrediction.value = null;
  }
}

async function loadMemberPredictionHistory() {
  const memberId = getViewingMemberId();
  if (!memberId) {
    historyPredictions.value = [];
    historyPagination.value = { page: 1, size: historyPagination.value.size, total: 0 };
    return;
  }

  historyLoading.value = true;
  historyError.value = '';

  try {
    const params = {
      status: historyFilters.status,
      dateRange: historyFilters.dateRange,
      sortBy: historyFilters.sortBy,
      order: historyFilters.order,
      page: historyPagination.value.page,
      size: historyPagination.value.size,
    };

    const response = await memberAPI.getMemberPredictions(memberId, params);
    historyPredictions.value = response.data || [];

    if (response.pagination) {
      const { page = params.page ?? 1, size = params.size ?? historyPagination.value.size, total = 0 } = response.pagination as any;
      historyPagination.value = {
        page,
        size,
        total,
      };
    } else {
      historyPagination.value = {
        ...historyPagination.value,
        total: historyPredictions.value.length,
      };
    }
  } catch (error: any) {
    historyError.value = error?.response?.data?.message || '無法載入歷史戰績';
    historyPredictions.value = [];
  } finally {
    historyLoading.value = false;
  }
}

function handleHistoryStatusChange(value: PredictionStatus | 'all') {
  if (historyFilters.status === value) return;
  historyFilters.status = value;
  historyPagination.value = { ...historyPagination.value, page: 1 };
  loadMemberPredictionHistory();
}

function handleHistoryDateRangeChange(value: DateRange | 'all') {
  if (historyFilters.dateRange === value) return;
  historyFilters.dateRange = value;
  historyPagination.value = { ...historyPagination.value, page: 1 };
  loadMemberPredictionHistory();
}

function goToHistoryPage(page: number) {
  if (page < 1 || page > historyTotalPages.value || page === historyPagination.value.page) {
    return;
  }
  historyPagination.value = { ...historyPagination.value, page };
  loadMemberPredictionHistory();
}

function canRevealPrediction(prediction: Prediction) {
  return prediction.isOwn || prediction.isPurchased || prediction.price === 0;
}

function getPredictionStatusLabel(status: PredictionStatus) {
  const map: Record<PredictionStatus, string> = {
    win: '命中',
    lose: '未中',
    pending: '等待中',
    cancelled: '取消',
  };
  return map[status] ?? status;
}

function getPredictionStatusClass(status: PredictionStatus) {
  return {
    win: 'record-history__result-badge--win',
    lose: 'record-history__result-badge--lose',
    pending: 'record-history__result-badge--pending',
    cancelled: 'record-history__result-badge--cancelled',
  }[status] ?? '';
}

function onHistoryStatusSelect(event: Event) {
  const value = (event.target as HTMLSelectElement).value as PredictionStatus | 'all';
  handleHistoryStatusChange(value);
}

function onHistoryDateRangeSelect(event: Event) {
  const value = (event.target as HTMLSelectElement).value as DateRange | 'all';
  handleHistoryDateRangeChange(value);
}

/**
 * 載入榮譽點餘額
 */
async function loadCoinBalance() {
  if (!session.loggedIn) return;

  try {
    const result = await coinsAPI.getCoinInfo();
    // 後端返回格式：{ accountId, balance, earned, spent }
    if (result.balance !== undefined) {
      coinBalance.value = result.balance;
    }
    if (result.accountId) {
      betAccountId.value = result.accountId;
    }
  } catch (e) {
    // 靜默失敗，不影響其他功能
  }
}

async function loadCoinTransactions(limit = 10) {
  if (!session.loggedIn) return;
  coinTransactionsLoading.value = true;
  coinTransactionsError.value = '';
  try {
    const result = await coinsAPI.getCoinTransactions({ page: 1, size: limit });
    if (result.success) {
      coinTransactions.value = result.data || [];
    } else {
      coinTransactionsError.value = '無法取得榮譽點紀錄';
    }
  } catch (e: any) {
    coinTransactionsError.value = e?.response?.data?.message || '載入榮譽點紀錄失敗';
    coinTransactions.value = [];
  } finally {
    coinTransactionsLoading.value = false;
  }
}

async function loadLampFollowings(loadMore = false) {
  if (!session.loggedIn || !isSelf.value) return;
  if (lampLoading.value) return;

  lampLoading.value = true;
  if (!loadMore) {
    lampError.value = '';
  }

  try {
    const page = loadMore ? lampNextPage.value : 1;
    const response = await memberAPI.getFollowings({ page, size: 20 });
    const list = response.data || [];

    if (loadMore) {
      lampFollowings.value = [...lampFollowings.value, ...list];
    } else {
      lampFollowings.value = list;
    }

    lampHasNext.value = response.pagination?.hasNext ?? false;
    const currentPage = response.pagination?.page ?? page;
    lampNextPage.value = currentPage + 1;
    lampsLoaded.value = true;
  } catch (error: any) {
    lampError.value = error?.response?.data?.message || '無法載入明燈清單';
    if (!loadMore) {
      lampFollowings.value = [];
    }
  } finally {
    lampLoading.value = false;
  }
}

async function loadForumStats(memberId: string | number) {
  forumStatsLoading.value = true;
  forumStatsError.value = '';
  try {
    const stats = await memberAPI.getForumStats(memberId);
    discussionStats.value = {
      hotPosts: stats.hotPosts ?? 0,
      totalPosts: stats.totalPosts ?? 0,
      commentsReceived: stats.commentsReceived ?? stats.totalComments ?? 0,
      commentsWritten: stats.commentsWritten ?? 0,
      totalLikes: stats.totalLikes ?? 0,
    };
  } catch (error: any) {
    forumStatsError.value = error?.response?.data?.message || '無法載入討論統計';
    discussionStats.value = {
      hotPosts: 0,
      totalPosts: 0,
      commentsReceived: 0,
      commentsWritten: 0,
      totalLikes: 0,
    };
  } finally {
    forumStatsLoading.value = false;
  }
}

async function loadPredictionStats(memberId: string | number) {
  predictionStatsLoading.value = true;
  predictionStatsError.value = '';
  try {
    const stats = await memberAPI.getPredictionStats(memberId);
    predictionStats.value = stats;
  } catch (error: any) {
    predictionStatsError.value = error?.response?.data?.message || '無法載入戰績統計';
    predictionStats.value = null;
  } finally {
    predictionStatsLoading.value = false;
  }
}

/**
 * 購買預測
 */
async function purchasePrediction(predictionId: string) {
  if (!session.loggedIn) {
    purchaseMessage.value = '請先登入以購買預測';
    purchaseSuccess.value = false;
    // 導向登入頁面
    setTimeout(() => {
      router.push({ name: 'login', query: { redirect: route.fullPath } });
    }, 1500);
    return;
  }

  purchaseLoading.value = true;
  purchaseMessage.value = '';
  purchaseSuccess.value = false;
  selectedPredictionId.value = predictionId;

  try {
    const result = await predictionsAPI.purchasePrediction(Number(predictionId));

    if (result.success) {
      purchaseMessage.value = '購買成功！';
      purchaseSuccess.value = true;

      // 更新餘額
      if (result.remainingCoins !== undefined) {
        coinBalance.value = result.remainingCoins;
      }

      // 重新載入預測以顯示購買後的內容
      await loadPredictions();

      // 3 秒後清除訊息
      setTimeout(() => {
        purchaseMessage.value = '';
        selectedPredictionId.value = null;
      }, 3000);
    }
  } catch (e: any) {
    const message = e?.response?.data?.message;
    const code = e?.response?.data?.code;

    if (code === 'INSUFFICIENT_BALANCE') {
      purchaseMessage.value = '榮譽點餘額不足';
    } else if (code === 'ALREADY_PURCHASED') {
      purchaseMessage.value = '您已購買過此預測';
    } else if (code === 'SELF_PURCHASE') {
      purchaseMessage.value = '無法購買自己的預測';
    } else {
      purchaseMessage.value = message || '購買失敗，請稍後再試';
    }
    purchaseSuccess.value = false;
  } finally {
    purchaseLoading.value = false;
  }
}

/**
 * 檢查是否已購買預測
 */
function isPredictionPurchased(prediction: Prediction): boolean {
  const currentUserId = session.userId || session.user?.id;
  
  // 如果是自己的預測，總是可見
  if (prediction.userId === currentUserId) {
    return true;
  }

  // 使用 isPurchased 欄位檢查是否已購買
  return prediction.isPurchased || false;
}

// 計算屬性：只保留聯盟篩選，日期篩選已在 API 層面處理
const filteredPredictions = computed(() => {
  let filtered = predictions.value;
  
  // 聯盟篩選（如果有選擇聯盟）
  if (selectedAlliance.value) {
    filtered = filtered.filter((p: any) => p.gameInfo?.allianceId === selectedAlliance.value);
  }
  
  return filtered;
});

const currentFeaturedPrediction = ref<Prediction | null>(null);

const historyTotalPages = computed(() => {
  const size = historyPagination.value.size || 1;
  if (size <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(historyPagination.value.total / size));
});

const historyHasPrev = computed(() => historyPagination.value.page > 1);
const historyHasNext = computed(() => historyPagination.value.page < historyTotalPages.value);

// 等級主題色與進度百分比
const levelColor = computed(() => memberInfo.value.levelInfo?.color || '#667eea');
const progressPercent = computed(() => {
  const p = Number(memberInfo.value.levelProgress?.percentage ?? 0);
  if (Number.isNaN(p)) return 0;
  return Math.max(0, Math.min(100, p));
});

// 判斷是否為本人頁面
const isSelf = computed(() => {
  const viewingId = memberInfo.value.id;
  const currentUserId = session.userId || session.user?.id;
  return viewingId && currentUserId && String(viewingId) === String(currentUserId);
});

watch(isSelf, (value) => {
  if (value && activeTab.value === 'predict') {
    loadFeatureCandidates();
    loadCurrentFeaturedPrediction();
  } else if (!value) {
    featureCandidates.value = [];
    currentFeaturedPrediction.value = null;
  }
});

watch(
  () => activeTab.value,
  (tab) => {
    if (tab === 'predict' && isSelf.value) {
      loadFeatureCandidates();
      loadCurrentFeaturedPrediction();
    }
    if (tab === 'lamps' && isSelf.value && !lampsLoaded.value && !lampLoading.value) {
      loadLampFollowings();
    }
  }
);

// 方法
function setActiveTab(tab: string) {
  activeTab.value = tab;
  if (tab === 'lamps' && isSelf.value && !lampsLoaded.value && !lampLoading.value) {
    loadLampFollowings();
  }
}

async function copyBetAccount() {
  try {
    await navigator.clipboard.writeText(betAccountId.value);
    showCopyPrompt.value = true;
    setTimeout(() => (showCopyPrompt.value = false), 1500);
  } catch {}
}

// follow/unfollow 實作見上方：followUser / unfollowUser

// 載入會員資料的函數
function getViewingMemberId(): string {
  // 優先使用 history.state（不顯示於網址列的內部導航）
  const fromState = (history.state && (history.state as any).memberId) as string | undefined;
  const paramId = (route.params.id as string) || '';
  // 避免誤把 "profile" 等保留字當成會員ID
  const reserved = new Set(['profile']);
  const safeParamId = reserved.has(paramId?.toLowerCase?.()) ? '' : paramId;
  return fromState || safeParamId || session.userId || (session.user?.id as string) || '';
}

async function loadMemberData(): Promise<boolean> {
  const targetId = getViewingMemberId();
  if (!targetId) {
    memberError.value = '查無此用戶';
    memberLoading.value = false;
    memberInfo.value = createEmptyMemberInfo();
    isFollowing.value = null;
    return false;
  }

  memberLoading.value = true;
  memberError.value = '';
  let isSuccess = false;
  let relationshipsLoaded = false;

  try {
    const data = await memberAPI.getProfile(targetId);
    if (data.success && data.profile) {
      const p = data.profile;
      const rawAvatarUrl = p.avatarUrl || p.avatar;
      const finalAvatarUrl = rawAvatarUrl ? addTimestampToUrl(rawAvatarUrl) : undefined;

      memberInfo.value = {
        id: String(p.id ?? targetId),
        name: p.name ?? '',
        avatar: p.avatar || defaultBlackAvatar,
        avatarUrl: finalAvatarUrl || defaultBlackAvatar,
        followers: p.followersCount ?? 0,
        joinDate: p.joinedAt || '',
        level: p.level || '',
        levelInfo: p.levelInfo,
        levelProgress: p.levelProgress,
        bio: p.bio || '',
      };

      canViewCoinInfo.value = !!data.permissions?.canViewCoinInfo;

      const currentUserId = session.userId || session.user?.id;
      if (!currentUserId || String(currentUserId) !== String(targetId)) {
        lampsLoaded.value = false;
        lampFollowings.value = [];
        lampHasNext.value = false;
        lampNextPage.value = 1;
      }

      if (data.relationships) {
        isFollowing.value = !!data.relationships.isFollowing;
        relationshipsLoaded = true;
      }

      isSuccess = true;
    } else {
      memberError.value = '查無此用戶';
    }
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 404) {
      memberError.value = '查無此用戶';
    } else {
      memberError.value = e?.response?.data?.message || '載入會員資料失敗，請稍後再試';
    }
    memberInfo.value = createEmptyMemberInfo();
    isFollowing.value = null;
  } finally {
    memberLoading.value = false;
  }

  if (isSuccess && !relationshipsLoaded) {
    try {
      const rel = await memberAPI.getRelationships(targetId);
      isFollowing.value = !!rel?.isFollowing;
    } catch {
      // ignore
    }
  }

  if (!isSuccess && !memberError.value) {
    memberError.value = '查無此用戶';
  }

  return isSuccess;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatGameSchedule(info?: Prediction['gameInfo']) {
  if (!info) return '--';
  const date = info.gameDate ?? '';
  const time = info.gameTime ?? '';
  return [date, time].filter(Boolean).join(' ');
}

// 監聽大頭貼更新事件
function handleAvatarUpdate(event: Event) {
  // 如果是自己的會員頁面，重新載入資料
  const targetId = getViewingMemberId();
  if (targetId === session.userId) {
    // 立即更新大頭貼 URL 避免快取
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.url) {
      const timestamp = new Date(customEvent.detail.updatedAt || Date.now()).getTime();
      // url 已經是相對路徑 (如 /uploads/avatars/xxx.jpg)，使用工具函數加時間戳
      memberInfo.value.avatarUrl = addTimestampToUrl(customEvent.detail.url, timestamp);
    }
    // 然後重新載入完整資料
    loadMemberData();
  }
}

// 監聽名稱更新事件
function handleNameUpdate(event: Event) {
  // 如果是自己的會員頁面，立即更新顯示的名稱
  const targetId = getViewingMemberId();
  if (targetId === session.userId) {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.name) {
      memberInfo.value.name = customEvent.detail.name;
    }
    // 然後重新載入完整資料以確保同步
    loadMemberData();
  }
}

// 生命週期
onMounted(async () => {
  // 路由層已有 requiresAuth 保護；此處加保險檢查與導轉
  await session.fetchSession(true);
  if (!session.loggedIn) {
    const redirect = encodeURIComponent(route.fullPath);
    router.replace({ name: 'login', query: { redirect } });
    memberLoading.value = false;
    return;
  }
  // 若網址為 /member/profile（誤用），導向自己的會員頁
  if ((route.params.id as string) === 'profile') {
    router.replace('/member');
    return;
  }

  // 確保先拿到自己的 userId，再載入資料
  await session.ensureProfile();
  const memberLoaded = await loadMemberData();
  
  // 初始化日曆月份顯示
  updateMonthDisplay();
  
  // 載入預測數據
  if (memberLoaded) {
    await loadPredictions();
    await loadMemberPredictionHistory();
    
    if (session.loggedIn && isSelf.value && canViewCoinInfo.value) {
      await Promise.all([loadCoinBalance(), loadCoinTransactions()]);
    }

    const targetId = getViewingMemberId();
    if (targetId) {
      await loadForumStats(targetId);
      await loadPredictionStats(targetId);
    }
  }
  
  // 監聽大頭貼更新事件
  window.addEventListener('avatar-updated', handleAvatarUpdate);
  // 監聽名稱更新事件
  window.addEventListener('name-updated', handleNameUpdate);
});

onUnmounted(() => {
  // 移除事件監聽器
  window.removeEventListener('avatar-updated', handleAvatarUpdate);
  window.removeEventListener('name-updated', handleNameUpdate);
});

// 追蹤/取消追蹤串接 API
async function followUser() {
  if (isSelf.value || isFollowing.value === true || followLoading.value) return;
  const id = memberInfo.value.id;
  if (!id) return;
  followLoading.value = true;
  try {
    const res = await memberAPI.follow(id);
    if (res.status === 204) {
      if (isFollowing.value !== true) {
        isFollowing.value = true;
        memberInfo.value.followers++;
      }
    }
  } catch {}
  finally {
    followLoading.value = false;
  }
}

async function unfollowUser() {
  if (isSelf.value || isFollowing.value !== true || unfollowLoading.value) return;
  const id = memberInfo.value.id;
  if (!id) return;
  unfollowLoading.value = true;
  try {
    const res = await memberAPI.unfollow(id);
    if (res.status === 204) {
      if (isFollowing.value === true) {
        isFollowing.value = false;
        if (memberInfo.value.followers > 0) memberInfo.value.followers--;
      }
    }
  } catch {}
  finally {
    unfollowLoading.value = false;
  }
}

// AllianceMenu 相關方法
function selectAlliance(allianceId: number) {
  selectedAlliance.value = allianceId;
  
  // 當選擇足球時，自動展開聯賽選單並選擇"全部"
  if (allianceId === 5) {
    soccerLeaguesExpanded.value = true;
    selectedSoccerLeague.value = 0;
  } else {
    soccerLeaguesExpanded.value = false;
    selectedSoccerLeague.value = null;
  }
  
  // 重新載入預測數據
  loadPredictions();
}

function selectSoccerLeague(leagueId: number) {
  selectedSoccerLeague.value = leagueId;
  loadPredictions();
}

async function selectDateOption(option: any) {
  // 提取日期範圍值
  const rangeValue = option?.type || option?.value || option;
  
  selectedDateRange.value = rangeValue;
  calendarVisible.value = false;
  
  // 重新載入預測，應用新的日期篩選
  await loadPredictions();
}

function toggleBaseballExpanded() {
  baseballExpanded.value = !baseballExpanded.value;
}

function toggleBasketballExpanded() {
  basketballExpanded.value = !basketballExpanded.value;
}

function toggleOtherExpanded() {
  otherExpanded.value = !otherExpanded.value;
}

function toggleCalendar() {
  calendarVisible.value = !calendarVisible.value;
  if (calendarVisible.value) {
    generateCalendar();
  }
}

function closeCalendar() {
  calendarVisible.value = false;
}

function handleSelectDate(date: Date) {
  selectedDate.value = date;
  calendarVisible.value = false;
  // 可以添加根據特定日期載入預測的邏輯
  loadPredictions();
}

function generateCalendar() {
  const today = new Date();
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // 星期一開始

  const dates = [];
  let current = new Date(startDate);

  for (let i = 0; i < 42; i++) { // 6週 x 7天
    const isToday = current.toDateString() === today.toDateString();
    const isSelected = current.toDateString() === selectedDate.value.toDateString();
    const isCurrentMonth = current.getMonth() === month;

    dates.push({
      date: new Date(current),
      day: current.getDate(),
      isToday,
      isSelected,
      isCurrentMonth
    });

    current.setDate(current.getDate() + 1);
  }

  calendarDates.value = dates;
  updateMonthDisplay();
}

function prevMonth() {
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() - 1, 1);
  generateCalendar();
}

function nextMonth() {
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 1);
  generateCalendar();
}

function updateMonthDisplay() {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth();
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  currentMonth.value = `${monthNames[month]} ${year}`;
}
</script>

<style scoped>
.member-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: "微軟正黑體", "Microsoft JhengHei", "新細明體", PMingLiU, Arial, Helvetica, sans-serif;
}

/* AllianceMenu 在會員頁面中的樣式調整 */
.member-alliance-menu {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.member-featured-card {
  border: 1px solid #e0e7ff;
  border-radius: 12px;
  padding: 20px;
  background: #f8f9ff;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-featured-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.member-featured-card__header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.member-featured-card__header h3 {
  margin: 0;
  font-size: 18px;
}

.member-featured-card__header p {
  margin: 4px 0 0;
  color: #475569;
  font-size: 14px;
}

.member-featured-card__action {
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s ease;
}

.member-featured-card__action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.member-featured-card__action--primary {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
}

.member-featured-card__action--outline {
  background: #fff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.member-featured-card__action--outline i {
  font-size: 12px;
}

.member-featured-card__action--ghost {
  background: transparent;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.member-featured-card__current {
  border: 1px solid #cbd5ff;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
}

.member-featured-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  margin-bottom: 8px;
}

.member-featured-card__current-game {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.member-featured-card__current-meta {
  font-size: 14px;
  color: #475569;
}

.member-featured-card__current-time {
  font-size: 12px;
  color: #94a3b8;
}

.member-featured-card__current-note {
  margin-top: 8px;
  padding: 10px;
  border-radius: 8px;
  background: #f1f5f9;
  font-size: 14px;
  color: #0f172a;
}

.member-featured-card__feedback {
  font-size: 14px;
  padding: 10px;
  border-radius: 8px;
}

.member-featured-card__feedback--success {
  background: #dcfce7;
  color: #166534;
}

.member-featured-card__feedback--error {
  background: #fee2e2;
  color: #b91c1c;
}

.member-featured-card__state {
  font-size: 14px;
  color: #475569;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
}

.member-featured-card__state--error {
  color: #b91c1c;
  background: #fef2f2;
}

.member-featured-card__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-featured-card__list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-featured-card__item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  padding: 12px 16px;
  background: #fff;
  flex-wrap: wrap;
}

.member-featured-card__item-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 220px;
}

.member-featured-card__item strong {
  font-size: 15px;
}

.member-featured-card__item-meta {
  font-size: 13px;
  color: #475569;
}

.member-featured-card__date {
  font-size: 12px;
  color: #94a3b8;
}

.member-featured-card__note-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.member-featured-card__note-field input {
  border: 1px solid #cbd5f5;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
}

.member-featured-collapse-enter-active,
.member-featured-collapse-leave-active {
  transition: all 0.2s ease;
}

.member-featured-collapse-enter-from,
.member-featured-collapse-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.member-showroom {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
}

.member-state {
  width: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  padding: 40px 20px;
  text-align: center;
}

.member-state__title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.member-state__desc {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.member-state--loading .member-state__title {
  color: #3b82f6;
}

.member-state--error .member-state__title {
  color: #dc3545;
}

/* 頂部篩選區（簡版對齊原站） */
.tagsection {
  width: 100%;
  max-width: 1200px;
  margin: 10px auto 0;
  order: 4;
}

.tag-league-boxall { margin-bottom: 6px; }

.tag-box { display: flex; align-items: center; }
.tag-box-first { margin-right: 8px; }
.tag-league, .tag-date { list-style: none; margin: 0; padding: 0; display: flex; gap: 6px; color: #333; }
.tag-con { list-style: none; margin: 0; padding: 0; display: flex; gap: 10px; }
.tag-con-big { gap: 16px; }
.tag-con li, .tag-con-big li { cursor: pointer; background: #f7f7f7; border: 1px solid #e0e0e0; padding: 6px 10px; border-radius: 4px; }
.tag-con li a { color: inherit; text-decoration: none; }
.tag-chosen, .tag-chosenbig { background: #ffde00; border-color: #ffc400; }
.nonepredict a { color: #888; }

/* 側邊欄樣式 */
.member-sidebar {
  width: 250px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: fit-content;
  order: 1;
}

.photoframe {
  text-align: center;
  margin-bottom: 15px;
}

.photoframe img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #667eea;
  display: block;
  margin: 0 auto;
}

.memberidname {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.member-level-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 2px solid #667eea;
  border-radius: 999px;
  padding: 4px 10px;
  background: #f8f9fa;
  margin: 0 auto 8px auto;
}
.member-level-badge .level-icon { font-size: 16px; line-height: 1; }
.member-level-badge .level-name { font-size: 13px; font-weight: bold; }

.member-level-progress { width: 100%; height: 8px; background: #eceff3; border-radius: 999px; overflow: hidden; margin: 6px 0 12px 0; }
.member-level-progress .bar { height: 100%; width: 0; transition: width .4s ease; }

/* 榮譽點餘額顯示（側邊欄） */
.coin-balance-display { 
  margin: 0 0 16px 0; 
  padding: 12px; 
  background: linear-gradient(135deg, #f8f9fa 0%, #e3ffbf 100%); 
  border: 2px solid #28a745; 
  border-radius: 8px; 
  text-align: center; 
}
.coin-balance-label { 
  font-size: 12px; 
  color: #666; 
  margin-bottom: 6px; 
  font-weight: 500;
}
.coin-balance-amount { 
  font-size: 18px; 
  font-weight: bold; 
  color: #28a745; 
  letter-spacing: 0.5px;
}

.member-showroom-nav {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.member-showroom-nav li {
  margin-bottom: 5px;
  position: relative;
}

.member-showroom-nav li a {
  display: block;
  padding: 12px 15px;
  color: #666;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.member-showroom-nav li.chosen a {
  background: #667eea;
  color: white;
}

.member-showroom-nav li:hover a {
  background: #f0f0f0;
  color: #333;
}

.member-showroom-nav li.chosen:hover a {
  background: #5a6fd8;
}

.idstatusbox {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.addguide_other p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.friend-actions {
  text-align: center;
}

.follow-btn, .unfollow-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.follow-btn {
  background: #28a745;
  color: white;
}

.follow-btn--lamp {
  background: #ffb400;
  color: #333;
}
.follow-btn--lamp .fa-lightbulb-o { margin-right: 6px; }

.follow-btn:hover {
  background: #218838;
}

.unfollow-btn {
  background: #6c757d;
  color: white;
}

.unfollow-btn:hover {
  background: #5a6268;
}

/* 主要內容區域 */
.member-maincon {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  order: 2;
}

/* 今日人氣區域 */
.league-pvnum {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  margin: 10px 0 15px 0;
  order: 3;
}

.league-pvnum__top {
  display: flex;
  align-items: center;
  gap: 20px;
}

.league-pvnum--border {
  font-weight: bold;
  color: #333;
  margin: 0;
}

.league-pvnum--border strong {
  color: #28a745;
  font-size: 14px;
}

.league-pvnum__top p:last-child {
  color: #666;
  font-size: 12px;
  margin: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.content-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.filter-options {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
}

/* 預測列表 */
.predictions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 預測容器 */
.allpredictionbox {
  width: 100%;
  margin-top: 10px;
}

/* 表格樣式（簡化版對齊原站） */
/* 國際盤表格 */
.universe-tablebox { margin-top: 10px; }
.universe-tablecon { 
  width: 100%; 
  border-collapse: collapse; 
  border: 1px solid #DCDCDC; 
  background: #fff; 
}
.universe-tablecon th, .universe-tablecon td { 
  border-bottom: 1px solid #DCDCDC; 
  border-right: 1px solid #DCDCDC;
  padding: 8px; 
  font-size: 13px; 
  color: #404040; 
}
.universe-tablecon th.gameevent { 
  background: #B8CDF3; 
  color: #000; 
  text-align: left; 
  font-weight: bold;
}
.universe-tablecon th.managerpredictcon, 
.universe-tablecon th.predictresult { 
  text-align: center; 
}
.universe-tablecon tr.evenrow { background: #f8f9fb; }
.universe-tablecon td:last-child { border-right: none; }

/* 運彩盤表格 */
.bank-tablebox { margin-top: 20px; }
.bank-tablecon { 
  width: 100%; 
  border-collapse: collapse; 
  border: 1px solid #DCDCDC; 
  background: #fff; 
}
.bank-tablecon th, .bank-tablecon td { 
  border-bottom: 1px solid #DCDCDC; 
  border-right: 1px solid #DCDCDC;
  padding: 8px; 
  font-size: 13px; 
  color: #404040; 
}
.bank-tablecon th.gameevent { 
  background: #FFE4B5; 
  color: #000; 
  text-align: left; 
  font-weight: bold;
}
.bank-tablecon th.managerpredictcon, 
.bank-tablecon th.predictresult { 
  text-align: center; 
}
.bank-tablecon tr.evenrow { background: #fffef8; }
.bank-tablecon td:last-child { border-right: none; }

/* 共用表格樣式 */
.tablecon--height {
  min-height: 200px;
}
.gamenum { 
  width: 80px; 
  text-align: center;
  vertical-align: middle;
}
.gamenum ul { 
  list-style: none; 
  margin: 0; 
  padding: 0; 
}
.gamenum ul li { 
  line-height: 18px; 
  color: #666;
  font-size: 12px;
}
.gamenum ul li:first-child {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}
.managerpredictcon {
  text-align: left;
  padding-left: 12px;
}
.predict-bet-weight { 
  color: #ff6c00; 
  margin-left: 6px; 
  font-weight: bold;
}
.predictresult { 
  text-align: center; 
  font-weight: bold;
}
.predictresult span {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
}
.predictresult.incorrect,
.predictresult.incorrect span { 
  color: #fff;
  background: #dc3545;
}
.no-predict {
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 14px;
}

/* 球隊名稱嵌套表格 */
.universe-tablecon td table,
.bank-tablecon td table {
  width: 100%;
  border: none;
}
.universe-tablecon td table th,
.universe-tablecon td table td,
.bank-tablecon td table th,
.bank-tablecon td table td {
  border: none;
  padding: 4px 8px;
  text-align: left;
  font-size: 13px;
  font-weight: normal;
}
.universe-tablecon td table th,
.bank-tablecon td table th {
  font-weight: 600;
  color: #333;
}
.universe-tablecon td table .secondteam,
.bank-tablecon td table .secondteam {
  color: #666;
  font-size: 12px;
}

/* ================= 戰績頁面（records-index） ================ */
  .record-summary {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  }
  .record-summary h2 {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }
  .record-summary__desc {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #6b7280;
  }
  .record-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }
  .record-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background: #f9fafb;
  }
  .record-card__label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 6px;
  }
  .record-card__value {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
  }
  .record-card__meta {
    margin-top: 6px;
    font-size: 12px;
    color: #6b7280;
  }
  .record-placeholder {
    padding: 20px;
    text-align: center;
    color: #6b7280;
    border: 1px dashed #d1d5db;
    border-radius: 8px;
  }
  .record-placeholder--error {
    color: #dc2626;
    border-color: #fecaca;
  }
  .record-history {
    margin-top: 24px;
  }
  .record-history__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }
  .record-history__desc {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: #6b7280;
  }
  .record-history__filters {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .record-history__filter {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #6b7280;
  }
  .record-history__filter select {
    margin-top: 4px;
    padding: 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #fff;
    font-size: 13px;
    min-width: 140px;
  }
  .record-history__table-wrapper {
    margin-top: 16px;
  }
  .record-history-table {
    width: 100%;
    border-collapse: collapse;
  }
  .record-history-table th,
  .record-history-table td {
    padding: 12px 10px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    font-size: 13px;
    color: #374151;
  }
  .record-history-table th {
    background: #f9fafb;
    font-weight: 600;
  }
  .record-history__game {
    font-weight: 600;
    color: #111827;
  }
  .record-history__teams {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
  }
  .record-history__type {
    font-weight: 600;
    color: #111827;
  }
  .record-history__selection {
    margin-top: 4px;
    font-size: 13px;
  }
  .record-history__locked {
    color: #9ca3af;
    font-size: 12px;
  }
  .record-history__note {
    margin-top: 4px;
    font-size: 12px;
    color: #6b7280;
  }
  .record-history__price {
    white-space: nowrap;
  }
  .record-history__result-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    background: #e5e7eb;
    color: #374151;
  }
  .record-history__result-badge--win {
    background: #dcfce7;
    color: #15803d;
  }
  .record-history__result-badge--lose {
    background: #fee2e2;
    color: #b91c1c;
  }
  .record-history__result-badge--pending {
    background: #fef3c7;
    color: #b45309;
  }
  .record-history__result-badge--cancelled {
    background: #e0e7ff;
    color: #4338ca;
  }
  .record-history__pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
  }
  .record-history__pagination button {
    padding: 6px 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    font-size: 13px;
  }
  .record-history__pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  @media (max-width: 768px) {
    .record-grid {
      grid-template-columns: 1fr;
    }
    .record-history__header {
      flex-direction: column;
    }
    .record-history__filters {
      width: 100%;
    }
    .record-history__filter {
      width: 100%;
    }
    .record-history__filter select {
      width: 100%;
    }
  }

/* 國際盤/運彩盤表格樣式（戰績） */
.records-index .universe-tablecon,
.records-index .bank-tablecon {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #DCDCDC;
  background: #fff;
}
.records-index .universe-tablecon th,
.records-index .universe-tablecon td,
.records-index .bank-tablecon th,
.records-index .bank-tablecon td {
  border-bottom: 1px solid #DCDCDC;
  padding: 10px 12px;
  font-size: 13px;
  color: #404040;
  text-align: center;
}
.records-index .universe-tablecon th { background: #61b10b; color: #fff; }
.records-index .bank-tablecon th { background: #1fa3ff; color: #fff; }
.records-index .records-killer-mark { width: 12%; }
.records-index .records-league { width: 14%; }
.records-index .records-wins { width: 12%; }
.records-index .records-mainwins { width: 16%; }
.records-index .records-bankerkiller { width: 16%; }
.records-index .records-mainwinskiller { width: 16%; }
.records-index .records-level { width: 14%; }
.records-index .records-mainwinskiller { color: #666; text-align: left; padding-left: 16px; }

/* 戰績上方分類選單（膠囊） */
.tagselect { list-style: none; margin: 0 0 10px 0; padding: 0; display: flex; gap: 10px; }
.tagselect-lv02 { list-style: none; margin: 0; padding: 0; display: flex; }
.tagselect .tag-con, .tagselect .tag-league { margin: 0; padding: 0; }
.tagselect .tag-con li {
  display: inline-block;
  background: #f3f3f3;
  border: 1px solid #ddd;
  color: #333;
  border-radius: 14px;
  padding: 6px 12px;
  font-size: 13px;
}
.tagselect .tag-con li a { color: inherit; text-decoration: none; }
.tagselect .tag-con li.tag-chosen {
  background: #ffde00;
  border-color: #ffc400;
  color: #333;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,0.1);
}

  .discussion-summary {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
    max-width: 520px;
  }
  .discussion-summary__title {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }
  .discussion-summary__desc {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #6b7280;
  }
  .discussion-summary__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .discussion-summary__list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 12px 16px;
  }
  .discussion-summary__list .label {
    color: #374151;
    font-weight: 500;
  }
  .discussion-summary__list .value {
    color: #111827;
    font-weight: 700;
    font-size: 16px;
  }

  /* 遊戲紀錄（bet） */
  .betmember_icon { display: flex; align-items: center; gap: 10px; margin: 10px 0 14px 0; flex-wrap: wrap; }
  .betmember_icon__number { margin: 0; }
  .textcopy { margin-left: 6px; padding: 4px 8px; border: 1px solid #ddd; background: #fff; border-radius: 4px; cursor: pointer; }
  .textcopy_prompt { background: #333; color: #fff; padding: 4px 8px; border-radius: 4px; }
  .betmember_icon__account, .betmember_icon__transfer { display: inline-block; padding: 6px 10px; border-radius: 4px; background: #667eea; color: #fff; text-decoration: none; }
  .betmember_icon__transfer { background: #28a745; }
  .coin-transactions-loading,
  .coin-transactions-error,
  .coin-transactions-empty {
    padding: 20px;
    text-align: center;
    color: #666;
  }
  .coin-transactions-locked {
    padding: 40px 20px;
    text-align: center;
    color: #6b7280;
    border: 1px dashed #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
  }
  .coin-transactions-error { color: #dc3545; }
  .coin-transactions-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .coin-transaction-item {
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  }
  .coin-transaction-main {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
  }
  .coin-transaction-reason {
    font-weight: 600;
    color: #1f2937;
    flex: 1;
  }
  .coin-transaction-amount {
    font-weight: 700;
    font-size: 16px;
  }
  .coin-transaction-amount.earn { color: #16a34a; }
  .coin-transaction-amount.spend { color: #dc2626; }
  .coin-transaction-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7280;
  }
  .coin-transaction-balance { font-weight: 500; }

  /* 明燈表 */
  .lamps-tab {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .lamps-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #111827;
  }
  .lamps-header p {
    margin: 6px 0 0;
    color: #6b7280;
    font-size: 14px;
  }
  .lamps-placeholder {
    padding: 30px;
    text-align: center;
    border: 1px dashed #d1d5db;
    border-radius: 10px;
    background: #fff;
    color: #6b7280;
  }
  .lamps-placeholder--error {
    color: #b91c1c;
    border-color: #fecaca;
    background: #fef2f2;
  }
  .lamp-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .lamp-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #fff;
    box-shadow: 0 4px 8px rgba(15, 23, 42, 0.04);
  }
  .lamp-avatar img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid #dbeafe;
    object-fit: cover;
  }
  .lamp-info { flex: 1; }
  .lamp-name {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }
  .lamp-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
    font-size: 13px;
    color: #6b7280;
  }
  .lamp-level {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    background: #eef2ff;
    color: #4338ca;
    font-weight: 500;
  }
  .lamp-level-icon { font-size: 14px; }
  .lamp-following-since { color: #94a3b8; }
  .lamp-actions { text-align: center; }
  .lamp-loadmore {
    padding: 10px 20px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    min-width: 140px;
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.25);
  }
  .lamp-loadmore:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .discussion-summary { width: 100%; }
  }

  /* ================= 榮譽分頁（medal / honor-table） ================ */
  th.member-honor-date { width: 100px; }
  th.member-honor-subject { width: 600px; }
  td.member-nodata, td.member-honor-subject { border-right:1px solid #d9d9d9; }

  .games_medal { margin: 10px 0 15px 0; }
  .medal { background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px; }
  .medal--border { border-left: 4px solid #667eea; }
  .medal-title { display: inline-flex; align-items: center; gap: 6px; font-weight: bold; color: #333; }
  .medal-title .medal-arrow { width: 10px; height: 10px; border-right: 2px solid #667eea; border-bottom: 2px solid #667eea; transform: rotate(-45deg); display: inline-block; margin-left: 4px; }
  .medal-box { list-style: none; margin: 10px 0 0 0; padding: 0; display: flex; gap: 12px; flex-wrap: wrap; }
  .medal-box-content { background: #f9f9f9; border: 1px solid #e6e6e6; border-radius: 6px; padding: 10px; width: 130px; text-align: center; }
  .medal-box-content .medal-icon { display: block; font-size: 24px; line-height: 1; margin: 0 auto 6px; }
  .medal-box-content span { display: block; color: #333; font-size: 12px; }
  .medal-box-content .medal-count { display: block; color: #ff6c00; font-weight: bold; margin-top: 4px; font-size: 18px; }

  .member-forum-tablecon { width: 100%; border-collapse: collapse; border: 1px solid #DCDCDC; background: #fff; }
  .member-forum-tablecon th, .member-forum-tablecon td { border-bottom: 1px solid #DCDCDC; padding: 10px 12px; font-size: 13px; color: #404040; }
  .member-forum-tablecon th { background: #1fa3ff; color: #fff; text-align: left; }

  /* 榮譽分頁分隔線（取代示意圖片） */
  .honor-divider { width: 100%; height: 12px; margin: 12px 0; background: linear-gradient(90deg, #f1f5ff 0%, #e9efff 50%, #f1f5ff 100%); border-radius: 6px; }

.prediction-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.prediction-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.league-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.league-tag.mlb { background: #1e3a8a; }
.league-tag.nba { background: #dc2626; }
.league-tag.cpbl { background: #059669; }
.league-tag.npb { background: #7c3aed; }

.prediction-date {
  color: #666;
  font-size: 14px;
}

.prediction-content h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.prediction-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.team {
  font-weight: bold;
  color: #333;
}

.vs {
  color: #666;
  font-size: 14px;
}

.prediction-type {
  text-align: right;
}

.type {
  background: #667eea;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 5px;
}

.odds {
  font-weight: bold;
  color: #333;
}

.prediction-result {
  text-align: right;
}

.result-text {
  font-weight: bold;
  font-size: 14px;
}

.prediction-result.win .result-text {
  color: #28a745;
}

.prediction-result.lose .result-text {
  color: #dc3545;
}

.prediction-result.pending .result-text {
  color: #ffc107;
}

/* 戰績統計 */
.record-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #e9ecef;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.record-chart {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.chart-placeholder {
  padding: 40px;
  color: #666;
}

/* 論壇文章 */
/* 榮譽列表 */
.honor-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.honor-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.honor-icon {
  font-size: 24px;
  margin-right: 15px;
}

.honor-content h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.honor-content p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
}

.honor-date {
  color: #999;
  font-size: 12px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .member-showroom {
    flex-direction: column;
    padding: 10px;
  }
  
  .member-sidebar {
    width: 100%;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .filter-options {
    width: 100%;
    justify-content: space-between;
  }
  
  .record-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .prediction-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .team-info {
    flex-wrap: wrap;
  }
}
</style>