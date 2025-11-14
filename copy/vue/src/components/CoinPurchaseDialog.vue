<template>
  <div v-if="visible" class="modal-mask" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3>榮譽點充值</h3>
        <button class="btn-close" @click="close" aria-label="關閉">×</button>
      </div>
      
      <div class="modal-body">
        <div class="current-balance">
          <span class="label">目前餘額</span>
          <span class="value">{{ currentBalance }} 幣</span>
        </div>

        <div class="purchase-form">
          <label class="form-label">
            <span>充值金額</span>
            <div class="input-wrapper">
              <input
                v-model.number="amount"
                type="number"
                class="input-amount"
                placeholder="請輸入充值金額"
                min="100"
                max="50000"
                step="100"
                :disabled="submitting"
              />
              <span class="input-suffix">幣</span>
            </div>
          </label>

          <div class="quick-amounts">
            <button
              v-for="qa in quickAmounts"
              :key="qa"
              @click="amount = qa"
              class="btn-quick-amount"
              :class="{ active: amount === qa }"
              :disabled="submitting"
            >
              {{ qa }}
            </button>
          </div>

          <div v-if="validationError" class="error-message">
            {{ validationError }}
          </div>

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
        </div>

        <div class="info-box">
          <p class="info-title">充值說明</p>
          <ul class="info-list">
            <li>充值金額範圍：100 - 50,000 榮譽點</li>
            <li>充值後榮譽點將立即到帳</li>
            <li>榮譽點可用於購買其他會員的預測</li>
          </ul>
        </div>
      </div>

      <div class="modal-footer">
        <button
          @click="handlePurchase"
          class="btn btn-primary"
          :disabled="submitting || !isValidAmount"
        >
          {{ submitting ? '處理中...' : '確認充值' }}
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
import { coinsAPI } from '../api';

const props = defineProps<{
  visible: boolean;
  currentBalance: number;
}>();

const emit = defineEmits<{
  close: [];
  success: [newBalance: number];
}>();

const amount = ref(1000);
const submitting = ref(false);
const validationError = ref('');
const successMessage = ref('');

const quickAmounts = [500, 1000, 2000, 5000, 10000];

const isValidAmount = computed(() => {
  return amount.value >= 100 && amount.value <= 50000;
});

watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 重置狀態
    amount.value = 1000;
    validationError.value = '';
    successMessage.value = '';
  }
});

watch(amount, () => {
  validationError.value = '';
  successMessage.value = '';
});

async function handlePurchase() {
  // 驗證
  if (amount.value < 100) {
    validationError.value = '充值金額不得少於 100 榮譽點';
    return;
  }
  if (amount.value > 50000) {
    validationError.value = '充值金額不得超過 50,000 榮譽點';
    return;
  }

  submitting.value = true;
  validationError.value = '';
  successMessage.value = '';

  try {
    const result = await coinsAPI.purchaseCoins({
      amount: amount.value,
      note: '榮譽點充值',
    });

    if (result.success) {
      successMessage.value = result.message || '充值成功！';
      emit('success', result.transaction.balance);
      
      // 延遲關閉對話框
      setTimeout(() => {
        close();
      }, 1500);
    }
  } catch (e: any) {
    validationError.value = e?.response?.data?.message || '充值失敗，請稍後再試';
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
  max-width: 500px;
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

.current-balance {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 24px;
}

.current-balance .label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.current-balance .value {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.purchase-form {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 16px;
}

.form-label > span {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-amount {
  flex: 1;
  padding: 12px 60px 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.input-amount:focus {
  outline: none;
  border-color: #667eea;
}

.input-amount:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.input-suffix {
  position: absolute;
  right: 16px;
  color: #999;
  font-size: 14px;
  pointer-events: none;
}

.quick-amounts {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.btn-quick-amount {
  padding: 8px 16px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-quick-amount:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.btn-quick-amount.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.btn-quick-amount:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 12px;
  padding: 12px;
  background: #fff3f3;
  border: 1px solid #ffcccc;
  border-radius: 6px;
  color: #d32f2f;
  font-size: 14px;
}

.success-message {
  margin-top: 12px;
  padding: 12px;
  background: #f0f9ff;
  border: 1px solid #b3e5fc;
  border-radius: 6px;
  color: #0277bd;
  font-size: 14px;
}

.info-box {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.info-title {
  margin: 0 0 12px 0;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.info-list {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}

.info-list li {
  margin-bottom: 4px;
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

  .quick-amounts {
    flex-wrap: wrap;
  }

  .btn-quick-amount {
    flex: 1 1 calc(33.333% - 6px);
    min-width: 80px;
  }
}
</style>

