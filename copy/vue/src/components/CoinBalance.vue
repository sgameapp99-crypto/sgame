<template>
  <div class="coin-balance">
    <div v-if="loading" class="balance-loading">
      <span class="loading-text">載入中...</span>
    </div>
    <div v-else-if="error" class="balance-error">
      <span class="error-text">{{ error }}</span>
      <button @click="refresh" class="btn-retry">重試</button>
    </div>
    <div v-else class="balance-content">
      <div class="balance-item">
        <span class="balance-label">榮譽點餘額</span>
        <span class="balance-value">{{ balance }}</span>
        <span class="balance-currency">幣</span>
      </div>
      <button v-if="showPurchaseButton" @click="$emit('purchase')" class="btn-purchase">
        充值
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { coinsAPI } from '../api';

const props = defineProps<{
  showPurchaseButton?: boolean;
  autoLoad?: boolean;
}>();

const emit = defineEmits<{
  purchase: [];
  loaded: [balance: number];
  error: [error: string];
}>();

const loading = ref(false);
const error = ref('');
const balance = ref(0);

async function loadBalance() {
  loading.value = true;
  error.value = '';
  
  try {
    const data = await coinsAPI.getCoinInfo();
    balance.value = data.balance;
    emit('loaded', data.balance);
  } catch (e: any) {
    error.value = e?.response?.data?.message || '載入榮譽點餘額失敗';
    emit('error', error.value);
  } finally {
    loading.value = false;
  }
}

function refresh() {
  loadBalance();
}

onMounted(() => {
  if (props.autoLoad !== false) {
    loadBalance();
  }
});

defineExpose({
  loadBalance,
  refresh,
});
</script>

<style scoped>
.coin-balance {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  font-family: "微軟正黑體", "Microsoft JhengHei", Arial, sans-serif;
}

.balance-loading,
.balance-error {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.error-text {
  font-size: 13px;
  color: #ffcccc;
}

.btn-retry {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-retry:hover {
  background: rgba(255, 255, 255, 0.3);
}

.balance-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.balance-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.balance-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.balance-value {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.balance-currency {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.btn-purchase {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 6px;
  color: #667eea;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-purchase:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>

