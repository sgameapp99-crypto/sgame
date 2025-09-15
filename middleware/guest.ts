export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  // 如果用戶已登入，重定向到首頁
  if (userStore.isAuthenticated) {
    return navigateTo('/')
  }
})
