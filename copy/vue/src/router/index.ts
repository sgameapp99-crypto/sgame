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
    await session.fetchSession();
    if (!session.loggedIn) {
      const redirect = encodeURIComponent(to.fullPath);
      return { name: 'login', query: { redirect } };
    }
  }
  return true;
});

export default router;
