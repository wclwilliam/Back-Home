import { useAuthStore } from '@/stores/auth'

export function authGuard(to) {
  const auth = useAuthStore()
    
  if (to.meta.requiresAuth && !auth.isLogin) {
    auth.openLoginModal(to.fullPath)
    return false // 阻止導航
  }
}


