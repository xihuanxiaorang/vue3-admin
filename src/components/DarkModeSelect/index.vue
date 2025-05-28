<template>
  <el-icon :size="iconSize" class="cursor-pointer" @click="toggle">
    <template v-if="mode === 'dark'">
      <i-ep-moon />
    </template>
    <template v-else>
      <i-ep-sunny />
    </template>
  </el-icon>
</template>

<script setup lang="ts">
const { iconSize = 30 } = defineProps<{ iconSize?: number }>()
const mode = useColorMode()
const isSystemDark = usePreferredDark()

// 若当前模式与系统主题一致，则回退为自动模式（'auto'），以便后续继续跟随系统
const maybeResetMode = () => {
  const matchesSystem = mode.value === (isSystemDark.value ? 'dark' : 'light')
  if (matchesSystem) {
    mode.value = 'auto'
  }
}

// 当系统主题变化时，尝试回退为自动模式
watch(isSystemDark, maybeResetMode)

const toggle = (event: MouseEvent) => {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(async () => {
    // 手动切换主题，暂时中断系统跟随
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    await nextTick()
    // 如果当前主题切换后与系统一致，则恢复为自动模式
    maybeResetMode()
  })
  transition.ready.then(() => {
    const isDark = mode.value === 'dark'
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    )
  })
}
</script>
