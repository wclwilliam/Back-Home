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
      path: '/about/info',
      name: 'aboutInfo',
      props: true,
      component: () => import('@/views/AboutInfoView.vue'),
    },
    {
      path: '/about/:id',
      name: 'aboutDetail',
      props: true,
      component: () => import('@/views/AboutDetailVue.vue'),
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('@/views/ActivityView.vue'),
      meta: {
        tilte:'志工活動'
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
      path: '/member',
      name: 'member',
      component: () => import('@/views/MemberShip.vue'),
      meta: { requiresAuth: true },
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
      path: '/product',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
      meta: { hideFooter: true },
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
    },,

    // --- 後台管理路由 ---
    {
      path: '/admin',
      component: AdminLayout, // ✅ 父層 Layout
      children: [
        {
          path: '', // ✅ /admin
          name: 'admin-home',
          component: AdminHome
        },
        {
          path: 'users', // ✅ /admin/users
          name: 'admin-users',
          component: AdminUsers
        },
        {
          path: 'users/:id', // ✅ /admin/users/123
          name: 'admin-user-detail',
          component: AdminUserDetail,
          props: true // ✅ 把 params 變成 props
        },
        {
          path: 'settings', // ✅ /admin/settings
          name: 'admin-settings',
          component: AdminSettings
        }
      ]
    }
  ],
  
})

router.beforeEach(async (to, from) => {
	if( to.meta && to.meta.title){
		document.title = to.meta.title
	}
})
// router.beforeEach(authGuard)

export default router
