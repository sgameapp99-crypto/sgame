<template>
  <div class="headerbox">
    <div class="headerboxin">
      <div class="header-top">
        <!-- logo start -->
        <div class="logobox">
          <RouterLink to="/" @click="closeMobileMenu">
            <img src="/images/logo.png" alt="運彩王" border="0" width="140" height="57">
          </RouterLink>
        </div>
        <!-- logo end -->

        <button
          class="mobile-menu-button"
          type="button"
          aria-label="切換選單"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
          aria-controls="app-mobile-nav"
          @click="toggleMobileMenu"
        >
          <span class="material-icons">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>

      <transition name="mobile-menu">
        <div
          v-if="isMobileMenuOpen"
          id="app-mobile-nav"
          class="mobile-menu"
        >
          <nav class="mobile-nav">
            <ul class="mobile-nav-list">
              <li class="mobile-nav-item" :class="{ 'is-open': mobileNavGroups.predict }">
                <button
                  type="button"
                  class="mobile-nav-link mobile-nav-link--button"
                  aria-controls="mobile-nav-predict"
                  :aria-expanded="mobileNavGroups.predict ? 'true' : 'false'"
                  @click="toggleMobileGroup('predict')"
                >
                  預測賽事
                </button>
                <ul
                  id="mobile-nav-predict"
                  class="mobile-sub-nav"
                  v-show="mobileNavGroups.predict"
                >
                  <li>
                    <RouterLink :to="{ name: 'predict' }" @click="closeMobileMenu">預測賽事</RouterLink>
                  </li>
                  <li v-if="false">
                    <RouterLink :to="{ name: 'predict', query: { type: 'scale' } }" @click="closeMobileMenu">觀看預測比例</RouterLink>
                  </li>
                </ul>
              </li>
              <li class="mobile-nav-item" :class="{ 'is-open': mobileNavGroups.forum }">
                <button
                  type="button"
                  class="mobile-nav-link mobile-nav-link--button"
                  aria-controls="mobile-nav-forum"
                  :aria-expanded="mobileNavGroups.forum ? 'true' : 'false'"
                  @click="toggleMobileGroup('forum')"
                >
                  討論區
                </button>
                <ul
                  id="mobile-nav-forum"
                  class="mobile-sub-nav"
                  v-show="mobileNavGroups.forum"
                >
                  <li>
                    <RouterLink :to="{ name: 'forum' }" @click="closeMobileMenu">運彩版</RouterLink>
                  </li>
                </ul>
              </li>
              <li class="mobile-nav-item" :class="{ 'is-open': mobileNavGroups.buy }">
                <button
                  type="button"
                  class="mobile-nav-link mobile-nav-link--button"
                  aria-controls="mobile-nav-buy"
                  :aria-expanded="mobileNavGroups.buy ? 'true' : 'false'"
                  @click="toggleMobileGroup('buy')"
                >
                  找高手
                </button>
                <ul
                  id="mobile-nav-buy"
                  class="mobile-sub-nav"
                  v-show="mobileNavGroups.buy"
                >
                  <li>
                    <RouterLink :to="{ name: 'buy-predict', query: { type: 'medalFire' } }" @click="closeMobileMenu">殺莊高手</RouterLink>
                  </li>
                  <li>
                    <RouterLink :to="{ name: 'buy-predict', query: { type: 'singleKiller' } }" @click="closeMobileMenu">單月高手</RouterLink>
                  </li>
                  <li>
                    <RouterLink :to="{ name: 'billboard', query: { type: 'winRate' } }" @click="closeMobileMenu">勝率榜</RouterLink>
                  </li>
                  <li>
                    <RouterLink :to="{ name: 'billboard', query: { type: 'mainPrediction' } }" @click="closeMobileMenu">主推榜</RouterLink>
                  </li>
                </ul>
              </li>
              <li class="mobile-nav-item mobile-nav-item--leaf">
                <RouterLink :to="{ name: 'livescore' }" class="mobile-nav-link" @click="closeMobileMenu">
                  即時比分
                </RouterLink>
              </li>
              <li class="mobile-nav-item" :class="{ 'is-open': mobileNavGroups.games }">
                <button
                  type="button"
                  class="mobile-nav-link mobile-nav-link--button"
                  aria-controls="mobile-nav-games"
                  :aria-expanded="mobileNavGroups.games ? 'true' : 'false'"
                  @click="toggleMobileGroup('games')"
                >
                  看數據
                </button>
                <ul
                  id="mobile-nav-games"
                  class="mobile-sub-nav"
                  v-show="mobileNavGroups.games"
                >
                  <li>
                    <RouterLink :to="{ name: 'games-battle' }" @click="closeMobileMenu">對戰資訊</RouterLink>
                  </li>
                  <li>
                    <RouterLink :to="{ name: 'games-teams' }" @click="closeMobileMenu">球隊資訊</RouterLink>
                  </li>
                  <li>
                    <RouterLink :to="{ name: 'games-results' }" @click="closeMobileMenu">賽事結果查詢</RouterLink>
                  </li>
                </ul>
              </li>
              <li class="mobile-nav-item mobile-nav-item--leaf">
                <RouterLink :to="{ name: 'member-search' }" class="mobile-nav-link" @click="closeMobileMenu">
                  玩家搜尋
                </RouterLink>
              </li>
            </ul>
          </nav>

          <div class="mobile-actions">
            <template v-if="!isLoggedIn">
              <RouterLink to="/login" class="mobile-action-link" @click="closeMobileMenu">
                <i class="material-icons md-small">&#xE897;</i> 登入
              </RouterLink>
              <RouterLink to="/register" class="mobile-action-link" @click="closeMobileMenu">
                <i class="material-icons md-small">&#xE7FE;</i> 加入會員
              </RouterLink>
            </template>
            <template v-else>
              <div class="mobile-user">
                <i class="material-icons md-small">account_circle</i>
                <span>{{ displayName || '會員' }}</span>
              </div>
              <button type="button" class="mobile-action-link" @click="handleMobileProfile">
                個人資料
              </button>
              <RouterLink to="/member/settings" class="mobile-action-link" @click="closeMobileMenu">
                帳戶設定
              </RouterLink>
              <RouterLink to="/member/coins/purchase" class="mobile-action-link" @click="closeMobileMenu">
                榮譽點購買
              </RouterLink>
              <button type="button" class="mobile-action-link" @click="handleMobileLogout">
                登出
              </button>
            </template>
          </div>
        </div>
      </transition>

      <!-- header menu start -->
      <div id="smoothmenu1" class="ddsmoothmenu">
        <ul class="drop-down-menu">
          <li class="ddsmoothmenu-outer" v-if="false">
            <RouterLink class="ddsmoothmenu-item js-header-menu--guess" :to="{ name: 'guess' }">
              <span></span>玩競猜
            <!-- 這個部分目前不需要使用，所以先隱藏-->
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
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'buy-predict', query: { type: 'medalFire' } }">殺莊高手</RouterLink>
              </li>
              <li>
                <RouterLink class="ddsmoothmenu-link" :to="{ name: 'buy-predict', query: { type: 'singleKiller' } }">單月高手</RouterLink>
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
                  <li><a href="/member/coins/purchase">榮譽點購買</a></li>
                  <li><a href="#" @click.prevent="logout">登出</a></li>
                </ul>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';

