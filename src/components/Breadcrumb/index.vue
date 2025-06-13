<template>
  <el-breadcrumb separator="/" class="text-14px">
    <!-- 使用过渡组实现面包屑项右侧淡入动画效果 -->
    <transition-group enter-active-class="animate__animated animate__fadeInRight">
      <!-- 动态渲染面包屑项 -->
      <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbList" :key="breadcrumb.path">
        <!-- 最后一个面包屑项显示为普通文本，其余显示为可点击链接 -->
        <span v-if="breadcrumbList.length - 1 === index">{{ breadcrumb.meta.title }}</span>
        <a v-else @click.prevent="handleClick(breadcrumb)">{{ breadcrumb.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import type { RouteLocationMatched } from 'vue-router'
import { compile } from 'path-to-regexp'

const route = useRoute()
const router = useRouter()

/**
 * 面包屑导航项列表
 */
const breadcrumbList = ref<RouteLocationMatched[]>([])

/**
 * 判断给定路由是否为首页路由
 * @param {RouteLocationMatched} route - 待判断的路由
 * @returns {boolean} 路由名称转为小写后是否等于 'dashboard'
 */
const isHome = (route: RouteLocationMatched): boolean => {
  return route.name?.toString().toLocaleLowerCase() === 'dashboard'
}

/**
 * 生成面包屑导航列表：
 * 1. 过滤出包含标题且不需要隐藏的面包屑项
 * 2. 确保首项为首页（当首项不是首页时会自动添加）
 * 3. 更新面包屑列表
 */
const getBreadcrumbList = () => {
  const matched = route.matched.filter((item) => item.meta.title && !item.meta.breadcrumb)
  const first = matched[0]
  if (first && !isHome(first)) {
    matched.unshift({
      path: '/',
      meta: { title: '首页' },
    } as RouteLocationMatched)
  }
  breadcrumbList.value = matched
}

/**
 * 编译动态路径（处理路径参数）
 * @param {string} path - 包含动态参数的路由路径，如（'/user/:id'）
 * @returns {string} 编译后带实际参数值的完整路径
 * @example /user/:id => /user/123
 */
const pathCompile = (path: string) => {
  return compile(path)(route.params)
}

/**
 * 处理面包屑项点击事件
 * @param {RouteLocationMatched} route - 面包屑项所对应的路由
 * @desc 优先 redirect 跳转，其次跳转至经过编译处理后的完整路径
 */
const handleClick = (route: RouteLocationMatched) => {
  const { redirect, path } = route
  if (redirect) {
    router.push(redirect as string)
    return
  }
  router.push(pathCompile(path))
}

/**
 * 监听路由变化实时更新面包屑列表（立即执行初始化）
 */
watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/redirect')) return
    getBreadcrumbList()
  },
  { immediate: true },
)
</script>
