export const useAppStore = defineStore('app', () => {
  // 狀態
  const theme = ref<'light' | 'dark' | 'auto'>('light')
  const language = ref<'zh-TW' | 'zh-CN' | 'en-US'>('zh-TW')
  const sidebarCollapsed = ref(false)
  const loading = ref(false)
  const cachedViews = ref<string[]>([])
  const visitedViews = ref<RouteLocationNormalized[]>([])

  // 計算屬性
  const isDarkMode = computed(() => {
    if (theme.value === 'auto') {
      return process.client && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  })

  const currentLanguage = computed(() => language.value)

  // 動作方法
  const initializeApp = async () => {
    try {
      // 從本地存儲恢復設置
      if (process.client) {
        const savedTheme = localStorage.getItem('app-theme') as typeof theme.value
        const savedLanguage = localStorage.getItem('app-language') as typeof language.value
        const savedSidebarState = localStorage.getItem('sidebar-collapsed')

        if (savedTheme) theme.value = savedTheme
        if (savedLanguage) language.value = savedLanguage
        if (savedSidebarState) sidebarCollapsed.value = JSON.parse(savedSidebarState)
      }

      // 應用主題
      applyTheme()
      
      console.log('📱 應用狀態初始化完成')
    } catch (error) {
      console.error('❌ 應用狀態初始化失敗:', error)
      throw error
    }
  }

  const setTheme = (newTheme: typeof theme.value) => {
    theme.value = newTheme
    if (process.client) {
      localStorage.setItem('app-theme', newTheme)
    }
    applyTheme()
  }

  const setLanguage = (newLanguage: typeof language.value) => {
    language.value = newLanguage
    if (process.client) {
      localStorage.setItem('app-language', newLanguage)
    }
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    if (process.client) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed.value))
    }
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
    if (process.client) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed))
    }
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const addCachedView = (viewName: string) => {
    if (!cachedViews.value.includes(viewName)) {
      cachedViews.value.push(viewName)
    }
  }

  const removeCachedView = (viewName: string) => {
    const index = cachedViews.value.indexOf(viewName)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }

  const clearCachedViews = () => {
    cachedViews.value = []
  }

  const addVisitedView = (view: RouteLocationNormalized) => {
    const existingIndex = visitedViews.value.findIndex(v => v.path === view.path)
    if (existingIndex > -1) {
      visitedViews.value[existingIndex] = view
    } else {
      visitedViews.value.push(view)
    }
  }

  const removeVisitedView = (view: RouteLocationNormalized) => {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
  }

  const clearVisitedViews = () => {
    visitedViews.value = []
  }

  // 私有方法
  const applyTheme = () => {
    if (process.client) {
      const htmlElement = document.documentElement
      
      if (isDarkMode.value) {
        htmlElement.classList.add('dark')
        htmlElement.setAttribute('data-theme', 'dark')
      } else {
        htmlElement.classList.remove('dark')
        htmlElement.setAttribute('data-theme', 'light')
      }
    }
  }

  // 監聽系統主題變化
  const setupThemeListener = () => {
    if (process.client && theme.value === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme()
      
      mediaQuery.addEventListener('change', handleChange)
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }

  // 全局通知管理
  const notifications = ref<Notification[]>([])

  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      timestamp: new Date(),
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // 自動移除通知
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 4500)
    }
    
    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  return {
    // 狀態
    theme: readonly(theme),
    language: readonly(language),
    sidebarCollapsed: readonly(sidebarCollapsed),
    loading: readonly(loading),
    cachedViews: readonly(cachedViews),
    visitedViews: readonly(visitedViews),
    notifications: readonly(notifications),
    
    // 計算屬性
    isDarkMode,
    currentLanguage,
    
    // 方法
    initializeApp,
    setTheme,
    setLanguage,
    toggleSidebar,
    setSidebarCollapsed,
    setLoading,
    addCachedView,
    removeCachedView,
    clearCachedViews,
    addVisitedView,
    removeVisitedView,
    clearVisitedViews,
    setupThemeListener,
    showNotification,
    removeNotification,
    clearNotifications
  }
})

// 類型定義
interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'info' | 'error'
  duration?: number // 0 表示不自動關閉
  timestamp: Date
}

// HMR 支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
