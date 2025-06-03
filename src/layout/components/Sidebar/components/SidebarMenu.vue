<template>
  <el-menu
    :default-active="route.path"
    :collapse="appStore.isSidebarCollapsed"
    :collapse-transition="false"
    class="border-r-0"
    router
  >
    <el-menu-item index="/dashboard">
      <el-icon>
        <IMdiViewDashboard />
      </el-icon>
      <template #title>Dashboard</template>
    </el-menu-item>
    <el-menu-item index="/demo/test">
      <el-icon>
        <IMdiSlideshow />
      </el-icon>
      <template #title>测试页面</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const route = useRoute()
</script>
