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
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
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
      path: '/about/:id',
      name: 'aboutInfo',
      props: true,
      component: () => import('@/views/AboutInfoView.vue'),
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('@/views/ActivityView.vue'),
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
      path: '/member',
      name: 'member',
      component: () => import('@/views/MemberShip.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
      meta: { hideFooter: true }
    },
    {
      path: '/member/:id',
      name: 'memberinfo',
      props: true,
      component: () => import('@/views/MemberShipinfo.vue'),
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
    },
    {
      path: '/product/:id',
      name: 'productinfo',
      component: () => import('@/views/ProductInfoView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

router.beforeEach(authGuard)

export default router
