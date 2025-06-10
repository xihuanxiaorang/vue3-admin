<template>
  <el-container class="h-screen w-screen">
    <el-aside
      class="bg-[var(--el-menu-bg-color)] color-[var(--el-menu-text-color)] transition-[width] duration-300 ease-in-out"
      :class="[
        appStore.isSidebarCollapsed
          ? 'w-[var(--sidebar-width-collapse)]'
          : 'w-[var(--sidebar-width)]',
      ]"
    >
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header
        class="h-[calc(var(--navbar-height)+var(--tags-view-height))] bg-[var(--el-bg-color)] px-0"
      >
        <Navbar class="h-[var(--navbar-height)] px-5" />
        <TagsView class="h-[var(--tags-view-height)] px-5" />
      </el-header>
      <el-main class="bg-[var(--el-bg-color-page)]">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()
</script>