// 登入狀態（由 Pinia 提供）
const session = useSessionStore();
const isLoggedIn = computed(() => session.loggedIn);
const displayName = computed(() => session.user?.name || session.user?.email || '');
const router = useRouter();

// 下拉選單狀態
const showUserMenu = ref(false);
const isMobileMenuOpen = ref(false);

type MobileNavGroup = 'predict' | 'forum' | 'buy' | 'games';

const mobileNavGroups = ref<Record<MobileNavGroup, boolean>>({
  predict: false,
  forum: false,
  buy: false,
  games: false,
});


// 切換用戶選單
const toggleUserMenu = (event: Event) => {
  event.preventDefault();
  closeMobileMenu();
  showUserMenu.value = !showUserMenu.value;
};

const toggleMobileMenu = () => {
  const willOpen = !isMobileMenuOpen.value;
  isMobileMenuOpen.value = willOpen;
  if (!willOpen) {
    showUserMenu.value = false;
    resetMobileNavGroups();
  } else {
    resetMobileNavGroups();
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  resetMobileNavGroups();
};

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    closeMobileMenu();
  }
};

const toggleMobileGroup = (key: MobileNavGroup) => {
  mobileNavGroups.value[key] = !mobileNavGroups.value[key];
};

const resetMobileNavGroups = () => {
  (Object.keys(mobileNavGroups.value) as MobileNavGroup[]).forEach((key) => {
    mobileNavGroups.value[key] = false;
  });
};

