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
      <el-header class="h-[var(--navbar-height)] bg-[var(--el-bg-color)]">
        <Navbar />
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
