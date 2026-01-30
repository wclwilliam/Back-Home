import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as apiLogin } from '@/utils/publicApi'
import { fetchMemberInfo } from '@/api/memberApi'

const TOKEN_KEY = 'bh_front_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref(null)
  const redirectAfterLogin = ref(null)
  const isModalOpen = ref(false)
  const resetToken = ref('')

  const isLogin = computed(() => !!token.value)

  const setToken = (val) => {
    token.value = val
    if (val) localStorage.setItem(TOKEN_KEY, val)
    else localStorage.removeItem(TOKEN_KEY)
  }

  const openLoginModal = () => {
    isModalOpen.value = true
  }

  const openResetPasswordModal = (token) => {
    resetToken.value = token
    isModalOpen.value = true
  }

  const closeLoginModal = () => {
    isModalOpen.value = false
    resetToken.value = ''
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

    try {
      // 從 API 獲取最新的會員資料
      const response = await fetchMemberInfo()
      if (response.status === 'success' && response.member) {
        user.value = response.member
        return response.member
      }
      return null
    } catch (error) {
      // 如果 API 失敗（例如 token 過期），清除登入狀態
      console.error('獲取會員資料失敗', error)
      return user.value // 返回已儲存的資料作為後備
    }
  }

  return {
    token,
    user,
    isLogin,
    isModalOpen,
    redirectAfterLogin,
    resetToken,
    login,
    logout,
    fetchMe,
    setToken,
    openLoginModal,
    openResetPasswordModal,
    closeLoginModal,
  }
})
