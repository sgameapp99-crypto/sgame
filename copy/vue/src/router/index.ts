import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '../stores/session';

const DEFAULT_TITLE = '運彩王預測平台';

const ROUTE_TITLES: Record<string, string> = {
  home: '運彩王討論區首頁｜運彩王',
  forum: '討論區｜運彩王',
  'forum-create': '發表文章｜運彩王',
  login: '會員登入｜運彩王',
  register: '加入會員｜運彩王',
  'verify-email': 'Email 驗證｜運彩王',
  'password-change': '變更密碼｜運彩王',
  'forgot-password': '忘記密碼｜運彩王',
  'reset-password': '重設密碼｜運彩王',
  post: '文章內容｜運彩王',
  member: '我的會員中心｜運彩王',
  'member-view': '會員資訊｜運彩王',
  predict: '預測賽事｜運彩王',
  'predict-buy': '預測購買｜運彩王',
  guess: '玩競猜｜運彩王',
  livescore: '即時比分｜運彩王',
  'buy-predict': '找高手｜運彩王',
  billboard: '高手排行榜｜運彩王',
  'member-search': '玩家搜尋｜運彩王',
  games: '賽事資料｜運彩王',
  'games-battle': '對戰資訊｜運彩王',
  'games-teams': '球隊資訊｜運彩王',
  'games-standings': '排名戰績｜運彩王',
  'games-results': '賽事結果｜運彩王',
  'games-list': '賽事列表｜運彩王',
  'game-detail': '賽事詳情｜運彩王',
  'member-settings': '帳戶設定｜運彩王',
  'coins-purchase': '榮譽點購買｜運彩王',
  terms: '服務條款｜運彩王',
  contact: '聯絡我們｜運彩王',
  legal: '法律條款｜運彩王',
  admin: '管理後台｜運彩王',
  'not-found': '頁面不存在｜運彩王',
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/ForumPage.vue') },
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
    { path: '/terms', name: 'terms', component: () => import('../pages/TermsPage.vue') },
    { path: '/contact', name: 'contact', component: () => import('../pages/ContactPage.vue') },
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
  const bypassNames = new Set(['verify-email', 'logout', 'login', 'register', 'home', 'forum', 'legal', 'terms', 'contact', 'post', 'not-found', 'admin']);
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
