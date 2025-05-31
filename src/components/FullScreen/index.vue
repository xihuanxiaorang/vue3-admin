<template>
  <el-icon :size="iconSize" class="cursor-pointer" @click="toggle">
    <template v-if="isFullscreen">
      <IMdiFullscreenExit />
    </template>
    <template v-else>
      <IMdiFullscreen />
    </template>
  </el-icon>
</template>

<script setup lang="ts">
const { isFullscreen, toggle } = useFullscreen()
const { iconSize = 25 } = defineProps<{ iconSize?: number }>()
</script>
