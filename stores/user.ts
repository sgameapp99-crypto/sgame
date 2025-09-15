export const useUserStore = defineStore('user', () => {
  // 狀態
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<User | null>(null)
  const loading = ref(false)

  // 計算屬性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'guest')
  const userLevel = computed(() => user.value?.level || 'bronze')
  const isAdmin = computed(() => userRole.value === 'admin')
  const isModerator = computed(() => ['admin', 'moderator'].includes(userRole.value))

  // 動作方法
  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      
      // TODO: 實現真實的登入 API 調用
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      const { access_token, refresh_token, user: userData } = response
      
      // 保存令牌和用戶信息
      token.value = access_token
      refreshToken.value = refresh_token
      user.value = userData
      
      // 存儲到本地存儲
      if (process.client) {
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        localStorage.setItem('user_info', JSON.stringify(userData))
      }
      
      console.log('✅ 用戶登入成功:', userData.username)
      return response
    } catch (error) {
      console.error('❌ 登入失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      loading.value = true
      
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: registerData
      })
      
      console.log('✅ 用戶註冊成功')
      return response
    } catch (error) {
      console.error('❌ 註冊失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      
      // 調用登出 API
      if (token.value) {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
      }
      
      // 清除狀態
      clearUserData()
      
      console.log('✅ 用戶登出成功')
    } catch (error) {
      console.error('❌ 登出失敗:', error)
      // 即使 API 失敗也要清除本地數據
      clearUserData()
    } finally {
      loading.value = false
    }
  }

  const getCurrentUser = async () => {
    try {
      if (!token.value) return null
      
      const response = await $fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      user.value = response
      
      // 更新本地存儲
      if (process.client) {
        localStorage.setItem('user_info', JSON.stringify(response))
      }
      
      return response
    } catch (error) {
      console.error('❌ 獲取用戶信息失敗:', error)
      // 如果獲取用戶信息失敗，可能是令牌無效，清除登入狀態
      clearUserData()
      throw error
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      loading.value = true
      
      const response = await $fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: profileData
      })
      
      user.value = { ...user.value, ...response }
      
      // 更新本地存儲
      if (process.client) {
        localStorage.setItem('user_info', JSON.stringify(user.value))
      }
      
      console.log('✅ 個人資料更新成功')
      return response
    } catch (error) {
      console.error('❌ 個人資料更新失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      loading.value = true
      
      const response = await $fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          old_password: oldPassword,
          new_password: newPassword
        }
      })
      
      console.log('✅ 密碼修改成功')
      return response
    } catch (error) {
      console.error('❌ 密碼修改失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('無刷新令牌')
      }
      
      const response = await $fetch('/api/auth/refresh', {
        method: 'POST',
        body: { refresh_token: refreshToken.value }
      })
      
      const { access_token } = response
      
      token.value = access_token
      
      if (process.client) {
        localStorage.setItem('access_token', access_token)
      }
      
      return access_token
    } catch (error) {
      console.error('❌ 令牌刷新失敗:', error)
      clearUserData()
      throw error
    }
  }

  const initializeFromStorage = () => {
    if (process.client) {
      try {
        const storedToken = localStorage.getItem('access_token')
        const storedRefreshToken = localStorage.getItem('refresh_token')
        const storedUser = localStorage.getItem('user_info')
        
        if (storedToken) token.value = storedToken
        if (storedRefreshToken) refreshToken.value = storedRefreshToken
        if (storedUser) user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('❌ 從本地存儲初始化用戶數據失敗:', error)
        clearUserData()
      }
    }
  }

  // 私有方法
  const clearUserData = () => {
    token.value = null
    refreshToken.value = null
    user.value = null
    
    // 清除本地存儲
    if (process.client) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_info')
    }
  }

  return {
    // 狀態
    token: readonly(token),
    refreshToken: readonly(refreshToken),
    user: readonly(user),
    loading: readonly(loading),
    
    // 計算屬性
    isAuthenticated,
    userRole,
    userLevel,
    isAdmin,
    isModerator,
    
    // 方法
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    refreshAccessToken,
    clearUserData,
    initializeFromStorage
  }
})

// 類型定義
interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  nickname?: string
  role: 'admin' | 'moderator' | 'vip' | 'user' | 'guest'
  level: 'diamond' | 'gold' | 'silver' | 'bronze' | 'newbie'
  status: 'active' | 'inactive' | 'banned' | 'pending'
  balance: number
  points: number
  predictionCount: number
  successRate: number
  followersCount: number
  followingCount: number
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
}

interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
  captcha?: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  inviteCode?: string
  agreesToTerms: boolean
  captcha: string
}

// HMR 支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
