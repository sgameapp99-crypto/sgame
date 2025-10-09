<template>
  <div class="headerbox">
    <div class="headerboxin">
      <!-- logo start -->
      <div class="logobox">
        <RouterLink to="/">
          <img src="/images/logo.png" alt="玩運彩" border="0" width="140" height="57">
        </RouterLink>
      </div>
      <!-- logo end -->

      <!-- header menu start -->
      <div id="smoothmenu1" class="ddsmoothmenu">
        <ul class="drop-down-menu">
          <li class="ddsmoothmenu-outer">
            <RouterLink class="ddsmoothmenu-item js-header-menu--guess" :to="{ name: 'guess' }">
              <span></span>玩競猜
            </RouterLink>
            <ul>
              <li>
                <RouterLink class="ddsmoothmenu-link js-header-menu--guess" :to="{ name: 'guess' }">遊戲區</RouterLink>
              </li>
            </ul>
          </li>
          <li class="ddsmoothmenu-outer">
            <RouterLink class="ddsmoothmenu-item" :to="{ name: 'predict' }">
              <span></span>預測賽事
            </RouterLink>
            <ul>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'predict' }">預測賽事</RouterLink>
              </li>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'predict', query: { type: 'scale' } }">觀看預測比例</RouterLink>
              </li>
            </ul>
          </li>
          <li class="ddsmoothmenu-outer">
            <RouterLink class="ddsmoothmenu-item" :to="{ name: 'forum' }">
              <span></span>討論區
            </RouterLink>
            <ul>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'forum' }">運彩版</RouterLink>
              </li>
            </ul>
          </li>
          <li class="ddsmoothmenu-outer">
            <RouterLink class="ddsmoothmenu-item" :to="{ name: 'buy-predict' }">
              <span></span>找高手
            </RouterLink>
            <ul>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'buy-predict', query: { type: 'medalFire' } }">莊家殺手</RouterLink>
              </li>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'buy-predict', query: { type: 'singleKiller' } }">單場殺手</RouterLink>
              </li>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'billboard', query: { type: 'winRate' } }">勝率榜</RouterLink>
              </li>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'billboard', query: { type: 'mainPrediction' } }">主推榜</RouterLink>
              </li>
            </ul>
          </li>
          <li class="ddsmoothmenu-outer">
            <RouterLink class="ddsmoothmenu-item" :to="{ name: 'livescore' }">
              <span></span>即時比分
            </RouterLink>
            <ul></ul>
          </li>
          <li class="ddsmoothmenu-outer">
            <RouterLink class="ddsmoothmenu-item" :to="{ name: 'games' }">
              <span></span>看數據
            </RouterLink>
            <ul>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'games-battle' }">對戰資訊</RouterLink>
              </li>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'games-teams' }">球隊資訊</RouterLink>
              </li>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'games-standings' }">戰績排名</RouterLink>
              </li>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'games-results' }">賽事結果查詢</RouterLink>
              </li>
            </ul>
          </li>
          <li class="ddsmoothmenu-outer">
            <RouterLink class="ddsmoothmenu-item" :to="{ name: 'member-search' }">
              <span></span>玩家搜尋
            </RouterLink>
          </li>
        </ul>
        <br style="clear: left" />
      </div>

      <!-- header menu end -->
      <div id="navi" class="default">
        <div class="fixedpos" id="fixedposid">
          <ul id="functionbarid" class="functionbar">
            <!-- 未登入狀態 -->
            <template v-if="!isLoggedIn">
              <li class="loginitem">
                <RouterLink id="headerLoginButton" class="headerLoginButton tween" to="/login">
                  <i class="material-icons md-small">&#xE897;</i>登入
                </RouterLink>
              </li>
              <li class="signupitem">
                <RouterLink to="/register" class="tween">
                  <i class="material-icons md-small">&#xE7FE;</i>加入會員
                </RouterLink>
              </li>
            </template>
            <!-- 登入狀態 -->
            <template v-else>
              <li class="iditem">
                <a href="#" class="function-item-button" @click="toggleUserMenu">
                  <i class="material-icons md-small">account_circle</i>
                  {{ displayName || '會員' }}
                </a>
                <ul class="functionbar-ullv2" v-show="showUserMenu">
                  <li><a href="#" @click.prevent="goToProfile">個人資料</a></li>
                  <li><a href="/member/settings">帳戶設定</a></li>
                  <li><a href="#" @click.prevent="logout">登出</a></li>
                </ul>
              </li>
              <li class="carditem">
                <a href="#" class="function-item-button" @click="toggleCardMenu">
                  <i class="material-icons md-small">shopping_cart</i>
                  購物車
                </a>
                <ul id="carditem-ullv2" class="functionbar-ullv2" v-show="showCardMenu">
                  <li><a href="/cart">查看購物車</a></li>
                  <li><a href="/checkout">結帳</a></li>
                </ul>
              </li>
              <li class="messageitem">
                <a href="#" class="function-item-button" @click="toggleMessageMenu">
                  <i class="material-icons md-small">notifications</i>
                  訊息
                </a>
                <ul id="message-ullv2" class="functionbar-ullv2" v-show="showMessageMenu">
                  <li><a href="/messages">查看訊息</a></li>
                  <li><a href="/notifications">通知設定</a></li>
                </ul>
              </li>
              <li class="coinitem">
                <a href="/member/coins" class="function-item-button">
                  <i class="material-icons md-small">monetization_on</i>
                  彩幣
                </a>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';

