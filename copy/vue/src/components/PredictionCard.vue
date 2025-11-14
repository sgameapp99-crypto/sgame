<template>
  <div class="prediction-card" :class="{ 'is-own': prediction.isOwn, 'is-purchased': prediction.isPurchased }">
    <div class="card-header">
      <div class="user-info">
        <img :src="prediction.userAvatarUrl || defaultAvatar" :alt="prediction.userName" class="user-avatar" />
        <span class="user-name">{{ prediction.userName }}</span>
      </div>
      <div class="status-badge" :class="`status-${prediction.status}`">
        {{ getStatusText(prediction.status) }}
      </div>
    </div>

    <div class="game-info">
      <div class="game-meta">
        <span class="alliance-badge">{{ prediction.gameInfo.allianceName }}</span>
        <span class="game-time">{{ formatDateTime(prediction.gameInfo.gameDate, prediction.gameInfo.gameTime) }}</span>
      </div>
      <div class="game-teams">
        <span class="team">{{ prediction.gameInfo.homeTeam }}</span>
        <span class="vs">vs</span>
        <span class="team">{{ prediction.gameInfo.awayTeam }}</span>
      </div>
      <div v-if="prediction.gameInfo.finalScore" class="final-score">
        <span class="score">{{ prediction.gameInfo.finalScore.home }}</span>
        <span class="separator">-</span>
        <span class="score">{{ prediction.gameInfo.finalScore.away }}</span>
      </div>
    </div>

    <div class="prediction-info">
      <div class="prediction-type">
        <span class="type-label">{{ prediction.predictionTypeLabel }}</span>
      </div>
      
      <div v-if="shouldShowSelection" class="prediction-selection">
        <span class="selection-label">{{ prediction.selectionLabel }}</span>
        <span class="odds">@ {{ prediction.odds }}</span>
      </div>
      <div v-else class="prediction-locked">
        <span class="lock-icon">🔒</span>
        <span class="lock-text">購買後可查看預測內容</span>
      </div>

      <div v-if="shouldShowNote && prediction.note" class="prediction-note">
        <p>{{ prediction.note }}</p>
      </div>
    </div>

    <div class="card-footer">
      <div class="price-info">
        <span v-if="prediction.isMainPick" class="main-pick-badge">主推</span>
        <span class="price">{{ prediction.price === 0 ? '免費' : `${prediction.price} 榮譽點` }}</span>
      </div>
      
      <div class="action-buttons">
        <button
          v-if="!prediction.isOwn && !prediction.isPurchased && prediction.price > 0"
          @click="$emit('purchase', prediction)"
          class="btn-purchase"
        >
          購買預測
        </button>
        <button
          v-if="prediction.isOwn && prediction.status === 'pending'"
          @click="$emit('edit', prediction)"
          class="btn-edit"
        >
          編輯
        </button>
        <span v-if="prediction.isPurchased && !prediction.isOwn" class="purchased-badge">
          已購買
        </span>
      </div>
    </div>

    <div class="card-time">
      <span>{{ formatRelativeTime(prediction.createdAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Prediction } from '../types/prediction';

const props = defineProps<{
  prediction: Prediction;
}>();

const emit = defineEmits<{
  purchase: [prediction: Prediction];
  edit: [prediction: Prediction];
}>();

const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="%23ccc"/></svg>';

const shouldShowSelection = computed(() => {
  // 自己的預測或已購買的預測才顯示選擇內容
  return props.prediction.isOwn || props.prediction.isPurchased;
});

const shouldShowNote = computed(() => {
  // 自己的預測或已購買的預測才顯示說明
  return props.prediction.isOwn || props.prediction.isPurchased;
});

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待開獎',
    win: '✓ 中',
    lose: '✗ 槓',
    cancelled: '取消',
  };
  return statusMap[status] || status;
}

function formatDateTime(date: string, time: string): string {
  const d = new Date(date);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[d.getDay()];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}(${weekday}) ${time}`;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return '剛剛';
  if (minutes < 60) return `${minutes} 分鐘前`;
  if (hours < 24) return `${hours} 小時前`;
  if (days < 7) return `${days} 天前`;
  
  return date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
}
</script>

<style scoped>
.prediction-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.prediction-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.prediction-card.is-own {
  border-left: 4px solid #667eea;
}

.prediction-card.is-purchased {
  background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
}

.user-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fff8e1;
  color: #f57c00;
}

.status-win {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-lose {
  background: #ffebee;
  color: #c62828;
}

.status-cancelled {
  background: #f5f5f5;
  color: #757575;
}

.game-info {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.alliance-badge {
  padding: 2px 8px;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.game-time {
  color: #666;
  font-size: 12px;
}

.game-teams {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.team {
  flex: 1;
}

.vs {
  color: #999;
  font-size: 12px;
}

.final-score {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e0e0e0;
}

.score {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.separator {
  color: #999;
  font-size: 16px;
}

.prediction-info {
  margin-bottom: 12px;
}

.prediction-type {
  margin-bottom: 8px;
}

.type-label {
  padding: 4px 10px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.prediction-selection {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 8px;
}

.selection-label {
  font-weight: bold;
  font-size: 15px;
}

.odds {
  font-size: 13px;
  opacity: 0.9;
}

.prediction-locked {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border: 2px dashed #d0d0d0;
  border-radius: 8px;
  color: #666;
  font-size: 13px;
}

.lock-icon {
  font-size: 16px;
}

.prediction-note {
  padding: 10px 12px;
  background: #fffde7;
  border-left: 3px solid #fbc02d;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.prediction-note p {
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-pick-badge {
  padding: 3px 8px;
  background: #ff6f00;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.price {
  font-weight: 600;
  color: #667eea;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-purchase,
.btn-edit {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-purchase {
  background: #667eea;
  color: white;
}

.btn-purchase:hover {
  background: #5a6fd8;
}

.btn-edit {
  background: #e0e0e0;
  color: #666;
}

.btn-edit:hover {
  background: #d0d0d0;
}

.purchased-badge {
  padding: 6px 14px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.card-time {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

.card-time span {
  color: #999;
  font-size: 11px;
}

@media (max-width: 640px) {
  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-buttons {
    width: 100%;
  }

  .btn-purchase,
  .btn-edit {
    flex: 1;
  }
}
</style>

