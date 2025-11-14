<template>
  <div v-if="visible" class="modal-mask" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3>購買預測</h3>
        <button class="btn-close" @click="close" aria-label="關閉">×</button>
      </div>
      
      <div class="modal-body">
        <div v-if="prediction" class="prediction-info">
          <div class="info-row">
            <span class="label">預測者</span>
            <span class="value">{{ prediction.userName }}</span>
          </div>
          <div class="info-row">
            <span class="label">賽事</span>
            <span class="value">{{ prediction.gameInfo.homeTeam }} vs {{ prediction.gameInfo.awayTeam }}</span>
          </div>
          <div class="info-row">
            <span class="label">時間</span>
            <span class="value">{{ formatDateTime(prediction.gameInfo.gameDate, prediction.gameInfo.gameTime) }}</span>
          </div>
          <div class="info-row">
            <span class="label">預測類型</span>
            <span class="value">{{ prediction.predictionTypeLabel }}</span>
          </div>
          <div class="info-row highlight">
            <span class="label">價格</span>
            <span class="value price">{{ prediction.price }} 榮譽點</span>
          </div>
        </div>

        <div class="balance-info">
          <div class="balance-row">
            <span class="label">目前餘額</span>
            <span class="value">{{ currentBalance }} 榮譽點</span>
          </div>
          <div v-if="prediction" class="balance-row">
            <span class="label">購買後餘額</span>
            <span class="value" :class="{ insufficient: remainingBalance < 0 }">
              {{ remainingBalance }} 榮譽點
            </span>
          </div>
        </div>

        <div v-if="remainingBalance < 0" class="error-message">
          <p>榮譽點餘額不足</p>
          <button @click="$emit('go-purchase')" class="btn-link">
            前往充值 →
          </button>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </div>

      <div class="modal-footer">
        <button
          @click="handlePurchase"
          class="btn btn-primary"
          :disabled="submitting || remainingBalance < 0"
        >
          {{ submitting ? '購買中...' : '確認購買' }}
        </button>
        <button @click="close" class="btn btn-secondary" :disabled="submitting">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Prediction } from '../types/prediction';
import { predictionsAPI } from '../api';

const props = defineProps<{
  visible: boolean;
  prediction: Prediction | null;
  currentBalance: number;
}>();

const emit = defineEmits<{
  close: [];
  success: [prediction: Prediction, remainingCoins: number];
  'go-purchase': [];
}>();

const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const remainingBalance = computed(() => {
  if (!props.prediction) return props.currentBalance;
  return props.currentBalance - props.prediction.price;
});

watch(() => props.visible, (newVal) => {
  if (newVal) {
    errorMessage.value = '';
    successMessage.value = '';
  }
});

function formatDateTime(date: string, time: string): string {
  const d = new Date(date);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[d.getDay()];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}(${weekday}) ${time}`;
}

async function handlePurchase() {
  if (!props.prediction) return;

  submitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const result = await predictionsAPI.purchasePrediction(props.prediction.id);
    
    if (result.success) {
      successMessage.value = '購買成功！';
      
      // 更新預測資料
      const updatedPrediction = {
        ...props.prediction,
        ...result.prediction,
        isPurchased: true,
      };
      
      emit('success', updatedPrediction, result.remainingCoins);
      
      // 延遲關閉對話框
      setTimeout(() => {
        close();
      }, 1500);
    }
  } catch (e: any) {
    const code = e?.response?.data?.code;
    const message = e?.response?.data?.message;
    
    if (code === 'INSUFFICIENT_COINS') {
      errorMessage.value = '榮譽點餘額不足，請先充值';
    } else if (code === 'ALREADY_PURCHASED') {
      errorMessage.value = '您已經購買過此預測';
    } else if (code === 'OWN_PREDICTION') {
      errorMessage.value = '無法購買自己的預測';
    } else {
      errorMessage.value = message || '購買失敗，請稍後再試';
    }
  } finally {
    submitting.value = false;
  }
}

function close() {
  if (!submitting.value) {
    emit('close');
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.btn-close:hover {
  color: #666;
}

.modal-body {
  padding: 24px;
}

.prediction-info {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row.highlight {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 2px solid #667eea;
  border-bottom: none;
}

.info-row .label {
  color: #666;
  font-size: 14px;
}

.info-row .value {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.info-row .value.price {
  color: #667eea;
  font-size: 18px;
  font-weight: bold;
}

.balance-info {
  padding: 16px;
  background: #fff8e1;
  border: 1px solid #ffecb3;
  border-radius: 8px;
  margin-bottom: 20px;
}

.balance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.balance-row .label {
  color: #666;
  font-size: 14px;
}

.balance-row .value {
  color: #333;
  font-weight: 600;
  font-size: 15px;
}

.balance-row .value.insufficient {
  color: #d32f2f;
}

.error-message {
  padding: 12px;
  background: #fff3f3;
  border: 1px solid #ffcccc;
  border-radius: 6px;
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 16px;
}

.error-message p {
  margin: 0 0 8px 0;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.btn-link:hover {
  color: #5a6fd8;
}

.success-message {
  padding: 12px;
  background: #f0f9ff;
  border: 1px solid #b3e5fc;
  border-radius: 6px;
  color: #0277bd;
  font-size: 14px;
  margin-bottom: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
}

.btn-secondary {
  background: #e0e0e0;
  color: #666;
}

.btn-secondary:hover:not(:disabled) {
  background: #d0d0d0;
}

@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    border-radius: 0;
  }
}
</style>