// 登入狀態（由 Pinia 提供）
const session = useSessionStore();
const isLoggedIn = computed(() => session.loggedIn);
const displayName = computed(() => session.user?.name || session.user?.email || '');
const router = useRouter();

// 下拉選單狀態
const showUserMenu = ref(false);
const showCardMenu = ref(false);
const showMessageMenu = ref(false);


// 切換用戶選單
const toggleUserMenu = (event: Event) => {
  event.preventDefault();
  showUserMenu.value = !showUserMenu.value;
  showCardMenu.value = false;
  showMessageMenu.value = false;
};

// 切換購物車選單
const toggleCardMenu = (event: Event) => {
  event.preventDefault();
  showCardMenu.value = !showCardMenu.value;
  showUserMenu.value = false;
  showMessageMenu.value = false;
};

// 切換訊息選單
const toggleMessageMenu = (event: Event) => {
  event.preventDefault();
  showMessageMenu.value = !showMessageMenu.value;
  showUserMenu.value = false;
  showCardMenu.value = false;
};

// 點擊外部關閉下拉選單
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.iditem') && !target.closest('.carditem') && !target.closest('.messageitem')) {
    showUserMenu.value = false;
    showCardMenu.value = false;
    showMessageMenu.value = false;
  }
};


onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  session.fetchSession().then(() => session.ensureProfile());
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

async function logout() {
  try { await session.logout(); }
  finally { router.push('/'); }
}

// 個人資料：若已在個人頁則不動作；否則導向 /member
function goToProfile() {
  const atMember = router.currentRoute.value.name === 'member';
  if (atMember) return;
  router.push({ name: 'member' });
}
</script>

<style scoped>
/* 完全按照原始CSS樣式 */

/* Menu limited and prize draw images */
#menu-limited img, #menu-prizeDraw img {
  width: 70px;
  margin-top: 4px;
}
.headerbox {
  color: #666;
  font-family: "微軟正黑體","Microsoft JhengHei","新細明體",PMingLiU,Arial,Helvetica,sans-serif;
  font-size: 12px;
  padding: 0;
  margin: 0 auto;
  position: relative;
  width: 100%;
  min-width: 1000px;
  height: 148px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  z-index: 100;
  overflow: visible;
}

.headerboxin {
  width: 1000px;
  height: 148px;
  text-align: center;
  margin: 0 auto;
  position: relative;
}

/* 主導航菜單 - 按照原始CSS */
.ddsmoothmenu {
  position: absolute;
  width: auto;
  right: 20px;
  z-index: 80;
  top: 64px;
  color: #fff;
}

.default {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 36px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  z-index: 90;
}

.fixedpos {
  width: 1000px;
  height: 36px;
  margin: 0 auto;
  position: relative;
}

.drop-down-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ddsmoothmenu-outer {
  float: left;
  height: 68px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  position: relative;
}

.ddsmoothmenu-item {
  display: block;
  padding: 20px 15px 0;
  height: 43px;
  margin-top: 5px;
  text-align: center;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  text-shadow: 1px 1px 1px #00243a;
}

.ddsmoothmenu-item:hover {
  /* 移除頂層黃色特效：僅調整字色微亮，背景不變，無邊框 */
  color: #ffffff;
  text-decoration: none;
}

.ddsmoothmenu-item:hover span {
  /* 移除頂部黃色指示 */
  display: none;
}

/* 下拉選單 - 按照原始CSS */
.ddsmoothmenu-outer ul {
  position: absolute;
  left: 0;
  display: none;
  margin: -1px 0 0;
  padding: 0;
  width: 100%;
  border-radius: 0 0 5px 5px;
  z-index: 9999;
}

.ddsmoothmenu-outer:hover ul {
  display: block;
}

