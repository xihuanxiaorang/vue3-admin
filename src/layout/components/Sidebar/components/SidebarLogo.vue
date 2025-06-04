<template>
  <div class="h-[var(--navbar-height)] bg-[var(--sidebar-logo-background)]">
    <Transition enter-active-class="animate__animated animate__fadeInLeft">
      <!-- 强制在复用的视图之间进行过渡 https://router.vuejs.org/zh/guide/advanced/transitions.html -->
      <RouterLink
        :key="+appStore.isSidebarCollapsed"
        to="/"
        class="h-full w-full flex items-center justify-center"
      >
        <img alt="logo" src="@/assets/images/logo.png" class="h-5 w-5" />
        <span
          v-if="!appStore.isSidebarCollapsed"
          class="ml-2.5 flex-shrink-0 text-sm text-white font-bold"
          >{{ appTitle }}</span
        >
      </RouterLink>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const appTitle = import.meta.env.VITE_APP_TITLE
</script>
