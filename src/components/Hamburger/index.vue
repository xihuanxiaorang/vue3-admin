<template>
  <div class="flex items-center justify-center">
    <el-icon :size="iconSize" class="cursor-pointer" @click="appStore.toggleSidebarStatus">
      <SvgIcon
        icon-name="collapse"
        :class="{ 'rotate-180': appStore.isSidebarCollapsed }"
        class="align-middle"
      />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'

const { iconSize = 25 } = defineProps<{ iconSize?: number }>()
const appStore = useAppStore()
</script>
