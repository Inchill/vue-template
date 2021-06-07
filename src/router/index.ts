import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('pages/Home.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router