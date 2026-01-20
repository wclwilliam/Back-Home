import { useAuthStore } from '@/stores/auth'
import { useHealthStore } from '@/stores/health'



export function authGuard(to) {
  const auth = useAuthStore()
  const healthStore = useHealthStore()

  healthStore.reset()

  if (to.meta && to.meta.title) {
    document.title = to.meta.title + '｜龜途 Back Home'
  }

  if (to.meta.requiresAuth && !auth.isLogin) {
    auth.openLoginModal(to.fullPath)
    return false // 阻止導航
  }
}
