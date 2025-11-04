import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '../stores/session';

const DEFAULT_TITLE = '玩運彩預測平台';

const ROUTE_TITLES: Record<string, string> = {
  home: '玩運彩討論區首頁｜玩運彩',
  'test-nav': '測試導覽｜玩運彩',
  'forum-test': '論壇測試頁｜玩運彩',
  forum: '討論區｜玩運彩',
  'forum-create': '發表文章｜玩運彩',
  login: '會員登入｜玩運彩',
  register: '加入會員｜玩運彩',
  'verify-email': 'Email 驗證｜玩運彩',
  'password-change': '變更密碼｜玩運彩',
  'forgot-password': '忘記密碼｜玩運彩',
  'reset-password': '重設密碼｜玩運彩',
  post: '文章內容｜玩運彩',
  member: '我的會員中心｜玩運彩',
  'member-view': '會員資訊｜玩運彩',
  predict: '預測賽事｜玩運彩',
  'predict-buy': '預測購買｜玩運彩',
  guess: '玩競猜｜玩運彩',
  livescore: '即時比分｜玩運彩',
  'buy-predict': '找高手｜玩運彩',
  billboard: '高手排行榜｜玩運彩',
  'member-search': '玩家搜尋｜玩運彩',
  games: '賽事資料｜玩運彩',
  'games-battle': '對戰資訊｜玩運彩',
  'games-teams': '球隊資訊｜玩運彩',
  'games-standings': '排名戰績｜玩運彩',
  'games-results': '賽事結果｜玩運彩',
  'games-list': '賽事列表｜玩運彩',
  'game-detail': '賽事詳情｜玩運彩',
  'member-settings': '帳戶設定｜玩運彩',
  'coins-purchase': '彩幣購買｜玩運彩',
  legal: '法律條款｜玩運彩',
  admin: '管理後台｜玩運彩',
  'not-found': '頁面不存在｜玩運彩',
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/ForumPage.vue') },
    { path: '/test-nav', name: 'test-nav', component: () => import('../pages/TestNavigationPage.vue') },
    { path: '/forum-test', name: 'forum-test', component: () => import('../pages/ForumTestPage.vue') },
    { path: '/forum', name: 'forum', component: () => import('../pages/ForumPage.vue') },
    {
      path: '/forum/new',
      name: 'forum-create',
      component: () => import('../pages/CreatePostPage.vue'),
      meta: { requiresAuth: true },
    },
    { path: '/login', name: 'login', component: () => import('../pages/LoginPage.vue') },
    { path: '/register', name: 'register', component: () => import('../pages/RegisterPage.vue') },
    { path: '/verify-email', name: 'verify-email', component: () => import('../pages/VerifyEmailPage.vue'), meta: { requiresAuth: true } },
    { path: '/password/change', name: 'password-change', component: () => import('../pages/ChangePasswordPage.vue'), meta: { requiresAuth: true } },
    { path: '/recover', name: 'forgot-password', component: () => import('../pages/ForgotPasswordPage.vue') },
    { path: '/reset-password', name: 'reset-password', component: () => import('../pages/ResetPasswordPage.vue') },
    { path: '/post/:id', name: 'post', component: () => import('../pages/PostPage.vue') },
    // 會員頁：自己的頁面與他人頁面
    { path: '/member', name: 'member', component: () => import('../pages/MemberPage.vue'), meta: { requiresAuth: true } },
    { path: '/member/:id', name: 'member-view', component: () => import('../pages/MemberPage.vue') },
    { path: '/predict', name: 'predict', component: () => import('../pages/PredictPage.vue') },
    {
      path: '/predict/buy',
      name: 'predict-buy',
      component: () => import('../pages/PredictPurchasePage.vue'),
    },
    { path: '/guess', name: 'guess', component: () => import('../pages/GuessPage.vue') },
    { path: '/livescore', name: 'livescore', component: () => import('../pages/LivescorePage.vue') },
    {
      path: '/buy-predict',
      name: 'buy-predict',
      component: () => import('../pages/BuyPredictPage.vue'),
    },
    {
      path: '/billboard',
      name: 'billboard',
      component: () => import('../pages/BillboardPage.vue'),
    },
    {
      path: '/member/search',
      name: 'member-search',
      component: () => import('../pages/MemberSearchPage.vue'),
    },
    // 看數據功能頁面
    {
      path: '/games',
      name: 'games',
      component: () => import('../pages/games/GamesPage.vue'),
    },
    {
      path: '/games/battle/:gameId?',
      name: 'games-battle',
      component: () => import('../pages/games/GamesBattlePage.vue'),
    },
    {
      path: '/games/teams',
      name: 'games-teams',
      component: () => import('../pages/games/GamesTeamsPage.vue'),
    },
    {
      path: '/games/standings',
      name: 'games-standings',
      component: () => import('../pages/games/GamesStandingsPage.vue'),
    },
    {
      path: '/games/results',
      name: 'games-results',
      component: () => import('../pages/games/GamesResultsPage.vue'),
    },
    // 保留舊路由以向後相容
    {
      path: '/games/list',
      name: 'games-list',
      component: () => import('../pages/games/GamesListPage.vue'),
    },
    {
      path: '/games/detail/:id?',
      name: 'game-detail',
      component: () => import('../pages/GameDetailPage.vue'),
    },
    { path: '/member/settings', name: 'member-settings', component: () => import('../pages/MemberSettingsPage.vue'), meta: { requiresAuth: true } },
    { path: '/member/coins/purchase', name: 'coins-purchase', component: () => import('../pages/CoinsPurchasePage.vue'), meta: { requiresAuth: true } },
    // 法律條款頁面
    { path: '/legal', name: 'legal', component: () => import('../pages/LegalPage.vue') },
    // 管理員後台
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
    },
  ],
});