.ddsmoothmenu-outer ul li {
  position: relative;
  display: block;
  float: none;
  margin: 0;
  padding: 0;
  height: auto;
  width: 100%;
  border: 1px solid #27c3e1;
  border-bottom: 0;
  background: 0 0;
  box-sizing: border-box;
}

.ddsmoothmenu-outer ul li:last-child {
  border-bottom: 1px solid #27c3e1;
  border-radius: 0 0 5px 5px;
}

.ddsmoothmenu-link {
  height: auto;
  padding: 10px 0;
  text-align: center;
  margin: 0;
  display: block;
  background: #095a8b;
  border-radius: 0;
  text-shadow: none;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
}

.ddsmoothmenu-link:hover {
  color: #000;
  background: #ffde00;
  border: 0;
  margin: 0;
  padding-left: 0;
  padding-right: 0;
  border-radius: 0;
  text-decoration: none;
}

/* 功能按鈕區域 - 按照原始CSS */
.functionbar {
  width: auto;
  height: 36px;
  position: absolute;
  top: 0;
  right: 0;
  border-right: 1px solid #e0e0e0;
  background: transparent;
  z-index: 91;
  list-style: none;
  margin: 0;
  padding: 0;
}

.functionbar li {
  float: left;
  border-left: 1px solid #e0e0e0;
  text-align: center;
  line-height: normal;
  position: relative;
}

/* 取消 登入 與 加入會員 之間的分隔線 */
.functionbar li.loginitem,
.functionbar li.signupitem {
  border-left: none;
}

/* 登入/註冊按鈕 - 按照原始樣式 */
.headerLoginButton,
.signupitem a {
  display: inline-block;
  text-align: left;
  height: 24px;
  padding: 8px 16px 0 4px;
  text-decoration: none;
  color: #757575;
}

.headerLoginButton:hover,
.signupitem a:hover {
  color: #212121;
  text-decoration: none;
}

/* 登入狀態按鈕 - 按照原始CSS */
.function-item-button {
  display: inline-block;
  text-align: left;
  height: 24px;
  padding: 8px 16px 0 4px;
  text-decoration: none;
  color: #757575;
}

.function-item-button:hover {
  color: #212121;
  text-decoration: none;
}

/* 彩幣按鈕特殊樣式 */
.functionbar li.coinitem a {
  background: #e3ffbf;
  color: #212121;
  padding: 8px 16px 0;
}

.functionbar li.coinitem a:visited {
  color: #212121;
}

.functionbar li.coinitem a:hover {
  background: #fff;
  color: #212121;
}

.functionbar li.coinitem a:active,
.functionbar li.coinitem a:active i {
  color: #212121;
}

.functionbar li.coinitem a i,
.functionbar li.loginitem a i,
.functionbar li.signupitem a i {
  padding: 0 4px 0 0;
}

/* 下拉選單 - 按照原始CSS */
.functionbar-ullv2 {
  display: none;
  position: absolute;
  width: 100%;
  min-width: 50px;
  top: 32px;
  right: -1px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  list-style: none;
  margin: 0;
  padding: 0;
}

.functionbar li:hover .functionbar-ullv2 {
  display: block;
}

.functionbar-ullv2 li {
  float: none;
  border: none;
}

.functionbar-ullv2 a {
  float: none;
  display: block;
  text-align: center;
  height: 28px;
  padding: 13px 0 0;
  color: #757575;
  text-decoration: none;
  font-size: 13px;
}

.functionbar-ullv2 a:hover {
  color: #212121;
  text-decoration: none;
}

/* 購物車和訊息選單右對齊 */
#carditem-ullv2,
#message-ullv2 {
  left: auto;
  right: 0;
}

/* Logo - 按照原始CSS */
.logobox {
  position: absolute;
  top: 70px;
  left: 10px;
}

.logobox img {
  display: block;
}


/* 響應式設計 */
@media (max-width: 1024px) {
  .headerbox {
    min-width: 800px;
  }
  
  .ddsmoothmenu-item {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .headerbox {
    min-width: 600px;
    height: auto;
    padding: 10px 0;
  }
  
  .headerboxin {
    flex-direction: column;
    gap: 15px;
  }
  
  .ddsmoothmenu {
    margin: 0;
    order: 2;
  }
  
  .drop-down-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
  }
  
  .ddsmoothmenu-item {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .functionbar {
    order: 1;
    justify-content: center;
  }
  
  .logobox {
    margin-left: 0;
    order: 3;
  }
  
}

@media (max-width: 480px) {
  .headerbox {
    min-width: 400px;
  }
  
  .ddsmoothmenu-item {
    padding: 4px 8px;
    font-size: 11px;
  }
  
  .headerLoginButton,
  .signupitem a {
    padding: 6px 10px;
    font-size: 12px;
  }
  
}
</style>