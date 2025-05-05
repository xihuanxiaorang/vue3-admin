import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/**
 * 静态路由表
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/about',
    component: () => import('../views/About.vue'),
  },
]

/**
 * 创建路由实例
 */
export default createRouter({
  // 路由模式
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由表
  routes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
