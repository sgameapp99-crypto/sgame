export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  // 檢查用戶是否已登入
  if (!userStore.isAuthenticated) {
    // 保存原始路由用於登入後重定向
    const redirect = to.fullPath
    
    // 重定向到登入頁面
    return navigateTo({
      path: '/login',
      query: { redirect }
    })
  }
})
