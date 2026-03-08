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
      component: () => import('../views/login/index.vue'),
    },
    {
      path: '/home', // 布局页
      name: 'home',
      component: () => import('../components/layout/index.vue'),
      children: [
        {
          path: 'index', // 首页 - 使用相对路径
          name: 'index',
          redirect: '/home/index/interest', // 重定向到关注页
          component: () => import('../views/index/index.vue'),
          children: [
            {
              path: 'interest', // 关注页 - 使用相对路径
              name: 'interest',
              component: () => import('../views/index/interest/index.vue'),
            },
            {
              path: 'recommend', // 推荐页 - 使用相对路径
              name: 'recommend',
              component: () => import('../views/index/recommend/index.vue'),
            },
            {
              path: 'hotlist', // 热榜页 - 使用相对路径
              name: 'hotlist',
              component: () => import('../views/index/hotlist/index.vue'),
            },
            {
              path: 'video', // 视频页 - 使用相对路径
              name: 'video',
              component: () => import('../views/index/video/index.vue'),
            }
          ]
        },
        {
          path: 'waiting', // 等你来答页 - 使用相对路径
          name: 'waiting',
          component: () => import('../views/waiting/index.vue'),
        },
        {
          path: 'explore', // 发现页 - 使用相对路径
          name: 'explore',
          component: () => import('../views/explore/index.vue'),
        },
        {
          path: 'education', // 知乎知学堂页 - 使用相对路径
          name: 'education',
          component: () => import('../views/education/index.vue'),
        },
      ]
    },
  ],
})

export default router
