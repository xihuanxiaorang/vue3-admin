<template>
  <el-icon :size="iconSize" class="cursor-pointer" @click="toggle">
    <template v-if="isFullscreen">
      <SvgIcon icon-name="fullscreen-exit" />
    </template>
    <template v-else>
      <SvgIcon icon-name="fullscreen" />
    </template>
  </el-icon>
</template>

<script setup lang="ts">
const { isFullscreen, toggle } = useFullscreen()
const { iconSize = 25 } = defineProps<{ iconSize?: number }>()
</script>
