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
    },
    {
      path: '/guide/:id',
      name: 'GuideInfo',
      props: true,
      component: () => import('@/views/GuideInfo.vue'),
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('@/views/ActivityView.vue'),
      meta: {
        tilte: '志工活動'
      }
    },
    {
      path: '/activity/:id',
      name: 'activityInfo',
      props: true,
      component: () => import('@/views/ActivityInfoView.vue'),
    },
    {
      path: '/donation',
      name: 'donation',
      component: () => import('@/views/DonationView.vue'),
    },
    {
      path: '/membership',
      name: 'membership',
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
      path: '/member/:id',
      name: 'memberinfo',
      props: true,
      component: () => import('@/views/MemberShipinfo.vue'),
      meta: {
        title: '我的活動',
      }
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
    }
  ],

})

// router.beforeEach(async (to, from) => {
// 	if( to.meta && to.meta.title){
// 		document.title = to.meta.title
// 	}
// })
router.beforeEach(authGuard)


export default router
