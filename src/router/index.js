import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login', // 重定向到登录页
    },
    {
      path: '/login', // 登录页
      name: 'login',
      component: () => import('../views/login/LoginView.vue'),
    },
    {
      path: '/home', // 布局页
      name: 'home',
      component: () => import('../components/layout/MainLayout.vue'),
      meta: { requiresAuth: true }, 
      children: [
        {
          path: 'index', // 首页
          name: 'index',
          redirect: '/home/index/recruit', // 默认跳招募大厅
          component: () => import('../views/home/HomeView.vue'),
          children: [
            {
              path: 'recruit',
              name: 'recruit',
              component: () => import('../views/recruit/RecruitList.vue'),
            },
            {
              path: 'share',
              name: 'share',
              component: () => import('../views/share/ShareList.vue'),
            }
          ]
        },
        {
          path: 'explore', // 竞赛大厅(日历)页
          name: 'explore',
          component: () => import('../views/explore/CompetitionCalendar.vue'),
        },
        {
          path: 'detail/:id',
          name: 'detail',
          component: () => import('../views/detail/PostDetail.vue'),
        },
        {
          path: 'profile', // 个人大满贯主页
          name: 'profile',
          component: () => import('../views/profile/UserProfile.vue'),
        }
      ]
    },
  ],
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = 'fake-jwt-token-for-test' 
    if (!token) {
      console.warn('🚧 路由守卫拦截：无 Token，访问受限')
      next({
        path: '/login',
        query: { redirect: to.fullPath } 
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
