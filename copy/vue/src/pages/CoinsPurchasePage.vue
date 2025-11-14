<template>
  <div class="member-page">
    <div class="settings-container">
      <div class="settings-card">
        <div class="settings-header">
          <h1>榮譽點購買</h1>
          <button class="btn-link" @click="goBack" aria-label="back">返回</button>
        </div>

        <!-- 當前榮譽點餘額 -->
        <section class="section">
          <h2 class="section-title">當前榮譽點餘額</h2>
          <div class="balance-display">
            <div v-if="balanceLoading" class="loading-state">載入中...</div>
            <div v-else-if="balanceError" class="error-state">
              {{ balanceError }}
              <button @click="loadBalance" class="btn-retry">重試</button>
            </div>
            <div v-else class="balance-amount">
              <span class="amount-number">{{ currentBalance.toLocaleString() }}</span>
              <span class="amount-unit">榮譽點</span>
            </div>
          </div>
        </section>

        <!-- 套餐方案選擇 -->
        <section class="section">
          <h2 class="section-title">選擇購買方案</h2>
          <div class="package-grid">
            <div
              v-for="pkg in packages"
              :key="pkg.id"
              :class="['package-card', { selected: selectedPackage?.id === pkg.id, recommended: pkg.recommended }]"
              @click="selectPackage(pkg)"
            >
              <div v-if="pkg.recommended" class="recommended-badge">推薦</div>
              <div class="package-label">{{ pkg.label }}</div>
              <div class="package-price">NT$ {{ pkg.price.toLocaleString() }}</div>
              <div class="package-coins">
                <div class="coins-amount">{{ pkg.coins.toLocaleString() }} 榮譽點</div>
                <div v-if="pkg.bonus > 0" class="bonus-amount">贈送 {{ pkg.bonus }} 榮譽點</div>
              </div>
              <div class="package-check">
                <i v-if="selectedPackage?.id === pkg.id" class="material-icons">check_circle</i>
                <i v-else class="material-icons">radio_button_unchecked</i>
              </div>
            </div>
          </div>
        </section>

        <!-- 購買按鈕與訊息 -->
        <section class="section">
          <div class="purchase-actions">
            <button
              class="btn primary large"
              :disabled="!selectedPackage || purchasing"
              @click="purchaseCoins"
            >
              {{ purchasing ? '處理中...' : '確認購買' }}
            </button>
          </div>
          <p v-if="purchaseMessage" :class="['purchase-message', { success: purchaseSuccess, error: !purchaseSuccess }]">
            {{ purchaseMessage }}
          </p>
        </section>

        <!-- 提示說明 -->
        <section class="section">
          <div class="notice-box">
            <h3>💡 購買說明</h3>
            <ul>
              <li>購買後榮譽點將立即到帳</li>
              <li>榮譽點可用於購買高手預測</li>
              <li>目前為測試階段，尚未串接真實金流</li>
              <li>有任何問題請聯繫客服</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';
import { coinsAPI } from '../api/coins';

// 套餐方案定義
interface Package {
  id: number;
  price: number;
  coins: number;
  bonus: number;
  label: string;
  recommended?: boolean;
}

const packages: Package[] = [
  { id: 1, price: 100, coins: 100, bonus: 0, label: '基礎方案' },
  { id: 2, price: 500, coins: 550, bonus: 50, label: '優惠方案', recommended: true },
  { id: 3, price: 1000, coins: 1200, bonus: 200, label: '超值方案' },
  { id: 4, price: 3000, coins: 3900, bonus: 900, label: 'VIP方案' },
];

const router = useRouter();
const session = useSessionStore();

// 狀態管理
const currentBalance = ref(0);
const balanceLoading = ref(false);
const balanceError = ref('');
const selectedPackage = ref<Package | null>(null);
const purchasing = ref(false);
const purchaseMessage = ref('');
const purchaseSuccess = ref(false);

/**
 * 返回上一頁
 */
function goBack() {
  if (window.history.length > 1) router.back();
  else router.push('/');
}

/**
 * 載入榮譽點餘額
 */
async function loadBalance() {
  balanceLoading.value = true;
  balanceError.value = '';
  
  try {
    const data = await coinsAPI.getCoinInfo();
    if (data.balance !== undefined) {
      currentBalance.value = data.balance;
    }
  } catch (e: any) {
    balanceError.value = e?.response?.data?.message || '載入餘額失敗，請稍後再試';
  } finally {
    balanceLoading.value = false;
  }
}

/**
 * 選擇套餐
 */
function selectPackage(pkg: Package) {
  selectedPackage.value = pkg;
  purchaseMessage.value = '';
  purchaseSuccess.value = false;
}

