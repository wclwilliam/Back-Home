import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// import http from '@/api/http' // 未來串接真實 API 時取消註解
import { login as apiLogin } from '@/utils/publicApi'

const TOKEN_KEY = 'bh_front_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref(null)
  const redirectAfterLogin = ref(null)
  const isModalOpen = ref(false)

  const isLogin = computed(() => !!token.value)

  const setToken = (val) => {
    token.value = val
    if (val) localStorage.setItem(TOKEN_KEY, val)
    else localStorage.removeItem(TOKEN_KEY)
  }

  const openLoginModal = () => {
    isModalOpen.value = true
  }

  const closeLoginModal = () => {
    isModalOpen.value = false
  }

  const login = async ({ account, password }) => {
    try {
      // 使用真實登入 API
      const data = await apiLogin(account, password)

      // 儲存 token 和用戶資料
      setToken(data.token)
      user.value = data.user

      // 登入成功後關閉燈箱
      closeLoginModal()

      return data
    } catch (error) {
      throw new Error(error.message || '登入失敗')
    }
  }

  const logout = async () => {
    // 清除本地狀態
    setToken('')
    user.value = null
    redirectAfterLogin.value = null
  }

  const fetchMe = async () => {
    if (!token.value) return null
    // 如果有 token，返回已儲存的用戶資料
    return user.value
  }

  return {
    token,
    user,
    isLogin,
    isModalOpen,
    redirectAfterLogin,
    login,
    logout,
    fetchMe,
    setToken,
    openLoginModal,
    closeLoginModal,
  }
})