router.beforeEach(async (to) => {
  const session = useSessionStore();
  
  // 檢查管理員權限（靜默重定向）
  if (to.meta && (to.meta as any).requiresAdmin) {
    await session.fetchSession(true);
    if (!session.loggedIn || !session.isAdmin) {
      // 靜默重定向到首頁，不顯示任何錯誤訊息
      return { name: 'home', replace: true };
    }
  }
  
  if (to.meta && (to.meta as any).requiresAuth) {
    // 強制刷新，避免 TTL 快取導致登入後短時間內仍判定未登入而重導
    await session.fetchSession(true);
    if (!session.loggedIn) {
      // 直接使用原始 fullPath，交由路由本身處理編碼，避免二次編碼（%252Fmember）
      return { name: 'login', query: { redirect: to.fullPath } };
    }
  }

  // 全域：若已登入但尚未通過 Email 驗證，限制進入受保護頁（除了 /verify-email 與 /logout）
  const protectedNames = new Set(['member', 'member-view', 'predict', 'predict-buy', 'games', 'games-list', 'game-detail']);
  const bypassNames = new Set(['verify-email', 'logout', 'login', 'register', 'home', 'forum', 'forum-test', 'test-nav', 'legal', 'post', 'not-found', 'admin']);
  if (!bypassNames.has((to.name as string) || '')) {
    try {
      await session.fetchSession();
      if (session.loggedIn) {
        const v = await session.checkVerificationStatus();
        if (v === false && (protectedNames.has((to.name as string) || '') || (to.meta as any)?.requiresAuth)) {
          return { name: 'verify-email', query: { auto: '0' } };
        }
      }
    } catch {}
  }
  return true;
});

router.afterEach((to) => {
  if (typeof document === 'undefined') {
    return;
  }
  const metaTitle = typeof (to.meta as any)?.title === 'string' ? (to.meta as any).title : undefined;
  const routeName = typeof to.name === 'string' ? to.name : undefined;
  const mappedTitle = routeName ? ROUTE_TITLES[routeName] : undefined;
  document.title = metaTitle || mappedTitle || DEFAULT_TITLE;
});

export default router;
