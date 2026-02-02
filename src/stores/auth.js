import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as apiLogin } from '@/utils/publicApi'
import { fetchMemberInfo } from '@/api/memberApi'

const TOKEN_KEY = 'bh_front_token'
const USER_KEY = 'bh_front_user'

// 統一格式化用戶資料，解決後端欄位名稱不一致問題
const normalizeUserData = (rawData) => {
  if (!rawData) return null

  return {
    id: rawData.id || rawData.member_id || rawData.MEMBER_ID,
    name: rawData.name || rawData.MEMBER_REALNAME,
    email: rawData.email || rawData.MEMBER_EMAIL,
    phone: rawData.phone || rawData.MEMBER_PHONE,
    idNumber: rawData.idNumber || rawData.ID_NUMBER,
    birthday: rawData.birthday || rawData.BIRTHDAY,
    emergencyContact: rawData.emergencyContact || rawData.EMERGENCY,
    emergencyPhone: rawData.emergencyPhone || rawData.EMERGENCY_TEL,
    // 保留原始資料以備不時之需
    ...rawData,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  // 初始化時從 localStorage 讀取 user，解決重新整理後資料遺失問題
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY)) || null)
  const redirectAfterLogin = ref(null)
  const isModalOpen = ref(false)
  const resetToken = ref('')

  const isLogin = computed(() => !!token.value)

  const setToken = (val) => {
    token.value = val
    if (val) localStorage.setItem(TOKEN_KEY, val)
    else localStorage.removeItem(TOKEN_KEY)
  }

  const setUser = (userData) => {
    const normalized = normalizeUserData(userData)
    user.value = normalized
    if (normalized) {
      localStorage.setItem(USER_KEY, JSON.stringify(normalized))
    } else {
      localStorage.removeItem(USER_KEY)
    }
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

      // 儲存 token
      setToken(data.token)

      // 登入成功後，從後端獲取完整的會員資料
      await fetchMe()

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
    setUser(null)
    redirectAfterLogin.value = null
  }

  const fetchMe = async () => {
    if (!token.value) return null

    try {
      // 從 API 獲取最新的會員資料
      const response = await fetchMemberInfo()
      if (response.status === 'success' && response.member) {
        // 使用 setUser 統一格式化並持久化資料
        setUser(response.member)
        return user.value
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
    setUser,
    openLoginModal,
    openResetPasswordModal,
    closeLoginModal,
  }
})
