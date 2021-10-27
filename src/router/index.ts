import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue')
  },
  {
    path: '/not-found',
    name: 'Not-found',
    component: () => import('@/pages/not-found.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
