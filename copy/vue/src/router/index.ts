import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '../stores/session';
import HomePage from '../pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/test-nav', name: 'test-nav', component: () => import('../pages/TestNavigationPage.vue') },
    { path: '/forum-test', name: 'forum-test', component: () => import('../pages/ForumTestPage.vue') },
    { path: '/forum', name: 'forum', component: () => import('../pages/ForumPage.vue') },
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
    { path: '/games', name: 'games', component: () => import('../pages/GamesPage.vue') },
    {
      path: '/games/list',
      name: 'games-list',
      component: () => import('../pages/GamesListPage.vue'),
    },
    {
      path: '/games/detail/:id?',
      name: 'game-detail',
      component: () => import('../pages/GameDetailPage.vue'),
    },
    { path: '/member/settings', name: 'member-settings', component: () => import('../pages/MemberSettingsPage.vue'), meta: { requiresAuth: true } },
    // 法律條款頁面
    { path: '/legal', name: 'legal', component: () => import('../pages/LegalPage.vue') },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
    },
  ],
});

router.beforeEach(async (to) => {
  const session = useSessionStore();
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
  const bypassNames = new Set(['verify-email', 'logout', 'login', 'register', 'home', 'forum', 'forum-test', 'test-nav', 'legal', 'post', 'not-found']);
  if (!bypassNames.has((to.name as string) || '')) {
    try {
      await session.fetchSession();
      if (session.loggedIn) {
        const v = await session.checkVerificationStatus();
        if (v === false && (protectedNames.has((to.name as string) || '') || (to.meta as any)?.requiresAuth)) {
          return { name: 'verify-email' };
        }
      }
    } catch {}
  }
  return true;
});

export default router;
