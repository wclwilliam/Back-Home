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
      path: '/member',
      name: '/member',
      component: () => import('@/views/MemberShip.vue'),
    },
  ],
})

export default router
