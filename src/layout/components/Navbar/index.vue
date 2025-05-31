<template>
  <div class="h-full flex items-center justify-between px-4">
    <div>顶部导航栏</div>
    <div class="flex flex-1 items-center justify-end gap-4">
      <DarkModeSelect />
      <FullScreen />
      <el-avatar v-loading="isLoading" :src="userInfo?.avatar">
        <IMdiUser class="text-size-lg" />
      </el-avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userApi } from '@/api'

const { isLoading, state: userInfo } = useAsyncState(userApi.getUserInfo, null)
</script>
