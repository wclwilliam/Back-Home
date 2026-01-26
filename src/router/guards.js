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
    // 設定登入後要導向的頁面
    auth.redirectAfterLogin = to.fullPath
    // 開啟登入燈箱
    auth.openLoginModal()
    // 導向首頁並阻止原本的導航
    return { name: 'home' }
  }
}
