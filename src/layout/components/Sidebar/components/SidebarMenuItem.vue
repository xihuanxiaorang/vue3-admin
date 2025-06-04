<template>
  <template v-if="isVisible">
    <AppLink v-if="isRenderedAsMenuItem" :to="resolvePath(targetMenuItem?.path || '', basePath)">
      <el-menu-item :index="resolvePath(targetMenuItem?.path || '', basePath)">
        <el-icon>
          <svg-icon :icon-name="targetMenuItem?.meta?.icon || 'menu'" />
        </el-icon>
        <template #title>
          {{ targetMenuItem?.meta?.title }}
        </template>
      </el-menu-item>
    </AppLink>
    <el-sub-menu v-else :index="resolvePath(item.path, basePath)">
      <template #title>
        <el-icon>
          <svg-icon :icon-name="item.meta?.icon || 'menu'" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <SidebarMenuItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path, basePath)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { resolvePath } from '@/utils'
import type { RouteRecordRaw } from 'vue-router'

const { item, basePath = '' } = defineProps<{
  /**
   * 路由配置项
   */
  item: RouteRecordRaw
  /**
   * 基础路径，用于拼接完整路由路径
   */
  basePath?: string
}>()

/** 当前菜单是否可见 */
const isVisible = computed(() => !item.meta?.hidden)

/** 所有可见子菜单 */
const visibleChildren = computed(() => {
  return item.children?.filter((child) => !child.meta?.hidden) || []
})

/**
 * 作为 menu-item 渲染的目标项，配合 {@function isRenderedAsMenuItem} 一起使用：
 * 1. 无可见子菜单时返回自身（特别注意：需要将 path 置为空，否则在拼接的时候会多一层自身的 path）
 * 2. 未设置始终显示（alwaysShow）&& 有且仅有一个子菜单时返回该子菜单
 */
const targetMenuItem = computed(() => {
  if (visibleChildren.value.length === 0) return { ...item, path: '' }

  if (
    visibleChildren.value.length === 1 &&
    !visibleChildren.value[0].children &&
    !item.meta?.alwaysShow
  ) {
    return visibleChildren.value[0]
  }

  return null
})

/** 是否作为 menu-item 渲染（否则渲染为 sub-menu） */
const isRenderedAsMenuItem = computed(() => !!targetMenuItem.value)
</script>