// 點擊外部關閉下拉選單
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.iditem')) {
    showUserMenu.value = false;
  }
  if (!target.closest('.headerbox')) {
    closeMobileMenu();
  }
};


onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
  session.fetchSession().then(() => session.ensureProfile());
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    closeMobileMenu();
  }
);

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

function handleMobileProfile() {
  closeMobileMenu();
  goToProfile();
}

async function handleMobileLogout() {
  closeMobileMenu();
  await logout();
}
</script>

<style scoped>
/* Mobile-first header layout */
.headerbox {
  color: #666;
  font-family: "微軟正黑體","Microsoft JhengHei","新細明體",PMingLiU,Arial,Helvetica,sans-serif;
  font-size: 12px;
  margin: 0 auto;
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  z-index: 100;
  overflow: visible;
  padding: 12px 0 16px;
}

.headerboxin {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.logobox {
  position: relative;
  top: auto;
  left: auto;
}

.logobox img {
  display: block;
  width: 120px;
  height: auto;
}

.mobile-menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.15);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.mobile-menu-button:hover {
  background: rgba(0, 0, 0, 0.25);
}

.mobile-menu-button:active {
  transform: scale(0.96);
}

.mobile-menu-button .material-icons {
  font-size: 24px;
  line-height: 1;
}

.ddsmoothmenu {
  display: none;
}

.default {
  display: none;
}

.functionbar {
  display: none;
}

.mobile-menu {
  margin-top: 8px;
  background: rgba(9, 90, 139, 0.94);
  border-radius: 12px;
  padding: 12px 16px 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-nav-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 12px;
}

.mobile-nav-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.mobile-nav-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
}

.mobile-nav-link--button {
  width: 100%;
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  padding: 0;
  cursor: pointer;
}

.mobile-nav-link::after {
  content: '›';
  font-size: 18px;
  opacity: 0.6;
  transition: transform 0.2s ease;
}

.mobile-nav-item--leaf .mobile-nav-link::after {
  content: '';
}

.mobile-nav-item.is-open > .mobile-nav-link::after {
  transform: rotate(90deg);
}

.mobile-sub-nav {
  list-style: none;
  margin: 8px 0 0 0;
  padding: 0 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-sub-nav a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 14px;
}

.mobile-sub-nav a:hover {
  color: #ffde00;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-action-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
}

.mobile-action-link:hover {
  background: rgba(255, 255, 255, 0.25);
}

.mobile-action-link .material-icons {
  font-size: 20px;
  line-height: 1;
}

.mobile-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #fff;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (min-width: 600px) {
  .headerboxin {
    padding: 0 24px;
  }

  .logobox img {
    width: 140px;
  }

  .mobile-menu {
    padding: 16px 20px 20px;
  }
}

@media (min-width: 768px) {
  .headerbox {
    padding: 16px 0 24px;
  }
}

@media (min-width: 1024px) {
  #menu-limited img,
  #menu-prizeDraw img {
    width: 70px;
    margin-top: 4px;
  }

  .headerbox {
    padding: 0;
    min-width: 1000px;
    height: 148px;
  }

  .headerboxin {
    width: 1000px;
    max-width: none;
    height: 148px;
    padding: 0;
    display: block;
    text-align: center;
  }

  .header-top {
    position: relative;
    display: block;
    height: 148px;
  }

  .mobile-menu-button {
    display: none;
  }

  .mobile-menu {
    display: none !important;
  }

  .logobox {
    position: absolute;
    top: 70px;
    left: 10px;
  }

  .logobox img {
    width: 140px;
    height: 57px;
  }

  .ddsmoothmenu {
    display: block;
    position: absolute;
    width: auto;
    right: 20px;
    z-index: 80;
    top: 64px;
    color: #fff;
  }

  .default {
    display: block;
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
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
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
    color: #ffffff;
    text-decoration: none;
  }

  .ddsmoothmenu-item:hover span {
    display: none;
  }

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

  .functionbar {
    display: block;
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

  .functionbar li.loginitem,
  .functionbar li.signupitem {
    border-left: none;
  }

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

  .functionbar li.loginitem a i,
  .functionbar li.signupitem a i {
    padding: 0 4px 0 0;
  }

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

}
</style>