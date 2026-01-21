import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { authGuard } from './guards.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首頁',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: {
        title: '關於我們',
      },
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/NewsView.vue'),
      meta: { title: '最新消息' },
    },
    {
      path: '/news/:id',
      name: 'NewsDetail',
      props: true,
      component: () => import('@/views/NewsDetail.vue'),
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/GuideView.vue'),
      meta: { title: '認識海龜' },
    },
    {
      path: '/guidemap',
      name: 'guidemap',
      component: () => import('@/views/GuideBigMap.vue'),
      meta: { title: '海龜地圖' },
    },
    {
      path: '/guide/:id',
      name: 'GuideInfo',
      props: true,
      component: () => import('@/views/GuideInfo.vue'),
       meta: { title: '海龜圖鑑' }
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('@/views/ActivityView.vue'),
      meta: { title: '志工活動' },
    },
    {
      path: '/activity/:id',
      name: 'activityInfo',
      props: true,
      meta: { title: '活動詳情', hideFooter: true,},
      component: () => import('@/views/ActivityInfoView.vue'),
    },
    {
      path: '/donation',
      name: 'donation',
      component: () => import('@/views/DonationView.vue'),
      meta: { title: '支持保育' },
    },
    {
      path: '/member',
      name: 'member',
      component: () => import('@/views/MemberShip.vue'),
      //meta: { requiresAuth: true },
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
      meta: {
        title: '海洋守護',
        hideFooter: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/test-lightbox',
      name: 'testLightbox',
      component: () => import('@/views/TestLightbox.vue'),
      meta: {
        title: 'Lightbox 測試',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果是按「上一頁」或 router.back()，會回到原本滾動的位置
      return savedPosition
    } else {
      // 如果是前往新頁面，就回到最頂端
      return { top: 0 }
    }
  },
})

// router.beforeEach(async (to, from) => {
// 	if( to.meta && to.meta.title){
// 		document.title = to.meta.title
// 	}
// })
router.beforeEach(authGuard)

export default router
