import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

/**
 * 静态路由表
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'demo',
        name: 'Demo',
        redirect: '/demo/test',
        children: [
          {
            path: 'test',
            name: 'Test',
            component: () => import('@/views/demo/test/index.vue'),
          },
        ],
      },
    ],
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
