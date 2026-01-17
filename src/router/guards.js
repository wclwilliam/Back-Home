import { useAuthStore } from '@/stores/auth'

export function authGuard(to) {
  const auth = useAuthStore()
<<<<<<< Updated upstream

  if (to.meta && to.meta.title) {
    document.title = to.meta.title + '｜龜途 Back Home'
  }
=======
    
  if( to.meta && to.meta.title){
		document.title = to.meta.title
	}
>>>>>>> Stashed changes

  if (to.meta.requiresAuth && !auth.isLogin) {
    auth.openLoginModal(to.fullPath)
    return false // 阻止導航
  }
}


