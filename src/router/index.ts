import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import type { App } from 'vue'

/**
 * 静态路由表
 */
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      // 路由重定向组件，用于解决标签页刷新问题
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },
]

/**
 * 动态路由表
 */
const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    component: Layout,
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'system',
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'user' },
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'role' },
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', icon: 'menu' },
      },
    ],
  },
  {
    path: '/doc',
    name: 'Doc',
    component: Layout,
    meta: {
      title: '平台文档',
      icon: 'document',
      alwaysShow: true,
    },
    children: [
      {
        path: 'https://docs.xiaorang.fun',
        name: 'ExternalDoc',
        redirect: 'https://docs.xiaorang.fun',
        meta: {
          title: '平台文档(外链)',
          icon: 'link',
        },
      },
    ],
  },
  {
    path: '/multi-level',
    name: 'MultiLevel',
    component: Layout,
    redirect: '/multi-level/multi-level1',
    meta: { title: '多级菜单', icon: 'cascader' },
    children: [
      {
        path: 'multi-level1',
        name: 'MultiLevel1',
        component: () => import('@/views/demo/multi-level/level1.vue'),
        redirect: '/multi-level/multi-level1/multi-level2',
        meta: { title: '菜单一级', icon: '' },
        children: [
          {
            path: 'multi-level2',
            name: 'MultiLevel2',
            component: () => import('@/views/demo/multi-level/children/level2.vue'),
            redirect: '/multi-level/multi-level1/multi-level2/multi-level3-1',
            meta: { title: '菜单二级', icon: '' },
            children: [
              {
                path: 'multi-level3-1',
                component: () => import('@/views/demo/multi-level/children/children/level3-1.vue'),
                name: 'MultiLevel31',
                meta: { title: '菜单三级-1', icon: '' },
              },
              {
                path: 'multi-level3-2',
                component: () => import('@/views/demo/multi-level/children/children/level3-2.vue'),
                name: 'MultiLevel32',
                meta: { title: '菜单三级-2', icon: '' },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/demo',
    name: 'Demo',
    component: Layout,
    redirect: '/demo/test',
    meta: {
      title: '功能演示',
      icon: 'menu',
    },
    children: [
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/demo/test/index.vue'),
        meta: { title: '测试页面', icon: '', keepAlive: true },
      },
    ],
  },
]

export const routes = [...constantRoutes, ...dynamicRoutes]

/**
 * 创建路由实例
 */
const router = createRouter({
  // 路由模式
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由表
  routes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

/**
 * 注册路由插件
 * @param app Vue实例
 */
export function setupRouter(app: App) {
  app.use(router)
}
