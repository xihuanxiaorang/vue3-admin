<template>
  <el-menu
    :default-active="route.path"
    :collapse="appStore.isSidebarCollapsed"
    :collapse-transition="false"
    class="border-r-0"
  >
    <SidebarMenuItem
      v-for="item in routes"
      :key="item.path"
      :item="item"
      :base-path="resolvePath(item.path, '')"
    />
  </el-menu>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
import { routes } from '@/router'
import { resolvePath } from '@/utils'

const appStore = useAppStore()

const route = useRoute()
</script>