/**
 * 購買榮譽點
 */
async function purchaseCoins() {
  if (!selectedPackage.value) return;
  
  // 檢查登入狀態
  if (!session.loggedIn) {
    purchaseMessage.value = '請先登入';
    purchaseSuccess.value = false;
    return;
  }
  
  purchasing.value = true;
  purchaseMessage.value = '';
  purchaseSuccess.value = false;
  
  try {
    const result = await coinsAPI.purchaseCoins({
      amount: selectedPackage.value.coins,
      note: `購買${selectedPackage.value.label}`,
    });
    
    if (result.success) {
      purchaseMessage.value = `購買成功！已獲得 ${selectedPackage.value.coins.toLocaleString()} 榮譽點`;
      purchaseSuccess.value = true;
      
      // 更新餘額顯示
      await loadBalance();
      
      // 清除選擇
      setTimeout(() => {
        selectedPackage.value = null;
        purchaseMessage.value = '';
      }, 3000);
    } else {
      purchaseMessage.value = result.message || '購買失敗，請稍後再試';
      purchaseSuccess.value = false;
    }
  } catch (e: any) {
    const message = e?.response?.data?.message;
    const code = e?.response?.data?.code;
    
    if (code === 'INSUFFICIENT_BALANCE') {
      purchaseMessage.value = '餘額不足';
    } else if (code === 'INVALID_AMOUNT') {
      purchaseMessage.value = '購買金額無效';
    } else {
      purchaseMessage.value = message || '購買失敗，請稍後再試';
    }
    purchaseSuccess.value = false;
  } finally {
    purchasing.value = false;
  }
}

// 初始化
onMounted(async () => {
  await session.fetchSession();
  if (session.loggedIn) {
    await loadBalance();
  }
});
</script>

<style scoped>
/* 繼承 MemberSettingsPage 的基礎樣式 */
.member-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.settings-container {
  width: 100%;
}

.settings-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 30px;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.settings-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;
  text-decoration: underline;
}

.btn-link:hover {
  color: #5568d3;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

/* 餘額顯示 */
.balance-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.loading-state,
.error-state {
  color: white;
  font-size: 16px;
}

.error-state {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.btn-retry {
  background: white;
  color: #667eea;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-retry:hover {
  background: #f0f0f0;
}

.balance-amount {
  color: white;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.amount-number {
  font-size: 48px;
  font-weight: bold;
  letter-spacing: 1px;
}

.amount-unit {
  font-size: 20px;
  font-weight: 500;
}

/* 套餐網格 */
.package-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.package-card {
  position: relative;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.package-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.package-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.package-card.recommended {
  border-color: #ffa500;
}

.package-card.recommended.selected {
  border-color: #ff8c00;
  background: linear-gradient(135deg, #fff8f0 0%, #ffe4cc 100%);
}

.recommended-badge {
  position: absolute;
  top: -10px;
  right: 10px;
  background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.package-label {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.package-price {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 15px;
}

.package-card.recommended .package-price {
  color: #ff8c00;
}

.package-coins {
  margin-bottom: 15px;
}

.coins-amount {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.bonus-amount {
  font-size: 14px;
  color: #28a745;
  font-weight: 500;
}

.package-check {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.package-check i {
  font-size: 32px;
  color: #667eea;
}

.package-card.selected .package-check i {
  color: #667eea;
}

.package-card.recommended.selected .package-check i {
  color: #ff8c00;
}

/* 購買按鈕與訊息 */
.purchase-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
}

.btn.large {
  padding: 15px 50px;
  font-size: 18px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.purchase-message {
  text-align: center;
  padding: 12px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
}

.purchase-message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.purchase-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* 提示說明 */
.notice-box {
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  border-radius: 6px;
  padding: 20px;
}

.notice-box h3 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.notice-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-box li {
  padding: 8px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.notice-box li:before {
  content: '•';
  color: #667eea;
  font-weight: bold;
  margin-right: 10px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .settings-card {
    padding: 20px;
  }
  
  .settings-header h1 {
    font-size: 20px;
  }
  
  .package-grid {
    grid-template-columns: 1fr;
  }
  
  .amount-number {
    font-size: 36px;
  }
  
  .amount-unit {
    font-size: 16px;
  }
  
  .btn.large {
    padding: 12px 40px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .member-page {
    padding: 0 10px;
  }
  
  .settings-card {
    padding: 15px;
  }
  
  .balance-display {
    padding: 20px;
  }
  
  .amount-number {
    font-size: 28px;
  }
}
</style>

