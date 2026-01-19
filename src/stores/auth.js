import { ref} from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isModalOpen = ref(false)
  const isLogin = ref(false) //暫時設定為有登入
  const redirectAfterLogin = ref(null)

  const openLoginModal = (redirect) => {
    redirectAfterLogin.value = redirect
    isModalOpen.value = true
  }
  const loginSuccess = () => {
    isLogin.value = true
    isModalOpen.value = false
  }


  return { isModalOpen ,isLogin , redirectAfterLogin , openLoginModal , loginSuccess}
})