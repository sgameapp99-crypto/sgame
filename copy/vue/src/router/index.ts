import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/forum', name: 'forum', component: () => import('../pages/ForumPage.vue') },
    { path: '/login', name: 'login', component: () => import('../pages/LoginPage.vue') },
    { path: '/register', name: 'register', component: () => import('../pages/RegisterPage.vue') },
    { path: '/post/:id', name: 'post', component: () => import('../pages/PostPage.vue') },
    { path: '/member', name: 'member', component: () => import('../pages/MemberPage.vue') },
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

export default router;
