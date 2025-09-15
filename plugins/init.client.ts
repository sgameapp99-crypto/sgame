export default defineNuxtPlugin(async () => {
  // 客戶端初始化邏輯
  
  // 初始化應用狀態
  const appStore = useAppStore()
  const userStore = useUserStore()
  
  try {
    // 從本地存儲恢復用戶狀態
    userStore.initializeFromStorage()
    
    // 初始化應用設置
    await appStore.initializeApp()
    
    // 如果有令牌，嘗試獲取用戶信息
    if (userStore.token && !userStore.user) {
      try {
        await userStore.getCurrentUser()
      } catch (error) {
        console.warn('自動登入失敗:', error)
        // 清除無效的令牌
        userStore.clearUserData()
      }
    }
    
    console.log('✅ 客戶端初始化完成')
  } catch (error) {
    console.error('❌ 客戶端初始化失敗:', error)
  }
})
