import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/GuideView.vue'),
    },
    {
      path: '/guide/:id',
      name: 'guideInfo',
      props:true,
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
      path: '/member',
      name: '/member',
      component: () => import('@/views/MemberShip.vue'),
    },
    {
      path: '/game',
      name: '/game',
      component: () => import('@/views/GameView.vue'),
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
    },
    {
      path: '/product/:id',
      name: 'productInfo',
      props: true,
      component: () => import('@/views/ProductInfoView.vue'),
    },
  ],
})

export default router
